import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"

import { sessionAliveNewToken } from "../../store/auth/sessionAlive/actions"
import { useSession } from "./SessionContext"

let intervalId

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {
  const { session } = useSession();


  return (
    <>
      <Route
        {...rest}
        render={props => {
          if (isAuthProtected) {
            if (!session.active || !localStorage.getItem("token")) {
              return (
                <Redirect
                  to={{ pathname: "/login", state: { from: props.location } }} />
              )
            }
          }
          return (
            <Layout>
              <Component {...props} />
            </Layout>
          )
        }}
      /></>
  )
}

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  userPageAccess: PropTypes.any,
  history: PropTypes.object,
}

export default Authmiddleware;


















const updateTokan = (dispatch) => {
  let istoken = localStorage.getItem("refreshToken")
  if (istoken) {
    //console.log(" keepSessionAlive  api call", new Date()) //##########################

    let jsonBody = { "refresh": `${istoken}` }
    dispatch(sessionAliveNewToken(jsonBody))
  }
}

const keepSessionAlive = (dispatch) => {
  //console.log(" keepSessionAlive", new Date()) //##########################

  sessionStorage.setItem('keepSessionAlive', new Date())
  intervalId = setInterval(() => { updateTokan(dispatch) }, 28 * 60 * 1000)
};


