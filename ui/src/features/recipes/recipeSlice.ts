import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { type RecipeForm } from "./types"

export enum Mode {
  VIEW,
  EDIT
}

type RecipeState = {
  recipeForm?: RecipeForm
  mode: Mode
}

export const recipeSlice = createSlice({
  name: "recipe",
  initialState: { mode: Mode.VIEW } as RecipeState,
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

