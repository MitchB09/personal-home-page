import type { JSX } from "react"
import { useRef } from "react"

import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material"

import { useGetScheduleQuery } from "./nflApiSlice"
import { format, parse } from "date-fns"
import { BoxScore } from "./components/BoxScore"

export const NFLSchedule = (): JSX.Element => {
  const { data, isError, isLoading /*, isSuccess*/ } = useGetScheduleQuery(undefined, {
    pollingInterval: 60 * 1000, //Poll every 30s
    skipPollingIfUnfocused: true,
  })

  const containerRef = useRef<HTMLElement>(null)

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    )
  }

  return (
    <Box sx={{ height: "100%" }} ref={containerRef}>
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {Object.entries(data?.schedule ?? {}).map(([key, value]) => {
        return (
          <Box>
            <Stack>
              <Typography variant="h6">
                {format(parse(key, "yyyyMMdd", new Date()), "EEE MMM d")}
              </Typography>
              {value.games
                .map(game => (
                  <BoxScore key={game.id} game={game} />
                ))}
            </Stack>
          </Box>
        )
      })}
    </Box>
  )
}
