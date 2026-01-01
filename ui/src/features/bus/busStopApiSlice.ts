// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Payload, Request } from "./types"

// Define a service using a base URL and expected endpoints
export const busStopApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://myride.fredericton.ca/Tmix.Cap.Ti.Process.AnyRide/api",
  }),

  reducerPath: "busRoutesApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["BusRoutes"],

  endpoints: build => ({
    getNextBus: build.query<Payload, Request>({
      query: (request: Request) => {
        console.dir(request)
        return {
          url: `/GetCalls`,
          method: "POST",
          body: {
            query: {
              toStopAreaName: "",
              directionId: 0,
              fromStopAreaQuery: request.fromStop,
              lineId: request.lineId,
            },
            configuration: { grouping: ["Line", "Destination1"] },
          },
        }
      },
      transformResponse: (response: Payload) => {
        console.dir(response);
        return response;
      },
      providesTags: ["BusRoutes"],
    }),
  }),
})

export const { useGetNextBusQuery } = busStopApiSlice
