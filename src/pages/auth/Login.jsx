import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, selectAuth, clearAuthError } from '../../features/auth/authSlice'

export default function Login() {
  const dispatch = useDispatch()
  const { status, error } = useSelector(selectAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loading = status === 'loading'

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(clearAuthError())
    dispatch(loginUser({ email, password }))
  }

  return (
    <div className="auth__body">
      <h1 className="auth__title">Welcome back</h1>
      <p className="auth__subtitle">Sign in to your expense dashboard</p>

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
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="form__error">{error}</p>}

        <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="auth__links">
        <Link to="/forgot" className="link">
          Forgot password?
        </Link>
        <span className="auth__muted">
          New here?{' '}
          <Link to="/register" className="link">
            Create an account
          </Link>
        </span>
      </div>
    </div>
  )
}
