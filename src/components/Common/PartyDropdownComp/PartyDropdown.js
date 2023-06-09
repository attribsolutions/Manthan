import React, { useEffect, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, FormGroup, Label, Row } from "reactstrap";
import Select from "react-select";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { getEmployeelist } from "../../../store/Administrator/EmployeeRedux/action";
import { loginCompanyID, loginCompanyName, loginEmployeeID } from "../CommonFunction";
import { getPartyTableList } from "../../../store/Administrator/ManagementPartiesRedux/action";
import { Party_Dropdown_List } from "../../../store/CommonAPI/SupplierRedux/actions";

const PartyDropdownMaster = (props) => {

    const dispatch = useDispatch();

    const { state, setState } = props

    const { values, fieldLabel } = state
    const [company, setCompany] = useState([])
    const { partyList } = useSelector((state) => ({
        // partyList: state.CommonAPI_Reducer.partyList,
        partyList: state.PartyMasterReducer.partyList,
    }));

    useEffect(() => {
        // dispatch(Party_Dropdown_List(loginEmployeeID()))
        dispatch(getPartyListAPI())
    }, []);

    const PartyList_Options = partyList.map((data) => ({
        value: data.id,
        label: data.Name
    }));

    return (
        <React.Fragment>
            <Card className=" text-black "
                style={{ backgroundColor: "	#C8C8C8" }}>

                <div className=" text-black mt-2"  >

                    {/* <Row className="col-12"> */}
                    {/* <Col className="col-4" >
                    <Label htmlFor="validationCustom01 ">Company </Label>
                    <Select
                        id="Party "
                        name="Party"
                        value={company}
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

                    <div className="row ">
                        <Col sm="6">
                            <FormGroup className=" row" >
                                <Label className="col-sm-6 p-2"
                                    style={{ width: "83px", marginLeft: "20px" }}>{fieldLabel.Party}</Label>
                                <Col sm="7">
                                    <Select
                                        name="RoutesName"
                                        value={values.Party}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={PartyList_Options}
                                        onChange={(e) => {
                                            setState((i) => {
                                                const a = { ...i }
                                                a.values.Party = e;
                                                return a
                                            })
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </div>
                </div>

            </Card>
        </React.Fragment >
    );
}

export default PartyDropdownMaster

