import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Modal,
  Input,
  FormGroup,
  Label,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect, useDispatch, useSelector } from "react-redux"
import { withRouter, Link, useHistory } from "react-router-dom"

// users
import { initialFiledFunc, resetFunction } from "../../Common/validationFunction"
import { ChangePassword, ChangePassword_Succes } from "../../../store/auth/changepassword/action"
import { customAlert } from "../../../CustomAlert/ConfirmDialog"
import { passwordRgx } from "../../../CustomValidateForm/index";
import { loginCompanyName, loginIsSCMCompany, loginUserDetails } from "../../Common/CommonFunction"

const ProfileMenu = props => {


  const dispatch = useDispatch();
  const history = useHistory();

  const fileds = {
    LoginName: "",
    password: "",
    newpassword: ""
  }

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)

  const [username, setusername] = useState("Admin")
  const [employeeName, setEmployeeName] = useState("Admin")
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [state, setState] = useState(() => initialFiledFunc(fileds))

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const [newPwdError, setNewPwdError] = useState("");

  const { user, postMsg, loading } = useSelector((state) => ({
    loading: state.ChangePasswordReducer.loading,
    user: state.Login.afterLoginUserDetails,
    postMsg: state.ChangePasswordReducer.postMsg,
  }))

  useEffect(() => {

    if (localStorage.getItem("EmployeeName")) {
      const employeeName = localStorage.getItem("EmployeeName")
      const userName = localStorage.getItem("UserName")
      setEmployeeName(employeeName)
      setusername(userName)
    }
  }, [props.success, user])

  useEffect(async () => {
    if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {

      dispatch(ChangePassword_Succes({ Status: false }))
      setState(() => resetFunction(fileds, state))// Clear form values  
      setmodal_backdrop(false)
      customAlert({
        Type: 1,
        Message: postMsg.Message,
      })

    } else if
      (postMsg.Status === true) {
      dispatch(ChangePassword_Succes({ Status: false }))
      customAlert({
        Type: 3,
        Message: JSON.stringify(postMsg.Message),
      })
    }
  }, [postMsg])

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop)
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  const currentpwdOnchange = (e) => {
    setCurrentPwd(e.target.value)
  }

  const newpwdOnchange = (e) => {

    let val = e.target.value
    const result = passwordRgx.test(val);
    if (!result) {
      setNewPwdError("Invalid password format.")
    }
    else {
      setNewPwdError("")

    }
    setNewPwd(e.target.value);
    setConfirmPwd('');
    setPasswordsMatch(false);
  }

  const confirmpwdOnchange = (e) => {

    let val = e.target.value;
    const result = passwordRgx.test(val);

    if (!result) {
      setNewPwdError("Invalid password format.");
    } else {
      setNewPwdError("");
    }

    if (newPwd === val) {
      setConfirmPwd(val);
      setPasswordsMatch(true);
    } else {
      setConfirmPwd(val);
      setPasswordsMatch(false);
    }
  };

  const onChangeDivisionHandler = () => {
    history.push({ pathname: "/division" })
  }

  const SaveHandler = async (event) => {

    event.preventDefault();

    if ((newPwd.length < 3) || (newPwd.length < 8)) {
      customAlert({
        Type: 3,
        Message: "Set NewPassoword",
      });
      return
    }
    else if (!passwordsMatch) {
      customAlert({
        Type: 3,
        Message: "Confirm does not match to NewPassword ",
      });
      return
    }

    const jsonBody = JSON.stringify({
      LoginName: username,
      password: currentPwd,
      newpassword: newPwd
    });

    const isConfirmed = await customAlert({
      Type: 7,
      Message: "Do you Want to Change Password ?",
    });

    if (isConfirmed) {
      dispatch(ChangePassword({ jsonBody }));

    };
  };
  // const handleMouseEnter = () => {
  //   
  //   document.getElementById('user-detail-div').style.display = 'block';
  // };

  // const handleMouseLeave = () => {
  //   document.getElementById('user-detail-div').style.display = 'none';
  // };

  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };
  let FooterDetails = loginUserDetails()
  let CompanyName = loginCompanyName()
  let IsSCMCompany = loginIsSCMCompany() === 1 ? "IsSCM" : "Non-SCM"
  return (
    <React.Fragment>
      <from>
        <Modal

          isOpen={modal_backdrop}
          toggle={() => {
            tog_backdrop()
          }}
          backdrop={'static'}
          id="staticBackdrop"
          className="modal-dialog-centered "
        >
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">Change Password</h5>
            <button type="button" className="btn-close"
              onClick={() => {
                setmodal_backdrop(false)
              }} aria-label="Close"></button>
          </div>
          <div className="modal-body row">


            <div className=" col col-7 text-black">
              <FormGroup className="mb-2 col col-sm-9 ">
                <Label htmlFor="validationCustom01"> Old Password </Label>
                <Input
                  // defaultValue={""}
                  type="password"
                  value={currentPwd}
                  autoComplete="off"
                  autoFocus={true}
                  onChange={currentpwdOnchange}
                  placeholder="Enter Old Password"
                />

              </FormGroup>

              <FormGroup className="mb-3 col col-sm-9">
                <Label> New Password </Label>
                <Input
                  value={newPwd}
                  type="text"
                  placeholder="Enter New Password"
                  autoComplete='off'
                  className="form-control"
                  // autoFocus={true}
                  onChange={newpwdOnchange}
                />
                {(newPwdError.length > 0) && (
                  <span className="text-danger font-size-12">{newPwdError}</span>
                )}
              </FormGroup>

              <FormGroup className="mb-3 col col-sm-9">
                <Label> Confirm Password </Label>
                <Input
                  value={confirmPwd}
                  type="text"
                  placeholder="Enter Confirm Password"
                  autoComplete="off"
                  // autoFocus={true}
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
            </div>
            <div className="col col-1">
              <span className="text-danger">
                *Note
              </span>
            </div>

            <div className="col col-3  font-size-14">
              <span>
                must be 8-16 char and include at least one A-Z letter,
                one a-z letter, one 0-9, and one special character (@$!%*?&).
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={() => {
              setmodal_backdrop(false)
            }}>Close</button>
            {loading ? <button type="button" className="btn btn-primary  "
              onClick={SaveHandler}
            >
              <div className="dot-pulse"> <span> Change Password</span>     &nbsp;
                <div className="bounce1" style={{ background: "white" }}></div>
                <div className="bounce2" style={{ background: "white" }}></div>
                <div className="bounce3" style={{ background: "white" }}></div>
              </div>
            </button>
              : <button type="button" className="btn btn-primary w-20"
                onClick={SaveHandler}
              >Change Password</button>}

          </div>
        </Modal>
        {/* <div
          id="user-detail-div"
          style={{ display: isMouseOver && !menu ? 'block' : 'none' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="dropdown-menu-dark dropdown-menu-end dropdown-menu show" style={{ padding: 'inherit' }}>
            <div className="dropdown-item"><label className="text-info">Party</label> : <span>{FooterDetails.PartyName}</span></div>
            <div className="dropdown-item"><label className="text-info">Role</label> : <span>{FooterDetails.RoleName}</span></div>
            <div className="dropdown-item"><label className="text-info">Company</label> : <span>{CompanyName}&nbsp;&nbsp;({IsSCMCompany})</span></div>
          </div>
        </div> */}


        <Dropdown
          isOpen={menu}
          toggle={() => setMenu(!menu)}
          className="d-inline-block"

        >
          <div
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
          >
            <DropdownToggle
              className="btn header-item bg-soft-light border-start border-end"
              id="page-header-user-dropdown"
              tag="button"

            >

              <span className=" d-xl-inline-block ms-2 me-1">{employeeName}</span>
              <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
            </DropdownToggle>
          </div>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem>
          <div className="text-left"><label className="text-info font-size-18">{FooterDetails.PartyName}</label> </div>
            <div className="mb-1"><span className=" text-muted">Role</span> : <span className="text-black">{FooterDetails.RoleName}</span></div>
            <div className=""><span>Company</span> : <span className="text-black">{CompanyName}&nbsp;&nbsp;({IsSCMCompany})</span></div>
            </DropdownItem>
            <DropdownItem divider />

            {localStorage.getItem("isMultipleDivision") && //If division  then only
              <DropdownItem>
                <span onClick={onChangeDivisionHandler} className="dropdown-item">
                  <i className="bx bx-user font-size-16 align-middle me-1  text-primary" />
                  <span>{props.t("Change Division")}</span>
                </span>
              </DropdownItem>}

            <DropdownItem style={{ cursor: "pointer" }} onClick={() => {
              tog_backdrop()
            }} className="dropdown-item">
              <i className="fas fa-lock" style={{ marginRight: "7px" }}></i>
              <span>{props.t("Change Password")}</span>
            </DropdownItem >


          
              <Link to="/logout" className="dropdown-item" >
                <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger fw-bold" />
                <span className="">{props.t("Logout")}</span>
              </Link>

         
          </DropdownMenu>
        </Dropdown>

      </from >
    </React.Fragment >
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)
