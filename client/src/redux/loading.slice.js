import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {createSelector} from 'reselect'
import userApi from '../api/user.api'
import authApi from '../api/auth.api'

const initialState = {
	user: {
		data: {
	    success: false,
			isLoading: false,
	    message: '',
	  },
	  auth: {
	    success: false,
			isLoading: false,
	    message: '',
	  }
	},
  
}

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setUserDataLoading(state, { payload }) {
      state.user.data = payload
    },
    setAuthLoading(state, { payload }) {
      state.user.auth = payload
    },
		setAuthLoadingSilently(state, { payload }) {
			payload.message = ''
		  state.user.auth = payload
		}
  }
})

export default loadingSlice.reducer
export const {
  setUserDataLoading,
  setAuthLoading,
	setAuthLoadingSilently
} = loadingSlice.actions

export const selectLoading = state => state.loading

export const selectUserLoading = createSelector(selectLoading, (loading) => loading.user)
export const selectUserDataLoading = createSelector(selectUserLoading, (userLoading) => userLoading.data)
export const selectAuthLoading = createSelector(selectUserLoading, (userLoading) => userLoading.auth)