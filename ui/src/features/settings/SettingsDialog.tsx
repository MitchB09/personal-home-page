import { useState, type JSX } from "react"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material"
import { useUpdateUserSettingsMutation } from "./settingsApiSlice"
import type { Payload } from "./types"

export type SettingsDialogProps = {
  data: Payload
  open: boolean
  onClose: () => void
}

export const SettingsDialog = (props: SettingsDialogProps): JSX.Element => {
  const { data, open, onClose } = props

  const [formData, setFormData] = useState<Payload>(data)
  const [updateUserSettings] = useUpdateUserSettingsMutation()

  const saveUserSettings = () => {
    updateUserSettings(formData)
      .then(() => {
        onClose()
      })
      .catch((error: unknown) => {
        console.dir(error)
      })
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <DialogContent>
        <FormGroup>
          {Object.entries(formData.homePageData).map(([key, value]) => {
            return (
              <FormControlLabel
                control={
                  <Switch
                    checked={value}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({
                        ...formData,
                        homePageData: {
                          ...formData.homePageData,
                          [key]: event.target.checked,
                        },
                      })
                    }}
                  />
                }
                label={key}
              />
            )
          })}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={saveUserSettings}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}
