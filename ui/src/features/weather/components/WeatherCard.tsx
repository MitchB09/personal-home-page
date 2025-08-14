import { type JSX } from "react"

import SunnyIcon from "@mui/icons-material/Sunny"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material"
import { format } from "date-fns"

import type { DailyWeather, HourlyWeather } from "../types"

export type WeatherCardProps = {
  dailyWeather: DailyWeather
  selectedDay?: DailyWeather
  setSelectedDay: (day?: DailyWeather) => void
}

export const WeatherCard = (props: WeatherCardProps): JSX.Element => {
  const { dailyWeather, selectedDay, setSelectedDay } = props

  const getDailyTemps = (hours: HourlyWeather[]) => {
    return hours.map(hour => hour.temperature)
  }

  type DetailItem = {
    key: string
    value: string
  }

  const renderDetials = (detail: DetailItem) => {
    return (
      <ListItem key={detail.key} style={{ margin: "0em", padding: "0em" }}>
        <Typography variant="body1" component="div">
          {detail.key}: {detail.value}
        </Typography>
      </ListItem>
    )
  }

  const mapDetails = (day: DailyWeather) => {
    const details = [
      { key: "Sunrise", value: format(day.sunrise, "h:mm aa") },
      { key: "Sunset", value: format(day.sunset, "h:mm aa") },
      {
        key: "High",
        value: `${Math.max(...getDailyTemps(day.hourly)).toString()}°`,
      },
      {
        key: "Low",
        value: `${Math.min(...getDailyTemps(day.hourly)).toString()}°`,
      },
      {
        key: "Total Precipitation",
        value: `${day.hourly
          .map(hour => hour.rain)
          .reduce((accumulator, currentValue) => accumulator + currentValue)
          .toString()}mm`,
      },
    ] as DetailItem[]

    return (
      <List style={{ margin: "0em", padding: "0em" }}>
        {details.map(detail => renderDetials(detail))}
      </List>
    )
  }

  return (
    <Card>
      <CardActionArea
        onClick={() => {
          setSelectedDay(
            dailyWeather.time === selectedDay?.time ? undefined : dailyWeather,
          )
        }}
        data-active={selectedDay?.time === dailyWeather.time ? "" : undefined}
        sx={{
          height: "100%",
          "&[data-active]": {
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: "action.selectedHover",
            },
          },
        }}
      >
        <CardContent>
          <Stack style={{ width: "12em" }}>
            <Typography variant="h5" component="div">
              {format(dailyWeather.time, "EEEE")}
            </Typography>
            <Typography variant="caption" component="div">
              {format(dailyWeather.time, "MMM d")}
            </Typography>
            {!selectedDay && (
              <>
                <Box style={{ height: "2em", width: "2em" }}>
                  <SunnyIcon />
                </Box>
                {mapDetails(dailyWeather)}
              </>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
