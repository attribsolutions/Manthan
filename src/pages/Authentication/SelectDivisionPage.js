import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"
import { Row, Col, Container, Button } from "reactstrap"

import { useSelector, useDispatch } from "react-redux"

import { Link, useHistory } from "react-router-dom"

import { getUserDetailsAction, resetRoleAccessAction, roleAceessAction } from "../../store/actions"
import logo from "../../assets/images/foodERP_logo.png"

//Import config
import CarouselPage from "./CarouselPage"
import Select from "react-select";
import { loginCompanyID } from "../../components/Common/CommonFunction"

const SelectDivisionPage = props => {
  const dispatch = useDispatch()
  const history = useHistory();

  const [divisionDropdowSelect, setDivisionDropdowSelect] = useState([]);

  const { divisionDropdown_redux,  } = useSelector(state => ({
    loginError: state.Login.loginError,
    divisionDropdown_redux: state.Login.divisionDropdown,
  }));

  useEffect(() => {
    dispatch(resetRoleAccessAction())
    if (!(localStorage.getItem("userId"))) {
      history.push("/login")
    }
    else {
      dispatch(getUserDetailsAction(localStorage.getItem("userId")))
    }
  }, [])

  useEffect(() => {

    if (divisionDropdown_redux.length === 1) {

      let value = divisionDropdown_redux[0]
      let employee = value.Employee_id;
      let party = value.Party_id
      if ((party === null)) {
        party = 0;
        value.Party_id = 0
      }

      localStorage.setItem("roleId", JSON.stringify(value))
      dispatch(roleAceessAction(party, employee, loginCompanyID()))


      history.push("/Dashboard")
    }
  }, [divisionDropdown_redux])


  const divisionDropdown_DropdownOption = divisionDropdown_redux.map((d, key) => ({
    value: key,
    label: d.PartyName,
  }));

  function goButtonHandller() {

    if (!(divisionDropdowSelect.value === undefined)) {

      let value = divisionDropdown_redux[divisionDropdowSelect.value]
      var employee = value.Employee_id;
      var party = value.Party_id

      localStorage.setItem("roleId", JSON.stringify(value))
      dispatch(roleAceessAction(party, employee, loginCompanyID()))
      history.push("/Dashboard")
    }


  }
  return (
    <React.Fragment>
      <MetaTags>
        <title>Login | FoodERP 2.0</title>
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
                      {/* <div className="mb-3">
                        <h5 className="text-danger" >Please Select Division...!</h5>
                      </div> */}

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
                      <p className="mb-0">© {new Date().getFullYear()} FoodERP 2.0 . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
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


