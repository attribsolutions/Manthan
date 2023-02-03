import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"

import store from "./store"
import ConfirmDialog from "./Demo/ConfirmDialog"
import { ConfirmContextProvider } from "./Demo/ConfirmContextProvider"

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <ConfirmContextProvider>
        <App />
        <ConfirmDialog />
      </ConfirmContextProvider>
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById("root"))
