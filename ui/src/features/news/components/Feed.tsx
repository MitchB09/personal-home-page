import type { JSX } from "react"
import { useEffect, useState } from "react"

import axios from "axios"
import {
  Box,
  Link,
  List,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material"
import type { Item, RssFeed } from "../types"

export type FeedProps = {
  rssFeed: RssFeed
}

export const Feed = (props: FeedProps): JSX.Element => {
  const { rssFeed } = props

  const [feed, setFeed] = useState<RssFeed>({ ...rssFeed })
  useEffect(() => {
    void axios
      .get<string>(rssFeed.url)
      .then(response => {
        const parser = new DOMParser()
        const parsed = parser.parseFromString(response.data, "text/xml")
        const rssChannel = parsed.children[0].children[0]
        const items = [] as Item[]

        for (const element of rssChannel.children) {
          if (element.tagName === "item") {
            items.push({
              guid: getTextByTag(element, "title"),
              title: getTextByTag(element, "title"),
              link: getTextByTag(element, "link"),
              description: getTextByTag(element, "description"),
              pubDate: getTextByTag(element, "pubDate"),
            })
          }
        }
        setTimeout(() => {
          setFeed({
            ...rssFeed,
            items: items,
          })
        }, 4000)
      })
      .catch((error: unknown) => {
        console.dir(error)
      })
  }, [rssFeed])

  const getTextByTag = (element: Element, tagName: string): string => {
    for (const child of element.children) {
      if (child.tagName === tagName) {
        return child.textContent ?? "No text content"
      }
    }
    return "not found!!"
  }

  return (
    <Box style={{ minHeight: "15em", minWidth: "30em" }}>
      <Typography variant="subtitle2">{feed.title}</Typography>
      {feed.items?.length ? (
        <List>
          {feed.items
            .filter((_, index) => index < 5)
            .map(item => (
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
