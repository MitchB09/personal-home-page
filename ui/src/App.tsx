import { useEffect } from "react"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Button } from "@mui/material"
import { useAuth } from "react-oidc-context"

import "./App.css"
import { MenuAppBar } from "./MenuAppBar"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { selectUser, setCredentials } from "./features/auth/authSlice"
import { Home } from "./Home"

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

export const App = () => {
  const auth = useAuth()
  const dispatch = useAppDispatch()
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MenuAppBar />
      <div className="App">
        <header className="App-header">
          {!user ? (
            <Button
              onClick={() => {
                void auth.signinRedirect()
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
