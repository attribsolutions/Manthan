import { SESSION_ALIVE_NEW_TOKEN } from "./actionTypes"



export const sessionAliveNewToken = jsonBody => {
  return {
    type: SESSION_ALIVE_NEW_TOKEN,
    jsonBody,
  }
}


