// SQLite persistence using Node's built-in `node:sqlite` module (no native
// build step required). One file-backed database holds users, their data
// blobs, and password-reset tokens.

import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || join(__dirname, 'data.db')

export const db = new DatabaseSync(DB_PATH)

// Pragmas for reasonable concurrency/durability on a single-file DB.
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_data (
    user_id      INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    transactions TEXT NOT NULL DEFAULT '[]',
    budgets      TEXT NOT NULL DEFAULT '{}',
    updated_at   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used       INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_resets_token ON password_resets(token_hash);
`)

// Normalize emails so lookups are case-insensitive.
export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

// --- Users -----------------------------------------------------------------
export function createUser(email, passwordHash) {
  const now = new Date().toISOString()
  const info = db
    .prepare('INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)')
    .run(email, passwordHash, now)
  const userId = info.lastInsertRowid
  db.prepare(
    'INSERT INTO user_data (user_id, transactions, budgets, updated_at) VALUES (?, ?, ?, ?)'
  ).run(userId, '[]', '{}', now)
  return { id: Number(userId), email, created_at: now }
}

export function findUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
}

export function findUserById(id) {
  return db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(id)
}

export function updateUserPassword(userId, passwordHash) {
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, userId)
}

// --- Per-user data blob ----------------------------------------------------
export function getUserData(userId) {
  const row = db
    .prepare('SELECT transactions, budgets FROM user_data WHERE user_id = ?')
    .get(userId)
  if (!row) return { transactions: [], budgets: {} }
  return {
    transactions: JSON.parse(row.transactions),
    budgets: JSON.parse(row.budgets),
  }
}

export function saveUserData(userId, transactions, budgets) {
  const now = new Date().toISOString()
  db.prepare(
    `INSERT INTO user_data (user_id, transactions, budgets, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       transactions = excluded.transactions,
       budgets = excluded.budgets,
       updated_at = excluded.updated_at`
  ).run(userId, JSON.stringify(transactions), JSON.stringify(budgets), now)
}

// --- Password resets -------------------------------------------------------
export function createReset(userId, tokenHash, expiresAt) {
  db.prepare(
    'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
  ).run(userId, tokenHash, expiresAt)
}

export function findValidReset(tokenHash) {
  return db
    .prepare(
      `SELECT * FROM password_resets
       WHERE token_hash = ? AND used = 0 AND expires_at > ?`
    )
    .get(tokenHash, Date.now())
}

export function markResetUsed(id) {
  db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(id)
}
