import type { JSX } from "react"
import { Paper } from "@mui/material"
import style from "./News.module.css"
import type { RssFeed } from "./types"
import { Feed } from "./components/Feed"

const subscriptions = [
  {
    title: "CBC New Brunswick",
    url: "https://cors.eu.org/https://www.cbc.ca/webfeed/rss/rss-canada-newbrunswick",
    items: [],
  },
  {
    title: "New YCombinator",
    url: "https://cors.eu.org/https://news.ycombinator.com/rss",
    items: [],
  },
] as RssFeed[]

export const News = (): JSX.Element => {
  return (
    <Paper className={style.container}>
      {subscriptions.map((subscription, index) => <Feed key={index} rssFeed={subscription} />)}
    </Paper>
  )
}
