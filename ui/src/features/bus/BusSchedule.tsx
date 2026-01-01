import { type JSX } from "react"

import { Box, Paper } from "@mui/material"
import { useGetNextBusQuery } from "./busStopApiSlice"
import { FROM_HOME } from "./types"

export const BusSchedule = (): JSX.Element => {
  const { data, isError, isLoading, error /*, isSuccess*/ } = useGetNextBusQuery(
    FROM_HOME,
    {
      pollingInterval: 60 * 1000, //Poll every 60s
      skipPollingIfUnfocused: true,
    },
  )

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          lineHeight: "3em",
          borderBottom: 1,
          borderColor: "divider",
          padding: "0 0.5em",
        }}
      >
        <div>TEST</div>
        <div>{isLoading ? "LOADING" : "NOT LOADING "}</div>
        <div>{isError ? JSON.stringify(error) : "SUCCESS"}</div>
        <div>{data ? JSON.stringify(data) : "NO DATA"}</div>
      </Box>
    </Paper>
  )
}
