import React, { useEffect, useRef, useState } from "react";
import {
    Card,
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
    getPageAccess_DropDown_API,
    GO_Button_HandlerForRoleAccessListPage,
    GO_Button_HandlerForRoleAccessListPage_Success,
    PageDropdownForRoleAccessList,
    PageDropdownForRoleAccessList_Success,
    saveRoleAccessAddAction,
    saveRoleAccessAddActionSuccess,
} from "../../../store/actions";
import { getModuleList } from "../../../store/actions";
import { useHistory, } from "react-router-dom";
import "./table-fixed.scss"
import { breadcrumbReturnFunc, btnIsDissablefunc, loginUserID } from "../../../components/Common/CommonFunction";
import { getcompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { getRole } from "../../../store/Administrator/RoleMasterRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";
import * as url from "../../../routes/route_url"


const RoleAccessAdd = () => {

    const dispatch = useDispatch();
    const history = useHistory()
    const [userAccState, setUserAccState] = useState('');
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
            const { Division_id, DivisionName, Role_id, RoleName, Company_id, CompanyName,CreatedBy } = rowData;
            if (Role_id > 0) {
                setPageMode(btnmode)
                setEditCreatedBy(CreatedBy)
                dispatch(GO_Button_HandlerForRoleAccessListPage(Role_id, Division_id, Company_id));
                setShowTableOnUI(true)
                setRoleDropDown({ label: RoleName, value: Role_id })
                setCompany_dropdown_Select({ label: CompanyName, value: Company_id })
                setDivision_dropdown_Select({ label: DivisionName, value: Division_id })
            }
        }
    }, [])

    useEffect(() => {
        dispatch(GO_Button_HandlerForRoleAccessListPage_Success([]))
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
            const promise = await CustomAlert({ Type: 1, Message: postMsg.Message, })
            if (promise) {
                history.push({ pathname: url.ROLEACCESS_lIST })
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveRoleAccessAddActionSuccess({ Status: false }))
            CustomAlert({ Type: 4, Message: JSON.stringify(postMsg.Message), })
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
            dispatch(GO_Button_HandlerForRoleAccessListPage(role, division, company));
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
        debugger
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
                if (isMultipleInvoicePrint) roleAccessArray.push({ "PageAccess": 13 });


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
            dispatch(saveRoleAccessAddAction({ jsonBody, btnId }));

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

    if (!(userAccState === '')) {
        return (
            <React.Fragment>
                <div className="page-content text-black" style={{ minHeight: "600px" }} >
                    <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

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
                                                        userAcc={userAccState}
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
export default RoleAccessAdd
