

import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useEffect } from "react"

import { Row, Col, Alert, Container } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link, useHistory } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField, } from "availity-reactstrap-validation"

import { divisionDropdownSelectSuccess, getUserDetailsAction, loginUser, resetRoleAccessAction, roleAceessAction, } from "../../store/actions"

import logo from "../../assets/images/cbm_logo.png"

import CarouselPage from "./CarouselPage"
import { loginCompanyID } from "../../components/Common/CommonFunction"
import { useLayoutEffect } from "react"
import LogoutChecker from "../../components/LogoutChecker/TabSessionAlive"

const Login = props => {


  const dispatch = useDispatch()
  const history = useHistory()

  const { loginError, loginSuccess, divisionDropdown_redux = [] } = useSelector(state => ({
    loginError: state.Login.loginError,
    loginSuccess: state.Login.loginSuccess,
    divisionDropdown_redux: state.Login.divisionDropdown,

  }))

  useLayoutEffect(() => {
    dispatch(resetRoleAccessAction())
    dispatch(divisionDropdownSelectSuccess([]))
  }, []);

  useLayoutEffect(() => {
    try {
      if ((localStorage.getItem("token")) && (localStorage.getItem("roleId"))) {
        history.push({ pathname: "/Dashboard" })
      }
      document.getElementById("UserName").focus();
    } catch (e) { }
  }, [])


  useEffect(() => {

    try {
      if ((loginSuccess.Status === true) && (loginSuccess.StatusCode === 200)) {

        localStorage.setItem("token", (loginSuccess.token))
        localStorage.setItem("userId", (loginSuccess.UserID))

        dispatch(getUserDetailsAction(loginSuccess.UserID))
        dispatch(loginSuccess({ Status: false }))
      }
    } catch (e) { }
  }, [loginSuccess])


  useEffect(() => {

    if (divisionDropdown_redux.length === 1) {

      let value = divisionDropdown_redux[0]
      let employee = value.Employee_id;
      let party = value.Party_id
      if ((party === null)) {
        party = 0;
        value.Party_id = 0
      }

      localStorage.setItem("roleId", JSON.stringify(value))
      localStorage.setItem("roleId2", JSON.stringify(value))

      dispatch(roleAceessAction(party, employee, loginCompanyID()))

      history.push("/Dashboard")
    } else if (divisionDropdown_redux.length > 1) {
      history.push("/division")
    }
  }, [divisionDropdown_redux])

  const handleValidSubmit = (event, values) => {

    dispatch(loginUser(values, props.history))
  }

  return (
    <React.Fragment>
      <LogoutChecker />
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
                      <Link to="/dashboard" className="d-block auth-logo">
                        <span className="logo-txt">FoodERP 2.0</span>
                      </Link>
                      <img src={logo} alt="" height="90" />

                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Welcome !</h5>
                        <p className="text-muted mt-2">Sign in to Continue FoodERP 2.0</p>
                      </div>
                      {loginError ? (
                        <Alert color="danger" style={{ marginTop: "13px" }}>
                          {loginError}
                        </Alert>
                      ) : null}
                      <AvForm
                        className="custom-form mt-4 pt-2"
                        onValidSubmit={(e, v) => {
                          handleValidSubmit(e, v)
                        }}
                      >

                        <div className="mb-3">
                          <AvField
                            name="UserName"
                            label="UserName"
                            className="form-control"
                            placeholder="Enter User Name"
                            type="text"
                            required
                          />

                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <label className="form-label">Password</label>
                            </div>
                          </div>

                          <div className="mb-3">
                            <AvField
                              name="Password"
                              type="password"
                              className="form-control"
                              required
                              placeholder="Enter Password"
                            />
                          </div>
                        </div>
                        <div className="row mb-4">

                          <Link to="/forgot-password" className="fw-semibold">Forgot password?</Link>

                        </div>
                        <div className="mb-3">
                          <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Login</button>
                        </div>
                      </AvForm>

                      {/* <div className="mt-4 mt-md-5 text-center">
                        <p className="mb-0 text-primary fw-semibold" onClick={() => { createSuperAdminHandler() }}> Create SuperAdmin </p>
                      </div> */}

                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()}.Developed by Attrib Solution</p>
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