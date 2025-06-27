import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  CardHeader,
  FormGroup,
  Input,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getState,
  saveEmployeeAction,
  updateEmployeeAction,
  PostEmployeeSuccess,
  editEmployeeSuccess,
  updateEmployeeIDSuccess,
  getCityOnDistrict,
  getCityOnDistrictSuccess
} from "../../../store/Administrator/EmployeeRedux/action";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import {
  getDistrictOnState,
  getDistrictOnStateSuccess,
  getPartyListAPI,
  getPartyListAPISuccess
} from "../../../store/Administrator/PartyRedux/action";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import {
  comAddPageFieldFunc,
  formValid,
  initialFiledFunc,
  onChangeDate,
  onChangeSelect,
  onChangeText,
  resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
  breadcrumbReturnFunc,
  btnIsDissablefunc,
  loginCompanyID,
  loginUserID,
  metaTagLabel,
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { getEmployeeTypelist } from "../../../store/Administrator/EmployeeTypeRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import EmployeeTypesMaster from "../EmployeeTypes/EmployeeTypesMaster";
import AddMaster from "./Drodown";
import PartyMaster from "../PartyMaster/MasterAdd/PartyIndex";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import CityMaster from "../CityPages/CityMaster";
import { getStateESuccess } from "../../../store/Administrator/EmployeeRedux/action";
import { getEmployeeTypelistSuccess } from "../../../store/Administrator/EmployeeTypeRedux/action";
import { GenralMasterSubType } from "../../../helpers/backend_helper";

const AddEmployee = (props) => {

  const dispatch = useDispatch();
  const history = useHistory()

  const fileds = {
    id: "",
    Name: "",
    Address: "",
    Mobile: "",
    email: "",
    DOB: "",
    PAN: "",
    AadharNo: "",
    EmployeeTypeName: "",
    StateName: "",
    DistrictName: "",
    PIN: "",
    CityName: "",
    EmployeeParties: [],
    Designation: ""
  }

  const [state, setState] = useState(() => initialFiledFunc(fileds))

  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState('');
  const [modalCss, setModalCss] = useState(false);
  const [editCreatedBy, seteditCreatedBy] = useState("");
  const [employeeType_AddAccess, setEmployeeType_AddAccess] = useState(false)
  const [partyMaster_AddAccess, setPartyMaster_AddAccess] = useState(false)
  const [cityMaster_AddAccess, setCityMaster_AddAccess] = useState(false)

  const [Designation, setDesignation] = useState([])



  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    employeeType,
    State,
    City,
    district,
    partyList,
    postMsg,
    userAccess,
    pageField,
    saveBtnloading,
    stateDropDownLoading,
    employeeTypeLoading,
    partyDropdownLoading,
    districtDropDownLoading,
    cityDropDownLoading,
    updateMsg } = useSelector((state) => ({
      saveBtnloading: state.EmployeesReducer.saveBtnloading,
      employeeType: state.EmployeeTypeReducer.EmployeeTypeList,
      State: state.EmployeesReducer.State,
      City: state.EmployeesReducer.City,
      district: state.PartyMasterReducer.DistrictOnState,
      partyList: state.PartyMasterReducer.partyList,
      postMsg: state.EmployeesReducer.postMessage,
      updateMsg: state.EmployeesReducer.updateMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageField,
      employeeTypeLoading: state.EmployeeTypeReducer.goBtnLoading,
      partyDropdownLoading: state.PartyMasterReducer.goBtnLoading,
      stateDropDownLoading: state.EmployeesReducer.stateDropDownLoading,
      districtDropDownLoading: state.PartyMasterReducer.districtDropDownLoading,
      cityDropDownLoading: state.EmployeesReducer.cityDropDownLoading,
    }));

  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;

  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty(mode.editValue)
  const hasShowModal = props.hasOwnProperty(mode.editValue)

  useEffect(() => {
    dispatch(getDistrictOnStateSuccess([]))
    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(pageId.EMPLOYEE))
    dispatch(getEmployeeTypelist());
    dispatch(getPartyListAPI())
    dispatch(getState());
    return () => {
      dispatch(getPartyListAPISuccess([]));
      dispatch(getStateESuccess([]));
      dispatch(getEmployeeTypelistSuccess([]));
    }
  }, [dispatch]);


  useEffect(() => {

    let userAcc = null;
    let locationPath;

    if (props.pageMode === mode.dropdownAdd) {
      locationPath = props.masterPath;
    } else {
      locationPath = location.pathname;
    }

    if (hasShowModal) {
      locationPath = props.masterPath;
    };

    userAcc = userAccess.find((inx) => {
      return (`/${inx.ActualPagePath}` === locationPath)
    })

    if (userAcc) {
      setUserAccState(userAcc);
      if (!props.isdropdown) {
        breadcrumbReturnFunc({ dispatch, userAcc });
      }
    };
    userAccess.find((index) => {
      if (index.id === pageId.EMPLOYEETYPE) {
        return setEmployeeType_AddAccess(true)
      }
      if (index.id === pageId.PARTY) {
        return setPartyMaster_AddAccess(true)
      }
      if (index.id === pageId.CITY) {
        return setCityMaster_AddAccess(true)
      }
    });
  }, [userAccess])

  // useEffect(() => {
  //   if ((values.EmployeeTypeName.IsSalesTeamMember === true && partyList.length > 0) && pageMode === mode.defaultsave) {

  //     const Party_DropdownOptions = partyList
  //       .filter(index => index.PartyType === "Company Division")
  //       .map(index => ({ value: index.id, label: index.Name }));

  //     setState((i) => {
  //       const a = { ...i }
  //       a.values.EmployeeParties = Party_DropdownOptions
  //       a.hasValid.EmployeeParties.valid = false

  //       return a
  //     })
  //   }
  //   else {
  //     setState((i) => {
  //       const a = { ...i }
  //       a.values.EmployeeParties = []
  //       a.hasValid.EmployeeParties.valid = false

  //       return a
  //     })
  //   }

  // }, [partyList, employeeType, values.EmployeeTypeName]);

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.

  useEffect(() => {

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
          ...data,
          value: data.id,
          label: data.Name
        }))

        // if ((hasEditVal.EmployeeParties).length > 0) { setPartyDropDownShow_UI(true) };

        const { id, Name, Address, Mobile, email, DOB, PAN, AadharNo, CompanyName, EmployeeTypeName, StateName, DistrictName, EmployeeParties, PIN, City, CityName, Designation, DesignationID,
          State_id, District_id, Company_id, City_id, EmployeeType_id, } = hasEditVal
        const { values, fieldLabel, hasValid, required, isError } = { ...state }
        hasValid.id.valid = id
        hasValid.Name.valid = true;
        hasValid.Address.valid = true;
        hasValid.Mobile.valid = true;
        hasValid.email.valid = true;
        hasValid.DOB.valid = true;
        hasValid.PAN.valid = true;
        hasValid.AadharNo.valid = true;
        hasValid.EmployeeTypeName.valid = true;
        hasValid.StateName.valid = true;
        hasValid.DistrictName.valid = true;
        hasValid.EmployeeParties.valid = true;
        hasValid.PIN.valid = true;
        hasValid.CityName.valid = true;


        values.id = id
        values.Address = Address;
        values.Mobile = Mobile
        values.email = email;
        values.DOB = DOB
        values.PAN = PAN;
        values.AadharNo = AadharNo
        values.Name = Name;
        values.PIN = PIN;
        values.Designation = { label: Designation, value: DesignationID };
        values.CityName = { label: CityName, value: City_id };
        values.EmployeeTypeName = { label: EmployeeTypeName, value: EmployeeType_id };
        values.StateName = { label: StateName, value: State_id };
        values.DistrictName = { label: DistrictName, value: District_id };
        values.EmployeeParties = listItems;
        dispatch(getDistrictOnState(State_id))
        setState({ values, fieldLabel, hasValid, required, isError })
        dispatch(Breadcrumb_inputName(hasEditVal.Name))
        seteditCreatedBy(hasEditVal.CreatedBy)
      }
      dispatch(editEmployeeSuccess({ Status: false }))
    }
  }, [])

  useEffect(async () => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      setState(() => resetFunction(fileds, state))// Clear form values  
      dispatch(Breadcrumb_inputName(''))

      if (props.pageMode === mode.dropdownAdd) {
        customAlert({
          Type: 1,
          Message: postMsg.Message,
        })
      }
      else {
        let isPermission = await customAlert({
          Type: 1,
          Status: true,
          Message: postMsg.Message,
        })
        if (isPermission) {
          history.push({ pathname: url.EMPLOYEE_lIST })
        }
      }
    }
    else if (postMsg.Status === true) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      customAlert({
        Type: 4,
        Message: JSON.stringify(postMsg.Message),
      })
    }
  }, [postMsg])

  useEffect(() => {
    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
      setState(() => resetFunction(fileds, state))// Clear form values 
      history.push({
        pathname: url.EMPLOYEE_lIST,
      })
    } else if (updateMsg.Status === true && !modalCss) {
      dispatch(updateEmployeeIDSuccess({ Status: false }));
      customAlert({
        Type: 3,
        Message: JSON.stringify(updateMsg.Message),
      })
    }
  }, [updateMsg, modalCss]);

  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])

  useEffect(async () => {
    const jsonBody = {
      Company: loginCompanyID(),
      TypeID: 161
    };
    const resp3 = await GenralMasterSubType(jsonBody)
    setDesignation(resp3.Data)

  }, [])


  const Party_DropdownOptions = partyList.map((data) => ({
    value: data.id,
    label: data.Name
  }));


  const EmployeeDesignation = Designation.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const EmployeeType_DropdownOptions = employeeType.map((data) => ({
    value: data.id,
    label: data.Name,
    IsPartyConnection: data.IsPartyConnection,
    IsSalesTeamMember: data.IsSalesTeamMember
  }));

  const State_DropdownOptions = State.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const District_DropdownOptions = district.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  const City_DropdownOptions = City.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  function State_Dropdown_Handler(e) {
    dispatch(getDistrictOnState(e.value))
    dispatch(getCityOnDistrictSuccess([]))
    setState((i) => {
      const a = { ...i }
      a.values.DistrictName = "";
      a.hasValid.DistrictName.valid = false

      a.values.CityName = "";
      a.hasValid.CityName.valid = false
      return a
    })
  }

  function District_Dropdown_Handler(e) {
    dispatch(getCityOnDistrict(e.value))
    setState((i) => {
      const a = { ...i }
      a.values.CityName = "";
      a.hasValid.CityName.valid = false
      return a
    })
  }

  const SaveHandler = (event) => {

    event.preventDefault();
    const btnId = event.target.id;
    try {
      if (formValid(state, setState)) {
        btnIsDissablefunc({ btnId, state: true })
        if ((values.EmployeeTypeName.IsPartyConnection === true) && (values.EmployeeParties.length === 0)) {
          dispatch(
            customAlert({
              Type: 4,
              Status: true,
              Message: "Party is Required",
            })
          );
          return btnIsDissablefunc({ btnId, state: false })
        }

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
          EmployeeType: values.EmployeeTypeName.value,
          State: values.StateName.value,
          District: values.DistrictName.value,
          City: values.CityName.value,
          EmployeeParties: emplPartie,
          Designation: values.Designation.value,
          PIN: values.PIN,
          Company: loginCompanyID(),
          CreatedBy: loginUserID(),
          UpdatedBy: loginUserID()
        });

        if (pageMode === mode.edit) {
          dispatch(updateEmployeeAction({ jsonBody, updateId: values.id, btnId }));
        }
        else {

          dispatch(saveEmployeeAction({ jsonBody, btnId }));
        }
      }
    } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

        <div className="page-content" >
          <Container fluid>

            <Card className="text-black">
              <CardHeader className="card-header   text-dark c_card_header" >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>

              <CardBody>
                <form noValidate>
                  <Card  >
                    <CardBody className="c_card_body">
                      <Row>
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
                          <C_DatePicker
                            name="DOB"
                            value={values.DOB}
                            placeholder={"DD/MM/YYYY"}
                            onChange={(y, v, e) => {
                              onChangeDate({ e, v, state, setState })
                            }}
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
                            <C_Select
                              name="StateName"
                              id="state"
                              value={values.StateName}
                              isSearchable={true}
                              isLoading={stateDropDownLoading}
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
                            <C_Select
                              name="DistrictName"
                              value={values.DistrictName}
                              isSearchable={true}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              isLoading={districtDropDownLoading}
                              options={District_DropdownOptions}
                              onChange={(hasSelect, evn) => {
                                onChangeSelect({ hasSelect, evn, state, setState, })
                                District_Dropdown_Handler(hasSelect)
                              }}
                            />
                            {isError.DistrictName.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.DistrictName}</small></span>
                            )}
                          </Col>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.CityName} </Label>
                          <C_Select
                            name="CityName"
                            id="CityName"
                            value={values.CityName}
                            isSearchable={true}
                            classNamePrefix="dropdown"
                            isLoading={cityDropDownLoading}
                            options={City_DropdownOptions}
                            onChange={(hasSelect, evn) => {
                              onChangeSelect({ hasSelect, evn, state, setState, })
                            }}
                          />
                          {isError.CityName.length > 0 && (
                            <span className="text-danger f-8"><small>{isError.CityName}</small></span>
                          )}
                        </FormGroup>

                        {cityMaster_AddAccess ? <Col md="1" className=" mt-3">
                          <AddMaster
                            masterModal={CityMaster}
                            masterPath={url.CITY}
                          />
                        </Col> : <Col md="1"></Col>
                        }
                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01">{fieldLabel.PIN} </Label>
                          <Input
                            name="PIN"
                            value={values.PIN}
                            type="text"
                            className={isError.PIN.length > 0 ? "is-invalid form-control" : "form-control"}
                            placeholder="Please Enter PIN"
                            autoComplete='off'
                            onChange={(event) => {
                              onChangeText({ event, state, setState })
                            }}
                          />
                          {isError.PIN.length > 0 && (
                            <span className="invalid-feedback">{isError.PIN}</span>
                          )}
                        </FormGroup>

                        <Col md="1"></Col>

                        <FormGroup className="mb-2 col col-sm-3 ">
                          <Label htmlFor="validationCustom01"> {fieldLabel.Designation} </Label>
                          <Col sm={12}>
                            <C_Select
                              name="Designation"
                              value={values.Designation}
                              isSearchable={true}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={EmployeeDesignation}
                              onChange={(hasSelect, evn) => {
                                onChangeSelect({ hasSelect, evn, state, setState })
                              }}
                            />
                            {isError.Designation.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.Designation}</small></span>
                            )}
                          </Col>
                        </FormGroup>











                      </Row>
                    </CardBody>
                  </Card>

                  <Card className="mt-n2">
                    <CardBody className="c_card_body">

                      <Row >
                        <Col md="3">
                          <FormGroup className="mb-3 ">
                            <Label > {fieldLabel.EmployeeTypeName}</Label>
                            <C_Select
                              name="EmployeeTypeName"
                              value={values.EmployeeTypeName}
                              isSearchable={true}
                              isLoading={employeeTypeLoading}
                              className="react-dropdown"
                              classNamePrefix="dropdown"
                              options={EmployeeType_DropdownOptions}
                              onChange={(hasSelect, evn) => {
                                onChangeSelect({ hasSelect, evn, state, setState });
                              }}
                            />
                            {isError.EmployeeTypeName.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.EmployeeTypeName}</small></span>
                            )}
                          </FormGroup>
                        </Col>

                        {employeeType_AddAccess ? <Col md="1" className=" mt-3">
                          <AddMaster
                            masterModal={EmployeeTypesMaster}
                            masterPath={url.EMPLOYEETYPE}
                          />
                        </Col> : <Col md="1"></Col>
                        }

                        <Col md="7">
                          <FormGroup className="mb-3">
                            <Label>{fieldLabel.EmployeeParties}</Label>
                            <C_Select
                              name="EmployeeParties"
                              value={values.EmployeeParties}
                              isMulti={true}
                              isLoading={partyDropdownLoading}
                              // isDisabled={(values.EmployeeTypeName.IsSalesTeamMember)}
                              className="react-dropdown"
                              options={Party_DropdownOptions}
                              onChange={(hasSelect, evn) => {
                                if (evn?.removedValue?.RoleName !== null && evn?.removedValue) {
                                  customAlert({
                                    Type: 3,
                                    Message: "Role use in UserMaster",
                                  })
                                  return
                                } else {
                                  onChangeSelect({ hasSelect, evn, state, setState });
                                }
                              }}
                              classNamePrefix="dropdown"
                            />
                            {isError.EmployeeParties.length > 0 && (
                              <span className="text-danger f-8"><small>{isError.EmployeeParties}</small></span>
                            )}
                          </FormGroup>
                        </Col>

                        {partyMaster_AddAccess ? <Col md="1" className=" mt-3">
                          <AddMaster
                            masterModal={PartyMaster}
                            masterPath={url.PARTY}
                          />
                        </Col> : <Col md="1"></Col>
                        }
                      </Row>

                      <FormGroup className="mt-3">
                        <Row>
                          <Col sm={2}>
                            <SaveButton
                              loading={saveBtnloading}
                              pageMode={pageMode}
                              onClick={SaveHandler}
                              userAcc={userPageAccessState}
                              editCreatedBy={editCreatedBy}
                              module={"EmployeeMaster"}
                            />
                          </Col>
                        </Row>
                      </FormGroup>

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
