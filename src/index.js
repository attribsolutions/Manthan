import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"

import store from "./store"

import ConfirmDialog from "./CustomAlert/ConfirmDialog"
import { ConfirmContextProvider } from "./CustomAlert/ConfirmContextProvider"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <ConfirmContextProvider>
        <ToastContainer />
        <App />
        <ConfirmDialog />
      </ConfirmContextProvider>
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById("root"))
