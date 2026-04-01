/*Auteur: Soukaina Moussalli*/
<?php
// URL interne au réseau Docker pour que le container PHP parle au container API
define('API_URL', 'http://api:3070/api'); 

// URL publique (utile pour les redirections si besoin, ou JS)
define('PUBLIC_URL', 'http://localhost:8080');

// Fonction pour appeler l'API
function callAPI($endpoint, $method = 'GET', $data = null, $token = null) {
    $url = API_URL . $endpoint;
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        }
    }
    
    if ($token) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $token]);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return json_decode($response, true);
    }
    
    return null;
}
?>