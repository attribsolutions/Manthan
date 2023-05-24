import React from "react";
import { Col, Container, Row, Label } from "reactstrap";
import { AvForm, AvInput, AvGroup, AvFeedback, } from "availity-reactstrap-validation";
import { useHistory } from "react-router-dom";
import MetaTags from "react-meta-tags"
import { Link } from "react-router-dom"
// import images
import logo from "../../assets/images/logo-sm.svg"
import otp from "../../assets/images/otp.jfif"
//Import config
import CarouselPage from "./CarouselPage"
const EnterOTP = () => {
    const history = useHistory();
    function submit(e) {
        history.push("/ResetPassword");
    }
    return (
        <React.Fragment>
        <MetaTags>
          <title>Login | FoodERP 2.0</title>
        </MetaTags>
        <div className="auth-page">
          <Container fluid className="p-0">
            <Row className="g-0">
              <Col lg={4} md={5} className="col-xxl-4">
                <div className="auth-full-page-content d-flex p-sm-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="mb-4 mb-md-5 text-center">
                        <Link to="/dashboard" className="d-block auth-logo">
                          <img src={logo} alt="" height="35" /> <span className="logo-txt">FoodERP</span>
                        </Link>
                      </div>
                      <div className="auth-content my-auto text-center">
                      <img src={otp} alt="" height="100" />
                        <div className="text-center">
                          <h5 className="mb-0">Enter OTP...!</h5>
                          </div>
                        <AvForm
                          className="custom-form mt-4 pt-2"
                          onValidSubmit={(e, v) => {
                            submit(e, v)
                          }}
                        >
                          <AvGroup>
                            <Row  >
                              <div >
                                <Label className="col-sm-3 col-form-label"  >
                                </Label>
                                <Col>
                                  <AvInput name="name" type='text' placeholder="Enter OTP" value={""}
                                    required
                                  />
                                  <AvFeedback>OTP is Required....!</AvFeedback>
                                </Col>
                                </div>
                            </Row>
                          </AvGroup>
                          <div className="mb-3 mb-md-5 text-center">
                      <button className="btn btn-primary w-100 waves-effect waves-light"  type="submit">
                                 Reset
                                </button>
                      </div>
                        </AvForm>
  
                      </div>
                     
                      <div className="mt-4 mt-md-5 text-center">
                        <p className="mb-0">© {new Date().getFullYear()} FoodERP . Crafted with <i className="mdi mdi-heart text-danger"></i> by Attrib Solutions.</p>
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
export default EnterOTP;


