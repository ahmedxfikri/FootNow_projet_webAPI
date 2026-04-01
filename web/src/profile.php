<?php
/*Auteur: Soukaina Moussalli*/
require_once("auth_check.php"); ?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>FOOTNOW - Mon Profil</title>

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

  <h1 class="glow-title">Mon Profil</h1>

  <div class="profile-info">
    <div class="profile-field">
      <label>Email :</label>
      <span><?php echo htmlspecialchars($_SESSION['user_email']); ?></span>
    </div>

    <div class="profile-field">
      <label>Statut :</label>
      <span>Utilisateur connecté</span>
    </div>

    <div class="profile-field">
      <label>Date d'inscription :</label>
      <span><?php echo date('d/m/Y', strtotime($_SESSION['user_created_at'] ?? '2026-01-01')); ?></span>
    </div>

    <div class="profile-field">
      <label>Équipes favorites :</label>
      <span id="favorites-count">0</span>
    </div>
  </div>

  <div class="profile-actions">
    <button onclick="clearFavorites()" class="btn-secondary">Vider mes favoris</button>
    <button onclick="exportProfile()" class="btn-secondary">Exporter mes données</button>
  </div>

  <p class="small-text">Date de mise à jour : 31 mars 2026</p>

</section>

<script src="/js/app.js"></script>
<script>
function clearFavorites() {
  if (confirm('Êtes-vous sûr de vouloir vider tous vos favoris ?')) {
    localStorage.removeItem('favorites');
    updateFavoritesCount();
    alert('Favoris vidés avec succès.');
  }
}

function exportProfile() {
  const profileData = {
    email: '<?php echo $_SESSION['user_email']; ?>',
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    exportDate: new Date().toISOString()
  };

  const dataStr = JSON.stringify(profileData, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});

  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'footnow-profile.json';
  link.click();
}

function updateFavoritesCount() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  document.getElementById('favorites-count').textContent = favorites.length;
}

document.addEventListener('DOMContentLoaded', updateFavoritesCount);
</script>

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