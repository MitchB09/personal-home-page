import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Backdrop, CircularProgress, Grid } from "@mui/material"

import "./App.css"
import { Weather } from "./features/weather/Weather"
import { News } from "./features/news/News"
import { NFLSchedule } from "./features/nfl/NFLSchedule"
import { useGetUserSettingsQuery } from "./features/settings/settingsApiSlice"
import { MenuAppBar } from "./MenuAppBar"

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

export const App = () => {
  const { data, isLoading } = useGetUserSettingsQuery("1")

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MenuAppBar />
      <div className="App">
        <header className="App-header">
          {isLoading || !data ? (
            <Backdrop
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <Grid container direction="row">
              {data.homePageData.weather && (
                <Grid
                  sx={{ width: "40vw", height: "30vh" }}
                  component="div"
                  role="weather"
                  className="tile"
                >
                  <Weather />
                </Grid>
              )}
              {data.homePageData.news && (
                <Grid
                  sx={{ width: "40vw", height: "55vh" }}
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
        </header>
      </div>
    </ThemeProvider>
  )
}
