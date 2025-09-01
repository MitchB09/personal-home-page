import {
  FormGroup,
  FormControl,
  Button,
  Checkbox,
  Stack,
  FormControlLabel,
  Typography,
  Backdrop,
  CircularProgress,
  IconButton,
} from "@mui/material"
import { useEffect, type JSX } from "react"
import type { NumberedTask, WeeklyTask } from "../types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  deleteTask,
  FormMode,
  getTaskLibrary,
  putTaskLibrary,
  selectTaskLibrary,
  setCreating,
  setMode,
  updateLibraryTask,
} from "../todosSlice"
import classes from "./AddTaskForm.module.css"
import { Delete, Edit, Warning } from "@mui/icons-material"

function asNumberedTask(val: unknown): val is NumberedTask {
  return !!val && typeof val === "object" && "goal" in val
}

function asWeeklyTask(val: unknown): val is WeeklyTask {
  return !!val && typeof val === "object" && "settings" in val
}

export const TaskLibrary = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const taskLibrary = useAppSelector(selectTaskLibrary)

  useEffect(() => {
    if (
      taskLibrary.loading ||
      taskLibrary.error ||
      taskLibrary.data != undefined
    ) {
      return
    }
    void dispatch(getTaskLibrary())
  }, [dispatch, taskLibrary])

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2 }}
      useFlexGap
    >
      <Backdrop
        sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={taskLibrary.loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {taskLibrary.error && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Warning />
          <Typography sx={{ fontStyle: "italic" }}>
            {taskLibrary.error}
          </Typography>
        </Stack>
      )}
      {taskLibrary.data?.map(task => {
        return (
          <FormControl>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={task.enabled}
                    onClick={() => {
                      dispatch(
                        updateLibraryTask({
                          task: { ...task, enabled: !task.enabled },
                        }),
                      )
                    }}
                  />
                }
                label={task.description}
              />
              {asNumberedTask(task) && (
                <Typography
                  sx={{ fontStyle: "italic" }}
                >{`Goal: ${task.goal.toFixed(0)} times day`}</Typography>
              )}
              {asWeeklyTask(task) && (
                <Typography
                  sx={{ fontStyle: "italic" }}
                >{`${task.settings.length.toString()} days a week`}</Typography>
              )}
              <span style={{ flexGrow: 1}} />
              <IconButton
                onClick={() => {
                  console.dir("Edit task")
                }}
              >
                <Edit />
              </IconButton>
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
      })}
      <FormGroup className={classes.form}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            void dispatch(putTaskLibrary())
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            dispatch(
              setCreating({
                creating: true,
              }),
            )
          }}
        >
          Add New Task
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(
              setMode({
                mode: FormMode.DEFAULT,
              }),
            )
          }}
        >
          Cancel
        </Button>
      </FormGroup>
    </Stack>
  )
}
