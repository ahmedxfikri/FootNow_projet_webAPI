<?php
require_once "config.php";

header('Content-Type: application/json; charset=utf-8');

$apiBaseUrl = preg_replace('#/api/?$#', '', API_PUBLIC_URL);
if (!is_string($apiBaseUrl) || $apiBaseUrl === '') {
    $apiBaseUrl = '';
}

echo json_encode([
    'apiBaseUrl' => rtrim($apiBaseUrl, '/')
]);
