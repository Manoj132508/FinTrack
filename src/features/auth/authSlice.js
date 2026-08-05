import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api, getToken, setToken } from '../../api/client'
import { setAllTransactions, loadSampleData } from '../transactions/transactionsSlice'
import { setBudgetsAll, resetBudgets } from '../budgets/budgetsSlice'

// Pull the user's saved data from the API and push it into the data slices.
async function hydrateUserData(dispatch) {
  const data = await api.getData()
  dispatch(setAllTransactions(data.transactions || []))
  dispatch(setBudgetsAll(data.budgets || {}))
}

// On app start: if a token is stored, validate it and load the user's data.
export const bootstrapSession = createAsyncThunk(
  'auth/bootstrap',
  async (_, { dispatch, rejectWithValue }) => {
    const token = getToken()
    if (!token) return null
    try {
      const { user } = await api.me()
      await hydrateUserData(dispatch)
      return user
    } catch (err) {
      setToken(null)
      return rejectWithValue(err.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const { token, user } = await api.login(email, password)
      setToken(token)
      await hydrateUserData(dispatch)
      return user
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password }, { dispatch, getState, rejectWithValue }) => {
    try {
      const { token, user } = await api.register(email, password)
      setToken(token)
      // Give brand-new accounts a populated demo so the dashboard isn't empty.
      dispatch(loadSampleData())
      dispatch(resetBudgets())
      // Persist the seed explicitly: these mutations fire before status becomes
      // 'authenticated', so the sync listener would otherwise skip them.
      const state = getState()
      await api.saveData(state.transactions.items, state.budgets.monthly)
      return user
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const initialState = {
  user: null,
  token: getToken(),
  // 'idle' until bootstrap resolves; then 'authenticated' or 'anonymous'.
  status: 'idle',
  bootstrapped: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      setToken(null)
      state.user = null
      state.token = null
      state.status = 'anonymous'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Bootstrap
      .addCase(bootstrapSession.pending, (state) => {
        state.status = 'idle'
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.bootstrapped = true
        if (action.payload) {
          state.user = action.payload
          state.status = 'authenticated'
        } else {
          state.status = 'anonymous'
        }
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.bootstrapped = true
        state.token = null
        state.user = null
        state.status = 'anonymous'
      })
      // Login + Register share the same success/failure shape.
      .addMatcher(
        (a) => a.type === loginUser.pending.type || a.type === registerUser.pending.type,
        (state) => {
          state.status = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (a) => a.type === loginUser.fulfilled.type || a.type === registerUser.fulfilled.type,
        (state, action) => {
          state.user = action.payload
          state.token = getToken()
          state.status = 'authenticated'
          state.bootstrapped = true
          state.error = null
        }
      )
      .addMatcher(
        (a) => a.type === loginUser.rejected.type || a.type === registerUser.rejected.type,
        (state, action) => {
          state.status = 'anonymous'
          state.error = action.payload || 'Something went wrong.'
        }
      )
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectAuth = (state) => state.auth
export const selectIsAuthenticated = (state) => state.auth.status === 'authenticated'
export const selectCurrentUser = (state) => state.auth.user
