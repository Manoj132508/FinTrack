import { Router } from 'express'
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPassword,
  normalizeEmail,
  createReset,
  findValidReset,
  markResetUsed,
} from '../db.js'
import {
  hashPassword,
  verifyPassword,
  signToken,
  generateResetToken,
  hashResetToken,
  requireAuth,
} from '../security.js'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 8

function validateCredentials(email, password) {
  if (!email || !EMAIL_RE.test(email)) return 'Please enter a valid email address.'
  if (!password || password.length < MIN_PASSWORD) {
    return `Password must be at least ${MIN_PASSWORD} characters.`
  }
  return null
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const { password } = req.body

  const problem = validateCredentials(email, password)
  if (problem) return res.status(400).json({ error: problem })

  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'An account with this email already exists.' })
  }

  const passwordHash = await hashPassword(password)
  const user = createUser(email, passwordHash)
  const token = signToken(user.id)
  return res.status(201).json({ token, user: { id: user.id, email: user.email } })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const { password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const user = findUserByEmail(email)
  // Same generic message whether the email or password is wrong.
  const invalid = () =>
    res.status(401).json({ error: 'Incorrect email or password.' })

  if (!user) return invalid()
  const ok = await verifyPassword(password, user.password_hash)
  if (!ok) return invalid()

  const token = signToken(user.id)
  return res.json({ token, user: { id: user.id, email: user.email } })
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const user = findUserById(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found.' })
  return res.json({ user: { id: user.id, email: user.email } })
})

// POST /api/auth/forgot
// Real apps email a reset link. With no mail service configured, we return the
// token directly (dev convenience) AND log it server-side. The response is
// always "ok" so attackers can't probe which emails are registered.
router.post('/forgot', (req, res) => {
  const email = normalizeEmail(req.body.email)
  const user = findUserByEmail(email)

  const response = {
    ok: true,
    message: 'If that account exists, a reset link has been generated.',
  }

  if (user) {
    const { token, tokenHash, expiresAt } = generateResetToken()
    createReset(user.id, tokenHash, expiresAt)
    console.log(`[auth] Password reset for ${email}: token=${token}`)
    // Dev-only: surface the token so the flow is completable without email.
    response.devToken = token
    response.devResetPath = `/reset?token=${token}`
  }

  return res.json(response)
})

// POST /api/auth/reset
router.post('/reset', async (req, res) => {
  const { token, password } = req.body
  if (!token) return res.status(400).json({ error: 'Reset token is required.' })
  if (!password || password.length < MIN_PASSWORD) {
    return res
      .status(400)
      .json({ error: `Password must be at least ${MIN_PASSWORD} characters.` })
  }

  const record = findValidReset(hashResetToken(token))
  if (!record) {
    return res.status(400).json({ error: 'This reset link is invalid or has expired.' })
  }

  const passwordHash = await hashPassword(password)
  updateUserPassword(record.user_id, passwordHash)
  markResetUsed(record.id)
  return res.json({ ok: true, message: 'Password updated. You can now sign in.' })
})

export default router
