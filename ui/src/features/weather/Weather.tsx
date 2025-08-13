import type { JSX } from "react"
import { useRef, useState } from "react"

import { Backdrop, Box, CircularProgress, Grow, Stack } from "@mui/material"

import { WeatherCard } from "./components/WeatherCard"
import { WeatherChart } from "./components/WeatherChart"
import type { DailyWeather, WeatherRequest } from "./types"
import { useGetWeatherQuery } from "./weatherApiSlice"

const params: WeatherRequest = {
  latitude: 45.974946,
  longitude: -66.6465922,
  forecastDays: 3,
  hourly: ["temperature_2m", "rain"],
  daily: ["sunrise", "sunset"],
}

export const Weather = (): JSX.Element => {
  const { data, isError, isLoading /*, isSuccess*/ } =
    useGetWeatherQuery(params)

  const [selectedDay, setSelectedDay] = useState<DailyWeather | undefined>()
  const containerRef = useRef<HTMLElement>(null)

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <Box ref={containerRef}>
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack direction="row" spacing={2}>
        {data?.map(day => (
          <WeatherCard
            key={day.time.toUTCString()}
            dailyWeather={day}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        ))}
      </Stack>
      {selectedDay && (
        <Grow
          in={!!selectedDay}
          style={{ transformOrigin: "0 0 0" }}
          timeout={1000}
        >
          <Box style={{ height: "300px", margin: "1em 0em" }}>
            <WeatherChart selectedDay={selectedDay} data={data} />
          </Box>
        </Grow>
      )}
    </Box>
  )
}
