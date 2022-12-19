import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import { Card, CardBody, Col, Container, Row, Label, Input, CardHeader, FormGroup, Button, Table, } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CustomAlertRedux/actions";
import Select from "react-select";
import {
    getPartyListAPI,
    GetPartyTypeByDivisionTypeID,
} from "../../../store/Administrator/PartyRedux/action";
import { Tbody, Thead } from "react-super-responsive-table";
import { MetaTags } from "react-meta-tags";
// import { getRoles } from "../../../store/Administrator/UserRegistrationRedux/actions";
import {
    AddPageHandlerForRoleAccessListPage,
    getPageAccess_DropDown_API,
    getRoles,
    GO_Button_HandlerForRoleAccessListPage,
    GO_Button_HandlerForRoleAccessListPage_Success,
    PageDropdownForRoleAccessList,
    PageDropdownForRoleAccessList_Success,
    PostMethodForRoleAccessListPage,
    PostMethod_ForRoleAccessListPage_Success,
} from "../../../store/actions";
import { fetchModelsList } from "../../../store/actions";

import { useHistory, } from "react-router-dom";
import "./table-fixed.scss"
const RoleAccessAdd = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

    const [userPageAccessState, setUserPageAccessState] = useState('11');

    const [tableListData, setTableListData] = useState([])
    const [tableHederList, setTableHederList] = useState([])
    const [showTableOnUI, setShowTableOnUI] = useState(false)

    const [division_dropdown_Select, setDivision_dropdown_Select] = useState({ label: "Select...", value: 0 });
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState({ value: 0, label: "All Pages" });


    //Access redux store Data /  'save_ModuleSuccess' action data

    const {
        PageAccess,
        ModuleData,
        PageDropdownForRoleAccess,
        AddPage_PageMasterListForRoleAccess_Redux,
        GO_buttonPageMasterListForRoleAccess_Redux,
        PostMessage_ForRoleAccessList,
        Roles,
        PartyTypes,
        RoleAccessModifiedinSingleArray
    } = useSelector((state) => ({
        PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
        companyList: state.Company.companyList,
        PartyTypes: state.PartyMasterReducer.partyList,
        Roles: state.User_Registration_Reducer.Roles,
        ModuleData: state.Modules.modulesList,
        PageAccess: state.H_Pages.PageAccess,
        PageDropdownForRoleAccess: state.RoleAccessReducer.PageDropdownForRoleAccess,
        AddPage_PageMasterListForRoleAccess_Redux: state.RoleAccessReducer.AddPage_PageMasterListForRoleAccess,
        GO_buttonPageMasterListForRoleAccess_Redux: state.RoleAccessReducer.GO_buttonPageMasterListForRoleAccess,
        PostMessage_ForRoleAccessList: state.RoleAccessReducer.PostMessage_ForRoleAccessList,
        RoleAccessModifiedinSingleArray: state.Login.RoleAccessUpdateData,
    }));

    useEffect(() => {

        const editDataGatingFromList = history.location.state

        const locationPath = history.location.pathname
        let userAcc = RoleAccessModifiedinSingleArray.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (!(editDataGatingFromList === undefined)) {

            var divisionid = editDataGatingFromList.Division_id
            var roleid = editDataGatingFromList.Role_id
            var roleName = editDataGatingFromList.RoleName
            var divisionName = editDataGatingFromList.DivisionName

            if (roleid > 0) {
                dispatch(GO_Button_HandlerForRoleAccessListPage(roleid, divisionid));
                setShowTableOnUI(true)
                setRoleDropDown({ label: roleName, value: roleid })
                setDivision_dropdown_Select({ label: divisionName, value: divisionid })
            }
        }
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [RoleAccessModifiedinSingleArray])


    useEffect(() => {
        dispatch(GO_Button_HandlerForRoleAccessListPage_Success([]))
        dispatch(getPartyListAPI());//for division dropdown API
        dispatch(getRoles());//for Role  dropdown API
        dispatch(fetchModelsList())//for Modules  dropdown API
        dispatch(getPageAccess_DropDown_API());//for Page Access  API from pages saga file
        dispatch(PageDropdownForRoleAccessList_Success([]))// for clear page dropdown clear  list when first rendring

    }, []);

    useEffect(() => {
        var Array = []
        var eleList = {}

        let count1 = 0
        GO_buttonPageMasterListForRoleAccess_Redux.map((indexdata) => {

            count1 = count1 + 1

            eleList = indexdata;
            eleList["ID"] = count1;

            Array.push(eleList)
            eleList = {}

        })

        setTableListData(Array)

    }, [GO_buttonPageMasterListForRoleAccess_Redux])

    useEffect(() => {

        var Array = []
        var eleList = {}
        let NewID = tableListData.length + 1
        let previousData = tableListData

        let indexdata = AddPage_PageMasterListForRoleAccess_Redux[0]

        if (!(indexdata === undefined)) {
            eleList = indexdata
            eleList["ID"] = NewID;
            Array.push(eleList)
            // eleList = {}

            previousData = previousData.concat(Array)
            setTableListData(previousData)
        }

    }, [AddPage_PageMasterListForRoleAccess_Redux])

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

    useEffect(() => {
        if ((PostMessage_ForRoleAccessList.Status === true) && (PostMessage_ForRoleAccessList.StatusCode === 200)) {
            dispatch(PostMethod_ForRoleAccessListPage_Success({ Status: false }))
            // GoButton_Handler()
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: PostMessage_ForRoleAccessList.Message,
                AfterResponseAction: false
            }))
        }
        else if (PostMessage_ForRoleAccessList.Status === true) {
            dispatch(PostMethod_ForRoleAccessListPage_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(PostMessage_ForRoleAccessList.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [PostMessage_ForRoleAccessList])

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


    const DivisionTypesValues = PartyTypes.map((Data) => ({
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
    const Page_DropdownOption = PageDropdownForRoleAccess.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

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
        debugger
        var division = division_dropdown_Select.value
        var role = role_dropdown_Select.value
        if (division === undefined) {
            division = 0
        }
        if (role > 0) {
            dispatch(GO_Button_HandlerForRoleAccessListPage(role, division));
            setShowTableOnUI(true)
        }

    }

    const AddPageButton_Handeler = () => {

        let selectePageID = page_DropdownSelect.value

        if (selectePageID === 0) {
            var pageId = 0
            PageDropdownForRoleAccess.forEach((i) => {
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
    const saveHandeller = () => {

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

            let divisionID = division_dropdown_Select.value

            pageAccessElement["Role"] = role_dropdown_Select.value
            pageAccessElement["Company"] = ""
            pageAccessElement["Division"] = (divisionID === 0 ? "" : divisionID)
            pageAccessElement["Modules"] = moduleId
            pageAccessElement["Pages"] = pageId
            pageAccessElement["CreatedBy"] = 1
            pageAccessElement["UpdatedBy"] = 1
            pageAccessElement["RolePageAccess"] = roleAccessArray

            if (roleAccessArray.length > 0) {
                let pageAccessElement2 = {}
                selectedItemArray.push(pageAccessElement)
                if (relatedPageID > 0) {

                    pageAccessElement2["Role"] = role_dropdown_Select.value
                    pageAccessElement2["Company"] = ""
                    pageAccessElement2["Division"] = (divisionID === 0 ? "" : divisionID)
                    pageAccessElement2["Modules"] = moduleId
                    pageAccessElement2["Pages"] = relatedPageID
                    pageAccessElement2["CreatedBy"] = 1
                    pageAccessElement2["UpdatedBy"] = 1
                    pageAccessElement2["RolePageAccess"] = roleAccessArray2
                    selectedItemArray.push(pageAccessElement2)
                    pageAccessElement2 = {}
                }
            }
            // debugger
            roleAccessArray2 = []
            roleAccessArray = []
            pageAccessElement = {}
        }
        // debugger
        const jsonBody = JSON.stringify(selectedItemArray)

        dispatch(PostMethodForRoleAccessListPage(jsonBody));
        debugger
        // console.log("roleAccess Post data", jsonBody)

    };

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
                <div className="page-content text-black" >
                    <MetaTags>
                        <title>Role Access| FoodERP-React FrontEnd</title>
                    </MetaTags>
                    {/* <Breadcrumbs breadcrumbItem={"Role Access List"} /> */}
                    <Breadcrumb pageHeading={userPageAccessState.PageHeading} />

                    <Container fluid>
                        <Card className="text-black">
                            <CardHeader className="card-header   text-dark c_card_header"  >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <Card className="mt-n2">
                                <CardBody >

                                    {
                                        !showTableOnUI ?
                                            <>
                                                <CardHeader className="card-header   text-black  c_card_body"  >
                                                    <Row className="mt-3">
                                                        <Col md="4">

                                                            <FormGroup className="mb-3 row ">
                                                                <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                                                <Col md="9">
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

                                                        <Col md="4" className="">
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

                                                        <Col md="3" className="mt- ">
                                                            <Button type="button" color="primary" onClick={() => { GoButton_Handler() }}>Go</Button>
                                                        </Col>

                                                    </Row>
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
                                                <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >

                                                    <Row style={{ backgroundColor: "#f2f2f2" }} className='mb-3 mt-n1'>
                                                        <Col md="4" className="p-2 ">
                                                            <Label className="p-2 col-sm-3">Role</Label>
                                                            <Button type="button" color="btn btn-outline-warning" className="btn-sm" ><h className="text-black">{role_dropdown_Select.label}</h></Button>
                                                        </Col>

                                                        <Col md="4" className="p-2 ">
                                                            {(division_dropdown_Select.value > 0)
                                                                ? <> <Label className=" p-2 col-sm-3 ">Division</Label>
                                                                    <Button type="button" color="btn btn-outline-warning" className="btn-sm" >
                                                                        <h className="text-black">{division_dropdown_Select.label}</h></Button>
                                                                </>
                                                                : null}
                                                        </Col>
                                                        <Col md="4" className="p-2 text-end">
                                                            <Button type="button" color="btn btn-outline-secondary" className="btn-sm" onClick={() => { ChangeButtonHandeler() }}><h className="text-black">Change Role</h></Button>
                                                        </Col>

                                                    </Row>


                                                    <Row >
                                                        <Col className="">
                                                            <FormGroup className="mb-3  row">
                                                                <Label className="col-sm-3 p-2 ml-n5">Module</Label>
                                                                <Col md="7" style={{ zIndex: "3" }}>



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

                                                        <Col md="4">
                                                            <FormGroup className="mb-3 row ">
                                                                <Label className="col-sm-3 p-2 ml-n5">Page</Label>
                                                                <Col md="7" style={{ zIndex: "3" }}>

                                                                    <Select
                                                                        value={page_DropdownSelect}
                                                                        placeholder="select.."
                                                                        options={Page_DropdownOption}
                                                                        onChange={(e) => { Page_DropdownSelectHandller(e) }}
                                                                        // onChange={(e)=> {const selectAllOption = {label: 'select all', value: '*' }}}
                                                                        classNamePrefix="select2-selection"
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col >

                                                        <Col md="2" className=" ">
                                                            <Button type="button" color="btn btn-outline-success" className=""
                                                                onClick={() => { AddPageButton_Handeler() }}>
                                                                {page_DropdownSelect.value === 0 ? 'Add All Page' : "Add Page"}</Button>
                                                        </Col>


                                                        <Col md="2" className="text-end">
                                                            <Button type="button" color="primary" onClick={() => { saveHandeller() }}>Save</Button>
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
                                                                {/* <Table className="table-responsive table-bordered  table-fixed mt-2 "> */}
                                                                <Table className="table table-bordered table-responsive  mt-3">
                                                                    <thead>
                                                                        <tr style={{ zIndex: "2" }}>
                                                                            {tableHederList.map((indx) => {
                                                                                if (indx.text === "IsShowOnMenu") {
                                                                                    return (
                                                                                        <th colSpan={2} style={{
                                                                                            textAlign: "center",
                                                                                            verticalAlign: "middle",



                                                                                        }}>

                                                                                            {indx.text}
                                                                                            {/* change line css */}
                                                                                            <th style={{ width: "10%", height: "30px" }} scope="col">Add </th>

                                                                                            <th style={{ width: "10%", height: "30px" }} scope="col">List</th>


                                                                                        </th>
                                                                                    )
                                                                                }
                                                                                else if ((indx.text === "PageName")) {

                                                                                    return (
                                                                                        <th rowSpan={2}
                                                                                            style={{
                                                                                                textAlign: "center",
                                                                                                verticalAlign: "middle",

                                                                                            }}>
                                                                                            {indx.text}
                                                                                        </th>
                                                                                    )
                                                                                }
                                                                                else {
                                                                                    return <th rowSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }} >{indx.text}</th>
                                                                                }

                                                                            })}
                                                                        </tr>
                                                                        {/* <tr style={{position:"relative"}}> */}
                                                                        {/* <th scope="col">Add</th> */}
                                                                        {/* <th scope="col">List</th> */}
                                                                        {/* <th scope="col">Accepted</th> */}
                                                                        {/* </tr> */}
                                                                    </thead>

                                                                    <Tbody>

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
                                                                                    <td>
                                                                                        <div className="row">
                                                                                            <div className="text-left col">
                                                                                                {indx.PageName}
                                                                                            </div>

                                                                                            <div className="text-right col col-3">
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
                                                                                                    // <td className="text-center" >
                                                                                                    //     {indx[`PageAccess_${indexPage.Name}`] ?
                                                                                                    //         <Row>
                                                                                                    //             <Col md={6}>
                                                                                                    //                 <Input type={"checkbox"} id={indexPage.Name + key}
                                                                                                    //                     onChange={(e) => input_checkBoxHandler(indexPage.Name, key, e)}
                                                                                                    //                     defaultChecked={indx[`RoleAccess_${indexPage.Name}`] > 0 ? true : false} />
                                                                                                    //             </Col>

                                                                                                    //             <Col md={6}>
                                                                                                    //                 <Input type={"checkbox"} id={indexPage.Name + key}
                                                                                                    //                     onChange={(e) => input_checkBoxHandler(indexPage.Name, key, e)}
                                                                                                    //                     defaultChecked={indx[`RoleAccess_${indexPage.Name}`] > 0 ? true : false} />
                                                                                                    //             </Col>

                                                                                                    //         </Row>
                                                                                                    //         : <>
                                                                                                    //             <Input type={"hidden"} id={indexPage.Name + key} />
                                                                                                    //             <Input type={"hidden"} id={indexPage.Name + key} />
                                                                                                    //         </>
                                                                                                    //     }

                                                                                                    // </td>
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
                            </Card>
                        </Card>
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
{/* <td>
{indx.PageAccess_IsSave ?
    <input type={"checkbox"} id={'isSave' + key}
        defaultChecked={indx.RoleAccess_IsSave > 0 ? true : false} />

    : <input type={"hidden"} id={'isSave' + key} />
}
</td>
<td>
{indx.PageAccess_IsEdit ?
    <input type={"checkbox"} id={'isEdit' + key}
        defaultChecked={indx.RoleAccess_IsEdit > 0 ? true : false} />
    : <input type={"hidden"} id={'isEdit' + key} />
}
</td>
<td>
{indx.PageAccess_IsDelete ?
    <input type={"checkbox"}
        id={'isDelete' + key}
        defaultChecked={indx.RoleAccess_IsDelete > 0 ? true : false} />
    :
    <input type={"hidden"} id={'isDelete' + key} />
}
</td>
<td>
{indx.PageAccess_IsEditSelf ?
    <input type={"checkbox"}
        id={'isEditSelf' + key}
        defaultChecked={indx.RoleAccess_IsEditSelf > 0 ? true : false} />
    :
    <input type={"hidden"} id={'isEditSelf' + key} />
}

</td>
<td>
{indx.PageAccess_IsDeleteSelf ?
    <input type={"checkbox"}
        id={'isDeleteSelf' + key}
        defaultChecked={indx.RoleAccess_IsDeleteSelf > 0 ? true : false} />
    :
    <input type={"hidden"} id={'isDeleteSelf' + key} />
}
</td>
<td>
{indx.PageAccess_IsShow ?
    <input type={"checkbox"}
        id={'isShow' + key}
        defaultChecked={indx.RoleAccess_IsShow > 0 ? true : false} />
    :
    <input type={"hidden"} id={'isShow' + key} />
}
</td>
<td>
{indx.PageAccess_IsView ?
    <input type={"checkbox"}
        id={'isView' + key}
        defaultChecked={indx.RoleAccess_IsView > 0 ? true : false} />
    :
    <input type={"hidden"} id={'isView' + key} />}
</td>
<td>
{indx.PageAccess_IsTopOfTheDivision ?
    <input type={"checkbox"}
        id={'isTopOfDivision' + key}
        defaultChecked={indx.RoleAccess_IsTopOfTheDivision > 0 ? true : false} />
    :
    <input type={"hidden"} id={'isTopOfDivision' + key} />
}
</td> */}