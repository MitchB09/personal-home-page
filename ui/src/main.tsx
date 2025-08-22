import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { AuthProvider } from "react-oidc-context"
import { Provider } from "react-redux"

import { App } from "./App"
import { store } from "./app/store"
import "./index.css"

const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${import.meta.env.VITE_USERPOOL_ID as string}`,
  client_id: import.meta.env.VITE_USERPOOL_CLIENT_ID as string,
  redirect_uri: import.meta.env.VITE_REDIRECT_URL as string,
  response_type: "code",
  scope: "email openid",
}

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <AuthProvider {...cognitoAuthConfig}>
        <Provider store={store}>
          <App />
        </Provider>
      </AuthProvider>
    </StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
