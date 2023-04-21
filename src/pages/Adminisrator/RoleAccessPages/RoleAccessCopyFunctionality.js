import React, { useEffect, useState, } from "react";
import { Card, CardHeader, Col, Container, FormGroup, Label, Row, Button } from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { useDispatch, useSelector } from "react-redux";
import {
    saveCopyRoleAccessAction,
} from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { getcompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { getRole } from "../../../store/Administrator/RoleMasterRedux/action";
import { btnIsDissablefunc } from "../../../components/Common/CommonFunction";

const RoleAccessCopyFunctionality = (props) => {

    const [copyRole_Dropdown_Select, setCopyRole_Dropdown_Select] = useState("");
    const [copyDivision_dropdown_Select, setCopyDivision_dropdown_Select] = useState("");
    const [newRoleDropdown_Select, setNewRoleDropdown_Select] = useState("");
    const [newDivision_dropdown_Select, setNewDivision_dropdown_Select] = useState(null);
    const [newcompany_dropdown_Select, setNewCompany_dropdown_Select] = useState("");
    const [company_dropdown_Select, setCompany_dropdown_Select] = useState("");


    // const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("edit");
    const dispatch = useDispatch();
    const history = useHistory()

    //Access redux store Data 
    const { Roles_redux,
        DivisionTypes_redux,
        company
    } = useSelector((state) => ({
        DivisionTypes_redux: state.PartyMasterReducer.partyList,
        Roles_redux: state.RoleMaster_Reducer.roleList,
        company: state.Company.companyList,
    }));

    useEffect(() => {
        dispatch(getRole());
        dispatch(getPartyListAPI());
        dispatch(getcompanyList());

    }, []);

    let editDataGatingFromList = props.state;

    // userAccess useEffect
    useEffect(() => {

        if (!(editDataGatingFromList === undefined)) {
            var C_props = editDataGatingFromList

            var divisionId = C_props.Division_id
            if (divisionId === null) {
                divisionId = 0
            }
            var roleId = C_props.Role_id
            var Company_id = C_props.Company_id

            if (roleId > 0) {

                setCopyRole_Dropdown_Select({ label: C_props.RoleName, value: roleId })
                setCopyDivision_dropdown_Select({ label: C_props.DivisionName, value: divisionId })
                setCompany_dropdown_Select({ label: C_props.CompanyName, value: Company_id })
                setNewCompany_dropdown_Select({ label: C_props.CompanyName, value: Company_id })

            }
        }

    }, [history]);

    useEffect(() => {
        if (company.length === 1) {
            setCompany_dropdown_Select({
                value: company[0].id,
                label: company[0].Name
            })
        }
    }, [company])

    const newDivisionTypesOption = DivisionTypes_redux.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const newRole_DropdownOption = Roles_redux.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const CompanyValues = company.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    function newRoleDropDown_onChangeHandler(e) {
        setNewRoleDropdown_Select(e)
    }

    function newDivisionTypes_onChangeHandler(e) {
        setNewDivision_dropdown_Select(e)
    }

    function CompanyDropDown_onChangeHandler(e) {
        setNewCompany_dropdown_Select(e)
    }


    function CopyButton_Handler(event) {
        event.preventDefault();
        const btnId = event.target.id
        btnIsDissablefunc({ btnId, state: true })
        try {
            const jsonBody = JSON.stringify(
                {
                    Role: copyRole_Dropdown_Select.value,
                    Division: copyDivision_dropdown_Select.value,
                    Company: company_dropdown_Select.value,
                    NewRole: newRoleDropdown_Select.value,
                    NewDivision: (newDivision_dropdown_Select) ? newDivision_dropdown_Select.value : 0,
                    NewCompany: newcompany_dropdown_Select.value
                })
            dispatch(saveCopyRoleAccessAction({ jsonBody, btnId }))

        } catch (error) { btnIsDissablefunc({ btnId, state: false }) }
    }

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    let IsEditMode_Css = ''
    if (pageMode === "edit" || pageMode === "other") { IsEditMode_Css = "-5.5%" };

    return (
        <React.Fragment>
            <div className="page-content" style={{ marginTop: IsEditMode_Css }}>
                <MetaTags>
                    <title>Role Access| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Container fluid>

                    <Card className="text-black" >
                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                            <Row style={{ backgroundColor: "#f2f2f2" }} className='mb-3 mt-n1'>
                                <Col md="4" className="p-2 ">
                                    <Label className="p-2 col-sm-3">Role</Label>
                                    <Button type="button" color="btn btn-outline-warning" className="btn-sm" ><h className="text-black">{copyRole_Dropdown_Select.label}</h></Button>
                                </Col>
                                {(copyDivision_dropdown_Select.value > 0)
                                    ?
                                    <Col md="4" className="p-2 ">
                                        <Label className=" p-2 col-sm-3 ">Division</Label>
                                        <Button type="button" color="btn btn-outline-warning" className="btn-sm" ><h className="text-black">{copyDivision_dropdown_Select.label}</h></Button>
                                    </Col>
                                    : null
                                }
                                <Col sm={4} className="p-2 ">
                                    <Label className="p-2 col-sm-4">Company</Label>
                                    <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                        <h className="text-black">{company_dropdown_Select.label}</h></Button>
                                </Col>
                                {/* <Col md="4" className="p-2 text-end">
                                                    <Button type="button" color="btn btn-outline-secondary" className="btn-sm" onClick={() => { ChangeButtonHandeler() }}><h className="text-black">Change Role</h></Button>
                                                </Col> */}

                            </Row>


                            <Row className="mt-3">
                                <Col md="4">

                                    <FormGroup className="mb-3 row ">
                                        <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                        <Col md="9">
                                            <Select
                                                value={newRoleDropdown_Select}
                                                options={newRole_DropdownOption}
                                                className="rounded-bottom"
                                                onChange={(e) => { newRoleDropDown_onChangeHandler(e) }}
                                                classNamePrefix="select2-selection"

                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col md="4" className="">
                                    <FormGroup className="mb-3 row" >
                                        <Label className="col-sm-3 p-2">Division</Label>
                                        <Col md="9">
                                            <Select
                                                value={newDivision_dropdown_Select}
                                                className="rounded-bottom"
                                                options={newDivisionTypesOption}
                                                onChange={(e) => { newDivisionTypes_onChangeHandler(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm={4} className="">
                                    <FormGroup className="mb-3 row" >
                                        <Label className="col-sm-3 p-2">Company</Label>
                                        <Col md="9">
                                            <Select
                                                value={newcompany_dropdown_Select}
                                                className="rounded-bottom"
                                                placeholder="Select..."
                                                options={CompanyValues}
                                                onChange={(e) => { CompanyDropDown_onChangeHandler(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col md="3" className="mt- ">
                                    <Button type="button" color="primary" id={"roleAccessCopy"} onClick={CopyButton_Handler}>Copy Role</Button>
                                </Col>

                            </Row>
                        </CardHeader>

                    </Card>

                </Container>
            </div>
        </React.Fragment >
    );


};
export default RoleAccessCopyFunctionality
