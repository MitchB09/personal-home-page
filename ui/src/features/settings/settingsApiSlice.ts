// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Payload } from "./types"

// Define a service using a base URL and expected endpoints
export const settingsApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://home-api-prod.bilensky.ca/settings/",
  }),
  reducerPath: "settingsApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["Settings"],

  endpoints: build => ({
    getUserSettings: build.query<Payload, string>({
      query: id => `/${id}`,
      providesTags: ['Settings'],
    }),
    updateUserSettings: build.mutation<Payload, Payload>({
      query: body => ({
        url: `/${body.id}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
})

export const {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation
} = settingsApiSlice
