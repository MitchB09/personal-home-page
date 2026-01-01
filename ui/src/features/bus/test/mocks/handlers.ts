import { http, HttpResponse } from 'msw'
import fromOfficeResponse from './fromOfficeResponse.json'
 
export const handlers = [
  http.post('https://myride.fredericton.ca/Tmix.Cap.Ti.Process.AnyRide/api/GetCalls', () => {
    return HttpResponse.json(fromOfficeResponse)
  }),
]