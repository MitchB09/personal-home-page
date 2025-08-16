// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AddFeedForm, Payload } from "./types"

// Define a service using a base URL and expected endpoints
export const rssApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://home-api-prod.bilensky.ca/rss/",
  }),
  reducerPath: "rssApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["RSS", "Subscriptions"],
  endpoints: build => ({
    getRssSubsriptions: build.query<Payload[], string>({
      query: (id) => "/",
      providesTags: ['Subscriptions'], // associate the result of this mutation with the "users" tag
    }),
    createRssSubscription: build.mutation<Payload, AddFeedForm>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscriptions']
    }),
    getRssFeeds: build.query<Payload[], string[]>({
      query: (ids: string[]) => {
        return "/feeds?" + ids.map(id => `id=${id}`).join("&")
      },
    }),
  }),
})

export const { useGetRssSubsriptionsQuery, useGetRssFeedsQuery, useCreateRssSubscriptionMutation } = rssApiSlice
