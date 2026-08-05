import { Outlet } from 'react-router-dom'

// Centered, branded shell for the sign-in / sign-up / reset screens.
export default function AuthLayout() {
  return (
    <div className="auth">
      <div className="auth__panel">
        <div className="auth__brand">
          <span className="brand__mark" aria-hidden="true">
            ₹
          </span>
          <div className="brand__text">
            <strong>FinTrack</strong>
            <span>Analytics</span>
          </div>
        </div>
        <Outlet />
      </div>
      <p className="auth__foot">
        Built with React · Redux · Chart.js · Express · SQLite
      </p>
    </div>
  )
}
