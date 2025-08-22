import type { JSX } from "react"

import { Backdrop, Box, CircularProgress, Grid } from "@mui/material"
import { News } from "./features/news/News"
import { NFLSchedule } from "./features/nfl/NFLSchedule"
import { Weather } from "./features/weather/Weather"
import { useGetUserSettingsQuery } from "./features/settings/settingsApiSlice"

export const Home = (): JSX.Element => {
  const { data, isLoading } = useGetUserSettingsQuery("1")

  return (
    <Box>
      {isLoading || !data ? (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Grid container direction="row">
          {data.homePageData.weather && (
            <Grid
              sx={{ width: "40vw", height: "40vh" }}
              component="div"
              role="weather"
              className="tile"
            >
              <Weather />
            </Grid>
          )}
          {data.homePageData.news && (
            <Grid
              sx={{ width: "40vw", height: "50vh" }}
              component="div"
              role="news"
              className="tile"
            >
              <News />
            </Grid>
          )}
          {data.homePageData.nfl && (
            <Grid
              sx={{ width: "40vw", height: "55vh" }}
              component="div"
              role="news"
              className="tile"
            >
              <NFLSchedule />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  )
}
