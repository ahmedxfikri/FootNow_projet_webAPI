-- SAE BUT2 2026
-- Fonctions PL/pgSQL - Calcul des predictions
-- Projet prediction Cdm 2026
-- Auteur : Ahmed Fikri


-- =====================================================
-- FONCTION 1 : Score FIFA normalise
-- =====================================================

CREATE OR REPLACE FUNCTION get_score_fifa(p_equipe VARCHAR)
RETURNS NUMERIC AS $$
DECLARE
    v_points NUMERIC;
    v_max    NUMERIC;
    v_min    NUMERIC;
BEGIN
    SELECT points_fifa INTO v_points
    FROM equipe
    WHERE nom = p_equipe;

    SELECT MAX(points_fifa) INTO v_max FROM equipe;
    SELECT MIN(points_fifa) INTO v_min FROM equipe;

    IF v_points IS NULL THEN
        RETURN 0.5;
    END IF;

    IF v_max = v_min THEN
        RETURN 0.5;
    END IF;

    RETURN (v_points - v_min) / (v_max - v_min);
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- FONCTION 2 : Score face a face
-- Retourne un score entre 0 et 1 base sur l historique
-- des confrontations entre deux equipes
-- =====================================================

CREATE OR REPLACE FUNCTION get_score_h2h(p_eq1 VARCHAR, p_eq2 VARCHAR)
RETURNS NUMERIC AS $$
DECLARE
    v_victoires_eq1 INT := 0;
    v_victoires_eq2 INT := 0;
    v_nuls          INT := 0;
    v_total         INT := 0;
BEGIN
    SELECT
        SUM(CASE
                WHEN (equipe1 = p_eq1 AND score1 > score2)
                  OR (equipe2 = p_eq1 AND score2 > score1) THEN 1
                ELSE 0
            END),
        SUM(CASE
                WHEN (equipe1 = p_eq2 AND score1 > score2)
                  OR (equipe2 = p_eq2 AND score2 > score1) THEN 1
                ELSE 0
            END),
        SUM(CASE
                WHEN score1 = score2 THEN 1
                ELSE 0
            END),
        COUNT(*)
    INTO v_victoires_eq1, v_victoires_eq2, v_nuls, v_total
    FROM match_historique
    WHERE (equipe1 = p_eq1 AND equipe2 = p_eq2)
       OR (equipe1 = p_eq2 AND equipe2 = p_eq1);

    IF v_total = 0 THEN
        RETURN 0.5;
    END IF;

    RETURN ROUND(v_victoires_eq1::NUMERIC / v_total, 4);
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- FONCTION 3 : Forme recente
-- Retourne un score entre 0 et 1 base sur les
-- 10 derniers matchs d une equipe
-- =====================================================

CREATE OR REPLACE FUNCTION get_forme_recente(p_equipe VARCHAR)
RETURNS NUMERIC AS $$
DECLARE
    v_points_form  NUMERIC := 0;
    v_total_matchs INT     := 0;
    rec            RECORD;
BEGIN
    FOR rec IN (
        SELECT
            CASE
                WHEN (equipe1 = p_equipe AND score1 > score2) THEN 3
                WHEN (equipe2 = p_equipe AND score2 > score1) THEN 3
                WHEN score1 = score2 THEN 1
                ELSE 0
            END AS pts
        FROM match_historique
        WHERE equipe1 = p_equipe OR equipe2 = p_equipe
        ORDER BY date_match DESC
        LIMIT 10
    )
    LOOP
        v_points_form  := v_points_form + rec.pts;
        v_total_matchs := v_total_matchs + 1;
    END LOOP;

    IF v_total_matchs = 0 THEN
        RETURN 0.5;
    END IF;

    RETURN ROUND(v_points_form / (v_total_matchs * 3.0), 4);
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- FONCTION 4 : Calcul prediction d un match
-- Combine les 3 scores avec ponderation :
--   40% FIFA + 40% face-a-face + 20% forme recente
-- Insere ou met a jour la prediction dans la table
-- =====================================================

CREATE OR REPLACE FUNCTION calculer_prediction(p_id_match_wc INT)
RETURNS VOID AS $$
DECLARE
    v_eq_dom     VARCHAR;
    v_eq_ext     VARCHAR;
    v_fifa_dom   NUMERIC;
    v_fifa_ext   NUMERIC;
    v_h2h_dom    NUMERIC;
    v_forme_dom  NUMERIC;
    v_forme_ext  NUMERIC;
    v_force_dom  NUMERIC;
    v_force_ext  NUMERIC;
    v_total      NUMERIC;
    v_ecart      NUMERIC;
    v_proba_dom  NUMERIC;
    v_proba_ext  NUMERIC;
    v_proba_nul  NUMERIC;
    v_nul_base   NUMERIC := 0.25; -- 25% de base pour le nul
BEGIN
    SELECT equipe_dom, equipe_ext
    INTO v_eq_dom, v_eq_ext
    FROM match_cdm2026
    WHERE id_match_wc = p_id_match_wc;

    IF v_eq_dom IS NULL OR v_eq_ext IS NULL THEN
        RETURN;
    END IF;

    IF v_eq_dom = 'To be announced' OR v_eq_ext = 'To be announced' THEN
        RETURN;
    END IF;

    v_fifa_dom  := get_score_fifa(v_eq_dom);
    v_fifa_ext  := get_score_fifa(v_eq_ext);
    v_h2h_dom   := get_score_h2h(v_eq_dom, v_eq_ext);
    v_forme_dom := get_forme_recente(v_eq_dom);
    v_forme_ext := get_forme_recente(v_eq_ext);

    v_force_dom := (0.40 * v_fifa_dom) + (0.40 * v_h2h_dom) + (0.20 * v_forme_dom);
    v_force_ext := (0.40 * v_fifa_ext) + (0.40 * (1 - v_h2h_dom)) + (0.20 * v_forme_ext);

    v_total := v_force_dom + v_force_ext;

    IF v_total = 0 THEN
        v_total := 1;
    END IF;

    -- Calcul du taux de nul dynamique
    v_ecart     := ABS(v_force_dom - v_force_ext);
    v_proba_nul := ROUND(v_nul_base * (1 - v_ecart) * 100, 2);

    -- Répartition des probabilités
    v_proba_dom := ROUND((v_force_dom / v_total) * (100 - v_proba_nul), 2);
    v_proba_ext := ROUND((v_force_ext / v_total) * (100 - v_proba_nul), 2);

    -- Ajustement pour arriver à 100%
    IF v_proba_dom + v_proba_ext + v_proba_nul != 100 THEN
        v_proba_dom := v_proba_dom + (100 - (v_proba_dom + v_proba_ext + v_proba_nul));
    END IF;

    INSERT INTO prediction (
        id_match_wc,
        proba_dom,
        proba_nul,
        proba_ext,
        date_calcul
    )
    VALUES (
        p_id_match_wc,
        v_proba_dom,
        v_proba_nul,
        v_proba_ext,
        NOW()
    )
    ON CONFLICT (id_match_wc)
    DO UPDATE SET
        proba_dom   = EXCLUDED.proba_dom,
        proba_nul   = EXCLUDED.proba_nul,
        proba_ext   = EXCLUDED.proba_ext,
        date_calcul = NOW();
END;
$$ LANGUAGE plpgsql;


-- FONCTION 5 : Calculer toutes les predictions
-- Lance le calcul pour tous les matchs de la CdM 2026

CREATE OR REPLACE FUNCTION calculer_toutes_predictions()
RETURNS VOID AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN SELECT id_match_wc FROM match_cdm2026
    LOOP
        PERFORM calculer_prediction(rec.id_match_wc);
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- EXECUTION : Generer toutes les predictions initiales

SELECT calculer_toutes_predictions();