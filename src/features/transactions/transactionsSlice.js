import { createSlice, nanoid } from '@reduxjs/toolkit'
import { generateSeedTransactions } from '../../utils/seed'

// Data is loaded per-user from the API after sign-in, so we start empty.
const initialState = {
  items: [],
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Replace the whole list — used to hydrate from the server (and to clear on
    // logout). Deliberately NOT synced back by the sync listener.
    setAllTransactions(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : []
    },
    addTransaction: {
      reducer(state, action) {
        state.items.unshift(action.payload)
      },
      prepare({ type, category, amount, note, date }) {
        return {
          payload: {
            id: nanoid(),
            type,
            category,
            amount: Number(amount),
            note: note?.trim() || '',
            date,
          },
        }
      },
    },
    updateTransaction(state, action) {
      const { id, changes } = action.payload
      const txn = state.items.find((t) => t.id === id)
      if (txn) {
        Object.assign(txn, changes)
        if (changes.amount != null) txn.amount = Number(changes.amount)
      }
    },
    deleteTransaction(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
    clearAllTransactions(state) {
      state.items = []
    },
    loadSampleData(state) {
      state.items = generateSeedTransactions()
    },
  },
})

export const {
  setAllTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  clearAllTransactions,
  loadSampleData,
} = transactionsSlice.actions

export default transactionsSlice.reducer
