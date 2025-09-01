export type Task = {
  completed: boolean
  description: string
}

export type NumberedTask = {
  current: number
  goal: number
} & Task

export type TodoList = {
  date: string
  lastUpdated: Date
  tasks: Task[]
}

export type Week = {} & Record<string, TodoList>
