import {
  LinearProgress,
  FormControlLabel,
  Grid,
  IconButton,
  FormControl,
  Stack,
} from "@mui/material"
import { Add, Check, Delete } from "@mui/icons-material"
import { type JSX } from "react"
import type { NumberedTask } from "../types"
import { deleteTask, updateTask } from "../todosSlice"
import { useAppDispatch } from "../../../app/hooks"

const normalise = (value: number, MIN: number, MAX: number) =>
  ((value - MIN) * 100) / (MAX - MIN)

export type NumberedTaskProps = {
  task: NumberedTask
}

export const NumberedComponent = (props: NumberedTaskProps): JSX.Element => {
  const { task } = props

  const dispatch = useAppDispatch()

  return (
    <Grid container direction="column">
      <Grid>
        <FormControl fullWidth>
          <Stack direction={"row"}>
            <FormControlLabel
              sx={{ flexGrow: 1 }}
              key={task.description}
              label={task.description}
              disabled={task.completed}
              control={
                <IconButton
                  onClick={() => {
                    const newCurrent = task.current + 1
                    dispatch(
                      updateTask({
                        task: {
                          ...task,
                          current: newCurrent,
                          completed: newCurrent === task.goal ? true : false,
                        },
                      }),
                    )
                  }}
                  onContextMenu={e => {
                    e.stopPropagation()
                    e.preventDefault()
                    const newCurrent = task.current - 1
                    dispatch(
                      updateTask({
                        task: {
                          ...task,
                          current: newCurrent,
                          completed: newCurrent === task.goal ? true : false,
                        },
                      }),
                    )
                  }}
                >
                  {task.completed ? <Check /> : <Add />}
                </IconButton>
              }
            ></FormControlLabel>
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
      </Grid>
      <Grid>
        <LinearProgress
          variant="determinate"
          value={normalise(task.current, 0, task.goal)}
        />
      </Grid>
    </Grid>
  )
}
