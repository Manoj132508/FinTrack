import { createSlice } from '@reduxjs/toolkit'
import { defaultBudgets } from '../../utils/seed'

// Monthly budget caps keyed by expense category id, e.g. { food: 650 }.
// Loaded per-user from the API after sign-in, so we start empty.
const initialState = {
  monthly: {},
}

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    // Replace all budgets — used to hydrate from the server / clear on logout.
    setBudgetsAll(state, action) {
      state.monthly = action.payload && typeof action.payload === 'object' ? action.payload : {}
    },
    setBudget(state, action) {
      const { category, amount } = action.payload
      const value = Number(amount)
      if (!value || value <= 0) {
        delete state.monthly[category]
      } else {
        state.monthly[category] = value
      }
    },
    removeBudget(state, action) {
      delete state.monthly[action.payload]
    },
    resetBudgets(state) {
      state.monthly = defaultBudgets()
    },
  },
})

export const { setBudgetsAll, setBudget, removeBudget, resetBudgets } =
  budgetsSlice.actions
export default budgetsSlice.reducer
