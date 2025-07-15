import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../store/actions";

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

import { C_Select } from "../../CustomValidateForm";
import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";
import {  Scheme_List_Per_Month_API } from "../../helpers/backend_helper";

const SelectedMonth = () => _cfunc.getPreviousMonthAndYear({ date: new Date(), Privious: 1 })
const FirstAndLastDate = () => _cfunc.getFirstAndLastDateOfMonth(SelectedMonth());
const fileds = () => ({
    FromDate: FirstAndLastDate().firstDate,
    ToDate: FirstAndLastDate().lastDate,
    SelectedMonth: SelectedMonth(),
})


const VoucherRedemptionClaim = () => {
    const dispatch = useDispatch();
    const isSCMParty = !_cfunc.loginUserIsFranchisesRole();
    const [state, setState] = useState(() => initialFiledFunc(fileds()))
    const [Scheme_Option, setSchemeOption] = useState([]);

    const [pageMode] = useState(mode.defaultList);



    const [PartyDropdown, setPartyDropdown] = useState([allLabelWithZero]);
    const [Scheme, setSchemeTypeSelect] = useState([allLabelWithZero]);


    const reducers = useSelector(
        (state) => ({
            deleteMsg: state.ClaimSummaryReducer.deleteMsg,
            tableList: state.VoucherRedemptionClaimReducer.VoucherRedemptionClaimData,
            Party: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            listBtnLoading: state.VoucherRedemptionClaimReducer.listBtnLoading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            partyDropdownLoading: state.CommonPartyDropdownReducer.partyDropdownLoading,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );



    const { pageField, Party, partyDropdownLoading, listBtnLoading } = reducers;
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


    useEffect(() => {
        const { monthName, year } = _cfunc.SelectedMonthAndYearName(values.SelectedMonth);
        dispatch(sideBarPageFiltersInfoAction([
            { label: "Month", content: `${monthName} ${year}` },
        ]));
    }, [values.SelectedMonth]);



    const Party_Option = Party.map(i => ({
        value: i.id,
        label: i.Name,
        PartyType: i.PartyType
    }));


    function downClaimBtnFunc(config) {
        config.rowData["Month"] = values.SelectedMonth
        config.rowData["ReportType"] = report.VoucherRedemptionClaimReport;
        config.rowData["Status"] = true
        config.rowData["StatusCode"] = 200
        config.rowData["tableList"] = [config.rowData]

        dispatch(getpdfReportdataSuccess(config.rowData))

    }
    function PartyDrodownOnChange(e) {
        if (e.length === 0) {
            e = [allLabelWithZero]
        } else {
            e = e.filter(i => !(i.value === 0))
        }
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


    useEffect(() => {
        debugger
        const fetchSchemeList = async () => {
            const jsonBody = JSON.stringify({
                FromDate: state.values.FromDate,
                ToDate: state.values.ToDate,
            });
            const resp = await Scheme_List_Per_Month_API({ jsonBody });
            if (resp.StatusCode === 200) {
                const option = resp.Data.map((index) => ({
                    value: index.id,
                    label: index.SchemeName,
                }));

                setSchemeOption(option);

            }
        };

        fetchSchemeList();
    }, [state]);


    const SchemeOnchange = (e) => {
        if (e.length === 0) {
            e = [allLabelWithZero]
        } else {
            e = e.filter(i => !(i.value === 0))
        }
        setSchemeTypeSelect(e)
    }




    const GoBtnHandler = () => {

        const jsonBody = JSON.stringify({
            "FromDate": state.values.FromDate,
            "ToDate": state.values.ToDate,
            "Party": isSCMParty ? PartyDropdown.map(row => row.value).join(',') : String(_cfunc.loginSelectedPartyID()),
            "SchemeID": Scheme.map(row => row.value).join(','),
        });
        dispatch(VoucherRedemptionClaim_Action({ jsonBody }))
    }

    const PrintAlldownBtnFunc = (row = []) => {

        debugger
        let config = { rowData: {} };
        let ischeck = row.filter(i => (i.selectCheck && !i.forceSelectDissabled))
        if (!ischeck.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneOrder,
            });
            return
        }

        config.rowData["Month"] = values.SelectedMonth
        config.rowData["ReportType"] = report.VoucherRedemptionClaimReport;
        config.rowData["Status"] = true
        config.rowData["StatusCode"] = 200
        config.rowData["tableList"] = ischeck


        dispatch(getpdfReportdataSuccess(config.rowData))

        // dispatch(_act.getpdfReportdata(order_Single_and_Multiple_Print_API, config))

    };



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
                                    // max={currentMonth}
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
                                        isMulti={true}
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

                        {< Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Scheme </Label>
                                <Col sm="8">
                                    <C_Select
                                        name="Scheme"
                                        value={Scheme}
                                        isSearchable={true}
                                        isMulti={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Scheme_Option}
                                        onChange={(e) => { SchemeOnchange(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>}

                        <Col sm={isSCMParty ? 3 : 6} className=" d-flex justify-content-end" >
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
                            selectCheckParams={{
                                selectSaveBtnHandler: PrintAlldownBtnFunc,
                                selectSaveBtnLabel: "Print All",
                                selectHeaderLabel: "Print All",
                                // selectSaveBtnLoading: printAllBtnLoading,
                            }}
                            totalAmountShow={true}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default VoucherRedemptionClaim;