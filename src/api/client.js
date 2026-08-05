// Tiny fetch wrapper for the backend API. Reads the base URL from Vite env so a
// production build can point at a deployed API; in dev it defaults to the
// proxied `/api` path.

const BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'expense-tracker/token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable — session simply won't persist */
  }
}

// Thrown for non-2xx responses; carries the server's message and status.
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Could not reach the server. Is the API running?', 0)
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(data.error || 'Request failed.', res.status)
  }
  return data
}

export const api = {
  register: (email, password) =>
    request('/auth/register', { method: 'POST', body: { email, password } }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me', { auth: true }),
  forgot: (email) =>
    request('/auth/forgot', { method: 'POST', body: { email } }),
  reset: (token, password) =>
    request('/auth/reset', { method: 'POST', body: { token, password } }),
  getData: () => request('/data', { auth: true }),
  saveData: (transactions, budgets) =>
    request('/data', { method: 'PUT', auth: true, body: { transactions, budgets } }),
}
