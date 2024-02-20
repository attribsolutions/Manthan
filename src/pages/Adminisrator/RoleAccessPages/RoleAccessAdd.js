import React, { useEffect, useState } from "react";
import {
    Col,
    Container,
    Row,
    Label,
    CardHeader,
    FormGroup,
    Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import {
    getPartyListAPI,
} from "../../../store/Administrator/PartyRedux/action";
import { MetaTags } from "react-meta-tags";
import {
    AddPageHandlerForRoleAccessListPage,
    getPageAccess_DropDown_API,
    GO_Button_RoleAccess_AddPage_Action,
    PageDropdownForRoleAccessList,
    PageDropdownForRoleAccessList_Success,
    saveRoleAccessAddAction,
    saveRoleAccessAddActionSuccess,
    setTableData_roleAccss_AddPageSuccess,
} from "../../../store/actions";
import { getModuleList } from "../../../store/actions";
import { useHistory, } from "react-router-dom";
import { breadcrumbReturnFunc, CommonConsole, loginUserID, metaTagLabel } from "../../../components/Common/CommonFunction";
import { getcompanyList } from "../../../store/Administrator/CompanyRedux/actions";
import { getRole } from "../../../store/Administrator/RoleMasterRedux/action";
import { SaveButton } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as url from "../../../routes/route_url"
import { deltBtnCss } from "../../../components/Common/ListActionsButtons";
import { C_Select } from "../../../CustomValidateForm";
import "./style.scss";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import BootstrapTable from "react-bootstrap-table-next";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const RoleAccessAdd = () => {

    const dispatch = useDispatch();
    const history = useHistory()

    const [userPageAccessState, setUserAccState] = useState('');
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [editCreatedBy, setEditCreatedBy] = useState('');
    const [showTableOnUI, setShowTableOnUI] = useState(false)
    const [division_dropdown_Select, setDivision_dropdown_Select] = useState({ label: "Select...", value: 0 });
    const [role_dropdown_Select, setRoleDropDown] = useState("");
    const [module_DropdownSelect, setModule_DropdownSelect] = useState('');
    const [page_DropdownSelect, setPage_DropdownSelect] = useState({ value: 0, label: "All Pages" });
    const [company_dropdown_Select, setCompany_dropdown_Select] = useState({ label: "Select...", value: 0 });
    const [forceRefresh, setForceRefresh] = useState(false);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const location = { ...history.location };

    const {
        ModuleData,
        PageDropdownRedux,
        postMsg,
        Roles = [],
        partyList,
        userAccess = [],
        company,
        tableDataRedux = [],
        saveBtnloading,
        pageDropDownLoading,
    } = useSelector((state) => ({
        saveBtnloading: state.RoleAccessReducer.saveBtnloading,
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
        pageDropDownLoading: state.RoleAccessReducer.pageDropDownLoading,
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
        if (company.length === 1) {
            setCompany_dropdown_Select({
                value: company[0].id,
                label: company[0].Name
            })
        }
    }, [company])

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

    // for Page dropdown
    const Page_DropdownOption = PageDropdownRedux.map((d) => ({
        value: d.id,
        label: d.Name,
    }));

    const tableColumns = [

        {
            text: "Module Name",
            dataField: "ModuleName",
            sort: true,
        },
        {
            text: "PageName",
            dataField: "PageName",
            sort: true,
        },
        {
            text: "Access",
            dataField: "",
            formatExtraData: { tableList: tableDataRedux, forceRefresh, setForceRefresh },
            formatter: MultiSelectDopdown

        },
        {
            text: "Action",
            dataField: "",
            formatExtraData: { tableList: tableDataRedux },
            formatter: (cellContent, user, __key, { tableList }) => {
                const btnId = `roleAccDelete-${user.id}`
                const config = { btnId, deleteId: user.id }
                return (
                    <div style={{ justifyContent: 'center' }} >
                        <Button className={deltBtnCss} id={btnId}> <i className="mdi mdi-delete font-size-18 text-danger text-right"
                            onClick={() => { DeleteRolePage_Handler(user.PageID, tableList) }}></i></Button>
                    </div>
                )
            },
        },
    ]

    /// Role dopdown
    function RoleDropDown_select_handler(e) {
        setRoleDropDown(e)
    };

    function handllerDivisionTypes(e) {
        setDivision_dropdown_Select(e)
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
                Message: alertMessages.selectRole,
            })

        }
    }
    function ChangeButtonHandeler() {
        setShowTableOnUI(false);
        setModule_DropdownSelect('')
        setPage_DropdownSelect('')
        dispatch(setTableData_roleAccss_AddPageSuccess([]))
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
                    Message: alertMessages.pageAlreadyExist
                })
            }
            else {
                customAlert({
                    Type: 4,
                    Message: alertMessages.selectPage,
                })
            }
        }
    }

    function DeleteRolePage_Handler(deleteId, tableList = []) {

        const newList = tableList.filter((index) => {
            return (!(index.PageID === deleteId))
        })
        dispatch(setTableData_roleAccss_AddPageSuccess(newList))

    }

    const saveHandeller = (event) => {
        event.preventDefault();
        const btnId = event.target.id

        try {

            function isAccessSelect(item) {
                let accArray = [];
                let isShowOnMenu_Id

                item.defaultSelectedValues.map(({ value, id }) => {
                    // -1 stands for "List", -2 stands for "Add", and -3 stands for "STP".
                    if ((value < 0)) {
                        isShowOnMenu_Id = id
                    }
                    else {
                        accArray.push({ "PageAccess": value })
                    }
                })

                return { accArray, isShowOnMenu_Id }
            }

            const jsonArray = [];
            tableDataRedux.map((row) => {

                let { accArray = [], isShowOnMenu_Id } = isAccessSelect(row);
                // -1 stands for "List", -2 stands for "Add", and -3 stands for "STP".
                let showList = row.defaultSelectedValues?.find(i => ((i.value === -1) || (i.value === -3)))
                let showAdd = row.defaultSelectedValues?.find(i => (i.value === -2))
                let isAccess = accArray.length > 0;
                let isrelated = row.RelatedPageID > 0;
                let divisionID = division_dropdown_Select.value
                let isSTP_page = row.PageType === 3 //PageTypeName :"SourceTransactionPage"

                const listRowOBJFunc = () => {
                    let showArray = [];
                    if (showList) {
                        showArray = [{ "PageAccess": isShowOnMenu_Id }]
                    }
                    return {
                        Role: role_dropdown_Select.value,
                        Company: company_dropdown_Select.value,
                        Division: divisionID === 0 ? '' : divisionID,
                        Modules: row.ModuleID,
                        Pages: row.PageID,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        RolePageAccess: [...showArray, ...accArray],
                    }
                };

                const addRowOBJFunc = () => {
                    let showArray = [];
                    if (showAdd) {
                        showArray = [{ "PageAccess": isShowOnMenu_Id }]
                    }
                    return {
                        Role: role_dropdown_Select.value,
                        Company: company_dropdown_Select.value,
                        Division: divisionID === 0 ? '' : divisionID,
                        Modules: row.ModuleID,
                        Pages: row.RelatedPageID,
                        CreatedBy: loginUserID(),
                        UpdatedBy: loginUserID(),
                        RolePageAccess: [...showArray, ...accArray],
                    }
                };

                if (isAccess || showList || showAdd) {
                    jsonArray.push(listRowOBJFunc());
                    if (isrelated && !isSTP_page) jsonArray.push(addRowOBJFunc());
                }
            })
            const jsonBody = JSON.stringify(jsonArray)
            dispatch(saveRoleAccessAddAction({ jsonBody, btnId }));

        } catch (w) { CommonConsole(w) }
    }


    let IsEditMode_Css = ''
    if ((pageMode === "edit") || (pageMode === "copy") || (pageMode === "dropdownAdd")) { IsEditMode_Css = "-5.5%" };

    return <React.Fragment>
        <div className="page-content"  >
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <Container fluid>
                {
                    !showTableOnUI ?
                        <CardHeader className="card-header   text-black  c_card_body"  >
                            <Row className="mt-3">
                                <Col sm={3}>
                                    <FormGroup className="mb-3 row ">
                                        <Label className="col-sm-2 p-2 ml-n4 ">Role</Label>
                                        <Col sm={9} style={{ zIndex: "3" }}>
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
                                        <Col md="9" style={{ zIndex: "3" }}>
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
                                        <Col md="9" style={{ zIndex: "3" }}>
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
                                                <C_Select
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
                                                <C_Select
                                                    value={page_DropdownSelect}
                                                    placeholder="select.."
                                                    options={Page_DropdownOption}
                                                    isLoading={pageDropDownLoading}
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
                                            loading={saveBtnloading}
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
                    <RoleAccTable data={tableDataRedux} columns={tableColumns} />
                </div>

            </Container>



        </div>
    </React.Fragment>
}



export default RoleAccessAdd



const RoleAccTable = ({ data, columns }) => {

    return (
        <>
            <ToolkitProvider
                keyField="PageID"
                data={data}
                columns={columns}
                search
            >
                {(toolkitProps) => (
                    <React.Fragment>
                        <Row>
                            <Col xl="12">
                                <div className="table-responsive" id="TableDiv" style={{ minHeight: "65vh" }}  >
                                    <BootstrapTable
                                        keyField={"id"}
                                        responsive
                                        bordered={false}
                                        headerClasses="theader-class"
                                        classes={"table  table-bordered "}
                                        noDataIndication={<div className="text-danger text-center ">Items Not available</div>}
                                        {...toolkitProps.baseProps}
                                    />
                                    {globalTableSearchProps(toolkitProps.searchProps,)}
                                </div>
                            </Col>
                        </Row>

                    </React.Fragment>
                )}
            </ToolkitProvider>
        </>
    )
}


const MultiSelectDopdown = (cell, item, __key, { forceRefresh, setForceRefresh }) => {


    const Option = (props) => {
        const { innerProps, label, data } = props;
        return (
            <components.Option {...props}>
                <div {...innerProps} className="custom-option">
                    <span className="icon">{data.icon}</span>
                    <span className="label">{label}</span>

                </div>
            </components.Option>
        );
    };


    const CustomMultiValueLabel = ({ data }) => (
        <div className="custom-select-value">
            <span className="icon">{data.icon}</span>
            <span className="label">{data.label}</span>
        </div>
    );

    const MultiValueRemove = props => (
        <components.MultiValueRemove {...props}>
            <span className="remove-icon">×</span>
        </components.MultiValueRemove>
    );


    const onChangehamdler = (selectedVal = []) => {
        let updatedSelectedValues = [...selectedVal];

        const hasAddShow = updatedSelectedValues.some((item) => item.value === -2);
        const hasSave = updatedSelectedValues.some((item) => item.value === 2);
        const hasCopy = updatedSelectedValues.some((item) => item.value === 12);
        const hasEdit = updatedSelectedValues.some((item) => item.value === 4);
        const hasEditSelf = updatedSelectedValues.some((item) => item.value === 6);
        const hasDelete = updatedSelectedValues.some((item) => item.value === 5);
        const hasDeleteSelf = updatedSelectedValues.some((item) => item.value === 7);
        const lastSelect = updatedSelectedValues[updatedSelectedValues.length - 1]?.value;

        // Refactor common logic for adding "IsSave" option
        const addIsSaveOption = () => {
            if (!hasSave) {
                updatedSelectedValues.push({ value: 2, label: "IsSave" });
            }
        };

        if (hasAddShow && lastSelect === -2) {
            addIsSaveOption();
        }
        if (hasCopy && lastSelect === 12) {
            addIsSaveOption();
        }

        if (hasEdit && hasEditSelf) {
            if (lastSelect === 4) {
                updatedSelectedValues = updatedSelectedValues.filter(
                    (item) => item.value !== 6
                );
            } else if (lastSelect === 6) {
                updatedSelectedValues = updatedSelectedValues.filter(
                    (item) => item.value !== 4
                );
            }
        }

        if (hasDelete && hasDeleteSelf) {
            if (lastSelect === 5) {
                updatedSelectedValues = updatedSelectedValues.filter(
                    (item) => item.value !== 7
                );
            } else if (lastSelect === 7) {
                updatedSelectedValues = updatedSelectedValues.filter(
                    (item) => item.value !== 5
                );
            }
        }

        // Set the updated selected values in the state
        setForceRefresh(!forceRefresh);
        item.defaultSelectedValues = updatedSelectedValues;
    };



    return (
        <div key={item.id}>
            <Select
                key={`select-${item.id}${item.defaultSelectedValues}`}
                isMulti
                onChange={(e) => onChangehamdler(e)}
                value={item.defaultSelectedValues}
                components={{
                    Option,
                    MultiValueLabel: CustomMultiValueLabel, // Custom icon + label for selected values
                    MultiValueRemove: MultiValueRemove, // Default cancel button
                }}
                options={item.dynamicOptions} />
        </div>

    );
};