import React, { useState, useEffect  } from "react";
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
  updateEmployeeIDSuccess,

} from "../../../store/Administrator/M_EmployeeRedux/action";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import { getDistrictOnState, getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import Flatpickr from "react-flatpickr"
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { EMPLOYEE_lIST } from "../../../routes/route_url";
import {
  comAddPageFieldFunc,
  formValid,
  initialFiledFunc,
  onChangeDate,
  onChangeSelect,
  onChangeText,
} from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import SaveButton from "../../../components/Common/ComponentRelatedCommonFile/CommonSaveButton";
import { createdBy, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


const AddEmployee = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [modalCss, setModalCss] = useState(false);
  const [designation_DropdownSelect, setDesignation_DropdownSelect] = useState("");
  const [employeeType_DropdownSelect, setEmployeeType_DropdownSelect] = useState("");
  const [State_DropdownSelect, setState_DropdownSelect] = useState("");
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
  {/** Dyanamic Page access state and OnChange function */ }
  
  const fileds = {
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
    EmployeeParties: []
  }


  const [state, setState] = useState(() => initialFiledFunc(fileds))

  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;

  useEffect(() => {

    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(11))
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
        dispatch(Breadcrumb_inputName(hasEditVal.Name))

      }
      dispatch(editEmployeeSuccess({ Status: false }))
    }
  }, [])


  useEffect(() => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values 
      saveDissable(false);//+++++++++save Button Is enable function
      setDesignation_DropdownSelect('')
      setEmployeeType_DropdownSelect('')
      setState_DropdownSelect('')
      setDOB_Date_Select('')
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
      saveDissable(false);//+++++++++save Button Is enable function
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
      saveDissable(false);//+++++++++Update Button Is enable function
      setState(() => initialFiledFunc(fileds)) //+++++++++ Clear form values
      history.push({
        pathname: EMPLOYEE_lIST,
      })
    } else if (updateMsg.Status === true && !modalCss) {
      saveDissable(false);//+++++++++Update Button Is enable function
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
    label: data.Name,
    IsPartyConnection: data.IsPartyConnection
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

  function EmployeeType_Dropdown_Handler(e) {
    dispatch(Get_CompanyName_By_EmployeeTypeID(e.value))

    const IsPartyConnection = employeeType.find((element) => {
      return element.id === e.value
    });

    if (IsPartyConnection.IsPartyConnection) {
      setPartyDropDownShow_UI(true)
    }
    else {
      setPartyDropDownShow_UI(false)
      setParty_DropdownSelect([{ value: null }])
    }
    setState((i) => {
      debugger
      const a = { ...i }
      a.values.CompanyName = "";
      a.values.EmployeeParties = "";
      a.hasValid.CompanyName.valid = false
      a.hasValid.EmployeeParties.valid = false
      return a
    })
  }

  function State_Dropdown_Handler(e, v) {
    dispatch(getDistrictOnState(e.value))
    setState_DropdownSelect(e)
    setState((i) => {
      const a = { ...i }
      a.values.DistrictName = "";
      a.hasValid.DistrictName.valid = false
      return a
    })
  }

  function Company_Dropdown_Handler(e, v) {
    setCompany_DropdownSelect(e)

  }

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if (formValid(state, setState)) {
      let emplPartie = [{ Party: "" }]
      if (!(values.EmployeeParties.length === 0)) {
        emplPartie = values.EmployeeParties.map((i) => { return ({ Party: i.value }) })
      }
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
        EmployeeParties: emplPartie,
        Company: values.CompanyName.value,
        CreatedBy: createdBy(),
        UpdatedBy: createdBy()
      });

      saveDissable(true);//+++++++++save Button Is dissable function

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
          <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

          <Container fluid>

            <Card className="text-black">
              <CardHeader className="card-header   text-dark c_card_header" >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>

              <CardBody>
                <form onSubmit={formSubmitHandler} noValidate>
                  <Card  >
                    <CardBody className="c_card_body">
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
                            autoFocus={true}
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                              dispatch(Breadcrumb_inputName(event.target.value))
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
                              id="state"
                              value={values.StateName}
                              isSearchable={true}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={State_DropdownOptions}
                              onChange={(hasSelect, evn) => {
                                onChangeSelect({ hasSelect, evn, state, setState, })
                                State_Dropdown_Handler(hasSelect)
                              }}

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
                              onChange={(hasSelect, evn) => {
                                onChangeSelect({ hasSelect, evn, state, setState, })
                              }}

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
                    <CardBody className="c_card_body">
                      <Row >

                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01"> {fieldLabel.EmployeeTypeName} </Label>
                          <Col sm={12}>
                            <Select
                              name="EmployeeTypeName"
                              value={values.EmployeeTypeName}
                              isSearchable={true}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={EmployeeType_DropdownOptions}
                              onChange={(hasSelect, evn) => {
                                onChangeSelect({ hasSelect, evn, state, setState });
                                EmployeeType_Dropdown_Handler(hasSelect)
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
                              isSearchable={true}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={Company_DropdownOptions}
                              onChange={(hasSelect, evn) => {
                                onChangeSelect({ hasSelect, evn, state, setState });
                                Company_Dropdown_Handler(hasSelect)
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
                                isSearchable={true}
                                isMulti={true}
                                className="react-dropdown"
                                options={Party_DropdownOptions}
                                onChange={(hasSelect, evn) => {
                                  onChangeSelect({ hasSelect, evn, state, setState });
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
                              isSearchable={true}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={Designation_DropdownOptions}
                              onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState })}
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
                            <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                              module={"EmployeeMaster"}
                            />
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
