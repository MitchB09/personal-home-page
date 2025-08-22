// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Payload } from "./types"
import type { RootState } from "../../app/store"

const url = import.meta.env.VITE_PERSONAL_DOMAIN as string

// Define a service using a base URL and expected endpoints
export const settingsApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${url}/settings/`,
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

  reducerPath: "settingsApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["Settings"],

  endpoints: build => ({
    getUserSettings: build.query<Payload, string>({
      query: id => `/${id}`,
      providesTags: ["Settings"],
    }),
    updateUserSettings: build.mutation<Payload, Payload>({
      query: body => ({
        url: `/${body.id}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
})

export const { useGetUserSettingsQuery, useUpdateUserSettingsMutation } =
  settingsApiSlice
