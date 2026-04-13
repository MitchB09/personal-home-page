import { type JSX } from "react"

import EditIcon from "@mui/icons-material/Edit"
import LaunchIcon from "@mui/icons-material/Launch"
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  IconButton,
  Stack,
  TextField,
} from "@mui/material"
import { usePostRecipeMutation } from "../recipeApiSlice"
import {
  selectRecipe,
  resetForm,
  updateRecipe,
  selectMode,
  Mode,
} from "../recipeSlice"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const RecipeDialog = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const recipe = useAppSelector(selectRecipe)
  const mode = useAppSelector(selectMode)
  const [postRecipe] = usePostRecipeMutation()

  const tags = ["Baking", "BBQ", "Soups"]

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateRecipe({
        ...recipe,
        [event.target.name]: event.target.value,
      }),
    )
  }

  const handleSubmit = () => {
    if (!recipe?.title || !recipe.recipeUrl || !recipe.tags) {
      throw Error("No Data Found")
    }

    postRecipe({
      title: recipe.title,
      recipeUrl: recipe.recipeUrl,
      tags: recipe.tags,
      ...recipe,
    })
      .then(() => {
        dispatch(resetForm())
      })
      .catch((error: unknown) => {
        console.dir(error)
      })
  }

  return (
    <Dialog open={recipe !== undefined} maxWidth={"sm"} fullWidth={true}>
      {mode === Mode.EDIT && (
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
                  value={recipe?.title ?? ""}
                />
                <TextField
                  name="recipeUrl"
                  label="Url"
                  variant="standard"
                  onChange={onChange}
                  value={recipe?.recipeUrl ?? ""}
                />
                <TextField
                  name="notes"
                  label="Notes"
                  variant="standard"
                  multiline
                  minRows={3}
                  onChange={onChange}
                  value={recipe?.notes ?? ""}
                />
                <Autocomplete
                  disablePortal
                  onChange={(_, selected) => {
                    dispatch(
                      updateRecipe({
                        ...recipe,
                        tags: [...selected],
                      }),
                    )
                  }}
                  value={recipe?.tags ?? []}
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
            <Button onClick={() => dispatch(resetForm())}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </DialogActions>
        </form>
      )}
      {mode === Mode.VIEW && (
        <>
          <DialogTitle>
            {recipe?.title}
            <IconButton
              aria-label="edit"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                dispatch(updateRecipe(recipe!));
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="launch"
              onClick={() => {
                window.open(recipe?.recipeUrl, "_blank", "noopener,noreferrer")
              }}
            >
              <LaunchIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Stack gap={1} margin={1}>
              {recipe?.notes && (<Box>
                <Markdown remarkPlugins={[remarkGfm]}>{recipe.notes}</Markdown>
              </Box>)}
              <Box>
                {recipe?.tags?.map(tag => {
                  return <Chip label={tag} />
                })}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(resetForm())}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
