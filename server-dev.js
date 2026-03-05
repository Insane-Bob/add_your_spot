/**
 * Serveur de développement pour les API
 * À lancer en parallèle avec: npm run dev
 *
 * Usage:
 * node server-dev.js
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env.local') })

const app = express()
const PORT = 3001

// Middleware
app.use(express.json())

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.error('❌ MONGO_URI non définie. Créez un fichier .env.local avec votre URI MongoDB.')
  process.exit(1)
}

let mongoClient

async function connectMongo() {
  try {
    mongoClient = new MongoClient(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
    await mongoClient.connect()
    console.log('✅ Connecté à MongoDB')
  } catch (err) {
    console.error('❌ Erreur connexion MongoDB:', err.message)
    process.exit(1)
  }
}

// GET /api/point - Récupère tous les points
app.get('/api/point', async (req, res) => {
  try {
    const db = mongoClient.db('mapdb')
    const points = await db.collection('points').find({}).toArray()
    res.json(points)
  } catch (err) {
    console.error('API Error (GET):', err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/point - Crée un point
app.post('/api/point', async (req, res) => {
  try {
    const db = mongoClient.db('mapdb')
    const point = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await db.collection('points').insertOne(point)
    res.status(201).json({ ...point, _id: result.insertedId })
  } catch (err) {
    console.error('API Error (POST):', err)
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/point?id=... - Met à jour un point
app.put('/api/point', async (req, res) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'ID requis' })

    const db = mongoClient.db('mapdb')
    const result = await db.collection('points').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...req.body,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Point non trouvé' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('API Error (PUT):', err)
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/point?id=... - Supprime un point
app.delete('/api/point', async (req, res) => {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'ID requis' })

    const db = mongoClient.db('mapdb')
    const result = await db.collection('points').deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Point non trouvé' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('API Error (DELETE):', err)
    res.status(500).json({ error: err.message })
  }
})

// Sanity check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err)
  res.status(500).json({ error: 'Erreur serveur interne' })
})

// Start server
async function start() {
  await connectMongo()

  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   🚀 Serveur API de développement      ║
╠════════════════════════════════════════╣
║   📍 Port: ${PORT}                        ║
║   🗄️  MongoDB: Connecté                ║
║   ✅ Prêt pour les requêtes            ║
╚════════════════════════════════════════╝
    `)
  })
}

// Cleanup on exit
process.on('SIGINT', async () => {
  console.log('\n🛑 Fermeture du serveur...')
  if (mongoClient) {
    await mongoClient.close()
    console.log('✅ Connexion MongoDB fermée')
  }
  process.exit(0)
})

start().catch(err => {
  console.error('Erreur au démarrage:', err)
  process.exit(1)
})

