import { useEffect, useMemo, useState, type JSX } from "react"

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
  Tooltip,
  Typography,
} from "@mui/material"
import type { Item } from "../types"
import { useGetRssFeedQuery, useRefreshRssFeedMutation } from "../rssApiSlice"
import styles from "./Feed.module.css"
import { format } from "date-fns"

export type FeedProps = {
  id: string
}

const pageSize = 5

export const Feed = (props: FeedProps): JSX.Element => {
  const { id } = props

  const { data, isLoading, isFetching /* isError, isLoading isSuccess */ } =
    useGetRssFeedQuery(id)
  const [refreshFeed] = useRefreshRssFeedMutation()
  const feed = data ? data.rssData?.channel : undefined

  const [spinning, setSpinning] = useState<boolean>(false);

  useEffect(() => {
    if (!isFetching) {
      setSpinning(false);
    }
  }, [isFetching])

  const [page, setPage] = useState<number>(1)
  useEffect(() => {
    setPage(1)
  }, [id])

  const maxPage = useMemo(() => {
    if (data?.rssData) {
      return Math.ceil(data.rssData.channel.item.length / pageSize)
    } else {
      return 0
    }
  }, [data])

  return (
    <Grid container sx={{ height: "100%" }} flexDirection="column">
      <Grid flexGrow={1} sx={{ width: "100%" }}>
        {!isLoading && feed?.item.length ? (
          <List>
            {feed.item
              .filter((_, index) => index >= (page - 1) * 5 && index < page * 5)
              .map((item: Item) => (
                <Tooltip title={item.title}>
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
                      <Typography variant="body2" noWrap sx={{ width: "100%" }}>
                        {item.title}
                      </Typography>
                    </ListItem>
                  </Link>
                </Tooltip>
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
                  <Typography component="span" variant="subtitle2">
                    {`Updated: ${format(new Date(data.lastUpdated), "h:mm aa")}`}
                  </Typography>
                  <IconButton
                    //className={styles.rotating}
                    className={spinning ? styles.rotating : ""}
                    onClick={() => {
                      setSpinning(true);
                      void refreshFeed(data.id)
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
