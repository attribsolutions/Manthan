

import React, { useEffect, useState } from 'react'
import { Col, FormGroup, Row, Label } from 'reactstrap'
import { C_DatePicker, C_Select } from '../../CustomValidateForm'
// import ToolkitProvider from 'react-bootstrap-table2-toolkit'
// import BootstrapTable from 'react-bootstrap-table-next'
import { C_Button } from '../../components/Common/CommonButton'
import GlobalCustomTable from '../../GlobalCustomTable'
import { MetaTags } from 'react-meta-tags'
import * as _cfunc from "../../components/Common/CommonFunction";
import DynamicColumnHook from '../../components/Common/TableCommonFunc'
import { useSelector, useDispatch } from 'react-redux'
import { BillDeleteSummaryReport_GoButton_API, BillDeleteSummaryReport_GoButton_API_Success } from '../../store/SweetPOSStore/Report/BillDeleteSummaryRedux/action'
// import { BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API } from '../../store/SweetPOSStore/Report/BillDeleteSummaryRedux/actionType'
import { ExcelReportComponent } from '../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS'
import { useLocation } from 'react-router-dom';
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldList, commonPageFieldListSuccess, commonPageFieldSuccess, getpdfReportdataSuccess, } from '../../store/actions'
import { pageId } from '../../routes'
import * as report from '../../Reports/ReportIndex'

import { allLabelWithBlank, allLabelWithZero } from '../../components/Common/CommonErrorMsg/HarderCodeData'
import { CashierName_Api } from '../../helpers/backend_helper'
import C_Report from '../../components/Common/C_Report'



const BillDeleteSummaryReport = (props) => {


    const dispatch = useDispatch();

    const location = useLocation();
    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);
    const [mode] = useState("default"); // or whatever initial value you expect
    const IsMannagementParty = !_cfunc.loginUserIsFranchisesRole() && _cfunc.loginIsSCMParty();

    const currentDate_ymd = _cfunc.date_ymd_func();
    const [fromDate, setFromDate] = useState(currentDate_ymd)
    const [toDate, setToDate] = useState(currentDate_ymd)
    const [CashierOption, setCashierOption] = useState([])
    const [userPageAccessState, setUserAccState] = useState('');
    const [Cashier, setCashier] = useState([allLabelWithZero])


    // const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)





    const {
        BillDeleteSummaryData,
        pageField,
        userAccess,
        listBtnLoading,
        partyDropdownLoading,
        Party

    } = useSelector((state) => ({
        // CashierSummary: state.BillDeleteSummaryReportReducer?.CashierSummary,
        BillDeleteSummaryData: state.BillDeleteSummaryReportReducer.BillDeleteSummaryData,
        listBtnLoading: state.BillDeleteSummaryReportReducer.listBtnLoading,
        partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const PartyDrodownOnChange = (e) => {
        setPartyDropdown(e);
        setCashier([allLabelWithZero]);
    };

    const { Data = [] } = BillDeleteSummaryData

    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null));
        dispatch(commonPageField(pageId.BILL_DELETE_SUMMARY_REPORT));

        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(BillDeleteSummaryReport_GoButton_API_Success([]));
        }
    }, []);



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

        if (BillDeleteSummaryData.goBtnMode === "Print") {

            const Details = _cfunc.loginUserDetails()
            let config = { rowData: { Data: [] } }
            config.rowData["ReportType"] = report.billDeleteSummaryReport
            config.rowData["Status"] = BillDeleteSummaryData.Status
            config.rowData["StatusCode"] = BillDeleteSummaryData.StatusCode
            config.rowData["Data"] = BillDeleteSummaryData.Data
            config.rowData["Data"]["SupplierName"] = IsMannagementParty ? PartyDropdown.label : Details.PartyName

            config.rowData["Data"]["Date"] = `From  ${_cfunc.date_dmy_func(fromDate)}  To  ${_cfunc.date_dmy_func(toDate)}`




            dispatch(getpdfReportdataSuccess(config.rowData))

            dispatch(BillDeleteSummaryReport_GoButton_API_Success([]));   // Reset Excel tableData

        }


        if (BillDeleteSummaryData.goBtnMode === "downloadExcel") {

            ExcelReportComponent({      // Download CSV
                pageField,
                excelTableData: Data,
                excelFileName: "Bill Delete Summary Report"
            })
            dispatch(BillDeleteSummaryReport_GoButton_API_Success([]));   // Reset Excel tableData

        }
        dispatch(BreadcrumbShowCountlabel(`Count:${Data.length} currency_symbol ${_cfunc.TotalAmount_Func(Data)}`));
    }, [BillDeleteSummaryData]);

    // billDeleteSummaryReport

    useEffect(async () => {
        if (((IsMannagementParty) && (PartyDropdown.value !== "")) || (!IsMannagementParty)) {
            const Resp = await CashierName_Api({
                jsonBody: JSON.stringify({
                    Party: IsMannagementParty ? PartyDropdown.value : _cfunc.loginSelectedPartyID(),
                })
            })

            setCashierOption(Resp?.Data)
        }
    }, [PartyDropdown.value])
    const Party_Option = Party
        .filter(i => i.PartyTypeID === 19) // filter before map for better performance
        .map(i => ({
            value: i.id,
            label: i.Name,
            PartyType: i.PartyType
        }));
    Party_Option.unshift(allLabelWithZero);


    const CashierOnchange = (e) => {
        if (e.length === 0) {
            e = [allLabelWithZero]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setCashier(e)
    }

    function goButtonHandler(goBtnMode) {
        debugger
        try {
            const jsonBody = JSON.stringify({
                FromDate: fromDate,
                ToDate: toDate,
                Cashier: Cashier.map(row => row.value).join(','),
                Party: IsMannagementParty ? PartyDropdown.value : _cfunc.loginSelectedPartyID(),
            })
            const config = { jsonBody, goBtnMode };
            dispatch(BillDeleteSummaryReport_GoButton_API(config))

        } catch (error) { _cfunc.CommonConsole(error) }
    }


    function fromdateOnchange(e, date) {
        setFromDate(date)
        dispatch(BillDeleteSummaryReport_GoButton_API_Success([]));
    }

    function todateOnchange(e, date) {
        setToDate(date);
        dispatch(BillDeleteSummaryReport_GoButton_API_Success([]));
    }



    return (
        <React.Fragment>

            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={2} className="">
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

                        <Col sm={2} className="">
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

                        {IsMannagementParty && < Col className="">
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
                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Cashier</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Cashier"
                                        value={Cashier}
                                        isSearchable={true}
                                        isMulti={true}
                                        // isLoading={partyDropdownLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={CashierOption}
                                        onChange={(e) => { CashierOnchange(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col className=" d-flex justify-content-end " >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading === "showOnTable"}
                                className="btn btn-success m-3 mr"
                                onClick={() => goButtonHandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading === "Print"}
                                className="btn btn-primary m-3 mr "
                                onClick={() => goButtonHandler("Print")}
                            >
                                Print
                            </C_Button>

                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading === "downloadExcel"}
                                className="btn btn-primary m-3 mr "
                                onClick={() => goButtonHandler("downloadExcel")}
                            >
                                Excel
                            </C_Button>
                        </Col>


                    </Row>

                </div>
                <div className="mb-1">
                    <GlobalCustomTable
                        keyField={"id"}
                        data={Data}
                        columns={tableColumns}
                        id="table_Arrow"
                        noDataIndication={
                            <div className="text-danger text-center ">
                                Items Not available
                            </div>
                        }

                    />
                </div>

            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default BillDeleteSummaryReport