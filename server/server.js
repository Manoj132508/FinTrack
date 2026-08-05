// Expense Tracker API — Express + SQLite (node:sqlite).
// Provides authentication and per-user data storage.

import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import dataRoutes from './routes/dataRoutes.js'

const app = express()
const PORT = process.env.API_PORT || 4000

app.use(cors()) // Dev: allow the Vite origin. Vite also proxies /api in dev.
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/data', dataRoutes)

// Fallback error handler so thrown errors return JSON, not HTML.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[api] Unhandled error:', err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

app.listen(PORT, () => {
  console.log(`[api] Expense Tracker API listening on http://localhost:${PORT}`)
})
