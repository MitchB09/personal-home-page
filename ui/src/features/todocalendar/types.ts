export type Task = {
  completed: boolean
  description: string
}

export type LibraryTask = {
  enabled: boolean
} & Task;

export type NumberedTask = {
  current: number
  goal: number
} & Task

export enum WeeklyOptions {
  SUNDAY = "Sun",
  MONDAY = 'Mon',
  TUESDAY = 'Tue',
  WEDNESDAY = 'Wed',
  THURSDAY = 'Thu',
  FRIDAY = 'Fri',
  SATURDAY = 'Sat'
}

export type WeeklyTask = {
  settings: WeeklyOptions[]
} & Task

export type TodoList = {
  date: string
  lastUpdated: Date
  tasks: Task[]
}

export type Week = { weeklyTasks: Task[], dailyTasks:  Record<string, TodoList> }
