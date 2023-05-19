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
import { AlertState, commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    resetFunction
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    date_ymd_func,
    loginCompanyID,
    loginPartyID,
    metaTagLabel
} from "../../../components/Common/CommonFunction";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import React, { useEffect, useRef, useState } from "react";
import { GetRoutesList } from "../../../store/Administrator/RoutesRedux/actions";
import {
    GoButton_For_Party_Master_Bulk_Update_Add,
    GoButton_For_Party_Master_Bulk_Update_AddSuccess,
    postPartyName_for_dropdown,
    postParty_Master_Bulk_Update,
    postParty_Master_Bulk_Update_Success,
    postSelect_Field_for_dropdown,
    updatePartyMasterBulkID
} from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { getState } from "../../../store/Administrator/EmployeeRedux/action";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";


const PartyMasterBulkUpdate = (props) => {

    const count = useRef(0)

    const dispatch = useDispatch();
    const history = useHistory()
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserPageAccessState] = useState('');
    const [SelectFieldName, setSelectFieldName] = useState([]);
    const [state_DropDown_select, setState_DropDown_select] = useState();
    const [district_dropdown_Select, setDistrict_dropdown_Select] = useState();


    const fileds = {
        id: "",
        RoutesName: "",
        PartyName: "",
        SelectField: "",
        Party: { value: "", label: "All" },
        Routes: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [val, setvalue] = useState()
    const [key, setKey] = useState()


    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        userAccess,
        RoutesList,
        SelectField,
        PartyName,
        Data,
        DistrictOnState,
        State
    } = useSelector((state) => ({
        postMsg: state.PartyMasterBulkUpdateReducer.postMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        Routes: state.CreditLimitReducer.Routes,
        State: state.EmployeesReducer.State,
        DistrictOnState: state.PartyMasterReducer.DistrictOnState,
        Data: state.PartyMasterBulkUpdateReducer.goButton,
        RoutesList: state.RoutesReducer.RoutesList,
        SelectField: state.PartyMasterBulkUpdateReducer.SelectField,
        PartyName: state.PartyMasterBulkUpdateReducer.PartyName,
    }));

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;


    useEffect(() => {
        dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]))
        const page_Id = pageId.PARTY_MASTER_BULK_UPDATE
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(GetRoutesList());
        dispatch(getState())
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

    useEffect(() => {
        const jsonBody = JSON.stringify({
            CompanyID: loginCompanyID(),
            PartyID: loginPartyID(),
            Type: 1
        });
        dispatch(postPartyName_for_dropdown(jsonBody));
    }, []);

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200) && !(pageMode === "dropdownAdd")) {
            dispatch(postParty_Master_Bulk_Update_Success({ Status: false }))
            // dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]))
            setState(() => resetFunction(fileds, state))// Clear form values  
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === mode.dropdownAdd) {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.PARTY_MASTER_BULK_UPDATE,
                }))
            }
        }
        else if ((postMsg.Status === true) && !(pageMode === "dropdownAdd")) {
            dispatch(postParty_Master_Bulk_Update_Success({ Status: false }))
            dispatch(AlertState({
                Type: 1,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg.Status])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`${"Party Count"} :${Data.length}`))
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

    const DistrictOnStateValues = DistrictOnState.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const PartyDropdown_Options = PartyName.map(i => ({
        value: i.id,
        label: i.Name
    }));

    const StateValues = State.map((index) => ({
        value: index.id,
        label: index.Name
    }));

    const goButtonHandler = () => {

        if (SelectFieldName.length === 0) {
            customAlert({
                Type: 3,
                Message: "Please select field",
            })
            return;
        }

        const jsonBody = JSON.stringify({

            PartyID: loginPartyID(),
            Route: values.Routes.value === "" ? 0 : values.Routes.value,
            Type: SelectFieldName.length === 0 ? 0 : SelectFieldName.label,
            FilterPartyID: values.Party.value === "" ? 0 : values.Party.value

        });
        dispatch(GoButton_For_Party_Master_Bulk_Update_Add(jsonBody));
    }

    function SelectFieldHandler(event) {
        setSelectFieldName(event)
        dispatch(GoButton_For_Party_Master_Bulk_Update_AddSuccess([]))
    }

    function tableSelectHandler(event, user) {
        let input = event.target.value;
        user.Newvalue = input
    }

    function handllerState(event, user, key) {

        user.Newvalue = event.value
        setState_DropDown_select(event)
        setKey(key)

    }

    function divisionhandler(event, user) {
        user.Newvalue = event.target.checked

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

    function handllerDistrictOnState(event, user) {
        user.NewDistrict = event.value
    }

    function fromdateOnchange(event, user) {
        const Date = date_ymd_func(event[0])
        user.NewFSSAIExipry = Date
    }

    const pagesListColumns = [
        {
            text: "PartyName",
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
            text: "FSSAIExipry",
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
        text: `New${SelectFieldName.label === undefined ? "Value" : SelectFieldName.label}`,
        dataField: "Newvalue",

        formatter: (cellContent, user, key) => (
            <>
                {SelectFieldName.label === "State" ?
                    <div style={{ width: "180px" }}>
                        <Col>
                            <FormGroup >
                                <Select
                                    id={key}
                                    value={state_DropDown_select}
                                    options={StateValues}
                                    onChange={(event) => handllerState(event, user, key)}
                                />
                            </FormGroup>
                        </Col>
                    </div> :
                    SelectFieldName.label === "IsDivision" ?

                        <Col md={2} style={{ marginTop: '9px' }} >
                            <div className="form-check form-switch form-switch-md mb-3">
                                <Input type="checkbox" className="form-check-input"
                                    id={key}
                                    defaultChecked={user.IsDivision}
                                    onChange={(event) => divisionhandler(event, user)}
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
                                        placeholder="Enter New Value"
                                        defaultValue={user.Newvalue}
                                        className="col col-sm "
                                        onChange={(event) => tableSelectHandler(event, user)}
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
        formatter: (cellContent, user, key) => (
            <>
                <div style={{ width: "180px" }}>
                    <Col>
                        <FormGroup >
                            <Select
                                id={`id${key}`}
                                value={district_dropdown_Select}
                                options={DistrictOnStateValues}
                                onChange={(event) => handllerDistrictOnState(event, user)}
                            />
                        </FormGroup>
                    </Col>
                </div>
            </>
        ),
    }


    pagesListColumns.push(Newvalue)
    const dateColumn = {
        text: " New FSSAIExipry",
        dataField: "",
        formatter: (cellContent, user, key) => (
            <>
                <div style={{ width: "180px" }} >
                    <Col sm={12}>
                        <FormGroup sm={6}>
                            <C_DatePicker
                                id={key}
                                name='fromdate'
                                onChange={(event) => fromdateOnchange(event, user)}
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

    const SaveHandler = (event) => {

        const arr1 = []
        event.preventDefault();
        const btnId = event.target.id
        try {
            btnIsDissablefunc({ btnId, state: true })
            Data.forEach(i => {
                if (i.Newvalue || i.NewFSSAIExipry || i.NewDistrict) {
                    const arr = {
                        SubPartyID: i.SubPartyID,
                        Value1: i.Newvalue,
                        Value2: i.NewFSSAIExipry,
                        Value2: i.NewDistrict,
                        party: i.PartyName
                    }
                    arr1.push(arr)
                }
            })

            const jsonBody = JSON.stringify({
                PartyID: loginPartyID(),
                Type: SelectFieldName.label,
                UpdateData: arr1

            });

            if (pageMode === mode.edit) {
                dispatch(updatePartyMasterBulkID({ jsonBody, updateId: values.id, btnId }));
            }
            else {

                if (arr1.length <= 0) {
                    customAlert({
                        Type: 3,
                        Message: "Update At least One Field",
                    })
                    btnIsDissablefunc({ btnId, state: false })
                } else {
                    const invalidMsg1 = []
                    arr1.forEach((i) => {

                        if ((SelectFieldName.label === "MobileNo")) {
                            const regexExp1 = /^[6-9]\d{9}$/gi;
                            const IsMobile = regexExp1.test(i.Value1)
                            if (!IsMobile) {

                                invalidMsg1.push(`InValid Mobile No ${i.party}`)
                            }
                        };
                        if ((SelectFieldName.label === "Email")) {
                            const regexExp2 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                            const IsEmail = regexExp2.test(i.Value1)
                            if (!IsEmail) {
                                invalidMsg1.push(`InValid Email ${i.party} `)
                            }
                        };

                        if ((SelectFieldName.label === "PAN")) {
                            const regexExp3 = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
                            const IsPan = regexExp3.test(i.Value1)
                            if (!IsPan) {
                                invalidMsg1.push(`InValid Pan No ${i.party}`)
                            }
                        };

                        if ((SelectFieldName.label === "GSTIN")) {
                            const regexExp4 = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
                            const IsGSTIN = regexExp4.test(i.Value1)
                            if (!IsGSTIN) {
                                invalidMsg1.push(`InValid GSTIN No ${i.party}`)
                            }
                        };

                        if ((SelectFieldName.label === "Name")) {
                            const regexExp5 = /^[A-Za-z]+$/
                            const IsName = regexExp5.test(i.Value1)
                            if (!IsName) {
                                invalidMsg1.push(`InValid Name ${i.party}`)
                            }
                        };

                    })
                    if (invalidMsg1.length > 0) {
                        customAlert({
                            Type: 3,
                            Message: invalidMsg1.toString()
                        })
                        return btnIsDissablefunc({ btnId, state: false })
                    }

                    dispatch(postParty_Master_Bulk_Update({ jsonBody, btnId }));
                }

            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };


    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                  <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginTop: IsEditMode_Css, }}>
                    <Container fluid>
                        {/* <Card className="text-black"> */}
                        {/* <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader> */}

                        {/* <CardBody className=" vh-10 0 text-black c_card_header" > */}
                        <form noValidate>
                            <Row>
                                <Col md={12}>
                                    <Card style={{ marginBottom: "6px" }}>
                                        <CardBody className="c_card_header text-black">
                                            <Row>
                                                <Col sm={3} >
                                                    <FormGroup className=" row" >
                                                        <Label className="mt-1"
                                                            style={{ width: "95px" }}>SelectField </Label>
                                                        <div className="col col-7 sm-1">
                                                            <Select
                                                                name="SelectField"
                                                                value={val}
                                                                isSearchable={true}
                                                                className="react-dropdown"
                                                                classNamePrefix="dropdown"
                                                                options={SelectFieldDropdown_options}
                                                                onChange={(event) => SelectFieldHandler(event)}
                                                            />
                                                            {isError.SelectField.length > 0 && (
                                                                <span className="text-danger f-8"><small>{isError.SelectField}</small></span>
                                                            )}
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
                                                                classNamePrefix="dropdown"
                                                                options={RouteName_Options}
                                                                // onChange={(e) => { setRouteSelect(e) }}
                                                                onChange={RoutesNameOnchange}

                                                            />
                                                            {isError.RoutesName.length > 0 && (
                                                                <span className="text-danger f-8"><small>{isError.RoutesName}</small></span>
                                                            )}
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
                                                                options={PartyDropdown_Options}
                                                                // onChange={(e) => { setParty(e) }}
                                                                onChange={partyOnchange}

                                                            />
                                                        </div>
                                                        {isError.PartyName.length > 0 && (
                                                            <span className="text-danger f-8"><small>{isError.PartyName}</small></span>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                <Col sm={1}>
                                                    <div className="col col-1 px-5">
                                                        < Go_Button onClick={(e) => goButtonHandler()} />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

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
                                                    {mySearchProps(toolkitProps.searchProps)}
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

                            {Data.length > 0 ? <FormGroup style={{ marginTop: "-25px" }}>
                                <Row >
                                    <Col sm={2} className="mt-n4">
                                        <SaveButton pageMode={pageMode}
                                            onClick={SaveHandler}
                                            userAcc={userPageAccessState}
                                            module={"PartyMasterBulkUpdate"}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup >
                                : null
                            }
                        </form>
                        {/* </CardBody> */}
                        {/* </Card> */}
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


export default PartyMasterBulkUpdate

