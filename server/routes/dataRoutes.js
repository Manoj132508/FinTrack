import { Router } from 'express'
import { getUserData, saveUserData } from '../db.js'
import { requireAuth } from '../security.js'

const router = Router()

// All data routes require a valid session.
router.use(requireAuth)

// GET /api/data — the signed-in user's transactions + budgets.
router.get('/', (req, res) => {
  const data = getUserData(req.userId)
  return res.json(data)
})

// PUT /api/data — replace the signed-in user's transactions + budgets.
router.put('/', (req, res) => {
  const { transactions, budgets } = req.body
  if (!Array.isArray(transactions) || typeof budgets !== 'object' || budgets === null) {
    return res.status(400).json({ error: 'Expected { transactions: [], budgets: {} }.' })
  }
  saveUserData(req.userId, transactions, budgets)
  return res.json({ ok: true })
})

export default router
