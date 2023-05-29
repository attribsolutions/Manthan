import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  Input,
  Row,
  FormGroup,
  Label,
  Col,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect, useDispatch, useSelector } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// users
import user1 from "../../../assets/images/users/avatar-1.jpg"
import { btnIsDissablefunc } from "../../Common/CommonFunction"
import { formValid, initialFiledFunc, onChangeText } from "../../Common/validationFunction"
import { ChangePassword } from "../../../store/auth/changepassword/action"


const ProfileMenu = props => {

  const dispatch = useDispatch();

  const fileds = {
    LoginName: "",
    password: "",
    newpassword: ""
  }

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)

  const [username, setusername] = useState("Admin")
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [state, setState] = useState(() => initialFiledFunc(fileds))




  const { user,postMsg } = useSelector((state) => ({
    user: state.Login.afterLoginUserDetails,
    // postMsg: state.ChangePasswordReducer.postMsg,

  }))


  const { values } = state


  useEffect(() => {

    if (localStorage.getItem("UserName")) {
      const obj = localStorage.getItem("UserName")
      setusername(obj)
    }


  }, [props.success, user])

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop)
    removeBodyCss()
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  const SaveHandler = async (event) => {
    debugger
    event.preventDefault();
    const btnId = event.target.id
    try {
      if (formValid(state, setState)) {
        btnIsDissablefunc({ btnId, state: true })

        const jsonBody = JSON.stringify({
          LoginName: values.LoginName,
          password: values.password,
          newpassword: values.newpassword,
        });

        // dispatch(ChangePassword({ jsonBody, btnId }));

      }
    } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
  };

  return (
    <React.Fragment>

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
        <div className="modal-body">

          <FormGroup className="mb-2 col col-sm-6 ">
            <Label htmlFor="validationCustom01"> Old Password </Label>
            <Input
              name="password"
              id="txtName"
              value={values.password}
              type="text"
              // className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
              autoComplete='off'
              autoFocus={true}
              onChange={(event) => {
                onChangeText({ event, state, setState })
              }}

              placeholder="Enter Old Password"
            />
          </FormGroup>
          <FormGroup className="mb-3 col col-sm-6">
            <Label htmlFor="validationCustom01"> New Password </Label>
            <Input
              name="newpassword"
              id="txtName1"
              value={values.newpassword}
              type="text"
              placeholder="Enter New Password"
              // className={isError.Name.length > 0 ? "is-invalid form-control" : "form-control"}
              autoComplete='off'
              autoFocus={true}
              onChange={(event) => {
                onChangeText({ event, state, setState })
              }}
            />
          </FormGroup>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={() => {
            setmodal_backdrop(false)
          }}>Close</button>
          <button type="button" className="btn btn-primary"
            onClick={SaveHandler}
          >Change Password</button>
        </div>
      </Modal>

      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item bg-soft-light border-start border-end"
          id="page-header-user-dropdown"
          tag="button"
        >
          {/* <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          /> */}
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">

          {/* <DropdownItem tag="a" href="/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}
          </DropdownItem>

          <DropdownItem tag="a" href="auth-lock-screen">
            <i className="bx bx-lock-open font-size-16 align-middle me-1" />
            {props.t("Lock screen")}
          </DropdownItem> */}

          <Link className="dropdown-item">
            <i className="bx bx-user font-size-16 align-middle me-1  text-primary" />
            <span>{props.t("Change Division")}</span>
          </Link>

          <div className="dropdown-divider" />

          <div style={{ cursor: "pointer" }} onClick={() => {
            tog_backdrop()
          }} className="dropdown-item">
            {/* <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" /> */}
            <span>{props.t("Change Password")}</span>
          </div >
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>

        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
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
