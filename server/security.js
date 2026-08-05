// Authentication primitives: password hashing, JWTs, reset-token generation,
// and the Express middleware that guards protected routes.

import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// In production this MUST come from the environment. The dev fallback is stable
// so tokens survive server restarts during development.
const JWT_SECRET =
  process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me-in-production'
const JWT_EXPIRES_IN = '7d'
const RESET_TTL_MS = 15 * 60 * 1000 // 15 minutes

if (!process.env.JWT_SECRET) {
  console.warn(
    '[security] JWT_SECRET is not set — using an insecure development default.'
  )
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

// Returns a plaintext token (sent to the user) plus its hash (stored in the DB)
// and an absolute expiry timestamp. We never store the plaintext token.
export function generateResetToken() {
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  return { token, tokenHash, expiresAt: Date.now() + RESET_TTL_MS }
}

export function hashResetToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex')
}

// Express middleware: requires a valid `Authorization: Bearer <jwt>` header and
// attaches `req.userId`.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication required.' })
  }
  try {
    const payload = verifyToken(token)
    req.userId = payload.sub
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' })
  }
}
