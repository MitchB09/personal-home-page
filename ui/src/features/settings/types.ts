export enum AppType {
  WEATHER = 'weather',
  NEWS = 'news',
  NFL = 'nfl',
  TODOS = 'todos',
  BUS = 'bus'
}

export type Payload = {
  id: string
  homePageData: AppState
  lastUpdated: string
}

export type AppState = Record<AppType, boolean>
