import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from '../features/transactions/transactionsSlice'
import budgetsReducer from '../features/budgets/budgetsSlice'
import uiReducer from '../features/ui/uiSlice'
import authReducer from '../features/auth/authSlice'
import { syncMiddleware } from './syncMiddleware'

// Data is no longer persisted to localStorage — it lives on the server, scoped
// to the authenticated user. Only the auth token is kept in localStorage (see
// api/client.js) so a session survives a page refresh.
export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    ui: uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(syncMiddleware.middleware),
})
