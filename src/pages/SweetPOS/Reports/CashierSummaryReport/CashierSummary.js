import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../../components/Common/CommonButton";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../../store/actions";
import DynamicColumnHook from "../../../../components/Common/TableCommonFunc";
import { getClaimTrackingEntrySuccess } from "../../../../store/Accounting/ClaimTrackingEntryRedux/action";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import { ExcelReportComponent } from "../../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { CashierSummaryReport_GoButton_API, CashierSummaryReport_GoButton_API_Success } from "../../../../store/SweetPOSStore/Report/CashierSummaryRedux/action";

const CashierSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [fromDate, setFromDate] = useState(currentDate_ymd)
    const [toDate, setToDate] = useState(currentDate_ymd)

    const [userPageAccessState, setUserAccState] = useState('');

    const [btnMode, setBtnMode] = useState("");

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const {
        userAccess,
        tableData,
        GoBtnLoading,
        pageField
    } = useSelector((state) => ({
        tableData: state.CashierSummaryReportReducer.CashierSummary,
        GoBtnLoading: state.CashierSummaryReportReducer.listBtnLoading,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const { Data = [] } = tableData;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.CASHIER_SUMMARY_REPORT));

        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(CashierSummaryReport_GoButton_API_Success([]));
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
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    const [tableColumns] = DynamicColumnHook({ pageField })


    useEffect(() => {
        if (btnMode === "downloadExcel") {
            if (Data.length > 0) {
                ExcelReportComponent({      // Download CSV
                    pageField,
                    excelTableData: Data,
                    excelFileName: "Cashier Summary Report"
                })
                dispatch(CashierSummaryReport_GoButton_API_Success([]));   // Reset Excel Data
            }
        }
    }, [Data, pageField]);

    function goButtonHandler(goBtnMode) {
        setBtnMode(goBtnMode)
        try {
            const jsonBody = JSON.stringify({
                "FromDate": fromDate,
                "ToDate": toDate,
                "Party": _cfunc.loginPartyID(),
            })
            const config = { jsonBody };
            dispatch(CashierSummaryReport_GoButton_API(config))

        } catch (error) { _cfunc.CommonConsole(error) }
    }



    function fromdateOnchange(e, date) {
        setFromDate(date)
        dispatch(getClaimTrackingEntrySuccess([]));
    }

    function todateOnchange(e, date) {
        setToDate(date);
        dispatch(getClaimTrackingEntrySuccess([]));
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">

                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={fromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={toDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={6} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={((GoBtnLoading) && (btnMode === "showOnTable")) && true}
                                className="btn btn-success m-3 mr"

                                onClick={() => goButtonHandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={((GoBtnLoading) && (btnMode === "downloadExcel")) && true}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("downloadExcel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>






                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={Data}
                        columns={tableColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField="id"
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Record Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {globalTableSearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                </div>

            </div>
        </React.Fragment >
    )
}

export default CashierSummary;