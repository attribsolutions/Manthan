import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../../components/Common/CommonButton";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getpdfReportdataSuccess, getUserList } from "../../../../store/actions";
import DynamicColumnHook from "../../../../components/Common/TableCommonFunc";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import { ExcelReportComponent } from "../../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { CashierSummaryReport_GoButton_API, CashierSummaryReport_GoButton_API_Success } from "../../../../store/SweetPOSStore/Report/CashierSummaryRedux/action";
import GlobalCustomTable from "../../../../GlobalCustomTable";
import C_Report from "../../../../components/Common/C_Report";
import * as report from '../../../../Reports/ReportIndex'
import { allLabelWithBlank, allLabelWithZero } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";
import { CashierName_Api } from "../../../../helpers/backend_helper";


const CashierSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const [fromDate, setFromDate] = useState(currentDate_ymd)
    const [toDate, setToDate] = useState(currentDate_ymd)
    const [Cashier, setCashier] = useState([allLabelWithBlank])
    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero)
    const [CashierOption, setCashierOption] = useState([])

    const [userPageAccessState, setUserAccState] = useState('');
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)
    const IsMannagementParty = !_cfunc.loginUserIsFranchisesRole() && _cfunc.loginIsSCMParty();


    const {
        userAccess,
        GoButtonData,
        GoBtnLoading,
        pageField,

        Party
    } = useSelector((state) => ({
        GoButtonData: state.CashierSummaryReportReducer.CashierSummary,
        GoBtnLoading: state.CashierSummaryReportReducer.listBtnLoading,

        Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField

    }));

    const { Data = [] } = GoButtonData

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.CASHIER_SUMMARY_REPORT));
        dispatch(getUserList());
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

        if (GoButtonData.goBtnMode === "downloadExcel") {
            ExcelReportComponent({      // Download CSV
                pageField,
                excelTableData: GoButtonData.Data,
                excelFileName: "Cashier Summary Report"
            })
            dispatch(CashierSummaryReport_GoButton_API_Success([]));   // Reset Excel tableData

        } if (GoButtonData.goBtnMode === "Print") {
            const Details = _cfunc.loginUserDetails()

            GoButtonData["ReportType"] = report.Cashier_Summary_Report;

            GoButtonData["Data"]["GSTIN"] = Details.GSTIN
            GoButtonData["Data"]["SupplierName"] = Details.PartyName
            GoButtonData["Data"]["Date"] = `From  ${_cfunc.date_dmy_func(fromDate)}  To  ${_cfunc.date_dmy_func(toDate)}`

            dispatch(getpdfReportdataSuccess(GoButtonData))

        }


    }, [GoButtonData, pageField]);


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



    const Party_Option = useMemo(() => {
        let options = [];

        options = Party.map((i) => ({
            value: i.id,
            label: i.Name,
            GSTIN: i.GSTIN,
        }));
        options.unshift(allLabelWithZero);
        return options;
    }, [Party]);


    function goButtonHandler(goBtnMode) {
        debugger
        try {
            const jsonBody = JSON.stringify({
                FromDate: fromDate,
                ToDate: toDate,
                Party: IsMannagementParty ? PartyDropdown.value : _cfunc.loginSelectedPartyID(),
                Cashier: Cashier.map(row => row.value).join(',')
            })
            const config = { jsonBody, goBtnMode };
            dispatch(CashierSummaryReport_GoButton_API(config))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setFromDate(date)
        dispatch(CashierSummaryReport_GoButton_API_Success([]));
    }

    function todateOnchange(e, date) {
        setToDate(date);
        dispatch(CashierSummaryReport_GoButton_API_Success([]));
    }
    const CashierOnchange = (e) => {
        if (e.length === 0) {
            e = [allLabelWithBlank]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setCashier(e)
        dispatch(CashierSummaryReport_GoButton_API_Success([]));

    }

    const PartyOnchange = (e) => {
        setPartyDropdown(e)
        setCashier([allLabelWithBlank]);
        dispatch(CashierSummaryReport_GoButton_API_Success([]));

    }



    // Cashier_Summary_Report

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

                        {IsMannagementParty &&
                            <Col sm={3} className="">
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="Party"
                                            value={PartyDropdown}
                                            isSearchable={true}
                                            // isLoading={partyDropdownLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => { PartyOnchange(e) }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        }

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


                        <Col sm={2} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={GoBtnLoading === "showOnTable"}
                                className="btn btn-success m-3 mr"
                                onClick={() => goButtonHandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={GoBtnLoading === "downloadExcel"}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("downloadExcel")}
                            >
                                Excel
                            </C_Button>
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
                        data={GoButtonData.goBtnMode === "showOnTable" ? Data : []}
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
            </div>
            <C_Report />
        </React.Fragment >

    )
}

export default CashierSummary;