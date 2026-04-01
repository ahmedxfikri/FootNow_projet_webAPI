<?php
/*Auteur: Soukaina Moussalli*/
require_once("auth_check.php"); ?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>FOOTNOW - Actualité</title>

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

  <h1 class="glow-title">📰 Actualité Coupe du Monde 2026</h1>

  <div class="news-container">

    <!-- Article 1 -->
    <article class="news-item">
      <div class="news-date">31 Mars 2026</div>
      <h2>Derniers préparatifs avant le coup d'envoi</h2>
      <p>
        Les 32 équipes qualifiées finalisent leurs préparatifs pour le tournoi qui débute le 11 juin 2026 ! 
        Entraînements intensifs, analyses tactiques et revues d'effectifs sont au programme pour les sélectionneurs. 
        La France, l'Argentine, le Brésil et l'Allemagne sont parmi les favoris.
      </p>
    </article>

    <!-- Article 2 -->
    <article class="news-item">
      <div class="news-date">28 Mars 2026</div>
      <h2>Groupe A : France vs Argentine en ouverture ?</h2>
      <p>
        Selon les organisateurs, le match d'ouverture mettrait aux prises la France et l'Argentine le 11 juin. 
        Un affrontement électrisant en perspective ! Les deux meilleures équipes du classement FIFA s'opposeront 
        devant 70 000 spectateurs au stade inaugural.
      </p>
    </article>

    <!-- Article 3 -->
    <article class="news-item">
      <div class="news-date">25 Mars 2026</div>
      <h2>Révolution technologique : VAR ultra-amélioré</h2>
      <p>
        La Coupe du Monde 2026 saura l'occasion de tester une nouvelle version de la VAR avec une latence réduite 
        à 5 secondes seulement. Cette technologie permettra des décisions plus rapides et plus précises sur les 
        penaltys et les hors-jeu contentieux.
      </p>
    </article>

    <!-- Article 4 -->
    <article class="news-item">
      <div class="news-date">22 Mars 2026</div>
      <h2>Brésil : Neymar de retour pour le tournoi</h2>
      <p>
        Bonne nouvelle pour la Seleção ! Neymar a confirmé sa participation à la Coupe du Monde 2026 après 
        sa rémise d'une blessure musculaire. Le champion brésilien pourrait être l'atout majeur de son équipe 
        pour conquérir un troisième titre mondial.
      </p>
    </article>

    <!-- Article 5 -->
    <article class="news-item">
      <div class="news-date">20 Mars 2026</div>
      <h2>Angleterre : Kane fait ses adieux ?</h2>
      <p>
        Harry Kane, capitaine des Three Lions, pourrait faire de la Coupe du Monde 2026 son dernier tournoi international. 
        À 32 ans, le buteur légendaire vise ce titre qui lui manque encore pour parfaire sa carrière glorieuse.
      </p>
    </article>

    <!-- Article 6 -->
    <article class="news-item">
      <div class="news-date">18 Mars 2026</div>
      <h2>Stades exceptionnels prêts à accueillir le monde</h2>
      <p>
        Les 12 stades du tournoi (USA, Canada, Mexique) sont maintenant finalisés et prêts à recevoir les supporters 
        du monde entier. Capacités augmentées et infrastructures modernes promettent un spectacle inoubliable pour 
        les fans de football.
      </p>
    </article>

    <!-- Article 7 -->
    <article class="news-item">
      <div class="news-date">15 Mars 2026</div>
      <h2>Espagne : La nouvelle génération au rendez-vous</h2>
      <p>
        La Roja prépare une succession en douceur avec l'émergence de jeunes talents comme Pedri et Gavi. 
        À 20 et 21 ans, ces deux prodiges du Barça pourraient bien être les futurs piliers de la sélection espagnole 
        pendant la prochaine décennie.
      </p>
    </article>

    <!-- Article 8 -->
    <article class="news-item">
      <div class="news-date">12 Mars 2026</div>
      <h2>Italie absente : La Squadra Azzurra ne sera pas du voyage</h2>
      <p>
        C'est officiel : l'Italie ne se qualifiera pas pour la Coupe du Monde 2026. Après des années de domination, 
        la Nazionale doit accepter cette absence humiliante et revoir son projet pour les prochaines années.
      </p>
    </article>

  </div>

  <p class="small-text">Dernière mise à jour : 31 mars 2026</p>

</section>

<script src="/js/app.js"></script>

<footer class="footer">

  <p>© 2026 FOOTNOW - Tous droits réservés</p>

  <div class="footer-links">
    <a href="privacy.php">Politique de confidentialité</a>
    <a href="cookies.php">Cookies</a>
    <a href="terms.php">Conditions d'utilisation</a>
  </div>

</footer>

<style>
.glow-title {
  color: #fff;
  text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700, 0 0 40px #ffd700;
  font-weight: bold;
  letter-spacing: 2px;
}

.news-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px 0;
}

.news-item {
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #ffd700;
  padding: 20px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-item:hover {
  transform: translateX(5px);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.news-date {
  color: #ffd700;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.news-item h2 {
  color: #fff;
  font-size: 18px;
  margin: 10px 0;
  font-family: 'Bebas Neue', cursive;
}

.news-item p {
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}
</style>

</body>
</html>