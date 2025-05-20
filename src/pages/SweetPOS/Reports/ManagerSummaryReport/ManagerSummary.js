import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../../components/Common/CommonButton";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getpdfReportdataSuccess } from "../../../../store/actions";
import DynamicColumnHook from "../../../../components/Common/TableCommonFunc";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import { ExcelReportComponent } from "../../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { ManagerSummaryReport_GoButton_API, ManagerSummaryReport_GoButton_API_Success } from "../../../../store/SweetPOSStore/Report/ManagerSummaryRedux/action";
import GlobalCustomTable from "../../../../GlobalCustomTable";
import C_Report from "../../../../components/Common/C_Report";
import * as report from '../../../../Reports/ReportIndex'
import { allLabelWithZero } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";


const ManagerSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const isFrenchise = _cfunc.loginUserIsFranchisesRole()
    const currentDate_ymd = _cfunc.date_ymd_func();
    const [fromDate, setFromDate] = useState(currentDate_ymd)
    const [toDate, setToDate] = useState(currentDate_ymd)
    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);

    const [userPageAccessState, setUserAccState] = useState('');
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)


    const {
        userAccess,
        GoButtonData,
        GoBtnLoading,
        pageField, Party,
        partyDropdownLoading
    } = useSelector((state) => ({
        GoButtonData: state.ManagerSummaryReportReducer.ManagerSummary,
        GoBtnLoading: state.ManagerSummaryReportReducer.listBtnLoading,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,

        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const { Data = [] } = GoButtonData

    const { OrderData = [], InvoiceData = [] } = Data[0] || {};

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.MANAGER_SUMMARY_REPORT));
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue());
        }
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(ManagerSummaryReport_GoButton_API_Success([]));
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

        if (GoButtonData.goBtnMode === "downloadExcel") {
            ExcelReportComponent({      // Download CSV
                pageField,
                excelTableData: GoButtonData.Data,
                excelFileName: "Manager Summary Report"
            })
            dispatch(ManagerSummaryReport_GoButton_API_Success([]));   // Reset Excel tableData

        } if (GoButtonData.goBtnMode === "Print") {
            const Details = _cfunc.loginUserDetails()

            GoButtonData["ReportType"] = report.Manager_Summary_Report;

            GoButtonData["Data"]["GSTIN"] = Details.GSTIN
            GoButtonData["Data"]["SupplierName"] = Details.PartyName
            GoButtonData["Data"]["Date"] = `From  ${_cfunc.date_dmy_func(fromDate)}  To  ${_cfunc.date_dmy_func(toDate)}`

            dispatch(getpdfReportdataSuccess(GoButtonData))

        }


    }, [GoButtonData, pageField]);



    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    })).filter(index => index.PartyType === "Franchises");

    Party_Option.unshift(allLabelWithZero);

    function goButtonHandler(goBtnMode) {

        try {
            const jsonBody = JSON.stringify({
                "FromDate": fromDate,
                "ToDate": toDate,
                "Party": _cfunc.loginSelectedPartyID(),
            })
            const config = { jsonBody, goBtnMode };
            dispatch(ManagerSummaryReport_GoButton_API(config))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setFromDate(date)
        dispatch(ManagerSummaryReport_GoButton_API_Success([]));
    }

    function todateOnchange(e, date) {
        setToDate(date);
        dispatch(ManagerSummaryReport_GoButton_API_Success([]));
    }
    function PartyDrodownOnChange(e) {
        setPartyDropdown(e);
    }

    const InvoiceColumns = [





        {//------------- ItemName column ----------------------------------
            text: "Invoice Number",
            dataField: "FullInvoiceNumber",
        },

        {//------------- ItemName column ----------------------------------
            text: "Advance Amount",
            dataField: "AdvanceAmount",
            align: "right",
        },

        {//------------- ItemName column ----------------------------------
            text: "Balance Amount",
            dataField: "GrandTotal",
            align: "right",
        },

        {//------------- ItemName column ----------------------------------
            text: "Invoice Amount",
            dataField: "TotalAmount",
            align: "right",
        },



    ];


    // Manager_Summary_Report

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

                        {!isFrenchise && < Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Party"
                                        value={PartyDropdown}
                                        isSearchable={true}

                                        isLoading={partyDropdownLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Party_Option}
                                        onChange={PartyDrodownOnChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>}


                        <Col sm={!isFrenchise ? 3 : 6} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={GoBtnLoading === "showOnTable"}
                                className="btn btn-success m-3 mr"
                                onClick={() => goButtonHandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                            {/* <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={GoBtnLoading === "downloadExcel"}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("downloadExcel")}
                            >
                                Excel
                            </C_Button> */}
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={GoBtnLoading === "Print"}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("Print")}
                            >
                                Print
                            </C_Button>
                        </Col>
                    </Row>
                </div>

                <div className="mb-1 table-responsive table">
                    <GlobalCustomTable
                        keyField={"id"}
                        data={GoButtonData.goBtnMode === "showOnTable" ? OrderData : []}
                        columns={tableColumns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Record Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount, filteredData = [] }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${_cfunc.TotalAmount_Func(filteredData)}`));
                        }}
                    />
                </div>

                <div className="mb-1 table-responsive table">
                    <GlobalCustomTable
                        keyField={"id"}
                        data={GoButtonData.goBtnMode === "showOnTable" ? InvoiceData : []}
                        columns={InvoiceColumns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Record Not available
                            </div>
                        }
                        onDataSizeChange={({ dataCount, filteredData = [] }) => {
                            dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${_cfunc.TotalAmount_Func(filteredData)}`));
                        }}
                    />
                </div>
            </div>
            <C_Report />
        </React.Fragment >

    )
}

export default ManagerSummary;