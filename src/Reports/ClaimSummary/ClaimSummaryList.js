import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../store/actions";
import { claimList_API, claimList_API_Success, deleteClaimSuccess, delete_Claim_ID } from "../../store/Report/ClaimSummary/action";
import * as report from '../ReportIndex'
import { getpdfReportdata, getpdfReportdataSuccess } from "../../store/Utilites/PdfReport/actions";
import { Col, FormGroup, Input, Label } from "reactstrap";
import CommonPurchaseList from "../../components/Common/CommonPurchaseList";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../routes/index"
import { PageLoadingSpinner } from "../../components/Common/CommonButton";
import ClaimSummaryMaster from "./ClaimSummaryMaster";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { ClaimSummary_API, MasterClaimSummary_API } from "../../helpers/backend_helper";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";
import { sideBarPageFiltersInfoAction } from "../../store/Utilites/PartyDrodown/action";

const SelectedMonth = () => _cfunc.getPreviousMonthAndYear({ date: new Date(), Privious: 1 })
const FirstAndLastDate = () => _cfunc.getFirstAndLastDateOfMonth(SelectedMonth());
const fileds = () => ({
    FromDate: FirstAndLastDate().firstDate,
    ToDate: FirstAndLastDate().lastDate,
    SelectedMonth: SelectedMonth(),
})

const ClaimSummaryList = () => {
    const dispatch = useDispatch();

    const [state, setState] = useState(() => initialFiledFunc(fileds()))

    const [jsonBody, setjsonBody] = useState({});
    const [pageMode] = useState(mode.defaultList);

    const currentDate = new Date(); // Current date
    const currentMonth = _cfunc.getPreviousMonthAndYear({ date: currentDate, Privious: 1 });

    const reducers = useSelector(
        (state) => ({
            deleteMsg: state.ClaimSummaryReducer.deleteMsg,
            tableList: state.ClaimSummaryReducer.ClaimListData,
            ClaimSummaryGobtn: state.ClaimSummaryReducer.ClaimSummaryGobtn,
            pdfdata: state.PdfReportReducers.pdfdata,
            listBtnLoading: (state.PdfReportReducers.ReportBtnLoading) || (state.ClaimSummaryReducer.CreateClaimLoading) || (state.ClaimSummaryReducer.DeleteBtnLoading),
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    const { pageField, pdfdata, deleteMsg } = reducers;
    const values = { ...state.values }

    const action = {
        getList: claimList_API,
        deleteId: delete_Claim_ID,
        deleteSucc: deleteClaimSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(pageId.CLAIM_SUMMARY_lIST))
        return () => {
            dispatch(claimList_API_Success([]));
        }
    }, []);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            MonthAndYearOnchange(values.SelectedMonth, "InitialDate")
        }
        else {
            dispatch(claimList_API_Success([]));
        }
    }, [commonPartyDropSelect]);

    // sideBar Page Filters Information
    useEffect(() => {
        const { monthName, year } = _cfunc.SelectedMonthAndYearName(values.SelectedMonth);
        dispatch(sideBarPageFiltersInfoAction([
            { label: "Month", content: `${monthName} ${year}` },
        ]));
    }, [values.SelectedMonth]);

    useEffect(() => {
        if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
            dispatch(getpdfReportdataSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: pdfdata.Message,
            })
            return
        }
    }, [pdfdata])

    useEffect(() => {
        if ((deleteMsg.Status === true) && (deleteMsg.StatusCode === 200)) {
            dispatch(deleteClaimSuccess({ Status: false }))
            dispatch(claimList_API(jsonBody))
            return
        }
    }, [deleteMsg])

    function downClaimBtnFunc(config) {
        const jsonBody = JSON.stringify({
            "FromDate": config.rowData.MonthStartDate,
            "ToDate": config.rowData.MonthEndDate,
            "Party": config.rowData.PartyID,
            "Mode": (config.btnmode === "ItemWiseSummary") ? 1 : 2,
        });
        let ReportData = {
            jsonBody,
            ToDate: config.rowData.MonthEndDate,
            FromDate: config.rowData.MonthStartDate,
            PartyName: config.rowData.PartyName,
            ClaimID: config.rowData.id,
            btnId: config.btnId
        }

        if (config.btnmode === "MastarClaimSummary") {
            ReportData["ReportType"] = report.MasterClaim;
            dispatch(getpdfReportdata(MasterClaimSummary_API, ReportData))
        }

        if ((config.btnmode === "CustomerWiseSummary") || (config.btnmode === "ItemWiseSummary")) {
            if (config.btnmode === "CustomerWiseSummary") {
                ReportData["ReportType"] = report.CustomerWiseClaim;
            } else {
                ReportData["ReportType"] = report.ItemWiseClaim;
            }
            dispatch(getpdfReportdata(ClaimSummary_API, ReportData))
        }
    }

    async function deleteBodyfunc(config) {
        const jsonBody = JSON.stringify({
            "FromDate": config.rowData.MonthStartDate,
            "ToDate": config.rowData.MonthEndDate,
            "Party": config.rowData.PartyID,
        });

        let DeleteData = { jsonBody, btnId: config.btnId }

        const isConfirmed = await customAlert({
            Type: 7,
            Message: alertMessages.deleteClaim,
        });

        if (isConfirmed) {
            dispatch(delete_Claim_ID(DeleteData))
        }
    }

    function MonthAndYearOnchange(e, InitialDate) {

        dispatch(claimList_API_Success([]))
        let selectedMonth = ""
        if (InitialDate) {
            selectedMonth = e
        } else {
            selectedMonth = e.target.value
        }

        //function to convert selected month and year to date format first and last date of month

        const { firstDate, lastDate } = _cfunc.getFirstAndLastDateOfMonth(selectedMonth);

        setState((i) => {
            const a = { ...i }
            a.values.FromDate = firstDate;
            a.hasValid.FromDate.valid = true
            a.values.ToDate = lastDate;
            a.hasValid.ToDate.valid = true
            a.values.SelectedMonth = selectedMonth;
            a.hasValid.SelectedMonth.valid = true
            return a
        })
        const jsonBody = JSON.stringify({
            "FromDate": firstDate,
            "ToDate": lastDate,
            "Party": commonPartyDropSelect.value
        });

        let config = { jsonBody, Type: "List", MonthStartDate: firstDate, MonthEndDate: lastDate }
        setjsonBody(config)
        dispatch(claimList_API(config))
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.loading || !pageField} />
            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={6}>
                            <FormGroup className="mb- row mt-2" >
                                <Label style={{ width: "83px" }} className="col-sm-1 p-2 ">Month</Label>
                                <Col sm={4}>
                                    <Input className="form-control"
                                        type="month"
                                        defaultValue={values.SelectedMonth}
                                        id="example-month-input"
                                        onChange={MonthAndYearOnchange}
                                        max={currentMonth}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            pageMode={pageMode}
                            masterPath={ClaimSummaryMaster}
                            newBtnPath={url.CLAIM_SUMMARY_MASTER}
                            downClaimBtnFunc={downClaimBtnFunc}
                            ButtonMsgLable={"Claim Summary"}
                            deleteName={"Claim Summary"}
                            MasterModal={ClaimSummaryMaster}
                            deleteBodyfunc={deleteBodyfunc}
                        />
                        : null
                }
            </div>

        </React.Fragment>
    )
}

export default ClaimSummaryList;