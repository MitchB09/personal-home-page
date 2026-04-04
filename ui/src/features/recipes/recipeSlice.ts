import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { type RecipeForm } from "./types"

type RecipeState = {
  recipeForm?: RecipeForm
}

export const recipeSlice = createSlice({
  name: "recipe",
  initialState: {} as RecipeState,
  reducers: {
    setRecipe: (state, { payload }: PayloadAction<RecipeForm | undefined>) => {
      state.recipeForm = payload
    },
  },
})

export const { setRecipe } = recipeSlice.actions

export default recipeSlice.reducer

export const selectRecipe = (state: RootState) => state.recipe.recipeForm
