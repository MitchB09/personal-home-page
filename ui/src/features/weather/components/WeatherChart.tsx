import { useState, type JSX } from "react";

import { Typography } from "@mui/material";
import useId from '@mui/utils/useId';
import { 
  ChartContainer, 
  ChartsClipPath, 
  ChartsGrid, 
  ChartsLegend, 
  ChartsReferenceLine, 
  ChartsTooltip, 
  ChartsXAxis, 
  ChartsYAxis, 
  LinePlot 
} from "@mui/x-charts";
import { format } from 'date-fns';

import { DailyWeather } from "../types";


export type WeatherChartProps = {
  selectedDay: DailyWeather;
  data?: DailyWeather[];
} 

export const WeatherChart = (props: WeatherChartProps): JSX.Element => {
  const { selectedDay, data } = props;

  const id = useId();
  const clipPathId = `${id}-clip-path`;
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  setTimeout(() => {
    setCurrentTime(new Date());
  }, 1000)

  return (
    <>
      <span>
        <Typography variant="h5">{format(selectedDay?.time, "EEEE")}</Typography>
        <Typography variant="subtitle2">{format(selectedDay?.time, "MMM d")}</Typography>
      </span>
      <ChartContainer
        dataset={data?.flatMap(day => day.hourly)}
        xAxis={[
          {
            dataKey: 'time',
            scaleType: 'time',
            valueFormatter: (date: Date) => format(date, 'h aa'),
            min: selectedDay.time,
            max: new Date(new Date(selectedDay.time).setDate(selectedDay.time.getDate() + 1))
          }
        ]}
        yAxis={[
          { dataKey: 'temperature', min: 0, valueFormatter: (value: number) => `${value}°` },
          { dataKey: 'rain', min: 0 }
        ]}
        series={[
          { dataKey: 'temperature', type: 'line', valueFormatter: (value: number | null) => `${value}°C`, showMark: ({ index }) => index % 2 === 0, },
          { dataKey: 'rain', type: 'line', valueFormatter: (value: number | null) => `${value}mm`, showMark: false }]}
      >

        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsGrid vertical />
        <ChartsTooltip />
        <ChartsLegend />
        <g clipPath={`url(#${clipPathId})`}>
          <LinePlot />
          {data && data[0] === selectedDay && (<ChartsReferenceLine
            x={currentTime}
            lineStyle={{ strokeDasharray: '10 5' }}
            labelStyle={{ fontSize: '10', lineHeight: 1.2 }}
            label={format(currentTime, 'h:mm aa')}
            labelAlign="start"
          />)}
        </g>
        <ChartsClipPath id={clipPathId} />
      </ChartContainer>
    </>
  )
}
