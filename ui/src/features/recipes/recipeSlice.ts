import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { type RecipeForm } from "./types"
import { recipeApiSlice } from "./recipeApiSlice"

export enum Mode {
  VIEW,
  EDIT
}

export const defaultTags = [
  "Baking", 
  "BBQ", 
  "Soups",
  "Sides"
] as string[]

type RecipeState = {
  recipeForm?: RecipeForm
  tags: string[],
  mode: Mode
}

export const recipeSlice = createSlice({
  name: "recipe",
  initialState: { mode: Mode.VIEW, tags: defaultTags } as RecipeState,
  extraReducers: (builder) => {
    builder.addMatcher(
      recipeApiSlice.endpoints.getRecipes.matchFulfilled,
      (state, { payload }) => {
        console.dir(payload);
        const found = new Set<string>(defaultTags);
        payload.forEach(recipe => {
          recipe.tags?.forEach(element => {
            found.add(element)
          });
        })
        state.tags = [...found]; 
      }
    )
  },
  reducers: {
    viewRecipe: (state, { payload }: PayloadAction<RecipeForm | undefined>) => {
      state.recipeForm = payload;
      state.mode = Mode.VIEW
    },
    createNewRecipe: (state) => {
      state.recipeForm = {};
      state.mode = Mode.EDIT
    },
    updateRecipe: (state, { payload }: PayloadAction<RecipeForm>) => {
      state.recipeForm = payload;
      state.mode = Mode.EDIT;
    },
    setRecipe: (state, { payload }: PayloadAction<{ recipe: RecipeForm | undefined, mode: Mode }>) => {
      state.recipeForm = payload.recipe;
      state.mode = payload.mode;
    },
    resetForm: (state) => {
      state.recipeForm = undefined;
      state.mode = Mode.VIEW;
    },
  },
})

export const { viewRecipe, createNewRecipe, updateRecipe, setRecipe, resetForm } = recipeSlice.actions

export default recipeSlice.reducer


export const selectRecipe = (state: RootState) => state.recipe.recipeForm
export const selectMode = (state: RootState) => state.recipe.mode
export const selectTags = (state: RootState) => state.recipe.tags
