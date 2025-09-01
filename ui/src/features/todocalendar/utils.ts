import { format } from "date-fns"
import type { NumberedTask } from "./types"

export const isNumberedTask = (val: unknown): val is NumberedTask => {
  return !!val && typeof val === "object" && "goal" in val
}

export const toDateString = (date: Date = new Date()) => {
  return format(new Date(date.setHours(0, 0, 0, 0)), "yyyy-MM-dd")
}