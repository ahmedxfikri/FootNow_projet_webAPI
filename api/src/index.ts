import express from 'express'
import type {Request, Response} from 'express';
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { prisma } from './client.js'
import router from './routes.js'

const SALT_ROUNDS = 10

const app = express()
app.use(express.json())

app.use((_req: Request, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (_req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

// Vérifie le statut de l'API et base de données
app.get('/api/health', async ( _req: Request, res: Response) => {
  try {
   
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      status: 'ok',
      api: 'up',
      database: 'up'
    })
  } catch (error) {
    console.error('Healthcheck failed:', error)

    res.status(503).json({
      status: 'error',
      api: 'up',
      database: 'down'
    })
  }
})

// Login, vérifie le mot de passe hashé et génère un token
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body ?? {}

    if (!login || !password) {
      return res.status(400).json({
        error: 'login et password requis'
      })
    }

    const user = await prisma.utilisateur.findUnique({
      where: { login }
    })

    if (!user) {
      return res.status(401).json({
        error: 'Identifiants invalides'
      })
    }

    // Vérification du mot de passe avec bcrypt
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return res.status(401).json({
        error: 'Identifiants invalides'
      })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // avant expiration : 24h

    await prisma.tokenApi.create({
      data: {
        id_utilisateur: user.id_utilisateur,
        token,
        date_creation: now,
        date_expiration: expiresAt,
        actif: true
      }
    })

    return res.status(200).json({
      token,
      expires_at: expiresAt,
      user: {
        id_utilisateur: user.id_utilisateur,
        login: user.login,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Erreur login:', error)
    return res.status(500).json({
      error: 'Erreur lors du login'
    })
  }
})

// Register - Inscription d'un nouvel utilisateur
app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body ?? {}

    if (!login || !password) {
      return res.status(400).json({
        error: 'login et password requis'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Le mot de passe doit contenir au moins 6 caractères'
      })
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { login }
    })

    if (existingUser) {
      return res.status(409).json({
        error: 'Ce login est déjà utilisé'
      })
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Création de l'utilisateur
    const newUser = await prisma.utilisateur.create({
      data: {
        login,
        password: hashedPassword,
        role: 'visiteur'
      }
    })

    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id_utilisateur: newUser.id_utilisateur,
        login: newUser.login,
        role: newUser.role
      }
    })
  } catch (error) {
    console.error('Erreur register:', error)
    return res.status(500).json({
      error: 'Erreur lors de l\'inscription'
    })
  }
})

// Logout (le token expire automatiquement)
app.post('/api/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' })
    }

    const token = authHeader.slice('Bearer '.length).trim()

    // Désactive le token
    const result = await prisma.tokenApi.updateMany({
      where: { token },
      data: { actif: false }
    })

    if (result.count === 0) {
      return res.status(404).json({ error: 'Token non trouvé' })
    }

    return res.status(200).json({
      message: 'Déconnexion réussie'
    })
  } catch (error) {
    console.error('Erreur logout:', error)
    return res.status(500).json({
      error: 'Erreur lors de la déconnexion'
    })
  }
})

app.use('/api', async (req: Request, res: Response, next) => {
  // Routes publiques (pas besoin d'authentification)
  const normalizedPath = req.path.replace(/^\/api/, '')
  const isPublicPath =
    normalizedPath === '/health' ||
    normalizedPath === '/login' ||
    normalizedPath === '/register' ||
    normalizedPath === '/equipes' ||
    normalizedPath === '/matchs-historique' ||
    normalizedPath === '/groupes' ||
    normalizedPath === '/favoris' ||
    normalizedPath === '/probabilites-2026' ||
    normalizedPath === '/predictions' ||           // ← AJOUTÉ
    normalizedPath === '/matchs-cdm2026' ||        // ← AJOUTÉ
    /^\/scores\/fifa\/[^/]+$/.test(normalizedPath) ||
    /^\/scores\/forme\/[^/]+$/.test(normalizedPath) ||
    /^\/scores\/h2h\/[^/]+\/[^/]+$/.test(normalizedPath)

  if (isPublicPath) {
    return next()
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  const token = authHeader.slice('Bearer '.length).trim()

  const tokenRecord = await prisma.tokenApi.findUnique({
    where: { token }
  })

  if (!tokenRecord || tokenRecord.actif !== true) {
    return res.status(401).json({ error: 'Token invalide' })
  }

  if (tokenRecord.date_expiration && tokenRecord.date_expiration < new Date()) {
    return res.status(401).json({ error: 'Token expiré' })
  }

  return next()
})

// Routes des fonctions SQL via Prisma
app.use('/api', router)

const port = process.env.API_PORT || 3070
app.listen(port, () => {
    console.log(`API running on port ${port}`)
})