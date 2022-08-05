import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row, Label, Input, CardHeader, FormGroup, Button} from "reactstrap";
import { AvForm, AvGroup, AvField, AvInput } from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/Utilites/CostumeAlert/actions";
import Select from "react-select";
import {
    editPartyIDSuccess, getDistrictOnState, getDistrictOnStateSuccess, getDivisionTypesID,
    getPartyListAPI,
    GetPartyTypeByDivisionTypeID, postPartyData, postPartyDataSuccess, updatePartyID
} from "../../../store/Administrator/PartyRedux/action";

import { MetaTags } from "react-meta-tags";
// import { getRoles } from "../../../store/Administrator/UserRegistrationRedux/actions";
import { AddPageHandlerForRoleAccessListPage, GetHpageListData, getH_Modules, getPageAccess_DropDown_API, GetRoleListForRoleAccessListPage, getRoles, GO_Button_HandlerForRoleAccessListPage, GO_Button_HandlerForRoleAccessListPage_Success, PageDropdownForRoleAccessList, PageMasterForRoleAccessLit, PostMethodForRoleAccessListPage, PostMethod_ForRoleAccessListPage_Success, roleAceessAction } from "../../../store/actions";
import { fetchModelsList } from "../../../store/actions";

import { useHistory, useLocation, useParams } from "react-router-dom";
import { CommonGetRoleAccessFunction } from "../../../components/Common/CommonGetRoleAccessFunction";

const RoleAccessAdd = (props) => {

    const formRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory()

    const [EditData, setEditData] = useState([]);
    const [pageMode, setPageMode] = useState("save");
    const [userPageAccessState, setUserPageAccessState] = useState('');

    const [tableListData, setTableListData] = useState([])
    const [tableHederList, setTableHederList] = useState([])
    const [showTableOnUI, setShowTableOnUI] = useState(false)

    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState('');


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PageAccess, ModuleData, PageDropdownForRoleAccess,
        AddPage_PageMasterListForRoleAccess_Redux, GO_buttonPageMasterListForRoleAccess_Redux, PostMessage_ForRoleAccessList,
        DivisionTypes, Roles, PartyTypes } = useSelector((state) => ({
            PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
            companyList: state.Company.companyList,
            // DivisionTypes: state.PartyMasterReducer.DivisionTypes,
            PartyTypes: state.PartyMasterReducer.partyList,
            Roles: state.User_Registration_Reducer.Roles,
            ModuleData: state.Modules.modulesList,
            PageAccess: state.H_Pages.PageAccess,
            PageDropdownForRoleAccess: state.RoleAccessReducer.PageDropdownForRoleAccess,
            AddPage_PageMasterListForRoleAccess_Redux: state.RoleAccessReducer.AddPage_PageMasterListForRoleAccess,
            GO_buttonPageMasterListForRoleAccess_Redux: state.RoleAccessReducer.GO_buttonPageMasterListForRoleAccess,
            PostMessage_ForRoleAccessList: state.RoleAccessReducer.PostMessage_ForRoleAccessList,
        }));

    // userAccess useEffect
    useEffect(() => {
        const userAcc = CommonGetRoleAccessFunction(history)
        if (!(userAcc === undefined)) {
            setUserPageAccessState(userAcc)
        }
    }, [history])

    useEffect(() => {
        dispatch(GO_Button_HandlerForRoleAccessListPage_Success([]))
        // dispatch(fetchCompanyList());
        // dispatch(getDivisionTypesID());
        dispatch(getPartyListAPI());

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
        GO_buttonPageMasterListForRoleAccess_Redux.map((indexdata) => {

            count1 = count1 + 1

            eleList = indexdata;
            eleList["ID"] = count1;

            Array.push(eleList)
            eleList = {}

        })

        setTableListData(Array)
        // console.log("GO_buttonPageMasterListForRoleAccess", JSON.stringify(GO_buttonPageMasterListForRoleAccess_Redux))


    }, [GO_buttonPageMasterListForRoleAccess_Redux])

    useEffect(() => {

        var Array = []
        var eleList = {}
        let NewID = tableListData.length + 1
        let previousData = tableListData
        // debugger

        // AddPage_PageMasterListForRoleAccess.map((indexdata) => {
        let indexdata = AddPage_PageMasterListForRoleAccess_Redux[0]
        // let found =previousData.find((inx)=>{return inx.PageID===indexdata.PageID})
        if (!(indexdata === undefined)) {
            eleList = indexdata
            eleList["ID"] = NewID;
            Array.push(eleList)
            // eleList = {}

            previousData = previousData.concat(Array)
            setTableListData(previousData)
        }
        // console.log("AddPage_PageMasterListForRoleAccess", JSON.stringify(AddPage_PageMasterListForRoleAccess_Redux))

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
            dispatch(postPartyDataSuccess({ Status: false }))
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
    // console.log("PageDropdownForRoleAccess",PageDropdownForRoleAccess)



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
        dispatch(PageDropdownForRoleAccessList(e.value));

    }

    const Page_DropdownSelectHandller = (e) => {
        setPage_DropdownSelect(e);
    }

    const GoButton_Handler = () => {
        // debugger
        var division = division_dropdown_Select.value
        var role = role_dropdown_Select.value
        if (role > 0 && division > 0) {
            dispatch(GO_Button_HandlerForRoleAccessListPage(role, division));
            setShowTableOnUI(true)
        }
        else {
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: role > 0 ? "Please Select Division" : "Please Select Role",
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }

    const AddPageButton_Handeler = () => {
        let selectePageID = page_DropdownSelect.value
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
            // debugger
            var moduleName = document.getElementById("ModuleID" + i).value;
            var pageName = document.getElementById("PageID" + i).value;
            var relatedPage = document.getElementById("RelatedPageID" + i).value;
            var pageId = parseInt(pageName)
            var moduleId = parseInt(moduleName)
            var relatedPageID = parseInt(relatedPage)


            var isShowOnMenu = document.getElementById("IsShowOnMenu" + i).checked;
            var isSave = document.getElementById("IsSave" + i).checked
            var isView = document.getElementById("IsView" + i).checked;
            var isEdit = document.getElementById("IsEdit" + i).checked;
            var isDelete = document.getElementById("IsDelete" + i).checked;
            var isEditSelf = document.getElementById("IsEditSelf" + i).checked;
            var isDeleteSelf = document.getElementById("IsDeleteSelf" + i).checked;
            var isPrint = document.getElementById("IsPrint" + i).checked;
            var isTopOfTheDivision = document.getElementById("IsTopOfTheDivision" + i).checked;


            if (isShowOnMenu) { isSave = true }
            if (isEdit || isEditSelf) { isView = true }


            roleAccessArray.push({ "PageAccess": 1 });
            // if (isShowOnMenu) roleAccessArray.push({ "PageAccess": 1 });
            if (isSave) roleAccessArray.push({ "PageAccess": 2 });
            if (isView) roleAccessArray.push({ "PageAccess": 3 });
            if (isEdit) roleAccessArray.push({ "PageAccess": 4 });
            if (isDelete) roleAccessArray.push({ "PageAccess": 5 });
            if (isEditSelf) roleAccessArray.push({ "PageAccess": 6 });
            if (isDeleteSelf) roleAccessArray.push({ "PageAccess": 7 });
            if (isPrint) roleAccessArray.push({ "PageAccess": 8 });
            if (isTopOfTheDivision) roleAccessArray.push({ "PageAccess": 9 });

            if (isShowOnMenu) roleAccessArray2.push({ "PageAccess": 1 });
            if (isSave) roleAccessArray2.push({ "PageAccess": 2 });
            if (isView) roleAccessArray2.push({ "PageAccess": 3 });
            if (isEdit) roleAccessArray2.push({ "PageAccess": 4 });
            if (isDelete) roleAccessArray2.push({ "PageAccess": 5 });
            if (isEditSelf) roleAccessArray2.push({ "PageAccess": 6 });
            if (isDeleteSelf) roleAccessArray2.push({ "PageAccess": 7 });
            if (isPrint) roleAccessArray2.push({ "PageAccess": 8 });
            if (isTopOfTheDivision) roleAccessArray2.push({ "PageAccess": 9 });
            // roleAccessArray.push(roleAccessElement)

            pageAccessElement["Role"] = role_dropdown_Select.value
            pageAccessElement["Company"] = 1
            pageAccessElement["Division"] = division_dropdown_Select.value
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
                    pageAccessElement2["Company"] = 1
                    pageAccessElement2["Division"] = division_dropdown_Select.value
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
        // debugger
        // console.log("roleAccess Post data", jsonBody)

    };

    function DeleteRolePage_Handler(id) {
        const newList = tableListData.filter((index) => {
            return (!(index.ID === id))
        })
        setTableListData(newList)
    }
    if (!(userPageAccessState === '')) {
    return (
        <React.Fragment>
            <div className="page-content text-black" >
                {/* <Breadcrumbs breadcrumbItem={"Role Access List"} /> */}
                <Breadcrumb
                    title={"Count :"}
                    IsSearch={true}
                    breadcrumbItem={userPageAccessState.PageHeading}
                />
                <MetaTags>
                    <title>Role Access| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Container fluid>

                    <Card className="text-black" >

                        {
                            !showTableOnUI ?
                                <>
                                    <CardHeader className="card-header   text-black " style={{ backgroundColor: "#dddddd" }} >
                                        <Row className="mt-3">
                                            <Col md="4">

                                                <FormGroup className="mb-3 row ">
                                                    <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                                    <Col md="9">
                                                        <Select
                                                            value={role_dropdown_Select}
                                                            options={Role_DropdownOption}
                                                            className="rounded-bottom"
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
                                                <Label className=" p-2 col-sm-3 ">Division</Label>
                                                <Button type="button" color="btn btn-outline-warning" className="btn-sm" ><h className="text-black">{division_dropdown_Select.label}</h></Button>
                                            </Col>
                                            <Col md="4" className="p-2 text-end">
                                                <Button type="button" color="btn btn-outline-secondary" className="btn-sm" onClick={() => { ChangeButtonHandeler() }}><h className="text-black">Change Role</h></Button>
                                            </Col>

                                        </Row>


                                        <Row >
                                            <Col className="">
                                                <FormGroup className="mb-3  row">
                                                    <Label className="col-sm-3 p-2 ml-n5">Module</Label>
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
                                                <FormGroup className="mb-3 row ">
                                                    <Label className="col-sm-3 p-2 ml-n5">Page</Label>
                                                    <Col md="7">

                                                        <Select
                                                            value={page_DropdownSelect}
                                                            options={Page_DropdownOption}
                                                            onChange={(e) => { Page_DropdownSelectHandller(e) }}
                                                            classNamePrefix="select2-selection"
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col >

                                            <Col md="2" className=" ">
                                                <Button type="button" color="btn btn-outline-success" className="" onClick={() => { AddPageButton_Handeler() }}>Add Page</Button>
                                            </Col>


                                            <Col md="2" className="text-end">
                                                <Button type="button" color="primary" onClick={() => { saveHandeller() }}>Save</Button>
                                            </Col>

                                        </Row>
                                    </CardHeader>
                                    <CardBody>
                                        {tableListData.length > 0
                                            ?
                                            <>
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            {tableHederList.map((indx) => {
                                                                return <th>{indx.text}</th>
                                                            })}
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {tableListData.map((indx, key) => {
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        {indx.ModuleName}
                                                                        <input
                                                                            type="hidden"
                                                                            id={"ModuleID" + key}
                                                                            name={"ModuleID" + key}
                                                                            value={indx.ModuleID}
                                                                        />
                                                                        <input
                                                                            type="hidden"
                                                                            id={"ID" + key}
                                                                            name={"ID" + key}
                                                                            value={indx.ID}
                                                                        />
                                                                        <input
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
                                                                                <input
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

                                                                            return (
                                                                                <td className="text-center">
                                                                                    {indx[`PageAccess_${indexPage.Name}`] ?
                                                                                        <input type={"checkbox"} id={indexPage.Name + key}
                                                                                            defaultChecked={indx[`RoleAccess_${indexPage.Name}`] > 0 ? true : false} />
                                                                                        : <input type={"hidden"} id={indexPage.Name + key} />
                                                                                    }
                                                                                </td>
                                                                            )
                                                                        })
                                                                    }


                                                                </tr>
                                                            )
                                                        })}



                                                    </tbody>
                                                </table>

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

                                    </CardBody>
                                </>
                        }
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