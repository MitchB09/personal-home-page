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
          <Grid component="div" role="weather" className="tile">
            <Weather />
          </Grid>
          <Grid component="div" role="news" className="tile">
            <News />
          </Grid>
        </Grid>
      </header>
    </div>
  </ThemeProvider>
)
