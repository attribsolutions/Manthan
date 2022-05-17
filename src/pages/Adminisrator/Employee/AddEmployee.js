import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, CardHeader, Label, Button,Input } from "reactstrap";
import { AvForm, AvInput, AvGroup, AvFeedback } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {getDesignationID,getEmployeeType,getState,getRegion,postEmployee,getCompany}
 from "../../../store/Administrator/M_Employee/action";
 import Breadcrumbs from "../../../components/Common/Breadcrumb";

import AvField from "availity-reactstrap-validation/lib/AvField";

const AddEmployee = () => {
    const dispatch = useDispatch();
    
    const [DesignationIDselect, setDesignationID] = useState("");
    const [EmployeeTypeselect, setEmployeeType] = useState("");
    const [Stateselect, setState] = useState("");
    const [Regionselect, setRegion] = useState("");
    const [Companyselect, setCompany] = useState("");
    const [LoginName, setName] = useState("");
    const [Address, setAddress] = useState("");
    const [PhoneNo, setMobile] = useState("");
    const [Email, setEmailID] = useState("");
    const [pan, setPAN] = useState("");
    const [AadharNo, setAadharNo] = useState("");
    const [WorkingHours, setWorkingHours] = useState("");
   
   
  /// DesignationIDDropDown
useEffect(() => {
    dispatch(getDesignationID());
    dispatch(getEmployeeType());
    dispatch(getState());
    dispatch(getRegion());
    dispatch(getCompany());
  }, [dispatch]);
  
  const { DesignationID ,EmployeeType,State,Region,Company} = useSelector((state) => ({
    DesignationID: state.M_EmployeesReducer.DesignationID,
    EmployeeType: state.M_EmployeesReducer.EmployeeType,
    State: state.M_EmployeesReducer.State,
    Region: state.M_EmployeesReducer.Region,
    Company: state.M_EmployeesReducer.Company,
  }));

  const DesignationIDValues = DesignationID.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));
  
  function handllerDesignationID(e) {
    setDesignationID(e)
  }

  const EmployeeTypeValues = EmployeeType.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));
  
  function handllerEmployeeType(e) {
    setEmployeeType(e)
  }

  const StateValues = State.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));
  
  function handllerState(e) {
    setState(e)
  }
  
  const RegionValues = Region.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));
  
  function handllerRegion(e) {
    setRegion(e)
  }

  const CompanyValues = Company.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));
  
  function handllerCompany(e) {
    setCompany(e)
  }
  
  const handleValidSubmit = (event, values) => {
      let DateInput=document.getElementById("dateInput").value;
    const requestOptions = {
      body: JSON.stringify({
        Name:values.LoginName,
        Address:values.Address,
        Mobile:values.PhoneNo,
        EmailID:values.Email,
        BOD:DateInput,
        PAN:values.pan,
        AadharNo:values.AadharNo,
        WorkingHours:values.WorkingHours,
        DesignationID: DesignationIDselect.value,
        EmployeeType: EmployeeTypeselect.value,
        JoiningDate:DateInput,
        State: Stateselect.value,
        Region: Regionselect.value,
        Companie: Companyselect.value,

      }),
    }
    dispatch(postEmployee(requestOptions.body));
    console.log("requestOptions",requestOptions.body)
    console.log("values",values) 
}

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs breadcrumbItem={"Employee Registration "} />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <AvForm
                    onValidSubmit={(e, v) => {
                      handleValidSubmit(e, v);
                    }}
                  >
                    
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Name
                        </Label>
                        <Col sm={4}>
                          <AvField name="LoginName" id="txtName" value={LoginName}
                            type="text"
                            placeholder="Please Enter Name"
                            // autoComplete='off'
                             validate={{
                              required: { value: true, errorMessage: 'Please enter your Name...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                    <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Address
                        </Label>
                        <Col sm={4}>
                          <AvField name="Address" value={Address} type="text"
                            placeholder=" Please Enter Address "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter your Address' },
                            }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                          Mobile No.
                        </Label>
                        <Col sm={4}>
                          <AvField name="PhoneNo" type="tel"
                            value={PhoneNo}
                            placeholder="+91 "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter your Mobile NO' },
                              tel: {
                                pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/
                              }
                              
                            }
                            }
                         
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                    
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                         EmailID
                        </Label>
                        <Col sm={4}>
                          <AvField name="Email" type="email"
                            value={Email}
                            placeholder="Enter your EmailID "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter your EmailID' },
                              tel: {
                                pattern: /\S+@\S+\.\S+/
                              }
                            }
                            }
                         
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                      
                    <Row className="mb-4">
                    <Label className="col-sm-2 col-form-label">
                        BOD
                        </Label>
                 <div class="col-lg-2">
                 <Input
                  className="form-control"
                  id="dateInput"
                  type="date"
                  defaultValue={""}
                  on
                //    id="example-date-input"
                />
               </div>
              </Row>   

                     <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                         PAN
                        </Label>
                        <Col sm={4}>
                          <AvField name="pan" type="text"
                            value={pan}
                            placeholder="Enter your PAN No. "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter your PAN No.' },
                              tel: {
                                pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
                              }
                            }
                            }
                         
                          />
                        </Col>
                      </Row>
                    </AvGroup>
                    
                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        AadharNo
                        </Label>
                        <Col sm={4}>
                          <AvField name="AadharNo" type="text"
                            value={AadharNo}
                            placeholder="Enter your AadharNo. "
                            validate={{
                              required: { value: true, errorMessage: 'Please Enter your AadharNo' },
                              tel: {
                                pattern: /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/
                              }
                            }
                            }
                        
                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        WorkingHours
                        </Label>
                        <Col sm={4}>
                          <AvField name="WorkingHours" id="text" value={WorkingHours}
                            type="text"
                            placeholder="Please Enter WorkingHours"
                            // autoComplete='off' 
                            validate={{
                              required: { value: true, errorMessage: 'Please enter your WorkingHours ...!' },
                            }} />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        DesignationID
                        </Label>
                        <Col sm={4}>
                          <Select
                            value={DesignationIDselect}
                            options={DesignationIDValues}
                            onChange={(e) => { handllerDesignationID(e) }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        EmployeeType
                        </Label>
                        <Col sm={4}>
                          <Select
                            value={EmployeeTypeselect}
                            options={EmployeeTypeValues}
                            onChange={(e) => { handllerEmployeeType(e) }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <Row className="mb-4">
                    <Label className="col-sm-2 col-form-label">
                    JoiningDate
                        </Label>
                 <div class="col-lg-2">
                 <Input
                  className="form-control"
                  id="dateInput"
                  type="date"
                  defaultValue={""}
                  on
                   />
                  </div>
                </Row>   

                  <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        State
                        </Label>
                        <Col sm={4}>
                          <Select
                            value={Stateselect}
                            options={StateValues}
                            onChange={(e) => { handllerState(e) }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                        Region
                        </Label>
                        <Col sm={4}>
                          <Select
                            value={Regionselect}
                            options={RegionValues}
                            onChange={(e) => { handllerRegion(e) }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <AvGroup>
                      <Row className="mb-4">
                        <Label className="col-sm-2 col-form-label">
                     CompanyName
                        </Label>
                        <Col sm={4}>
                          <Select
                            value={Companyselect}
                            options={CompanyValues}
                            onChange={(e) => { handllerCompany(e) }}
                          />
                        </Col>
                      </Row>
                    </AvGroup>

                    <Row className="justify-content-end">
                      <Col sm={2}>
                        <div>
                          <Button
                            type="submit"
                            className="btn btn-success w-md"
                          >
                           Submit
                          </Button>
                            
                        </div>
                      </Col>{" "}
                      <Col sm={10}></Col>
                    </Row>

                  </AvForm>
                  <div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
export default AddEmployee
