import MetaTags from "react-meta-tags"
import React, { useState } from "react"
import { Row, Col, Container } from "reactstrap"
import { useSelector, useDispatch } from "react-redux"
import { Link, useHistory } from "react-router-dom"
import {
  divisionDropdownSelectAction,
  divisionDropdownSelectSuccess,
  RoleAccessUpdateSuccess,
  roleAceessActionSuccess
} from "../../store/actions"
import logo from "../../assets/images/cbm_logo.png"
import CarouselPage from "./CarouselPage"
import { useLayoutEffect } from "react"
import { Go_Button } from "../../components/Common/CommonButton"
import { C_Select } from "../../CustomValidateForm"
import { afterloginOneTimeAPI } from "../../components/Common/AfterLoginApiFunc"

const SelectDivisionPage = () => {
  const dispatch = useDispatch()
  const history = useHistory();

  const [divisionDropdowSelect, setDivisionDropdowSelect] = useState([]);

  const { divisionDropdown_redux, userAccess, loading, divisionOptionLoading } = useSelector(state => ({
    divisionDropdown_redux: state.Login.divisionDropdown,
    userAccess: state.Login.RoleAccessUpdateData,
    loading: state.Login.loading,
    divisionOptionLoading: state.Login.divisionOptionLoading
  }));

  useLayoutEffect(() => {
    if (divisionDropdown_redux.length === 0) {
      localStorage.removeItem("roleId");
      dispatch(roleAceessActionSuccess([]))
      dispatch(RoleAccessUpdateSuccess([]))
      dispatch(divisionDropdownSelectAction(localStorage.getItem("EmployeeID")))
    }
    return () => {
      dispatch(divisionDropdownSelectSuccess([]))
    }
  }, [])

  useLayoutEffect(() => {

    let dashboardFound = userAccess.find((i) => {
      return i.ModuleName === "Dashboard"
    })
    if ((divisionDropdown_redux.length > 1) && (userAccess.length > 1)) {
      localStorage.setItem("isMultipleDivision", true)
      if (dashboardFound) {
        history.push(`/${dashboardFound.ActualPagePath}`)
      }
      else {
        history.push("/Dashboard")
      }
    }
    else {
      localStorage.setItem("isMultipleDivision", false)
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
      let user = divisionDropdown_redux[divisionDropdowSelect.value];
      //api call roleAceessAction Api,partysetting Api , Party Dropdown Api and set localstorage roleId ;
      afterloginOneTimeAPI(user, dispatch);// all common function
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
                      <img src={logo} alt="" height="150" style={{height:"175px"}} />
                    </div>

                    <div className="auth-content my-auto">

                      <div className="text-center">
                        <h5 className="mb-0">Welcome !</h5>
                        <p className="text-muted mt-2">Select Role to Continue FoodERP 2.0.</p>
                      </div>

                      <div className="mb-3">
                        <C_Select
                          value={divisionDropdowSelect}
                          options={divisionDropdown_DropdownOption}
                          isLoading={divisionOptionLoading}
                          onChange={(e) => {
                            setDivisionDropdowSelect(e);
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <Go_Button
                          loading={loading}
                          onClick={() => { goButtonHandller() }}
                        />
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


