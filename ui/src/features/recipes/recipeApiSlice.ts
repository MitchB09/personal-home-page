// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Recipe } from "./types"
import type { RootState } from "../../app/store"

const url = import.meta.env.VITE_PERSONAL_DOMAIN as string

// Define a service using a base URL and expected endpoints
export const recipeApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: url + "/recipes",
    prepareHeaders: (headers, { getState }) => {
      // Add common headers like Authorization
      const rootState = getState() as RootState
      const token = rootState.auth.token
      if (!token) {
        throw new Error("No Auth Token Found")
      }
      headers.set("Authorization", `Bearer ${token}`)
      return headers
    },
  }),
  reducerPath: "recipeApi",
  tagTypes: ["RECIPIES"],
  endpoints: build => ({
    getRecipes: build.query<Recipe[], string>({
      query: () => "/",
      providesTags: ["RECIPIES"],
    }),
    getRecipe: build.query<Recipe, string>({
      query: (id: string) => {
        return `/${id}`
      },
      providesTags: (_result, _error, id) => [{ type: "RECIPIES", id: id }],
    }),
    postRecipe: build.mutation<Recipe, Recipe>({
      query: body => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    deleteRecipe: build.mutation<undefined, string>({
      query: id => ({
        url: "/" + id,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "RECIPIES", id: id }],
    }),
  }),
})

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  usePostRecipeMutation,
  useDeleteRecipeMutation,
} = recipeApiSlice
