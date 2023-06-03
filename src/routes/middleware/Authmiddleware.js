import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { sessionAliveNewToken } from "../../store/auth/sessionAlive/actions"

let intervalId

const Authmiddleware = ({
  history: history,
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {

  const [islogOut, setIsLogOut] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {


    if (isAuthProtected) {


      let timer

      const hasNoActivity = () => {

        const now = new Date().getTime();
        const timeSinceLastActivity = now - sessionStorage.getItem('keepSessionAlive2');
        const minutesSinceLastActivity = Math.floor((timeSinceLastActivity / 1000) / 60);
      
        if (minutesSinceLastActivity >= 29) {
          //console.log(" hasNoActivity===minutesSinceLastActivity==lesstahn 1", new Date())  //##########################

          clearInterval(intervalId);
          clearInterval(timer);
          sessionStorage.clear()
          localStorage.clear()
          setIsLogOut(true)
          history.push({ pathname: '/logout' })
          window.location.reload(true)
        } else {
          //console.log(" hasNoActivity===reset==less", new Date()) //##########################
          resetTimer();
        }

      }

      const startTimer = () => {
        //console.log(" startTimer", new Date()) //##########################
        timer = setInterval(hasNoActivity, 30 * 60 * 1000);
      };

      const resetTimer = () => {
        //console.log(" resetTimer", new Date())  //##########################
        sessionStorage.setItem('keepSessionAlive2', new Date().getTime())
        clearInterval(timer);
        startTimer();
      };

      let hasActivity = sessionStorage.getItem('lastActivityTime', new Date())
      !hasActivity && keepSessionAlive(dispatch);
      localStorage.getItem("token") && startTimer()

      window.addEventListener('keydown', resetTimer);
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);


      return () => {
        //console.log(" return autologout will mount", new Date())  //##########################

        clearInterval(timer);
        document.removeEventListener('keydown', resetTimer);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
      };
    }
  }, []);

  return (
    <>

      <Route
        {...rest}

        render={props => {

          if (islogOut || (isAuthProtected && !localStorage.getItem("token"))) {
            return (
              <Redirect
                to={{ pathname: "/login", state: { from: props.location } }} />
            )
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
  intervalId = setInterval(() => updateTokan(dispatch), 28 * 60 * 1000)
};


