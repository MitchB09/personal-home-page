import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

import "./App.css"
import { Weather } from "./features/weather/Weather"
import { News } from "./features/news/News"
import { Grid } from "@mui/material"
import { NFLSchedule } from "./features/nfl/NFLSchedule"

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

type AppState = Record<string, boolean>

const appState: AppState = {
  weather: true,
  news: false,
  nfl: true,
}

export const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
      <header className="App-header">
        <Grid container direction="row">
          {appState.weather && (
            <Grid
              sx={{ width: "40vw", height: "30vh" }}
              component="div"
              role="weather"
              className="tile"
            >
              <Weather />
            </Grid>
          )}
          {appState.news && (
            <Grid
              sx={{ width: "40vw", height: "55vh" }}
              component="div"
              role="news"
              className="tile"
            >
              <News />
            </Grid>
          )}
          {appState.nfl && (
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
      </header>
    </div>
  </ThemeProvider>
)
