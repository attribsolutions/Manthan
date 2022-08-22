import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Card, CardBody, Col, Container, Row, CardHeader, Label, Button, FormGroup, Table } from "reactstrap";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { getEmployee, getRoles, addUser, updateID, addUserSuccess, GetUserPartiesForUserMastePage, getEmployeeForUseRegistration }
  from "../../../store/Administrator/UserRegistrationRedux/actions";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import AvField from "availity-reactstrap-validation/lib/AvField";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import { editSuccess } from "../../../store/Administrator/RoleMasterRedux/action";
import { Tbody, Thead } from "react-super-responsive-table";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";
import { useHistory } from "react-router-dom";

const AddUser = (props) => {

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  //*** "isEditdata get all data from ModuleID for Binding  Form controls
  let editDataGatingFromList = props.state;


  //SetState  Edit data Geting From Modules List component
  const [EditData, setEditData] = useState([]);
  const [pageMode, setPageMode] = useState("save");
  const [userPageAccessState, setUserPageAccessState] = useState('');

  const [partyRoleData, setPartyRoleData] = useState([]);
  const [EmployeeSelect, setEmployeeSelect] = useState("");
  const [userPartiesForUserMaster, setUserPartiesForUserMaster] = useState([]);

  // M_Roles DropDown
  const [RoleDropDown, setRoleDropDown] = useState([]);

  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState('form-control');
  const [isCPassword, setisCPassword] = useState(false);


  useEffect(() => {
    if (isCPassword) {
      if (password === cPassword) {
        setShowErrorMessage(false);
        setCPasswordClass('form-control is-valid')
      } else {
        setShowErrorMessage(true)
        setCPasswordClass('form-control is-invalid')
      }
    }
  }, [cPassword])


  const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setisCPassword(true);
  }


  //Access redux store Data /  'save_ModuleSuccess' action data
  const { PostAPIResponse, employeelistForDropdown, Roles, userPartiesForUserMaster_redux, RoleAccessModifiedinSingleArray } = useSelector((state) => ({
    PostAPIResponse: state.User_Registration_Reducer.AddUserMessage,
    userPartiesForUserMaster_redux: state.User_Registration_Reducer.userPartiesForUserMaster,
    employeelistForDropdown: state.User_Registration_Reducer.employeelistForDropdown,
    Roles: state.User_Registration_Reducer.Roles,
    RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
  }));

  // userAccess useEffect
  useEffect(() => {

    let userAcc = undefined
    if ((editDataGatingFromList === undefined)) {

      const locationPath = history.location.pathname
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === locationPath)
      })
    }
    else if (!(editDataGatingFromList === undefined)) {
      const relatatedPage = props.relatatedPage
      userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
        return (`/${inx.ActualPagePath}` === relatatedPage)
      })

      if (!(userAcc === undefined)) {
        setUserPageAccessState(userAcc)
      }
    }
  }, [RoleAccessModifiedinSingleArray])


  useEffect(() => {

    let newArray = userPartiesForUserMaster_redux.map((i) => (
      {
        PartyRoles: [],
        Party: i.Party_id,
        PartyName: i.PartyName
      }
    ))
    setUserPartiesForUserMaster(newArray)

  }, [userPartiesForUserMaster_redux])

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(() => {

    if (!(userPageAccessState === '')) { document.getElementById("txtName").focus(); }

    if (!(editDataGatingFromList === undefined)) {

      setEditData(editDataGatingFromList);
      dispatch(BreadcrumbShow(editDataGatingFromList.LoginName))
      setPageMode("edit");
      dispatch(editSuccess({ Status: false }))
      setEmployeeSelect({
        value: editDataGatingFromList.Employee,
        label: editDataGatingFromList.EmployeeName
      })
      setUserPartiesForUserMaster(editDataGatingFromList.UserRole)
      // var a = editDataGatingFromList.UserRole.map((i) =>{ ({ Party: i.Party, Role: i.Role })})
      let arraynew = []
      editDataGatingFromList.UserRole.map((i) => {
        i.PartyRoles.map((i2) => {
          arraynew.push({ Party: i.Party, Role: i2.Role })
        })
      })
      setPartyRoleData(arraynew)
      return
    }
  }, [editDataGatingFromList])

  useEffect(() => {

    if ((PostAPIResponse.Status === true) && (PostAPIResponse.StatusCode === 201)) {
      dispatch(addUserSuccess({ Status: false }))
      formRef.current.reset();
      setEmployeeSelect('')
      setRoleDropDown('')
      setPartyRoleData('')
      if (pageMode === "other") {
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
          RedirectPath: '/UserList',
          AfterResponseAction: false
        }))
      }
    }
    else if (PostAPIResponse.Status === true) {
      dispatch(addUserSuccess({ Status: false }))
      dispatch(AlertState({
        Type: 4,
        Status: true,
        Message: JSON.stringify(PostAPIResponse.Message),
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }, [PostAPIResponse.Status])

  useEffect(() => {
    dispatch(getEmployeeForUseRegistration());
    dispatch(getRoles());
  }, [dispatch]);


  const EmployeeValues = employeelistForDropdown.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  function handllerEmployeeID(e) {
    setEmployeeSelect(e)
    dispatch(GetUserPartiesForUserMastePage(e.value))
  }

  const RolesValues = Roles.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  /// Role dopdown
  function RoleDropDown_select_handler(event, pty, key) {
    debugger
    const nwPtRole = event.map((ind) => ({
      Party: pty.Party,
      Role: ind.value
    }))

    const find = partyRoleData.filter((index, key1) => {
      return !(index.Party === pty.Party)
    })
    if ((find === undefined)) {
      setPartyRoleData(nwPtRole)
    } else {
      // RoleDropDown
      // const newarray=nwPtRole.concat(nwPtRole)
      setPartyRoleData(nwPtRole.concat(find))
    }
  };

  const handleValidSubmit = (event, values) => {
    // debugger
    const jsonBody = JSON.stringify({
      email: values.email,
      LoginName: values.loginName,
      password: "1234",
      AdminPassword: "1234",
      Employee: EmployeeSelect.value,
      isActive: values.isActive,
      isSendOTP: values.isSendOTP,
      isLoginUsingMobile: values.isLoginUsingMobile,
      isLoginUsingEmail: values.isLoginUsingEmail,
      CreatedBy: 1,
      UpdatedBy: 1,
      UserRole: partyRoleData
      // .map((d) => ({
      //   Role: d.Role,
      // })),
    })

    debugger




    if (partyRoleData.length <= 0) {
      dispatch(AlertState({
        Type: 4, Status: true,
        Message: "At Least One Role Data Add in the Table",
        RedirectPath: false,
        PermissionAction: false,
      }));
    }
    else if (pageMode === 'edit') {
      dispatch(updateID(jsonBody, EditData.id));
      setEditData([]);
    }
    else {
      dispatch(addUser(jsonBody));
    }
  };



  const rolaTable = () => {

    return (
      <table className="table table-bordered ">
        <Thead >
          <tr>
            <th>Party Name</th>
            <th>RoleName</th>

          </tr>
        </Thead>
        <Tbody  >
          {userPartiesForUserMaster.map((index, key) => (
            <tr key={index.Role}>
              <td className="col-sm-6">
                {index.PartyName}
              </td>
              <td>
                <FormGroup className="" >

                  <Select
                    defaultValue={pageMode === "edit" ? index.PartyRoles.map((i) => ({ value: i.Role, label: i.RoleName })) : null}
                    options={RolesValues}
                    isMulti={true}
                    className="basic-multi-select"
                    onChange={(event) => { RoleDropDown_select_handler(event, index, key) }}
                    classNamePrefix="select2-selection"
                  />
                </FormGroup>
              </td>
            </tr>
          ))}
        </Tbody>

      </table>
    )
  }

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  var IsEditMode_Css = ''
  if (pageMode === "edit" || pageMode == "other") { IsEditMode_Css = "-5.5%" };

  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>
          <title>User Registration| FoodERP-React FrontEnd</title>
        </MetaTags>
        <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
          <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
          <Container fluid>
            <Row>
              <Col lg={12}>
                <Card className="text-black" >
                  <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                    <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                    <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                  </CardHeader>
                  <CardBody className="text-black">
                    <AvForm
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v);
                      }}
                      ref={formRef}
                    >
                      <Card className=" text-black">
                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                          <Row >
                            <FormGroup className="mb-2 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Employee </Label>
                              <Select
                                value={EmployeeSelect}
                                options={EmployeeValues}
                                onChange={(e) => { handllerEmployeeID(e) }}
                              />
                            </FormGroup>

                          </Row>
                          <Row >

                            <FormGroup className="mb-1 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Login Name</Label>
                              <AvField name="loginName" id="txtName"
                                type="text"
                                placeholder="Please Enter Name"
                                defaultvalue=''
                                value={EditData.LoginName}
                                autoComplete='off'
                                validate={{
                                  required: { value: true, errorMessage: 'Please Enter Name' },
                                }}
                                onChange={(e) => { dispatch(BreadcrumbShow(e.target.value)) }}
                              />
                            </FormGroup>
                          </Row>


                          {pageMode === "save" ?
                            <Row>
                              <Row>
                                <FormGroup className="mb-1 col col-sm-4 " >
                                  <Label htmlFor="validationCustom01">Password</Label>
                                  <AvField name="password" id="password"
                                    type="password"
                                    // value={EditData.password}
                                    placeholder="Please Enter Password"
                                    autoComplete="new-password"
                                    className="form-control"
                                    // validate={{
                                    //   required: { value: true, errorMessage: 'Please Enter Password' },
                                    // }}

                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }} />

                                </FormGroup>

                              </Row>
                              <Row>
                                <FormGroup className="mb-1 col col-sm-4 " >
                                  <Label htmlFor="validationCustom01">Confirm Password</Label>
                                  <AvField name="password" id="password"
                                    type="password"
                                    // value={EditData.password}
                                    placeholder="Please Enter Password"
                                    autoComplete="new-password"
                                    className={cPasswordClass}
                                    // validate={{
                                    //   required: { value: true, errorMessage: 'Please Enter Password' },
                                    // }}
                                    value={cPassword}
                                    onChange={handleCPassword} />
                                  {showErrorMessage && isCPassword ? <div> Passwords did not match </div> : ''}
                                  {/* <AvFeedback> Passwords did not match </AvFeedback> */}
                                </FormGroup>
                              </Row>
                            </Row>
                            : null}



                          <Row className="mt-2">
                            <FormGroup className="mb-1 col col-sm-12 " >
                              <Row className="justify-content-md-left">
                                <Label htmlFor="horizontal-firstname-input" className=" col-sm-2 col-form-label" >Enable Mobile Login</Label>
                                <Col md="1" style={{ marginTop: '9px' }} >
                                  <div className="form-check form-switch form-switch-md ml-4 " dir="ltr">
                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                      checked={EditData.isLoginUsingMobile}
                                      name="isLoginUsingMobile"
                                      defaultChecked={true}
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                  </div>
                                </Col>

                                <Col md="2" >  </Col>
                                <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >Active </Label>
                                <Col md="1" style={{ marginTop: '9px' }} >
                                  <div className="form-check form-switch form-switch-md " dir="ltr">
                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                      checked={EditData.isActive}
                                      defaultChecked={true}
                                      name="isActive"
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                  </div>
                                </Col>
                                <Col md="5" >  </Col>
                              </Row>
                            </FormGroup>
                          </Row>

                          <Row >
                            <FormGroup className="col col-sm-12  " >
                              <Row className="justify-content-md-left">
                                <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >Enable Email Login</Label>
                                <Col md={1} style={{ marginTop: '10px' }} >
                                  <div className="form-check form-switch form-switch-md" dir="ltr">
                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                      checked={EditData.isLoginUsingEmail}
                                      name="isLoginUsingEmail"
                                      defaultChecked={true}
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                  </div>
                                </Col>

                                <Col md="2" >  </Col>
                                <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >Send OTP </Label>
                                <Col md={1} style={{ marginTop: '10px' }} >
                                  <div className="form-check form-switch form-switch-md" dir="ltr">
                                    <AvInput type="checkbox" className="form-check-input" id="customSwitchsizemd"
                                      defaultChecked={EditData.isSendOTP}
                                      name="isSendOTP"
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                  </div>
                                </Col>
                                <Col md="5" >  </Col>
                              </Row>
                            </FormGroup>
                          </Row>
                        </CardBody>
                      </Card>

                      <Card className="mt-n2">
                        <CardBody style={{ backgroundColor: "whitesmoke" }}>
                          <Row className="">
                            {/* <FormGroup className=" ml-3 col col-sm-4 " >
                              <Label htmlFor="validationCustom01">Roles </Label>
                              <Select
                                value={RoleDropDown}
                                options={RolesValues}
                                onChange={(e) => { RoleDropDown_select_handler(e) }}
                                classNamePrefix="select2-selection"
                              />

                            </FormGroup> */}

                            {/* <Col className="text-center" sm={1} style={{ marginTop: '28px' }} >
                              {" "}
                              <Button
                                type="button"
                                className="btn btn-sm mt-1 mb-0 btn-light  btn-outline-primary  "
                                onClick={() =>
                                  AddRoleHandler()
                                }
                              >
                                <i className="dripicons-plus "></i>
                              </Button>
                            </Col> */}

                            {userPartiesForUserMaster.length > 0 ? <Col sm={6} style={{ marginTop: '28px' }}>

                              {partyRoleData ? (
                                <div >
                                  {rolaTable()}
                                </div>
                              ) :
                                null
                              }
                            </Col> : null}

                            {/* <FormGroup > */}

                            <Row >
                              <Col sm={2}>
                                <div>
                                  {
                                    pageMode === "edit" ?
                                      userPageAccessState.RoleAccess_IsEdit ?
                                        <button
                                          type="submit"
                                          data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update User"
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
                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save User"
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
                            {/* </FormGroup > */}
                          </Row>
                        </CardBody>
                      </Card>
                    </AvForm>
                  </CardBody>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                </Card>
              </Col>
            </Row>
          </Container >
        </div >
      </React.Fragment >
    );
  }
  else {
    return (
      <React.Fragment></React.Fragment>
    )
  }
};
export default AddUser;

