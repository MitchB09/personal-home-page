import {
  Stack,
  FormGroup,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material"
import { useState, type JSX } from "react"
import type { NumberedTask, Task } from "../types"
import { useAppDispatch } from "../../../app/hooks"
import { addTask, setCreating } from "../todosSlice"
import classes from "./AddTaskForm.module.css"

export enum TaskType {
  SIMPLE = "Simple",
  NUMBERED = "Numbered",
}

type NewTaskForm = {
  type: TaskType
  task: Task
}

function asNumberedTask(val: unknown): val is NumberedTask {
  return !!val && typeof val === "object" // && "current" in val
}

export const AddTaskForm = (): JSX.Element => {
  const dispatch = useAppDispatch()

  const [form, setForm] = useState<NewTaskForm>({
    type: TaskType.SIMPLE,
    task: {
      description: "",
      completed: false,
    },
  })

  console.dir(Object.entries(TaskType))

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2 }}
      useFlexGap
      sx={
        {
          //justifyContent: "center",
          //alignItems: "center",
        }
      }
    >
      <FormGroup className={classes.form}>
        <TextField
          name="description"
          size="small"
          placeholder="Task Description"
          value={form.task.description}
          onChange={e => {
            setForm({
              ...form,
              task: {
                ...form.task,
                [e.target.name]: e.target.value,
              },
            })
          }}
        />
        <FormControl fullWidth size="small" sx={{ padding: "6px 0px" }}>
          <Select
            value={form.type}
            size="small"
            name="type"
            displayEmpty
            onChange={e => {
              let task
              switch (e.target.value) {
                case TaskType.SIMPLE:
                  task = {
                    description: form.task.description,
                    completed: false,
                  } as Task
                  break
                case TaskType.NUMBERED:
                  task = {
                    description: form.task.description,
                    completed: false,
                    current: 0,
                    goal: 0,
                  } as NumberedTask
                  break
              }
              setForm({
                ...form,
                [e.target.name]: e.target.value,
                task: task,
              })
            }}
          >
            {Object.values(TaskType).map(value => {
              return <MenuItem value={value}>{value}</MenuItem>
            })}
          </Select>
        </FormControl>
        {form.type === TaskType.NUMBERED && asNumberedTask(form.task) && (
          <TextField
            name="goal"
            size="small"
            placeholder="Goal"
            value={form.task.goal || ""}
            onChange={e => {
              if (asNumberedTask(form.task)) {
                setForm({
                  ...form,
                  task: {
                    ...form.task,
                    [e.target.name]: +e.target.value,
                  },
                })
              }
            }}
          />
        )}
        <Button
          type="submit"
          variant="contained"
          onClick={() => {
            dispatch(
              addTask({
                task: form.task,
              }),
            )
          }}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(
              setCreating({
                creating: false,
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
