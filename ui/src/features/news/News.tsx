import { useState, type JSX } from "react"

import SettingsIcon from "@mui/icons-material/Settings"
import { Box, Paper, Tab, Tabs } from "@mui/material"
import style from "./News.module.css"
import { Feed } from "./components/Feed"
import { useGetRssSubsriptionsQuery } from "./rssApiSlice"
import { ManageFeeds } from "./components/ManageFeeds"

export const News = (): JSX.Element => {
  const { data /* isError, isLoading isSuccess */ } =
    useGetRssSubsriptionsQuery("")

  const [selected, setSelected] = useState("1")

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelected(newValue)
  }

  if (!data) {
    return <>Loading...</>
  }

  return (
    <Paper sx={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selected}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {data.map(subscription => (
            <Tab
              key={subscription.id}
              label={subscription.title}
              value={subscription.id}
              onClick={() => {
                setSelected(subscription.id)
              }}
            />
          ))}
          <Tab
            key={"manage"}
            value={"manage"}
            icon={<SettingsIcon />}
            onClick={() => {
              setSelected("manage")
            }}
          />
        </Tabs>
      </Box>
      {data.map(subscription => (
        <Box
          key={subscription.id}
          className={style.container}
          hidden={selected !== subscription.id}
        >
          <Feed id={subscription.id} />
        </Box>
      ))}
      <Box
        key={"manage"}
        className={style.container}
        hidden={selected !== "manage"}
      >
        <ManageFeeds feeds={data} />
      </Box>
    </Paper>
  )
}
