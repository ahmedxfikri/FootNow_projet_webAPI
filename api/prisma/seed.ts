import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Début du seed Coupe du Monde 2026...')

  // Détection du répertoire de données 
  const candidateDirs = [
    '/data',                       // dans le conteneur Docker (monté par compose)
    path.join(process.cwd(), '../db/data'), // local : depuis api/ => ../db/data
  ]
  const dataDir = candidateDirs.find(d => fs.existsSync(d)) ?? candidateDirs[1]
  console.log(`📁 Répertoire de données : ${dataDir}`)

  // -----------------------------
  // Nettoyage des tables 
  // -----------------------------
  console.log('🧹 Nettoyage des tables existantes...')
  await prisma.prediction.deleteMany()
  await prisma.resultat.deleteMany()
  await prisma.classementGroupe.deleteMany()
  await prisma.matchCdm2026.deleteMany()
  await prisma.matchHistorique.deleteMany()
  await prisma.tokenApi.deleteMany()
  await prisma.utilisateur.deleteMany()
  await prisma.groupe.deleteMany()
  await prisma.equipe.deleteMany()
  console.log('✅ Nettoyage terminé')

  // ========================
  // 1. ÉQUIPES + CLASSEMENT FIFA
  // ========================
  const rankingPath = path.join(dataDir, 'fifa_ranking_2026_complet.csv')
  if (!fs.existsSync(rankingPath)) throw new Error(`Fichier non trouvé : ${rankingPath}`)
  const rankingCsv = fs.readFileSync(rankingPath, 'utf8')
  const rankingData = parse(rankingCsv, { columns: true, skip_empty_lines: true })

  for (const row of rankingData) {
    await prisma.equipe.upsert({
      where: { nom: String(row.Team).trim() },
      update: {},
      create: {
        nom: String(row.Team).trim(),
        classement: parseInt(row.Ranking) || null,
        points_fifa: parseFloat(row['Points FIFA']) || null,
      },
    })
  }
  console.log(`✅ ${rankingData.length} équipes + classement FIFA importés`)

  // ========================
  // 2. MATCHS HISTORIQUES
  // ========================
  const historyPath = path.join(dataDir, 'results.csv')
  if (!fs.existsSync(historyPath)) throw new Error(`Fichier non trouvé : ${historyPath}`)
  const historyCsv = fs.readFileSync(historyPath, 'utf8')
  const historyData = parse(historyCsv, { columns: true, skip_empty_lines: true })

  let historyCount = 0
  for (const row of historyData) {
    const score1Str = row.scoreteam1 || '0'
    const score2Str = row.scoreteam2 || '0'

    await prisma.matchHistorique.create({
      data: {
        date_match: row.date && row.date !== 'NA' ? new Date(row.date) : null,
        equipe1: String(row.team1 || row.equipe1).trim(),
        equipe2: String(row.team2 || row.equipe2).trim(),
        score1: score1Str !== 'NA' ? parseInt(score1Str) : null,
        score2: score2Str !== 'NA' ? parseInt(score2Str) : null,
        tournoi: String(row.tournament || row.tournoi).trim(),
        pays: String(row.country || row.pays).trim(),
      },
    })
    historyCount++
  }
  console.log(`✅ ${historyCount} matchs historiques importés`)

  // ========================
  // 3. MATCHS CDM 2026 & GROUPES
  // ========================
  const wcPath = path.join(dataDir, 'fifa-world-cup-2026-UTC.csv')
  if (!fs.existsSync(wcPath)) throw new Error(`Fichier non trouvé : ${wcPath}`)
  const wcCsv = fs.readFileSync(wcPath, 'utf8')
  const wcData = parse(wcCsv, { columns: true, skip_empty_lines: true })

  // Création des groupes à partir des noms uniques dans le CSV
  const groupNames = Array.from(
    new Set(
      wcData
        .map((row: any) => String(row.Group || '').trim())
        .filter((name: string) => name.length > 0)
    )
  )
  for (const groupName of groupNames) {
    await prisma.groupe.upsert({
      where: { nom: groupName },
      update: {},
      create: { nom: groupName },
    })
  }
  console.log(`✅ ${groupNames.length} groupes créés`)

  const groupes = await prisma.groupe.findMany()
  const groupMap = new Map(groupes.map(g => [g.nom.toLowerCase().trim(), g.id_groupe]))

  let wcCount = 0
  for (const row of wcData) {
    const groupNom = String(row.Group || '').trim()
    const id_groupe = groupNom ? groupMap.get(groupNom.toLowerCase()) || null : null

    await prisma.matchCdm2026.create({
      data: {
        numero: parseInt(row['Match Number']) || null,
        phase: String(row['Round Number'] || row.phase || 'Group Stage').trim(),
        equipe_dom: String(row['Home Team'] || row.equipe_dom).trim(),
        equipe_ext: String(row['Away Team'] || row.equipe_ext).trim(),
        id_groupe,
      },
    })
    wcCount++
  }
  console.log(`✅ ${wcCount} matchs Coupe du Monde 2026 importés`)

  // ========================
  // 4. FONCTIONS PL/pgSQL
  // ========================
  // Chemin absolu /db/ monté dans le conteneur
  const functionsPath = '/db/functions.sql'
  if (!fs.existsSync(functionsPath)) throw new Error(`Fichier SQL non trouvé : ${functionsPath}`)
  const functionsSql = fs.readFileSync(functionsPath, 'utf8')
  await prisma.$executeRawUnsafe(functionsSql)
  console.log('✅ Fonctions PL/pgSQL créées')

  // ========================
  // 5. TRIGGERS PL/pgSQL
  // ========================
  const triggersPath = '/db/triggers.sql'
  if (!fs.existsSync(triggersPath)) throw new Error(`Fichier SQL non trouvé : ${triggersPath}`)
  const triggersSql = fs.readFileSync(triggersPath, 'utf8')
  await prisma.$executeRawUnsafe(triggersSql)
  console.log('✅ Triggers créés')

  // ========================
  // 6. UTILISATEUR ADMIN
  // ========================
  const adminPassword = await bcrypt.hash('admin', 10)
  await prisma.utilisateur.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('✅ Utilisateur admin créé (login: admin, mot de passe: admin)')

  // ========================
  // 7. CALCUL DES PRÉDICTIONS INITIALES
  // ========================
  await prisma.$executeRaw`SELECT calculer_toutes_predictions()`
  console.log('✅ Toutes les prédictions initiales calculées')

  console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !')
}

main()
  .catch(e => {
    console.error('❌ Erreur pendant le seed :', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
