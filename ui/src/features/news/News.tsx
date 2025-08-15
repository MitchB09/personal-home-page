import type { JSX } from "react"
import { Paper } from "@mui/material"
import style from "./News.module.css"
import { Feed } from "./components/Feed"

const urls = [
  "1",
  "2",
]

export const News = (): JSX.Element => {
  return (
    <Paper className={style.container}>
      {urls.map((url, index) => (
        <Feed key={index} id={url} />
      ))}
    </Paper>
  )
}
