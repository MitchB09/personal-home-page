import { useMemo, useState, type JSX } from "react"

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
import { useAppSelector } from "../../app/hooks"
import { selectUserId } from "../auth/authSlice"
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from "./settingsApiSlice"
import { Apps, type AppState, type Payload } from "./types"

export type SettingsDialogProps = {
  open: boolean
  onClose: () => void
}

export const SettingsDialog = (props: SettingsDialogProps): JSX.Element => {
  const { open, onClose } = props
  const userId = useAppSelector(selectUserId)
  const { data } = useGetUserSettingsQuery(userId)

  const apps = useMemo(() => {
    const list = {} as AppState
    Object.values(Apps).map(app => {
      list[app] = false
    })

    if (data) {
      for (const [key, value] of Object.entries(data.homePageData)) {
        list[key as Apps] = value
      }
    }
    return list
  }, [data])

  const [formData, setFormData] = useState<AppState | undefined>(apps)

  const [updateUserSettings] = useUpdateUserSettingsMutation()

  const saveUserSettings = () => {
    if (!formData) {
      throw Error("No Data Found")
    }
    const payload = {
      ...data,
      id: userId,
      homePageData: formData,
    } as Payload
    updateUserSettings(payload)
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
        {formData && (
          <FormGroup>
            {Object.entries(formData).map(([key, value]) => {
              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      checked={value}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setFormData({
                          ...formData,
                          [key]: event.target.checked,
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
