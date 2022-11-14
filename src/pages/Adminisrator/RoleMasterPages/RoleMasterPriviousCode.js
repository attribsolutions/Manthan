import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, CardHeader, FormGroup, } from "reactstrap";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import {
  editSuccess,
  postRole, updateID, PostSuccess
} from "../../../store/Administrator/RoleMasterRedux/action";
import { AlertState } from "../../../store/actions";
import Select from "react-select";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { getEmployeeTypelist } from "../../../store/Administrator/EmployeeTypeRedux/action";
import BreadcrumbDemo from "../../../components/Common/CmponentRelatedCommonFile/BreadcrumbDemo";

const RoleMaster = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;
  let propsPageMode = props.pageMode;
  let pageModeProps = props.pageMode;

  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');
  const [employeeType_DropdownSelect, setEmployeeType_DropdownSelect] = useState('');
  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostAPIResponse, RoleAccessModifiedinSingleArray, EmployeeType } = useSelector((state) => ({
    PostAPIResponse: state.RoleMaster_Reducer.AddUserMessage,
    EmployeeType: state.EmployeeTypeReducer.EmployeeTypeList,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
  }));

  useEffect(() => {
    dispatch(getEmployeeTypelist());
  }, []);

  // userAccess useEffect
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
    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }
    if (!(editDataGatingFromList === undefined)) {
      setEditData(editDataGatingFromList);
      setPageMode(pageModeProps);
      dispatch(editSuccess({ Status: false }))
      dispatch(Breadcrumb_inputName(editDataGatingFromList.Name))
      const listItems = editDataGatingFromList.RoleEmployeeTypes.map((data) => ({
        value: data.EmployeeType,
        label: data.EmployeeTypeName
      }))

      setEmployeeType_DropdownSelect(listItems)
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


  //'Save' And 'Update' Button Handller
  const FormSubmitButton_Handler = (event, values) => {
    const jsonBody = JSON.stringify({
      Name: values.Name,
      Description: values.Description,
      isActive: values.isActive,
      Dashboard: values.Dashboard,
      isSCMRole: values.isSCMRole,
      IsPartyConnection: values.IsPartyConnection,
      RoleEmployeeTypes: employeeType_DropdownSelect.map((i) => { return ({ EmployeeType: i.value }) }),
      CreatedBy: 1,
      CreatedOn: "2022-05-20T11:22:55.711483Z",
      UpdatedBy: 1,
      UpdatedOn: "2022-05-20T11:22:55.711483Z"
    })

    if (pageMode === "edit") {
      dispatch(updateID(jsonBody, EditData.id));
    }
    else {
      dispatch(postRole(jsonBody));
    }
  };

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <MetaTags>
            <title>Role Master| FoodERP-React FrontEnd</title>
          </MetaTags>
          <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />

          <Container fluid>
            <Card className="text-black" >
              <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
              </CardHeader>
              <CardBody className=" vh-10 0 text-black" style={{ backgroundColor: "#whitesmoke" }} >
                <AvForm onValidSubmit={(e, v) => { FormSubmitButton_Handler(e, v) }}
                  ref={formRef}
                >
                  <Row>
                    <Col md={12}  >
                      <Card >
                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                          <Row>
                            <FormGroup className="mb-3 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Name </Label>
                              <AvField name="Name" id="txtName"
                                value={EditData.Name}
                                type="text"
                                placeholder="Please Enter Name"
                                autoComplete='off'
                                validate={{
                                  required: { value: true, errorMessage: 'Please Enter Name' },
                                }}
                                onChange={(e) => { dispatch(Breadcrumb_inputName(e.target.value)) }}
                              />
                            </FormGroup>

                            <Col md="1">  </Col>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <Label className="form-label font-size-13 ">Employee Type</Label>
                                <Select
                                  defaultValue={employeeType_DropdownSelect}
                                  isMulti={true}
                                  className="basic-multi-select"
                                  options={EmployeeType_DropdownOptions}
                                  onChange={(e) => { EmployeeType_Dropdown_Handler(e) }}
                                  classNamePrefix="select2-selection"
                                />
                              </div>
                            </div>
                          </Row>

                          <Row>
                            <FormGroup className="mb-3 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Description </Label>
                              <AvField name="Description" id="txtName"
                                value={EditData.Description}
                                type="text"
                                placeholder="Please Enter Description"
                                autoComplete='off'
                                validate={{
                                  required: { value: true, errorMessage: 'Please Enter Description' },
                                }} />
                            </FormGroup>

                            <Col md="1">  </Col>
                            <FormGroup className="mb-3 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Dashboard </Label>
                              <AvField name="Dashboard" id="txtName"
                                value={EditData.Dashboard}
                                type="text"
                                placeholder="Please Enter Dashboard"
                                autoComplete='off'
                                validate={{
                                  required: { value: true, errorMessage: 'Please Enter Dashboard' },
                                }} />
                            </FormGroup>
                          </Row>

                          <Row>
                          <FormGroup className="mb-2 col col-sm-5">
                            <Row className="justify-content-md-left">
                              <Label className="col-sm-4 col-form-label" >Is SCM Role </Label>
                              <Col md={2} style={{ marginTop: '9px' }} >

                                <div className="form-check form-switch form-switch-md mb-3" >
                                  <AvInput type="checkbox" className="form-check-input"
                                    defaultChecked={EditData.isSCMRole}
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
                                  <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
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
                                  <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                    defaultChecked={EditData.IsPartyConnection}
                                    name="IsPartyConnection"
                                  />
                                </div>
                              </Col>
                            </Row>
                          </FormGroup>
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
                                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Role"
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
                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Role"
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
                    </Col>
                  </Row>
                </AvForm>
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
