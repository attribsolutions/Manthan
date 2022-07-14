import React, { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input, CardHeader, FormGroup, Button } from "reactstrap";
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import Select from "react-select";
import {
    editPartyIDSuccess, getDistrictOnState, getDistrictOnStateSuccess, getDivisionTypesID,
    GetPartyTypeByDivisionTypeID, postPartyData, postPartyDataSuccess, updatePartyID
} from "../../../store/Administrator/PartyRedux/action";
import { getState } from "../../../store/Administrator/M_EmployeeRedux/action";
import Flatpickr from "react-flatpickr"
import { fetchCompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { BreadcrumbShow } from "../../../store/Utilites/Breadcrumb/actions";
import { MetaTags } from "react-meta-tags";
import { getRoles } from "../../../store/Administrator/UserRegistrationRedux/actions";

const RoleAccessList = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();

    //SetState  Edit data Geting From Modules List component
    const [EditData, setEditData] = useState([]);

    //'IsEdit'--if true then update data otherwise it will perfrom save operation
    const [IsEdit, setIsEdit] = useState(false);
    const [PageMode, setPageMode] = useState(false);

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;
    const [state_DropDown_select, setState_DropDown_select] = useState("");
    const [FSSAIExipry_Date_Select, setFSSAIExipry_Date_Select] = useState("");
    const [district_dropdown_Select, setDistrict_dropdown_Select] = useState("");
    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");
    const [RoleDropDown, setRoleDropDown] = useState("");



    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PartySaveSuccess, State, DistrictOnState, companyList, DivisionTypes, PartyTypes, Roles } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
        State: state.M_EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        companyList: state.Company.companyList,
        DivisionTypes: state.PartyMasterReducer.DivisionTypes,
        PartyTypes: state.PartyMasterReducer.PartyTypes,
        Roles: state.User_Registration_Reducer.Roles

    }));

    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getDivisionTypesID());
        dispatch(getRoles());
    }, [dispatch]);


    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {
        // document.getElementById("txtName").focus();
        if (!(editDataGatingFromList === undefined)) {
            debugger
            setEditData(editDataGatingFromList);
            setIsEdit(true);

            dispatch(editPartyIDSuccess({ Status: false }))
            return
        }
    }, [editDataGatingFromList])



    const companyListValues = companyList.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllercompanyList(e) {
        setCompanyList_dropdown_Select(e)

    }

    /// Role dopdown
    function RoleDropDown_select_handler(e) {
        debugger
        setRoleDropDown(e)
    };

    const DivisionTypesValues = DivisionTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const RolesValues = Roles.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
        dispatch(GetPartyTypeByDivisionTypeID(e.value))
    }




    useEffect(() => {
        if ((PartySaveSuccess.Status === true) && (PartySaveSuccess.StatusCode === 200)) {
            dispatch(postPartyDataSuccess({ Status: false }))
            formRef.current.reset();
            if (PageMode === true) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PartySaveSuccess.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: PartySaveSuccess.Message,
                    RedirectPath: '/partyList',
                    AfterResponseAction: false
                }))
            }
        }
        else if (PartySaveSuccess.Status === true) {
            dispatch(postPartyDataSuccess({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PartySaveSuccess.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PartySaveSuccess.Status])

    //'Save' And 'Update' Button Handller
    const handleValidUpdate = (event, values) => {
        debugger
        const requestOptions = {
            body: JSON.stringify({
                Name: values.Name,
                PartyType: partyType_dropdown_Select.value,
                DivisionType: division_dropdown_Select.value,
                Company: companyList_dropdown_Select.value,
                PAN: values.PAN,
                CustomerDivision: values.CustomerDivision,
                Email: values.Email,
                Address: values.Address,
                PIN: values.PIN,
                MobileNo: values.MobileNo,
                State: state_DropDown_select.value,
                District: district_dropdown_Select.value,
                Taluka: 0,
                City: 0,
                CustomerDivision: 1,
                GSTIN: values.GSTIN,
                FSSAINo: values.FSSAINo,
                FSSAIExipry: FSSAIExipry_Date_Select,
                isActive: values.isActive,
                CreatedBy: 1,
                CreatedOn: "2022-06-24T11:16:53.165483Z",
                UpdatedBy: 1,
                UpdatedOn: "2022-06-24T11:16:53.330888Z"
            }),
        };

        if (IsEdit) {
            dispatch(updatePartyID(requestOptions.body, EditData.id));
        }
        else {
            dispatch(postPartyData(requestOptions.body));
        }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if (IsEdit === true) { IsEditMode_Css = "-3.5%" };

    return (
        <React.Fragment>
            <div className="page-content text-black" style={{ marginTop: IsEditMode_Css }}>
                <Breadcrumbs breadcrumbItem={"Role Access List"} />
                <MetaTags>
                    <title>Role Access| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Container fluid>

                    <Card className="text-black" >
                        <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
                            <Row style={{ backgroundColor: "#dddddd" }} >

                                <Col md="2" className="">
                                    <FormGroup className="mb-1 row  " >
                                        <Label className="col-sm-5 p-2">Division</Label>
                                        <Col md="7">
                                            <Select
                                                value={division_dropdown_Select}
                                                options={DivisionTypesValues}
                                                onChange={(e) => { handllerDivisionTypes(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col md="4">
                                    <FormGroup className="mb-1 row  " >
                                        <Label className="col-sm-4 p-2">Company</Label>
                                        <Col md="8">
                                            <Select
                                                value={companyList_dropdown_Select}
                                                options={companyListValues}
                                                onChange={(e) => { handllercompanyList(e) }}
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col md="3">

                                    <FormGroup className="mb-1 row " >
                                        <Label className="col-sm-4 p-2 ml-n4 ">Role</Label>
                                        <Col md="8">
                                            <Select
                                                value={RoleDropDown}
                                                options={RolesValues}
                                                onChange={(e) => { RoleDropDown_select_handler(e) }}
                                                classNamePrefix="select2-selection"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >



                                <Col md="1"></Col>

                                <Col md="2" className="mt-n1 ">
                                    <Button>Go</Button>
                                </Col>

                            </Row>

                            <Row style={{ backgroundColor: "#dddddd" }} >

                                <Col md="2" className="">
                                    <FormGroup className="mb- row mt-3 " >
                                        <Label className="col-sm-5 p-2">Module</Label>
                                        <Col md="7">



                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col md="4">
                                    <FormGroup className="mb-2 row mt-3 " >
                                        <Label className="col-sm-4 p-2">Page</Label>
                                        <Col md="8">



                                        </Col>
                                    </FormGroup>
                                </Col >


                                <Col md="1"></Col>

                                <Col md="2" className="mt-n1 ">
                                    <Button>Go</Button>
                                </Col>

                            </Row>
                        </CardHeader>

                        <CardBody>

                        </CardBody>
                    </Card>

                </Container>
            </div>
        </React.Fragment >
    );
}
export default RoleAccessList
