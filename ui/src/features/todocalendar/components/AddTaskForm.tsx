import {
  Stack,
  FormGroup,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { useState, type JSX } from "react"
import {
  WeeklyOptions,
  type NumberedTask,
  type Task,
  type WeeklyTask,
} from "../types"
import classes from "./AddTaskForm.module.css"

export enum TaskType {
  SIMPLE = "Simple",
  NUMBERED = "Numbered",
}

export enum SheduleType {
  DAILY = "Daily",
  WEEKLY = "Weekly",
}

type NewTaskForm = {
  type: TaskType
  task: Task
  scheduleType: SheduleType
}

function asNumberedTask(val: unknown): val is NumberedTask {
  return !!val && typeof val === "object" // && "current" in val
}

function asWeeklyTask(val: unknown): val is WeeklyTask {
  return !!val && typeof val === "object" && "settings" in val
}

type AddTaskFormProps = {
  onComplete: (task: Task) => undefined
  onCancel: () => undefined
}

export const AddTaskForm = (props: AddTaskFormProps): JSX.Element => {
  const { onComplete, onCancel } = props

  const [form, setForm] = useState<NewTaskForm>({
    type: TaskType.SIMPLE,
    scheduleType: SheduleType.DAILY,
    task: {
      description: "",
      completed: false,
    },
  })

  return (
    <Stack direction="column" spacing={{ xs: 1, sm: 2 }} useFlexGap>
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
                    ...form.task,
                    description: form.task.description,
                  } as Task
                  break
                case TaskType.NUMBERED:
                  task = {
                    ...form.task,
                    description: form.task.description,
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
        <FormControl fullWidth size="small" sx={{ padding: "6px 0px" }}>
          <Select
            value={form.scheduleType}
            size="small"
            name="scheduleType"
            displayEmpty
            onChange={e => {
              let task
              switch (e.target.value) {
                case SheduleType.DAILY:
                  task = {
                    ...form.task,
                  } as Task
                  break
                case SheduleType.WEEKLY:
                  task = {
                    ...form.task,
                    settings: [],
                  } as WeeklyTask
                  break
              }
              setForm({
                ...form,
                task: task,
                [e.target.name]: e.target.value,
              })
            }}
          >
            {Object.values(SheduleType).map(value => {
              return <MenuItem value={value}>{value}</MenuItem>
            })}
          </Select>
        </FormControl>
        {form.scheduleType === SheduleType.WEEKLY &&
          asWeeklyTask(form.task) && (
            <Stack
              direction="row"
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {Object.values(WeeklyOptions).map(day => (
                <FormControlLabel
                  key={day}
                  label={day}
                  control={
                    <Checkbox
                      name={day}
                      checked={
                        asWeeklyTask(form.task) &&
                        form.task.settings.includes(day)
                      }
                      onClick={() => {
                        if (asWeeklyTask(form.task)) {
                          const scheduleTask = form.task
                          if (scheduleTask.settings.includes(day)) {
                            const idx = scheduleTask.settings.indexOf(day)
                            scheduleTask.settings.splice(idx, 1)
                          } else {
                            scheduleTask.settings.push(day)
                          }
                          setForm({
                            ...form,
                            task: scheduleTask,
                          })
                        }
                      }}
                    />
                  }
                />
              ))}
            </Stack>
          )}
        <Button
          type="submit"
          variant="contained"
          onClick={() => {
            onComplete(form.task)
          }}
        >
          Create
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </FormGroup>
    </Stack>
  )
}
