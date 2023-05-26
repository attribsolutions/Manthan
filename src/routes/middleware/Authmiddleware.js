import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { sessionAliveNewToken } from "../../store/auth/sessionAlive/actions"


let count1 = 0
let count2 = 0
let count3 = 0
let count4 = 0
let count5 = 0
let count6 = 0
let count7 = 0


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

      //console.log("inside useEffect", count2)//________________________
      ++count2                             //________________________

      let timer

      const hasNoActivity = () => {

        //console.log(" hasNoActivity", count3) //________________________
        ++count3                               //________________________

        clearInterval(intervalId);
        clearInterval(timer);
        sessionStorage.clear()
        setIsLogOut(true)
        // history.push({ pathname: '/login' })
      }

      const startTimer = () => {

        //console.log(" startTimer", count4) //________________________
        ++count4                              //________________________

        timer = setInterval(hasNoActivity, 2 * 60 * 1000);
      };

      const resetTimer = () => {
        //console.log(" resetTimer", count5) //________________________
        ++count5
        clearInterval(timer);
        startTimer();
      };

      let hasActivity = sessionStorage.getItem('lastActivityTime', new Date().getTime())
      !hasActivity && keepSessionAlive(dispatch);
      localStorage.getItem("token") && startTimer()

      window.addEventListener('keydown', resetTimer);
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);


      return () => {
        //console.log(" return", count6) //________________________
        ++count6
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
  console.log(" keepSessionAlive  api call", count7)
  let istoken = localStorage.getItem("refreshToken")
  if (istoken) {
    let jsonBody = { "refresh": `${istoken}` }
    dispatch(sessionAliveNewToken(jsonBody))
  }
}

const keepSessionAlive = (dispatch) => {
  console.log(" keepSessionAlive", count7) //________________________
  ++count7

  sessionStorage.setItem('keepSessionAlive', new Date().getTime())
  intervalId = setInterval(() => updateTokan(dispatch), 1 * 60 * 1000)
};
