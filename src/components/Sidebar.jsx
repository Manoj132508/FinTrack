import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/transactions', label: 'Transactions', icon: '🧾' },
  { to: '/budgets', label: 'Budgets', icon: '🎯' },
  { to: '/reports', label: 'Reports', icon: '📈' },
]

export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          ₹
        </span>
        <div className="brand__text">
          <strong>FinTrack</strong>
          <span>Analytics</span>
        </div>
      </div>

      <nav className="nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `nav__link ${isActive ? 'nav__link--active' : ''}`
            }
            onClick={onNavigate}
          >
            <span className="nav__icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__foot">
        <p>Built with React · Redux · Chart.js</p>
      </div>
    </aside>
  )
}
