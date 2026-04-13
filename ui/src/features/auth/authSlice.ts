import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from 'oidc-client-ts'
import type { RootState } from '../../app/store'

type AuthState = {
  user?: User
  token?: string
}

// Set user from sessionStorage if applicable
const localUser = sessionStorage.getItem(`oidc.user:https://cognito-idp.us-east-1.amazonaws.com/${import.meta.env.VITE_USERPOOL_ID as string}:${import.meta.env.VITE_USERPOOL_CLIENT_ID as string}`)
let sessonUser;
if (localUser) {
  sessonUser = JSON.parse(localUser) as User
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: sessonUser ? { user: sessonUser, token: sessonUser.id_token} : {} as AuthState,
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
export const selectUserId = (state: RootState): string => {
  const userId = state.auth.user?.profile.sub;
  if (!userId) {
    throw Error("No user found in session")
  }
  return userId;
}

