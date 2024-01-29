import React, { useEffect, useState } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, Breadcrumb_inputName, commonPageFieldSuccess } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    resetFunction,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { C_Button, Change_Button, Go_Button, SaveButton } from "../../../components/Common/CommonButton";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import { GetRoutesList } from "../../../store/Administrator/RoutesRedux/actions";
import { invoiceListGoBtnfilter } from "../../../store/Sales/Invoice/action";
import { getVehicleList } from "../../../store/Administrator/VehicleRedux/action";
import {
    LoadingSheet_GoBtn_API,
    LoadingSheet_GoBtn_API_Succcess,
    SaveLoadingSheetMaster,
    SaveLoadingSheetMasterSucccess
} from "../../../store/Sales/LoadingSheetRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { getDriverList, getDriverListSuccess } from "../../../store/Administrator/DriverRedux/action";
import { selectAllCheck } from "../../../components/Common/TableCommonFunc";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { GetRoutesListSuccess } from "../../../store/Administrator/RoutesRedux/actions";
import { getVehicleListSuccess } from "../../../store/Administrator/VehicleRedux/action";
import NewCommonPartyDropdown from "../../../components/Common/NewCommonPartyDropdown";
import AddMaster from "../../Adminisrator/EmployeePages/Drodown";
import DropdownMaster from "./dropdownOpen";
import DriverMaster from "../../Adminisrator/DriverPage/DriverMaster";

const LoadingSheet = (props) => {

    const dispatch = useDispatch();
    const history = useHistory()
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        id: "",
        Date: currentDate_ymd,
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        RouteName: [],
        VehicleNumber: "",
        DriverName: ""
    }

    const [state, setState] = useState(initialFiledFunc(fileds))
    const [modal_scroll, setmodal_scroll] = useState(false);

    const {
        postMsg,
        pageField,
        userAccess,
        VehicleNumber = [],
        RoutesList,
        GoButton,
        Driver,
        saveBtnloading,
        goBtnloadingSpinner,
        commonPartyDropSelect
    } = useSelector((state) => ({
        saveBtnloading: state.LoadingSheetReducer.saveBtnloading,
        postMsg: state.LoadingSheetReducer.postMsg,
        goBtnloadingSpinner: state.LoadingSheetReducer.goBtnloadingSpinner,
        GoButton: state.LoadingSheetReducer.goBtnLoadingSheet,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        VehicleNumber: state.VehicleReducer.VehicleList,
        RoutesList: state.RoutesReducer.RoutesList,
        Driver: state.DriverReducer.DriverList,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    const { Data = [] } = GoButton;

    useEffect(() => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
        const page_Id = pageId.LOADING_SHEET
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            dispatch(GetRoutesList({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }));
            dispatch(getVehicleList({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }));
            dispatch(getDriverList({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }));
        }
        setState((i) => {
            let a = { ...i }
            a.values.RouteName = []
            a.values.VehicleNumber = ""
            a.values.DriverName = ''

            a.hasValid.RouteName.valid = true;
            a.hasValid.VehicleNumber.valid = true;
            a.hasValid.DriverName.valid = true;
            return a
        });
        return () => {
            dispatch(GetRoutesListSuccess([]));
            dispatch(getVehicleListSuccess([]));
            dispatch(getDriverListSuccess([]));
            dispatch(LoadingSheet_GoBtn_API_Succcess([]));
        }

    }, [commonPartyDropSelect]);

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`Count:${Data.length}`))
    }, [GoButton]);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

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
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
            setState(() => resetFunction(fileds, state))// Clear form values  
            dispatch(Breadcrumb_inputName(''))
            dispatch(LoadingSheet_GoBtn_API_Succcess([]))
            if (pageMode === mode.dropdownAdd) {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.LOADING_SHEET_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(SaveLoadingSheetMasterSucccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

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

    const VehicleNumber_Options = VehicleNumber.map((index) => ({
        value: index.id,
        label: index.VehicleNumber,
    }));

    const Driver_Options = Driver.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const pagesListColumns = [
        {
            text: "Invoice Date",
            dataField: "preInvoiceDate",
        },
        {
            text: "Invoice Number",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Customer",
            dataField: "Customer",
        },
        {
            text: "GrandTotal",
            dataField: "GrandTotal",
        },
    ];

    const onChangeBtnHandler = () => {
        dispatch(LoadingSheet_GoBtn_API_Succcess([]))
    }

    function goButtonHandler() {

        if (values.RouteName.length === 0) {
            customAlert({
                Type: 4,
                Status: true,
                Message: "RouteName Is Required",
            });
            return;
        }

        const isRoute = values.RouteName.filter(i => !(i.value === '')).map(obj => obj.value).join(','); //commas separate

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            Party: commonPartyDropSelect.value,
            Route: isRoute,
            LoadingSheetID: ""
        });
        dispatch(LoadingSheet_GoBtn_API(jsonBody));
    }

    const saveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id;

        const { totalInvoices, GrandTotal, LoadingSheetDetails } = Data.reduce(

            (acc, index) => {
                if (index.selectCheck === true) {
                    acc.totalInvoices++;
                    acc.GrandTotal += parseFloat(index.GrandTotal);
                    acc.LoadingSheetDetails.push({ Invoice: index.id });
                }
                return acc;
            },
            { totalInvoices: 0, GrandTotal: 0, LoadingSheetDetails: [] }
        );

        if (LoadingSheetDetails.length === 0) {
            customAlert({
                Type: 4,
                Status: true,
                Message: "Atleast One Invoice Is Select...!",
            });
            return;
        }

        try {

            if (formValid(state, setState)) {
                const isRoute = values.RouteName.filter(i => !(i.value === '')).map(obj => obj.value).join(',');
                const jsonBody = JSON.stringify({
                    Date: values.Date,
                    Party: commonPartyDropSelect.value,
                    Route: isRoute,
                    Vehicle: values.VehicleNumber.value,
                    Driver: values.DriverName.value,
                    TotalAmount: GrandTotal.toFixed(2),
                    InvoiceCount: totalInvoices,
                    CreatedBy: _cfunc.loginUserID(),
                    UpdatedBy: _cfunc.loginUserID(),
                    LoadingSheetDetails: LoadingSheetDetails
                });

                dispatch(SaveLoadingSheetMaster({ jsonBody, btnId }));
            }
        } catch (e) {
            _cfunc.CommonConsole(e);
        }
    };

    function DateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.Date = date;
            a.hasValid.Date.valid = true
            return a
        })
    }

    function FromDateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function ToDateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    const NavigateHandler = () => {
        setmodal_scroll(true);
    };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <NewCommonPartyDropdown pageMode={pageMode} />

                    <DropdownMaster
                        modal_scroll={modal_scroll}
                        setmodal_scroll={setmodal_scroll}
                        masterModal={DriverMaster}
                        masterPath={url.DRIVER}
                    />

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >

                            <div className=" row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Date}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='Date'
                                                value={values.Date}
                                                onChange={DateOnchange}
                                                options={{
                                                    maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6" onClick={NavigateHandler} className="labelHover">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.DriverName}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="DriverName"
                                                value={values.DriverName}
                                                isSearchable={true}
                                                className="react-dropdown "
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={Driver_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                            {isError.DriverName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.DriverName}</small></span>
                                            )}

                                        </Col>
                                        <Col sm="1" className="mx-6 mt-n2">
                                            {
                                                <AddMaster
                                                // masterModal={EmployeeTypesMaster}
                                                // masterPath={url.EMPLOYEETYPE}
                                                />

                                            }

                                        </Col>
                                    </FormGroup>
                                </Col >
                            </div>

                            <div className="  row ">
                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.FromDate} </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='FromDate'
                                                value={values.FromDate}
                                                disabled={Data.length > 0 && true}
                                                onChange={FromDateOnchange}
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.ToDate}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ToDate'
                                                value={values.ToDate}
                                                disabled={Data.length > 0 && true}
                                                onChange={ToDateOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >

                            </div>

                            <div className="row ">
                                {/* <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.RouteName} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="RouteName"
                                                value={values.RouteName}
                                                isSearchable={true}
                                                isMulti={true}
                                                isDisabled={Data.length > 0 && true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={RouteName_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />

                                        </Col>

                                    </FormGroup>
                                </Col > */}


                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.RouteName}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="RouteName"
                                                value={values.RouteName}
                                                isSearchable={true}
                                                isMulti={true}
                                                isDisabled={Data.length > 0 && true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={RouteName_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                        </Col>
                                        <Col sm="1" className="mx-6 mt-n2">
                                            {
                                                <AddMaster
                                                // masterModal={EmployeeTypesMaster}
                                                // masterPath={url.EMPLOYEETYPE}
                                                />

                                            }

                                        </Col>
                                    </FormGroup>
                                </Col >


                                <Row>
                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.RouteName}</Label>
                                            <Col sm="7">
                                                <Select
                                                    name="VehicleNumber"
                                                    value={values.VehicleNumber}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    options={VehicleNumber_Options}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                    }
                                                    }
                                                />
                                                {isError.VehicleNumber.length > 0 && (
                                                    <span className="text-danger f-8"><small>{isError.VehicleNumber}</small></span>
                                                )}
                                            </Col>
                                            <Col sm="1" className="mx-6 mt-n2">
                                                {
                                                    <AddMaster
                                                    // masterModal={EmployeeTypesMaster}
                                                    // masterPath={url.EMPLOYEETYPE}
                                                    />
                                                }

                                            </Col>
                                            <Col sm="1" className="mx-4 ">
                                                {!Data.length > 0 ?
                                                    < Go_Button loading={goBtnloadingSpinner} onClick={(e) => goButtonHandler()} />
                                                    : <Change_Button
                                                        onClick={(e) => onChangeBtnHandler()}
                                                    />
                                                }


                                            </Col>
                                        </FormGroup>
                                    </Col >
                                </Row>

                                {/* <Col sm="6">
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}> {fieldLabel.VehicleNumber}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="VehicleNumber"
                                                value={values.VehicleNumber}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                options={VehicleNumber_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                }
                                                }
                                            />
                                            {isError.VehicleNumber.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.VehicleNumber}</small></span>
                                            )}
                                        </Col>
                                        <Col sm="1" className="mx-4 ">
                                            {!Data.length > 0 ?
                                                < Go_Button loading={goBtnloadingSpinner} onClick={(e) => goButtonHandler()} />
                                                : <Change_Button
                                                    onClick={(e) => onChangeBtnHandler()}
                                                />
                                            }


                                        </Col>
                                    </FormGroup>
                                </Col > */}
                            </div>
                        </div>

                        <ToolkitProvider
                            keyField={"id"}
                            data={Data}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps,) => (
                                <React.Fragment>
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive table">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    id="table_Arrow"
                                                    selectRow={selectAllCheck({ tableList: Data })}
                                                    classes={"table  table-bordered table-hover"}
                                                    noDataIndication={
                                                        <div className="text-danger text-center ">
                                                            Record Not available
                                                        </div>
                                                    }
                                                    onDataSizeChange={(e) => {
                                                        _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                    }}
                                                    {...toolkitProps.baseProps}
                                                />
                                                {mySearchProps(toolkitProps.searchProps)}
                                            </div>
                                        </Col>
                                    </Row>

                                </React.Fragment>
                            )}
                        </ToolkitProvider>
                        {
                            Data.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-70px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            forceDisabled={goBtnloadingSpinner}
                                            onClick={saveHandler}
                                            userAcc={userPageAccessState}
                                        />

                                    </Col>
                                </FormGroup >
                                : null
                        }

                    </form >
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default LoadingSheet
