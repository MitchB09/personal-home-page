import React, { type JSX } from "react"
import { useAuth } from "react-oidc-context"

import {
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import { SettingsDialog } from "./features/settings/SettingsDialog"
import { useAppSelector } from "./app/hooks"
import { selectUser } from "./features/auth/authSlice"
import { UserDialog } from "./features/auth/UserDialog"

export const MenuAppBar = (): JSX.Element => {
  const [open, setOpen] = React.useState(false)

  const [userDialogOpen, setUserDialogOpen] = React.useState(false)

  const user = useAppSelector(selectUser);
  const auth = useAuth();

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
                  setUserDialogOpen(true)
                }}
                color="inherit"
              >
                <PersonIcon />
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => {
                  void auth.signoutRedirect()
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
      {user && (
        <UserDialog
          open={userDialogOpen}
          onClose={() => {
            setUserDialogOpen(false)
          }}
        />
      )}
    </AppBar>
  )
}
