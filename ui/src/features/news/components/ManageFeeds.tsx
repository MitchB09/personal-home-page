import type { JSX } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import { Grid, IconButton, List, ListItem } from "@mui/material"
import { useDeleteRssSubscriptionMutation } from "../rssApiSlice"

import type { Payload } from "../types"

type ManageFeedsProps = {
  feeds: Payload[]
}

export const ManageFeeds = (props: ManageFeedsProps): JSX.Element => {
  const { feeds } = props

  const [deleteRssSubscription] = useDeleteRssSubscriptionMutation()

  return (
    <List style={{ height: "100%" }}>
      {feeds.map(feed => (
        <ListItem key={feed.id}>
          <Grid container>
            <Grid>{feed.title}</Grid>
            <Grid flexGrow={1} />
            <Grid>
              <IconButton
                onClick={() => {
                  deleteRssSubscription(feed.id).catch((error: unknown) => {
                    console.dir(error)
                  })
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </ListItem>
      ))}
    </List>
  )
}
