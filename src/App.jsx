import { useEffect } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectTheme } from './features/selectors'
import {
  bootstrapSession,
  selectAuth,
  selectIsAuthenticated,
} from './features/auth/authSlice'
import Layout from './components/Layout'
import AuthLayout from './components/AuthLayout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

function RequireAuth() {
  const isAuth = useSelector(selectIsAuthenticated)
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicOnly() {
  const isAuth = useSelector(selectIsAuthenticated)
  return isAuth ? <Navigate to="/" replace /> : <Outlet />
}

function SplashLoader() {
  return (
    <div className="splash">
      <div className="splash__spinner" />
      <p>Loading your dashboard…</p>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  const { bootstrapped } = useSelector(selectAuth)

  // Reflect the Redux theme onto <html> so CSS variables switch globally.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Validate any stored session and load the user's data once on startup.
  useEffect(() => {
    dispatch(bootstrapSession())
  }, [dispatch])

  if (!bootstrapped) return <SplashLoader />

  return (
    <Routes>
      {/* Public auth screens — redirect to the app if already signed in.
          /reset stays reachable regardless so reset links always work. */}
      <Route element={<AuthLayout />}>
        <Route path="/reset" element={<ResetPassword />} />
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* Protected app */}
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
