import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { User } from 'oidc-client-ts'

type AuthState = {
  user?: User
  token?: string
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {} as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user },
      }: PayloadAction<{ user: User }>,
    ) => {
      state.user = user
      state.token = user.id_token
    },
  },
})

export const { setCredentials } = authSlice.actions

export default authSlice.reducer

export const selectToken = (state: RootState) => state.auth.token
export const selectUser = (state: RootState) => state.auth.user

