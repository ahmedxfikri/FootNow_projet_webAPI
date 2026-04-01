<?php
/*Auteur: Soukaina Moussalli*/
require_once("auth_check.php"); ?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Classement FIFA</title>

<link rel="stylesheet" href="/css/style.css">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600&display=swap" rel="stylesheet">
</head>

<body>

<video autoplay muted loop id="bg-video">
  <source src="/assets/videos/bg.mp4" type="video/mp4">
</video>

<header class="main-header">
  <div class="logo">
    <img src="/assets/images/logo.png">
  </div>

  <div class="main-title">FOOTNOW</div>

  <div class="user-icon" onclick="toggleMenu()">⚽</div>
</header>

<div id="user-menu" class="user-menu">
  <p>👋 Bonjour <?php echo $_SESSION['user_email']; ?></p>
  <a href="favorites.php">❤️ Favoris</a>
  <a href="profile.php">👤 Mon profil</a>
  <a href="logout.php">🚪 Déconnexion</a>
</div>

<nav class="main-menu">
  <a href="index.php">Accueil</a>
  <a href="ranking.php">Classement équipes</a>
  <a href="history.php">Historique matchs</a>
  <a href="groups.php">Groupes CDM26</a>
  <a href="proba.php">Probabilités 2026</a>
  <a href="prediction.php">Prédictions</a>
  <a href="news.php">Actualité</a>
</nav>

<section class="home-content">
  <h1 class="glow-title">CLASSEMENT MONDIAL FIFA</h1>
</section>

<div class="ranking-container">
    <p>Chargement du classement...</p>
</div>

<script src="/js/app.js"></script>

<footer class="footer">
  <p>© 2026 FOOTNOW - Tous droits réservés</p>

  <div class="footer-links">
    <a href="privacy.php">Politique de confidentialité</a>
    <a href="cookies.php">Cookies</a>
    <a href="terms.php">Conditions d'utilisation</a>
  </div>
</footer>

</body>
</html>