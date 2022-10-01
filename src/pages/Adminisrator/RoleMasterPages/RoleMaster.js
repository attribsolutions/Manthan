import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, CardHeader, FormGroup, Input, } from "reactstrap";
import { AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  editSuccess,
  postRole, updateID, PostSuccess
} from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState } from "../../../store/actions";
import Select from "react-select";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { getEmployeeTypelist } from "../../../store/Administrator/EmployeeTypeRedux/action";
import {
  comAddPageFieldFunc,
  formValChange,
  formValid,
} from "../../../components/Common/CmponentRelatedCommonFile/validationFunction";
import { fieldData } from './FieldData'
const RoleMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;
  let propsPageMode = props.pageMode;
  let pageModeProps = props.pageMode;
console.log("editDataGatingFromList",editDataGatingFromList)
  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [employeeType_DropdownSelect, setEmployeeType_DropdownSelect] = useState('');

  // ////////////////////////////////////
  const [state, setState] = useState({
    values: {
      name: "",
      description: "",
      dashboard: "",
      employeeType: ""

    },
    fieldLabel: {
      name: "",
      description: "",
      dashboard: "",
      employeeType: ""
    },

    isError: {
      name: "",
      description: "",
      dashboard: "",
      employeeType: ""
    },

    hasValid: {
      name: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      description: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },

      dashboard: {
        regExp: '',
        inValidMsg: "",
        valid: false
      },
      employeeType: {
        regExp: '',
        inValidMsg: "",
        valid: false
      }
    },
    required: {

    }
  }
  )
  //////////////////////////

  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostAPIResponse, RoleAccessModifiedinSingleArray, EmployeeType } = useSelector((state) => ({
    PostAPIResponse: state.RoleMaster_Reducer.AddUserMessage,
    EmployeeType: state.EmployeeTypeReducer.EmployeeTypeList,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
  }));

  useEffect(() => {
    dispatch(getEmployeeTypelist());
  }, []);

  //userAccess useEffect
  useEffect(() => {
    let userAcc = undefined
    if ((editDataGatingFromList === undefined)) {

      let locationPath = history.location.pathname
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === locationPath)
      })
    }
    else if (!(editDataGatingFromList === undefined)) {
      let relatatedPage = props.relatatedPage
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === relatatedPage)
      })

    }
    if (!(userAcc === undefined)) {
      setUserPageAccessState(userAcc)
    }

  }, [RoleAccessModifiedinSingleArray])

  const EmployeeType_DropdownOptions = EmployeeType.map((data) => ({
    value: data.id,
    label: data.Name
  }));

  function EmployeeType_Dropdown_Handler(e) {
    setEmployeeType_DropdownSelect(e)
  }
  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {
    debugger
    // if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setPageMode(pageModeProps);
      dispatch(editSuccess({ Status: false }))
      dispatch(BreadcrumbShow(editDataGatingFromList.Name))
      const listItems = editDataGatingFromList.RoleEmployeeTypes.map((data) => ({
        value: data.EmployeeType,
        label: data.EmployeeTypeName
      }))

     state.values.employeeType=listItems
     state.values.dashboard=editDataGatingFromList.Dashboard
     state.values.description=editDataGatingFromList.Description
     state.values.name=editDataGatingFromList.Name
     state.hasValid.employeeType.valid=true
     state.hasValid.name.valid=true
     state.hasValid.dashboard.valid=true
     state.hasValid.description.valid=true

    }
    else if (!(propsPageMode === undefined)) {
      setPageMode(propsPageMode)
    }

  }, [editDataGatingFromList, propsPageMode])

  useEffect(() => {
    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
      dispatch(PostSuccess({ Status: false }))
      formRef.current.reset();
      if (pageMode === "dropdownAdd") {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: PostAPIResponse.Message,
        }))
      }
      else {
        dispatch(AlertState({
          Type: 1,
          Status: true,
          Message: PostAPIResponse.Message,
          RedirectPath: '/RoleList',

        }))
      }
    }
    else if ((PostAPIResponse.Status === true) && !(pageMode === "dropdownAdd")) {
      dispatch(PostSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(PostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostAPIResponse.Status])

  // // ////////////////////////////////////////////////////////////
  useEffect(() => {
    comAddPageFieldFunc({ state, setState, fieldData })
  }, [])

  const values = { ...state.values }
  const { isError } = state;
  const { fieldLabel } = state;


  const onChangeDropDown = (e, v) => {
    
    const event = { name: "employeeType", value: e }
    formValChange({ event, state, setState })
  }
  const onChangeText = (event) => {
    formValChange({ event, state, setState })
  }

  const formSubmitHandler = (event) => {
    debugger
    event.preventDefault();
    if (formValid(state, setState)) {

      // console.log("isvalid", values.party.value)

      const jsonBody = JSON.stringify({
        Name: values.name,
        Description: values.description,
        Dashboard: values.dashboard,
        isActive: values.isActive,
        isSCMRole: values.isSCMRole,
        IsPartyConnection: values.IsPartyConnection,
        RoleEmployeeTypes: values.employeeType.map((i) => { return ({ EmployeeType: i.value }) }),
        CreatedBy: 1,
        CreatedOn: "2022-05-20T11:22:55.711483Z",
        UpdatedBy: 1,
        UpdatedOn: "2022-05-20T11:22:55.711483Z"
      });

      if (pageMode === 'edit') {
        dispatch(updateID(jsonBody, EditData.id));
        console.log("update jsonBody",jsonBody)
      }

      else {
        dispatch(postRole(jsonBody));
        console.log("jsonBody",jsonBody)
      }
    }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <Container fluid>
            <MetaTags>
              <title>DriverMaster | FoodERP-React FrontEnd</title>
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
                            <FormGroup className="mb-2 col col-sm-4 ">
                              <Label htmlFor="validationCustom01">{fieldLabel.name} </Label>
                              <Input
                                type="text"
                                className={isError.name.length > 0 ? "is-invalid form-control" : "form-control"}
                                name="name"
                                defaultValue={EditData.Name}
                                placeholder="Please Enter Name"
                                onChange={(e) => {
                                  onChangeText(e)
                                  dispatch(BreadcrumbShow(e.target.value))
                                }}

                              />
                              {isError.name.length > 0 && (
                                <span className="invalid-feedback">{isError.name}</span>
                              )}
                            </FormGroup>

                            <Col md="1"> </Col>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <Label htmlFor="validationCustom01">{fieldLabel.employeeType} </Label>
                                <Select
                                  name="employeeType"
                                  // defaultValue={EmployeeType_DropdownOptions[0]}
                                  value={values.employeeType}
                                  isSearchable={false}
                                  isMulti={true}
                                  className="react-dropdown"
                                  options={EmployeeType_DropdownOptions}
                                  onChange={(e) => { onChangeDropDown(e) }}
                                  classNamePrefix="dropdown"
                                  styles={{
                                    control: base => ({
                                      ...base,
                                      border: isError.employeeType.length > 0 ? '1px solid red' : '',

                                    })
                                  }}
                                />
                                {isError.employeeType.length > 0 && (
                                  <span className="text-danger f-8"><small>{isError.employeeType}</small></span>
                                )}
                              </div>
                            </div>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.description} </Label>
                                <Input
                                  type="text"
                                  value={EditData.Description}
                                  className={isError.description.length > 0 ? "is-invalid form-control" : "form-control"}
                                  name="description"
                                  placeholder="Please Enter description"
                                  onChange={(e) => {
                                    onChangeText(e)
                                    dispatch(BreadcrumbShow(e.target.value))
                                  }}
                                />
                                {isError.description.length > 0 && (
                                  <span className="invalid-feedback">{isError.description}</span>
                                )}
                              </FormGroup>

                              <Col md="1">  </Col>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.dashboard} </Label>
                                <Input
                                  type="text"
                                  value={EditData.Dashboard}
                                  className={isError.dashboard.length > 0 ? "is-invalid form-control" : "form-control"}
                                  name="dashboard"
                                  placeholder="Please Enter dashboard"
                                  onChange={(e) => {
                                    onChangeText(e)
                                    dispatch(BreadcrumbShow(e.target.value))
                                  }}
                                />
                                {isError.dashboard.length > 0 && (
                                  <span className="invalid-feedback">{isError.dashboard}</span>
                                )}
                              </FormGroup>
                            </Row>

                            <Row>
                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-4 col-form-label" >Is SCM Role </Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" >
                                      <Input type="checkbox" className="form-check-input"
                                        value={EditData.isSCMRole}
                                        name="isSCMRole"
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-3 col-form-label" >Active</Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                      <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        checked={EditData.isActive}
                                        defaultChecked={true}
                                        name="isActive"
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>

                              <FormGroup className="mb-2 col col-sm-5">
                                <Row className="justify-content-md-left">
                                  <Label className="col-sm-4 col-form-label" >Is PartyConnection </Label>
                                  <Col md={2} style={{ marginTop: '9px' }} >

                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                      <Input type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                        defaultChecked={EditData.IsPartyConnection}
                                        name="IsPartyConnection"
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>

                            <FormGroup>
                              <Row>
                                <Col sm={2}>
                                  <div>
                                    {
                                      pageMode === "edit" ?
                                        userPageAccessState.RoleAccess_IsEdit ?
                                          <button
                                            type="submit"
                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Party Type"
                                            className="btn btn-success w-md mt-3"
                                          >
                                            <i class="fas fa-edit me-2"></i>Update
                                          </button>
                                          :
                                          <></>
                                        : (

                                          userPageAccessState.RoleAccess_IsSave ?
                                            <button
                                              type="submit"
                                              data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Party Type"
                                              className="btn btn-primary w-md mt-3 "
                                            > <i className="fas fa-save me-2"></i> Save
                                            </button>
                                            :
                                            <></>
                                        )
                                    }
                                  </div>
                                </Col>
                              </Row>
                            </FormGroup>
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
