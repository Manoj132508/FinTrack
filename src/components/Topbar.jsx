import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/ui/uiSlice'
import { selectTheme } from '../features/selectors'
import { logout, selectCurrentUser } from '../features/auth/authSlice'

const TITLES = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/reports': 'Reports',
}

export default function Topbar({ pathname, onAdd, onMenu }) {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  const user = useSelector(selectCurrentUser)

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="icon-btn topbar__menu"
          onClick={onMenu}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <div>
          <h1 className="topbar__title">{TITLES[pathname] || 'Overview'}</h1>
          <p className="topbar__subtitle">Track, analyze, and plan your money</p>
        </div>
      </div>

      <div className="topbar__actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => dispatch(toggleTheme())}
          aria-label="Toggle color theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          <span aria-hidden="true">＋</span> Add Transaction
        </button>

        {user && (
          <div className="user-menu">
            <span className="user-menu__avatar" title={user.email}>
              {user.email.charAt(0).toUpperCase()}
            </span>
            <span className="user-menu__email">{user.email}</span>
            <button
              type="button"
              className="icon-btn icon-btn--sm"
              onClick={() => dispatch(logout())}
              aria-label="Sign out"
              title="Sign out"
            >
              ⏻
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
