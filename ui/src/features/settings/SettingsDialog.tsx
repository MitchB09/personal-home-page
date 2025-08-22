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
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from "./settingsApiSlice"
import type { Payload } from "./types"

export type SettingsDialogProps = {
  open: boolean
  onClose: () => void
}

export const SettingsDialog = (props: SettingsDialogProps): JSX.Element => {
  const { open, onClose } = props
  const { data } = useGetUserSettingsQuery("1")
  const [formData, setFormData] = useState<Payload | undefined>(data)

  const [updateUserSettings] = useUpdateUserSettingsMutation()

  const saveUserSettings = () => {
    if (!formData) {
      throw Error('No Data Found')
    }
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
        {formData && <FormGroup>
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
        </FormGroup>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={saveUserSettings}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}
