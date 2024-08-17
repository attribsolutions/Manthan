import React, { memo, useEffect } from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"

import { sessionAliveNewToken } from "../../store/auth/sessionAlive/actions"
import { useSession } from "./SessionContext"
import { getUserDetailsAction, loginSuccessAction, loginUser, logoutReset, logoutUserSuccess } from "../../store/actions"
import { afterloginOneTimeAPI } from "../../components/Common/AfterLoginApiFunc"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

let intervalId

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isPartyWisePage,
  ...rest
}) => {
  const { session, updateSessionActivity } = useSession();
  const dispatch = useDispatch()
  const history = useHistory()



  const url = rest.history.location.pathname;
  const ActualPath = rest.path;
  const Credentials = url.split("/").pop();
  const IsLoginFromOutsideLink = ActualPath.split(':')[1] === "Credentials" ? true : false;



  const {
    loginSuccess,
    divisionDropdown_redux = [],
    loading,
    loginError
  } = useSelector((state) => ({
    loginError: state.Login.loginError,
    divisionDropdown_redux: state.Login.divisionDropdown,
    loginSuccess: state.Login.loginSuccess,
    afterLoginUserDetails: state.Login.afterLoginUserDetails,
    loading: state.Login.loading,

  })
  );



  useEffect(() => {
    if ((IsLoginFromOutsideLink) && Credentials !== "") {
      if (session.active === false && !(localStorage.getItem("token"))) {
        const [User, password] = Credentials?.split('-') || [];
        const values = {
          UserName: User,
          Password: password
        };
        dispatch(loginUser(values));
      }
    }

  }, [])

  useEffect(async () => {

    if ((IsLoginFromOutsideLink) && Credentials !== "") {
      try {
        if ((loginSuccess.Status === true) && (loginSuccess.StatusCode === 200)) {
          updateSessionActivity({ active: true });
          localStorage.setItem("token", (loginSuccess.token))
          localStorage.setItem("refreshToken", (loginSuccess.refreshtoken))
          localStorage.setItem("userId", (loginSuccess.UserID))
          sessionStorage.setItem("foreceReload", true)
          dispatch(loginSuccessAction({ Status: false }))
          dispatch(getUserDetailsAction(loginSuccess.UserID))
        }
      } catch (e) { }
    }
  }, [loginSuccess])

  useEffect(() => {
    if ((IsLoginFromOutsideLink) && Credentials !== "" && url.includes("AuthLink")) {
      
      if (divisionDropdown_redux.length > 0) {
        let user = divisionDropdown_redux[0];
        if (user.Party_id === null) {
          user.Party_id = 0;
        }
        if (session.active === true && (localStorage.getItem("token"))) {
          afterloginOneTimeAPI(user, dispatch);// all common function
        }
      }
    }
  }, [divisionDropdown_redux]);

  if (IsLoginFromOutsideLink) {

    return (
      <Route
        {...rest}
        render={props => {
          if (loginError !== null) {
            return (
              <Redirect
                to={{ pathname: "/login" }} />
            )
          }
          return (
            !loading && <Layout isPartyWisePage={isPartyWisePage}>
              <Component {...props} />
            </Layout>
          )
        }}
      />
    )
  } else {
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
              <Layout isPartyWisePage={isPartyWisePage}>
                <Component {...props} />
              </Layout>
            )
          }}
        /></>
    )
  }
}

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  userPageAccess: PropTypes.any,
  history: PropTypes.object,
}

export default memo(Authmiddleware);


















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


