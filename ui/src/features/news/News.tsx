import { useState, type JSX } from "react"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import SettingsIcon from "@mui/icons-material/Settings"
import { Box, Divider, Grid, IconButton, Paper, Tab, Tabs } from "@mui/material"
import style from "./News.module.css"
import { Feed } from "./components/Feed"
import { useGetRssSubsriptionsQuery } from "./rssApiSlice"
import { AddFeed } from "./components/AddFeed"
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
    <Paper sx={{ height: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Grid
          container
          direction="row"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid size={10}>
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
            </Tabs>
          </Grid>
          <Grid>
            <Divider orientation="vertical" />
          </Grid>
          <Grid>
            <IconButton
              onClick={() => {
                setSelected("add")
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setSelected("manage")
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Grid>
        </Grid>
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
      <Box key={"add"} className={style.container} hidden={selected !== "add"}>
        <AddFeed />
      </Box>
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
