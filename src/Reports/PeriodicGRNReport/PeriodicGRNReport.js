import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import C_Report from "../../components/Common/C_Report";
import { stockReport_1_GoButton_API_Success } from "../../store/Report/StockReport/action";
import { commonPageField, commonPageFieldSuccess, getpdfReportdata } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";

import { Periodic_GRN_Report, Periodic_GRN_Report_Success } from "../../store/Report/PeriodicGRNRedux/action";
import { Periodic_Grn_Report_Api } from "../../helpers/backend_helper";

const PeriodicGRNReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();


    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');



    const reducers = useSelector(
        (state) => ({
            BtnLoading: state.PdfReportReducers.BtnLoading,
            PrediocGrnData: state.PeriodicGrnReportReducer.PrediocGrnData,
            pdfdata: state.PdfReportReducers.pdfdata,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
    const { userAccess, BtnLoading, PrediocGrnData, pageField, pdfdata } = reducers

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

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
        dispatch(commonPageField(pageId.PERIODIC_GRN_REPORT_));
        return () => {
            dispatch(commonPageFieldSuccess(null));
        }
    }, [])

    useEffect(() => {
        try {
            if ((PrediocGrnData.Status === true) && (PrediocGrnData.StatusCode === 200)) {
                if (PrediocGrnData.BtnMode === "excel") {
                    ExcelReportComponent({
                        pageField,
                        excelTableData: PrediocGrnData.Data,
                        excelFileName: "Periodic GRN Report"
                    })
                    dispatch(Periodic_GRN_Report_Success({ status: false }));
                }
            }
            else if ((PrediocGrnData.Status === true) && (PrediocGrnData.StatusCode === 204)) {
                customAlert({
                    Type: 3,
                    Message: PrediocGrnData.Message,
                })
                dispatch(Periodic_GRN_Report_Success({ status: false }));
                return
            }
        }
        catch (e) { }

    }, [PrediocGrnData]);

    useEffect(() => {
        try {
            if (PrediocGrnData.BtnMode === "print") {
                if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
                    customAlert({
                        Type: 3,
                        Message: alertMessages.recordNotAvailable,
                    })
                    return
                }
            }
            dispatch(stockReport_1_GoButton_API_Success([]));
        }
        catch (e) { }

    }, [pdfdata]);


    function excel_And_GoBtnHandler(e, btnMode) {
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            // "Suppiler": _cfunc.loginSelectedPartyID()
            "Suppiler": 0

        });
        let config = { ReportType: report.PeriodicGRN, jsonBody, BtnMode: btnMode }

        dispatch(getpdfReportdata(Periodic_Grn_Report_Api, config))
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj)
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={5} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="5">
                                    <C_DatePicker
                                        name='fromdate'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={5} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>To Date</Label>
                                <Col sm="5">
                                    <C_DatePicker
                                        nane='todate'
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={2} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                className="btn btn-success m-3 mr"
                                // loading={goBtnLoading}
                                onClick={(e) => excel_And_GoBtnHandler(e, "print")}
                            >
                                Print
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                // loading={excelLoading}
                                className="btn btn-primary m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, "excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>



            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default PeriodicGRNReport;