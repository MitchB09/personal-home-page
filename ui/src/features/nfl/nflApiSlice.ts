// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Game, ResponsePayload, ScheduleContent } from "./types"

// Define a service using a base URL and expected endpoints
export const nflApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://cdn.espn.com/core/nfl" }),
  reducerPath: "nflApi",
  // Tag types are used for caching and invalidation.
  endpoints: build => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getSchedule: build.query<ScheduleContent, void>({
      query: () => {
        return 'schedule?xhr=1'
      },
      transformResponse: (response: ResponsePayload) => {
        Object.keys(response.content.schedule).forEach(key => {
          let games = [...response.content.schedule[key].games]
          games = games.sort((a: Game, b: Game) => {
            if (a.date < b.date) {
              return -1
            } else if (a.date > b.date) {
              return 1
            } else {
              return 0
            }
          })
          response.content.schedule[key].games = games
        })
        return response.content
      },
    }),
  }),
})

export const { useGetScheduleQuery } = nflApiSlice
