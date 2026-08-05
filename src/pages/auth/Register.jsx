import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, selectAuth, clearAuthError } from '../../features/auth/authSlice'

export default function Register() {
  const dispatch = useDispatch()
  const { status, error } = useSelector(selectAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState('')

  const loading = status === 'loading'

  function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')
    dispatch(clearAuthError())
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.')
      return
    }
    dispatch(registerUser({ email, password }))
  }

  return (
    <div className="auth__body">
      <h1 className="auth__title">Create your account</h1>
      <p className="auth__subtitle">Start tracking your expenses in minutes</p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Password</span>
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
          <span className="field__label">Confirm password</span>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        {(localError || error) && (
          <p className="form__error">{localError || error}</p>
        )}

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="auth__links">
        <span className="auth__muted">
          Already have an account?{' '}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </span>
      </div>
    </div>
  )
}
