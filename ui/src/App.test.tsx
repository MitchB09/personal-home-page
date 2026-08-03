import { screen } from "@testing-library/react"
import { useAuth } from "react-oidc-context"

import { App } from "./App"
import { renderWithProviders } from "./utils/test-utils"

const mockUser = {
  session_state: null,
  access_token: "",
  token_type: "",
  profile: {
    sub: "testUserId",
    iss: "",
    aud: "",
    exp: 0,
    iat: 0,
  },
  state: undefined,
  expires_in: undefined,
  expired: undefined,
  scopes: [],
  toStorageString: function (): string {
    throw new Error("Function not implemented.")
  },
}

vi.mock("react-oidc-context", () => ({
  useAuth: vi.fn(),
}))

vi.mock(import('./Home'), async (importOriginal) => {
  return {
    ...await importOriginal(),
    // this will only affect "foo" outside of the original module
    Home: () => <div data-testid="mock-home">Home</div>,
  }
})

vi.mock(import('./MenuAppBar'), async (importOriginal) => {
  return {
    ...await importOriginal(),
    // this will only affect "foo" outside of the original module
    MenuAppBar: () => <div data-testid="mock-menu">Menu Bar</div>,
  }
})

describe("App", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test("App includes ", () => {
    vi.mocked(useAuth, { partial: true }).mockResolvedValue({
      isLoading: false,
      isAuthenticated: true,
      user: mockUser,
    })
    renderWithProviders(<App />, {
      preloadedState: {
        auth: { user: mockUser },
      },
    })

    // The app should render home component
    expect(screen.getByTestId("mock-home")).toBeInTheDocument()
    expect(screen.getByTestId("mock-menu")).toBeInTheDocument()
  })

  test("Login Button with no session", () => {
    vi.mocked(useAuth, { partial: true }).mockResolvedValue({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    })
    renderWithProviders(<App />, {
      preloadedState: {
        auth: { user: undefined },
      },
    })

    // The app should be rendered correctly
    expect(screen.getByText("Sign in")).toBeInTheDocument()
    expect(screen.getByTestId("mock-menu")).toBeInTheDocument()
  })
})
