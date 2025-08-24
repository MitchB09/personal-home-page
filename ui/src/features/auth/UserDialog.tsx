import { useState, type JSX } from "react"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  Stack,
} from "@mui/material"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "./authSlice"
import type { IdTokenClaims } from "oidc-client-ts"

export type UserDialogProps = {
  open: boolean
  onClose: () => void
}

export const UserDialog = (props: UserDialogProps): JSX.Element => {
  const { open, onClose } = props
  const user = useAppSelector(selectUser)

  const [formData /*, setFormData */] = useState<IdTokenClaims | undefined>(
    user?.profile,
  )

  const setField = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    console.dir(event)
    console.dir(formData)
  }

  const saveUserSettings = () => {
    if (!formData) {
      throw Error("No Data Found")
    }
    console.dir(formData)
  }

  return (
    <Dialog maxWidth="sm" fullWidth={true} onClose={onClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <DialogContent>
        {formData && (
          <FormGroup>
            <Stack spacing={2}>
              <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="outlined-adornment-password">
                  User ID
                </InputLabel>
                <Input
                  name="sub"
                  type="text"
                  disabled={true}
                  value={formData.sub}
                  margin="dense"
                  fullWidth
                  onChange={setField}
                />
              </FormControl>
              <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="outlined-adornment-password">
                  Username
                </InputLabel>
                <Input
                  name="cognito:username"
                  type="text"
                  disabled={true}
                  value={formData["cognito:username"]}
                  margin="dense"
                  fullWidth
                  onChange={setField}
                />
              </FormControl>
            </Stack>
          </FormGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled onClick={saveUserSettings}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}
