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

import { Breadcrumb_inputName } from "../../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { breadcrumbReturnFunc, loginCompanyID, loginSelectedPartyID, loginUserID, metaTagLabel } from "../../../../components/Common/CommonFunction";
import * as mode from "../../../../routes/PageMode"
import * as pageId from "../../../../routes/allPageID"
import { SaveButton } from "../../../../components/Common/CommonButton";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { comAddPageFieldFunc, formValid, initialFiledFunc, onChangeSelect, onChangeText } from "../../../../components/Common/validationFunction";
import { commonPageField, commonPageFieldSuccess } from "../../../../store/actions";
import * as url from "../../../../routes/route_url";
import { POSuserEditActionSuccess, POSuserUpdateAction, getPOSRole, savePOSUserMasterAction, savePOSUserMasterActionSuccess } from "../../../../store/SweetPOSStore/Administrator/UserMasterRedux/actions";
import { passwordRgx } from "../../../../CustomValidateForm";
import { GenralMasterSubType } from "../../../../helpers/backend_helper";

const POSUSER = (props) => {

  // const formRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory()

  const fileds = {
    id: "",
    Name: "",
    LoginName: '',
    Password: '',
    RoleName: '',
    POSRateType: '',
    IsActive: true,
  }

  const [state, setState] = useState(() => initialFiledFunc(fileds))


  //SetState  Edit data Geting From Modules List component
  const [modalCss, setModalCss] = useState(false);
  const [pageMode, setPageMode] = useState(mode.defaultsave);
  const [userPageAccessState, setUserAccState] = useState('');
  const [editCreatedBy, seteditCreatedBy] = useState("");


  // M_Roles DropDown


  const [isCPassword, setisCPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const [RateType, setRateType] = useState([]);


  const [confirmPwd, setConfirmPwd] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const [newPwdError, setNewPwdError] = useState({ PasswordLevel: "", Color: "" });




  const {
    postMsg,
    POSRole,
    userAccess,
    pageField,
    saveBtnloading,
  } = useSelector((state) => ({
    saveBtnloading: state.POS_User_Registration_Reducer.saveBtnloading,
    postMsg: state.POS_User_Registration_Reducer.postMsg,
    POSRole: state.POS_User_Registration_Reducer.POSRole,
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
    dispatch(commonPageField(pageId.POS_USER))
    dispatch(getPOSRole())
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };



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


  useEffect(async () => {
    const jsonBody = {
      Company: loginCompanyID(),
      TypeID: 173
    };
    const resp3 = await GenralMasterSubType(jsonBody)
    setRateType(resp3.Data)

  }, [])

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

        const { id, LoginName, Password, IsActive, DivisionID, CreatedBy, RoleName, RoleID } = hasEditVal
        const { values, hasValid, } = { ...state }

        values.id = id;
        values.LoginName = LoginName;
        values.Password = Password;
        values.IsActive = IsActive
        values.DivisionID = DivisionID;

        values.RoleName = {
          value: RoleID,
          label: RoleName
        };


        hasValid.id.valid = true;
        hasValid.LoginName.valid = true;
        hasValid.Password.valid = true;
        hasValid.RoleName.valid = true;

        hasValid.IsActive.valid = true;

        dispatch(Breadcrumb_inputName(LoginName))
        seteditCreatedBy(CreatedBy)
        dispatch(POSuserEditActionSuccess({ Status: false }))
      }
    }
    return () => {
      dispatch(Breadcrumb_inputName(""))
    }
  }, [])




  useEffect(async () => {

    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
      dispatch(savePOSUserMasterActionSuccess({ Status: false }))

      if (pageMode === mode.dropdownAdd) {
        customAlert({
          Type: 1,
          Message: postMsg.Message,
        })
        history.push({ pathname: url.POS_USER_lIST })
      }
      else {
        customAlert({
          Type: 1,
          Message: postMsg.Message,
        })
        history.push({ pathname: url.POS_USER_lIST })
      }
    }

    else if ((postMsg.Status === true)) {
      dispatch(savePOSUserMasterActionSuccess({ Status: false }))
      customAlert({
        Type: 4,
        Message: JSON.stringify(postMsg.Message),
      })
    }
  }, [postMsg.Status])



  const RolesValues = POSRole.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));


  const RateTypeValue = RateType.map((Data) => ({
    value: Data.id,
    label: Data.Name
  }));






  const saveHandler = (event) => {
    event.preventDefault();
    if (!passwordsMatch && !pageMode === mode.edit) {
      return
    }

    try {
      
      if (formValid(state, setState) && newPwdError.PasswordLevel !== "Weak password") {
        const jsonBody = JSON.stringify({
          CompanyID: loginCompanyID(),
          DivisionID: loginSelectedPartyID(),
          LoginName: values.LoginName,
          Password: values.Password,
          RoleID: values.RoleName.value,
          IsActive: values.IsActive,
          CreatedBy: loginUserID(),
          UpdatedBy: loginUserID(),
          IsLoginPermissions: true,
          POSRateType: values.POSRateType === "" ? "" : values.POSRateType.value

        })

        if (pageMode === mode.edit) {
          dispatch(POSuserUpdateAction({ jsonBody, updateId: values.id, }));
        }
        else {
          dispatch(savePOSUserMasterAction({ jsonBody }));
        }
      }
    } catch (error) { console.log(error) }
  }

  const newpwdOnchange = (e) => {


    let val = e.target.value

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (state.required.Password) {
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


    if (values.Password === val) {
      setConfirmPwd(val);
      setPasswordsMatch(true);
    } else {
      setConfirmPwd(val);
      setPasswordsMatch(false);
    }
  };



  if (!(userPageAccessState === '')) {
    return (
      <React.Fragment>
        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

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
                                <Label htmlFor="validationCustom01"> {fieldLabel.RoleName} </Label>
                                <Col sm={12}>
                                  <Select
                                    id="RoleName"
                                    name="RoleName"
                                    value={values.RoleName}
                                    options={RolesValues}
                                    onChange={(hasSelect, evn) => {
                                      onChangeSelect({ hasSelect, evn, state, setState, })
                                    }}
                                  />
                                  {isError.RoleName.length > 0 && (
                                    <span className="text-danger font-size-17"><small>{isError.RoleName}</small></span>
                                  )}
                                </Col>
                              </FormGroup>
                            </Row>

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
                            <Row>
                              <FormGroup className="mb-2 col col-sm-4 ">
                                <Label htmlFor="validationCustom01">{fieldLabel.LoginName}</Label>
                                <Input
                                  name="LoginName"
                                  id="txtName"
                                  type="text"
                                  placeholder="Please Enter Login Name"
                                  value={values.LoginName}
                                  autoComplete='new-password'

                                  onChange={(event) => {
                                    onChangeText({ event, state, setState });
                                    dispatch(Breadcrumb_inputName(event.target.value))
                                  }}
                                />
                                {isError.LoginName.length > 0 && (
                                  <span className="text-danger font-size-17"><small>{isError.LoginName}</small></span>
                                )}
                              </FormGroup>
                            </Row>



                            <Row>
                              <Col className="col col-xxl-4"   >
                                <FormGroup className="mb-2 col  " >
                                  <Label htmlFor="validationCustom01">{fieldLabel.Password}</Label>
                                  <Input
                                    name="Password"
                                    id="txtName"
                                    value={values.Password}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter New Password"
                                    autoComplete='new-password'
                                    className="form-control"
                                    onChange={(event) => {
                                      onChangeText({ event, state, setState });
                                      newpwdOnchange(event)
                                    }}

                                  />
                                  {(values.Password !== "") && (
                                    <span className=" font-size-12" style={{ color: newPwdError.Color }}>{newPwdError.PasswordLevel}</span>
                                  )}
                                  {isError.Password.length > 0 && (
                                    <span className="text-danger font-size-17"><small>{isError.Password}</small></span>
                                  )}
                                </FormGroup>

                              </Col>
                              <Col className="mt-2" >
                                <button
                                  className="btn btn-outline-primary mt-4"
                                  style={{ borderColor: "#d4d4d4" }}
                                  type="button"
                                  onClick={toggleShowPassword}
                                >
                                  {showPassword ? <i className="mdi mdi-eye-off"></i> : <i className="mdi mdi-eye"></i>}
                                </button>
                              </Col>
                              {state.required.Password ? <Col sm={4}>   <div className="col truioyh ">
                                <span className="text-danger">
                                  *Note
                                </span>
                              </div>
                                <div className="col-7  font-size-14">
                                  <span>
                                    Must be 8-16 char and include at least one A-Z letter,
                                    one a-z letter, one 0-9, and one special character (@$!%*?&).
                                  </span>
                                </div>  </Col> : null}

                            </Row>





                            {!(pageMode === mode.edit || pageMode === mode.view) &&
                              <Row>
                                <FormGroup className="mb-2 col col-sm-4 ">
                                  <Label htmlFor="validationCustom01">Confirm Password</Label>
                                  <Input
                                    value={confirmPwd}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter Confirm Password"


                                    onChange={e => {
                                      confirmpwdOnchange(e);
                                    }}
                                  />
                                  {confirmPwd.length > 0 && (
                                    <span className={passwordsMatch ? "text-success font-size-12" : "text-danger font-size-12"}>
                                      {passwordsMatch ? "Password match!" : "Password does not match."}
                                    </span>
                                  )}
                                </FormGroup>
                              </Row>
                            }



                            <Row className="mt-2">
                              <FormGroup className="mb-1 col col-sm-12 " >
                                <Row className="justify-content-md-left">
                                  <Label htmlFor="horizontal-firstname-input" className="col-sm-1 col-form-label " >{fieldLabel.IsActive} </Label>
                                  <Col md="1" >
                                    <div className="form-check form-switch form-switch-md " dir="ltr">
                                      <Input type="checkbox" className="form-check-input mt"
                                        checked={values.IsActive}
                                        defaultChecked={true}
                                        name="IsActive"
                                        onChange={(event) => {
                                          setState((i) => {
                                            const a = { ...i }
                                            a.values.IsActive = event.target.checked
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

                        < Card className="mt-n2">
                          <CardBody style={{ backgroundColor: "whitesmoke" }}>
                            <Row >
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
export default POSUSER;

