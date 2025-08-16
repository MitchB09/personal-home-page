import { useState, type JSX } from "react"
import { Button, Divider, Stack, TextField } from "@mui/material"
import type { AddFeedForm } from "../types"
import { useCreateRssSubscriptionMutation } from "../rssApiSlice"

export const AddFeed = (): JSX.Element => {
  const [createUser] = useCreateRssSubscriptionMutation()

  const [formState, setFormState] = useState<AddFeedForm>({
    name: "",
    url: "",
  })

  return (
    <Stack style={{ height: "100%" }}>
      <TextField
        name="name"
        value={formState.name}
        margin="dense"
        label="RSS Feed Name"
        variant="standard"
        fullWidth
        onChange={event => {
          setFormState({
            ...formState,
            [event.target.name]: event.target.value,
          })
        }}
      />
      <TextField
        name="url"
        value={formState.url}
        margin="dense"
        label="RSS Feed Url"
        variant="standard"
        fullWidth
        onChange={event => {
          setFormState({
            ...formState,
            [event.target.name]: event.target.value,
          })
        }}
      />
      <div />
      <Divider flexItem sx={{ flexGrow: 1, marginBottom: "1em" }} />
      <Button
        variant="contained"
        label="subscribe"
        onClick={() => {
          console.dir()
          createUser(formState)
            .then(response => {
              console.dir(response)
            })
            .catch((error: unknown) => {
              console.dir(error)
            })
        }}
      >
        Subscrbe
      </Button>
    </Stack>
  )
}
