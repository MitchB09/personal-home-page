import React, { type JSX } from "react"

import LogoutIcon from "@mui/icons-material/Logout"
import SettingsIcon from "@mui/icons-material/Settings"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import { SettingsDialog } from "./features/settings/SettingsDialog"
import { useAppSelector } from "./app/hooks"
import { selectUser } from "./features/auth/authSlice"

const logout = () => {
  const clientId = import.meta.env.VITE_USERPOOL_CLIENT_ID as string
  const logoutUri = import.meta.env.VITE_REDIRECT_URL as string
  const cognitoDomain =
    "https://home-page-dev-dev.auth.us-east-1.amazoncognito.com"
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
}

export const MenuAppBar = (): JSX.Element => {
  const [open, setOpen] = React.useState(false)
  const user = useAppSelector(selectUser)

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Personal Home Page
        </Typography>
        <div>
          {user && (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => {
                  setOpen(true)
                }}
                color="inherit"
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => {
                  logout()
                }}
                color="inherit"
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </div>
      </Toolbar>
      {user && (
        <SettingsDialog
          open={open}
          onClose={() => {
            setOpen(false)
          }}
        />
      )}
    </AppBar>
  )
}
