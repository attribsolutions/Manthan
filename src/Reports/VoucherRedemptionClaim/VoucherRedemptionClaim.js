import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../store/actions";
import { claimList_API, claimList_API_Success, deleteClaimSuccess, delete_Claim_ID } from "../../store/Report/ClaimSummary/action";
import * as report from '../ReportIndex'
import { getpdfReportdataSuccess } from "../../store/Utilites/PdfReport/actions";
import { Col, FormGroup, Input, Label } from "reactstrap";
import CommonPurchaseList from "../../components/Common/CommonPurchaseList";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { C_Button, PageLoadingSpinner } from "../../components/Common/CommonButton";

import { initialFiledFunc } from "../../components/Common/validationFunction";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";
import { sideBarPageFiltersInfoAction } from "../../store/Utilites/PartyDrodown/action";
import { VoucherRedemptionClaim_Action, VoucherRedemptionClaim_Action_Success } from "../../store/Report/VoucherRedemptionClaimRedux/action";
import C_Report from "../../components/Common/C_Report";
import { C_Select } from "../../CustomValidateForm";
import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";

const SelectedMonth = () => _cfunc.getPreviousMonthAndYear({ date: new Date(), Privious: 1 })
const FirstAndLastDate = () => _cfunc.getFirstAndLastDateOfMonth(SelectedMonth());
const fileds = () => ({
    FromDate: FirstAndLastDate().firstDate,
    ToDate: FirstAndLastDate().lastDate,
    SelectedMonth: SelectedMonth(),
})


const Data = [
    { Count: 1, Party: "ABC Corp", claimNo: "CLM12345", voucherCount: 3, claimVoucherAmount: 5000 },
    { Count: 2, Party: "XYZ Ltd", claimNo: "CLM67890", voucherCount: 2, claimVoucherAmount: 3000 },
    { Count: 3, Party: "PQR Enterprises", claimNo: "CLM11223", voucherCount: 5, claimVoucherAmount: 7000 },
    { Count: 4, Party: "LMN Pvt Ltd", claimNo: "CLM44556", voucherCount: 4, claimVoucherAmount: 4500 }
];





const VoucherRedemptionClaim = () => {
    const dispatch = useDispatch();
    const isSCMParty = !_cfunc.loginUserIsFranchisesRole();
    const [state, setState] = useState(() => initialFiledFunc(fileds()))


    const [pageMode] = useState(mode.defaultList);

    const currentDate = new Date(); // Current date
    const currentMonth = _cfunc.getPreviousMonthAndYear({ date: currentDate, Privious: 1 });
    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);

    const reducers = useSelector(
        (state) => ({
            deleteMsg: state.ClaimSummaryReducer.deleteMsg,
            tableList: state.VoucherRedemptionClaimReducer.VoucherRedemptionClaimData,
            pdfdata: state.PdfReportReducers.pdfdata,
            Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            listBtnLoading: state.VoucherRedemptionClaimReducer.listBtnLoading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    const { pageField, pdfdata, Party, partyDropdownLoading, listBtnLoading } = reducers;
    const values = { ...state.values }

    const action = {
        getList: VoucherRedemptionClaim_Action,

    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(pageId.VOUCHER_REDEMPTION_CLAIM))
        return () => {
            dispatch(VoucherRedemptionClaim_Action_Success([]));
        }
    }, []);

    // Common Party select Dropdown useEffect
    // useEffect(() => {

    //     if (commonPartyDropSelect.value > 0) {
    //         MonthAndYearOnchange(values.SelectedMonth, "InitialDate")
    //     }

    // }, [commonPartyDropSelect]);

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

    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    }));
    Party_Option.unshift(allLabelWithZero);

    function downClaimBtnFunc(config) {
        config.rowData["Month"] = values.SelectedMonth
        config.rowData["ReportType"] = report.VoucherRedemptionClaim;
        config.rowData["Status"] = true
        config.rowData["StatusCode"] = 200

        dispatch(getpdfReportdataSuccess(config.rowData))
    }
    function PartyDrodownOnChange(e) {
        setPartyDropdown(e);

    }


    function MonthAndYearOnchange(e) {
        const selectedMonth = e.target.value
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
    }


    const GoBtnHandler = () => {
        debugger
        const finalPartyId = ((isSCMParty) && (PartyDropdown.value === 0)) ? Party_Option?.filter(obj => obj.value !== 0).map(obj => obj.value).join(',') : (_cfunc.loginPartyID()).toString()
        const jsonBody = JSON.stringify({
            "FromDate": state.values.FromDate,
            "ToDate": state.values.ToDate,
            "Party": finalPartyId,
        });
        dispatch(VoucherRedemptionClaim_Action({ jsonBody }))
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.loading || !pageField} />
            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={3}>
                            <FormGroup className="mb- row mt-2" >
                                <Label style={{ width: "83px" }} className="col-sm-1 p-2 ">Month</Label>
                                <Col sm={8}>
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
                        {isSCMParty && < Col sm={3} className="">
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

                        <Col sm={isSCMParty ? 6 : 9} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={listBtnLoading}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => GoBtnHandler()}
                            >
                                Show
                            </C_Button>

                        </Col>
                    </div>
                </div>

                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            pageMode={pageMode}
                            downBtnFunc={downClaimBtnFunc}
                        />
                        : null
                }
            </div>
            <C_Report />
        </React.Fragment>
    )
}

export default VoucherRedemptionClaim;