import { type JSX } from "react"

import {
  Box,
  Paper
} from "@mui/material"
import { BusRoute } from "./BusRoute"
import { FROM_HOME, FROM_OFFICE } from "./types"

export const BusSchedule = (): JSX.Element => {

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
        <BusRoute name="12N From Office" route={FROM_OFFICE} />
        <BusRoute name="13S From Home" route={FROM_HOME} />
      </Box>
    </Paper>
  )
}
