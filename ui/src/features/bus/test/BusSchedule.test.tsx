import { act, screen, waitFor } from "@testing-library/react"
import { http, HttpResponse, delay } from "msw"
import { setupServer } from "msw/node"
import { renderWithProviders } from "../../../utils/test-utils.js"
import { BusSchedule } from "../BusSchedule.js"
import { expect, test } from "vitest"

import { handlers } from "./mocks/handlers.js"
import fromOfficeResponse from "./mocks/fromOfficeResponse.json"

import nodeFetch, { Request, Response } from "node-fetch";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
Object.assign(global, { fetch: nodeFetch, Request, Response });

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

describe("BusSchedule", () => {
  test("Verify Mocks", async () => {
    const response = await fetch(
      "https://myride.fredericton.ca/Tmix.Cap.Ti.Process.AnyRide/api/GetCalls",
      {
        method: "POST",
      },
    )
    await expect(response.json()).resolves.toEqual(fromOfficeResponse)
  })

  test("App includes Weather", async () => {
    renderWithProviders(<BusSchedule />)

    // The app should be rendered correctly
    // after some time, the user should be received
    expect(await screen.findByText(/NOT LOADING/i)).toBeInTheDocument()
    expect(await screen.findByText(/SUCCESS/i)).toBeInTheDocument()
    expect(await screen.findByText(/NO DATA/i)).toBeInTheDocument()

  })
})
