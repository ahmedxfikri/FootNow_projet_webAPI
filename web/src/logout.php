<?php
require_once "config.php";

if (session_status() !== PHP_SESSION_ACTIVE) {
	session_start();
}

if (!empty($_SESSION['user_token'])) {
	// Tentative de desactivation du token cote API (non bloquante)
	callAPI('/logout', 'POST', [], $_SESSION['user_token']);
}

$_SESSION = [];
session_destroy();

header('Location: /login.php');
exit();