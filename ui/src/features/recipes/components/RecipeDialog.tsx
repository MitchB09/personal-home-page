import { useState, type JSX } from "react"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
} from "@mui/material"
import { type Recipe } from "../types"
import { useCreateRecipeMutation } from "../recipeApiSlice"

export type SettingsDialogProps = {
  open: boolean
  recipe?: Recipe,
  onClose: () => void
}

export const SettingsDialog = (props: SettingsDialogProps): JSX.Element => {
  const { recipe, open, onClose } = props
  const [formData, setFormData] = useState<Recipe | undefined>(recipe)
    const [updateRecipe] = useCreateRecipeMutation()
  

  const saveUserSettings = () => {
    if (!formData) {
      throw Error("No Data Found")
    }

    updateRecipe(formData)
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
