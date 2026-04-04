import { useState, type JSX } from "react"

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  Stack,
  TextField,
} from "@mui/material"
import { type RecipeForm } from "../types"
import { useCreateRecipeMutation } from "../recipeApiSlice"
import { selectRecipe, setRecipe } from "../recipeSlice"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"

export const RecipeDialog = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const recipe = useAppSelector(selectRecipe)
  const [formData, setFormData] = useState<RecipeForm | undefined>(recipe)
  const [updateRecipe] = useCreateRecipeMutation()

  const tags = ["Baking", "BBQ", "Soups"]

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = () => {
    if (!formData?.title || !formData.recipeUrl || !formData.tags) {
      throw Error("No Data Found")
    }

    updateRecipe({
      title: formData.title,
      recipeUrl: formData.recipeUrl,
      notes: formData.notes,
      tags: formData.tags,
      ...formData,
    })
      .then(() => {
        dispatch(setRecipe(undefined))
      })
      .catch((error: unknown) => {
        console.dir(error)
      })
  }

  return (
    <Dialog open={recipe !== undefined} maxWidth={"sm"} fullWidth={true}>
      <form onSubmit={handleSubmit} id="recipe-form">
        <DialogTitle>
          {recipe?.id ? "Add new recipe" : "Update recipe"}
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <Stack gap={1} margin={1}>
              <TextField
                name="title"
                label="Title"
                variant="standard"
                onChange={onChange}
                value={formData?.title ?? ""}
              />
              <TextField
                name="recipeUrl"
                label="Url"
                variant="standard"
                onChange={onChange}
                value={formData?.recipeUrl ?? ""}
              />
              <TextField
                name="notes"
                label="Notes"
                variant="standard"
                onChange={onChange}
                value={formData?.notes ?? ""}
              />
              <Autocomplete
                disablePortal
                onChange={(_, selected) => {
                  setFormData({
                    ...formData,
                    tags: [...selected],
                  })
                }}
                value={formData?.tags ?? []}
                options={tags}
                selectOnFocus
                clearOnBlur
                multiple={true}
                renderInput={params => (
                  <TextField {...params} variant="standard" label="Tags" />
                )}
              />
            </Stack>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(setRecipe(undefined))}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
