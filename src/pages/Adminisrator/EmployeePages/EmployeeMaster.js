import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, Label, CardHeader, FormGroup, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getDesignationID,
  getEmployeeType,
  getState,
  postEmployee,
  updateEmployeeID,
  PostEmployeeSuccess,
  Get_CompanyName_By_EmployeeTypeID,
  editEmployeeSuccess,
  updateEmployeeIDSuccess
} from "../../../store/Administrator/M_EmployeeRedux/action";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { getDistrictOnState, getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import Flatpickr from "react-flatpickr"
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { SaveButton } from "../../../components/CommonSaveButton";
import { EMPLOYEE_lIST } from "../../../routes/route_url";
import {
  comAddPageFieldFunc,
  formValid,
  onChangeDate,
  onChangeSelect,
  onChangeText,

} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";

const AddEmployee = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  const [modalCss, setModalCss] = useState(false);
  const [designation_DropdownSelect, setDesignation_DropdownSelect] = useState("");
  const [employeeType_DropdownSelect, setEmployeeType_DropdownSelect] = useState("");
  const [State_DropdownSelect, setState_DropdownSelect] = useState("");
  const [district_DropdownSelect, setDistrict_DropdownSelect] = useState("");
  const [company_DropdownSelect, setCompany_DropdownSelect] = useState("");
  const [party_DropdownSelect, setParty_DropdownSelect] = useState('');
  const [DOB_Date_Select, setDOB_Date_Select] = useState("");
  const [partyDropDownShow_UI, setPartyDropDownShow_UI] = useState(false);

  const {
    designation,
    employeeType,
    State,
    district,
    partyList,
    company,
    postMsg,
    userAccess,
    pageField,
    updateMsg } = useSelector((state) => ({
      designation: state.M_EmployeesReducer.designation,
      employeeType: state.M_EmployeesReducer.employeeType,
      State: state.M_EmployeesReducer.State,
      district: state.PartyMasterReducer.DistrictOnState,
      partyList: state.PartyMasterReducer.partyList,
      company: state.M_EmployeesReducer.CompanyNames,
      postMsg: state.M_EmployeesReducer.postMessage,
      updateMsg: state.M_EmployeesReducer.updateMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageField

    }));

  const [state, setState] = useState({
    values: {
      id: "",
      Name: "",
      Address: "",
      Mobile: "",
      email: "",
      DOB: "",
      PAN: "",
      AadharNo: "",
      working_hours: "",
      CompanyName: "",
      DesignationName: "",
      EmployeeTypeName: "",
      StateName: "",
      DistrictName: "",
      EmployeeParties: ""

    },
    fieldLabel: {
      Name: "",
      Address: "",
      Mobile: "",
      email: "",
      DOB: "",
      PAN: "",
      AadharNo: "",
      working_hours: "",
      CompanyName: "",
      DesignationName: "",
      EmployeeTypeName: "",
      StateName: "",
      DistrictName: "",
      EmployeeParties: ""

    },

    isError: {
      Name: "",
      Address: "",
      Mobile: "",
      email: "",
      DOB: "",
      PAN: "",
      AadharNo: "",
      working_hours: "",
      CompanyName: "",
      DesignationName: "",
      EmployeeTypeName: "",
      StateName: "",
      DistrictName: "",
      EmployeeParties: ""

    },

    hasValid: {
      Name: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      Address: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      Mobile: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      email: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      DOB: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      PAN: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      AadharNo: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      working_hours: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      CompanyName: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      DesignationName: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      EmployeeTypeName: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      StateName: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      DistrictName: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      EmployeeParties: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
    },
    required: {

    }
  })
  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;

  useEffect(() => {
    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(8))
    dispatch(getDesignationID());
    dispatch(getEmployeeType());
    dispatch(getState());
    dispatch(getPartyListAPI());
    dispatch(Get_CompanyName_By_EmployeeTypeID());
  }, [dispatch]);

  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty("editValue")
  const hasShowModal = props.hasOwnProperty("editValue")

  // userAccess useEffect
  useEffect(() => {
    let userAcc = null;
    let locationPath = location.pathname;

    if (hasShowModal) {
      locationPath = props.masterPath;
    };

    userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })

    if (userAcc) {
      setUserPageAccessState(userAcc)
    };
  }, [userAccess])


  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    if ((hasShowloction || hasShowModal)) {

      let hasEditVal = null
      if (hasShowloction) {
        setPageMode(location.pageMode)
        hasEditVal = location.editValue
      }
      else if (hasShowModal) {
        hasEditVal = props.editValue
        setPageMode(props.pageMode)
        setModalCss(true)
      }

      if (hasEditVal) {
        debugger
        const listItems = hasEditVal.EmployeeParties.map((data) => ({
          value: data.id,
          label: data.Name
        }))

        setParty_DropdownSelect(listItems)

        if ((hasEditVal.EmployeeParties).length > 0) { setPartyDropDownShow_UI(true) };


        const { id, Name, Address, Mobile, email, DOB, PAN, AadharNo, working_hours,
          CompanyName, DesignationName, EmployeeTypeName, StateName, DistrictName, EmployeeParties,
          State_id, District_id, Company_id, EmployeeType_id, Designation_id } = hasEditVal
        const { values, fieldLabel, hasValid, required, isError } = { ...state }

        hasValid.Name.valid = true;
        hasValid.Address.valid = true;
        hasValid.Mobile.valid = true;
        hasValid.email.valid = true;
        hasValid.DOB.valid = true;
        hasValid.PAN.valid = true;
        hasValid.AadharNo.valid = true;
        hasValid.working_hours.valid = true;
        hasValid.CompanyName.valid = true;
        hasValid.DesignationName.valid = true;
        hasValid.EmployeeTypeName.valid = true;
        hasValid.StateName.valid = true;
        hasValid.DistrictName.valid = true;
        hasValid.EmployeeParties.valid = true;


        values.id = id
        values.Address = Address;
        values.Mobile = Mobile
        values.email = email;
        values.DOB = DOB
        values.PAN = PAN;
        values.AadharNo = AadharNo
        values.working_hours = working_hours;
        values.Name = Name;
        values.DesignationName = { label: DesignationName, value: Designation_id };
        values.CompanyName = { label: CompanyName, value: Company_id };
        values.EmployeeTypeName = { label: EmployeeTypeName, value: EmployeeType_id };
        values.StateName = { label: StateName, value: State_id };
        values.DistrictName = { label: DistrictName, value: District_id };
        values.EmployeeParties = listItems;


        // values.CategoryTypeName = { label: CategoryTypeName, value: CategoryType };

        setState({ values, fieldLabel, hasValid, required, isError })
        dispatch(BreadcrumbShow(hasEditVal.Name))

      }
      dispatch(editEmployeeSuccess({ Status: false }))
    }
  }, [])


  useEffect(() => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
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
          Message: postMsg.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: postMsg.Message,
          RedirectPath: EMPLOYEE_lIST,
        }))
      }
    }

    else if (postMsg.Status === true) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(postMsg.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [postMsg])

  useEffect(() => {
    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
        history.push({
            pathname: EMPLOYEE_lIST,
        })
    } else if (updateMsg.Status === true && !modalCss) {
        dispatch(updateEmployeeIDSuccess({ Status: false }));
        dispatch(
            AlertState({
                Type: 3,
                Status: true,
                Message: JSON.stringify(updateMsg.Message),
            })
        );
    }
}, [updateMsg, modalCss]);

  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])

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
  function EmployeeType_Dropdown_Handler(e) {
    // console.log(" data",JSON.stringify(e))
    setEmployeeType_DropdownSelect(e)
    dispatch(Get_CompanyName_By_EmployeeTypeID(e.value))
    setCompany_DropdownSelect('')
    setParty_DropdownSelect('')

    const IsPartyConnection = employeeType.find((element) => {
      return element.id === e.value
    });

    if (IsPartyConnection.IsPartyConnection) {
      Party_Dropdown_Handler()
      setPartyDropDownShow_UI(true)
    }
    else {
      setPartyDropDownShow_UI(false)
      setParty_DropdownSelect([{ value: null }])
    }
  }

  function State_Dropdown_Handler(e, v) {

    debugger
    dispatch(getDistrictOnState(e.value))
    setState_DropdownSelect(e)

  }

  function District_Dropdown_Handler(e, v) {
    setDistrict_DropdownSelect(e)
  }

  function Party_Dropdown_Handler(e, v) {
    setParty_DropdownSelect(e)
  }

  function Company_Dropdown_Handler(e, v) {
    setCompany_DropdownSelect(e)
  }

  const formSubmitHandler = (event) => {
    debugger
    event.preventDefault();
    if (formValid(state, setState)) {
      const jsonBody = JSON.stringify({
        Name: values.Name,
        Address: values.Address,
        Mobile: values.Mobile,
        email: values.email,
        DOB: values.DOB,
        PAN: values.PAN,
        AadharNo: values.AadharNo,
        working_hours: values.working_hours,
        Designation: values.DesignationName.value,
        EmployeeType: values.EmployeeTypeName.value,
        State: values.StateName.value,
        District: values.DistrictName.value,
        EmployeeParties: values.EmployeeParties.map((i) => { return ({ Party: i.value }) }),
        Company: values.CompanyName.value,
        CreatedBy: 1,
        UpdatedBy: 1,
      });

      if (pageMode === "edit") {
        dispatch(updateEmployeeID(jsonBody, values.id,));
        console.log("update jsonBody", jsonBody)
      }
      else {
        dispatch(postEmployee(jsonBody));
        console.log("post jsonBody", jsonBody)

      }
    }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if ((modalCss) || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <MetaTags>
            <title>{userPageAccessState.PageHeading} | FoodERP-React FrontEnd</title>
          </MetaTags>
          <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

          <Container fluid>

            <Card className="text-black">
              <CardHeader className="card-header   text-dark" style={{ backgroundColor: "#dddddd" }} >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>

              <CardBody>
                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>
                  <Card  >
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                      <Row >

                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.Name} </Label>
                          <Input
                            name="Name"
                            id="txtName"
                            value={values.Name}
                            type="text"
                            className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter Name"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                              dispatch(BreadcrumbShow(event.target.value))
                            }}
                          />
                          {isError.Name.length > 0 && (
                            <span className="invalid-feedback">{isError.Name}</span>
                          )}
                        </FormGroup>

                        <Col md="1">  </Col>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.email} </Label>
                          <Input
                            name="email"
                            value={values.email}
                            type="text"
                            className={isError.email.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter email"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                            }}
                          />
                          {isError.email.length > 0 && (
                            <span className="invalid-feedback">{isError.email}</span>
                          )}
                        </FormGroup>

                        <Col md="1">  </Col>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.Mobile} </Label>
                          <Input
                            name="Mobile"
                            value={values.Mobile}
                            type="text"
                            className={isError.Mobile.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter Mobile"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                            }}
                          />
                          {isError.Mobile.length > 0 && (
                            <span className="invalid-feedback">{isError.Mobile}</span>
                          )}
                        </FormGroup>
                      </Row>

                      <Row>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.DOB} </Label>
                          <Flatpickr
                            name="DOB"
                            value={values.DOB}
                            className="form-control d-block p-2 bg-white text-dark"
                            placeholder="YYYY-MM-DD"
                            autoComplete="0,''"
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                              minDate: new Date().fp_incr("n"),
                              maxDate: new Date().fp_incr(0) // 14 days from now"0,''"
                            }}
                            onChange={(y, v, e) => { onChangeDate({ e, v, state, setState }) }}
                          />
                          {isError.DOB.length > 0 && (
                            <span className="invalid-feedback">{isError.DOB}</span>
                          )}
                        </FormGroup>

                        <Col md="1">  </Col>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.AadharNo} </Label>
                          <Input
                            name="AadharNo"
                            value={values.AadharNo}
                            type="text"
                            className={isError.AadharNo.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter AadharNo"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                            }}
                          />
                          {isError.AadharNo.length > 0 && (
                            <span className="invalid-feedback">{isError.AadharNo}</span>
                          )}
                        </FormGroup>

                        <Col md="1">  </Col>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.PAN} </Label>
                          <Input
                            name="PAN"
                            value={values.PAN}
                            type="text"
                            className={isError.PAN.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter PAN"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                            }}
                          />
                          {isError.PAN.length > 0 && (
                            <span className="invalid-feedback">{isError.PAN}</span>
                          )}
                        </FormGroup>
                      </Row>

                      <Row>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.Address} </Label>
                          <Input
                            name="Address"
                            value={values.Address}
                            type="text"
                            className={isError.Address.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter Address"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                            }}
                          />
                          {isError.Address.length > 0 && (
                            <span className="invalid-feedback">{isError.Address}</span>
                          )}
                        </FormGroup>

                        <Col md="1"></Col>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01"> {fieldLabel.StateName} </Label>
                          <Col sm={12}>
                            <Select
                              name="StateName"
                              value={values.StateName}
                              isSearchable={true}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={State_DropdownOptions}
                              onChange={(e,v) => {
                                onChangeSelect({ e, v, state, setState });
                                State_Dropdown_Handler(v)
                              }
                              }
                            />
                            {isError.StateName.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.StateName}</small></span>
                            )}
                          </Col>
                        </FormGroup>

                        <Col md="1"></Col>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01"> {fieldLabel.DistrictName} </Label>
                          <Col sm={12}>
                            <Select
                              name="DistrictName"
                              value={values.DistrictName}
                              isSearchable={true}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={District_DropdownOptions}
                              onChange={(e,v) => {
                                onChangeSelect({ e, v, state, setState });
                                District_Dropdown_Handler(v)
                              }
                              }
                            />
                            {isError.DistrictName.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.DistrictName}</small></span>
                            )}
                          </Col>
                        </FormGroup>
                      </Row>
                    </CardBody>
                  </Card>

                  <Card className="mt-n2">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                      <Row >

                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01"> {fieldLabel.EmployeeTypeName} </Label>
                          <Col sm={12}>
                            <Select
                              name="EmployeeTypeName"
                              value={values.EmployeeTypeName}
                              isSearchable={false}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={EmployeeType_DropdownOptions}
                              onChange={(e,v) => {
                                onChangeSelect({ e, v, state, setState });
                                EmployeeType_Dropdown_Handler(v)
                              }
                              }
                            />
                            {isError.EmployeeTypeName.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.EmployeeTypeName}</small></span>
                            )}
                          </Col>
                        </FormGroup>

                        <Col md="1">  </Col>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01"> {fieldLabel.CompanyName} </Label>
                          <Col sm={12}>
                            <Select
                              name="CompanyName"
                              value={values.CompanyName}
                              isSearchable={false}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={Company_DropdownOptions}
                              onChange={(e,v) => {
                                onChangeSelect({ e, v, state, setState });
                                Company_Dropdown_Handler(v)
                              }
                              }
                            />
                            {isError.CompanyName.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.CompanyName}</small></span>
                            )}
                          </Col>
                        </FormGroup>


                        <Col md="1">  </Col>
                        {partyDropDownShow_UI ?
                          <div className="col-lg-3 col-md-4">
                            <div className="mb-3">
                              <Label htmlFor="validationCustom01">{fieldLabel.EmployeeParties} </Label>
                              <Select
                                name="EmployeeParties"
                                // defaultValue={EmployeeType_DropdownOptions[0]}
                                value={values.EmployeeParties}
                                isSearchable={false}
                                isMulti={true}
                                className="react-dropdown"
                                options={Party_DropdownOptions}
                                onChange={(e,v) => {
                                  onChangeSelect({ e, v, state, setState });
                                  Party_Dropdown_Handler(v)
                                }
                                }
                                classNamePrefix="dropdown"
                              />
                              {isError.EmployeeParties.length > 0 && (
                                <span className="text-danger f-8"><small>{isError.EmployeeParties}</small></span>
                              )}
                            </div>
                          </div>
                          : <></>}
                      </Row>

                      <Row>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01"> {fieldLabel.DesignationName} </Label>
                          <Col sm={12}>
                            <Select
                              name="DesignationName"
                              value={values.DesignationName}
                              isSearchable={false}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={Designation_DropdownOptions}
                              onChange={(e,v) => onChangeSelect({ e, v, state, setState })}
                            />
                            {isError.DesignationName.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.DesignationName}</small></span>
                            )}
                          </Col>
                        </FormGroup>


                        <Col md="1">  </Col>

                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.working_hours} </Label>
                          <Input
                            name="working_hours"
                            value={values.working_hours}
                            type="text"
                            className={isError.working_hours.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter working hours"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                            }}
                          />
                          {isError.working_hours.length > 0 && (
                            <span className="invalid-feedback">{isError.working_hours}</span>
                          )}
                        </FormGroup>

                      </Row>

                      <FormGroup className="mt-3">
                        <Row>
                          <Col sm={2}>
                            {SaveButton({ pageMode, userPageAccessState, module: "EmployeeMaster" })}
                          </Col>
                        </Row>
                      </FormGroup >
                    </CardBody>
                  </Card>

                </form>
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
