<?php
session_start();
require_once "config.php";

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $apiMeta = [];

    $response = callAPI('/login', 'POST', [
        'login' => $email,
        'password' => $password
    ], null, $apiMeta);

    if ($response && isset($response['token'])) {
        $_SESSION['user_token'] = $response['token'];
        $_SESSION['user_email'] = $response['user']['login'] ?? $email;
        if (!isset($_SESSION['user_created_at'])) {
            $_SESSION['user_created_at'] = date('c');
        }
        header("Location: index.php");
        exit();
    } elseif (!empty($apiMeta['transport_error']) || (int)($apiMeta['http_code'] ?? 0) === 0) {
        $error = "API inaccessible pour le moment. Verifie que le service API est demarre.";
    } else {
        $error = $apiMeta['error'] ?? "Identifiants incorrects";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Connexion</title>

<link rel="stylesheet" href="/css/style.css">

<!-- FONT SPORT -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
</head>

<body class="auth-body">

<div class="auth-container">

    <div class="auth-left">
        <h1>FOOTNOW</h1>
        <p>Le meilleur site pour analyser les matchs et prédire les résultats de la Coupe du Monde.</p>
    </div>

    <div class="auth-form">

        <h2>Connexion</h2>

        <?php if ($error): ?>
        <p class="error"><?php echo $error; ?></p>
        <?php endif; ?>

        <form method="POST">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Mot de passe" required>

            <button>Se connecter</button>
        </form>

        <p>Pas encore de compte ? <a href="register.php">Créer un compte</a></p>

    </div>

</div>

</body>
</html>


