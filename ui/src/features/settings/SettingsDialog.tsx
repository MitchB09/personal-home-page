import { useEffect, useState, type JSX } from "react"

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
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from "./settingsApiSlice"
import { AppType, type Payload } from "./types"

export type SettingsDialogProps = {
  open: boolean
  onClose: () => void
}

export const SettingsDialog = (props: SettingsDialogProps): JSX.Element => {
  const { open, onClose } = props
  const { data } = useGetUserSettingsQuery("1")
  const [formData, setFormData] = useState<Payload | undefined>(data)

  useEffect(() => {
    setFormData(data)
  }, [data])

  const [updateUserSettings] = useUpdateUserSettingsMutation()

  const saveUserSettings = () => {
    if (!formData) {
      throw Error("No Data Found")
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
      <DialogTitle>Select Apps</DialogTitle>
      <DialogContent>
        {formData && (
          <FormGroup>
            {Object.values(AppType).map(key => {
              return (
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.homePageData[key]}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={saveUserSettings}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}
