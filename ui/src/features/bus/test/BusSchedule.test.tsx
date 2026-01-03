import { screen } from "@testing-library/react"
import { setupServer } from "msw/node"
import { expect, test } from "vitest"
import { renderWithProviders } from "../../../utils/test-utils.js"
import { BusSchedule } from "../BusSchedule.js"
import { handlers } from "./mocks/handlers.js"

import nodeFetch, { Request, Response } from "node-fetch"

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

describe("BusSchedule Componenet", () => {

  test("Includes Two Schedule Entries", async () => {
    renderWithProviders(<BusSchedule />)

    expect(await screen.findByText(/12N From Office/i)).toBeInTheDocument()
    expect(await screen.findByText(/13S From Home/i)).toBeInTheDocument()

  })
})
