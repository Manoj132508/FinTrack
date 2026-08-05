import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { message, devResetPath }
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.forgot(email)
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth__body">
      <h1 className="auth__title">Reset your password</h1>
      <p className="auth__subtitle">
        Enter your email and we&apos;ll generate a reset link
      </p>

      {result ? (
        <div className="auth__notice">
          <p>{result.message}</p>
          {result.devResetPath ? (
            <>
              <p className="auth__muted">
                Email isn&apos;t configured in this demo, so use the link below:
              </p>
              <Link to={result.devResetPath} className="btn btn--primary btn--block">
                Continue to reset password
              </Link>
            </>
          ) : (
            <p className="auth__muted">
              If an account exists for that email, a reset link was created.
            </p>
          )}
          <div className="auth__links">
            <Link to="/login" className="link">
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <>
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

            {error && <p className="form__error">{error}</p>}

            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              {loading ? 'Generating…' : 'Send reset link'}
            </button>
          </form>

          <div className="auth__links">
            <Link to="/login" className="link">
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
