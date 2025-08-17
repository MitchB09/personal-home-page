import React, { type JSX } from "react"

import SettingsIcon from "@mui/icons-material/Settings"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import { useGetUserSettingsQuery } from "./features/settings/settingsApiSlice"
import { SettingsDialog } from "./features/settings/SettingsDialog"

export const MenuAppBar = (): JSX.Element => {
  const { data } = useGetUserSettingsQuery("1")
  const [open, setOpen] = React.useState(false)

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
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => { setOpen(true)}}
            color="inherit"
          >
            <SettingsIcon />
          </IconButton>
        </div>
      </Toolbar>
      {data && (
        <SettingsDialog
          data={data}
          open={open}
          onClose={() => {
            setOpen(false)
          }}
        />
      )}
    </AppBar>
  )
}
