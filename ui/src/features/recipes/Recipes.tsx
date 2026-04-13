import { type JSX } from "react"

import { Launch as LaunchIcon } from "@mui/icons-material"
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper
} from "@mui/material"
import { useAppDispatch } from "../../app/hooks"
import { RecipeDialog } from "./components/RecipeDialog"
import { useGetRecipesQuery } from "./recipeApiSlice"
import { createNewRecipe, viewRecipe } from "./recipeSlice"

export const Recipes = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { data /* isError, isLoading isSuccess */ } = useGetRecipesQuery("")

  if (!data) {
    return <>Loading...</>
  }

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <List>
        {data.map(recipe => (
          <ListItem
            key={recipe.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="launch"
                onClick={() => {
                  window.open(recipe.recipeUrl, "_blank", "noopener,noreferrer")
                }}
              >
                <LaunchIcon />
              </IconButton>
            }
          >
            <ListItemButton onClick={() => dispatch(viewRecipe(recipe))}>
              <ListItemText>{recipe.title}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button
        onClick={() => {
          dispatch(createNewRecipe())
        }}
      >
        Add
      </Button>
      <RecipeDialog />
    </Paper>
  )
}
