import { useEffect } from "react"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Button } from "@mui/material"
import { useAuth } from "react-oidc-context"

import "./App.css"
import { MenuAppBar } from "./MenuAppBar"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import {
  selectToken,
  selectUser,
  setCredentials,
} from "./features/auth/authSlice"
import { Home } from "./Home"
import api from "./api"

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

export const App = () => {
  const auth = useAuth()
  const dispatch = useAppDispatch()
  const token = useAppSelector(selectToken)
  const user = useAppSelector(selectUser)

  useEffect(() => {
    if (auth.user) {
      if (auth.user.expired) {
        void auth.removeUser()
      } else {
        dispatch(setCredentials({ user: auth.user }))
      }
    }
  }, [dispatch, auth])

  useEffect(() => {
    if (token) {
      api.interceptors.request.use(config => {
        config.headers.Authorization = token
        return config
      })
    }
  }, [token])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MenuAppBar />
      <div className="App">
        <header className="App-header">
          {!user ? (
            <Button
              onClick={() => {
                try {
                  void auth.signinRedirect()
                } catch {
                  void auth.signinRedirect()
                }
              }}
            >
              Sign in
            </Button>
          ) : (
            <Home />
          )}
        </header>
      </div>
    </ThemeProvider>
  )
}
