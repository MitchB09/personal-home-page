import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

import "./App.css"
import { Weather } from "./features/weather/Weather"
import { News } from "./features/news/News"
import { Grid } from "@mui/material"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

export const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
      <header className="App-header">
        <Grid container direction="row">
          <Grid
            sx={{ width: "40vw", height: "30vh" }}
            component="div"
            role="weather"
            className="tile"
          >
            <Weather />
          </Grid>
          <Grid
            sx={{ width: "40vw", height: "55vh" }}
            component="div"
            role="news"
            className="tile"
          >
            <News />
          </Grid>
        </Grid>
      </header>
    </div>
  </ThemeProvider>
)
