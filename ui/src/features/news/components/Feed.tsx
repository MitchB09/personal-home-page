import type { JSX } from "react"

import { Box, Link, List, ListItem, Skeleton, Typography } from "@mui/material"
import type { Item } from "../types"
import { useGetRssFeedQuery } from "../rssApiSlice"

export type FeedProps = {
  id: string
}

export const Feed = (props: FeedProps): JSX.Element => {
  const { id } = props

  const { data /* isError, isLoading isSuccess */ } = useGetRssFeedQuery(id)
  const feed = data ? data.rssData.channel: undefined;

  return (
    <Box style={{ minHeight: "15em", minWidth: "30em" }}>
      <Typography variant="subtitle2">{feed?.title}</Typography>
      {feed?.item.length ? (
        <List>
          {feed.item
            .filter((_, index) => index < 5)
            .map((item: Item) => (
              <Link
                key={item.guid}
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
                <ListItem
                  key={item.guid}
                  sx={{ fontSize: "0.75rem", width: "100%" }}
                >
                  <Typography variant="body2">{item.title}</Typography>
                </ListItem>
              </Link>
            ))}
        </List>
      ) : (
        <List>
          {[0, 1, 2, 3, 4].map(num => (
            <ListItem key={num}>
              <Skeleton
                key={num}
                variant="text"
                sx={{ fontSize: "1rem", width: "100%" }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
