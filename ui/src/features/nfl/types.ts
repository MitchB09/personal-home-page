export type ResponsePayload = {
  sport: string
  content: ScheduleContent
}

export type ScheduleContent = {
  schedule: Record<string, ScheduleGameDay>
  league: string
  activeDate: string
  title: string
}

export type ScheduleGameDay = {
  games: Game[]
}

export type Game = {
  id: string
  date: string
  name: string
  shortName: string
  competitions: GameCompetition[]
  status: GameStatus
}

export type GameCompetition = {
  date: string
  competitors: GameCompetitor[]
}

export enum CompetitorType {
  HOME = 'home',
  AWAY = 'away'
}

export type GameCompetitor = {
  uid: string
  homeAway: CompetitorType
  score: string
  winner: boolean
  team: Team
}

export type GameStatus = {
  period: number
  displayClock: string
  clock: number
  shortName: string
  type: GameStatusType
  possessionText?: string
  downDistanceText?: string,
}

export type GameStatusType = {
  name: GameStatusEnum
  description: string
  completed: string
  shortDetail: string
}

export enum GameStatusEnum {
  STATUS_FINAL = 'STATUS_FINAL',
  STATUS_SCHEDULED = 'STATUS_SCHEDULED',
  STATUS_IN_PROGRESS = 'STATUS_IN_PROGRESS'
}

export type Team = {
  abbreviation: string,
  displayName: string,
  shortDisplayName: string,
  logo: string
}