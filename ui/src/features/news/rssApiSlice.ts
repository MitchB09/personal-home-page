// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { AddFeedForm, Payload } from "./types"

// Define a service using a base URL and expected endpoints
export const rssApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://home-api-prod.bilensky.ca/rss/feeds",
  }),
  reducerPath: "rssApi",
  tagTypes: ["RSS"],
  endpoints: build => ({
    getRssSubsriptions: build.query<Payload[], string>({
      query: () => "/",
    }),
    getRssFeed: build.query<Payload, string>({
      query: (id: string) => {
        return `/${id}`
      },
      providesTags: (result, error, id) => [{ type: "RSS", id: id }],
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
      invalidatesTags: (result, error, id) => [{ type: "RSS", id: id }],
    }),
  }),
})

export const {
  useGetRssSubsriptionsQuery,
  useGetRssFeedQuery,
  useCreateRssSubscriptionMutation,
  useDeleteRssSubscriptionMutation,
} = rssApiSlice
