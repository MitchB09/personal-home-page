import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import type { NumberedTask, Task, TodoList, Week } from "./types"
import api from "../../api"
import { toDateString } from "./utils"

type SyncStatus = {
  hasChanges: boolean
  syncing: boolean
  error?: string
}

type TodosState = {
  week: Week
  todoList?: TodoList
  creating: boolean
  syncStatus: SyncStatus
}

export const getWeek = createAsyncThunk<Week, undefined, { state: RootState }>(
  "todos/getWeek",
  async () => {
    const { data } = await api.get<TodoList[]>(`/tasks`)

    const week: Week = {}
    data.forEach(todoList => {
      week[todoList.date] = todoList
    })

    return week
  },
)

export const syncWeek = createAsyncThunk<Week, undefined, { state: RootState }>(
  "todos/syncWeek",
  async (_, { getState }) => {
    //const { data } = await api.post<PostBoardResponse>("/boards", board);
    const activeList = getState().todos.todoList
    let week = getState().todos.week

    if (activeList) {
      week = {
        ...week,
        [activeList.date]: activeList,
      }
    }

    await api.post(`/tasks`, week)
    return week
  },
)

export const todosSlice = createSlice({
  name: "todos",
  initialState: {
    week: {},
    syncStatus: {
      hasChanges: false,
      syncing: false,
    },
  } as TodosState,
  reducers: {
    setWeek: (state, { payload: { week } }: PayloadAction<{ week: Week }>) => {
      state.week = week
    },
    setTodoList: (
      state,
      { payload: { date } }: PayloadAction<{ date: string }>,
    ) => {
      const week = state.week

      if (state.todoList) {
        week[state.todoList.date] = state.todoList
        state.week = week
      }

      if (date in week) {
        const todoList = week[date]
        state.todoList = todoList
      } else {
        const todoList = {
          date: date,
          lastUpdated: new Date(),
          tasks: [],
        }
        week[date] = todoList
        state.week = week
        state.todoList = todoList
      }
    },
    setCreating: (
      state,
      { payload: { creating } }: PayloadAction<{ creating: boolean }>,
    ) => {
      state.creating = creating
    },
    addTask: (
      state,
      { payload: { task } }: PayloadAction<{ task: Task | NumberedTask }>,
    ) => {
      const { todoList } = state
      todoList?.tasks.push(task)
      state.todoList = todoList
      state.creating = false
      state.syncStatus.hasChanges = true
    },
    deleteTask: (
      state,
      { payload: { task } }: PayloadAction<{ task: Task | NumberedTask }>,
    ) => {
      if (state.todoList) {
        const { todoList } = state

        const updated = todoList.tasks.filter(found => {
          return found.description !== task.description
        })
        state.todoList = { ...todoList, tasks: updated }
        state.syncStatus.hasChanges = true
      }
    },
    updateTask: (
      state,
      { payload: { task } }: PayloadAction<{ task: Task | NumberedTask }>,
    ) => {
      if (state.todoList) {
        const { todoList } = state

        const updated = todoList.tasks.map(found => {
          if (found.description === task.description) {
            found = task
          }
          return found
        })
        state.todoList = { ...todoList, tasks: updated }
        state.syncStatus.hasChanges = true
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getWeek.pending, state => {
        state.syncStatus = {
          ...state.syncStatus,
          syncing: true,
        }
      })
      .addCase(getWeek.fulfilled, (state, payload) => {
        state.syncStatus = {
          ...state.syncStatus,
          syncing: false,
        }
        state.week = payload.payload
        state.todoList = payload.payload[toDateString()]
      })
      .addCase(getWeek.rejected, (state, payload) => {
        state.syncStatus = {
          ...state.syncStatus,
          syncing: false,
          error: payload.error.message,
        }
      })
      .addCase(syncWeek.pending, state => {
        state.syncStatus = {
          syncing: true,
          hasChanges: false,
        }
      })
      .addCase(syncWeek.fulfilled, (state, payload) => {
        state.week = payload.payload
        state.syncStatus = {
          syncing: false,
          hasChanges: false,
        }
      })
      .addCase(syncWeek.rejected, (state, payload) => {
        state.syncStatus = {
          syncing: false,
          hasChanges: true,
          error: payload.error.message,
        }
      })
  },
})

export const {
  setTodoList,
  setWeek,
  setCreating,
  addTask,
  deleteTask,
  updateTask,
} = todosSlice.actions

export default todosSlice.reducer

export const selectTodoList = (state: RootState) => state.todos.todoList
export const selectCreating = (state: RootState) => state.todos.creating
export const selectHasChanges = (state: RootState) =>
  state.todos.syncStatus.hasChanges
export const selectSync = (state: RootState) => state.todos.syncStatus
