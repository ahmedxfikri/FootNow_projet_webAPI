<?php require_once("auth_check.php"); ?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>bujayna</title>

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

  <div class="logo">
    <img src="/assets/images/logo.png" alt="logo">
  </div>

  <div class="main-title">
    FOOTNOW
  </div>

  <div class="user-icon" onclick="toggleMenu()"></div>

</header>

<div id="user-menu" class="user-menu">
  <p>Bonjour <?php echo $_SESSION['user_email']; ?></p>
  <a href="favorites.php">Favoris</a>
  <a href="profile.php">Mon profil</a>
  <a href="logout.php">Deconnexion</a>
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

<!-- COUNTDOWN -->
<div class="countdown">
  <div class="time-box">
    <span id="days">0</span>
    <p>Jours</p>
  </div>
  <div class="time-box">
    <span id="hours">0</span>
    <p>Heures</p>
  </div>
  <div class="time-box">
    <span id="minutes">0</span>
    <p>Minutes</p>
  </div>
  <div class="time-box">
    <span id="seconds">0</span>
    <p>Secondes</p>
  </div>
</div>

<section class="home-content">

  <h1 class="glow-title">Bienvenue sur FOOTNOW</h1>

  <p>
    La plateforme ultime pour analyser les performances des équipes,
    suivre les matchs et prédire les résultats avec précision.
  </p>

  <h2 class="section-title">Prochains matchs</h2>

  <div class="matches-preview">

    <div class="match-card">
      <span>🇧🇷 Brésil</span> vs <span>🇲🇦 Maroc</span>
      <p>12 Juin 2026</p>
    </div>

    <div class="match-card">
      <span>🇫🇷 France</span> vs <span>🇦🇷 Argentine</span>
      <p>14 Juin 2026</p>
    </div>

    <div class="match-card">
      <span>🇪🇸 Espagne</span> vs <span>🇩🇪 Allemagne</span>
      <p>15 Juin 2026</p>
    </div>

  </div>

  <div class="features">

    <div class="feature">
      <h3>Analyse des équipes</h3>
      <p>Compare classement FIFA, forme récente et dynamique de tournoi</p>
    </div>

    <div class="feature">
      <h3>Données historiques</h3>
      <p>Exploitation des résultats passés pour révéler les tendances</p>
    </div>

    <div class="feature">
      <h3>Prédictions intelligentes</h3>
      <p>Prédictions grâce aux probabilités</p>
    </div>

  </div>

</section>

<footer class="footer">
  <p>©️ 2026 FOOTNOW - Tous droits réservés</p>

  <div class="footer-links">
    <a href="privacy.php">Politique de confidentialité</a>
    <a href="cookies.php">Cookies</a>
    <a href="terms.php">Conditions d'utilisation</a>
    <a href="data-manager.php">Gerer les donnees</a>
  </div>
</footer>

<script src="/js/app.js"></script>

</body>
</html>