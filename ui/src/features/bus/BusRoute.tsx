import { type JSX } from "react"

import {
  Backdrop,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material"
import { Error } from "@mui/icons-material"
import { useGetNextBusQuery } from "./busStopApiSlice"
import type { Request } from "./types"
import { format } from "date-fns"

export type BusRouteProps = {
  name: string
  route: Request
}

export const BusRoute = (props: BusRouteProps): JSX.Element => {
  const { name, route } = props

  const response = useGetNextBusQuery(
    route /*, {
    pollingInterval: 60 * 1000, //Poll every 60s
    skipPollingIfUnfocused: true,
  } */,
  )

  return (
    <Stack direction="column" spacing={{ xs: 1, sm: 2 }} useFlexGap>
      <Typography variant="h6">{name}</Typography>

      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={response.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {response.error && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Error />
          <Typography sx={{ fontStyle: "italic" }}>Error</Typography>
        </Stack>
      )}
      {response.data?.length
        ? response.data.map(run => {
            return <div>{format(run.departure.forecastTime, "h:mm aa")}</div>
          })
        : "No Data"}
    </Stack>
  )
}
