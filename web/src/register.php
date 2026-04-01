<?php
session_start();
require_once "config.php";

$success = false;
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $apiMeta = [];

    $response = callAPI('/register', 'POST', [
        'login' => $email,
        'password' => $password
    ], null, $apiMeta);

    if ($response && isset($response['user'])) {
        $_SESSION['registered_created_at'] = date('c');
        $success = true;
    } elseif (!empty($apiMeta['transport_error']) || (int)($apiMeta['http_code'] ?? 0) === 0) {
        $error = "API inaccessible pour le moment. Verifie que le service API est demarre.";
    } elseif (!empty($apiMeta['api_error'])) {
        $error = $apiMeta['api_error'];
    } else {
        $error = "Impossible de creer le compte.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inscription</title>

<link rel="stylesheet" href="/css/style.css">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
</head>

<body class="auth-body">

<div class="auth-container">

    <div class="auth-left">
        <h1>FOOTNOW</h1>
        <p>Rejoins la plateforme et commence à prédire les matchs.</p>
    </div>

    <div class="auth-form">

        <h2>Inscription</h2>

        <?php if ($error): ?>
            <p class="error"><?php echo $error; ?></p>
        <?php endif; ?>

        <?php if ($success): ?>
            <p class="success">Compte créé avec succès</p>
            <a href="login.php"><button>Se connecter</button></a>
        <?php else: ?>

        <form method="POST">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Mot de passe" required>

            <button>S'inscrire</button>
        </form>

        <p>Déjà un compte ? <a href="login.php">Connexion</a></p>

        <?php endif; ?>

    </div>

</div>

</body>
</html>


