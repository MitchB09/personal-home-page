export type Payload = {
  id: string
  homePageData: AppState
  lastUpdated: string
}

export enum Apps {
  WEATHER = 'weather',
  NEWS = 'news',
  NFL = 'nfl',
  RECIPES = 'recipes',
}

export type AppState = Record<Apps, boolean>
