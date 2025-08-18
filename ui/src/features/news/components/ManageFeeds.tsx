import { useState, type JSX } from "react"

import CheckIcon from "@mui/icons-material/Check"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Stack,
} from "@mui/material"
import {
  useCreateRssSubscriptionMutation,
  useDeleteRssSubscriptionMutation,
} from "../rssApiSlice"

import type { Payload } from "../types"

type ManageFeedsProps = {
  feeds: Payload[]
}

export const ManageFeeds = (props: ManageFeedsProps): JSX.Element => {
  const { feeds } = props

  const [deleteRssSubscription] = useDeleteRssSubscriptionMutation()
  const [createSubscription] = useCreateRssSubscriptionMutation()
  const [addingFeed, setAddingFeed] = useState<boolean>(false)
  const [newFeed, setNewFeed] = useState<string>("")

  return (
    <Stack direction="column" style={{ height: "100%", margin: "1em" }}>
      {feeds.map(feed => (
        <Box key={feed.id}>
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
        </Box>
      ))}
      <Divider />
      <Box>
        {addingFeed ? (
          <FormControl fullWidth variant="standard">
            <InputLabel htmlFor="outlined-adornment-password">
              RSS Feed URL
            </InputLabel>
            <Input
              name="url"
              type="text"
              value={newFeed}
              margin="dense"
              fullWidth
              onChange={event => {
                setNewFeed(event.target.value)
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      console.dir(newFeed)
                      createSubscription({
                        url: newFeed,
                      })
                        .then(response => {
                          console.dir(response)
                          setNewFeed("")
                          setAddingFeed(false)
                        })
                        .catch((error: unknown) => {
                          console.dir(error)
                        })
                    }}
                    edge="end"
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setNewFeed("")
                      setAddingFeed(false)
                    }}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        ) : (
          <Button
            variant="outlined"
            sx={{ marginTop: "1em" }}
            onClick={() => {
              setAddingFeed(true)
            }}
          >
            Add Feed
          </Button>
        )}
      </Box>
    </Stack>
  )
}
