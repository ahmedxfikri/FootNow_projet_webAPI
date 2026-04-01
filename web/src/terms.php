<?php
/*Auteur: Soukaina Moussalli*/
require_once("auth_check.php"); ?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>FOOTNOW - Conditions d'utilisation</title>

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

<!-- CONTENT -->
<section class="home-content terms-content">

  <h1 class="glow-title">Conditions d'utilisation</h1>

  <p>Bienvenue sur FOOTNOW. En utilisant ce site, vous acceptez les présentes conditions d'utilisation. Ces conditions encadrent l'accès et l'utilisation de nos services, des fonctionnalités de visualisation des classements, des statistiques et des prédictions aux contenus interactifs.</p>

  <h2>1. Accès et compte</h2>
  <p>L'accès est réservé aux utilisateurs inscrits. Vos identifiants sont personnels. Toute utilisation non autorisée peut entraîner la suspension de votre compte.</p>

  <h2>2. Contenu et responsabilité</h2>
  <p>Nous fournissons des données et des prévisions à titre indicatif. Les résultats réels peuvent varier. FOOTNOW ne saurait être tenu responsable des décisions prises à partir des informations affichées.</p>

  <h2>3. Propriété intellectuelle</h2>
  <p>Toutes les marques, logos, données et contenus sont protégés par le droit d'auteur. Vous pouvez utiliser les informations pour un usage personnel uniquement.</p>

  <h2>4. Respect des lois</h2>
  <p>Vous vous engagez à ne pas porter atteinte aux droits de tiers, à ne pas perturber le service et à ne pas publier de contenus illégaux ou offensants.</p>

  <h2>5. Données personnelles</h2>
  <p>Vos données sont traitées conformément à notre politique de confidentialité (<a href="privacy.php">voir la politique de confidentialité</a>).</p>

  <h2>6. Modifications</h2>
  <p>FOOTNOW peut modifier ces conditions à tout moment. Les modifications sont effectives dès la publication sur ce site.</p>

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