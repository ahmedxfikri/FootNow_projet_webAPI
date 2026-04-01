<?php
/*Auteur: Soukaina Moussalli*/
require_once("auth_check.php"); ?>

<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Prédictions</title>

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

<div class="predictions-page">

    <section class="home-content">
      <h1 class="glow-title">⚽ PRÉDICTIONS DES MATCHS ⚽</h1>
    </section>

    <div class="predictions-container">
        <?php
        require_once "config.php";
        $predictions = callAPI('/predictions');

        if ($predictions && isset($predictions['predictions']) && count($predictions['predictions']) > 0):
        ?>
        <table class="predictions-table">
            <thead>
                <tr>
                    <th>🏆 Match</th>
                    <th>🏠 Victoire Domicile</th>
                    <th>🤝 Match Nul</th>
                    <th>✈️ Victoire Extérieur</th>
                    <th>📅 Date Calcul</th>
                </tr>
            </thead>
            <tbody>
            <?php
            $totalMatchs = count($predictions['predictions']);
            $favorisDom  = 0;
            $favorisExt  = 0;
            $matchsNuls  = 0;

            foreach ($predictions['predictions'] as $p):
                $probaDom = floatval($p['proba_dom'] ?? 0);
                $probaNul = floatval($p['proba_nul'] ?? 0);
                $probaExt = floatval($p['proba_ext'] ?? 0);

                if ($probaDom > $probaExt && $probaDom > $probaNul)      $favorisDom++;
                elseif ($probaExt > $probaDom && $probaExt > $probaNul)  $favorisExt++;
                else                                                       $matchsNuls++;

                $domClass = $probaDom > 50 ? 'high' : ($probaDom > 30 ? 'medium' : 'low');
                $nulClass = $probaNul > 33 ? 'high' : ($probaNul > 20 ? 'medium' : 'low');
                $extClass = $probaExt > 50 ? 'high' : ($probaExt > 30 ? 'medium' : 'low');
            ?>
            <tr>
                <td>
                    <?php
                    echo htmlspecialchars($p['equipe_dom'] . ' vs ' . $p['equipe_ext']);
                    if ($probaDom > 50 || $probaExt > 50):
                    ?>
                    <span class="favorite-badge">⭐ FAVORI</span>
                    <?php endif; ?>
                </td>
                <td class="proba-cell <?php echo $domClass; ?>">
                    <div class="proba-bar-container">
                        <?php echo number_format($probaDom, 1); ?>%
                        <div class="proba-bar">
                            <div class="proba-bar-fill dom" style="width: <?php echo $probaDom; ?>%"></div>
                        </div>
                    </div>
                </td>
                <td class="proba-cell <?php echo $nulClass; ?>">
                    <div class="proba-bar-container">
                        <?php echo number_format($probaNul, 1); ?>%
                        <div class="proba-bar">
                            <div class="proba-bar-fill nul" style="width: <?php echo $probaNul; ?>%"></div>
                        </div>
                    </div>
                </td>
                <td class="proba-cell <?php echo $extClass; ?>">
                    <div class="proba-bar-container">
                        <?php echo number_format($probaExt, 1); ?>%
                        <div class="proba-bar">
                            <div class="proba-bar-fill ext" style="width: <?php echo $probaExt; ?>%"></div>
                        </div>
                    </div>
                </td>
                <td><?php echo date('d/m/Y H:i', strtotime($p['date_calcul'] ?? 'now')); ?></td>
            </tr>
            <?php endforeach; ?>
            </tbody>
        </table>

        <div class="predictions-stats">
            <div class="stat-card">
                <h4>📊 TOTAL MATCHS</h4>
                <div class="stat-value"><?php echo $totalMatchs; ?></div>
            </div>
            <div class="stat-card">
                <h4>🏠 FAVORIS DOMICILE</h4>
                <div class="stat-value"><?php echo $favorisDom; ?></div>
                <div class="stat-label"><?php echo round($favorisDom / $totalMatchs * 100, 1); ?>%</div>
            </div>
            <div class="stat-card">
                <h4>✈️ FAVORIS EXTÉRIEUR</h4>
                <div class="stat-value"><?php echo $favorisExt; ?></div>
                <div class="stat-label"><?php echo round($favorisExt / $totalMatchs * 100, 1); ?>%</div>
            </div>
            <div class="stat-card">
                <h4>🤝 MATCHS ÉQUILIBRÉS</h4>
                <div class="stat-value"><?php echo $matchsNuls; ?></div>
                <div class="stat-label">Nul > 33%</div>
            </div>
        </div>

        <?php else: ?>
        <div class="no-predictions">
            <p>❌ Aucune prédiction trouvée.</p>
            <p>Vérifiez que le seed a bien été exécuté et que l'API est accessible.</p>
            <code>docker compose exec api npx prisma db seed</code>
        </div>
        <?php endif; ?>
    </div>

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