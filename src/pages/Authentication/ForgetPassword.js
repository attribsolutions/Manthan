import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"
import { Row, Col, Alert, Container, Button } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link, useHistory } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { changePasswordForForgetPassword, changePasswordForForgetPasswordError, changePasswordForForgetPasswordSuccess, userForgetPassword, userForgetPassword_sendOTP, userForgetPassword_sendOTP_Success } from "../../store/actions"

// import images
import logo from "../../assets/images/logo-sm.svg"
import CarouselPage from "./CarouselPage"
import resetImage from "../../assets/images/resetpassword.png"

const ForgetPasswordPage = props => {
  const dispatch = useDispatch();
 const history= useHistory();
  const [paswErr, setPaswErr] = useState(false)
  const { sendOTPSuccessMsg_redux, sendOtpMegError, sendPasswordError, sendPasswordMsg_reducx } = useSelector(state => ({
    sendOTPSuccessMsg_redux: state.ForgetPassword.sendOTPSuccessMsg,
    sendOtpMegError: state.ForgetPassword.sendOtpMegError,
    sendPasswordMsg_reducx: state.ForgetPassword.sendPasswordMsg,
    sendPasswordError: state.ForgetPassword.sendPasswordError,


  }))
const [sendPasswordMsg, setSendPasswordMsg] = useState(null)
const [sendOTPSuccessMsg, setSendOTPSuccessMsg] = useState(null)

  useEffect(() => {
    if(sendPasswordMsg_reducx){
    setSendPasswordMsg(sendPasswordMsg_reducx)
    dispatch(changePasswordForForgetPasswordSuccess(null))
    // dispatch(changePasswordForForgetPasswordError(null))
  
  }
  if(sendOTPSuccessMsg_redux){
    setSendOTPSuccessMsg(sendOTPSuccessMsg_redux)
    dispatch(userForgetPassword_sendOTP_Success(null))
  
  }
  }, [sendPasswordMsg_reducx])
  
  function handleValidSubmit(event, values) {
    var jsonBody = JSON.stringify({
      Email: values.email,
        })
    dispatch(userForgetPassword_sendOTP(jsonBody))
  }
  function handleValidSubmit1(event, values) {
    var paswd = values.password1
    var pawdcn = values.passwordcon
    debugger
    if (!(paswd === pawdcn)) {
      // setPaswErr("form-control is-invalid mb-2")
      setPaswErr(true)
      return
    }
    else {
      // setPaswErr("form-control is-valid mb-2")
      setPaswErr(false)
      var jsonBody = JSON.stringify({
        UserID: values.userId,
        OTP: values.OTP,
        newpassword: values.passwordcon
      })
      dispatch(changePasswordForForgetPassword(jsonBody))
      // return
    }
  }
  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Forget Password | FoodERP - React Admin & FoodERP Template
        </title>
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
                    {
                      !sendPasswordMsg ?
                        <div className="auth-content my-auto text-center">
                          <img src={resetImage} alt="" height="100" />
                          <div className="text-center">
                            <h5 className="mb-0">  Reset Password</h5>
                          </div>

                          {sendOtpMegError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {sendOtpMegError}{sendPasswordError}
                            </Alert>
                          ) : null}
                          {sendOTPSuccessMsg ? (
                            <Alert color="success" style={{ marginTop: "13px" }}>
                              {sendOTPSuccessMsg}
                            </Alert>
                          ) : null}

                          {((sendOTPSuccessMsg))
                            ?
                            <AvForm className="custom-form mt-4"
                              onValidSubmit={(e, v) => handleValidSubmit1(e, v)}
                            >
                              <div className="mb-3">

                                <AvField
                                  name="userId"
                                  label="UserID"
                                  className="form-control mb-2"
                                  // dissabled={true}
                                  autoComplete="new-email"
                                  placeholder="UserID"
                                  type="text"
                                  // autoComplete="off"
                                  required
                                />

                                <AvField
                                  name="OTP"
                                  label="Enter OTP"
                                  className="form-control mb-2"
                                  // dissabled={true}
                                  placeholder="Enter OTP"
                                  type="text"

                                  required
                                />
                                <AvField
                                  name="password1"
                                  label="password"
                                  className={"form-control  mb-2"}

                                  // dissabled={true}
                                  invalid={paswErr}

                                  autoComplete="new-password"
                                  placeholder="Enter password"
                                  type="password"

                                  required
                                />
                                {(paswErr === true)
                                  ?
                                  <div className="text-danger"> Please Enter Correct Password</div>
                                  : <></>}
                                <AvField
                                  name="passwordcon"
                                  label="confirm password"
                                  className={"form-control  mb-2"}
                                  // dissabled={true}
                                  autoComplete="new-password"
                                  invalid={paswErr}
                                  placeholder="Enter confirm password"
                                  type="password"
                                  required
                                />
                                {(paswErr === true)
                                  ?
                                  <div className="text-danger"> Please Enter Correct Password</div>
                                  : <></>}
                              </div>

                              <div className="mb-3 mt-4">
                                <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">change Password</button>
                              </div>
                            </AvForm>
                            :
                            <AvForm className="custom-form mt-4"
                              onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                            >
                              <div className="mb-3">
                                <AvField
                                  name="email"
                                  label="Email"
                                  className="form-control"
                                  dissabled={true}
                                  placeholder="Enter email or phone no"
                                  type="email"
                                  required
                                />
                              </div>
                              <div className="mb-3 mt-4">
                                <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Reset</button>
                              </div>
                            </AvForm>
                          }



                          <div className="mt-5 text-center">
                            <p className="text-muted mb-0">Remember It ?  &nbsp
                              <Link to="/Login" className="text-primary fw-semibold">Login</Link>
                              {/* <a href="/login"
                          className="text-primary fw-semibold"> Sign In </a> */}
                            </p>
                          </div>
                        </div>
                        :
                        <div className="auth-content my-auto text-center">
                          <img src={resetImage} alt="" height="100" />
                          <div className="text-center">
                            <h5 className="mb-0">  Reset Password success</h5>
                          </div>

                          <Alert color="success" style={{ marginTop: "13px" }}>
                          {sendPasswordMsg}
                            </Alert>

                          <div className="mt-5 text-center">
                         <Link to="/Login" className="text-primary fw-semibold"><Button type="submit"  className="btn btn-success w-md" >login Here</Button></Link>

                          </div>
                        </div>
                    }
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()} Minia   . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
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

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
}

export default withRouter(ForgetPasswordPage)
