import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useEffect } from "react"

import { Row, Col, Alert, Container } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"


/// tsdfddf Punam demotest
// actions
import { loginUser } from "../../store/actions"

// import images
import logo from "../../assets/images/logo-sm.svg"

//Import config
import CarouselPage from "./CarouselPage"

const Login = props => {
  const dispatch = useDispatch()

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }))

  useEffect(()=>{
localStorage.clear();
document.getElementById("UserName").focus();
  },[])
  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    dispatch(loginUser(values, props.history))
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | FoodERP Live</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height="28" /> <span className="logo-txt">FoodERP</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Welcome !</h5>
                        <p className="text-muted mt-2">Sign in to Continue FoodERP.</p>
                      </div>
                      <AvForm
                        className="custom-form mt-4 pt-2"
                        onValidSubmit={(e, v) => {
                          handleValidSubmit(e, v)
                        }}
                      >
                        {error ? <Alert color="danger">{error}</Alert> : null}
                        <div className="mb-3">
                          <AvField
                            name="UserName"
                            label="UseName"
                            // value="Pradnya11122"
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
                            {/* <div className="flex-shrink-0">
                              <div className="">
                                <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                              </div>
                            </div> */}
                          </div>

                          <div className="mb-3">
                            <AvField
                              name="Password"
                              // value="123456"
                              type="password"
                              className="form-control"
                              required
                              placeholder="Enter Password"
                            />
                          </div>
                        </div>
                        <div className="row mb-4">
                          {/* <div className="col"> */}
                            {/* <div className="form-check"> */}
                              {/* <input className="form-check-input" type="checkbox" id="remember-check" />
                              <label className="form-check-label" htmlFor="remember-check">
                                Remember me
                              </label> */}
                              <Link to="/forgot-password" className="fw-semibold">Forgot password?</Link>
                            {/* </div> */}
                          {/* </div> */}

                        </div>
                        <div className="mb-3">
                          <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Login</button>
                        </div>
                      </AvForm>


                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">?? {new Date().getFullYear()} Minia . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
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
