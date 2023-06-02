import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"
import { Row, Col, Container, Button } from "reactstrap"

import { useSelector, useDispatch } from "react-redux"

import { Link, useHistory } from "react-router-dom"

import {  roleAceessAction } from "../../store/actions"
import logo from "../../assets/images/cbm_logo.png"

//Import config
import CarouselPage from "./CarouselPage"
import Select from "react-select";
import { loginCompanyID } from "../../components/Common/CommonFunction"
import { useLayoutEffect } from "react"

const SelectDivisionPage = props => {
  const dispatch = useDispatch()
  const history = useHistory();

  const [divisionDropdowSelect, setDivisionDropdowSelect] = useState([]);

  const { divisionDropdown_redux,userAccess } = useSelector(state => ({
    divisionDropdown_redux: state.Login.divisionDropdown,
    userAccess: state.Login.RoleAccessUpdateData,

  }));

 

  useLayoutEffect(() => {
   
    let dashboardFound = userAccess.find((i) => {
      return i.ModuleName === "Dashboard"
    })

    if ((divisionDropdown_redux.length === 1) && (userAccess.length > 1)) {

      if (dashboardFound) {
        history.push(`/${dashboardFound.ActualPagePath}`)
      }
      else {
        history.push("/Dashboard")
      }
    }
    else if ((divisionDropdown_redux.length > 1) && (userAccess.length > 1)) {
      if (dashboardFound) {
        history.push(`/${dashboardFound.ActualPagePath}`)
      }
      else {
        history.push("/division")

      }
    }


  }, [userAccess])




  const divisionDropdown_DropdownOption = divisionDropdown_redux.map((d, key) => ({
    value: key,
    label: d.PartyName,
  }));

  function goButtonHandller() {

    if (!(divisionDropdowSelect.value === undefined)) {
      divisionDropdown_redux.forEach(i => {
        if (i.Party_id === null) { i.Party_id = 0 }
      });
      let value = divisionDropdown_redux[divisionDropdowSelect.value]
      var employee = value.Employee_id;
      var party = value.Party_id

      localStorage.setItem("roleId", JSON.stringify(value))
      dispatch(roleAceessAction(party, employee, loginCompanyID()))
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
                    <div className="mb-4 md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <span className="logo-txt">FoodERP 2.0</span>
                      </Link>
                      <img src={logo} alt="" height="90" />
                    </div>

                    <div className="auth-content my-auto">
                      {/* <div className="mb-3">
                        <h5 className="text-danger" >Please Select Division...!</h5>
                      </div> */}

                      <div className="text-center">
                        <h5 className="mb-0">Welcome !</h5>
                        <p className="text-muted mt-2">Select Role to Continue FoodERP 2.0.</p>
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
                      <p className="mb-0">© {new Date().getFullYear()}.Developed by Attrib Solution</p>
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


