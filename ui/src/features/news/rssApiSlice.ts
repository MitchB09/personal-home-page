// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AddFeedForm, Payload } from "./types"
import type { RootState } from "../../app/store"

const url = import.meta.env.VITE_PERSONAL_DOMAIN as string

// Define a service using a base URL and expected endpoints
export const rssApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: url + "/rss/feeds",
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
  reducerPath: "rssApi",
  tagTypes: ["RSS"],
  endpoints: build => ({
    getRssSubsriptions: build.query<Payload[], string>({
      query: () => "/",
      providesTags: ["RSS"],
    }),
    getRssFeed: build.query<Payload, string>({
      query: (id: string) => {
        return `/${id}`
      },
      providesTags: (_result, _error, id) => [{ type: "RSS", id: id }],
    }),
    refreshRssFeed: build.mutation<Payload, string>({
      query: (id: string) => {
        return `/${id}?refresh=true`
      },
      invalidatesTags: (_result, _error, id) => [{ type: "RSS", id: id }],
    }),
    createRssSubscription: build.mutation<Payload, AddFeedForm>({
      query: body => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    deleteRssSubscription: build.mutation<undefined, string>({
      query: id => ({
        url: "/" + id,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "RSS", id: id }],
    }),
  }),
})

export const {
  useGetRssSubsriptionsQuery,
  useGetRssFeedQuery,
  useCreateRssSubscriptionMutation,
  useDeleteRssSubscriptionMutation,
  useRefreshRssFeedMutation,
} = rssApiSlice
