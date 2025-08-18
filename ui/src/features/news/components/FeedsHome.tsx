import { type JSX } from "react"

import { Box, Grid, Link, Stack, Typography } from "@mui/material"

import type { Payload } from "../types"

type FeedsHomeProps = {
  feeds: Payload[]
  selectFeed: (id: string) => void
}

export const FeedsHome = (props: FeedsHomeProps): JSX.Element => {
  const { feeds, selectFeed } = props

  return (
    <Stack
      direction="column"
      spacing={2}
      style={{ height: "100%", padding: "1em" }}
    >
      <Box>
        <Typography variant="h5">Tracked RSS Feeds</Typography>
        {feeds.map(feed => (
          <Box key={feed.id}>
            <Grid container>
              <Grid>
                <Link
                  onClick={() => {
                    selectFeed(feed.id)
                  }}
                >
                  {feed.title}
                </Link>
              </Grid>
              <Grid flexGrow={1} />
            </Grid>
          </Box>
        ))}
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Stack justifyContent={"space-between"} direction={"row"}>
        <Link
          onClick={() => {
            selectFeed("manage")
          }}
        >
          <Typography>Manage & Add New Feeds</Typography>
        </Link>
        <Link
          href={"https://en.wikipedia.org/wiki/RSS"}
          target="_blank"
          rel="noreferrer"
          sx={{ fontStyle: 'italic' }}
        >
          <Typography>What's an RSS Feed?</Typography>
        </Link>
      </Stack>
    </Stack>
  )
}
