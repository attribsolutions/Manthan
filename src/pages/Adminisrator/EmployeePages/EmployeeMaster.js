import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, Label, CardHeader, FormGroup } from "reactstrap";
import { AvForm } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  getDesignationID,
  getEmployeeType,
  getState,
  postEmployee,
  updateEmployeeID,
  editEmployeeSuccess,
  PostEmployeeSuccess,
  Get_CompanyName_By_EmployeeTypeID
} from "../../../store/Administrator/M_EmployeeRedux/action";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { fetchCompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { getDistrictOnState, getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import Flatpickr from "react-flatpickr"
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";


const AddEmployee = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  var editDataGatingFromList = props.state;

  const [designation_DropdownSelect, setDesignation_DropdownSelect] = useState("");
  const [employeeType_DropdownSelect, setEmployeeType_DropdownSelect] = useState("");
  const [State_DropdownSelect, setState_DropdownSelect] = useState("");
  const [district_DropdownSelect, setDistrict_DropdownSelect] = useState("");
  const [company_DropdownSelect, setCompany_DropdownSelect] = useState("");
  const [party_DropdownSelect, setParty_DropdownSelect] = useState("");
  const [DOB_Date_Select, setDOB_Date_Select] = useState("");

  const { designation, employeeType, State, district, partyList, company, postMessage } = useSelector((state) => ({
    designation: state.M_EmployeesReducer.designation,
    employeeType: state.M_EmployeesReducer.employeeType,
    State: state.M_EmployeesReducer.State,
    district: state.PartyMasterReducer.DistrictOnState,
    partyList: state.PartyMasterReducer.partyList,
    company: state.M_EmployeesReducer.CompanyNames,
    postMessage: state.M_EmployeesReducer.postMessage,
  }));

  // userAccess useEffect
  useEffect(() => {
    const userAcc = CommonGetRoleAccessFunction(history)
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }
  }, [history])

  useEffect(() => {
    dispatch(getDesignationID());
    dispatch(getEmployeeType());
    dispatch(getState());
    dispatch(getPartyListAPI());
    dispatch(Get_CompanyName_By_EmployeeTypeID());
  }, [dispatch]);


  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    if (!(editDataGatingFromList === undefined)) {
      setPageMode("edit");
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
      setEditData(editDataGatingFromList);
      // setIsEdit(true);
      setDesignation_DropdownSelect({
        value: editDataGatingFromList.Designation_id,
        label: editDataGatingFromList.DesignationName
      })
      setEmployeeType_DropdownSelect({
        value: editDataGatingFromList.EmployeeType_id,
        label: editDataGatingFromList.EmployeeTypeName
      })
      setState_DropdownSelect({
        value: editDataGatingFromList.State_id,
        label: editDataGatingFromList.StateName
      })
      setDOB_Date_Select(editDataGatingFromList.DOB)

      setDistrict_DropdownSelect({
        value: editDataGatingFromList.District_id,
        label: editDataGatingFromList.DistrictName
      })
      setParty_DropdownSelect({
        value: editDataGatingFromList.Party_id,
        label: editDataGatingFromList.PartyName
      })
      setCompany_DropdownSelect({
        value: editDataGatingFromList.Company_id,
        label: editDataGatingFromList.CompanyName
      })
      dispatch(editEmployeeSuccess({ Status: false }))
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
      return
    }
  }, [editDataGatingFromList])

  useEffect(() => {

    if ((postMessage.Status === true) && (postMessage.StatusCode === 200)) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      formRef.current.reset();
      setDesignation_DropdownSelect('')
      setEmployeeType_DropdownSelect('')
      setState_DropdownSelect('')
      setDOB_Date_Select('')
      setDistrict_DropdownSelect('')
      setParty_DropdownSelect('')
      setCompany_DropdownSelect('')

      if (pageMode === "other") {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: postMessage.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: postMessage.Message,
          RedirectPath: '/EmployeeList',
        }))
      }
    }

    else if (postMessage.Status === true) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(postMessage.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [postMessage])





  const Party_DropdownOptions = partyList.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const Company_DropdownOptions = company.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const EmployeeType_DropdownOptions = employeeType.map((data) => ({
    value: data.id,
    label: data.Name
  }));





  const State_DropdownOptions = State.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const District_DropdownOptions = district.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const Designation_DropdownOptions = designation.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  function Designation_Dropdown_Handler(e) {
    setDesignation_DropdownSelect(e)
  }

  // const IsPartyConnection = employeeType.filter((element) => {
  //   return element.IsPartyConnection
  // });
debugger

  function EmployeeType_Dropdown_Handler(e) {
    setEmployeeType_DropdownSelect(e)
    dispatch(Get_CompanyName_By_EmployeeTypeID(e.value))
    const IsPartyConnection = employeeType.filter((element) => {
      return element.IsPartyConnection
    });
    if (IsPartyConnection===true) {
      setParty_DropdownSelect(Party_Dropdown_Handler)
      
    }


  }


  function State_Dropdown_Handler(e) {
    dispatch(getDistrictOnState(e.value))
    setState_DropdownSelect(e)
  }
  function District_Dropdown_Handler(e) {
    setDistrict_DropdownSelect(e)
  }


  function Party_Dropdown_Handler(e) {
    setParty_DropdownSelect(e)
  }


  function Company_Dropdown_Handler(e) {
    setCompany_DropdownSelect(e)
  }

  //'Save' And 'Update' Button Handller
  const handleValidSubmit = (event, values) => {
    debugger
    const jsonBody = JSON.stringify({
      Name: values.Name,
      Address: values.Address,
      Mobile: values.Mobile,
      email: values.email,
      DOB: DOB_Date_Select,
      PAN: values.PAN,
      AadharNo: values.AadharNo,
      working_hours: values.working_hours,
      Designation: designation_DropdownSelect.value,
      EmployeeType: employeeType_DropdownSelect.value,
      State: State_DropdownSelect.value,
      District: district_DropdownSelect.value,
      Party: party_DropdownSelect.map((i) => { return ({ Party: i.value }) }),
      Company: company_DropdownSelect.value,
      CreatedBy: 1,
      UpdatedBy: 1,
    });

    if (pageMode === 'edit') {
      dispatch(updateEmployeeID(jsonBody, EditData.id));
    }
    else {
      dispatch(postEmployee(jsonBody));
    }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  let IsEditMode_Css = ''
  if (pageMode === "edit" || pageMode == "other") { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <MetaTags>
            <title>Employee Master| FoodERP-React FrontEnd</title>
          </MetaTags>
          <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

          <Container fluid>

            <Card className="text-black">
              <CardHeader className="card-header   text-dark" style={{ backgroundColor: "#dddddd" }} >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>

              <CardBody>
                <AvForm
                  onValidSubmit={(e, v) => {
                    handleValidSubmit(e, v);
                  }}
                  ref={formRef}
                >
                  <Card  >
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                      <Row >

                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">Name </Label>
                            <AvField name="Name" id="txtName" value={EditData.Name}
                              type="text"
                              placeholder="Please Enter Name"
                              autoComplete='off'
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter Name' },
                              }}
                              onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="1">  </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">Email</Label>
                            <AvField name="email"
                              id="email"
                              type="email"
                              value={EditData.email}
                              placeholder="Enter your EmailID "
                              autoComplete='off'
                              validate={{
                                required: {
                                  value: true, errorMessage: "Please Enter valid Email Address."
                                },
                                tel: {
                                  pattern: "/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/",
                                  errorMessage: "Please Enter valid Email Address.(Ex:abc@gmail.com)"
                                }
                              }}
                            />

                          </FormGroup>
                        </Col>
                        <Col md="1">  </Col>

                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">Mobile No.</Label>
                            <AvField name="Mobile" type="tel"
                              value={EditData.Mobile}
                              placeholder="+91 "
                              autoComplete='off'
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter your Mobile Number' },
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
                            <Label htmlFor="validationCustom01">Date of Birth</Label>
                            <Flatpickr
                              id="FSSAIExipry"
                              name="FSSAIExipry"
                              value={DOB_Date_Select}
                              className="form-control d-block p-2 bg-white text-dark"
                              placeholder="YYYY-MM-DD"
                              autoComplete='off'
                              options={{
                                altInput: true,
                                altFormat: "F j, Y",
                                dateFormat: "Y-m-d"
                              }}
                              onChange={(selectedDates, dateStr, instance) => {
                                setDOB_Date_Select(dateStr)
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="1">  </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01"> Aadhar No.</Label>
                            <AvField name="AadharNo" type="text"
                              value={EditData.AadharNo}
                              placeholder="Enter your AadharNo. "
                              autoComplete='off'
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter your AadharNo (Ex: 2222 2352 3549)' },
                                tel: {
                                  pattern: /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/,
                                  errorMessage: 'Please Enter your AadharNo (Ex: 2222 2352 3549)'
                                }
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="1">  </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01"> PAN No.</Label>
                            <AvField name="PAN" type="text"
                              value={EditData.PAN}
                              placeholder="Enter your PAN No. "
                              autoComplete='off'
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter your PAN No.(Ex:AAAAA1234A).' },
                                tel: {
                                  pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                                  errorMessage: 'Please Enter valid PAN number.(Ex:AAAAA1234A).'
                                }
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="3">
                          <FormGroup className="">
                            <Label htmlFor="validationCustom01">Address</Label>
                            <AvField name="Address" value={EditData.Address} type="text"
                              placeholder=" Please Enter Address "
                              autoComplete='off'
                              validate={{
                                required: { value: true, errorMessage: 'Please Enter your Address' },
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="1"></Col>
                        <Col md="3">
                          <FormGroup >
                            <Label htmlFor="validationCustom01">State</Label>
                            <Select
                              value={State_DropdownSelect}
                              options={State_DropdownOptions}
                              onChange={(e) => { State_Dropdown_Handler(e) }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="1"></Col>
                        <Col md="3">
                          <FormGroup >
                            <Label htmlFor="validationCustom01">District</Label>
                            <Select
                              value={district_DropdownSelect}
                              options={District_DropdownOptions}
                              onChange={(e) => { District_Dropdown_Handler(e) }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  <Card className="mt-n2">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                      <Row >
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">Employee Type </Label>
                            <Select
                              value={employeeType_DropdownSelect}
                              options={EmployeeType_DropdownOptions}
                              onChange={(e) => { EmployeeType_Dropdown_Handler(e) }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="1">  </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">Company Name </Label>
                            <Select
                              value={company_DropdownSelect}
                              options={Company_DropdownOptions}
                              onChange={(e) => { Company_Dropdown_Handler(e) }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="1">  </Col>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label htmlFor="choices-multiple-remove-button" className="form-label font-size-13 text-muted">Party name</label>
                            <Select
                              defaultValue={[Party_DropdownOptions[1]]}
                              isMulti={true}
                              className="basic-multi-select"
                              options={Party_DropdownOptions}
                              onChange={(e) => { Party_Dropdown_Handler(e) }}
                              classNamePrefix="select2-selection"
                            />
                          </div>
                        </div>

                        {/* 
                        <Col md="1">  </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">Employee Type </Label>
                            <Select
                              value={employeeType_DropdownSelect}
                              options={EmployeeType_DropdownOptions}
                              onChange={(e) => { EmployeeType_Dropdown_Handler(e) }}
                            />

                          </FormGroup>
                        </Col> */}
                      </Row>

                      <Row>

                        <Col md="3">
                          <FormGroup className="mb-4">
                            <Label htmlFor="validationCustom01">Designation</Label>
                            <Select
                              value={designation_DropdownSelect}
                              options={Designation_DropdownOptions}
                              onChange={(e) => { Designation_Dropdown_Handler(e) }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="1">  </Col>
                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom01">Working Hours </Label>
                            <AvField name="working_hours" value={EditData.working_hours}
                              type="text"
                              placeholder="Please Enter Working Hours"
                              autoComplete='off'
                              validate={{
                                number: true,
                                required: { value: true, errorMessage: 'Working Hours is Required' },
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <FormGroup >
                        <Row >
                          <Col sm={2}>
                            <div>
                              {
                                pageMode === "edit" ?
                                  userPageAccessState.RoleAccess_IsEdit ?
                                    <button
                                      type="submit"
                                      data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Module"
                                      className="btn btn-success w-md"
                                    >
                                      <i class="fas fa-edit me-2"></i>Update
                                    </button>
                                    :
                                    <></>
                                  : (
                                    userPageAccessState.RoleAccess_IsSave ?
                                      <button
                                        type="submit"
                                        data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Module"
                                        className="btn btn-primary w-md"
                                      > <i className="fas fa-save me-2"></i> Save
                                      </button>
                                      :
                                      <></>
                                  )
                              }
                            </div>
                          </Col>
                        </Row>
                      </FormGroup >
                    </CardBody>
                  </Card>

                </AvForm>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment >
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};
export default AddEmployee
