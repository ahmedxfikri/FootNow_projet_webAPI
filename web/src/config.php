<?php
// URL interne au réseau Docker pour que le container PHP parle au container API
define('API_URL', 'http://api:3070/api'); 

// URL publique (utile pour les redirections si besoin, ou JS)
define('PUBLIC_URL', 'http://localhost:8080');

// Fonction pour appeler l'API
function callAPI($endpoint, $method = 'GET', $data = null, $token = null, &$meta = null) {
    $url = API_URL . $endpoint;

    $meta = [
        'ok' => false,
        'http_code' => 0,
        'transport_error' => false,
        'error' => null,
        'api_error' => null
    ];
    
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

    $meta['http_code'] = (int)$httpCode;
    
    if ($response === false) {
        $meta['transport_error'] = true;
        $meta['error'] = $curlError ?: 'API inaccessible';
        return null;
    }

    $decoded = json_decode($response, true);

    if ($httpCode >= 200 && $httpCode < 300) {
        $meta['ok'] = true;
        return is_array($decoded) ? $decoded : [];
    }

    if (is_array($decoded) && isset($decoded['error'])) {
        $meta['api_error'] = (string)$decoded['error'];
        $meta['error'] = (string)$decoded['error'];
    } else {
        $meta['error'] = 'Erreur API';
    }

    return null;
}
?>