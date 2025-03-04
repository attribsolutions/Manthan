import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  CardHeader,
  Label,
  FormGroup,
  Input
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  saveUserMasterAction,
  userUpdateAction,
  saveUserMasterActionSuccess,
  GetUserPartiesForUserMastePage,
  getEmployeeForUseRegistration,
  userEditActionSuccess
}
  from "../../../store/Administrator/UserRegistrationRedux/actions";
import { Tbody, Thead } from "react-super-responsive-table";
import { Breadcrumb_inputName } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import reactRouterDom, { useHistory } from "react-router-dom";
import { breadcrumbReturnFunc, btnIsDissablefunc, loginCompanyID, loginUserDetails, loginUserID, loginUserIsFranchisesRole, metaTagLabel } from "../../../components/Common/CommonFunction";
import * as mode from "../../../routes/PageMode"
import * as pageId from "../../../routes/allPageID"
import { SaveButton } from "../../../components/Common/CommonButton";
import { getRole } from "../../../store/Administrator/RoleMasterRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { comAddPageFieldFunc, initialFiledFunc, onChangeSelect, onChangeText, resetFunction } from "../../../components/Common/validationFunction";
import { commonPageField, commonPageFieldSuccess, postSelect_Field_for_dropdown } from "../../../store/actions";
import AddMaster from "../EmployeePages/Drodown";
import * as url from "../../../routes/route_url";
import AddEmployee from "../EmployeePages/EmployeeMaster";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { GenralMasterSubType } from "../../../helpers/backend_helper";
import { passwordRgx } from "../../../CustomValidateForm";
import { ChangePassword, ChangePassword_Succes } from "../../../store/auth/changepassword/action";

const AddUser = (props) => {

  // const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()
  const isFrenchises = loginUserIsFranchisesRole();

  const fileds = {
    id: "",
    Name: "",
    LoginName: '',
    Password: '',
    EmployeeName: '',
    POSRateType: '',
    isActive: true,
    isLoginUsingEmail: false,
    isLoginUsingMobile: false,
    isSendOTP: false,
    changePassword: '',
  }

  const [state, setState] = useState(() => initialFiledFunc(fileds))
  debugger
  const [employeeMaster_AddAccess, setEmployeeMaster_AddAccess] = useState(false)

  //SetState  Edit data Geting From Modules List component
  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState('');
  const [editCreatedBy, seteditCreatedBy] = useState("");




  // M_Roles DropDown

  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState('form-control');
  const [isCPassword, setisCPassword] = useState(false);


  const [currentPwd, setCurrentPwd] = useState("");

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [newPwdError, setNewPwdError] = useState({});

  const handleCPassword = (event) => {
    onChangeText({ event, state, setState });
    setCPassword(event.target.value);
    setisCPassword(true);
  }

  const {
    postMsg,
    employeelistForDropdown,
    Roles = [],
    employePartyWiseRoleState,
    userAccess,
    pageField,
    saveBtnloading,
    RateTypeList,
    loading,
    postChangePasswordMsg
  } = useSelector((state) => ({
    loading: state.ChangePasswordReducer.loading,
    saveBtnloading: state.User_Registration_Reducer.saveBtnloading,
    postMsg: state.User_Registration_Reducer.postMsg,
    employePartyWiseRoleState: state.User_Registration_Reducer.userPartiesForUserMaster,
    employeelistForDropdown: state.User_Registration_Reducer.employeelistForDropdown,
    RateTypeList: state.PartyMasterBulkUpdateReducer.SelectField,
    Roles: state.RoleMaster_Reducer.roleList,
    postChangePasswordMsg: state.ChangePasswordReducer.postMsg,
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

    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(pageId.USER))
    dispatch(getEmployeeForUseRegistration());
    dispatch(getRole());
  }, []);

  useEffect(() => { // Rate Type Dropdown useEffect
    const jsonBody = JSON.stringify({
      Company: loginCompanyID(),
      TypeID: 173
    });
    dispatch(postSelect_Field_for_dropdown(jsonBody));
  }, []);

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

  // userAccess useEffect

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

    userAcc = userAccess.find((index) => {
      if (index.id === pageId.EMPLOYEE) {
        setEmployeeMaster_AddAccess(true)
      }
      return (`/${index.ActualPagePath}` === locationPath)
    })

    if (userAcc) {
      setUserAccState(userAcc);
      if (!props.isdropdown) {
        breadcrumbReturnFunc({ dispatch, userAcc });
      }
    };
  }, [userAccess])

  useEffect(() => {

    if (pageField) {
      const fieldArr = pageField.PageFieldMaster
      comAddPageFieldFunc({ state, setState, fieldArr })
    }
  }, [pageField])

  // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
  useEffect(async () => {

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
        const { id, LoginName, AdminPassword, CreatedBy, EmployeeName, Employee, UserRole,
          isLoginUsingMobile, isActive, isSendOTP, isLoginUsingEmail, POSRateType
        } = hasEditVal
        const { values, hasValid, } = { ...state }

        const jsonBody = {
          Company: loginCompanyID(),
          TypeID: 173
        };
        const rateTypeApiResp = await GenralMasterSubType(jsonBody)

        const defaultSaveValue = rateTypeApiResp.Data
          .filter(i => i.id === POSRateType)
          .map(i => ({ label: i.Name, value: i.id }))[0] || null;

        values.id = id;
        values.LoginName = LoginName;
        values.Password = AdminPassword;
        values.EmployeeName = { label: EmployeeName, value: Employee };
        values.isActive = isActive;
        values.isLoginUsingEmail = isLoginUsingEmail;
        values.isLoginUsingMobile = isLoginUsingMobile;
        values.isSendOTP = isSendOTP;
        values.POSRateType = defaultSaveValue;

        hasValid.id.valid = true;
        hasValid.LoginName.valid = true;
        hasValid.Password.valid = true;
        hasValid.EmployeeName.valid = true;
        hasValid.isActive.valid = true;
        hasValid.isLoginUsingEmail.valid = true;
        hasValid.isLoginUsingMobile.valid = true;
        hasValid.isSendOTP.valid = true;
        hasValid.POSRateType.valid = true;

        dispatch(Breadcrumb_inputName(LoginName))
        dispatch(GetUserPartiesForUserMastePage({ id: Employee, editRole: UserRole }))

        seteditCreatedBy(CreatedBy)

        dispatch(userEditActionSuccess({ Status: false }))
      }
    }

    return () => {
      dispatch(Breadcrumb_inputName(""))
    }
  }, [])


  useEffect(async () => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
      dispatch(saveUserMasterActionSuccess({ Status: false }))

      if (pageMode === mode.dropdownAdd) {
        customAlert({
          Type: 1,
          Message: postMsg.Message,
        })
      }
      else {
        customAlert({
          Type: 1,
          Status: true,
          Message: postMsg.Message,
        })
        history.push({
          pathname: url.USER_lIST,
        })
      }
    }

    else if ((postMsg.Status === true)) {
      dispatch(saveUserMasterActionSuccess({ Status: false }))
      customAlert({
        Type: 4,
        Message: JSON.stringify(postMsg.Message),
      })
    }
  }, [postMsg.Status])



  useEffect(() => {
    if ((postChangePasswordMsg.Status === true) && (postChangePasswordMsg.StatusCode === 200)) {
      const event = new MouseEvent('click', {
        clientX: window.innerWidth,
        clientY: window.innerHeight,
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.dispatchEvent(event);


      dispatch(ChangePassword_Succes({ Status: false }))

    }
  }, [postChangePasswordMsg])

  const EmployeeOptions = employeelistForDropdown.map((Data) => ({
    value: Data.id,
    label: Data.Name,
    EmployeeEmail: Data.EmployeeEmail,
    EmployeeMobile: Data.EmployeeMobile
  }));

  const RolesValues = Roles.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  const RateTypeValue = RateTypeList.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));

  function handllerEmployeeID(e) {
    dispatch(GetUserPartiesForUserMastePage({ id: e.value }))
  }

  /// Role dopdown
  function RoleDropDown_select_handler(event, pty, key) {
    employePartyWiseRoleState.forEach((index, key1) => {
      if (key === key1) {
        index.PartyRoles = event
      }
    })
  };



  const currentpwdOnchange = (e) => {
    e.preventDefault();

    setCurrentPwd(e.target.value)
  }

  const newpwdOnchange = (e) => {
    debugger
    let val = e.target.value

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (state.required.changePassword) {
      if (strongRegex.test(val) && val !== "") {
        setNewPwdError({ PasswordLevel: "Strong password", Color: "green" });
      } else if (mediumRegex.test(val) && val !== "") {
        setNewPwdError({ PasswordLevel: "Medium password", Color: "orange" });
      } else if (val !== "") {
        setNewPwdError({ PasswordLevel: "Weak password", Color: "tomato" });
      }
    } else {
      setNewPwdError({ PasswordLevel: "", Color: "" });
    }
    setConfirmPwd('');
    setPasswordsMatch(false);
  }

  const confirmpwdOnchange = (e) => {

    let val = e.target.value;


    if (values.changePassword === val) {
      setConfirmPwd(val);
      setPasswordsMatch(true);
    } else {
      setConfirmPwd(val);
      setPasswordsMatch(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const ChangePasswordHandler = async (event) => {

    event.preventDefault();


    if (!passwordsMatch) {
      customAlert({
        Type: 3,
        Message: alertMessages.newPasswordNotMatch,
      });
      return
    }

    const jsonBody = JSON.stringify({
      LoginName: values.LoginName,
      password: currentPwd,
      newpassword: values.changePassword
    });

    const isConfirmed = await customAlert({
      Type: 7,
      Message: alertMessages.changePassword,
    });

    if (isConfirmed) {
      dispatch(ChangePassword({ jsonBody }));

    };
  };


  const saveHandler = (event) => {

    event.preventDefault();
    const btnId = event.target.id;
    btnIsDissablefunc({ btnId: btnId, state: true })
    try {

      const userRoleArr = []
      employePartyWiseRoleState.map(i1 => {

        i1.PartyRoles.map(i2 => {
          userRoleArr.push({
            Party: i1.Party,
            Role: i2.value
          })
        })
      })
      if (userRoleArr.length <= 0) {
        customAlert({
          Type: 4,
          Message: alertMessages.atLeastOneRoleAddInTable,
        })
        return btnIsDissablefunc({ btnId: btnId, state: false })
      }
      const jsonBody = JSON.stringify({
        LoginName: values.LoginName,
        password: values.Password,
        AdminPassword: values.Password,
        Employee: values.EmployeeName.value,
        isActive: values.isActive,
        isSendOTP: values.isSendOTP,
        POSRateType: (values.POSRateType === "" || values.POSRateType === null) ? 0 : values.POSRateType.value,
        isLoginUsingMobile: values.isLoginUsingMobile,
        isLoginUsingEmail: values.isLoginUsingEmail,
        CreatedBy: loginUserID(),
        UpdatedBy: loginUserID(),
        IsLoginPermissions: true,
        UserRole: userRoleArr
      })

      if (pageMode === mode.edit) {
        dispatch(userUpdateAction({ jsonBody, updateId: values.id, btnId }));
      }
      else {
        dispatch(saveUserMasterAction({ jsonBody, btnId }));
      }
    } catch (error) { btnIsDissablefunc({ btnId: btnId, state: false }) }
  }

  const PartyWiseRoleTable = () => {

    if (values.EmployeeName === '') {
      return null
    }
    if (!(employePartyWiseRoleState.length === 0)) {
      if ((employePartyWiseRoleState[0].Party > 0)) {
        return (
          <div className="col col-12" style={{ marginTop: '28px' }}>
            <table className="table table-bordered ">
              <Thead >
                <tr>
                  <th>Party Name</th>
                  <th>RoleName</th>
                </tr>
              </Thead>
              <Tbody  >
                {employePartyWiseRoleState.map((index, key) => (
                  <tr key={index.Role}>
                    <td className="col-sm-6">
                      {index.PartyName}
                    </td>
                    <td>
                      <FormGroup className="" >
                        <Select
                          defaultValue={index.PartyRoles}
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
          </div>
        )
      }
      else {
        return <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <Label className="form-label font-size-13 ">Role name</Label>
            <Select
              defaultValue={employePartyWiseRoleState[0].PartyRoles}
              options={RolesValues}
              isMulti={true}
              className="basic-multi-select"
              onChange={(event) => { RoleDropDown_select_handler(event, employePartyWiseRoleState[0], 0) }}
              classNamePrefix="select2-selection"
            />
          </div>
        </div>
      }
    }
    return null
  }

  // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
  // var IsEditMode_Css = ''
  // if (modalCss || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };


  console.log(values.POSRateType)
  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
        {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.USER} /> */}

        <div className="page-content" >
          <Container fluid>
            <div >
              <Row>
                <Col lg={12}>
                  <Card className="text-black" >
                    <CardHeader className="card-header   text-black c_card_header" >
                      <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                      <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                    </CardHeader>











                    <CardBody className="text-black">
                      <form>
                        <Card className=" text-black">
                          <CardBody className="c_card_body">
                            <Row>

                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01"> {fieldLabel.EmployeeName} </Label>
                                <Col sm={12}>
                                  <Select
                                    id="EmployeeName "
                                    name="EmployeeName"
                                    isDisabled={pageMode === mode.edit ? true : false}
                                    value={values.EmployeeName}
                                    options={EmployeeOptions}
                                    autoFocus={true}
                                    onChange={(hasSelect, evn) => {
                                      handllerEmployeeID(hasSelect)
                                      onChangeSelect({ hasSelect, evn, state, setState, })
                                    }}
                                  />
                                  {isError.EmployeeName.length > 0 && (
                                    <span className="invalid-feedback">{isError.EmployeeName}</span>
                                  )}
                                </Col>
                              </FormGroup>

                              {
                                (employeeMaster_AddAccess) && <Col md="1" className=" mt-3">
                                  <AddMaster
                                    masterModal={AddEmployee}
                                    masterPath={url.EMPLOYEE}
                                  />
                                </Col>
                              }

                            </Row>
                            {isFrenchises &&
                              <Row>
                                <FormGroup className="mb-2 col col-sm-4 ">
                                  <Label htmlFor="validationCustom01"> {fieldLabel.POSRateType} </Label>
                                  <Col sm={12}>
                                    <Select
                                      id="POSRateType"
                                      name="POSRateType"
                                      value={values.POSRateType}

                                      options={RateTypeValue}
                                      onChange={(hasSelect, evn) => {
                                        onChangeSelect({ hasSelect, evn, state, setState, })
                                      }}
                                    />
                                    {isError.POSRateType.length > 0 && (
                                      <span className="text-danger font-size-17"><small>{isError.POSRateType}</small></span>
                                    )}
                                  </Col>
                                </FormGroup>
                              </Row>
                            }

                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.LoginName}</Label>
                                <Input
                                  name="LoginName"
                                  id="txtName"
                                  type="text"
                                  placeholder="Please Enter Login Name"
                                  value={values.LoginName}
                                  disabled={pageMode === mode.edit ? true : false}
                                  autoComplete='off'
                                  onChange={(event) => {
                                    onChangeText({ event, state, setState });
                                    dispatch(Breadcrumb_inputName(event.target.value))
                                  }}
                                />
                                {isError.LoginName.length > 0 && (
                                  <span className="text-danger f-8"><small>{isError.LoginName}</small></span>
                                )}
                              </FormGroup>
                            </Row>

                            {!(pageMode === mode.edit || pageMode === mode.view) &&
                              <Row>
                                <FormGroup className="mb-2 col col-sm-4 ">
                                  <Label htmlFor="validationCustom01">Password</Label>
                                  <Input name="password" id="password"
                                    type="password"
                                    placeholder="Please Enter Password"
                                    autoComplete="new-password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }} />
                                </FormGroup>
                              </Row>
                            }

                            {!(pageMode === mode.edit || pageMode === mode.view) &&
                              <Row>
                                <FormGroup className="mb-2 col col-sm-4 ">
                                  <Label htmlFor="validationCustom01">Confirm Password</Label>
                                  <Input
                                    name="Password" id="password"
                                    type="password"
                                    placeholder="Please Enter Password"
                                    autoComplete="new-password"
                                    className={cPasswordClass}
                                    value={cPassword}
                                    onChange={handleCPassword} />
                                  {showErrorMessage && isCPassword ? <div> Passwords did not match </div> : ''}
                                </FormGroup>
                              </Row>
                            }


                            <Row className="mt-2">
                              <FormGroup className="mb-1 col col-sm-12 " >
                                <Row className="justify-content-md-left">
                                  <Label htmlFor="horizontal-firstname-input" className=" col-sm-2 col-form-label" >{fieldLabel.isLoginUsingMobile}</Label>
                                  <Col md="1" style={{ marginTop: '9px' }} >
                                    <div className="form-check form-switch form-switch-md ml-4 " dir="ltr">
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isLoginUsingMobile}
                                        disabled={values.EmployeeName.EmployeeMobile === "" ? true : false}

                                        name="isLoginUsingMobile"
                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isLoginUsingMobile = event.target.checked
                                            return a
                                          })
                                        }}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>

                                  <Col md="2" >  </Col>
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >{fieldLabel.isActive} </Label>
                                  <Col md="1" style={{ marginTop: '9px' }} >
                                    <div className="form-check form-switch form-switch-md " dir="ltr">
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isActive}
                                        defaultChecked={true}
                                        name="isActive"

                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isActive = event.target.checked
                                            return a
                                          })
                                        }}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>

                            <Row >
                              <FormGroup className="col col-sm-12  " >
                                <Row className="justify-content-md-left">
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-2 col-form-label" >{fieldLabel.isLoginUsingEmail}</Label>
                                  <Col md={1} style={{ marginTop: '10px' }} >
                                    <div className="form-check form-switch form-switch-md" dir="ltr">
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isLoginUsingEmail}
                                        disabled={values.EmployeeName.EmployeeEmail === "" ? true : false}
                                        name="isLoginUsingEmail"
                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isLoginUsingEmail = event.target.checked
                                            return a
                                          })
                                        }}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>

                                  <Col md="2" >  </Col>
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >{fieldLabel.isSendOTP}</Label>
                                  <Col md={1} style={{ marginTop: '10px' }} >
                                    <div className="form-check form-switch form-switch-md" dir="ltr">
                                      <Input type="checkbox" className="form-check-input"
                                        checked={values.isSendOTP}
                                        name="isSendOTP"
                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.isSendOTP = event.target.checked
                                            return a
                                          })

                                        }}
                                      />
                                      <label className="form-check-label" htmlFor="customSwitchsizemd"></label>
                                    </div>
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Row>
                          </CardBody>
                        </Card>

                        {pageMode === mode.edit ? <Card className="text-black c_card_body" >
                          <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Change Password</h5>
                          </div>
                          <div className="modal-body row">
                            <div className=" col col-7 text-black">
                              <Label htmlFor="validationCustom01" className="me-2">Old Password</Label>
                              <FormGroup className="mb-2 col col-sm-9 d-flex align-items-center">
                                <Input
                                  // type={showPassword ? 'text' : 'password'}
                                  type="text"
                                  value={currentPwd}
                                  autoComplete="off"
                                  onChange={currentpwdOnchange}
                                  placeholder="Enter Old Password"
                                  className="me-2 flex-grow-1"
                                />
                                <button
                                  className="btn btn-outline-primary"
                                  style={{ borderColor: "#d4d4d4" }}
                                  type="button"
                                  onClick={toggleShowPassword}
                                >
                                  {showPassword ? <i className="mdi mdi-eye-off"></i> : <i className="mdi mdi-eye"></i>}
                                </button>
                              </FormGroup>

                              <FormGroup className="mb-3 col col-sm-9">
                                <Label> New Password </Label>
                                <Input
                                  value={values.changePassword}
                                  name="changePassword" id="changePassword"
                                  type="text"
                                  placeholder="Enter New Password"
                                  autoComplete='off'
                                  className="form-control"
                                  // onChange={newpwdOnchange}
                                  onChange={(event) => {
                                    onChangeText({ event, state, setState });
                                    newpwdOnchange(event)
                                  }}
                                />
                                {(values.changePassword !== "") && (
                                  <span className=" font-size-12" style={{ color: newPwdError.Color }}>{newPwdError.PasswordLevel}</span>
                                )}
                                {isError.changePassword.length > 0 && (
                                  <span className="text-danger font-size-17"><small>{isError.changePassword}</small></span>
                                )}
                              </FormGroup>
                              <FormGroup className="mb-3 col col-sm-9">
                                <Label> Confirm Password </Label>
                                <Input
                                  value={confirmPwd}
                                  type="text"
                                  placeholder="Enter Confirm Password"
                                  autoComplete="off"
                                  onChange={e => {
                                    confirmpwdOnchange(e);
                                  }}
                                />
                                {confirmPwd.length > 0 && (
                                  <span className={passwordsMatch ? "text-success font-size-12" : "text-danger font-size-12"}>
                                    {passwordsMatch ? "Passwords match!" : "Passwords do not match."}
                                  </span>
                                )}
                              </FormGroup>
                              <FormGroup className="mb-3 col col-sm-9">

                                {loading ? <button type="button" className="btn btn-primary  "

                                >
                                  <div className="dot-pulse"> <span> Change Password</span>     &nbsp;
                                    <div className="bounce1" style={{ background: "white" }}></div>
                                    <div className="bounce2" style={{ background: "white" }}></div>
                                    <div className="bounce3" style={{ background: "white" }}></div>
                                  </div>
                                </button>
                                  : <button type="button" className="btn btn-primary w-20"
                                    onClick={ChangePasswordHandler}
                                  >Change Password</button>}
                              </FormGroup>
                            </div>
                            {state.required.changePassword ? <div className="col col-1">
                              <span className="text-danger">
                                *Note
                              </span>
                            </div> : null}

                            {state.required.changePassword ? <div className="col col-3  font-size-14">
                              <span>
                                must be 8-16 char and include at least one A-Z letter,
                                one a-z letter, one 0-9, and one special character (@$!%*?&).
                              </span>
                            </div> : null}
                          </div>





                        </Card> : null}


                        < Card className="mt-n2">
                          <CardBody style={{ backgroundColor: "whitesmoke" }}>
                            <Row >
                              <PartyWiseRoleTable />
                              <Row>
                                <Col sm={2}>
                                  <div>
                                    <SaveButton
                                      pageMode={pageMode}
                                      loading={saveBtnloading}
                                      onClick={saveHandler}
                                      userAcc={userPageAccessState}
                                      editCreatedBy={editCreatedBy}
                                      module={"User"}
                                    />

                                  </div>
                                </Col>
                              </Row>
                            </Row>
                          </CardBody>
                        </Card>

                      </form>
                    </CardBody>

                  </Card>
                </Col>
              </Row>
            </div>
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
export default AddUser;

