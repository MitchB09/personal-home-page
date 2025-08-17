export type Payload = {
  id: string
  homePageData: AppState
  lastUpdated: string
}

export type AppState = Record<string, boolean>
