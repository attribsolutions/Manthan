import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"

import { Row, Col, Alert, Container, Label, Button } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter, Link, useHistory } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"


/// tsdfddf Punam demotest
// actions
import { getUserDetailsAction, loginUser, roleAceessAction } from "../../store/actions"

// import images
import logo from "../../assets/images/logo-sm.svg"

//Import config
import CarouselPage from "./CarouselPage"
import Select from "react-select";

const SelectDivisionPage = props => {
  const dispatch = useDispatch()
  const history = useHistory();

  const [divisionDropdowSelect, setDivisionDropdowSelect] = useState([]);

  const { loginError, divisionDropdown } = useSelector(state => ({
    loginError: state.Login.loginError,
    divisionDropdown: state.Login.divisionDropdown,
  }))


  useEffect(() => {

    if (!(localStorage.getItem("userId"))) {
      history.push("/login")

    }
    else {
      dispatch(getUserDetailsAction(localStorage.getItem("userId")))
    }
  }, [])


  const divisionDropdown_DropdownOption = divisionDropdown.filter((d) => {
    return !(d.Role_id === null)
  }).map((d) => ({
    value: d.Role_id,
    label: d.RoleName,
  }));

  function goButtonHandller() {

    var role = divisionDropdowSelect.value;
    var division = 1;
    var company = 1;

    localStorage.setItem("roleId", (role))
    dispatch(roleAceessAction(role, division, company))
    history.push("/dashboard")

  }
  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | FoodERP Live</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height="28" /> <span className="logo-txt">FoodERP</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">Welcome !</h5>
                        <p className="text-muted mt-2">Select Role to Continue FoodERP.</p>
                      </div>


                      <div className="mb-3">
                        {/* <Label className="form-label font-size-13 "></Label> */}
                        <Select
                          value={divisionDropdowSelect}
                          options={divisionDropdown_DropdownOption}
                          autoComplete="off"
                          onChange={(e) => {
                            setDivisionDropdowSelect(e);
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <Button className="btn btn-success bg" onClick={() => {
                          goButtonHandller()
                        }}>GO</Button>
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()} Minia . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default SelectDivisionPage


