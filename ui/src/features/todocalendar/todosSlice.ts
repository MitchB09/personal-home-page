import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "../../app/store"
import type { LibraryTask, NumberedTask, Task, TodoList, Week } from "./types"
import api from "../../api"
import { toDateString } from "./utils"

type SyncStatus = {
  hasChanges: boolean
  syncing: boolean
  error?: string
}

export enum FormMode {
  DEFAULT,
  TASK_LIBRARY,
}

type FetchableResource<T> = {
  data?: T
  loading: boolean
  error?: string
}

type TodosState = {
  week: Week
  todoList?: TodoList
  library: FetchableResource<LibraryTask[]>
  creating: boolean
  mode: FormMode
  syncStatus: SyncStatus
}

export const getTaskLibrary = createAsyncThunk<
  LibraryTask[],
  undefined,
  { state: RootState }
>("todos/getTaskLibrary", async () => {
  const { data } = await api.get<LibraryTask[]>(`/task-library`)
  return data
})

export const putTaskLibrary = createAsyncThunk<LibraryTask[], undefined, { state: RootState }>(
  "todos/putTaskLibrary",
  async (_, { getState }) => {
    const library = getState().todos.library;
    await api.put<LibraryTask[]>(`/task-library`, library.data)
    return library.data ?? [];
  }
);


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

export const syncWeek = createAsyncThunk<Week, undefined, { state: RootState, dispatch: AppDispatch }>(
  "todos/syncWeek",
  async (_, { getState }) => {
    const activeList = getState().todos.todoList
    let week = getState().todos.week
    

    if (activeList) {
      week = {
        ...week,
        [activeList.date]: activeList,
      }
    }

    await api.post<Week, undefined>(`/tasks`, week)
    return week
  },
)

export const todosSlice = createSlice({
  name: "todos",
  initialState: {
    week: {},
    library: { loading: false },
    mode: FormMode.DEFAULT,
    creating: false,
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
          tasks: state.library.data ? state.library.data.filter(task => task.enabled) : [],
        }
        week[date] = todoList
        state.week = week
        state.todoList = todoList
      }
    },
    setMode: (
      state,
      { payload: { mode } }: PayloadAction<{ mode: FormMode }>,
    ) => {
      state.mode = mode
    },
    addTask: (
      state,
      { payload: { task } }: PayloadAction<{ task: Task | NumberedTask }>,
    ) => {
      if (state.mode === FormMode.DEFAULT) {
        const { todoList } = state
        todoList?.tasks.push(task)
        state.todoList = todoList
        state.creating = false
        state.syncStatus.hasChanges = true
      } /* if (state.mode === FormMode.TASK_LIBRARY) */ else {
        const library = state.library
        const newTask = {
          ...task,
          enabled: true,
        } as LibraryTask
        library.data = [...library.data ?? [], newTask]
        state.library = library
        state.creating = false
      }
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
    updateLibraryTask: (
      state,
      { payload: { task } }: PayloadAction<{ task: LibraryTask }>,
    ) => {
      const { library } = state

      const updated = library.data?.map(found => {
        if (found.description === task.description) {
          found = task
        }
        return found
      })
      state.library = { ...library, data: updated }
    },
    setCreating: (
      state,
      { payload: { creating } }: PayloadAction<{ creating: boolean }>,
    ) => {
      state.creating = creating
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getTaskLibrary.pending, state => {
        state.library.loading = true
      })
      .addCase(getTaskLibrary.fulfilled, (state, payload) => {
        state.library.loading = false
        state.library.data = payload.payload
      })
      .addCase(getTaskLibrary.rejected, (state, payload) => {
        console.dir(payload.error)
        state.library.loading = false
        state.library.error = payload.error.message
      })
      .addCase(putTaskLibrary.pending, state => {
        state.library.loading = true
      })
      .addCase(putTaskLibrary.fulfilled, (state) => {
        state.library.loading = false
      })
      .addCase(putTaskLibrary.rejected, (state, payload) => {
        console.dir(payload.error)
        state.library.loading = false
        state.library.error = payload.error.message
      })
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
  setMode,
  addTask,
  deleteTask,
  updateTask,
  setCreating,
  updateLibraryTask,
} = todosSlice.actions

export default todosSlice.reducer

export const selectTodoList = (state: RootState) => state.todos.todoList
export const selectMode = (state: RootState) => state.todos.mode
export const selectCreating = (state: RootState) => state.todos.creating
export const selectHasChanges = (state: RootState) =>
  state.todos.syncStatus.hasChanges
export const selectSync = (state: RootState) => state.todos.syncStatus
export const selectTaskLibrary = (state: RootState) => state.todos.library
