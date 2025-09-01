import { type JSX } from "react"

import { Delete } from "@mui/icons-material"
import { FormControl, Stack, FormControlLabel, Checkbox, IconButton } from "@mui/material"
import { updateTask, deleteTask } from "../todosSlice"
import type { Task } from "../types"
import { useAppDispatch } from "../../../app/hooks"


export const SimpleTaskCompoenent = (props: { task: Task}): JSX.Element => {
  const { task } = props

  const dispatch = useAppDispatch()

  return (
    <FormControl>
      <Stack direction={"row"}>
        <FormControlLabel
          key={task.description}
          sx={{ flexGrow: 1 }}
          control={
            <Checkbox
              checked={task.completed}
              disabled={task.completed}
              onClick={() => {
                dispatch(
                  updateTask({
                    task: { ...task, completed: true },
                  }),
                )
              }}
            />
          }
          label={task.description}
        />
        <IconButton
          onClick={() => {
            dispatch(
              deleteTask({
                task: task,
              }),
            )
          }}
        >
          <Delete />
        </IconButton>
      </Stack>
    </FormControl>
  )
}
