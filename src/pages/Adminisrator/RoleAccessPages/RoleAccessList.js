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
import { MetaTags } from "react-meta-tags";
// import { getRoles } from "../../../store/Administrator/UserRegistrationRedux/actions";
import { GetHpageListData, getH_Modules, getPageAccess_DropDown_API, getRoles } from "../../../store/actions";
import { fetchModelsList } from "../../../store/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import Table from 'react-bootstrap/Table'
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
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [Page_DropdownSelect, setPage_DropdownSelect] = useState('');


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PageAccess, ModuleData, HPagesListData, PartySaveSuccess, State, RoleAccessData, companyList, DivisionTypes, PartyTypes, Roles } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
        State: state.M_EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        companyList: state.Company.companyList,
        DivisionTypes: state.PartyMasterReducer.DivisionTypes,
        PartyTypes: state.PartyMasterReducer.PartyTypes,
        Roles: state.User_Registration_Reducer.Roles,
        ModuleData: state.Modules.modulesList,
        HPagesListData: state.H_Pages.HPagesListData,
        PageAccess: state.H_Pages.PageAccess,
        RoleAccessData: state.Login.RoleData,
    }));

    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getDivisionTypesID());
        dispatch(getRoles());
        dispatch(fetchModelsList())
        dispatch(GetHpageListData())
        dispatch(getPageAccess_DropDown_API());

    }, []);


    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    // useEffect(() => {
    //     // document.getElementById("txtName").focus();
    //     if (!(editDataGatingFromList === undefined)) {
    //         debugger
    //         setEditData(editDataGatingFromList);
    //         setIsEdit(true);

    //         dispatch(editPartyIDSuccess({ Status: false }))
    //         return
    //     }
    // }, [editDataGatingFromList])

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

    const Module_DropdownOption = ModuleData.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    // for module dropdown
    const Module_DropdownSelectHandller = (e) => {
        setModule_DropdownSelect(e);
    }

    // for Page dropdown
    const Page_DropdownOption = HPagesListData.map((d) => ({
        value: d.id,
        label: d.Name,
    }));


    const Page_DropdownSelectHandller = (e) => {
        setPage_DropdownSelect(e);
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


    // useEffect(()=>{

    //     let SearchRoleData_initial =[]

    //     RoleAccessData.map((i)=>{
    //         i.ModuleData.map((index)=>{
    //             SearchRoleData_initial.push(index)
    //         })
    //     })
    //     setSearchRoleData([...searchRoleData,SearchRoleData_initial])

    //    },[RoleAccessData])



    const [searchRoleData, setSearchRoleData] = useState([
        {
            text: "PageID",
            dataField: "ID",
            sort: true,
            hidden: true,
            formatter: (cellContent, TableListData) => <>{ }</>,
        },
        {
            text: "Module",
            dataField: "Name",
            sort: true,
            formatter: (cellContent, TableListData) => <>{ }</>,
        },
    ]
    )



    // var pageOptions = [
    //     {
    //         text: "PageID",
    //         dataField: "ID",
    //         sort: true,
    //         hidden: true,
    //         formatter: (cellContent, TableListData) => <>{TableListData.id}</>,
    //     },
    //     {
    //         text: "Module",
    //         dataField: "Name",
    //         sort: true,
    //         formatter: (cellContent, TableListData) => <>{TableListData.Name}</>,
    //     },
    //     {
    //         text: "Page",
    //         dataField: "Name",
    //         sort: true,
    //         formatter: (cellContent, TableListData) => <>{TableListData.Name}</>,
    //     },
    //     //dynamic


    // ]



    const [listData, setListData] = useState([])
    // const  RoleAccessData=demoRolleAcess


    useEffect(() => {

        let SearchRoleData_initial = []

        RoleAccessData.map((i) => {
            i.ModuleData.map((index) => {
                SearchRoleData_initial.push(index)
            })
        })
        setListData(SearchRoleData_initial)
    }, [RoleAccessData])

    useEffect(() => {
        let SearchRoleData_initial = searchRoleData

        PageAccess.map((i) => {
            SearchRoleData_initial.push({
                text: "name",
                dataField: "name",
                sort: true,
                hidden: true,
                formatter: (cellContent, TableListData) => <>{"name"}</>,
            })
        })
        setSearchRoleData(SearchRoleData_initial)
        console.log("SearchRoleData_initial", SearchRoleData_initial)
    }, [PageAccess])

    console.log("searchRoleData", searchRoleData)


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

                                <Col md="3" className="">
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


                                <Col md="2" className="mt- ">
                                    <Button>Go</Button>
                                </Col>
                            </Row>

                            <Row  >

                                <Col md="3" className="">
                                    <FormGroup className="mb- row mt-3 " >
                                        <Label className="col-sm-5 p-2">Module</Label>
                                        <Col md="7">

                                            <Select
                                                value={module_DropdownSelect}
                                                options={Module_DropdownOption}
                                                onChange={(e) => { Module_DropdownSelectHandller(e) }}
                                                classNamePrefix="select2-selection"
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col md="4">
                                    <FormGroup className="mb-2 row mt-3 " >
                                        <Label className="col-sm-4 p-2">Page</Label>
                                        <Col md="8">

                                            <Select
                                                value={Page_DropdownSelect}
                                                options={Page_DropdownOption}
                                                onChange={(e) => { Page_DropdownSelectHandller(e) }}
                                                classNamePrefix="select2-selection"
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col md="1"></Col>
                                <Col md="2" className="mt-2 ">
                                    <Button>Add Role</Button>
                                </Col>

                            </Row>
                        </CardHeader>

                        <CardBody>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive">

                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Name
                                                    </th>
                                                    <th>
                                                        Module Name
                                                    </th>
                                                    {
                                                        PageAccess.map((indexPage) => {
                                                            return <th>
                                                                {indexPage.Name}
                                                            </th>
                                                        })
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {
                                                        listData.map((indexdata) => {
                                                            return <td>
                                                                {indexdata.Name}
                                                            </td>
                                                        })
                                                    }
                                                </tr>
                                            </tbody>

                                        </Table>
                                    </div>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>

                </Container>
            </div>
        </React.Fragment >
    );
}
export default RoleAccessList
