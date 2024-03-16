import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
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
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";
import { changeCommonPartyDropDetailsAction } from "../../store/Utilites/PartyDrodown/action";

const SNSReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [unitDropdown, setUnitDropdown] = useState({ value: 1, label: 'No' });
    const [PartyDropdown, setPartyDropdown] = useState("");
    const [btnMode, setBtnMode] = useState("");

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.PdfReportReducers.goBtnLoading,
            excelLoading: state.StockReportReducer.SR_GoBtnLoading,
            stockProcessingLoading: state.StockReportReducer.stockProcessingLoading,
            StockProcessingBtn: state.StockReportReducer.StockProcessingBtn,
            StockReport_1_Gobtb: state.StockReportReducer.StockReport_1_Gobtb,
            party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            pdfdata: state.PdfReportReducers.pdfdata,
            BaseUnit: state.ItemMastersReducer.BaseUnit,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );
    const { StockReport_1_Gobtb, pdfdata, pageField, party, goBtnLoading, excelLoading } = reducers

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
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue())
        }
        dispatch(changeCommonPartyDropDetailsAction({ isShow: false }))//change party drop-down show false
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(stockReport_1_GoButton_API_Success([]))
            dispatch(getBaseUnit_ForDropDownSuccess([]));
            dispatch(changeCommonPartyDropDetailsAction({ isShow: true }))//change party drop-down restore show state
        }
    }, [])

    useEffect(() => {
        try {

            if ((StockReport_1_Gobtb.Status === true) && (StockReport_1_Gobtb.StatusCode === 200)) {
                const { StockDetails } = StockReport_1_Gobtb.Data[0]
                if (btnMode === "excel") {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: StockDetails,
                        excelFileName: "SNS Report"
                    })
                    dispatch(stockReport_1_GoButton_API_Success([]));
                }
            }

            else if ((StockReport_1_Gobtb.Status === true) && (StockReport_1_Gobtb.StatusCode === 204)) {
                customAlert({
                    Type: 3,
                    Message: alertMessages.recordNotAvailable,
                })
                dispatch(stockReport_1_GoButton_API_Success([]));
                return
            }
        }
        catch (e) { }

    }, [StockReport_1_Gobtb]);

    useEffect(() => {
        try {
            if (btnMode === "print") {
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

    const Party_Option = party.map(i => ({
        value: i.id,
        label: i.Name
    }));

    const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
        .map(data => ({
            value: data.id,
            label: data.Name
        }));

    function StockProccessHandler() {

        const btnId = `gobtn-${url.STOCK_REPORT_1}`
        if ((isSCMParty) && (PartyDropdown === "")) {
            customAlert({ Type: 4, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        }
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": isSCMParty ? PartyDropdown.value : _cfunc.loginPartyID()
        });
        dispatch(StockProcessing_Action({ jsonBody, btnId }))
    }

    function excel_And_GoBtnHandler(e, btnMode) {
        setBtnMode(btnMode)
        if (unitDropdown === "") {
            customAlert({
                Type: 4,
                Message: alertMessages.selectUnit
            })
            return
        }
        if ((isSCMParty) && (PartyDropdown === "")) {
            customAlert({ Type: 4, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        }
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Unit": unitDropdown.value,
            "Party": isSCMParty ? PartyDropdown.value : _cfunc.loginPartyID()
        });

        let config = { ReportType: report.Stock, jsonBody }
        if (btnMode === "excel") {
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
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={isSCMParty ? 2 : 3} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='fromdate'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={isSCMParty ? 2 : 3} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        nane='todate'
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={isSCMParty ? 2 : 3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>Unit</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Unit"
                                        value={unitDropdown}
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
                        </Col>

                        {isSCMParty && <Col sm={3} >
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", }}>Party</Label>
                                <Col sm="7">
                                    <C_Select
                                        name="Party"
                                        value={PartyDropdown}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Party_Option}
                                        onChange={(e) => { setPartyDropdown(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        }
                        <Col sm={isSCMParty ? 3 : 3} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"

                                loading={reducers.stockProcessingLoading}
                                className="btn btn-outline-info border-1 font-size-10 text-center m-3  "
                                onClick={() => StockProccessHandler()}
                            >
                                Stock Process
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                className="btn btn-success m-3 mr"
                                loading={goBtnLoading}
                                onClick={(e) => excel_And_GoBtnHandler(e, "print")}
                            >
                                Print
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={excelLoading}
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

export default SNSReport;