export type WeatherDaily = {
  time: string[],
  sunrise: string[],
  sunset: string[]
}

export type WeatherHourly = {
  time: string[],
  temperature_2m: number[],
  rain: number[],
}

export type WeatherRequest = {
  latitude: number,
  longitude: number,
  forecastDays: number,
  hourly?: string[],
  daily?: string[]
}

export type WeatherResponse = {
  latitude: number,
  longitude: number,
  elevation: number,
  generationtime_ms: number,
  utc_offset_seconds: number,
  timezone: string,
  timezone_abbreviation: string,
  hourly: WeatherHourly,
  daily: WeatherDaily,
}

export type HourlyWeather = {
  index: number;
  hour: string;
  hourDate: Date;
  time: Date
  temperature: number;
  rain: number;
}

export type DailyWeather = {
  time: Date;
  sunrise: Date;
  sunset: Date;
  hourly: HourlyWeather[]
}