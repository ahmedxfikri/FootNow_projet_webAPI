<?php
// Detection du contexte d'URL cote client
$basePath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));

if ($basePath === '/') {
    $basePath = '';
}

define('BASE_URL', $_SERVER['SCRIPT_NAME']);
define('BASE_PATH', $basePath);

$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$hostNoPort = preg_replace('/:\\d+$/', '', $host);

$isLocalHost =
    strpos($host, 'localhost') !== false ||
    strpos($host, '127.0.0.1') !== false;

if ($isLocalHost) {
    define('BASE_URL_API', 'http://localhost:3070/api');
} else {
    define('BASE_URL_API', 'https://' . $hostNoPort . '/api');
}

// URL interne au réseau Docker pour que le container PHP parle au container API
$apiInternalUrl = getenv('API_INTERNAL_URL');
if ($apiInternalUrl) {
    define('API_URL', $apiInternalUrl);
} elseif ($isLocalHost) {
    define('API_URL', 'http://api:3070/api');
} else {
    define('API_URL', BASE_URL_API);
}

// URL publique (utile pour les redirections si besoin, ou JS)
define('PUBLIC_URL', $scheme . '://' . $host . BASE_PATH);
define('API_PUBLIC_URL', BASE_URL_API);

// Fonction pour appeler l'API
function callAPI($endpoint, $method = 'GET', $data = null, $token = null, &$meta = null) {
    $meta = [
        'ok' => false,
        'http_code' => 0,
        'transport_error' => false,
        'error' => null,
        'api_error' => null
    ];

    $candidateBases = array_values(array_unique(array_filter([
        API_URL,
        API_PUBLIC_URL,
        ($GLOBALS['isLocalHost'] ?? false) ? 'http://localhost:3070/api' : null
    ])));

    $lastResponse = null;
    $lastCurlError = null;
    $lastDecoded = null;

    foreach ($candidateBases as $candidateBase) {
        $url = rtrim($candidateBase, '/') . $endpoint;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $headers = [];

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data !== null) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                $headers[] = 'Content-Type: application/json';
            }
        }

        if ($token) {
            $headers[] = 'Authorization: Bearer ' . $token;
        }

        if (!empty($headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }

        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $lastResponse = $response;
        $lastCurlError = $curlError;
        $lastDecoded = is_string($response) ? json_decode($response, true) : null;

        $meta['http_code'] = (int)$httpCode;

        if ($response !== false && $httpCode >= 200 && $httpCode < 300) {
            $meta['ok'] = true;
            return is_array($lastDecoded) ? $lastDecoded : [];
        }

        $shouldRetry = ($response === false) || in_array((int)$httpCode, [0, 404, 500, 502, 503, 504], true);
        if ($shouldRetry && $candidateBase !== end($candidateBases)) {
            continue;
        }

        if ($response === false) {
            $meta['transport_error'] = true;
            $meta['error'] = $curlError ?: 'API inaccessible';
            continue;
        }

        if (is_array($lastDecoded) && isset($lastDecoded['error'])) {
            $meta['api_error'] = (string)$lastDecoded['error'];
            $meta['error'] = (string)$lastDecoded['error'];
        } else {
            $meta['error'] = 'Erreur API';
        }
    }

    if ($meta['error'] === null) {
        $meta['error'] = $lastCurlError ?: 'API inaccessible';
    }

    return null;
}
?>