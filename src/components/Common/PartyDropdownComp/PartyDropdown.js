import React, { useEffect, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import Select from "react-select";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { getEmployeelist } from "../../../store/Administrator/EmployeeRedux/action";
import { loginCompanyID, loginCompanyName } from "../CommonFunction";

const PartyDropdownMaster = (props) => {

    const dispatch = useDispatch();

    const { state, setState } = props

    const { values, fieldLabel } = state
    const [company, setCompany] = useState([])
    const { employeeList } = useSelector((state) => ({
        employeeList: state.EmployeesReducer.employeeList
    }));

    useEffect(() => {
        dispatch(getEmployeelist())
    }, []);

    const Party_DropdownOptions = employeeList.map((data) => ({
        value: data.Company_id,
        label: data.CompanyName
    }));

    return (
        <React.Fragment>
            <Row className="col-12">
                {/* <Col className="col-4" >
                    <Label htmlFor="validationCustom01 ">Company </Label>
                    <Select
                        id="Party "
                        name="Party"
                        value={company}
                        isSearchable={false}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={[{ value: 1, label:"dfsd" }]}
                        // onChange={(e) => {
                        //     setState((i) => {
                        //         const a = { ...i }
                        //         a.values.Party = e;
                        //         return a
                        //     })
                        // }}
                        onChange={(e) => { setCompany(e) }}
                    />
                </Col>
                <Col md={1}> </Col> */}
                <Col className="col-4">
                    <Label htmlFor="validationCustom01">{fieldLabel.Party} </Label>
                    <Select
                        id="Party "
                        name="Party"
                        value={values.Party}
                        isSearchable={false}
                        className="react-dropdown"
                        classNamePrefix="dropdown"
                        options={Party_DropdownOptions}
                        onChange={(e) => {
                            setState((i) => {
                                const a = { ...i }
                                a.values.Party = e;
                                return a
                            })
                        }}
                    /></Col>
            </Row>

        </React.Fragment >
    );
}

export default PartyDropdownMaster

