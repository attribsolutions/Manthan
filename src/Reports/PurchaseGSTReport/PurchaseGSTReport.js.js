import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Select from "react-select";
import { postPurchaseGSTReport_API, postPurchaseGSTReport_API_Success } from "../../store/Report/PurchaseGSTRedux/action";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { mode, url, pageId } from "../../routes/index"
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";

const PurchaseGSTReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const isSCMParty = _cfunc.loginIsSCMParty();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        CheckSelect: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [GSTRateWise, setGSTRateWise] = useState(false);
    const [PartyDropdown, setPartyDropdown] = useState("");
    const [btnMode, setBtnMode] = useState("");

    const reducers = useSelector(
        (state) => ({
            tableData: state.PurchaseGSTReportReducer.PurchaseGSTGobtn,
            ExcelBtnLoading: state.PurchaseGSTReportReducer.ExcelBtnLoading,
            GoBtnLoading: state.PurchaseGSTReportReducer.GoBtnLoading,
            Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

    const { userAccess, tableData, ExcelBtnLoading, GoBtnLoading, Distributor, pageField } = reducers;
    const { PurchaseGSTDetails = [], PurchaseGSTRateWiseDetails = [] } = tableData;

    const values = { ...state.values }

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

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

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.PURCHASE_GST_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(postPurchaseGSTReport_API_Success([]));
        }
    }, [])

    const [tableColumns] = DynamicColumnHook({ pageField });

    const updatedTableColumns = GSTRateWise
        ? tableColumns.filter(column => (
            column.dataField !== "Name" &&
            column.dataField !== "InvoiceNumber" &&
            column.dataField !== "InvoiceDate" &&
            column.dataField !== "FullInvoiceNumber" &&
            column.dataField !== "DiscountAmount" &&
            column.dataField !== "GSTRate"
        ))
        : tableColumns;

    const Party_Option = Distributor.map(i => ({
        value: i.id,
        label: i.Name
    }));

    function excel_And_GoBtnHandler(e, btnMode) {
        setBtnMode(btnMode)
        try {
            if (isSCMParty && PartyDropdown === "") {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            }

            const jsonBody = JSON.stringify({
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Party": PartyDropdown === "" ? _cfunc.loginPartyID() : PartyDropdown.value,
                "GSTRatewise": GSTRateWise ? 1 : 0
            });

            dispatch(postPurchaseGSTReport_API_Success([]));
            dispatch(postPurchaseGSTReport_API({ jsonBody }));

        } catch (error) {
            _cfunc.CommonConsole(error);
        }
    }

    useEffect(() => {
        if (btnMode === "excel") {

            if ((PurchaseGSTRateWiseDetails.length > 0) || (PurchaseGSTDetails.length > 0)) {
                const removeIdField = (arr) => {
                    arr.forEach(item => {
                        delete item.id;
                    });
                };
                removeIdField(PurchaseGSTRateWiseDetails);
                removeIdField(PurchaseGSTDetails);

                ExcelReportComponent({      // Download CSV
                    excelTableData: GSTRateWise ? PurchaseGSTRateWiseDetails : PurchaseGSTDetails,
                    excelFileName: "Purchase GST Report",
                    numericHeaders: ['InvoiceNumber', 'GSTRate', 'GSTPercentage', 'CGST', 'SGST', 'IGST', 'GSTAmount', 'DiscountAmount', 'TaxableValue', 'TotalValue'],
                    dateHeader: 'InvoiceDate',
                    lastRowStyle: true
                })
                dispatch(postPurchaseGSTReport_API_Success([]));
            }
        }
    }, [tableData]);

    const partyOnchange = (e) => {
        setPartyDropdown(e)
        dispatch(postPurchaseGSTReport_API_Success([]));
    }

    const rowStyle = (row, rowIndex) => {

        if ((PurchaseGSTRateWiseDetails.length - 1) === rowIndex) {
            const style = {};
            style.backgroundColor = 'rgb(239, 239, 239)';
            style.fontWeight = 'bold';
            style.fontSize = '4';
            return style;
        }
        if ((PurchaseGSTDetails.length - 1) === rowIndex) {
            const style = {};
            style.backgroundColor = 'rgb(239, 239, 239)';
            style.fontWeight = 'bold';
            style.fontSize = '4';
            return style;
        }
    };

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        dispatch(postPurchaseGSTReport_API_Success([]));
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        dispatch(postPurchaseGSTReport_API_Success([]));
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={2} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "78px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={2} className="">
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={2} >
                            <FormGroup className="mb- row mt-3 mb-2">
                                <Label style={{ width: "110px" }} className="col-4 p-2" >GST Rate Wise</Label>
                                <Col sm="2" className=" mt-2 ">
                                    <Input type="checkbox"
                                        className="p-2"
                                        checked={GSTRateWise}
                                        onChange={(e) => { setGSTRateWise(e.target.checked) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {isSCMParty &&
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "50px", marginRight: "20px" }}>Party</Label>
                                    <Col sm="8">
                                        <Select
                                            name="Party"
                                            value={PartyDropdown}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => { partyOnchange(e) }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        }

                        <Col sm={1} className="mt-3 ">

                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && btnMode === "showOnTable")}
                                className="btn btn-success   "
                                onClick={(e) => excel_And_GoBtnHandler(e, "showOnTable")}
                            >
                                Show
                            </C_Button>

                        </Col>
                        <Col sm={2} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(ExcelBtnLoading && btnMode === "excel")}
                                className="btn btn-primary  "
                                onClick={(e) => excel_And_GoBtnHandler(e, "excel")}
                            >
                                Excel Download
                            </C_Button>
                        </Col>

                    </div>
                </div>

                <ToolkitProvider
                    keyField={"id"}
                    data={GSTRateWise ? PurchaseGSTRateWiseDetails : PurchaseGSTDetails}
                    columns={updatedTableColumns}
                    search
                >
                    {(toolkitProps,) => (
                        <React.Fragment>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            defaultSorted={[{
                                                dataField: 'id',
                                                order: 'asc'
                                            }]}
                                            rowStyle={rowStyle}
                                            classes={"table  table-bordered table-hover"}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Record Not available
                                                </div>
                                            }
                                            onDataSizeChange={({ dataSize }) => {
                                                dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                                // dispatch(BreadcrumbShowCountlabel(`Count:${dataSize > 0 ? dataSize - 1 : 0}`));
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
            </div>

        </React.Fragment >
    )
}

export default PurchaseGSTReport;