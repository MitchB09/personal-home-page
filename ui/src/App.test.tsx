import { screen } from "@testing-library/react"
import { App } from "./App"
import { renderWithProviders } from "./utils/test-utils"

describe("App", () => {
  test("App includes Weather", () => {
    renderWithProviders(<App />)

    // The app should be rendered correctly
    expect(screen.getByRole("weather")).toBeInTheDocument()
  })

  test("App includes News", () => {
    renderWithProviders(<App />)

    // The app should be rendered correctly
    expect(screen.getByRole("news")).toBeInTheDocument()
  })
})
