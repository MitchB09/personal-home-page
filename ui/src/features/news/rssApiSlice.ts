// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Payload } from "./types"

// Define a service using a base URL and expected endpoints
export const rssApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://769fi9t619.execute-api.us-east-1.amazonaws.com/dev",
  }),
  reducerPath: "rssApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["RSS"],
  endpoints: build => ({
    getRssFeeds: build.query<Payload[], undefined>({
      query: () => '/',
    }),
    getRssFeed: build.query<Payload, string>({
      query: id => id,
    }),
  }),
})

export const { useGetRssFeedsQuery, useGetRssFeedQuery } = rssApiSlice
