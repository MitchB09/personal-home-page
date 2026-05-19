import { useMemo, useState, type JSX } from "react"

import { Launch as LaunchIcon, Add as AddIcon } from "@mui/icons-material"
import {
  Autocomplete,
  Box,
  createFilterOptions,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RecipeDialog } from "./components/RecipeDialog"
import { useGetRecipesQuery } from "./recipeApiSlice"
import { createNewRecipe, selectTags, viewRecipe } from "./recipeSlice"
import type { Recipe } from "./types"

export const Recipes = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { data /* isError, isLoading isSuccess */ } = useGetRecipesQuery("")
  const tags = useAppSelector(selectTags)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const filterOptions = createFilterOptions<string>()

  const recipies = useMemo(() => {
    if (!data) {
      return []
    } else if (filterTags.length === 0) {
      return data
    } else {
      return data.filter((recipie: Recipe) => {
        return filterTags.some(selected => {
          return recipie.tags && recipie.tags.includes(selected)
        })
      })
    }
  }, [data, filterTags])

  if (!data) {
    return <>Loading...</>
  }

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Paper
        sx={theme => ({
          padding: ".5em 1em .5em 1em",
          backgroundColor: theme.palette.grey[900],
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
        })}
      >
        <Typography variant="h6">Recipies</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Autocomplete
          disablePortal
          onChange={(_, selected) => {
            setFilterTags(selected)
          }}
          value={filterTags}
          options={tags}
          selectOnFocus
          clearOnBlur
          multiple={true}
          handleHomeEndKeys
          filterOptions={(options, params) => {
            const filtered = filterOptions(options, params)

            const { inputValue } = params
            // Suggest the creation of a new value
            const isExisting = tags.some(tag => inputValue === tag)
            if (inputValue !== "" && !isExisting) {
              filtered.push(inputValue)
            }

            return filtered
          }}
          renderInput={params => (
            <TextField
              {...params}
              hiddenLabel
              variant="standard"
              margin="dense"
              sx={{ minWidth: "10em" }}
            />
          )}
        />
        <IconButton
          onClick={() => {
            dispatch(createNewRecipe())
          }}
        >
          <AddIcon />
        </IconButton>
      </Paper>
      <List
        sx={{
          overflow: "scroll",
          padding: "0em 1em 0em 0em",
        }}
      >
        {recipies.map(recipe => (
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
      <RecipeDialog />
    </Paper>
  )
}
