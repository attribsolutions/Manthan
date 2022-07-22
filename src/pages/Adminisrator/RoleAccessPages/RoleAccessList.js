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
import { GetHpageListData, getH_Modules, getPageAccess_DropDown_API, getRoles, PageMasterForRoleAccessLit, roleAceessAction } from "../../../store/actions";
import { fetchModelsList } from "../../../store/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory, useLocation, useParams } from "react-router-dom";

const RoleAccessList = (props) => {
    const history = useHistory()

    useEffect(() => {
        console.log("testvalue,testvalue,testvalue,", props)
        
        const userPageAccess = history.location.state

        console.log("acc", userPageAccess)

        if ((userPageAccess === undefined)) {
            
            history.push("/Dashboard")
        }
        else{
            if (!(userPageAccess.fromDashboardAccess)) {
                history.push("/Dashboard")
            }
        };
    }, [props])


    const formRef = useRef(null);
    const dispatch = useDispatch();

    //SetState  Edit data Geting From Modules List component
    const [EditData, setEditData] = useState([]);

    //'IsEdit'--if true then update data otherwise it will perfrom save operation
    const [IsEdit, setIsEdit] = useState(false);
    const [PageMode, setPageMode] = useState(false);

    //*** "isEditdata get all data from ModuleID for Binding  Form controls
    let editDataGatingFromList = props.state;

    const [companyList_dropdown_Select, setCompanyList_dropdown_Select] = useState("");
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [partyType_dropdown_Select, setPartyType_dropdown_Select] = useState("");
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState('');


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PageMasterListForRoleAccess, PageAccess, ModuleData, HPagesListData, PartySaveSuccess, State, RoleAccessData, companyList, DivisionTypes, PartyTypes, Roles } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
        companyList: state.Company.companyList,
        DivisionTypes: state.PartyMasterReducer.DivisionTypes,
        PartyTypes: state.PartyMasterReducer.PartyTypes,
        Roles: state.User_Registration_Reducer.Roles,
        ModuleData: state.Modules.modulesList,
        HPagesListData: state.H_Pages.HPagesListData,
        PageAccess: state.H_Pages.PageAccess,
        RoleAccessData: state.Login.RoleData,
        PageMasterListForRoleAccess: state.RoleAccessReducer.PageMasterListForRoleAccess,
    }));


    useEffect(() => {
        dispatch(fetchCompanyList());
        dispatch(getDivisionTypesID());
        dispatch(getRoles());
        dispatch(fetchModelsList())
        dispatch(GetHpageListData())
        dispatch(getPageAccess_DropDown_API());

        // dispatch(PageMasterForRoleAccessLit(1));
        // dispatch(roleAceessAction(1, 1, 1))

    }, []);

    useEffect(() => {

        var Array = []
        var eleList = {}

        let count1 = 0
        RoleAccessData.map((indexdata) => {   //1st map function start

            indexdata.ModuleData.map((indexmodul) => {   //2nd mapfunction start
                count1 = count1 + 1
                eleList["ModuleName"] = indexdata.ModuleName;
                eleList["ActualPagePath"] = indexmodul.ActualPagePath;
                eleList["ID"] = count1;

                // PageAccess.map((indexPage) => { eleList[`${indexPage.Name}`] = false})

                indexmodul.RolePageAccess.map((indexRolePageAccess) => {   //3 rd map function start
                    eleList[`${indexRolePageAccess.Name}`] = true

                    // if ((eleList.hasOwnProperty(indexRolePageAccess.Name))) { }
                })
                Array.push(eleList)
                eleList = {}
            })
        })
        setListData(Array)
    }, [RoleAccessData])

    useEffect(() => {

        var Array = []
        var eleList = {}
        let NewID = listData.length + 1
        let previousData = listData

        PageMasterListForRoleAccess.map((indexdata) => {   //1st mapfunction start

            indexdata.ModuleData.map((indexmodul) => {//second map function start
                eleList["ModuleName"] = indexdata.ModuleName;
                eleList["ActualPagePath"] = indexmodul.ActualPagePath;
                eleList["ID"] = NewID;

                indexmodul.RolePageAccess.map((indexRolePageAccess) => { //3 rd map function start
                    eleList[`${indexRolePageAccess.Name}`] = true
                    if ((eleList.hasOwnProperty(indexRolePageAccess.Name))) {
                    }
                })
                Array.push(eleList)
                eleList = {}
            })
        })
        previousData = previousData.concat(Array)
        setListData(previousData)
        // debugger
    }, [PageMasterListForRoleAccess])

    useEffect(() => {

        var NewColoumList = PageAccess.map((i) => {
            return ({
                text: i.Name,
                dataField: i.Name,
                sort: true,
                formatter: (cellContent, indx) => (
                    <>
                        {indx.hasOwnProperty(i.Name) === true ?
                            <>
                                <Input
                                    type="checkbox"
                                    name={i.Name}
                                    // onClick={() => {
                                    //   EditPageHandler(module.id);
                                    // }}
                                    defaultChecked={true}
                                />
                                <Label>{i.Name}</Label>
                            </>
                            :
                            <Input
                                type="checkbox"
                                disabled={true}
                            />
                        }
                    </>
                ),
            }
            )
        })
        RoleAccessListColoums = RoleAccessListColoums.concat(NewColoumList)
        setListData1(RoleAccessListColoums)
    }, [PageAccess])

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
    }, [PartySaveSuccess])

    let RoleAccessListColoums = [
        {
            text: "Id",
            dataField: "ID",
            sort: true,
            hidden: true
        }
        , {
            text: "Module Name",
            dataField: "ModuleName",
            sort: true,
        },
        {
            text: "PageName",
            dataField: "ActualPagePath",
            sort: true,
        }
    ]
    const companyListValues = companyList.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const DivisionTypesValues = DivisionTypes.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    const Role_DropdownOption = Roles.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));


    const Module_DropdownOption = ModuleData.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    // for Page dropdown
    const Page_DropdownOption = HPagesListData.map((d) => ({
        value: d.id,
        label: d.Name,
    }));


    function handllercompanyList(e) {
        setCompanyList_dropdown_Select(e)
    }

    /// Role dopdown
    function RoleDropDown_select_handler(e) {
        setRoleDropDown(e)
    };


    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
        dispatch(GetPartyTypeByDivisionTypeID(e.value))
    }

    // for module dropdown
    const Module_DropdownSelectHandller = (e) => {
        setModule_DropdownSelect(e);
    }

    const Page_DropdownSelectHandller = (e) => {
        setPage_DropdownSelect(e);
    }

    const GoButton_Handler = () => {
        var division = division_dropdown_Select.value
        var company = companyList_dropdown_Select.value
        var role = role_dropdown_Select
        dispatch(getRoles(division, company, role));
    }

    const AddPageButton_Handeler = () => {
        dispatch(PageMasterForRoleAccessLit(page_DropdownSelect.value));
    }

    //'Save' And 'Update' Button Handller
    const handleValidUpdate = (event, values) => {
        // debugger
        const requestOptions = {
            body: JSON.stringify({

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

    const [listData, setListData] = useState([])
    const [listData1, setListData1] = useState([])





    const pageOptions = {
        sizePerPage: 20,
        totalSize: listData.length, // replace later with size(users),
        custom: true,
    };

    const defaultSorted = [
        {
            dataField: "ID", // if dataField is not match to any column you defined, it will be ignored.
            order: "desc", // desc or asc
        },
    ];

    let myInlineStyle = {
        marginTop: "-10px",
    };


    //   const { from } = location.state
    // debugger

    return (
        <React.Fragment>
            <div className="page-content text-black" >
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
                                                value={role_dropdown_Select}
                                                options={Role_DropdownOption}
                                                onChange={(e) => { RoleDropDown_select_handler(e) }}
                                                classNamePrefix="select2-selection"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >


                                <Col md="2" className="mt- ">
                                    <Button
                                        onClick={() => { GoButton_Handler() }}>Go</Button>
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
                                                value={page_DropdownSelect}
                                                options={Page_DropdownOption}
                                                onChange={(e) => { Page_DropdownSelectHandller(e) }}
                                                classNamePrefix="select2-selection"
                                            />

                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col md="1"></Col>
                                <Col md="2" className="mt-2 ">
                                    <Button onClick={() => { AddPageButton_Handeler() }}>Add Page</Button>
                                </Col>

                            </Row>
                        </CardHeader> 

                        <CardBody>
                            {PageAccess.length > 0
                                ?
                                <PaginationProvider pagination={paginationFactory(listData)}>
                                    {({ paginationProps, paginationTableProps }) => (
                                        <ToolkitProvider
                                            keyField="id"
                                            data={listData}
                                            columns={listData1}
                                            search
                                        >
                                            {(toolkitProps) => (
                                                <React.Fragment>

                                                    <Row>
                                                        <Col xl="12">
                                                            <div className="table-responsive">
                                                                <BootstrapTable
                                                                    keyField={"id"}
                                                                    responsive
                                                                    bordered={false}
                                                                    striped={false}
                                                                    hover={true}
                                                                    defaultSorted={defaultSorted}
                                                                    // selectRow={selectRow}
                                                                    classes={"table  table-bordered"}
                                                                    {...toolkitProps.baseProps}
                                                                    {...paginationTableProps}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className="align-items-md-center mt-30">
                                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                            <PaginationListStandalone {...paginationProps} />
                                                        </Col>
                                                    </Row>
                                                </React.Fragment>
                                            )}
                                        </ToolkitProvider>
                                    )}
                                </PaginationProvider>
                                :
                                <></>
                            }

                        </CardBody>
                    </Card>

                </Container>
            </div>
        </React.Fragment >
    );
}
export default RoleAccessList
