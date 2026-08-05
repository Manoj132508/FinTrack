import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { api } from '../api/client'
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  clearAllTransactions,
  loadSampleData,
  setAllTransactions,
} from '../features/transactions/transactionsSlice'
import {
  setBudget,
  removeBudget,
  resetBudgets,
  setBudgetsAll,
} from '../features/budgets/budgetsSlice'
import { logout } from '../features/auth/authSlice'

export const syncMiddleware = createListenerMiddleware()

// Persist to the server whenever the user changes their data — but only while
// authenticated, and debounced so rapid edits collapse into one request.
// Hydration actions (setAll*) are intentionally excluded so loading data from
// the server doesn't immediately echo it back.
syncMiddleware.startListening({
  matcher: isAnyOf(
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    loadSampleData,
    setBudget,
    removeBudget,
    resetBudgets
  ),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState()
    if (state.auth.status !== 'authenticated') return

    // Debounce: cancel any in-flight wait and start a fresh 600ms window.
    listenerApi.cancelActiveListeners()
    await listenerApi.delay(600)

    const { transactions, budgets } = listenerApi.getState()
    try {
      await api.saveData(transactions.items, budgets.monthly)
    } catch (err) {
      console.warn('[sync] Failed to save data:', err.message)
    }
  },
})

// On logout, wipe the in-memory data so the next user doesn't briefly see it.
syncMiddleware.startListening({
  actionCreator: logout,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(setAllTransactions([]))
    listenerApi.dispatch(setBudgetsAll({}))
  },
})
