import {
  Box,
  Button,
  FormGroup,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { addDays, format } from "date-fns"
import { useEffect, useMemo, useState, type JSX } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { AddTaskForm } from "./components/AddTaskForm"
import { NumberedComponent } from "./components/NumberedComponent"
import { SimpleTaskCompoenent } from "./components/SimpleTaskComponent"
import {
  addTask,
  FormMode,
  getWeek,
  selectCreating,
  selectHasChanges,
  selectMode,
  selectSync,
  selectTodoList,
  setCreating,
  setMode,
  setTodoList,
  syncWeek,
} from "./todosSlice"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MoreHoriz,
  Sync,
  ErrorOutline,
  Settings,
} from "@mui/icons-material"
import { isNumberedTask, toDateString } from "./utils"
import { TaskLibrary } from "./components/TaskLibrary"

export const DailyTodoList = (): JSX.Element => {
  const todoList = useAppSelector(selectTodoList)
  const mode = useAppSelector(selectMode)
  const creating = useAppSelector(selectCreating)
  const hasChanges = useAppSelector(selectHasChanges)
  const sync = useAppSelector(selectSync)

  const dispatch = useAppDispatch()

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0)),
  )

  useEffect(() => {
    void dispatch(getWeek())
  }, [dispatch])

  useEffect(() => {
    dispatch(setTodoList({ date: toDateString(selectedDate) }))
  }, [dispatch, selectedDate])

  useEffect(() => {
    if (hasChanges) {
      const timerId = setTimeout(() => {
        void dispatch(syncWeek())
      }, 3000)

      // Cleanup function
      return () => {
        clearTimeout(timerId)
      }
    }
  }, [dispatch, hasChanges]) // Empty dependency array means this runs once on mount and cleans up on unmount

  const taskList = useMemo(() => {
    return todoList?.tasks ?? []
  }, [todoList])

  const statusIcon = () => {
    if (sync.syncing) return <Sync className="rotating" />
    else if (sync.error)
      return (
        <Tooltip title={sync.error}>
          <ErrorOutline />
        </Tooltip>
      )
    else if (hasChanges) return <MoreHoriz />
    else return <Check />
  }

  const renderContent = () => {
    if (creating) {
      return (
        <AddTaskForm
          onComplete={task => {
            dispatch(
              addTask({
                task,
              }),
            )
          }}
          onCancel={() => {
            dispatch(
              setCreating({
                creating: false,
              }),
            )
          }}
        />
      )
    }
    switch (mode) {
      case FormMode.TASK_LIBRARY:
        return <TaskLibrary />
      case FormMode.DEFAULT:
      default:
        return (
          <Stack>
            <FormGroup>
              {taskList.map(task => {
                if (isNumberedTask(task)) {
                  return (
                    <NumberedComponent task={task} key={task.description} />
                  )
                }
                return (
                  <SimpleTaskCompoenent task={task} key={task.description} />
                )
              })}
            </FormGroup>
            <Button
              onClick={() => {
                dispatch(
                  setCreating({
                    creating: true,
                  }),
                )
              }}
            >
              Add
            </Button>
          </Stack>
        )
    }
  }

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          lineHeight: "3em",
          borderBottom: 1,
          borderColor: "divider",
          padding: "0 0.5em",
        }}
      >
        {mode === FormMode.TASK_LIBRARY ? (
          <Typography variant="h6">Task Library</Typography>
        ) : (
          <Stack direction="row" alignItems="center">
            <IconButton
              onClick={() => {
                setSelectedDate(addDays(selectedDate, -1))
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="h6">
              {todoList && format(selectedDate, "EEEE MMM d")}
            </Typography>
            <IconButton
              onClick={() => {
                setSelectedDate(addDays(selectedDate, +1))
              }}
            >
              <ArrowRight />
            </IconButton>
            <span style={{ flexGrow: 1 }} />
            <IconButton
              onClick={() => {
                dispatch(
                  setMode({
                    mode: FormMode.TASK_LIBRARY,
                  }),
                )
              }}
            >
              <Settings />
            </IconButton>
          </Stack>
        )}
      </Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          padding: "0.5em",
          flexGrow: 1,
        }}
      >
        {renderContent()}
      </Box>
      <Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "flex-end", padding: "0.25em 1em" }}
        >
          {todoList && (
            <Typography component="span" variant="subtitle2">
              {`Updated: ${format(new Date(todoList.lastUpdated), "h:mm aa")}`}
            </Typography>
          )}
          {statusIcon()}
        </Stack>
      </Box>
    </Paper>
  )
}
