import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import C_Report from "../../components/Common/C_Report";
import { StockProcessing_API_Success, StockProcessing_Action, stockReport_1_GoButton_API, stockReport_1_GoButton_API_Success } from "../../store/Report/StockReport/action";
import { commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getBaseUnit_ForDropDownSuccess, getpdfReportdata } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { StockReport_1_GoBtn_API } from "../../helpers/backend_helper";
import * as report from '../ReportIndex'
import * as XLSX from 'xlsx';
import { ExcelDownloadFunc } from "../ExcelDownloadFunc";

const StockReport_1 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [unitDropdown, setUnitDropdown] = useState("");
    const [tableData, setTableData] = useState([]);

    const [btnMode, setBtnMode] = useState(0);

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.PdfReportReducers.goBtnLoading,
            stockProcessingLoading: state.StockReportReducer.stockProcessingLoading,
            StockProcessingBtn: state.StockReportReducer.StockProcessingBtn,
            StockReport_1_Gobtb: state.StockReportReducer.StockReport_1_Gobtb,
            pdfdata: state.PdfReportReducers.pdfdata,
            BaseUnit: state.ItemMastersReducer.BaseUnit,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
    const { StockReport_1_Gobtb, pdfdata, pageField } = reducers
    console.log(pdfdata)
    const { userAccess, BaseUnit, StockProcessingBtn, } = reducers;
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
        dispatch(commonPageField(pageId.STOCK_REPORT_1));
        dispatch(getBaseUnit_ForDropDown());
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(stockReport_1_GoButton_API_Success([]))
            dispatch(getBaseUnit_ForDropDownSuccess([]));
        }

    }, [])

    useEffect(() => {
        if (tableData.length === 0) {
            setBtnMode(0)
        }
    }, [tableData]);

    useEffect(() => {
        try {

            if ((StockReport_1_Gobtb.Status === true) && (StockReport_1_Gobtb.StatusCode === 200)) {
                setBtnMode(0);
                const { StockDetails } = StockReport_1_Gobtb.Data[0]
                if (btnMode === 2) {
                    ExcelDownloadFunc({      // Download CSV
                        pageField,
                        excelData: StockDetails,
                        excelFileName: "SNS Report"
                    })
                    dispatch(stockReport_1_GoButton_API_Success([]));
                }
            }

            else if ((StockReport_1_Gobtb.Status === true) && (StockReport_1_Gobtb.StatusCode === 204)) {
                customAlert({
                    Type: 3,
                    Message: "Records Not available ",
                })
                setBtnMode(0);
                dispatch(stockReport_1_GoButton_API_Success([]));
                return
            }
            setBtnMode(0);
        }
        catch (e) { console.log(e) }

    }, [StockReport_1_Gobtb]);

    useEffect(() => {
        try {
            if (btnMode === 1) {
                if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
                    customAlert({
                        Type: 3,
                        Message: "Records Not available ",
                    })
                    setBtnMode(0);
                    return
                }
            }
            setBtnMode(0);
            dispatch(stockReport_1_GoButton_API_Success([]));
        }
        catch (e) { console.log(e) }

    }, [pdfdata]);

    useEffect(async () => {

        if ((StockProcessingBtn.Status === true) && (StockProcessingBtn.StatusCode === 200)) {
            dispatch(StockProcessing_API_Success([]))
            customAlert({
                Type: 1,
                Message: StockProcessingBtn.Message,
            })

        }
        else if (StockProcessingBtn.Status === true) {
            dispatch(StockProcessing_API_Success([]))
            customAlert({
                Type: 4,
                Message: JSON.stringify(StockProcessingBtn.Message),
            })
        }
    }, [StockProcessingBtn])

    const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
        .map(data => ({
            value: data.id,
            label: data.Name
        }));

    function StockProccessHandler() {

        const btnId = `gobtn-${url.STOCK_REPORT_1}`
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": _cfunc.loginPartyID(),
        });
        dispatch(StockProcessing_Action({ jsonBody, btnId }))
    }

    function excel_And_GoBtnHandler(e, btnMode) {

        setBtnMode(btnMode);
        if (unitDropdown === "") {
            customAlert({
                Type: 4,
                Message: "Please Select Unit"
            })
            setBtnMode(0);
            return
        }
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Unit": unitDropdown.value,
            "Party": _cfunc.loginPartyID(),
        });

        let config = { ReportType: report.Stock, jsonBody }
        if (btnMode === 2) {
            dispatch(stockReport_1_GoButton_API(config))
        }
        else {
            dispatch(getpdfReportdata(StockReport_1_GoBtn_API, config))
        }
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
                <div className="px-2 c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={2}>
                            <FormGroup className=" mb-2 row mt-3 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "66px" }}>FromDate</Label>
                                <Col sm={7}>
                                    <C_DatePicker
                                        name='fromdate'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={2}>
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "60px" }}>ToDate</Label>
                                <Col sm={7}>
                                    <C_DatePicker
                                        nane='todate'
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3}>
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-2 p-2"
                                    style={{ width: "85px" }}>Unit</Label>
                                <Col sm={7}>
                                    <C_Select
                                        name="Unit"
                                        value={unitDropdown}
                                        isDisabled={tableData.length > 0 && true}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={BaseUnit_DropdownOptions}
                                        onChange={(e) => { setUnitDropdown(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col sm={1} className="mt-3 ml-5 px-2 p-1">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={reducers.stockProcessingLoading}
                                className="btn btn-outline-info border-1 font-size-10 text-center"
                                onClick={() => StockProccessHandler()}
                            >
                                Stock Process
                            </C_Button>
                        </Col>

                        <Col sm={1} className="mt-3" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                className="btn btn-success"
                                onClick={(e) => excel_And_GoBtnHandler(e, 1)}
                            >
                                Print
                            </C_Button>

                        </Col>

                        <Col sm={2} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && true}
                                className="btn btn-primary"
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel Download
                            </C_Button>
                        </Col>

                    </div>

                </div>

            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default StockReport_1;