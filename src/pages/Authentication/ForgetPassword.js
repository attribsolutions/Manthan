import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"
import { Row, Col, Alert, Container, Button } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link, useHistory } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"

// action
import {
  changePasswordForForgetPassword,
  changePasswordForForgetPasswordError,
  changePasswordForForgetPasswordSuccess,
  userForgetPassword_sendOTP,
  userForgetPassword_sendOTP_Error,
  userForgetPassword_sendOTP_Success
} from "../../store/actions"

// import images
import logo from "../../assets/images/cbm_logo.png"
import CarouselPage from "./CarouselPage"
import resetImage from "../../assets/images/resetpassword.png"

const ForgetPasswordPage = props => {
  const dispatch = useDispatch();
  // const history = useHistory();
  const [paswErr, setPaswErr] = useState(false)
  const {
    sendOTPSuccessMsg_redux,
    sendOtpMegError_reducx,
    sendPasswordError_reducx,
    sendPasswordMsg_reducx, Loading } = useSelector(state => ({
      sendOTPSuccessMsg_redux: state.ForgetPassword.sendOTPSuccessMsg,
      sendOtpMegError_reducx: state.ForgetPassword.sendOtpMegError,
      sendPasswordMsg_reducx: state.ForgetPassword.sendPasswordMsg,
      sendPasswordError_reducx: state.ForgetPassword.sendPasswordError,
      Loading: state.ForgetPassword.Loading,



    }))
  const [sendPasswordMsg, setSendPasswordMsg] = useState(null)
  const [sendPasswordError, setSendPasswordError] = useState(null)

  const [sendOtpMegError, setSendOtpMegError] = useState(null)
  const [sendOTPSuccessMsg, setSendOTPSuccessMsg] = useState(null)
  const [setpawShowUI, setSetpawShowUI] = useState(false)

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatched, setPasswordMatched] = useState(true);


  useEffect(() => {

    if (sendPasswordMsg_reducx) {
      setSendPasswordMsg(sendPasswordMsg_reducx)
      setSendPasswordError(null)
      dispatch(changePasswordForForgetPasswordSuccess(null))

    }
    if (sendPasswordError_reducx) {
      setSendPasswordError(sendPasswordError_reducx)
      dispatch(changePasswordForForgetPasswordError(null))
      setSendPasswordMsg(null)
      setSendOTPSuccessMsg(null)

    }
  }, [sendPasswordMsg_reducx, sendPasswordError_reducx])

  useEffect(() => {

    if (sendOTPSuccessMsg_redux) {
      setSendOTPSuccessMsg(sendOTPSuccessMsg_redux)
      setSendOtpMegError(null)
      setSetpawShowUI(true)
      dispatch(userForgetPassword_sendOTP_Success(null))
    }
    if (sendOtpMegError_reducx) {
      setSendOtpMegError(sendOtpMegError_reducx)
      dispatch(userForgetPassword_sendOTP_Error(null))

    }

  }, [sendOTPSuccessMsg_redux, sendOtpMegError_reducx])

  function handleValidSubmit(event, values) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = !values.email.match(emailRegex)
    
    if (values.email === "" || isEmail) {
      dispatch(userForgetPassword_sendOTP_Error("Invalid Email"));
      return
    }

    event.preventDefault();
    var jsonBody = JSON.stringify({
      Email: values.email,
      Phone: ""
    })
    dispatch(userForgetPassword_sendOTP(jsonBody))
  }

  function handleValidSubmit1(event, values) {

    event.preventDefault();
    var paswd = values.password1
    var pawdcn = values.passwordcon

    if (!(paswd === pawdcn)) {
      setPaswErr(true)
      return
    }
    else {
      setPaswErr(false)

      var jsonBody = JSON.stringify({
        LoginName: values.LoginName,
        OTP: values.OTP,
        newpassword: values.passwordcon
      })
      dispatch(changePasswordForForgetPassword(jsonBody))
      // return
    }
  }


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setConfirmPassword(''); // Clear Confirm Password field
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatched(e.target.value === password);
  };

  function handleKeyDown(event) {
    
    // Check if the pressed key is a space
    if (event.key === " ") {
      // Check if the input contains only spaces
      if (event.target.value.trim() === "") {
        // Prevent default behavior (typing space)
        event.preventDefault();
      }
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
                    <div className="mb-4 md-5 text-center">
                      <div style={{ cursor: "context-menu" }} className="logo logo-dark">
                        <span className="logo-txt">FoodERP 2.0</span>
                      </div>
                      <img src={logo} alt="" height="150" style={{height:"175px"}} />

                    </div>
                    {
                      !sendPasswordMsg ?
                        <div className="auth-content my-auto text-center">
                          <img src={resetImage} alt="" height="100" />
                          <div style={{ cursor: "context-menu" }} className="text-center">
                            <h5 className="mb-0">  Reset Password</h5>
                          </div>

                          {sendOtpMegError || sendPasswordError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {sendOtpMegError}{sendPasswordError}
                            </Alert>
                          ) : null}
                          {sendOTPSuccessMsg ? (
                            <Alert color="success" style={{ marginTop: "13px" }}>
                              {sendOTPSuccessMsg}
                            </Alert>
                          ) : null}

                          {((setpawShowUI))
                            ?
                            <AvForm className="custom-form mt-4"
                              onValidSubmit={(e, v) => handleValidSubmit1(e, v)}
                            >
                              <div className="mb-3">
                                <label>LoginName</label>
                                <AvInput
                                  name="LoginName"
                                  onKeyDown={handleKeyDown}
                                  className="form-control mb-2"
                                  placeholder="LoginName"
                                  type="text"
                                  autoComplete="off"
                                  required
                                />

                                <label>Enter OTP</label>
                                <AvInput
                                  name="OTP"
                                  onKeyDown={handleKeyDown}
                                  className="form-control mb-2"
                                  placeholder="Enter OTP"
                                  type="text"
                                  required
                                />


                              </div>

                              <div>
                                <label>Password</label>
                                <AvInput
                                  name="password1"
                                  onKeyDown={handleKeyDown}
                                  className="form-control mb-2"
                                  autoComplete="new-password"
                                  placeholder="Enter password"
                                  type="password"
                                  required
                                  value={password}
                                  onChange={handlePasswordChange}
                                />

                                <label>Confirm Password</label>
                                <AvInput
                                  name="passwordcon"
                                  onKeyDown={handleKeyDown}
                                  className="form-control mb-2"
                                  autoComplete="new-password"
                                  placeholder="Enter confirm password"
                                  type="password"
                                  required
                                  value={confirmPassword}
                                  onChange={handleConfirmPasswordChange}
                                />

                                {passwordMatched ? (
                                  password !== '' && (
                                    <div className="text-success">Passwords match!</div>
                                  )
                                ) : (
                                  <div className="text-danger">Passwords do not match!</div>
                                )}
                              </div>


                              <div className="mb-3 mt-4">
                                <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Change Password</button>
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
                                  validate={() => { }}
                                  onKeyDown={handleKeyDown}
                                  placeholder="Enter email "
                                  type="text"

                                />
                              </div>

                              <div className="mb-3 mt-4">
                                {Loading ? <button className="btn btn-primary w-100 waves-effect waves-light" type="submit"> <div className="dot-pulse"> <span> Reset</span>     &nbsp;
                                  <div className="bounce1" style={{ background: "white" }}></div>
                                  <div className="bounce2" style={{ background: "white" }}></div>
                                  <div className="bounce3" style={{ background: "white" }}></div>
                                </div></button> : <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Reset</button>}
                              </div>
                            </AvForm>
                          }

                          <div className="mt-5 text-center">
                            <p className="text-muted mb-0">Remember It ?&nbsp;
                              <Link to="/Login" className="text-primary fw-semibold">Login</Link>
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
                            <Link to="/Login" className="text-primary fw-semibold"><Button type="submit" className="btn btn-success w-md" >login Here</Button></Link>

                          </div>
                        </div>
                    }
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()}.Developed by Attrib Solution </p>
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


export default ForgetPasswordPage
