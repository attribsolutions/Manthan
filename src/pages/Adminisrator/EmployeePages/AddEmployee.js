import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, Label, Button, Input, CardHeader, FormGroup } from "reactstrap";
import { AvForm, AvGroup, } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  getDesignationID, getEmployeeType, getState, getRegion,
  postEmployee, getCompany, updateEmployeeID, editEmployeeSuccess, PostEmployeeSuccess
}
  from "../../../store/Administrator/M_EmployeeRedux/action";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";

const AddEmployee = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);

  //'IsEdit'--if true then update data otherwise it will perfrom save operation
  const [IsEdit, setIsEdit] = useState(false);
  const [PageMode, setPageMode] = useState(false);

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  var editDataGatingFromList = props.state;
  console.log("editDataGatingFromList", editDataGatingFromList)
  const [DesignationIDselect, setDesignationID] = useState("");
  const [EmployeeTypeselect, setEmployeeType] = useState("");
  const [Stateselect, setState] = useState("");
  // const [Regionselect, setRegion] = useState("");
  const [Companyselect, setCompany] = useState("");

  useEffect(() => {
    dispatch(getDesignationID());
    dispatch(getEmployeeType());
    dispatch(getState());
    // dispatch(getRegion());
    dispatch(getCompany());
  }, [dispatch]);

  const { DesignationID, EmployeeType, State, Region, Company, AddUserMessage } = useSelector((state) => ({
    DesignationID: state.M_EmployeesReducer.DesignationID,
    EmployeeType: state.M_EmployeesReducer.EmployeeType,
    State: state.M_EmployeesReducer.State,
    // Region: state.M_EmployeesReducer.Region,
    Company: state.M_EmployeesReducer.Company,
    AddUserMessage: state.M_EmployeesReducer.AddUserMessage,
  }));

  const DesignationIDValues = DesignationID.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));
  function handllerDesignationID(e) {
    setDesignationID(e)
  }

  const EmployeeTypeValues = EmployeeType.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  function handllerEmployeeType(e) {
    setEmployeeType(e)
  }

  const StateValues = State.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));
  function handllerState(e) {
    setState(e)
  }

  // const RegionValues = Region.map((Data) => ({
  //   value: Data.ID,
  //   label: Data.Name
  // }));
  // function handllerRegion(e) {
  //   setRegion(e)
  // }

  const CompanyValues = Company.map((Data) => ({
    value: Data.ID,
    label: Data.Name
  }));
  function handllerCompany(e) {
    setCompany(e)
  }

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    // document.getElementById("txtName").focus();

    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setIsEdit(true);
      setDesignationID({
        value: editDataGatingFromList.Designation_id,
        label: editDataGatingFromList.DesignationName
      })
      setEmployeeType({
        value: editDataGatingFromList.EmployeeType_id,
        label: editDataGatingFromList.EmployeeTypeName
      })
      setState({
        value: editDataGatingFromList.State_id,
        label: editDataGatingFromList.StateName
      })
      // setRegion({
      //   value: editDataGatingFromList[0].Region.ID,
      //   label: editDataGatingFromList[0].Region.Name
      // })
      setCompany({
        value: editDataGatingFromList.Companies_id,
        label: editDataGatingFromList.CompanyName
      })

      dispatch(editEmployeeSuccess({ Status: false }))
      return
    }
  }, [editDataGatingFromList])

  useEffect(() => {
    if ((AddUserMessage.Status === true) && (AddUserMessage.StatusCode === 200)) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      // formRef.current.reset();
      if (PageMode === true) {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: AddUserMessage.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: AddUserMessage.Message,
          RedirectPath: '/employeesList',
          AfterResponseAction: false
        }))
      }
    }
    else if (AddUserMessage.Status === true) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: "error Message",
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [AddUserMessage.Status])

  //'Save' And 'Update' Button Handller
  const handleValidSubmit = (event, values) => {
    // let DateInput = document.getElementById("dateInput", "").value;
    // let DateInput1 = document.getElementById("dateInput1").value;
    const requestOptions = {
      body: JSON.stringify({
        Name: values.Name,
        Address: values.Address,
        Mobile: values.Mobile,
        email: values.email,
        DOB: values.DOB,
        PAN: values.PAN,
        AadharNo: values.AadharNo,
        working_hours: values.working_hours,
        Designation: DesignationIDselect.value,
        EmployeeType: EmployeeTypeselect.value,
        // JoiningDate:values. JoiningDate,
        State: Stateselect.value,
        // Region: Regionselect.value,
        Companies: Companyselect.value,

      }),
    }
    debugger
    if (IsEdit) {
      dispatch(updateEmployeeID(requestOptions.body, EditData.id));
      console.log("requestOptions", requestOptions.body)
    }
    else {
      dispatch(postEmployee(requestOptions.body));

    }

  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditModeSaSS = ''
  if (IsEdit === true) { IsEditModeSaSS = "-3.5%" };
  console.log(EditData)
  return (
    <React.Fragment>
      <div className="page-content" style={{ marginTop: IsEditModeSaSS }}>
        <Breadcrumbs breadcrumbItem={"Employee Master "} />
        <Container fluid>



          <Card>
            <Row>
              <Col lg={12}>
                <Card >
                  <CardHeader>
                    <h4 className="card-title">React Validation - Normal</h4>
                    <p className="card-title-desc">Provide valuable, actionable feedback to your users with HTML5 form validation–available in all our supported browsers.</p>
                  </CardHeader>

                  <CardBody>
                    <AvForm
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v);
                      }}
                      ref={formRef}
                    >
                      <Row>
                        <Card style={{ backgroundColor: "whitesmoke" }} >
                        
                            <Row  className="mt-2">

                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">Name </Label>
                                  <AvField name="Name" id="txtName" value={EditData.Name}
                                    type="text"
                                    placeholder="Please Enter Name"
                                    autoComplete='off'
                                    validate={{
                                      required: { value: true, errorMessage: 'Please enter your Name...!' },
                                    }}
                                  />
                                </FormGroup>
                              </Col>

                              <Col md="1">  </Col>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">Email </Label>
                                  <AvField name="email"
                                    id="email"
                                    type="email"
                                    value={EditData.email}
                                    placeholder="Enter your EmailID "
                                    validate={{
                                      required: { value: true, errorMessage: 'Please Enter your EmailID' },
                                      tel: {
                                        pattern: /\S+@\S+\.\S+/
                                      }
                                    }}

                                  />

                                </FormGroup>
                              </Col>
                              <Col md="1">  </Col>

                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">MobileNo </Label>
                                  <AvField name="Mobile" type="tel"
                                    value={EditData.Mobile}
                                    placeholder="+91 "
                                    validate={{
                                      required: { value: true, errorMessage: 'Please Enter your Mobile NO' },
                                      tel: {
                                        pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/
                                      }
                                    }}

                                  />
                                </FormGroup>
                              </Col>
                            </Row>

                            <Row>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">
                                    DOB </Label>
                                  <div class="col-lg-12">
                                    <AvField name="DOB" type="date"
                                      id="dateInput"
                                      value={EditData.DOB}
                                      validate={{
                                        required: { value: true, errorMessage: '*Birth of Date is Required' },
                                      }
                                      }
                                    />
                                  </div>
                                </FormGroup>
                              </Col>

                              <Col md="1">  </Col>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01"> AadharNo </Label>
                                  <AvField name="AadharNo" type="text"
                                    value={EditData.AadharNo}
                                    placeholder="Enter your AadharNo. "
                                    validate={{
                                      required: { value: true, errorMessage: 'Please Enter your AadharNo' },
                                      tel: {
                                        pattern: /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/
                                      }
                                    }
                                    }
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="1">  </Col>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01"> PAN No. </Label>
                                  <AvField name="PAN" type="text"
                                    value={EditData.PAN}
                                    placeholder="Enter your PAN No. "
                                    validate={{
                                      required: { value: true, errorMessage: 'Please Enter your PAN No.' },
                                      tel: {
                                        pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
                                      }
                                    }
                                    }
                                  />
                                </FormGroup>
                              </Col>
                            </Row>


                            <Row>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">Address </Label>
                                  <AvField name="Address" value={EditData.Address} type="text"
                                    placeholder=" Please Enter Address "
                                    validate={{
                                      required: { value: true, errorMessage: 'Please Enter your Address' },
                                    }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="1"></Col>
                              <Col md="3">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="validationCustom01">State </Label>
                                  <Select
                                    value={Stateselect}
                                    options={StateValues}
                                    onChange={(e) => { handllerState(e) }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                         
                        </Card>
                      </Row>

                      <Row>
                        <Card style={{ backgroundColor: "whitesmoke" }}>
                            <Row className="mb-2 mt-2">

                              <Col md="3">
                                <FormGroup className="mb-2">
                                  <Label htmlFor="validationCustom01">Company Name </Label>
                                  <Select
                                    value={Companyselect}
                                    options={CompanyValues}
                                    onChange={(e) => { handllerCompany(e) }}
                                  />
                                </FormGroup>
                              </Col>

                              <Col md="1">  </Col>
                              <Col md="3">
                                <FormGroup className="mb-2">
                                  <Label htmlFor="validationCustom01">Employee Type </Label>
                                  <Select
                                    value={EmployeeTypeselect}
                                    options={EmployeeTypeValues}
                                    onChange={(e) => { handllerEmployeeType(e) }}
                                  />

                                </FormGroup>
                              </Col>
                            </Row>


                            <Row>

                              <Col md="3">
                                <FormGroup className="mb-2">
                                  <Label htmlFor="validationCustom01">DesignationID </Label>
                                  <Select
                                    value={DesignationIDselect}
                                    options={DesignationIDValues}
                                    onChange={(e) => { handllerDesignationID(e) }}
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="1">  </Col>

                              <Col md="3">
                                <FormGroup className="mb-2">
                                  <Label htmlFor="validationCustom01">working_hours </Label>
                                  <AvField name="working_hours" value={EditData.working_hours}
                                    type="number"
                                    placeholder="Please Enter WorkingHours"
                                    autoComplete='off'
                                    validate={{
                                      number: true,
                                      required: { value: true, errorMessage: '*WorkingHours is Required' },

                                    }}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="justify-content-end">
                              <Col sm={10}></Col>
                              <Col sm={2}>
                                <div>
                                  {
                                    IsEdit ? (
                                      <button
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Modules ID"
                                        className="btn btn-success w-md"
                                      >
                                        <i class="fas fa-edit me-2"></i>Update
                                      </button>) : (
                                      <button
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
                                        className="btn btn-success w-md"
                                      > <i className="fas fa-save me-2"></i> Save
                                      </button>
                                    )
                                  }
                                </div>
                              </Col>
                            </Row>
                        </Card>
                      </Row>


                    </AvForm>
                    <div>
                    </div>
                  </CardBody>
                </Card>

              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment >
  );
}
export default AddEmployee
