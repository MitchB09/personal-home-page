import { useMemo, useState, type JSX } from "react"

import { Home, Settings } from "@mui/icons-material"
import { Box, Paper, Tab, Tabs } from "@mui/material"
import { Feed } from "./components/Feed"
import { useGetRssSubsriptionsQuery } from "./rssApiSlice"
import { ManageFeeds } from "./components/ManageFeeds"
import { FeedsHome } from "./components/FeedsHome"

const homeTab = "list"
const manageTab = "manage"

export const News = (): JSX.Element => {
  const { data /* isError, isLoading isSuccess */ } =
    useGetRssSubsriptionsQuery("")

  const [selected, setSelected] = useState("list")
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelected(newValue)
  }

  const feedIds = useMemo(() => {
    return data?.map(feeds => feeds.id) ?? []
  }, [data])

  if (!data) {
    return <>Loading...</>
  }

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selected}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            key={homeTab}
            value={homeTab}
            icon={<Home />}
            onClick={() => {
              setSelected(homeTab)
            }}
          />
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
            key={manageTab}
            value={manageTab}
            icon={<Settings />}
            onClick={() => {
              setSelected(manageTab)
            }}
          />
        </Tabs>
      </Box>
      <Box key={homeTab} sx={{ height: "100%" }} hidden={selected !== homeTab}>
        <FeedsHome feeds={data} selectFeed={setSelected} />
      </Box>
      <Box sx={{ height: "100%" }} hidden={!feedIds.includes(selected)}>
        {feedIds.includes(selected) && <Feed id={selected} />}
      </Box>
      <Box
        key={manageTab}
        sx={{ height: "100%" }}
        hidden={selected !== manageTab}
      >
        <ManageFeeds feeds={data} />
      </Box>
    </Paper>
  )
}
