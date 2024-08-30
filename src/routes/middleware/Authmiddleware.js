import React, { memo, useEffect, useLayoutEffect } from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"

import { sessionAliveNewToken } from "../../store/auth/sessionAlive/actions"
import { useSession } from "./SessionContext"
import { getUserDetailsAction, loginSuccessAction, loginUser, logoutReset, logoutUserSuccess } from "../../store/actions"
import { afterloginOneTimeAPI } from "../../components/Common/AfterLoginApiFunc"
import { useDispatch, useSelector } from "react-redux"

import BreadcrumbVertical from "../../components/VerticalLayout/breadcrumb/index"



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


  const url = rest.history.location.pathname;
  const ActualPath = rest.path;
  const Credentials = url.split("/").pop();
  // const IsLoginFromOutsideLink = ActualPath.split(':')[1] === "Credentials" ? true : false;

  const IsLoginFromOutsideLink = ActualPath.split(':')[1] === "Credentials" && rest.history.location.pathname.includes('-');

  const {
    loginSuccess,
    divisionDropdown_redux = [],
    loading,
    loginError,
    userAccess
  } = useSelector((state) => ({
    loginError: state.Login.loginError,
    divisionDropdown_redux: state.Login.divisionDropdown,
    loginSuccess: state.Login.loginSuccess,
    afterLoginUserDetails: state.Login.afterLoginUserDetails,
    loading: state.Login.loading,
    userAccess: state.Login.RoleAccessUpdateData,

  })
  );


  useEffect(() => {
    if ((IsLoginFromOutsideLink) && Credentials !== "") {
      localStorage.clear();
      sessionStorage.clear();
      if (session.active === false || !(localStorage.getItem("token"))) {
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
            !loading && userAccess.length > 0 &&
            (
              <div>
                <BreadcrumbVertical />
                <Component {...props} />
              </div>
            )


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





















