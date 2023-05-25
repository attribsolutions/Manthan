import React, { useEffect, useState } from "react";
import {

    CardBody,
    Col,
    Container,
    Row,
    Label,
    Input,
    CardHeader,
    FormGroup,
    Button,
    Table,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CustomAlertRedux/actions";
import Select from "react-select";
import {
    getPartyListAPI,
} from "../../../store/Administrator/PartyRedux/action";
import { Tbody } from "react-super-responsive-table";
import { MetaTags } from "react-meta-tags";
import {
    AddPageHandlerForRoleAccessListPage,
    deleteRoleAcessMasterAction,
    getPageAccess_DropDown_API,
    GO_Button_RoleAccess_AddPage_Action,
    IscheckRoleAcessMasterAction,
    PageDropdownForRoleAccessList,
    PageDropdownForRoleAccessList_Success,
    saveRoleAccessAddAction,
    saveRoleAccessAddActionSuccess,
    setTableData_roleAccss_AddPageSuccess,
} from "../../../store/actions";
import { getModuleList } from "../../../store/actions";
import { useHistory, } from "react-router-dom";
import { breadcrumbReturnFunc, btnIsDissablefunc, loginUserID, metaTagLabel } from "../../../components/Common/CommonFunction";
import { getcompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { getRole } from "../../../store/Administrator/RoleMasterRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as url from "../../../routes/route_url"
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { deltBtnCss } from "../../../components/Common/ListActionsButtons";

const RoleAccessAdd1 = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const [userPageAccessState, setUserAccState] = useState('');
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [editCreatedBy, setEditCreatedBy] = useState('');
    const [tableListData, setTableListData] = useState([])
    const [tableHederList, setTableHederList] = useState([])
    const [showTableOnUI, setShowTableOnUI] = useState(false)
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState({ label: "Select...", value: 0 });
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState({ value: 0, label: "All Pages" });
    const [company_dropdown_Select, setCompany_dropdown_Select] = useState({ label: "Select...", value: 0 });

    //Access redux store Data /  'save_ModuleSuccess' action data

    const location = { ...history.location };

    const {
        PageAccess,
        ModuleData,
        PageDropdownRedux,
        addpageDropdownRedux,
        GoButtonRedux,
        postMsg,
        Roles,
        partyList,
        userAccess,
        company
    } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
        companyList: state.Company.companyList,
        partyList: state.PartyMasterReducer.partyList,
        Roles: state.RoleMaster_Reducer.roleList,
        ModuleData: state.Modules.modulesList,
        PageAccess: state.H_Pages.PageAccess,
        PageDropdownRedux: state.RoleAccessReducer.PageDropdownForRoleAccess,
        addpageDropdownRedux: state.RoleAccessReducer.AddPage_PageMasterListForRoleAccess,
        GoButtonRedux: state.RoleAccessReducer.GO_buttonPageMasterListForRoleAccess,
        postMsg: state.RoleAccessReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        company: state.Company.companyList,
    }));

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        });

        if (userAcc) {
            setUserAccState(userAcc);
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess]);

    useEffect(() => {
        const hasEditVal = history.location.state;
        if (!(hasEditVal === undefined)) {
            const { rowData = {}, btnmode } = hasEditVal
            const { Division_id, DivisionName, Role_id, RoleName, Company_id, CompanyName, CreatedBy } = rowData;
            if (Role_id > 0) {
                setPageMode(btnmode)
                setEditCreatedBy(CreatedBy)
                dispatch(GO_Button_RoleAccess_AddPage_Action(Role_id, Division_id, Company_id));
                setShowTableOnUI(true)
                setRoleDropDown({ label: RoleName, value: Role_id })
                setCompany_dropdown_Select({ label: CompanyName, value: Company_id })
                setDivision_dropdown_Select({ label: DivisionName, value: Division_id })
            }
        }
    }, [])

    useEffect(() => {
        // dispatch(GO_Button_RoleAccess_AddPage_Action_Success([]))
        dispatch(getPartyListAPI());//for division dropdown API
        dispatch(getRole());//for Role  dropdown API
        dispatch(getModuleList())//for Modules  dropdown API
        dispatch(getPageAccess_DropDown_API());//for Page Access  API from pages saga file
        dispatch(PageDropdownForRoleAccessList_Success([]))// for clear page dropdown clear  list when first rendring
        dispatch(getcompanyList());
    }, []);



    useEffect(() => {
        var Array = []
        var eleList = {}

        let count1 = 0
        GoButtonRedux.map((indexdata) => {
            count1 = count1 + 1

            eleList = indexdata;
            eleList["ID"] = count1;

            Array.push(eleList)
            eleList = {}
        })
        setTableListData(Array)
    }, [GoButtonRedux])

    useEffect(() => {

        var Array = []
        var eleList = {}
        let NewID = tableListData.length + 1
        let previousData = tableListData

        let indexdata = addpageDropdownRedux[0]

        if (!(indexdata === undefined)) {
            eleList = indexdata
            eleList["ID"] = NewID;
            Array.push(eleList)
            previousData = previousData.concat(Array)
            setTableListData(previousData)
        }

    }, [addpageDropdownRedux])

    useEffect(() => {
        var NewColoumList = PageAccess.map((i) => {
            return ({
                text: i.Name,
                dataField: i.Name,
            }
            )
        })
        RoleAccessListColoums = RoleAccessListColoums.concat(NewColoumList)
        setTableHederList(RoleAccessListColoums)
    }, [PageAccess])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveRoleAccessAddActionSuccess({ Status: false }))
            const promise = await customAlert({ Type: 1, Message: postMsg.Message, })
            if (promise) {
                history.push({ pathname: url.ROLEACCESS_lIST })
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveRoleAccessAddActionSuccess({ Status: false }))
            customAlert({ Type: 4, Message: JSON.stringify(postMsg.Message), })
        }
    }, [postMsg])

    let RoleAccessListColoums = [

        {
            text: "Module Name",
            dataField: "ModuleName",
        },
        {
            text: "PageName",
            dataField: "PageName",
        }
    ]

    const DivisionTypesValues = partyList.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const CompanyValues = company.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const Role_DropdownOption = Roles.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const Module_DropdownOption = ModuleData.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    useEffect(() => {
        if (company.length === 1) {
            setCompany_dropdown_Select({
                value: company[0].id,
                label: company[0].Name
            })
        }
    }, [company])

    // for Page dropdown
    const Page_DropdownOption = PageDropdownRedux.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    /// Role dopdown
    function RoleDropDown_select_handler(e) {
        setRoleDropDown(e)
    };

    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
        // dispatch(GetPartyTypeByDivisionTypeID(e.value))
    }
    // for module dropdown
    const Module_DropdownSelectHandller = (e) => {
        var module = e.value;
        var division = division_dropdown_Select.value
        setModule_DropdownSelect(e);
        setPage_DropdownSelect({ value: 0, label: "All Pages" })
        dispatch(PageDropdownForRoleAccessList(module, division));
    }

    const Page_DropdownSelectHandller = (e) => {
        setPage_DropdownSelect(e);
    }

    const GoButton_Handler = () => {

        var division = division_dropdown_Select.value
        var role = role_dropdown_Select.value
        var company = company_dropdown_Select.value
        if (division === undefined) {
            division = 0
        }
        if (role > 0) {
            dispatch(GO_Button_RoleAccess_AddPage_Action(role, division, company));
            setShowTableOnUI(true)
        }
        else if (role === undefined) {
            dispatch(
                AlertState({
                    Type: 4,
                    Status: true,
                    Message: "Please Select Role",
                })
            );

        }
    }

    const AddPageButton_Handeler = () => {

        let selectePageID = page_DropdownSelect.value

        if (selectePageID === 0) {
            var pageId = 0
            PageDropdownRedux.forEach((i) => {
                pageId = i.id
                let found = tableListData.find((inx) => { return inx.PageID === pageId })
                if ((found === undefined) && !(pageId === 0)) {
                    dispatch(AddPageHandlerForRoleAccessListPage(pageId));
                }
            })
        }
        else {

            let found = tableListData.find((inx) => { return inx.PageID === selectePageID })

            if ((found === undefined) && !(selectePageID === undefined)) {
                dispatch(AddPageHandlerForRoleAccessListPage(selectePageID));
            }
            else if (found) {
                dispatch(AlertState({
                    Type: 4, Status: true,
                    Message: "Page Alredy Exist",
                    RedirectPath: false,
                    PermissionAction: false,
                }));

            }
            else {
                dispatch(AlertState({
                    Type: 4, Status: true,
                    Message: "Page is Not Select",
                    RedirectPath: false,
                    PermissionAction: false,
                }));
            }
        }
    }

    const ChangeButtonHandeler = () => {
        setShowTableOnUI(false);
        setModule_DropdownSelect('')
        setPage_DropdownSelect('')
        setTableListData([])
    }

    const saveHandeller = (event) => {

        event.preventDefault();
        const btnId = event.target.id
        btnIsDissablefunc({ btnId, state: true })
        try {

            let selectedItemArray = [];
            let pageAccessElement = {}
            let roleAccessArray = []
            let roleAccessArray2 = []

            for (var i = 0; i < tableListData.length; i++) {

                var moduleName = document.getElementById("ModuleID" + i).value;
                var pageName = document.getElementById("PageID" + i).value;
                var relatedPage = document.getElementById("RelatedPageID" + i).value;
                var pageId = parseInt(pageName)
                var moduleId = parseInt(moduleName)
                var relatedPageID = parseInt(relatedPage)


                var addIsShowOnMenu = document.getElementById("addIsShowOnMenu" + i).checked;
                var listIsShowOnMenu = document.getElementById("listIsShowOnMenu" + i).checked;
                var isSave = document.getElementById("IsSave" + i).checked
                var isView = document.getElementById("IsView" + i).checked;
                var isEdit = document.getElementById("IsEdit" + i).checked;
                var isDelete = document.getElementById("IsDelete" + i).checked;
                var isEditSelf = document.getElementById("IsEditSelf" + i).checked;
                var isDeleteSelf = document.getElementById("IsDeleteSelf" + i).checked;
                var isPrint = document.getElementById("IsPrint" + i).checked;
                var isTopOfTheDivision = document.getElementById("IsTopOfTheDivision" + i).checked;
                var isPdfdownload = document.getElementById("Pdfdownload" + i).checked;
                var isExceldownload = document.getElementById("Exceldownload" + i).checked;
                var isCopy = document.getElementById("IsCopy" + i).checked;
                var isMultipleInvoicePrint = document.getElementById("IsMultipleInvoicePrint" + i).checked;



                if (listIsShowOnMenu) roleAccessArray.push({ "PageAccess": 1 });
                if (isSave) roleAccessArray.push({ "PageAccess": 2 });
                if (isView) roleAccessArray.push({ "PageAccess": 3 });
                if (isEdit) roleAccessArray.push({ "PageAccess": 4 });
                if (isDelete) roleAccessArray.push({ "PageAccess": 5 });
                if (isEditSelf) roleAccessArray.push({ "PageAccess": 6 });
                if (isDeleteSelf) roleAccessArray.push({ "PageAccess": 7 });
                if (isPrint) roleAccessArray.push({ "PageAccess": 8 });
                if (isTopOfTheDivision) roleAccessArray.push({ "PageAccess": 9 });
                if (isPdfdownload) roleAccessArray.push({ "PageAccess": 10 });
                if (isExceldownload) roleAccessArray.push({ "PageAccess": 11 });
                if (isCopy) roleAccessArray.push({ "PageAccess": 12 });
                if (isMultipleInvoicePrint) roleAccessArray.push({ "PageAccess": 13 });


                if (addIsShowOnMenu) roleAccessArray2.push({ "PageAccess": 1 });
                if (isSave) roleAccessArray2.push({ "PageAccess": 2 });
                if (isView) roleAccessArray2.push({ "PageAccess": 3 });
                if (isEdit) roleAccessArray2.push({ "PageAccess": 4 });
                if (isDelete) roleAccessArray2.push({ "PageAccess": 5 });
                if (isEditSelf) roleAccessArray2.push({ "PageAccess": 6 });
                if (isDeleteSelf) roleAccessArray2.push({ "PageAccess": 7 });
                if (isPrint) roleAccessArray2.push({ "PageAccess": 8 });
                if (isTopOfTheDivision) roleAccessArray2.push({ "PageAccess": 9 });
                if (isPdfdownload) roleAccessArray2.push({ "PageAccess": 10 });
                if (isExceldownload) roleAccessArray2.push({ "PageAccess": 11 });
                if (isCopy) roleAccessArray2.push({ "PageAccess": 12 });
                if (isMultipleInvoicePrint) roleAccessArray2.push({ "PageAccess": 13 });


                let divisionID = division_dropdown_Select.value

                pageAccessElement["Role"] = role_dropdown_Select.value
                pageAccessElement["Company"] = company_dropdown_Select.value
                pageAccessElement["Division"] = (divisionID === 0 ? "" : divisionID)
                pageAccessElement["Modules"] = moduleId
                pageAccessElement["Pages"] = pageId
                pageAccessElement["CreatedBy"] = loginUserID()
                pageAccessElement["UpdatedBy"] = loginUserID()
                pageAccessElement["RolePageAccess"] = roleAccessArray

                if (roleAccessArray.length > 0) {
                    let pageAccessElement2 = {}
                    selectedItemArray.push(pageAccessElement)
                    if (relatedPageID > 0) {

                        pageAccessElement2["Role"] = role_dropdown_Select.value
                        pageAccessElement2["Company"] = company_dropdown_Select.value
                        pageAccessElement2["Division"] = (divisionID === 0 ? "" : divisionID)
                        pageAccessElement2["Modules"] = moduleId
                        pageAccessElement2["Pages"] = relatedPageID
                        pageAccessElement2["CreatedBy"] = loginUserID()
                        pageAccessElement2["UpdatedBy"] = loginUserID()
                        pageAccessElement2["RolePageAccess"] = roleAccessArray2
                        selectedItemArray.push(pageAccessElement2)
                        pageAccessElement2 = {}
                    }
                }
                roleAccessArray2 = []
                roleAccessArray = []
                pageAccessElement = {}
            }
            const jsonBody = JSON.stringify(selectedItemArray)
            // dispatch(saveRoleAccessAddAction({ jsonBody, btnId }));

        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    }

    function DeleteRolePage_Handler(id) {
        const newList = tableListData.filter((index) => {
            return (!(index.ID === id))
        })
        setTableListData(newList)
    }

    function input_checkBoxHandler(e, v,) {

        if (e === "IsEdit") {

            let isEdit = document.getElementById(`IsEdit${v}`)
            let isView = document.getElementById(`IsView${v}`)
            let isEditSelf = document.getElementById(`IsEditSelf${v}`)
            if (isEdit.checked) {
                isView.checked = true;
                isEditSelf.checked = true;
                isView.disabled = true;
                isEditSelf.disabled = true;
            }
            else {
                isView.disabled = false;
                isEditSelf.disabled = false;
            }
            return
        }
        if (e === "IsEditSelf") {
            let isView = document.getElementById(`IsView${v}`)
            let isEditSelf = document.getElementById(`IsEditSelf${v}`)
            let isEdit = document.getElementById(`IsEdit${v}`)

            if ((isEdit.checked) && (e === "IsEditSelf")) {
                isEditSelf.checked = true;
                isEditSelf.disabled = true
            }
            else if (isEditSelf.checked) {
                isView.checked = true;
                isView.disabled = true;
            }
            else {
                isView.disabled = false;
            }
            return
        }
        if ((e === "IsView")) {
            let isEdit = document.getElementById(`IsEdit${v}`)
            if ((isEdit.checked)) {
                let isView = document.getElementById(`IsView${v}`)
                isView.checked = true;
                isView.disabled = true
            }

            return
        }

        if (e === "IsDelete") {
            let isDelete = document.getElementById(`IsDelete${v}`)
            let isDeleteSelf = document.getElementById(`IsDeleteSelf${v}`)
            if (isDelete.checked) {
                isDeleteSelf.checked = true;
                isDeleteSelf.disabled = true;
            }
            else {
                isDeleteSelf.disabled = false;
            }
            return
        }
        if ((e === "IsDeleteSelf")) {
            let isDelete = document.getElementById(`IsDelete${v}`)
            if ((isDelete.checked)) {
                let isDeleteSelf = document.getElementById(`IsDeleteSelf${v}`)
                isDeleteSelf.checked = true;
                isDeleteSelf.disabled = true
            }
            return
        }

        if (e === "addIsShowOnMenu") {
            let isShowOnMenu = document.getElementById(`addIsShowOnMenu${v}`)
            let save = document.getElementById(`IsSave${v}`)
            if (isShowOnMenu.checked) {
                save.checked = true;
                save.disabled = true;
            }
            else {
                save.disabled = false;
            }
            return
        }
        if ((e === "IsSave")) {
            let isShowOnMenu = document.getElementById(`addIsShowOnMenu${v}`)
            if ((isShowOnMenu.checked)) {
                let isSave = document.getElementById(`IsSave${v}`)
                isSave.checked = true;
                isSave.disabled = true
            }
            return
        }
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content text-black" style={{ minHeight: "600px" }} >
                    <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                    <Container fluid>
                        <CardBody >
                            {
                                !showTableOnUI ?
                                    <>
                                        <CardHeader className="card-header   text-black  c_card_body"  >
                                            <Row className="mt-3">
                                                <Col sm={3}>
                                                    <FormGroup className="mb-3 row ">
                                                        <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                                        <Col sm={9}>
                                                            <Select
                                                                value={role_dropdown_Select}
                                                                options={Role_DropdownOption}
                                                                className="rounded-bottom"
                                                                placeholder="Select..."
                                                                onChange={(e) => { RoleDropDown_select_handler(e) }}
                                                                classNamePrefix="select2-selection"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>

                                                <Col sm={4} className="">
                                                    <FormGroup className="mb-3 row" >
                                                        <Label className="col-sm-3 p-2">Division</Label>
                                                        <Col md="9">
                                                            <Select
                                                                value={division_dropdown_Select}
                                                                className="rounded-bottom"
                                                                placeholder="Select..."
                                                                options={DivisionTypesValues}
                                                                onChange={(e) => { handllerDivisionTypes(e) }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>

                                                <Col sm={4} className="">
                                                    <FormGroup className="mb-3 row" >
                                                        <Label className="col-sm-3 p-2">Company</Label>
                                                        <Col md="9">
                                                            <Select
                                                                value={company_dropdown_Select}
                                                                className="rounded-bottom"
                                                                placeholder="Select..."
                                                                options={CompanyValues}
                                                                onChange={(e) => { setCompany_dropdown_Select(e) }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={1}>
                                                    <div className="col col-2">
                                                        <Button type="button" color="primary" onClick={() => { GoButton_Handler() }}>Go</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div>
                                            </div>

                                        </CardHeader>

                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br><br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br><br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>

                                    </>
                                    :
                                    <>
                                        <Row style={{ backgroundColor: "#dddddd", }} className='mb-1 mt-n3 head '>
                                            <Row sm={12} >
                                                <Col sm={3} className="p-2 ">
                                                    <Label className="p-2 col-sm-3">Role</Label>
                                                    <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                                        <h className="text-black">{role_dropdown_Select.label}</h></Button>
                                                </Col>

                                                <Col sm={4} className="p-2 ">
                                                    {(division_dropdown_Select.value > 0)
                                                        ?
                                                        <> <Label className=" p-2 col-sm-3">Division</Label>
                                                            <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                                                <h className="text-black">{division_dropdown_Select.label}</h></Button>
                                                        </>
                                                        : null}
                                                </Col>

                                                <Col sm={4} className="p-2 ">
                                                    <Label className="p-2 col-sm-4">Company</Label>
                                                    <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                                        <h className="text-black">{company_dropdown_Select.label}</h></Button>
                                                </Col>
                                                <Col sm={1} className="p-2 mt-1">
                                                    <Button type="button"
                                                        color="btn btn-outline-secondary"
                                                        className="btn-sm"
                                                        onClick={() => { ChangeButtonHandeler() }}>
                                                        <h className="text-black">Change</h></Button>

                                                </Col>

                                            </Row>
                                        </Row>
                                        <CardHeader className="card-header headbody  text-black" style={{ backgroundColor: "rgb(231 231 231)" }} >
                                            <Row style={{ marginRight: "4px" }}>
                                                <Col sm={4}>
                                                    <FormGroup className="row">
                                                        <Label className="col-sm-3 p-2 ml-n5">Module</Label>
                                                        <Col sm={8} style={{ zIndex: "3" }}>
                                                            <Select
                                                                value={module_DropdownSelect}
                                                                placeholder="select.."
                                                                options={Module_DropdownOption}
                                                                onChange={(e) => { Module_DropdownSelectHandller(e) }}
                                                                classNamePrefix="select2-selection"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>

                                                <Col sm={4}>
                                                    <FormGroup className=" row ">
                                                        <Label className="col-sm-3 p-2">Page</Label>
                                                        <Col sm={8} style={{ zIndex: "3" }}>
                                                            <Select
                                                                value={page_DropdownSelect}
                                                                placeholder="select.."
                                                                options={Page_DropdownOption}
                                                                onChange={(e) => { Page_DropdownSelectHandller(e) }}
                                                                classNamePrefix="select2-selection"
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col >

                                                <Col sm={3} >
                                                    <Button type="button" color="btn btn-outline-success" className=""
                                                        onClick={() => { AddPageButton_Handeler() }}>
                                                        {page_DropdownSelect.value === 0 ? 'Add All Page' : "Add Page"}</Button>
                                                </Col>
                                                <Col sm={1} >
                                                    {/* <Button type="button" color="primary" onClick={() => { saveHandeller() }}>Save</Button> */}
                                                    <SaveButton
                                                        pageMode={pageMode}
                                                        userAcc={userPageAccessState}
                                                        module={"RoleAccess"}
                                                        onClick={saveHandeller}
                                                        editCreatedBy={editCreatedBy}
                                                    />
                                                </Col>
                                            </Row>
                                        </CardHeader>

                                        {tableListData.length > 0
                                            ?
                                            <>
                                                <div className="table-rep-plugin  mx-n4">
                                                    <div
                                                        className="custom_scroll_div"
                                                        data-pattern="priority-columns "
                                                    >
                                                        <Table className="table table-bordered thead mt-3">
                                                            <thead >
                                                                <tr className="colorhead" >
                                                                    {tableHederList.map((indx) => {
                                                                        if (indx.text === "IsShowOnMenu") {
                                                                            return (
                                                                                <th colSpan={2} style={{

                                                                                    textAlign: "center",
                                                                                    verticalAlign: "middle",
                                                                                }}>

                                                                                    {indx.text}
                                                                                    <th style={{ width: "10%", height: "30px" }} scope="col">Add </th>
                                                                                    <th style={{ width: "10%", height: "30px" }} scope="col">List</th>
                                                                                </th>
                                                                            )
                                                                        }
                                                                        else if ((indx.text === "PageName")) {

                                                                            return (
                                                                                <th className="thsticky colorhead index" rowSpan={2}
                                                                                    style={{

                                                                                        textAlign: "center",
                                                                                        verticalAlign: "middle",
                                                                                    }} >

                                                                                    {indx.text}
                                                                                </th>
                                                                            )
                                                                        }
                                                                        else {
                                                                            return <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle", }} >{indx.text}</th>
                                                                        }

                                                                    })}
                                                                </tr>
                                                            </thead>

                                                            <Tbody >

                                                                {tableListData.map((indx, key) => {
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                {indx.ModuleName}
                                                                                <Input
                                                                                    type="hidden"
                                                                                    id={"ModuleID" + key}
                                                                                    name={"ModuleID" + key}
                                                                                    value={indx.ModuleID}
                                                                                />
                                                                                <Input
                                                                                    type="hidden"
                                                                                    id={"ID" + key}
                                                                                    name={"ID" + key}
                                                                                    value={indx.ID}
                                                                                />
                                                                                <Input
                                                                                    type="hidden"
                                                                                    id={"RelatedPageID" + key}
                                                                                    value={indx.RelatedPageID}
                                                                                />
                                                                            </td>
                                                                            <td className="thsticky" >
                                                                                <div className="row ">
                                                                                    <div className="text-left col" >
                                                                                        {indx.PageName}
                                                                                    </div>

                                                                                    <div className="text-right col col-3" >
                                                                                        <Input

                                                                                            type="hidden"
                                                                                            id={"PageID" + key}
                                                                                            name={"PageID" + key}
                                                                                            value={indx.PageID}
                                                                                        />
                                                                                        <i className="mdi mdi-delete font-size-18 text-danger text-right" onClick={() => { DeleteRolePage_Handler(indx.ID) }}></i>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            {
                                                                                PageAccess.map((indexPage) => {
                                                                                    if (indexPage.Name === "IsShowOnMenu") {
                                                                                        return (
                                                                                            <>
                                                                                                <td className="text-center">
                                                                                                    {indx[`PageAccess_${indexPage.Name}`] ?
                                                                                                        <Input type={"checkbox"} id={`addIsShowOnMenu${key}`}
                                                                                                            onChange={(e) => input_checkBoxHandler(`addIsShowOnMenu`, key, e)}
                                                                                                            defaultChecked={indx[`RoleAccess_IsShowOnMenuForMaster`] > 0 ? true : false} />
                                                                                                        : <Input type={"hidden"} id={`addIsShowOnMenu${key}`} />
                                                                                                    }

                                                                                                </td>
                                                                                                <td className="text-center">
                                                                                                    {indx[`PageAccess_${indexPage.Name}`] ?
                                                                                                        <Input type={"checkbox"} id={`listIsShowOnMenu${key}`}
                                                                                                            onChange={(e) => input_checkBoxHandler(`listIsShowOnMenu`, key, e)}
                                                                                                            defaultChecked={indx[`RoleAccess_IsShowOnMenuForList`] > 0 ? true : false} />
                                                                                                        : <Input type={"hidden"} id={`listIsShowOnMenu${key}`} />
                                                                                                    }

                                                                                                </td>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                    else {
                                                                                        return (
                                                                                            <td className="text-center">
                                                                                                {indx[`PageAccess_${indexPage.Name}`] ?
                                                                                                    <Input type={"checkbox"} id={indexPage.Name + key}
                                                                                                        onChange={(e) => input_checkBoxHandler(indexPage.Name, key, e)}
                                                                                                        defaultChecked={indx[`RoleAccess_${indexPage.Name}`] > 0 ? true : false} />
                                                                                                    : <Input type={"hidden"} id={indexPage.Name + key} />
                                                                                                }

                                                                                            </td>
                                                                                        )
                                                                                    }
                                                                                })
                                                                            }
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </Tbody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </> :

                                            <>
                                                <br></br>
                                                <br></br>
                                                <br></br>
                                                <br></br>
                                                <br></br>
                                                <br></br>
                                                <br></br>
                                                <br></br>
                                            </>
                                        }

                                    </>
                            }

                        </CardBody>

                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};


const RoleAccessAdd = () => {
    const dispatch = useDispatch();
    const history = useHistory()

    const InitialCol = [
        {
            text: "Action",
            dataField: "",
            formatter: (cellContent, user) => {
                const btnId = `roleAccDelete-${user.id}`
                const config = { btnId, deleteId: user.id }
                return (
                    <div style={{ justifyContent: 'center' }} >
                        <Button className={deltBtnCss} id={btnId}> <i className="mdi mdi-delete font-size-18 text-danger text-right"
                            onClick={() => { DeleteRolePage_Handler({ ...config }) }}></i></Button>
                    </div>
                )
            },
            style: (cell, row) => {
                if (row) {
                    return {
                        position: "sticky",
                        left: "0",
                        backgroundColor: "white"
                    };
                }

            },
            headerStyle: {
                position: "sticky",
                left: "0",
                backgroundColor: "white",
                top: "0",
                zIndex: 2

            },

        },
        {
            text: "Module Name",
            dataField: "ModuleName",
            headerStyle: {
                position: "sticky",
                backgroundColor: "white",
                top: "0",

            },
        },
        {
            text: "PageName",
            dataField: "PageName",
            style: (cell, row, rowIndex, colIndex) => {
                if (colIndex) {
                    return {
                        position: "sticky",
                        left: "1.7cm",
                        backgroundColor: "white"

                    };
                }
            },
            headerStyle: {
                position: "sticky",
                left: "1.7cm",
                backgroundColor: "white",
                top: "0",
                zIndex: 2
            },
        }
    ]

    const [userPageAccessState, setUserAccState] = useState('');
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [editCreatedBy, setEditCreatedBy] = useState('');
    const [tableHederList, setTableHederList] = useState(InitialCol)
    const [showTableOnUI, setShowTableOnUI] = useState(false)
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState({ label: "Select...", value: 0 });
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState({ value: 0, label: "All Pages" });
    const [company_dropdown_Select, setCompany_dropdown_Select] = useState({ label: "Select...", value: 0 });

    //Access redux store Data /  'save_ModuleSuccess' action data
    const location = { ...history.location };

    const {
        PageAccess = [],
        ModuleData,
        PageDropdownRedux,
        postMsg,
        Roles,
        partyList,
        userAccess = [],
        company,
        tableDataRedux = []
    } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
        companyList: state.Company.companyList,
        partyList: state.PartyMasterReducer.partyList,
        Roles: state.RoleMaster_Reducer.roleList,
        ModuleData: state.Modules.modulesList,
        PageAccess: state.H_Pages.PageAccess,
        PageDropdownRedux: state.RoleAccessReducer.PageDropdownForRoleAccess,
        postMsg: state.RoleAccessReducer.postMsg,
        tableDataRedux: state.RoleAccessReducer.AddPageTableDataRedux,
        userAccess: state.Login.RoleAccessUpdateData,
        company: state.Company.companyList,

    }));


    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        });

        if (userAcc) {
            setUserAccState(userAcc);
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess]);

    useEffect(() => {
        const hasEditVal = history.location.state;
        if (!(hasEditVal === undefined)) {
            const { rowData = {}, btnmode } = hasEditVal
            const { Division_id, DivisionName, Role_id, RoleName, Company_id, CompanyName, CreatedBy } = rowData;
            if (Role_id > 0) {
                setPageMode(btnmode)
                setEditCreatedBy(CreatedBy)
                dispatch(GO_Button_RoleAccess_AddPage_Action(Role_id, Division_id, Company_id));
                setShowTableOnUI(true)
                setRoleDropDown({ label: RoleName, value: Role_id })
                setCompany_dropdown_Select({ label: CompanyName, value: Company_id })
                setDivision_dropdown_Select({ label: DivisionName, value: Division_id })
            }
        }
    }, [])

    useEffect(() => {
        dispatch(getPartyListAPI());//for division dropdown API
        dispatch(getRole());//for Role  dropdown API
        dispatch(getModuleList())//for Modules  dropdown API
        dispatch(getPageAccess_DropDown_API());//for Page Access  API from pages saga file
        dispatch(setTableData_roleAccss_AddPageSuccess([]))
        dispatch(PageDropdownForRoleAccessList_Success([]))// for clear page dropdown clear  list when first rendring
        dispatch(getcompanyList());
    }, []);


    useEffect(() => {

        const NewColoumList = []
        PageAccess.map((i) => {

            function columnFunc(text, checkShow, ischeck) {
                return {
                    text: text,
                    dataField: ischeck,
                    headerStyle: {
                        position: "sticky",
                        // left: "1.7cm",
                        backgroundColor: "white",
                        top: "0",
                        zIndex: 1
                    },

                    formatter: (cellContent, user) => {
                        if (!(user[checkShow] > 0)) return null
                        return (
                            <div style={{ justifyContent: 'center' }} >
                                <Col>
                                    <FormGroup className=" col col-sm-4 ">
                                        <Input
                                            id={`check-id-${ischeck}-${user.PageID}`}
                                            key={user.PageID}
                                            type="checkbox"
                                            defaultChecked={user[ischeck]}
                                            className="col col-sm text-end"
                                            onChange={(e) => {

                                                user[ischeck] = e.target.checked ? 1 : 0;
                                                document.getElementById(`check-id-${ischeck}-${user.PageID}`).checked = e.target.checked;
                                                // dispatch(IscheckRoleAcessMasterAction(user.id, ischeck, e.target.checked))
                                            }}
                                        />
                                    </FormGroup>
                                </Col>
                            </div>
                        )
                    }
                }
            }

            let checkShow = `PageAccess_${i.Name}`;
            if (i.Name === "IsShowOnMenu") {
                let textList = "ShowList";
                let textAdd = "ShowAdd";
                let ischeckList = "RoleAccess_IsShowOnMenuForList"
                let ischeckAdd = "RoleAccess_IsShowOnMenuForMaster";

                let colnObj2 = columnFunc(textList, checkShow, ischeckList);
                let colnObj1 = columnFunc(textAdd, checkShow, ischeckAdd);

                NewColoumList.push(colnObj1);
                NewColoumList.push(colnObj2);
            } else {
                let ischeckAdd = `RoleAccess_${i.Name}`;
                let colnObj3 = columnFunc(i.Name, checkShow, ischeckAdd)
                NewColoumList.push(colnObj3)
            }
        })
        const a = [...InitialCol, ...NewColoumList]
        setTableHederList(a)
    }, [PageAccess])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveRoleAccessAddActionSuccess({ Status: false }))
            const promise = await customAlert({ Type: 1, Message: postMsg.Message, })
            if (promise) {
                history.push({ pathname: url.ROLEACCESS_lIST })
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveRoleAccessAddActionSuccess({ Status: false }))
            customAlert({ Type: 4, Message: JSON.stringify(postMsg.Message), })
        }
    }, [postMsg])



    const DivisionTypesValues = partyList.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const CompanyValues = company.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const Role_DropdownOption = Roles.map((i) => ({
        value: i.id,
        label: i.Name
    }));

    const Module_DropdownOption = ModuleData.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    useEffect(() => {
        if (company.length === 1) {
            setCompany_dropdown_Select({
                value: company[0].id,
                label: company[0].Name
            })
        }
    }, [company])

    // for Page dropdown
    const Page_DropdownOption = PageDropdownRedux.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    /// Role dopdown
    function RoleDropDown_select_handler(e) {
        setRoleDropDown(e)
    };

    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
        // dispatch(GetPartyTypeByDivisionTypeID(e.value))
    }

    // for module dropdown
    const Module_DropdownSelectHandller = (e) => {
        var module = e.value;
        var division = division_dropdown_Select.value
        setModule_DropdownSelect(e);
        setPage_DropdownSelect({ value: 0, label: "All Pages" })
        dispatch(PageDropdownForRoleAccessList(module, division));
    }

    const Page_DropdownSelectHandller = (e) => {
        setPage_DropdownSelect(e);
    }

    const GoButton_Handler = () => {

        var division = division_dropdown_Select.value
        var role = role_dropdown_Select.value
        var company = company_dropdown_Select.value
        if (division === undefined) {
            division = 0
        }
        if (role > 0) {

            dispatch(GO_Button_RoleAccess_AddPage_Action(role, division, company));
            setShowTableOnUI(true)
        }
        else if (role === undefined) {
            customAlert({
                Type: 4,
                Message: "Please Select Role",
            })

        }
    }

    const AddPageButton_Handeler = () => {

        let selectePageID = page_DropdownSelect.value

        if (selectePageID === 0) {
            var pageId = 0
            PageDropdownRedux.forEach((i) => {
                pageId = i.id
                let found = tableDataRedux.find((inx) => { return inx.PageID === pageId })
                if ((found === undefined) && !(pageId === 0)) {
                    dispatch(AddPageHandlerForRoleAccessListPage(pageId));
                }
            })
        }
        else {

            let found = tableDataRedux.find((inx) => { return inx.PageID === selectePageID })

            if ((found === undefined) && !(selectePageID === undefined)) {
                dispatch(AddPageHandlerForRoleAccessListPage(selectePageID));
            }
            else if (found) {
                customAlert({
                    Type: 4,
                    Message: "Page Alredy Exist",
                })
            }
            else {
                customAlert({
                    Type: 4,
                    Message: "Please Select Page",
                })
            }
        }
    }

    function DeleteRolePage_Handler(config) {
        const { btnId } = config;
        btnIsDissablefunc({ btnId, state: false })
        dispatch(deleteRoleAcessMasterAction(config))
    }
    function ChangeButtonHandeler() {
        setShowTableOnUI(false);
        setModule_DropdownSelect('')
        setPage_DropdownSelect('')
        dispatch(setTableData_roleAccss_AddPageSuccess([]))
    }


    const pageOptions = {
        sizePerPage: tableDataRedux.length + 1,
        // totalSize: TableData.length,
        custom: true,
    };


    const saveHandeller = (event) => {
        event.preventDefault();
        const btnId = event.target.id
        // btnIsDissablefunc({ btnId, state: true })
        try {

            function ischeckboxCheck(i1) {
                let accArray = [];
                let isShowOnMenu_Id

                PageAccess.map((i2) => {

                    const roleCond = `RoleAccess_${i2.Name}`
                    const pageCond = `PageAccess_${i2.Name}`

                    if (((i2.Name === "IsShowOnMenu") && (i1[pageCond] > 0))) {
                        isShowOnMenu_Id = i2.id
                    }
                    else if (((i1[roleCond] > 0) && (i1[pageCond] > 0))) {
                        accArray.push({ "PageAccess": i2.id })
                    }
                })
                return { accArray, isShowOnMenu_Id }
            }

            const jsonArray = [];
            tableDataRedux.map((i1) => {

                let { accArray, isShowOnMenu_Id } = ischeckboxCheck(i1);
                let showList = i1.RoleAccess_IsShowOnMenuForList > 0
                let showAdd = i1.RoleAccess_IsShowOnMenuForMaster > 0
                let isAccess = accArray.length > 0;
                let isrelated = i1.RelatedPageID > 0;
                let divisionID = division_dropdown_Select.value

                const listRowOBJFunc = () => {
                    let showArray = [];
                    if (showList) showArray = [{ "PageAccess": isShowOnMenu_Id }]
                    return {
                        Role: role_dropdown_Select.value,
                        Company: company_dropdown_Select.value,
                        Division: divisionID === 0 ? '' : divisionID,
                        Modules: i1.ModuleID,
                        Pages: i1.PageID,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        RolePageAccess: [...showArray, ...accArray],
                    }
                };

                const addRowOBJFunc = () => {
                    let showArray = [];
                    if (showAdd) showArray = [{ "PageAccess": isShowOnMenu_Id }]
                    return {
                        Role: role_dropdown_Select.value,
                        Company: company_dropdown_Select.value,
                        Division: divisionID === 0 ? '' : divisionID,
                        Modules: i1.ModuleID,
                        Pages: i1.RelatedPageID,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        RolePageAccess: [...showArray, ...accArray],
                    }
                };

                if (isAccess || showList || showAdd) {
                    jsonArray.push(listRowOBJFunc());
                    if (isrelated) jsonArray.push(addRowOBJFunc());
                }
            })
            const jsonBody = JSON.stringify(jsonArray)

            dispatch(saveRoleAccessAddAction({ jsonBody, btnId }));

        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    }



    const RoleAccTable = () => {

        // return <CustomTable
        //     data={tableDataRedux}
        //     columns={tableHederList}
        // />
        return (
            <div className='sticky-div1'>

                <ToolkitProvider
                    keyField="id"
                    data={tableDataRedux}
                    columns={[...tableHederList]}
                    search
                >
                    {(toolkitProps) => (
                        <React.Fragment>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive" id="TableDiv" style={{ maxHeight:"52vh"}} >
                                        <BootstrapTable
                                            keyField={"id"}
                                            responsive
                                            bordered={false}
                                            striped={false}
                                            headerClasses="theader-class"
                                            classes={"table  table-bordered "}
                                            noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps,)}
                                    </div>
                                </Col>
                            </Row>

                        </React.Fragment>
                    )}
                </ToolkitProvider>

            </div>
        )

    }
    
    // var h = window.innerHeight;
    // document.getElementById("TableDiv").style.maxHeight = "200px auto";

    let IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };



    return <React.Fragment>
        <div className="page-content" style={{ maxHeight:"100vh"}} >
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <Container fluid>
                {
                    !showTableOnUI ?
                        <CardHeader className="card-header   text-black  c_card_body"  >
                            <Row className="mt-3">
                                <Col sm={3}>
                                    <FormGroup className="mb-3 row ">
                                        <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                        <Col sm={9}>
                                            <Select
                                                value={role_dropdown_Select}
                                                options={Role_DropdownOption}
                                                className="rounded-bottom"
                                                placeholder="Select..."
                                                onChange={(e) => { RoleDropDown_select_handler(e) }}
                                                classNamePrefix="select2-selection"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="">
                                    <FormGroup className="mb-3 row" >
                                        <Label className="col-sm-3 p-2">Division</Label>
                                        <Col md="9">
                                            <Select
                                                value={division_dropdown_Select}
                                                className="rounded-bottom"
                                                placeholder="Select..."
                                                options={DivisionTypesValues}
                                                onChange={(e) => { handllerDivisionTypes(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm={4} className="">
                                    <FormGroup className="mb-3 row" >
                                        <Label className="col-sm-3 p-2">Company</Label>
                                        <Col md="9">
                                            <Select
                                                value={company_dropdown_Select}
                                                className="rounded-bottom"
                                                placeholder="Select..."
                                                options={CompanyValues}
                                                onChange={(e) => { setCompany_dropdown_Select(e) }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col sm={1}>
                                    <div className="col col-2">
                                        <Button type="button" color="primary" onClick={() => { GoButton_Handler() }}>Go</Button>
                                    </div>
                                </Col>
                            </Row>
                            <div>
                            </div>

                        </CardHeader>

                        :
                        <div>
                            <Row style={{ backgroundColor: "#dddddd", borderRadius: "5px" }} className='mb-1 mt-n head '>
                                <Row sm={12} >
                                    <Col sm={3} className="p-2 ">
                                        <Label className="p-2 col-sm-3">Role</Label>
                                        <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                            <h className="text-black">{role_dropdown_Select.label}</h></Button>
                                    </Col>

                                    <Col sm={4} className="p-2 ">
                                        {(division_dropdown_Select.value > 0)
                                            ?
                                            <> <Label className=" p-2 col-sm-3">Division</Label>
                                                <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                                    <h className="text-black">{division_dropdown_Select.label}</h></Button>
                                            </>
                                            : null}
                                    </Col>

                                    <Col sm={4} className="p-2 ">
                                        <Label className="p-2 col-sm-4">Company</Label>
                                        <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                            <h className="text-black">{company_dropdown_Select.label}</h></Button>
                                    </Col>
                                    <Col sm={1} className="p-2 mt-1">
                                        <Button type="button"
                                            color="btn btn-outline-secondary"
                                            className="btn-sm"
                                            onClick={() => { ChangeButtonHandeler() }}>
                                            <h className="text-black">Change</h></Button>

                                    </Col>

                                </Row>
                            </Row>
                            <div className="card-header headbody  text-black"
                                style={{
                                    backgroundColor: "rgb(231 231 231)",
                                    marginLeft: "-8px",
                                    marginRight: "-8px",
                                    borderRadius: "5px"
                                }} >
                                <Row >
                                    <Col sm={4}>
                                        <FormGroup className="row">
                                            <Label className="col-sm-3 p-2 ml-n5">Module</Label>
                                            <Col sm={8} style={{ zIndex: "3" }}>
                                                <Select
                                                    value={module_DropdownSelect}
                                                    placeholder="select.."
                                                    options={Module_DropdownOption}
                                                    onChange={(e) => { Module_DropdownSelectHandller(e) }}
                                                    classNamePrefix="select2-selection"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm={4}>
                                        <FormGroup className=" row ">
                                            <Label className="col-sm-3 p-2">Page</Label>
                                            <Col sm={8} style={{ zIndex: "3" }}>
                                                <Select
                                                    value={page_DropdownSelect}
                                                    placeholder="select.."
                                                    options={Page_DropdownOption}
                                                    onChange={(e) => { Page_DropdownSelectHandller(e) }}
                                                    classNamePrefix="select2-selection"
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm={2} >
                                        <Button type="button" color="btn btn-outline-success" className=""
                                            onClick={() => { AddPageButton_Handeler() }}>
                                            {page_DropdownSelect.value === 0 ? 'Add All Page' : "Add Page"}</Button>
                                    </Col>
                                    <Col sm={1} >
                                        {/* <Button type="button" color="primary" onClick={() => { saveHandeller() }}>Save</Button> */}
                                        <SaveButton
                                            pageMode={pageMode}
                                            userAcc={userPageAccessState}
                                            module={"RoleAccess"}
                                            onClick={saveHandeller}
                                            editCreatedBy={editCreatedBy}
                                        />
                                    </Col>
                                </Row>

                            </div>

                        </div>
                }
                <div style={{
                    marginLeft: "-7px",
                    paddingTop: '4px'
                }}>
                    <RoleAccTable ></RoleAccTable>
                </div>

            </Container>



        </div>
    </React.Fragment>
}



export default RoleAccessAdd
