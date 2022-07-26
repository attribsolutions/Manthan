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
import { AddPageHandlerForRoleAccessListPage, GetHpageListData, getH_Modules, getPageAccess_DropDown_API, GetRoleListForRoleAccessListPage, getRoles, PageDropdownForRoleAccessList, PageMasterForRoleAccessLit, PostMethodForRoleAccessListPage, roleAceessAction } from "../../../store/actions";
import { fetchModelsList } from "../../../store/actions";
import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory, useLocation, useParams } from "react-router-dom";

const RoleAccessList = (props) => {
    // const [EditData, setEditData] = useState([]);
    const history = useHistory()

    useEffect(() => {
        console.log("testvalue,testvalue,testvalue,", props)

        const userPageAccess = history.location.state

        // console.log("acc", userPageAccess)

        if ((userPageAccess === undefined)) {

            history.push("/Dashboard")
        }
        else {
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

    const [division_dropdown_Select, setDivision_dropdown_Select] = useState("");
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState('');


    //Access redux store Data /  'save_ModuleSuccess' action data
    const { PageMasterListForRoleAccess, PageAccess, ModuleData, PageDropdownForRoleAccess, PartySaveSuccess,
        AddPage_PageMasterListForRoleAccess, GO_buttonPageMasterListForRoleAccess,
        RoleListData_Reducer, companyList, DivisionTypes, Roles } = useSelector((state) => ({
            PartySaveSuccess: state.PartyMasterReducer.PartySaveSuccess,
            companyList: state.Company.companyList,
            DivisionTypes: state.PartyMasterReducer.DivisionTypes,
            PartyTypes: state.PartyMasterReducer.PartyTypes,
            Roles: state.User_Registration_Reducer.Roles,
            ModuleData: state.Modules.modulesList,
            PageAccess: state.H_Pages.PageAccess,
            RoleListData_Reducer: state.RoleAccessReducer.RoleListDataForRoleListPage,
            PageMasterListForRoleAccess: state.RoleAccessReducer.PageMasterListForRoleAccess,
            PageDropdownForRoleAccess: state.RoleAccessReducer.PageDropdownForRoleAccess,
            AddPage_PageMasterListForRoleAccess: state.RoleAccessReducer.AddPage_PageMasterListForRoleAccess,
            GO_buttonPageMasterListForRoleAccess: state.RoleAccessReducer.GO_buttonPageMasterListForRoleAccess,


        }));


    useEffect(() => {
        // dispatch(fetchCompanyList());
        dispatch(getDivisionTypesID());
        dispatch(GetRoleListForRoleAccessListPage(1, 1));
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
        RoleListData_Reducer.map((indexdata) => {   //1st map function start

            //     indexdata.ModuleData.map((indexmodul) => {   //2nd mapfunction start
            count1 = count1 + 1
            //         eleList["ModuleName"] = indexdata.ModuleName;
            //         eleList["ActualPagePath"] = indexmodul.ActualPagePath;
            eleList = indexdata;
            eleList["ID"] = count1;

            //         // PageAccess.map((indexPage) => { eleList[`${indexPage.Name}`] = false})

            //         indexmodul.RolePageAccess.map((indexRolePageAccess) => {   //3 rd map function start
            //             eleList[`${indexRolePageAccess.Name}`] = true

            //             // if ((eleList.hasOwnProperty(indexRolePageAccess.Name))) { }
            //         })
            Array.push(eleList)
            eleList = {}
            //     })
            // })
        })
        // LList = previousData.concat(Array)

        setListData(Array)


    }, [RoleListData_Reducer])

    useEffect(() => {

        var Array = []
        var eleList = {}
        let NewID = listData.length + 1
        let previousData = listData

        AddPage_PageMasterListForRoleAccess.map((indexdata) => {   //1st mapfunction start

            //     indexdata.ModuleData.map((indexmodul) => {//second map function start
            //         eleList["ModuleName"] = indexdata.ModuleName;
            //         eleList["ActualPagePath"] = indexmodul.ActualPagePath;
            eleList = indexdata
            eleList["ID"] = NewID;

            //         indexmodul.RolePageAccess.map((indexRolePageAccess) => { //3 rd map function start
            //             eleList[`${indexRolePageAccess.Name}`] = true
            //             if ((eleList.hasOwnProperty(indexRolePageAccess.Name))) {
            //             }
            //         })
            Array.push(eleList)
            eleList = {}
            //     })
        })
        previousData = previousData.concat(Array)
        setListData(previousData)
        // console.log("AddPage_PageMasterListForRoleAccess", AddPage_PageMasterListForRoleAccess)
        // debugger
    }, [AddPage_PageMasterListForRoleAccess])

    useEffect(() => {

        var NewColoumList = PageAccess.map((i) => {
            return ({
                text: i.Name,
                dataField: i.Name,
                sort: true,
                formatter: (cellContent, indx) => (
                    <>
                        {indx[`PageAccess_${i.Name}`] > 0 ?
                            <>
                                <Input
                                    type="checkbox"
                                    name={i.Name}
                                    // onClick={() => {
                                    //   EditPageHandler(module.id);
                                    // }}
                                    defaultChecked={(indx[`RoleAccess_${i.Name}`] > 0)}
                                />
                            </>
                            :
                            <></>
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
            // hidden: true
        }
        , {
            text: "Module Name",
            dataField: "ModuleName",
            sort: true,
        },
        {
            text: "PageName",
            dataField: "PageName",
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
    const Page_DropdownOption = PageDropdownForRoleAccess.map((d) => ({
        value: d.id,
        label: d.Name,
    }));
    // console.log("PageDropdownForRoleAccess",PageDropdownForRoleAccess)

    function handllercompanyList(e) {
        // setCompanyList_dropdown_Select(e)
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
        dispatch(PageDropdownForRoleAccessList(e.value));

    }

    const Page_DropdownSelectHandller = (e) => {
        setPage_DropdownSelect(e);
    }

    const GoButton_Handler = () => {
        var division = division_dropdown_Select.value
        var role = role_dropdown_Select
        dispatch(getRoles(division, role));
    }

    const AddPageButton_Handeler = () => {
        dispatch(AddPageHandlerForRoleAccessListPage(page_DropdownSelect.value));
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
    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        style: { background: 'red' },
        classes: (row, rowIndex) => {
            console.log('rowIndex', row)
            return
        },
        nonSelectableStyle: { backgroundColor: 'gray' }

    }

    const saveHandeller = () => {

        let selectedItemArray = [];
        let pageAccessElement = {}
        let roleAccessArray = []

        for (var i = 0; i < listData.length - 1; i++) {

              var moduleName = document.getElementById("moduleName" + i).value;
            var pageName = document.getElementById("pageName" + i).value;
            var pageId = parseInt(pageName)
            var moduleId = parseInt(moduleName)
            var isSave = document.getElementById("isSave" + i).checked
            var isEdit = document.getElementById("isEdit" + i).checked;
            var isDelete = document.getElementById("isDelete" + i).checked;
            var isEditSelf = document.getElementById("isEditSelf" + i).checked;
            var isDeleteSelf = document.getElementById("isDeleteSelf" + i).checked;
            var isShow = document.getElementById("isShow" + i).checked;
            var isTopOfTheDivision = document.getElementById("isTopOfDivision" + i).checked;
            var isView = document.getElementById("isView" + i).checked;


            if (isSave) roleAccessArray.push({ "PageAccess": 1 });
            if (isEdit) roleAccessArray.push({ "PageAccess": 2 });
            if (isDelete) roleAccessArray.push({ "PageAccess": 3 });
            if (isEditSelf) roleAccessArray.push({ "PageAccess": 4 });
            if (isDeleteSelf) roleAccessArray.push({ "PageAccess": 5 });
            if (isShow) roleAccessArray.push({ "PageAccess": 6 });
            if (isView) roleAccessArray.push({ "PageAccess": 7 });
            if (isTopOfTheDivision) roleAccessArray.push({ "PageAccess": 8 });

            // roleAccessArray.push(roleAccessElement)

            pageAccessElement["Role"] = 2
            pageAccessElement["Company"] = 2
            pageAccessElement["Division"] = 2
            pageAccessElement["Modules"] = moduleId
            pageAccessElement["Pages"] = pageId
            pageAccessElement["CreatedBy"] = 1
            pageAccessElement["UpdatedBy"] = 1
            pageAccessElement["RolePageAccess"] = roleAccessArray

            if (roleAccessArray.length > 0) {
                let pageAccessElement2 = {}
                selectedItemArray.push(pageAccessElement)
                // if(relatedpageid>0)
                pageAccessElement2["Role"] = 2
                pageAccessElement2["Company"] = 2
                pageAccessElement2["Division"] = 2
                pageAccessElement2["Modules"] = moduleId
                pageAccessElement2["Pages"] = pageId + 100
                pageAccessElement2["CreatedBy"] = 1
                pageAccessElement2["UpdatedBy"] = 1
                pageAccessElement2["RolePageAccess"] = roleAccessArray
                selectedItemArray.push(pageAccessElement2)
                pageAccessElement2 = {}
            }
            // debugger
            roleAccessArray = []
            pageAccessElement = {}
        }

        const jsonBody = JSON.stringify(selectedItemArray)

        dispatch(PostMethodForRoleAccessListPage(jsonBody));
        debugger

    };
    return (
        <React.Fragment>
            <div className="page-content text-black" >
                <Breadcrumbs breadcrumbItem={"Role Access List"} />
                <MetaTags>
                    <title>Role Access| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Container fluid>

                    <Card className="text-black" >
                        <Button onClick={() => { saveHandeller() }}>Save</Button>
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
                            {listData1.length > 0
                                ?
                                <>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                {listData1.map((indx) => {
                                                    // console.log('indx', indx)
                                                    return <th>{indx.text}</th>
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {listData.map((indx, key) => {
                                                return (
                                                    <tr>
                                                        {/* <th scope="row">1</th> */}
                                                        <td>
                                                            {indx.ID}
                                                            <input
                                                                type="hidden"
                                                                id={"ID" + key}
                                                                name={"ID" + key}
                                                                value={indx.ID}
                                                            />
                                                        </td>
                                                        <td>
                                                            {indx.ModuleName}
                                                            <input
                                                                type="hidden"
                                                                id={"moduleName" + key}
                                                                name={"moduleName" + key}
                                                                value={indx.ModuleID}
                                                            />
                                                        </td>
                                                        <td>
                                                            {indx.PageName}
                                                            <input
                                                                type="hidden"
                                                                id={"pageName" + key}
                                                                name={"pageName" + key}
                                                                value={indx.PageID}
                                                            />

                                                        </td>
                                                        <td>
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
                                                            {/* {indx.PageAccess_IsDelete} */}
                                                            {indx.PageAccess_IsDelete ?
                                                                <input type={"checkbox"}
                                                                    id={'isDelete' + key}
                                                                    defaultChecked={indx.RoleAccess_IsDelete > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isDelete' + key} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsEditSelf} */}
                                                            {indx.PageAccess_IsEditSelf ?
                                                                <input type={"checkbox"}
                                                                    id={'isEditSelf' + key}
                                                                    defaultChecked={indx.RoleAccess_IsEditSelf > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isEditSelf' + key} />
                                                            }

                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsDeleteSelf} */}
                                                            {indx.PageAccess_IsDeleteSelf ?
                                                                <input type={"checkbox"}
                                                                    id={'isDeleteSelf' + key}
                                                                    defaultChecked={indx.RoleAccess_IsDeleteSelf > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isDeleteSelf' + key} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsShow} */}
                                                            {indx.PageAccess_IsShow ?
                                                                <input type={"checkbox"}
                                                                    id={'isShow' + key}
                                                                    defaultChecked={indx.RoleAccess_IsShow > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isShow' + key} />
                                                            }
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsView} */}
                                                            {indx.PageAccess_IsView ?
                                                                <input type={"checkbox"}
                                                                    id={'isView' + key}
                                                                    defaultChecked={indx.RoleAccess_IsView > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isView' + key} />}
                                                        </td>
                                                        <td>
                                                            {/* {indx.PageAccess_IsTopOfTheDivision} */}
                                                            {indx.PageAccess_IsTopOfTheDivision ?
                                                                <input type={"checkbox"}
                                                                    id={'isTopOfDivision' + key}
                                                                    defaultChecked={indx.RoleAccess_IsTopOfTheDivision > 0 ? true : false} />
                                                                :
                                                                <input type={"hidden"} id={'isTopOfDivision' + key} />
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })}



                                        </tbody>
                                    </table>
                                    <BootstrapTable
                                        keyField={"id"}
                                        responsive
                                        data={listData}
                                        columns={listData1}
                                        bordered={false}
                                        striped={false}
                                        hover={true}
                                        defaultSorted={defaultSorted}
                                        selectRow={selectRow}
                                        // selectRow={selectRow}
                                        classes={"table  table-bordered"}
                                    // {...toolkitProps.baseProps}
                                    // {...paginationTableProps}
                                    />
                                    {/* // <PaginationProvider pagination={paginationFactory(listData)}>
                                //     {({ paginationProps, paginationTableProps }) => (
                                //         <ToolkitProvider
                                //             keyField="id"
                                //             data={listData}
                                //             columns={listData1}
                                //             search
                                //         >
                                //             {(toolkitProps) => (
                                //                 <React.Fragment>

                                //                     <Row>
                                //                         <Col xl="12">
                                //                             <div className="table-responsive">
                                //                                 <BootstrapTable
                                //                                     keyField={"id"}
                                //                                     responsive
                                //                                     data={listData}
                                //             columns={listData1}
                                //                                     bordered={false}
                                //                                     striped={false}
                                //                                     hover={true}
                                //                                     defaultSorted={defaultSorted}
                                //                                     // selectRow={selectRow}
                                //                                     classes={"table  table-bordered"}
                                //                                     // {...toolkitProps.baseProps}
                                //                                     // {...paginationTableProps}
                                //                                 />
                                //                             </div>
                                //                         </Col>
                                //                     </Row>
                                //                     <Row className="align-items-md-center mt-30">
                                //                         <Col className="pagination pagination-rounded justify-content-end mb-2">
                                //                             <PaginationListStandalone {...paginationProps} />
                                //                         </Col>
                                //                     </Row>
                                //                 </React.Fragment>
                                //             )}
                                //         </ToolkitProvider>
                                //     )}
                                // </PaginationProvider> */}
                                </> :
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
