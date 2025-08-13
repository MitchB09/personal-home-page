import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

import "./App.css"
import { Weather } from "./features/weather/Weather"

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
        <div role="weather">
          <Weather />
        </div>
      </header>
    </div>
  </ThemeProvider>
)
