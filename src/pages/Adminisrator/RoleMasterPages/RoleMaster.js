import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, CardHeader, FormGroup, Input, } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  editSuccess,
  postRole, updateID, PostSuccess
} from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState, commonPageField, commonPageFieldSuccess, updateSuccess } from "../../../store/actions";
import Select from "react-select";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { getEmployeeTypelist } from "../../../store/Administrator/EmployeeTypeRedux/action";
import {
  comAddPageFieldFunc,
  formValid,
  initialFiledFunc,
  onChangeSelect,
  onChangeText,
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { ROLE_lIST } from "../../../routes/route_url";
import SaveButton from "../../../components/Common/CmponentRelatedCommonFile/SearchBox/CommonSaveButton";

const RoleMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  const [pageMode, setPageMode] = useState("save");
  const [modalCss, setModalCss] = useState(false);

  const [userPageAccessState, setUserPageAccessState] = useState('');
  const initialFiled = {
    id: "",
    Name: "",
    Description: "",
    Dashboard: "",
    RoleEmployeeTypes: "",
    isActive: "",
    isSCMRole: '',
    IsPartyConnection: ""
  }

  const [state, setState] = useState(initialFiledFunc(initialFiled))

  //Access redux store Data /  'save_ModuleSuccess' action data
  const {
    postMsg,
    updateMsg,
    pageField,
    userAccess,
    EmployeeType } = useSelector((state) => ({
      postMsg: state.RoleMaster_Reducer.postMsg,
      updateMsg: state.RoleMaster_Reducer.updateMsg,
      EmployeeType: state.EmployeeTypeReducer.EmployeeTypeList,
      userAccess: state.Login.RoleAccessUpdateData,
      pageField: state.CommonPageFieldReducer.pageField

    }));

  const location = { ...history.location }
  const hasShowloction = location.hasOwnProperty("editValue")
  const hasShowModal = props.hasOwnProperty("editValue")


  useEffect(() => {
    dispatch(commonPageFieldSuccess());
    dispatch(commonPageField(12))
    dispatch(getEmployeeTypelist());
  }, []);

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

  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })// new change
    }
  }, [pageField])

  useEffect(() => {
    debugger
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
        const listItems = hasEditVal.RoleEmployeeTypes.map((data) => ({
          value: data.EmployeeType,
          label: data.EmployeeTypeName
        }))

        const { id, Name, Description, Dashboard, isActive, isSCMRole, IsPartyConnection, RoleEmployeeTypes } = hasEditVal
        const { values, fieldLabel, hasValid, required, isError } = { ...state }

        hasValid.Name.valid = true;
        hasValid.Description.valid = true;
        hasValid.Dashboard.valid = true;
        hasValid.isActive.valid = true;
        hasValid.isSCMRole.valid = true;
        hasValid.IsPartyConnection.valid = true;
        hasValid.RoleEmployeeTypes.valid = true;

        values.id = id
        values.Name = Name
        values.Description = Description
        values.Dashboard = Dashboard
        values.isActive = isActive
        values.isSCMRole = isSCMRole
        values.IsPartyConnection = IsPartyConnection
        values.RoleEmployeeTypes = listItems;

        setState({ values, fieldLabel, hasValid, required, isError })
        dispatch(BreadcrumbShow(hasEditVal.RoleMaster))

      }
      dispatch(editSuccess({ Status: false }))

    }

  }, [])

  useEffect(() => {
    if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
      dispatch(PostSuccess({ Status: false }))
      formRef.current.reset();
      if (pageMode === "dropdownAdd") {
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
          RedirectPath: ROLE_lIST,

        }))
      }
    }
    else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
      dispatch(PostSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(postMsg.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [postMsg.Status])

  useEffect(() => {
    if (updateMsg.Status === true && updateMsg.StatusCode === 200 && !modalCss) {
      history.push({
        pathname: ROLE_lIST,
      })
    } else if (updateMsg.Status === true && !modalCss) {
      dispatch(updateSuccess({ Status: false }));
      dispatch(
        AlertState({
          Type: 3,
          Status: true,
          Message: JSON.stringify(updateMsg.Message),
        })
      );
    }
  }, [updateMsg, modalCss]);

  const EmployeeType_DropdownOptions = EmployeeType.map((data) => ({
    value: data.id,
    label: data.Name
  }));


  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;

  const formSubmitHandler = (event) => {
    debugger
    event.preventDefault();
    if (formValid(state, setState)) {

      const jsonBody = JSON.stringify({
        Name: values.Name,
        Description: values.Description,
        Dashboard: values.Dashboard,
        isActive: values.isActive,
        isSCMRole: values.isSCMRole,
        IsPartyConnection: values.IsPartyConnection,
        RoleEmployeeTypes: values.RoleEmployeeTypes.map((i) => { return ({ EmployeeType: i.value }) }),
        // RoleEmployeeTypes: [
        //   {
        //     EmployeeType: 1
        //   }
        // ],
        CreatedBy: 1,
        CreatedOn: "2022-05-20T11:22:55.711483Z",
        UpdatedBy: 1,
        UpdatedOn: "2022-05-20T11:22:55.711483Z"
      });

      if (pageMode === 'edit') {
        dispatch(updateID(jsonBody, values.id));
        console.log("update jsonBody", jsonBody)
      }

      else {
        dispatch(postRole(jsonBody));
        console.log("jsonBody", jsonBody)
      }
    }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (modalCss || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <Container fluid>
            <MetaTags>
              <title>{userPageAccessState.PageHeading}| FoodERP-React FrontEnd</title>
            </MetaTags>
            <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

            <Card className="text-black">
              <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>

              <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >

                <form onSubmit={formSubmitHandler} ref={formRef} noValidate>

                  <Row className="">
                    <Col md={12}>
                      <Card>
                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                          <Row>

                            <FormGroup className="mb-2 col col-sm-4 " >
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


                            <Col md="1"> </Col>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <Label htmlFor="validationCustom01">{fieldLabel.RoleEmployeeTypes} </Label>
                                <Select
                                  name="RoleEmployeeTypes"
                                  // defaultValue={EmployeeType_DropdownOptions[0]}
                                  value={values.RoleEmployeeTypes}
                                  isSearchable={false}
                                  isMulti={true}
                                  className="react-dropdown"
                                  options={EmployeeType_DropdownOptions}
                                  onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                  classNamePrefix="dropdown"

                                />
                                {isError.RoleEmployeeTypes.length > 0 && (
                                  <span className="text-danger f-8"><small>{isError.RoleEmployeeTypes}</small></span>
                                )}
                              </div>
                            </div>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.Description} </Label>
                                <Input
                                  type="text"
                                  defaultValue={values.Description}
                                  className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                  name="Description"
                                  placeholder="Please Enter description"
                                  onChange={(event) => onChangeText({ event, state, setState })}
                                />
                                {isError.Description.length > 0 && (
                                  <span className="invalid-feedback">{isError.Description}</span>
                                )}
                              </FormGroup>

                              <Col md="1">  </Col>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.Dashboard} </Label>
                                <Input
                                  type="text"
                                  value={values.Dashboard}
                                  className={isError.Dashboard.length > 0 ? "is-invalid form-control" : "form-control"}
                                  name="Dashboard"
                                  placeholder="Please Enter dashboard"
                                  onChange={(event) => onChangeText({ event, state, setState })}
                                />
                                {isError.Dashboard.length > 0 && (
                                  <span className="invalid-feedback">{isError.Dashboard}</span>
                                )}
                              </FormGroup>
                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-4 col-form-label" >{fieldLabel.isSCMRole}</Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" >
                                      <Input type="checkbox" className="form-check-input"
                                        value={values.isSCMRole}
                                        name="isSCMRole"
                                        onChange={(event) => onChangeText({ event, state, setState })}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-3 col-form-label" >{fieldLabel.isActive}</Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                      <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        checked={values.isActive}
                                        defaultChecked={true}
                                        name="isActive"
                                        onChange={(event) => onChangeText({ event, state, setState })}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-4 col-form-label" >{fieldLabel.IsPartyConnection}</Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                      <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        defaultChecked={values.IsPartyConnection}
                                        name="IsPartyConnection"
                                        onChange={(event) => onChangeText({ event, state, setState })}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>

                            <FormGroup >
                              <Row >
                                <Col sm={2}>
                                  <SaveButton pageMode={pageMode} userAcc={userPageAccessState}
                                    module={"RoleMaster"}
                                  />
                                </Col>
                              </Row>
                            </FormGroup >
                          </Row>

                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                </form>
              </CardBody>
            </Card>

          </Container>
        </div>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};
export default RoleMaster
