import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../api/client'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const tokenFromUrl = params.get('token') || ''

  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await api.reset(token, password)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="auth__body">
        <h1 className="auth__title">Password updated ✅</h1>
        <p className="auth__subtitle">You can now sign in with your new password.</p>
        <Link to="/login" className="btn btn--primary btn--block">
          Go to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="auth__body">
      <h1 className="auth__title">Choose a new password</h1>
      <p className="auth__subtitle">Enter and confirm your new password</p>

      <form className="form" onSubmit={handleSubmit}>
        {!tokenFromUrl && (
          <label className="field">
            <span className="field__label">Reset token</span>
            <input
              type="text"
              placeholder="Paste your reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </label>
        )}

        <label className="field">
          <span className="field__label">New password</span>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Confirm new password</span>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        {error && <p className="form__error">{error}</p>}

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <div className="auth__links">
        <Link to="/login" className="link">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
