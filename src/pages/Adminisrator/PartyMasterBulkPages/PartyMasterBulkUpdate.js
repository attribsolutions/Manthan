import {
    Card,
    CardBody,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    resetFunction
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    date_ymd_func,
    loginCompanyID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect, useState } from "react";
import { GetRoutesList, GetRoutesListSuccess } from "../../../store/Administrator/RoutesRedux/actions";
import {
    GoButton_For_Party_Master_Bulk_Update_Add,
    GoButton_For_Party_Master_Bulk_Update_AddSuccess,
    postPartyName_for_dropdown,
    postPartyName_for_dropdown_Success,
    postParty_Master_Bulk_Update,
    postParty_Master_Bulk_Update_Success,
    postSelect_Field_for_dropdown,
    updatePartyMasterBulkID
} from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { getState, getStateESuccess } from "../../../store/Administrator/EmployeeRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import { GetDistrictOnState_For_Dropdown, mobileApp_RetailerUpdate_Api } from "../../../helpers/backend_helper";
import { showToastAlert } from "../../../helpers/axios_Config";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { allLabelWithBlank } from "../../../components/Common/CommonErrorMsg/HarderCodeData";

const PartyMasterBulkUpdate = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [modalCss] = useState(false);
    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');

    const fileds = {
        id: "",
        Party: allLabelWithBlank,
        Routes: allLabelWithBlank
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [forceRefresh, setForceRefresh] = useState(false);
    const [SelectedParty, SetSelectedParty] = useState([])
    const [SelectFieldName, setSelectFieldName] = useState([]);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        userAccess,
        RoutesList,
        SelectField,
        PartyName,
        Data,
        State,
        saveBtnloading,
        listBtnLoading,

    } = useSelector((state) => ({
        listBtnLoading: state.PartyMasterBulkUpdateReducer.listBtnLoading,
        saveBtnloading: state.PartyMasterBulkUpdateReducer.saveBtnloading,
        postMsg: state.PartyMasterBulkUpdateReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Routes: state.CreditLimitReducer.Routes,
        State: state.EmployeesReducer.State,
        Data: state.PartyMasterBulkUpdateReducer.goButton,
        RoutesList: state.RoutesReducer.RoutesList,
        SelectField: state.PartyMasterBulkUpdateReducer.SelectField,
        PartyName: state.PartyMasterBulkUpdateReducer.PartyName,
    }));


    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    useEffect(() => {
        dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]))
        const page_Id = pageId.PARTY_MASTER_BULK_UPDATE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getState())
        if (!(commonPartyDropSelect.value === 0)) {
            dispatch(GetRoutesList({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }));
            const jsonBody = JSON.stringify({
                CompanyID: loginCompanyID(),
                PartyID: commonPartyDropSelect.value,
                Type: 4
            });
            dispatch(postPartyName_for_dropdown(jsonBody));
        }
        return () => {
            dispatch(GetRoutesListSuccess([]))
            dispatch(getStateESuccess([]))
            dispatch(postPartyName_for_dropdown_Success([]))
        }
    }, []);

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserPageAccessState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 2
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(postParty_Master_Bulk_Update_Success({ Status: false }));
            dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]));
            setState(() => resetFunction(fileds, state))// Clear form values 
            setSelectFieldName([]);
            //***************mobail app api*********************** */
            let arrayOfRetailerID = SelectedParty.map(function (i) {
                return i.SubPartyID;
            });
            const jsonBody = JSON.stringify({
                RetailerID: arrayOfRetailerID.join(', ')
            })
            const mobilApiResp = await mobileApp_RetailerUpdate_Api({ jsonBody })
            if (mobilApiResp.StatusCode === 200) { showToastAlert(mobilApiResp.Message) }
            //************************************** */

            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.PARTY_MASTER_BULK_UPDATE })
                }
            }
        }
        else if ((postMsg.Status === true)) {
            dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]));
            dispatch(postParty_Master_Bulk_Update_Success({ Status: false }));
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg.Status])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${"Count"} :${Data.length}`))
    }, [Data])

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [Data]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteName_Options = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    const SelectFieldDropdown_options = SelectField.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const PartyDropdown_Options = PartyName.map(i => ({
        value: i.id,
        label: i.Name
    }));

    const StateValues = State.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const GoButton_Handler = () => {

        if ((commonPartyDropSelect.value === 0)) {
            customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        }

        else if (SelectFieldName.length === 0) {
            customAlert({
                Type: 3,
                Message: alertMessages.selectField,
            })
            return;
        }

        const jsonBody = JSON.stringify({

            PartyID: commonPartyDropSelect.value,
            Route: values.Routes.value === "" ? 0 : values.Routes.value,
            Type: SelectFieldName.length === 0 ? 0 : SelectFieldName.label,
            FilterPartyID: values.Party.value === "" ? 0 : values.Party.value

        });

        dispatch(GoButton_For_Party_Master_Bulk_Update_Add(jsonBody));
    }

    function SelectFieldHandler(event) {
        setSelectFieldName(event)
    }

    function tableSelectHandler(event, row) {
        let input = event.target.value;
        row.Newvalue = input
    }

    const handllerState = async (stateID, row) => {

        try {
            const response = await GetDistrictOnState_For_Dropdown(stateID.value);
            if (response.StatusCode === 200) {

                row.Newvalue = stateID.value
                row.selectedState = stateID
                row.districtOptions = response.Data.map(item => ({ value: item.id, label: item.Name }));
                setForceRefresh(i => !i)
            } else {
                customAlert({
                    Type: 1,
                    Message: `Error for State ID ${stateID.label}:`,
                });
            }
        } catch (error) {
            _cfunc.CommonConsole(`Error for State ID ${stateID.label}:`, error);
        }
    };

    function divisionhandler(event, row) {
        row.Newvalue = event.target.checked
    }

    function TCSPartyhandler(event, row) {
        row.Newvalue = event.target.checked
    }

    function partyOnchange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.Party = e;
            a.hasValid.Party.valid = true
            return a
        })
    }

    function RoutesNameOnchange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.Routes = e;
            a.hasValid.Routes.valid = true
            return a
        })
    }

    function handllerDistrictOnState(event, row) {
        row.NewDistrict = event.value
    }

    function fromdateOnchange(event, row) {
        const Date = date_ymd_func(event[0])
        row.NewFSSAIExipry = Date
    }

    const pagesListColumns = [
        {
            text: "Party Name",
            dataField: "PartyName",
        },
        {
            text: SelectFieldName.label,
            dataField: SelectFieldName.label,
        },

    ];

    PartyDropdown_Options.unshift({
        value: "",
        label: " All"
    });

    RouteName_Options.unshift({
        value: "",
        label: " All"
    });

    if (SelectFieldName.label === "FSSAINo") {
        let FSSAINo = {
            text: "FSSAI  Exipry",
            dataField: "FSSAIExipry",
        }
        pagesListColumns.push(FSSAINo)
    }

    if (SelectFieldName.label === "State") {
        let District = {
            text: "District",
            dataField: "District",
        }
        pagesListColumns.push(District)
    }

    const Newvalue = {
        text: `New${SelectFieldName.label === undefined ? " Value" : SelectFieldName.label}`,
        dataField: "Newvalue",

        formatter: (cellContent, row, key) => (

            <>
                {SelectFieldName.label === "State" ?

                    <div style={{ width: "180px" }}>
                        <Col>
                            <FormGroup >
                                <C_Select
                                    key={row.Newvalue}
                                    value={(row?.selectedState === "") ?
                                        { value: "", label: "Select..." }
                                        : row.selectedState}
                                    options={StateValues}
                                    onChange={(event) => handllerState(event, row, key)}
                                />
                            </FormGroup>
                        </Col>
                    </div> :
                    SelectFieldName.label === "IsTCSParty" ?
                        < Col md={2} style={{ marginTop: '9px' }} >

                            <Input
                                type="checkbox"
                                id={key}
                                className="p-2"
                                defaultChecked={row.IsTCSParty}
                                onChange={(event) => TCSPartyhandler(event, row)}
                            />

                        </Col> :

                        SelectFieldName.label === "IsDivision" ?

                            < Col md={2} style={{ marginTop: '9px' }} >
                                <div className="form-check form-switch form-switch-md mb-3">
                                    <Input type="checkbox" className="form-check-input"
                                        id={key}
                                        defaultChecked={row.IsDivision}
                                        onChange={(event) => divisionhandler(event, row)}
                                        name="IsActive"

                                    />
                                </div>
                            </Col> :

                            <div style={{ width: "180px" }}>
                                <Col>
                                    <FormGroup >
                                        <Input
                                            id={key}
                                            type="text"
                                            placeholder={`Enter New ${SelectFieldName.label}`}
                                            defaultValue={row.Newvalue}
                                            className="col col-sm "
                                            onChange={(event) => tableSelectHandler(event, row)}
                                        />
                                    </FormGroup>
                                </Col>
                            </div>
                }
            </>
        ),
    }

    const DistrictColumn = {
        text: " New District",
        dataField: "",
        formatExtraData: { forceRefresh },
        formatter: (cellContent, row, key) => {

            return (<>
                <div style={{ width: "180px" }}>
                    <Col>
                        <FormGroup >
                            <C_Select
                                key={row.Newvalue}
                                options={row.districtOptions}
                                onChange={(event) => handllerDistrictOnState(event, row)}
                            />
                        </FormGroup>
                    </Col>
                </div>
            </>)
        }
    }

    pagesListColumns.push(Newvalue)
    const dateColumn = {
        text: " New FSSAI Exipry",
        dataField: "",
        formatter: (cellContent, row, key) => (
            <>
                <div style={{ width: "180px" }} >
                    <Col sm={12}>
                        <FormGroup sm={6}>
                            <C_DatePicker
                                options={{
                                    minDate: "today",
                                    altInput: true,
                                    altFormat: "d-m-Y",
                                    dateFormat: "Y-m-d",
                                }}
                                id={key}
                                name='fromdate'
                                onChange={(event) => fromdateOnchange(event, row)}
                            />
                        </FormGroup>
                    </Col>
                </div>

            </>
        ),
    }
    if (SelectFieldName.label === "FSSAINo") {
        pagesListColumns.push(dateColumn)
    }
    if (SelectFieldName.label === "State") {
        pagesListColumns.push(DistrictColumn)
    }

    const pageOptions = {
        sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    function partySelectButtonHandler() {
        const jsonBody = JSON.stringify({
            CompanyID: loginCompanyID(),
            PartyID: commonPartyDropSelect.value,
            Type: 4
        });
        dispatch(postPartyName_for_dropdown(jsonBody));
        dispatch(GetRoutesList({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }));
    }

    function partySelectOnChangeHandler() {
        setState((i) => {
            const a = { ...i }
            a.values.Party = allLabelWithBlank
            a.values.Routes = allLabelWithBlank
            a.hasValid.Party.valid = true;
            a.hasValid.Routes.valid = true;
            return a
        })
        dispatch(GetRoutesListSuccess([]));
        dispatch(postPartyName_for_dropdown_Success([]));
        dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]));
    }

    const SaveHandler = (event) => {

        const arr1 = []
        event.preventDefault();
        const btnId = event.target.id
        try {

            btnIsDissablefunc({ btnId, state: true })
            Data.forEach(i => {

                if (i.Newvalue || i.NewFSSAIExipry || i.NewDistrict || i.Newvalue === false) {
                    const arr = {
                        SubPartyID: i.SubPartyID,
                        Value1: i.Newvalue,
                        Value2: i.NewFSSAIExipry || i.NewDistrict,
                        party: i.PartyName
                    }

                    arr1.push(arr)
                }
            })

            SetSelectedParty(arr1)
            const jsonBody = JSON.stringify({
                PartyID: commonPartyDropSelect.value,
                Type: SelectFieldName.label,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
                UpdateData: arr1

            });

            if (pageMode === mode.edit) {
                dispatch(updatePartyMasterBulkID({ jsonBody, updateId: values.id, btnId }));
            }
            else {

                if (arr1.length <= 0) {
                    customAlert({
                        Type: 3,
                        Message: alertMessages.updateAtLeastOneField,
                    })
                    btnIsDissablefunc({ btnId, state: false })
                } else {

                    const invalidMsg1 = []
                    arr1.forEach((i) => {

                        if ((SelectFieldName.label === "State")) {
                            if (!(i.Value2)) {
                                invalidMsg1.push({ [i.party]: alertMessages.DistrictIsRequired })
                            }
                        };

                        if ((SelectFieldName.label === "MobileNo")) {
                            const regexExp1 = /^[6-9]\d{9}$/gi;
                            const IsMobile = regexExp1.test(i.Value1)
                            if (!IsMobile) {
                                invalidMsg1.push({ [i.party]: alertMessages.invalidMobile})

                            }
                        };

                        if ((SelectFieldName.label === "Email")) {
                            const regexExp2 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                            const IsEmail = regexExp2.test(i.Value1)
                            if (!IsEmail) {
                                invalidMsg1.push({ [i.party]: alertMessages.invalidEmail})
                            }
                        };

                        if ((SelectFieldName.label === "PAN")) {
                            const regexExp3 = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
                            const IsPan = regexExp3.test(i.Value1)
                            if (!IsPan) {
                                invalidMsg1.push({ [i.party]: alertMessages.invalidPAN })
                            }
                        };

                        if ((SelectFieldName.label === "GSTIN")) {
                            const regexExp4 = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
                            const IsGSTIN = regexExp4.test(i.Value1)
                            if (!IsGSTIN) {
                                invalidMsg1.push({ [i.party]: alertMessages.invalid_GSTIN_no })
                            }
                        };

                        if ((SelectFieldName.label === "Name")) {
                            const regexExp5 = /^[A-Za-z]+$/
                            const IsName = regexExp5.test(i.Value1)
                            if (!IsName) {
                                invalidMsg1.push({ [i.party]: alertMessages.invalid_Name })
                            }
                        };

                    })

                    if (invalidMsg1.length > 0) {
                        customAlert({
                            Type: 3,
                            Message: invalidMsg1
                        })
                        return;
                    }

                    dispatch(postParty_Master_Bulk_Update({ jsonBody, btnId }));
                }

            }
        } catch (e) { }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    // var IsEditMode_Css = ''
    // if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >
                    <form noValidate>

                        <Card className="mb-1" style={{ marginBottom: "6px" }}>
                            <CardBody className="c_card_header text-black">
                                <Row>
                                    <Col sm={3} >
                                        <FormGroup className=" row" >
                                            <Label className="mt-1"
                                                style={{ width: "95px" }}>SelectField </Label>
                                            <div className="col col-7 sm-1">
                                                <Select
                                                    name="SelectField"
                                                    value={SelectFieldName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    isDisabled={Data.length > 0 && true}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    options={SelectFieldDropdown_options}
                                                    onChange={(event) => SelectFieldHandler(event)}
                                                />
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col sm={3} >
                                        <FormGroup className=" row ">
                                            <Label className="mt-1"
                                                style={{ width: "104px" }}>RoutesName </Label>
                                            <div className="col col-7 sm-1">
                                                <Select
                                                    name="RoutesName"
                                                    value={values.Routes}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    isDisabled={Data.length > 0 && true}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    classNamePrefix="dropdown"
                                                    options={RouteName_Options}
                                                    onChange={RoutesNameOnchange}

                                                />
                                            </div>
                                        </FormGroup>
                                    </Col>

                                    <Col sm={4} >
                                        <FormGroup className=" row " >
                                            <Label htmlFor="validationCustom01" className="mt-1"
                                                style={{ width: "100px" }}>PartyName </Label>
                                            <div className="col col-7 sm-1">
                                                <Select
                                                    name="PartyName"
                                                    value={values.Party}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    isDisabled={Data.length > 0 && true}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    options={PartyDropdown_Options}
                                                    onChange={partyOnchange}

                                                />
                                            </div>
                                        </FormGroup>
                                    </Col>

                                    <Col sm={1}>
                                        <div className="col col-1 px-5">

                                            {!Data.length > 0 ?
                                                <Go_Button onClick={(event) => { GoButton_Handler(event) }} loading={listBtnLoading} />
                                                : <Change_Button
                                                    onClick={(e) => dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]))}
                                                />
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                        >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField="id"
                                    data={Data}
                                    columns={pagesListColumns}
                                    search
                                >
                                    {toolkitProps => (
                                        <React.Fragment>
                                            <div className="table">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    id="table_Arrow"
                                                    bordered={true}
                                                    striped={false}
                                                    noDataIndication={<div className="text-danger text-center ">PartyMasterbulk Not available</div>}
                                                    classes={"table align-middle table-nowrap table-hover"}
                                                    headerWrapperClasses={"thead-light"}

                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                                {/* {countlabelFunc(toolkitProps, paginationProps,)} */}
                                                {globalTableSearchProps(toolkitProps.searchProps)}
                                            </div>

                                            <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone
                                                        {...paginationProps}
                                                    />
                                                </Col>
                                            </Row>
                                        </React.Fragment>
                                    )
                                    }
                                </ToolkitProvider>
                            )
                            }
                        </PaginationProvider>

                        {Data.length > 0 &&
                            <SaveButtonDraggable>
                                <SaveButton pageMode={pageMode}
                                    loading={saveBtnloading}
                                    onClick={SaveHandler}
                                    userAcc={userPageAccessState}
                                    module={"PartyMasterBulkUpdate"}
                                />
                            </SaveButtonDraggable>
                        }
                    </form>

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


export default PartyMasterBulkUpdate

