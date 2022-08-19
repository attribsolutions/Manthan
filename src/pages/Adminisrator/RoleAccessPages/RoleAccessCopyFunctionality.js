import React, { useEffect, useRef, useState, } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Card, CardHeader, Col, Container, FormGroup, Label, Row, Button } from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import { getDivisionTypesID, getPartyListAPI } from "../../../store/Administrator/PartyRedux/action";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbShow, getRoles, PostMethodForCopyRoleAccessForRoleAccess, PostMethod_ForCopyRoleAccessFor_Role_Success } from "../../../store/actions";


const RoleAccessCopyFunctionality = (props) => {

    const [role_Dropdown_Select, setRoleDropdown_Select] = useState("");
    const [copyRole_Dropdown_Select, setCopyRole_Dropdown_Select] = useState("");

    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [copyDivision_dropdown_Select, setCopyDivision_dropdown_Select] = useState("");

    // const [userPageAccessState, setUserPageAccessState] = useState('');
    // const [EditData, setEditData] = useState([]);
    // const [pageMode, setPageMode] = useState("save");

    const dispatch = useDispatch();

    

    //Access redux store Data 
    const { Roles_redux,
        DivisionTypes_redux,
         } = useSelector((state) => ({
            DivisionTypes_redux: state.PartyMasterReducer.partyList,
            Roles_redux: state.User_Registration_Reducer.Roles,
        }));


    useEffect(() => {
        dispatch(getRoles());
        dispatch(getPartyListAPI());

    }, []);


   

    const DivisionTypesValues = DivisionTypes_redux.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const Role_DropdownOption = Roles_redux.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));



    function RoleDropDown_onChangeHandler(e) {
        setRoleDropdown_Select(e)
    }

    function DivisionTypes_onChangeHandler(e) {
        setDivision_dropdown_Select(e)
    }
    function CopyDivisionTypes_onChangeHandler(e) {
        setCopyDivision_dropdown_Select(e)
    }
    function CopyRoleDropDown_onChangeHandler(e) {
        setCopyRole_Dropdown_Select(e)
    }
    function CopyButton_Handler() {
        const jsonBody = JSON.stringify(
            {
                Role: role_Dropdown_Select.value,
                Division: division_dropdown_Select.value,
                NewRole: copyRole_Dropdown_Select.value,
                NewDivision: copyDivision_dropdown_Select.value

            })
           
        dispatch(PostMethodForCopyRoleAccessForRoleAccess(jsonBody))
    }

    return (
        <React.Fragment>
            <div className="page-content text-black" >

                <Breadcrumb
                    title={"Count :"}
                    IsSearch={true}
                    // breadcrumbItem={"userPageAccessState.PageHeading"}
                    breadcrumbItem={"Copy Role Access"}
                />
                <MetaTags>
                    <title>Role Access| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Container fluid>

                    <Card className="text-black" >

                        {

                            <CardHeader className="card-header   text-black " style={{ backgroundColor: "#dddddd" }} >
                                <Row className="mt-3 px-5 py-5 text-center ">
                                    <Col md="4">

                                        <FormGroup className="mb-3 row ">
                                            <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                            <Col md="8" className="">
                                                <Select
                                                    value={role_Dropdown_Select}
                                                    options={Role_DropdownOption}
                                                    className="rounded-bottom"
                                                    onChange={(e) => { RoleDropDown_onChangeHandler(e) }}
                                                    classNamePrefix="select2-selection"

                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col md="4" className="">
                                        <FormGroup className="mb-3 row" >
                                            <Label className="col-sm-3 p-2" htmlFor="validationCustom01 ">Division</Label>
                                            <Col md="8">
                                                <Select
                                                    value={division_dropdown_Select}
                                                    className="rounded-bottom"
                                                    options={DivisionTypesValues}
                                                    onChange={(e) => { DivisionTypes_onChangeHandler(e) }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="px-5 py-4 text-center ">
                                    <Col md="4" className="">
                                        <FormGroup className="mb-3 row" >
                                            <Label className="col-sm-3 p-2">NewRole</Label>
                                            <Col md="8">
                                                <Select
                                                    value={copyRole_Dropdown_Select}
                                                    options={Role_DropdownOption}
                                                    className="rounded-bottom"
                                                    onChange={(e) => { CopyRoleDropDown_onChangeHandler(e) }}
                                                    classNamePrefix="select2-selection"

                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>



                                    <Col md="4" className="">
                                        <FormGroup className="mb-3 row" >
                                            <Label className="col-sm-4 p-2">NewDivision</Label>
                                            <Col md="8">
                                                <Select
                                                    vvalue={copyDivision_dropdown_Select}
                                                    className="rounded-bottom"
                                                    options={DivisionTypesValues}
                                                    onChange={(e) => { CopyDivisionTypes_onChangeHandler(e) }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>


                                    <Col md="10" className="mt-5 text-right">
                                        <Button type="button" color="primary" onClick={() => { CopyButton_Handler() }}>Copy</Button>
                                    </Col>

                                </Row>
                            </CardHeader>

                        }


                    </Card>

                </Container>
            </div>
        </React.Fragment >
    );


};
export default RoleAccessCopyFunctionality
