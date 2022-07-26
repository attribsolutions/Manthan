import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"

const Authmiddleware = ({
  userPageAccess: userPageAccess,
  history: history,
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      
      if (isAuthProtected && !localStorage.getItem("token")) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }} />
        )
      }
      
     else if ((userPageAccess === undefined)) {
        console.log("userPageAccess props if ", history)

        // history.push("/Dashboard")
        // return (
        //   <Redirect
        //     to={{ pathname: "/Dashboard",  }}  />
        // )
      }
      else {
        if (!(userPageAccess.fromDashboardAccess)) {
          console.log("userPageAccess props else", history)

          // history.push("/Dashboard")
          // return (
          //   <Redirect
          //     to={{ pathname: "/Dashboard",  }}  />
          // )
        }
      };


      return (
        <Layout>
          <Component {...props} />
        </Layout>
      )
    }}
  />
)

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  userPageAccess: PropTypes.any,
  history: PropTypes.object,
}

export default Authmiddleware;
