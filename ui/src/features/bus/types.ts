export type Request = {
  fromStop: string,
  lineId: number
}


export const FROM_OFFICE: Request = {
  fromStop: 'Kings Place (1000)',
  lineId: 100000003
}

export const FROM_HOME: Request = {
  fromStop: 'Maple and/et Wallace (1036)',
  lineId: 100000004
}

export type Payload = {
  isStopCancelled: boolean
  calls: Route[]
  messages: string[]
}

export type Route = {
  id: string
  calls: Run[]
}

export type Run = {
  id: string
  key: string
  lineId: number
  routeId: number
  journeyId: number
  stopPointId: number
  sequenceNumber: number
  line: string
  journey: string
  destination: string
  subdestination: string
  departure: Departure
}

export type Departure = {
  journeyType: string
  forecastTime: Date
  plannedTime: Date
  quality: string
  attributes: string[]
  designation: string
}
