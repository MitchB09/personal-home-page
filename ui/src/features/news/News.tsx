import type { JSX } from "react"
import { Paper } from "@mui/material"
import style from "./News.module.css"
import { Feed } from "./components/Feed"

const urls = [
  "https://769fi9t619.execute-api.us-east-1.amazonaws.com/dev/1",
  "https://769fi9t619.execute-api.us-east-1.amazonaws.com/dev/2",
]

export const News = (): JSX.Element => {
  return (
    <Paper className={style.container}>
      {urls.map((url, index) => (
        <Feed key={index} url={url} />
      ))}
    </Paper>
  )
}
