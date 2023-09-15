import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import {
    deleteReceiptList,
    deleteReceiptList_Success,
    GetOpeningBalance,
    ReceiptGoButtonMaster,
    ReceiptGoButtonMaster_Success,
    ReceiptListAPI, ReceiptListAPISuccess, ReceiptTypeAPI,
} from "../../../store/Accounting/Receipt/action";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { getSupplier, getSupplierSuccess, Retailer_List, Retailer_List_Success } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import PaymentEntry from "./PaymentEntry";
import { Receipt_Print } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const PaymentEntryList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func()
    const userAdminRole = _cfunc.loginUserAdminRole()

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" }
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [subPageMode] = useState(history.location.pathname);
    const [userAccState, setUserAccState] = useState('');
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, makeBtnShow: '', makeBtnName: '' });

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.ReceiptReducer.listBtnLoading,
            loading: state.ReceiptReducer.loading,
            tableList: state.ReceiptReducer.ReceiptList,
            deleteMsg: state.ReceiptReducer.deleteMsg,
            RetailerListForPayment: state.CommonAPI_Reducer.supplier,
            RetailerListForReceipt: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            makeReceipt: state.ReceiptReducer.ReceiptGoButton,
            OpeningBalance: state.ReceiptReducer.OpeningBalance,
        })
    );

    const { userAccess, pageField, ReceiptType, RetailerListForPayment = [], RetailerListForReceipt = [], makeReceipt, OpeningBalance } = reducers;

    const values = { ...state.values }

    const action = {
        deleteId: deleteReceiptList,
        postSucc: postMessage,
        deleteSucc: deleteReceiptList_Success
    }

    useEffect(() => {
        return () => {
            dispatch(ReceiptListAPISuccess([]))
        }
    }, [])

    // Receipt Type API Values **** only Post Json Body
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 3
        });
        dispatch(ReceiptTypeAPI(jsonBody));
    }, []);

    // Customer dropdown List
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    // onLoad Go_Button useEffect
    useEffect(() => {
        if (ReceiptType.length > 0 && !(userAdminRole)) {
            goButtonHandler(true)
        }
    }, [ReceiptType]);

    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false;
        let newBtnPath = '';
        let makeBtnName = '';

        if (subPageMode === url.PAYMENT_ENTRY_LIST) {
            page_Id = pageId.PAYMENT_ENTRY_LIST;
            masterPath = url.PAYMENT_ENTRY;
            newBtnPath = url.PAYMENT_ENTRY;
        }
        else if (subPageMode === url.RECEIPTS_LIST_2) {
            page_Id = pageId.RECEIPTS_LIST_2
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make Receipt"
        }

        dispatch(ReceiptListAPI(""))//for clear privious order list
        setOtherState({ masterPath, makeBtnShow, newBtnPath, makeBtnName })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        // dispatch(BreadcrumbShowCountlabel(`${"Payment Entry Count"} :0`))
        // dispatch(getSupplier())
        dispatch(getSupplier({ "PartyID": _cfunc.loginSelectedPartyID() }));

    }, []);

    useEffect(() => {

        if ((makeReceipt.Status === true) && (makeReceipt.StatusCode === 200) && !(OpeningBalance === '')) {
            dispatch(ReceiptGoButtonMaster_Success({ ...makeReceipt, Status: false }))

            history.push({
                pathname: makeReceipt.path,
                pageMode: makeReceipt.pageMode,
                editValue: makeReceipt.ListData,
            })
        }
    }, [makeReceipt, OpeningBalance])

    useEffect(() => {
        const page_Id = pageId.PAYMENT_ENTRY_LIST
        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    const customerOptionsForPayment = RetailerListForPayment.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptionsForPayment.unshift({
        value: "",
        label: " All"
    });

    const customerOptionsForReceipt = RetailerListForReceipt.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptionsForReceipt.unshift({
        value: "",
        label: " All"
    });

    const goButtonHandler = async () => {
        
        try {
            if ((_cfunc.loginSelectedPartyID() === 0)) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            const ReceiptTypeID = ReceiptType.find((index) => {
                return index.Name === "Payment Entry"
            })

            const jsonBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                CustomerID: values.Customer.value,
                PartyID: _cfunc.loginSelectedPartyID(),
                ReceiptType: ReceiptTypeID.id,
            });

            await dispatch(ReceiptListAPI(jsonBody, subPageMode));
        } catch (error) { }
        return
    };

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    function CustomerOnChange(e) {

        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
            return a
        })
    }

    function downBtnFunc(row) {
        var ReportType = report.Receipt;
        dispatch(getpdfReportdata(Receipt_Print, ReportType, row.id))
    }

    function partySelectButtonHandler() {
        goButtonHandler()
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
        dispatch(getSupplier({ "PartyID": _cfunc.loginSelectedPartyID() }));
    }

    function partySelectOnChangeHandler() {
        dispatch(ReceiptListAPISuccess([]));
        dispatch(Retailer_List_Success([]));
        dispatch(getSupplierSuccess([]));

        setState((i) => {
            const a = { ...i }
            a.values.Customer = { value: "", label: "All" }
            a.hasValid.Customer.valid = true
            return a
        })
    }

    const makeBtnFunc = (list = [], btnId) => {

        var { CustomerID, ReceiptDate, id } = list[0]

        try {
            const jsonBody = JSON.stringify({
                PartyID: _cfunc.loginSelectedPartyID(),
                CustomerID: CustomerID,
                InvoiceID: ""
            });

            const jsonBody1 = JSON.stringify({
                PartyID: _cfunc.loginSelectedPartyID(),
                CustomerID: CustomerID,
                ReceiptDate: currentDate_ymd
            });

            const body = { jsonBody, pageMode, path: url.RECEIPTS, ListData: list[0], btnId: `btn-makeBtn-${id}` }
            dispatch(ReceiptGoButtonMaster(body));
            dispatch(GetOpeningBalance(jsonBody1));

        } catch (e) { }
    }

    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>FromDate</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name='FromDate'
                                    value={values.FromDate}
                                    onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>ToDate</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name="ToDate"
                                    value={values.ToDate}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>Customer</Label>
                            <Col sm="5">
                                <Select
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    value={values.Customer}
                                    options={(subPageMode === url.RECEIPTS_LIST_2) ? customerOptionsForReceipt : customerOptionsForPayment}
                                    onChange={CustomerOnChange}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">

                        <Go_Button loading={reducers.loading} onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(reducers.loading || !pageField)} />
            <div className="page-content">
                <PartyDropdown_Common pageMode={pageMode}
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partySelectOnChangeHandler} />
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            HeaderContent={HeaderContent}

                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"PaymentEntry"}
                            deleteName={"FullReceiptNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={PaymentEntry}
                            totalAmountShow={true}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default PaymentEntryList;