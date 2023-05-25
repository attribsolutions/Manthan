import React ,{useState}from "react";
import { Col, Container, Row, Label } from "reactstrap";
import { AvForm, AvInput, AvGroup, AvFeedback, } from "availity-reactstrap-validation";
import MetaTags from "react-meta-tags"
import { Link } from "react-router-dom"
// import images
import logo from "../../assets/images/foodERP_logo.png"
import enterpass from "../../assets/images/Enterpass.png"
//Import config
import CarouselPage from "./CarouselPage"
const ResetPassword = () => {
    const [Password,setPassword]=useState('')  
    const [confirmPassword,setconfirmPassword]=useState('')
    function submit(e)
    {
        
      if(!(Password ===confirmPassword)){
            alert("Password and Confirm Password does not match")
       }
        else {
           alert(" Password created successfully")  
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
            <Col lg={4} md={5} className="col-xxl-4">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height="28" /> <span className="logo-txt">FoodERP</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto text-center">
                    <img src={enterpass} alt="" height="70" />
                      <div className="text-center">
                        <h5 className="mb-0">Enter New Password...!</h5>
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
                                <AvInput name="name" type='text' placeholder="Enter User Name" value={""}
                                  required
                                />
                                <AvFeedback> UserName is Required....!</AvFeedback>
                              </Col>
                              </div>
                          </Row>
                        </AvGroup>
                      
                      <AvGroup>
                          <Row  >
                            <div >
                              <Label className="col-sm-3 col-form-label"  >
                              </Label>
                              <Col>
                                <AvInput name="name" type='text' placeholder="Enter New Password" 
                             value={Password} 
                             onChange={(e)=>{setPassword(e.target.value)}} 
                                  required
                                />
                                <AvFeedback>  New Password is Required....!</AvFeedback>
                              </Col>
                              </div>
                          </Row>
                        </AvGroup>
                        <AvGroup>
                          <Row  >
                            <div >
                              <Label className="col-sm-3 col-form-label"  >
                              </Label>
                              <Col>
                                <AvInput name="name" type='text' placeholder="Enter Confirm New Password"
                                value={confirmPassword}
                               onChange={(e)=>{setconfirmPassword(e.target.value)}}
                                  required
                                />
                                <AvFeedback> Confirm New Password is Required....!</AvFeedback>
                              </Col>
                              </div>
                          </Row>
                        </AvGroup>
                        <AvGroup>
                        <Row  >
                        <div className="mb-4 mb-md-5 text-center">
                    <button className="btn btn-primary w-100 waves-effect waves-light">
                               Reset
                              </button>
                    </div>
                    </Row>
                    </AvGroup>
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
export default ResetPassword;



