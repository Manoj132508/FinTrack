import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Modal from './Modal'
import TransactionForm from './TransactionForm'
import { addTransaction } from '../features/transactions/transactionsSlice'

export default function Layout() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [addOpen, setAddOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  function handleAdd(values) {
    dispatch(addTransaction(values))
    setAddOpen(false)
  }

  return (
    <div className={`app-shell ${navOpen ? 'app-shell--nav-open' : ''}`}>
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />

      {navOpen && (
        <div className="scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />
      )}

      <div className="app-main">
        <Topbar
          pathname={location.pathname}
          onAdd={() => setAddOpen(true)}
          onMenu={() => setNavOpen((v) => !v)}
        />
        <main className="content">
          <Outlet />
        </main>
      </div>

      <button
        type="button"
        className="fab"
        onClick={() => setAddOpen(true)}
        aria-label="Add transaction"
      >
        ＋
      </button>

      <Modal open={addOpen} title="Add transaction" onClose={() => setAddOpen(false)}>
        <TransactionForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>
    </div>
  )
}
