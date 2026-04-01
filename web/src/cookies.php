<?php
/*Auteur: Soukaina Moussalli*/
require_once("auth_check.php"); ?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>FOOTNOW - Cookies</title>

<link rel="stylesheet" href="/css/style.css">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600&display=swap" rel="stylesheet">
</head>

<body>

<!-- VIDEO BACKGROUND -->
<video autoplay muted loop id="bg-video">
  <source src="/assets/videos/bg.mp4" type="video/mp4">
</video>

<!-- HEADER -->
<header class="main-header">

  <!-- LOGO IMAGE -->
  <div class="logo">
    <img src="/assets/images/logo.png" alt="logo">
  </div>

  <!-- TITRE -->
  <div class="main-title">
    FOOTNOW
  </div>

  <!-- USER ICON -->
  <div class="user-icon" onclick="toggleMenu()">
    ⚽
  </div>

</header>

<!-- MENU USER (hidden) -->
<div id="user-menu" class="user-menu">
  <p>👋 Bonjour <?php echo $_SESSION['user_email']; ?></p>
  <a href="favorites.php">❤️ Favoris</a>
  <a href="profile.php">👤 Mon profil</a>
  <a href="logout.php">🚪 Déconnexion</a>
</div>

<!-- MENU -->
<nav class="main-menu">
  <a href="index.php">Accueil</a>
  <a href="ranking.php">Classement équipes</a>
  <a href="history.php">Historique matchs</a>
  <a href="groups.php">Groupes CDM26</a>
  <a href="proba.php">Probabilités 2026</a>
  <a href="prediction.php">Prédictions</a>
  <a href="news.php">Actualité</a>
</nav>

<section class="home-content terms-content">

  <h1 class="glow-title">Cookies</h1>

  <p>FOOTNOW utilise des cookies pour rendre le site fonctionnel et améliorer l’expérience utilisateur. Ces cookies sont anonymes, sauf si vous acceptez des fonctionnalités avancées.</p>

  <h2>1. Cookies strictement nécessaires</h2>
  <p>Essentiels pour l’authentification et les préférences de navigation.</p>

  <h2>2. Cookies de performance</h2>
  <p>Collectent des données agrégées pour améliorer la vitesse et la stabilité du site.</p>

  <h2>3. Cookies fonctionnels</h2>
  <p>Permettent des options comme la conservation de session et la personnalisation.</p>

  <h2>4. Cookies tiers</h2>
  <p>Utilisés pour l’analyse (Google Analytics) et les intégrations externes. Ces services sont décrits dans notre politique de confidentialité.</p>

  <p class="small-text">Date de mise à jour : 31 mars 2026</p>

</section>

<script src="/js/app.js"></script>

<style>
.glow-title {
  color: #fff;
  text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700, 0 0 40px #ffd700;
  font-weight: bold;
  letter-spacing: 2px;
}
</style>

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