import { Router } from 'express';
import { parse } from 'csv-parse/sync';
import { prisma } from './client.js';
const router = Router();
const INVALID_TEXT_VALUES = new Set(['', 'NA', 'N/A', 'NULL', 'UNDEFINED']);
function isMeaningfulText(value) {
    if (value === null || value === undefined) {
        return false;
    }
    const normalized = String(value).trim().toUpperCase();
    return normalized.length > 0 && !INVALID_TEXT_VALUES.has(normalized);
}
function toCsv(rows, headers) {
    const escapeCell = (value) => {
        const raw = value === null || value === undefined ? '' : String(value);
        if (/[",\n\r]/.test(raw)) {
            return `"${raw.replace(/"/g, '""')}"`;
        }
        return raw;
    };
    const head = headers.join(',');
    const body = rows
        .map((row) => headers.map((h) => escapeCell(row[h])).join(','))
        .join('\n');
    return `${head}\n${body}`;
}
function normalizeImportRows(target, format, payload) {
    if (format === 'json') {
        if (!Array.isArray(payload)) {
            throw new Error('Pour le format json, "data" doit être un tableau');
        }
        return payload;
    }
    if (typeof payload !== 'string' || !payload.trim()) {
        throw new Error('Pour le format csv, "data" doit être un texte CSV non vide');
    }
    const rows = parse(payload, { columns: true, skip_empty_lines: true, trim: true });
    if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error('Aucune ligne CSV valide trouvée');
    }
    if (target === 'equipes') {
        return rows.map((row) => ({
            nom: row.nom ?? row.Nom ?? row.team ?? row.Team,
            classement: row.classement ?? row.Classement ?? row.ranking ?? row.Ranking,
            points_fifa: row.points_fifa ?? row['points fifa'] ?? row['Points FIFA']
        }));
    }
    return rows.map((row) => ({
        date_match: row.date_match ?? row.date ?? row.Date,
        equipe1: row.equipe1 ?? row.team1 ?? row['Home Team'],
        equipe2: row.equipe2 ?? row.team2 ?? row['Away Team'],
        score1: row.score1 ?? row.scoreteam1,
        score2: row.score2 ?? row.scoreteam2,
        tournoi: row.tournoi ?? row.tournament,
        pays: row.pays ?? row.country
    }));
}
/**
 * GET /api/equipes
 * Retourne le classement des équipes (nom, classement, points FIFA)
 */
router.get('/equipes', async (_req, res) => {
    try {
        const equipes = await prisma.equipe.findMany({
            orderBy: [
                { classement: 'asc' },
                { points_fifa: 'desc' }
            ],
            select: {
                nom: true,
                classement: true,
                points_fifa: true
            }
        });
        res.json({
            total: equipes.length,
            equipes: equipes.map((equipe, index) => ({
                nom: equipe.nom,
                classement: equipe.classement ?? index + 1,
                points_fifa: equipe.points_fifa
            }))
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des équipes',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/matchs-historique
 * Retourne les derniers matchs historiques
 */
router.get('/matchs-historique', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const validHistoriqueWhere = {
            score1: { not: null },
            score2: { not: null },
            equipe1: { notIn: ['', 'NA', 'N/A', 'null', 'NULL', 'undefined', 'UNDEFINED'] },
            equipe2: { notIn: ['', 'NA', 'N/A', 'null', 'NULL', 'undefined', 'UNDEFINED'] }
        };
        const [matchs, total] = await prisma.$transaction([
            prisma.matchHistorique.findMany({
                where: validHistoriqueWhere,
                orderBy: [
                    { date_match: 'desc' },
                    { id_match: 'desc' }
                ],
                skip,
                take: limit,
                select: {
                    date_match: true,
                    equipe1: true,
                    equipe2: true,
                    score1: true,
                    score2: true,
                    tournoi: true,
                    pays: true
                }
            }),
            prisma.matchHistorique.count({ where: validHistoriqueWhere })
        ]);
        res.json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            matchs
        });
    }
    catch (error) {
        console.error('Erreur matchs historiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
/**
 * GET /api/matchs-cdm2026
 * Tous les matchs CDM 2026
 */
router.get('/matchs-cdm2026', async (req, res) => {
    try {
        const matchs = await prisma.matchCdm2026.findMany({
            include: {
                groupe: true,
                predictions: true
            },
            orderBy: { numero: 'asc' }
        });
        res.json({
            total: matchs.length,
            matchs
        });
    }
    catch (error) {
        console.error('Erreur matchs CDM:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
/**
 * GET /api/groupes
 * Retourne la liste des groupes
 */
router.get('/groupes', async (_req, res) => {
    try {
        const groupes = await prisma.groupe.findMany({
            orderBy: { nom: 'asc' },
            select: {
                id_groupe: true,
                nom: true
            }
        });
        res.json({
            total: groupes.length,
            groupes
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des groupes:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des groupes',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * POST /api/equipes
 * Ajoute une equipe
 */
router.post('/equipes', async (req, res) => {
    try {
        const { nom, classement, points_fifa } = req.body ?? {};
        if (!nom || typeof nom !== 'string' || !nom.trim()) {
            return res.status(400).json({ error: 'nom requis' });
        }
        const data = {
            nom: nom.trim()
        };
        if (classement !== undefined && classement !== null) {
            const classementNum = Number(classement);
            if (!Number.isInteger(classementNum) || classementNum <= 0) {
                return res.status(400).json({ error: 'classement doit etre un entier > 0' });
            }
            data.classement = classementNum;
        }
        if (points_fifa !== undefined && points_fifa !== null) {
            const pointsNum = Number(points_fifa);
            if (!Number.isFinite(pointsNum) || pointsNum < 0) {
                return res.status(400).json({ error: 'points_fifa doit etre un nombre >= 0' });
            }
            data.points_fifa = pointsNum;
        }
        const equipe = await prisma.equipe.create({ data });
        return res.status(201).json({ message: 'Equipe creee', equipe });
    }
    catch (error) {
        if (error?.code === 'P2002') {
            return res.status(409).json({ error: 'Cette equipe existe deja' });
        }
        console.error('Erreur creation equipe:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});
/**
 * POST /api/matchs-historique
 * Ajoute un match historique
 */
router.post('/matchs-historique', async (req, res) => {
    try {
        const { date_match, equipe1, equipe2, score1, score2, tournoi, pays } = req.body ?? {};
        if (!equipe1 || !equipe2 || !tournoi || !pays) {
            return res.status(400).json({ error: 'equipe1, equipe2, tournoi et pays requis' });
        }
        const s1 = Number(score1);
        const s2 = Number(score2);
        if (!Number.isInteger(s1) || !Number.isInteger(s2) || s1 < 0 || s2 < 0) {
            return res.status(400).json({ error: 'score1 et score2 doivent etre des entiers >= 0' });
        }
        const match = await prisma.matchHistorique.create({
            data: {
                date_match: date_match ? new Date(date_match) : null,
                equipe1: String(equipe1).trim(),
                equipe2: String(equipe2).trim(),
                score1: s1,
                score2: s2,
                tournoi: String(tournoi).trim(),
                pays: String(pays).trim()
            }
        });
        return res.status(201).json({ message: 'Match historique cree', match });
    }
    catch (error) {
        console.error('Erreur creation match historique:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});
/**
 * POST /api/resultats
 * Ajoute ou met a jour le resultat d'un match CDM 2026
 */
router.post('/resultats', async (req, res) => {
    try {
        const { id_match_wc, score_dom, score_ext } = req.body ?? {};
        const matchId = Number(id_match_wc);
        const sDom = Number(score_dom);
        const sExt = Number(score_ext);
        if (!Number.isInteger(matchId) || matchId <= 0) {
            return res.status(400).json({ error: 'id_match_wc doit etre un entier > 0' });
        }
        if (!Number.isInteger(sDom) || !Number.isInteger(sExt) || sDom < 0 || sExt < 0) {
            return res.status(400).json({ error: 'score_dom et score_ext doivent etre des entiers >= 0' });
        }
        const match = await prisma.matchCdm2026.findUnique({
            where: { id_match_wc: matchId },
            select: { id_match_wc: true }
        });
        if (!match) {
            return res.status(404).json({ error: 'Match non trouve' });
        }
        const resultat = await prisma.resultat.upsert({
            where: { id_match_wc: matchId },
            update: {
                score_dom: sDom,
                score_ext: sExt,
                date_saisie: new Date()
            },
            create: {
                id_match_wc: matchId,
                score_dom: sDom,
                score_ext: sExt
            }
        });
        return res.status(201).json({ message: 'Resultat enregistre', resultat });
    }
    catch (error) {
        console.error('Erreur creation resultat:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});
/**
 * POST /api/import/:target
 * Importe des donnees JSON/CSV dans une table cible
 */
router.post('/import/:target', async (req, res) => {
    try {
        const target = req.params.target;
        const format = req.body?.format || 'json';
        const payload = req.body?.data;
        if (target !== 'equipes' && target !== 'matchs-historique') {
            return res.status(400).json({ error: 'target doit etre equipes ou matchs-historique' });
        }
        if (format !== 'json' && format !== 'csv') {
            return res.status(400).json({ error: 'format doit etre json ou csv' });
        }
        const rows = normalizeImportRows(target, format, payload);
        let inserted = 0;
        let skipped = 0;
        if (target === 'equipes') {
            for (const row of rows) {
                const nom = String(row.nom ?? '').trim();
                if (!nom) {
                    skipped++;
                    continue;
                }
                const classement = row.classement === undefined || row.classement === null || row.classement === ''
                    ? null
                    : Number(row.classement);
                const points = row.points_fifa === undefined || row.points_fifa === null || row.points_fifa === ''
                    ? null
                    : Number(row.points_fifa);
                await prisma.equipe.upsert({
                    where: { nom },
                    update: {
                        classement: Number.isFinite(classement) ? classement : null,
                        points_fifa: Number.isFinite(points) ? points : null
                    },
                    create: {
                        nom,
                        classement: Number.isFinite(classement) ? classement : null,
                        points_fifa: Number.isFinite(points) ? points : null
                    }
                });
                inserted++;
            }
        }
        if (target === 'matchs-historique') {
            for (const row of rows) {
                const equipe1 = String(row.equipe1 ?? '').trim();
                const equipe2 = String(row.equipe2 ?? '').trim();
                const tournoi = String(row.tournoi ?? '').trim();
                const pays = String(row.pays ?? '').trim();
                const score1 = Number(row.score1);
                const score2 = Number(row.score2);
                if (!equipe1 || !equipe2 || !tournoi || !pays || !Number.isInteger(score1) || !Number.isInteger(score2) || score1 < 0 || score2 < 0) {
                    skipped++;
                    continue;
                }
                await prisma.matchHistorique.create({
                    data: {
                        date_match: row.date_match ? new Date(String(row.date_match)) : null,
                        equipe1,
                        equipe2,
                        score1,
                        score2,
                        tournoi,
                        pays
                    }
                });
                inserted++;
            }
        }
        return res.status(200).json({
            message: 'Import termine',
            target,
            format,
            total_lignes: rows.length,
            inserted,
            skipped
        });
    }
    catch (error) {
        console.error('Erreur import:', error);
        return res.status(500).json({
            error: 'Erreur lors de l\'import',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/export/:target?format=json|csv
 * Exporte les donnees d'une table cible en JSON ou CSV
 */
router.get('/export/:target', async (req, res) => {
    try {
        const target = req.params.target;
        const format = (req.query.format || 'json').toLowerCase();
        if (target !== 'equipes' && target !== 'matchs-historique') {
            return res.status(400).json({ error: 'target doit etre equipes ou matchs-historique' });
        }
        if (format !== 'json' && format !== 'csv') {
            return res.status(400).json({ error: 'format doit etre json ou csv' });
        }
        if (target === 'equipes') {
            const equipes = await prisma.equipe.findMany({
                orderBy: [{ classement: 'asc' }, { nom: 'asc' }],
                select: { nom: true, classement: true, points_fifa: true }
            });
            if (format === 'json') {
                return res.status(200).json({ total: equipes.length, data: equipes });
            }
            const csv = toCsv(equipes.map((e) => ({
                nom: e.nom,
                classement: e.classement,
                points_fifa: e.points_fifa
            })), ['nom', 'classement', 'points_fifa']);
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename="equipes.csv"');
            return res.status(200).send(csv);
        }
        const matchs = await prisma.matchHistorique.findMany({
            orderBy: [{ date_match: 'desc' }, { id_match: 'desc' }],
            select: {
                date_match: true,
                equipe1: true,
                equipe2: true,
                score1: true,
                score2: true,
                tournoi: true,
                pays: true
            }
        });
        const rows = matchs.map((m) => ({
            date_match: m.date_match ? m.date_match.toISOString().slice(0, 10) : '',
            equipe1: m.equipe1,
            equipe2: m.equipe2,
            score1: m.score1,
            score2: m.score2,
            tournoi: m.tournoi,
            pays: m.pays
        }));
        if (format === 'json') {
            return res.status(200).json({ total: rows.length, data: rows });
        }
        const csv = toCsv(rows, ['date_match', 'equipe1', 'equipe2', 'score1', 'score2', 'tournoi', 'pays']);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="matchs-historique.csv"');
        return res.status(200).send(csv);
    }
    catch (error) {
        console.error('Erreur export:', error);
        return res.status(500).json({
            error: 'Erreur lors de l\'export',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/probabilites-2026
 * Calcule les probabilités de titre avec : 70% classement FIFA + 30% forme récente
 */
router.get('/probabilites-2026', async (_req, res) => {
    try {
        // Récupérer les équipes qualifiées pour la CDM 2026
        const qualifiees = await prisma.matchCdm2026.findMany({
            select: { equipe_dom: true, equipe_ext: true }
        });
        const nomsEquipes = new Set();
        qualifiees.forEach(m => {
            if (m.equipe_dom && m.equipe_dom !== 'To be announced')
                nomsEquipes.add(m.equipe_dom);
            if (m.equipe_ext && m.equipe_ext !== 'To be announced')
                nomsEquipes.add(m.equipe_ext);
        });
        // Récupérer les équipes avec leurs stats
        const equipes = await prisma.equipe.findMany({
            where: {
                points_fifa: { not: null },
                nom: { in: Array.from(nomsEquipes) }
            },
            orderBy: { points_fifa: 'desc' },
            take: 20
        });
        // Calculer les scores
        const scores = [];
        let totalScore = 0;
        // Normalisation des points FIFA (min-max)
        const pointsFifa = equipes.map(e => Number(e.points_fifa) || 0);
        const maxFifa = Math.max(...pointsFifa);
        const minFifa = Math.min(...pointsFifa);
        for (const equipe of equipes) {
            // 1. Score Classement FIFA (normalisé entre 0 et 1)
            const points = Number(equipe.points_fifa) || 0;
            const scoreClassement = maxFifa !== minFifa
                ? (points - minFifa) / (maxFifa - minFifa)
                : 0.5;
            // 2. Score Forme (moyenne des 20 derniers matchs)
            const formeData = await prisma.$queryRaw `
        SELECT get_forme_recente(${equipe.nom}) as get_forme_recente
      `;
            let scoreForme = formeData[0]?.get_forme_recente || 0.5;
            // 3. Score final (70% classement, 30% forme)
            const scoreFinal = (scoreClassement * 0.7) + (scoreForme * 0.3);
            scores.push({
                equipe: equipe.nom,
                classement: equipe.classement,
                points_fifa: points,
                score_classement: scoreClassement,
                score_forme: scoreForme,
                score_final: scoreFinal
            });
            totalScore += scoreFinal;
        }
        // Calculer les probabilités
        const favoris = scores.map((s, index) => ({
            classement: s.classement ?? index + 1,
            equipe: s.equipe,
            points_fifa: s.points_fifa,
            score_classement: Number((s.score_classement * 100).toFixed(1)),
            score_forme: Number((s.score_forme * 100).toFixed(1)),
            probabilite_titulo: Number(((s.score_final / totalScore) * 100).toFixed(2))
        }));
        // Trier par probabilité décroissante
        favoris.sort((a, b) => b.probabilite_titulo - a.probabilite_titulo);
        favoris.forEach((f, index) => {
            f.classement = index + 1;
        });
        res.json({
            total: favoris.length,
            favoris
        });
    }
    catch (error) {
        console.error('Erreur lors du calcul des probabilités 2026:', error);
        res.status(500).json({
            error: 'Erreur lors du calcul des probabilités 2026',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/scores/fifa/:equipe
 * Obtient le score FIFA normalisé(0-1) pour une équipe
 */
router.get('/scores/fifa/:equipe', async (req, res) => {
    try {
        const { equipe } = req.params;
        const result = await prisma.$queryRaw `
      SELECT get_score_fifa(${equipe}) as get_score_fifa
    `;
        if (!result || result.length === 0) {
            return res.status(404).json({
                error: 'Équipe non trouvée',
                equipe
            });
        }
        res.json({
            equipe,
            score_fifa: result[0].get_score_fifa,
            description: 'Score FIFA normalisé entre 0 et 1'
        });
    }
    catch (error) {
        console.error('Erreur lors du calcul du score FIFA:', error);
        res.status(500).json({
            error: 'Erreur lors du calcul du score FIFA',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/scores/h2h/:equipe1/:equipe2
 * Obtient le score face-à-face (0-1) entre deux équipes
 */
router.get('/scores/h2h/:equipe1/:equipe2', async (req, res) => {
    try {
        const { equipe1, equipe2 } = req.params;
        const result = await prisma.$queryRaw `
      SELECT get_score_h2h(${equipe1}, ${equipe2}) as get_score_h2h
    `;
        if (!result || result.length === 0) {
            return res.status(404).json({
                error: 'Erreur lors du calcul du score face-à-face',
                equipe1,
                equipe2
            });
        }
        const scoreEq1 = result[0].get_score_h2h;
        const scoreEq2 = 1 - scoreEq1;
        res.json({
            equipe1,
            equipe2,
            score_h2h_equipe1: scoreEq1,
            score_h2h_equipe2: scoreEq2,
            description: 'Score face-à-face: probabilité de victoire pour chaque équipe basée sur l\'historique'
        });
    }
    catch (error) {
        console.error('Erreur lors du calcul du score H2H:', error);
        res.status(500).json({
            error: 'Erreur lors du calcul du score H2H',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/scores/forme/:equipe
 * Obtient la forme récente (0-1) d'une équipe basée sur les 10 derniers matchs
 */
router.get('/scores/forme/:equipe', async (req, res) => {
    try {
        const { equipe } = req.params;
        const result = await prisma.$queryRaw `
      SELECT get_forme_recente(${equipe}) as get_forme_recente
    `;
        if (!result || result.length === 0) {
            return res.status(404).json({
                error: 'Équipe non trouvée',
                equipe
            });
        }
        res.json({
            equipe,
            forme_recente: result[0].get_forme_recente,
            description: 'Forme récente entre 0 et 1, basée sur les 10 derniers matchs'
        });
    }
    catch (error) {
        console.error('Erreur lors du calcul de la forme récente:', error);
        res.status(500).json({
            error: 'Erreur lors du calcul de la forme récente',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * POST /api/predictions/calcul/:matchId
 * Calcule la prédiction pour un match spécifique
 */
router.post('/predictions/calcul/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        if (!matchId || Array.isArray(matchId)) {
            return res.status(400).json({ error: 'ID de match invalide' });
        }
        const id = parseInt(matchId, 10);
        // Vérifie que le match existe
        const match = await prisma.matchCdm2026.findUnique({
            where: { id_match_wc: id }
        });
        if (!match) {
            return res.status(404).json({
                error: 'Match non trouvé',
                id_match_wc: id
            });
        }
        // Exécute la fonction de calcul
        await prisma.$queryRaw `
      SELECT calculer_prediction(${id})
    `;
        // Récupère la prédiction calculée
        const prediction = await prisma.prediction.findUnique({
            where: { id_match_wc: id },
            include: {
                match: true
            }
        });
        res.json({
            success: true,
            message: 'Prédiction calculée avec succès',
            prediction: {
                id_match_wc: prediction?.id_match_wc,
                equipe_dom: prediction?.match.equipe_dom,
                equipe_ext: prediction?.match.equipe_ext,
                proba_dom: prediction?.proba_dom,
                proba_nul: prediction?.proba_nul,
                proba_ext: prediction?.proba_ext,
                date_calcul: prediction?.date_calcul
            }
        });
    }
    catch (error) {
        console.error('Erreur lors du calcul de la prédiction:', error);
        res.status(500).json({
            error: 'Erreur lors du calcul de la prédiction',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * POST /api/predictions/calcul-tous
 * Calcule toutes les prédictions pour tous les matchs
 */
router.post('/predictions/calcul-tous', async (req, res) => {
    try {
        const startTime = Date.now();
        // Exécute la fonction de calcul de toutes les prédictions
        await prisma.$queryRaw `
      SELECT calculer_toutes_predictions()
    `;
        const duration = Date.now() - startTime;
        // Compte les prédictions calculées
        const count = await prisma.prediction.count();
        res.json({
            success: true,
            message: 'Toutes les prédictions ont été calculées',
            predictions_count: count,
            duration_ms: duration
        });
    }
    catch (error) {
        console.error('Erreur lors du calcul de toutes les prédictions:', error);
        res.status(500).json({
            error: 'Erreur lors du calcul de toutes les prédictions',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/predictions/:matchId
 * Obtient la prédiction d'un match spécifique
 */
router.get('/predictions/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        if (!matchId || Array.isArray(matchId)) {
            return res.status(400).json({ error: 'ID de match invalide' });
        }
        const id = parseInt(matchId, 10);
        const prediction = await prisma.prediction.findUnique({
            where: { id_match_wc: id },
            include: {
                match: true
            }
        });
        if (!prediction) {
            return res.status(404).json({
                error: 'Prédiction non trouvée',
                id_match_wc: id
            });
        }
        res.json({
            id_match_wc: prediction.id_match_wc,
            equipe_dom: prediction.match.equipe_dom,
            equipe_ext: prediction.match.equipe_ext,
            proba_dom: prediction.proba_dom,
            proba_nul: prediction.proba_nul,
            proba_ext: prediction.proba_ext,
            date_calcul: prediction.date_calcul,
            phase: prediction.match.phase,
            numero: prediction.match.numero
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la prédiction:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération de la prédiction',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/predictions
 * Obtient toutes les prédictions avec filtrage optionnel
 */
router.get('/predictions', async (req, res) => {
    try {
        const predictions = await prisma.prediction.findMany({
            include: {
                match: true
            },
            orderBy: {
                id_match_wc: 'asc'
            }
        });
        res.json({
            total: predictions.length,
            predictions: predictions.map((p) => ({
                id_match_wc: p.id_match_wc,
                equipe_dom: p.match.equipe_dom,
                equipe_ext: p.match.equipe_ext,
                proba_dom: p.proba_dom,
                proba_nul: p.proba_nul,
                proba_ext: p.proba_ext,
                date_calcul: p.date_calcul,
                phase: p.match.phase,
                numero: p.match.numero
            }))
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des prédictions:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des prédictions',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/scores/analyse/:matchId
 * Obtient une analyse complète avec tous les scores pour un match
 */
router.get('/scores/analyse/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        if (!matchId || Array.isArray(matchId)) {
            return res.status(400).json({ error: 'ID de match invalide' });
        }
        const id = parseInt(matchId, 10);
        // Récupère le match
        const match = await prisma.matchCdm2026.findUnique({
            where: { id_match_wc: id }
        });
        if (!match || !match.equipe_dom || !match.equipe_ext) {
            return res.status(404).json({
                error: 'Match non trouvé ou équipes non disponibles',
                id_match_wc: id
            });
        }
        // Récupère tous les scores
        const scoresFifaResult = await prisma.$queryRaw `
      SELECT get_score_fifa(${match.equipe_dom}) as get_score_fifa
    `;
        const scoreFifaDom = scoresFifaResult[0].get_score_fifa;
        const scoresFifaExtResult = await prisma.$queryRaw `
      SELECT get_score_fifa(${match.equipe_ext}) as get_score_fifa
    `;
        const scoreFifaExt = scoresFifaExtResult[0].get_score_fifa;
        const scoreH2hResult = await prisma.$queryRaw `
      SELECT get_score_h2h(${match.equipe_dom}, ${match.equipe_ext}) as get_score_h2h
    `;
        const scoreH2h = scoreH2hResult[0].get_score_h2h;
        const formeResult = await prisma.$queryRaw `
      SELECT get_forme_recente(${match.equipe_dom}) as get_forme_recente
    `;
        const formeDom = formeResult[0].get_forme_recente;
        const formeExtResult = await prisma.$queryRaw `
      SELECT get_forme_recente(${match.equipe_ext}) as get_forme_recente
    `;
        const formeExt = formeExtResult[0].get_forme_recente;
        // Récupère la prédiction
        const prediction = await prisma.prediction.findUnique({
            where: { id_match_wc: id }
        });
        res.json({
            id_match_wc: id,
            phase: match.phase,
            numero: match.numero,
            equipe_dom: match.equipe_dom,
            equipe_ext: match.equipe_ext,
            analyse: {
                score_fifa: {
                    equipe_dom: scoreFifaDom,
                    equipe_ext: scoreFifaExt
                },
                score_h2h: {
                    equipe_dom: scoreH2h,
                    equipe_ext: 1 - scoreH2h
                },
                forme_recente: {
                    equipe_dom: formeDom,
                    equipe_ext: formeExt
                }
            },
            prediction: prediction ? {
                proba_dom: prediction.proba_dom,
                proba_nul: prediction.proba_nul,
                proba_ext: prediction.proba_ext,
                date_calcul: prediction.date_calcul
            } : null
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'analyse du match:', error);
        res.status(500).json({
            error: 'Erreur lors de l\'analyse du match',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/stats/equipe/:equipe
 * Obtient les statistiques détaillées d'une équipe
 */
router.get('/stats/equipe/:equipe', async (req, res) => {
    try {
        const { equipe } = req.params;
        const result = await prisma.$queryRaw `
      SELECT * FROM get_stats_equipe(${equipe})
    `;
        if (!result || result.length === 0) {
            return res.status(404).json({
                error: 'Équipe non trouvée ou aucune statistique disponible',
                equipe
            });
        }
        res.json(result[0]);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des statistiques',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/stats/comparaison/:equipe1/:equipe2
 * Compare deux équipes
 */
router.get('/stats/comparaison/:equipe1/:equipe2', async (req, res) => {
    try {
        const { equipe1, equipe2 } = req.params;
        const result = await prisma.$queryRaw `
      SELECT * FROM comparer_equipes(${equipe1}, ${equipe2})
    `;
        if (!result || result.length === 0) {
            return res.status(404).json({
                error: 'Erreur lors de la comparaison des équipes',
                equipe1,
                equipe2
            });
        }
        res.json(result[0]);
    }
    catch (error) {
        console.error('Erreur lors de la comparaison:', error);
        res.status(500).json({
            error: 'Erreur lors de la comparaison',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/groupe/:groupId/analyse
 * Analyse la force des équipes d'un groupe
 */
router.get('/groupe/:groupId/analyse', async (req, res) => {
    try {
        const { groupId } = req.params;
        if (!groupId || Array.isArray(groupId)) {
            return res.status(400).json({ error: 'ID de groupe invalide' });
        }
        const id = parseInt(groupId, 10);
        const result = await prisma.$queryRaw `
      SELECT * FROM analyser_groupe(${id})
    `;
        if (!result || result.length === 0) {
            return res.status(404).json({
                error: 'Groupe non trouvé ou vide',
                id_groupe: id
            });
        }
        res.json({
            id_groupe: id,
            equipes: result,
            total: result.length
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'analyse du groupe:', error);
        res.status(500).json({
            error: 'Erreur lors de l\'analyse du groupe',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/groupe/:groupId/qualification
 * Calcule les probabilités de qualification pour un groupe
 */
router.get('/groupe/:groupId/qualification', async (req, res) => {
    try {
        const { groupId } = req.params;
        if (!groupId || Array.isArray(groupId)) {
            return res.status(400).json({ error: 'ID de groupe invalide' });
        }
        const id = parseInt(groupId, 10);
        const result = await prisma.$queryRaw `
      SELECT * FROM analyser_qualification_groupe(${id})
    `;
        if (!result || result.length === 0) {
            return res.status(404).json({
                error: 'Groupe non trouvé ou vide',
                id_groupe: id
            });
        }
        res.json({
            id_groupe: id,
            equipes: result.map((e) => ({
                equipe: e.equipe,
                score_force: e.score_force,
                proba_qualification: e.proba_qualification,
                place_estimee: e.place_estimee
            })),
            total: result.length
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'analyse de qualification:', error);
        res.status(500).json({
            error: 'Erreur lors de l\'analyse de qualification',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
/**
 * GET /api/favoris
 * Obtient le classement des favoris du tournoi
 */
router.get('/favoris', async (req, res) => {
    try {
        const result = await prisma.$queryRaw `
      SELECT * FROM get_favoris_tournoi()
    `;
        if (!result || result.length === 0) {
            return res.status(404).json({
                error: 'Impossible de récupérer les favoris'
            });
        }
        res.json({
            total: result.length,
            favoris: result.map((equipe, index) => ({
                classement: index + 1,
                equipe: equipe.equipe,
                points_fifa: equipe.points_fifa,
                score_force: equipe.score_force,
                probabilite_titulo: equipe.probabilite_titulo
            }))
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error);
        res.status(500).json({
            error: 'Erreur lors de la récupération des favoris',
            details: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
});
export default router;
//# sourceMappingURL=routes.js.map