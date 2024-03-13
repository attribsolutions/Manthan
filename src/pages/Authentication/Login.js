import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"
import { Row, Col, Alert, Container, Input } from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import { withRouter, Link, useHistory } from "react-router-dom"


import {
  divisionDropdownSelectSuccess,
  getUserDetailsAction,
  loginError_Action,
  loginSuccessAction,
  loginUser,
  resetRoleAccessAction,
} from "../../store/actions"
import logo from "../../assets/images/cbm_logo.png"
import CarouselPage from "./CarouselPage"
import { useLayoutEffect } from "react"
import { afterloginOneTimeAPI } from "../../components/Common/AfterLoginApiFunc"
import { useSession } from "../../routes/middleware/SessionContext"

const Login = props => {

  const dispatch = useDispatch()
  const history = useHistory()

  const [currentUserName, setcurrentUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const { loginError, loginSuccess, divisionDropdown_redux = [], userAccess, loading } = useSelector(state => ({
    loading: state.Login.loading,
    loginError: state.Login.loginError,
    loginSuccess: state.Login.loginSuccess,
    divisionDropdown_redux: state.Login.divisionDropdown,
    userAccess: state.Login.RoleAccessUpdateData,
  }))
  const { session, updateSessionActivity } = useSession();

  useLayoutEffect(() => {

    dispatch(resetRoleAccessAction())
    dispatch(divisionDropdownSelectSuccess([]))
  }, []);

  useLayoutEffect(() => {
    try {
      let forceReload = sessionStorage.getItem("foreceReload");
      if (forceReload === "true") {
        sessionStorage.setItem("foreceReload", false)
        window.location.reload(true);
      }
      if ((session.active === true && (localStorage.getItem("token")) && (localStorage.getItem("roleId")))) {
        history.push({ pathname: "/Dashboard" })
        return
      }
      document.getElementById("UserName").focus();
    } catch (e) { }
  }, [])



  useEffect(() => {
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
  }, [loginSuccess])

  useEffect(() => {

    if (divisionDropdown_redux.length === 1) {
      let user = divisionDropdown_redux[0];
      if (user.Party_id === null) {
        user.Party_id = 0;
      }

      if (session.active === true && (localStorage.getItem("token"))) {
        //api call roleAceessAction Api,partysetting Api , Party Dropdown Api and set localstorage roleId ;
        afterloginOneTimeAPI(user, dispatch);// all common function
      }
    }
    else if (divisionDropdown_redux.length > 1) {
      history.push("/division");
    }
  }, [divisionDropdown_redux]);

  useEffect(() => {

    let dashboardFound = userAccess.find((i) => i.ModuleName === "Dashboard");
    if (divisionDropdown_redux.length === 1 && userAccess.length > 1) {
      if (dashboardFound) {
        history.push(`/${dashboardFound.ActualPagePath}`);
      } else {
        history.push("/Dashboard");
      }
    }

  }, [userAccess]);

  const currentUserOnchange = (e) => {
    setcurrentUserName(e.target.value)
    dispatch(loginError_Action(null))
  }

  const PasswordOnchange = (e) => {
    setPassword(e.target.value)
    dispatch(loginError_Action(null))
  }

  const SaveHandler = async (event) => {
    if (currentUserName === "") {
      dispatch(loginError_Action("Invalid UserName"))
      return
    }

    if (Password === "") {
      dispatch(loginError_Action("Incorrect Password"))
      return
    }

    event.preventDefault();
    const values = {
      UserName: currentUserName,
      Password: Password
    }
    dispatch(loginUser(values, props.history))
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  function handleKeyDown(event) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | FoodERP 2.0</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 md-5 text-center">
                      <div style={{ cursor: "context-menu" }} className="logo logo-dark">
                        <span className="logo-txt">FoodERP 2.0</span>
                      </div>
                      <img src={logo} alt="" height="90" />

                    </div>
                    <div className="auth-content my-auto">
                      <div style={{ cursor: "context-menu" }} className="text-center">
                        <h5 className="mb-0">Welcome !</h5>
                        <p className="text-muted mt-2">Sign in to Continue FoodERP 2.0</p>
                      </div>
                      {loginError ? (
                        <Alert color="danger" style={{ marginTop: "13px" }}>
                          {loginError}
                        </Alert>
                      ) : null}
                      <form >
                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <label className="form-label">User Name</label>
                            </div>
                          </div>

                          <div className="mb-3">
                            <Input
                              name="UserName"
                              type="text"
                              value={currentUserName}
                              autoComplete="off"
                              autoFocus={false}
                              onKeyDown={handleKeyDown}
                              required
                              onChange={currentUserOnchange}
                              placeholder="Enter User Name"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <label className="form-label">Password</label>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="input-group">
                              <Input
                                name="Password"
                                value={Password}
                                autoComplete="off"
                                onChange={PasswordOnchange}
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                onKeyDown={handleKeyDown}
                                required
                                placeholder="Enter Password"
                              />
                              <button
                                className="btn btn-outline-primary"
                                style={{ borderColor: "#d4d4d4" }}
                                type="button"
                                onClick={toggleShowPassword}
                              >
                                {showPassword ? <i className="mdi mdi-eye-off"></i> : <i className="mdi mdi-eye"></i>}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className=" mb-4">

                          <Link to="/forgot-password" className="fw-semibold">Forgot password?</Link>

                        </div>
                        <div className="mb-3">
                          {loading ?
                            <button className="btn btn-primary w-100 waves-effect waves-light" autoFocus type="button">
                              <div className="dot-pulse"> <span> Login</span> &nbsp;
                                <div className="bounce1" style={{ background: "white" }}></div>
                                <div className="bounce2" style={{ background: "white" }}></div>
                                <div className="bounce3" style={{ background: "white" }}></div>
                              </div> </button>
                            : <button className="btn btn-primary w-100 waves-effect waves-light" autoFocus type="submit" id="loginbtn" onClick={SaveHandler} >Login</button>}

                        </div>
                      </form>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p style={{ cursor: "context-menu" }} className="mb-0">© {new Date().getFullYear()}.Developed by Attrib Solution</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}