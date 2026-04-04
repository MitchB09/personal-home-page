import { useMemo, type JSX } from "react"

import { Backdrop, Box, CircularProgress, Grid } from "@mui/material"
import { useAppSelector } from "./app/hooks"
import { selectUserId } from "./features/auth/authSlice"
import { News } from "./features/news/News"
import { NFLSchedule } from "./features/nfl/NFLSchedule"
import { Recipes } from "./features/recipes/Recipes"
import { Weather } from "./features/weather/Weather"
import { useGetUserSettingsQuery } from "./features/settings/settingsApiSlice"
import { Apps, type AppState } from "./features/settings/types"

export const Home = (): JSX.Element => {
  const userId = useAppSelector(selectUserId)
  const { data, isLoading, isError } = useGetUserSettingsQuery(userId)

  const apps = useMemo(() => {
    if (data) {
      return data.homePageData
    } else if (isError) {
      return {
        [Apps.WEATHER]: true,
        [Apps.RECIPES]: true,
      } as AppState;
    } else {
      return {} as AppState;
    }
  }, [data, isError])

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {isLoading ? (
        <Backdrop open={true} sx={{ position: "absolute" }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Grid container direction="row">
          {apps[Apps.WEATHER] && (
            <Grid
              sx={{ width: "40vw", height: "40vh" }}
              component="div"
              role="weather"
              className="tile"
            >
              <Weather />
            </Grid>
          )}
          {apps[Apps.NEWS] && (
            <Grid
              sx={{ width: "40vw", height: "50vh" }}
              component="div"
              role="news"
              className="tile"
            >
              <News />
            </Grid>
          )}
          {apps[Apps.RECIPES] && (
            <Grid
              sx={{ width: "40vw", height: "50vh" }}
              component="div"
              role="news"
              className="tile"
            >
              <Recipes />
            </Grid>
          )}
          {apps[Apps.NFL] && (
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
