import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../store/actions";
import { claimList_API, claimList_API_Success, deleteClaimSuccess, delete_Claim_ID } from "../../store/Report/ClaimSummary/action";
// import { LoadingSheet_API, MultipleInvoice_API } from "../../../helpers/backend_helper";
import * as report from '../../Reports/ReportIndex'
import { getpdfReportdata, getpdfReportdataSuccess } from "../../store/Utilites/PdfReport/actions";
import { Col, FormGroup, Input, Label } from "reactstrap";
import CommonPurchaseList from "../../components/Common/CommonPurchaseList";
import { useHistory } from "react-router-dom";
import * as _cfunc from "../../components/Common/CommonFunction";
// import { url, mode, pageId } from "../../../routes/index"
import { url, mode, pageId } from "../../routes/index"

import { PageLoadingSpinner } from "../../components/Common/CommonButton";
import PartyDropdown_Common from "../../components/Common/PartyDropdown";
import ClaimSummaryMaster from "./ClaimSummaryMaster";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { ClaimSummary_API, MasterClaimSummary_API } from "../../helpers/backend_helper";
import { customAlert } from "../../CustomAlert/ConfirmDialog";


const SelectedMonth = () => _cfunc.getPreviousMonthAndYear(new Date())
const FirstAndLastDate = () => _cfunc.getFirstAndLastDateOfMonth(SelectedMonth());
const fileds = () => ({
    FromDate: FirstAndLastDate().firstDate,
    ToDate: FirstAndLastDate().lastDate,
    PartyName: "",
    SelectedMonth: SelectedMonth(),
})

const ClaimSummaryList = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [state, setState] = useState(() => initialFiledFunc(fileds()))



    const [jsonBody, setjsonBody] = useState({});
    const [pageMode] = useState(mode.defaultList);

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

    const { pageField, pdfdata, deleteMsg, tableList } = reducers;

    const values = { ...state.values }

    const action = {
        getList: claimList_API,
        deleteId: delete_Claim_ID,
        deleteSucc: deleteClaimSuccess
    }

    let page_Id = pageId.CLAIM_SUMMARY_lIST
    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        MonthAndYearOnchange(values.SelectedMonth, "InitialDate")
        return () => {
            dispatch(claimList_API_Success([]))

        }
    }, []);



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
            ReportData["ReportType"] = report.CompanyWiseBudget;
            dispatch(getpdfReportdata(MasterClaimSummary_API, ReportData))
        }

        if ((config.btnmode === "CustomerWiseSummary") || (config.btnmode === "ItemWiseSummary")) {
            if (config.btnmode === "CustomerWiseSummary") {
                ReportData["ReportType"] = report.CustomerWiseReturn;
            } else {
                ReportData["ReportType"] = report.ClaimSummary;
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
            Message: "Do you want To Delete Claim ?",
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
            "Party": _cfunc.loginSelectedPartyID()
        });

        let config = { jsonBody, Type: "List", MonthStartDate: firstDate, MonthEndDate: lastDate }
        setjsonBody(config)
        dispatch(claimList_API(config))
    }

    const currentDate = new Date(); // Current date
    const currentMonth = _cfunc.getPreviousMonthAndYear(currentDate);


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