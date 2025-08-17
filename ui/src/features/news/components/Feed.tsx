import { useMemo, useState, type JSX } from "react"

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import SyncIcon from "@mui/icons-material/Sync"
import {
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material"
import type { Item } from "../types"
import { useGetRssFeedQuery } from "../rssApiSlice"
import { format } from "date-fns"

export type FeedProps = {
  id: string
}

const pageSize = 5

export const Feed = (props: FeedProps): JSX.Element => {
  const { id } = props

  const { data /* isError, isLoading isSuccess */ } = useGetRssFeedQuery(id)
  const feed = data ? data.rssData?.channel : undefined

  const [page, setPage] = useState<number>(1)
  const maxPage = useMemo(() => {
    if (data?.rssData) {
      return data.rssData.channel.item.length / pageSize
    } else {
      return 0
    }
  }, [data])

  return (
    <Grid container style={{ height: "100%" }} flexDirection="column">
      <Grid flexGrow={1}>
        {feed?.item.length ? (
          <List>
            {feed.item
              .filter((_, index) => index >= (page - 1) * 5 && index < page * 5)
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
      </Grid>
      <Grid sx={{ height: "2em" }}>
        {data?.lastUpdated && (
          <>
            <Divider />
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignContent="center"
              height="2em"
            >
              <Grid>
                {data.rssData ? (
                  <span>
                    <IconButton
                      sx={{ visibility: page === 1 ? "hidden" : "unset" }}
                      onClick={() => {
                        setPage(page - 1)
                      }}
                    >
                      <ArrowLeftIcon />
                    </IconButton>
                    <Typography component={"span"} variant="subtitle2">
                      {`Page ${page.toString()} of ${maxPage.toString()}`}
                    </Typography>
                    <IconButton
                      sx={{ visibility: page === maxPage ? "hidden" : "unset" }}
                      onClick={() => {
                        setPage(page + 1)
                      }}
                    >
                      <ArrowRightIcon />
                    </IconButton>
                    <Typography component={"span"} variant="subtitle2">
                      {`  ${data.rssData.channel.item.length.toString()}  Total Items`}
                    </Typography>
                  </span>
                ) : (
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem", width: "100%" }}
                  />
                )}
              </Grid>
              <Grid>
                <span>
                  <Typography component='span' variant="subtitle2">
                    {`Updated: ${format(new Date(data.lastUpdated), "h:mm aa")}`}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      console.dir('reload')
                    }}
                  >
                    <SyncIcon />
                  </IconButton>
                </span>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  )
}
