import React, { useState, useEffect } from "react";
import Select from "react-select";

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
  Button,
  Modal
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import {
  getState,
  saveEmployeeAction,
  updateEmployeeAction,
  PostEmployeeSuccess,
  editEmployeeSuccess,
  updateEmployeeIDSuccess
} from "../../../store/Administrator/EmployeeRedux/action";
import { AlertState, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
import {
  getDistrictOnState,
  getDistrictOnStateSuccess,
  getPartyListAPI
} from "../../../store/Administrator/PartyRedux/action";
import Flatpickr from "react-flatpickr"
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
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import EmployeeTypesMaster from "../EmployeeTypes/EmployeeTypesMaster";
import AddMaster from "./Drodown";
import PartyMaster from "../PartyMaster/MasterAdd/PartyIndex";

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
    EmployeeParties: []
  }

  const [state, setState] = useState(() => initialFiledFunc(fileds))

  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState('');
  const [modalCss, setModalCss] = useState(false);
  const [editCreatedBy, seteditCreatedBy] = useState("");
  const [findEmployeeTypeMasterAccess, setFindEmployeeTypeMasterAccess] = useState(false)
  const [findPartyMasterAccess, setPartyMasterAccess] = useState(false)

  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    employeeType,
    State,
    district,
    partyList,
    postMsg,
    userAccess,
    pageField,
    updateMsg } = useSelector((state) => ({
      employeeType: state.EmployeeTypeReducer.EmployeeTypeList,
      State: state.EmployeesReducer.State,
      district: state.PartyMasterReducer.DistrictOnState,
      partyList: state.PartyMasterReducer.partyList,
      postMsg: state.EmployeesReducer.postMessage,
      updateMsg: state.EmployeesReducer.updateMessage,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageField
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
  }, [dispatch]);

  // useEffect(() => {

  //   if ((location.Data)) {
  //     const { id, Name } = location.Data
  //     const values = {
  //       ...state.values.EmployeeTypeName = { value: id, label: Name }
  //     }
  //   }
  // }, [location])

  // userAccess useEffect
  // useEffect(() => {

  //   let userAcc = null;
  //   let locationPath = location.pathname;

  //   if (hasShowModal) {
  //     locationPath = props.masterPath;
  //   };

  //   userAcc = userAccess.find((inx) => {
  //     return (`/${inx.ActualPagePath}` === locationPath)
  //   })

  //   if (userAcc) {
  //     setUserAccState(userAcc)
  //     breadcrumbReturnFunc({ dispatch, userAcc });
  //   };

  //   userAccess.find((index) => {
  //     if (index.id === pageId.EMPLOYEETYPE) {
  //       return setFindEmployeeTypeMasterAccess(true)
  //     }
  //     if (index.id === pageId.PARTY) {
  //       return setPartyMasterAccess(true)
  //     }
  //   });

  // }, [userAccess])

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
        breadcrumbReturnFunc({ dispatch, userAcc });
    };

    userAccess.find((index) => {
      if (index.id === pageId.EMPLOYEETYPE) {
        return setFindEmployeeTypeMasterAccess(true)
      }
      if (index.id === pageId.PARTY) {
        return setPartyMasterAccess(true)
      }
    });
}, [userAccess])

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
          value: data.id,
          label: data.Name
        }))

        // if ((hasEditVal.EmployeeParties).length > 0) { setPartyDropDownShow_UI(true) };

        const { id, Name, Address, Mobile, email, DOB, PAN, AadharNo, CompanyName, EmployeeTypeName, StateName, DistrictName, EmployeeParties,
          State_id, District_id, Company_id, EmployeeType_id, } = hasEditVal

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

        values.id = id
        values.Address = Address;
        values.Mobile = Mobile
        values.email = email;
        values.DOB = DOB
        values.PAN = PAN;
        values.AadharNo = AadharNo
        values.Name = Name;
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

  useEffect(() => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === mode.dropdownAdd)) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      setState(() => resetFunction(fileds, state))// Clear form values  
      dispatch(Breadcrumb_inputName(''))

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
          RedirectPath: url.EMPLOYEE_lIST,
        }))
      }
    }
    else if (postMsg.Status === true) {
      dispatch(PostEmployeeSuccess({ Status: false }))
      CustomAlert({
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
      CustomAlert({
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

  const Party_DropdownOptions = partyList.map((data) => ({
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

  function State_Dropdown_Handler(e) {
    dispatch(getDistrictOnState(e.value))
    setState((i) => {
      const a = { ...i }
      a.values.DistrictName = "";
      a.hasValid.DistrictName.valid = false
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
            AlertState({
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
          EmployeeParties: emplPartie,
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

        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
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
                          <Flatpickr
                            name="DOB"
                            value={values.DOB}
                            className="form-control d-block p-2 bg-white text-dark"
                            placeholder="DD-MM-YYYY"
                            autoComplete="0,''"
                            options={{
                              altFormat: "d-m-Y",
                              dateFormat: "d-m-Y",
                            }}
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
                            <Select
                              name="StateName"
                              id="state"
                              value={values.StateName}
                              isSearchable={true}
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
                        <Col md="3">
                          <FormGroup className="mb-3 ">
                            <Label > {fieldLabel.EmployeeTypeName}</Label>
                            <Select
                              name="EmployeeTypeName"
                              value={values.EmployeeTypeName}
                              isSearchable={true}
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

                        {findEmployeeTypeMasterAccess ? <Col md="1" className=" mt-3">
                          <AddMaster
                            masterModal={EmployeeTypesMaster}
                            masterPath={url.EMPLOYEETYPE}
                          />
                        </Col> : <Col md="1"></Col>
                        }


                        <Col md="3">
                          <FormGroup className="mb-3">
                            <Label>{fieldLabel.EmployeeParties}</Label>
                            <Select
                              name="EmployeeParties"
                              value={values.EmployeeParties}
                              isMulti={true}
                              className="react-dropdown"
                              options={Party_DropdownOptions}
                              onChange={(hasSelect, evn) => {
                                onChangeSelect({ hasSelect, evn, state, setState });
                              }}
                              classNamePrefix="dropdown"
                            />
                          </FormGroup>
                        </Col>

                        {findPartyMasterAccess ? <Col md="1" className=" mt-3">
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
