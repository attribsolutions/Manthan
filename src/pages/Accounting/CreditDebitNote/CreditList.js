import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbRadioButtonView,
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { useHistory } from "react-router-dom";
import * as report from '../../../Reports/ReportIndex'
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import * as mode from "../../../routes/PageMode"
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { Edit_Credit_List_API, } from "../../../helpers/backend_helper";
import { Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import {
    CredietDebitType,
    Edit_CreditList_ID,
    GetCreditList,
    deleteCreditlistSuccess,
    delete_CreditList_ID,
    GetCreditListSuccess,
    Uploaded_Credit_Debit_EInvoiceSuccess,
    Cancel_Credit_Debit_EInvoiceSuccess
} from "../../../store/Accounting/CreditRedux/action";
import { Retailer_List, Retailer_List_Success, getSupplierSuccess } from "../../../store/CommonAPI/SupplierRedux/actions";
import * as _cfunc from "../../../components/Common/CommonFunction"
import { C_DatePicker } from "../../../CustomValidateForm";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const CreditList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" },
        NoteType: { value: "", label: "All" },
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [subPageMode] = useState(history.location.pathname);
    const [otherState, setOtherState] = useState({
        masterPath: '',
        buttonMsgLable: '',
        page_Id: ''
    });

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: (state.CredietDebitReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading),
            tableList: state.CredietDebitReducer.CreditList,
            deleteMsg: state.CredietDebitReducer.deleteMsg,
            Uploaded_Credit_Debit_EInvoice: state.CredietDebitReducer.Uploaded_Credit_Debit_EInvoice,
            Cancel_Credit_Debit_EInvoice: state.CredietDebitReducer.Cancel_Credit_Debit_EInvoice,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            editData: state.CredietDebitReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { pageField, RetailerList, CreditDebitType, listBtnLoading, Cancel_Credit_Debit_EInvoice, Uploaded_Credit_Debit_EInvoice } = reducers;
    const values = { ...state.values }

    const action = {
        editId: Edit_CreditList_ID,
        deleteId: delete_CreditList_ID,
        deleteSucc: deleteCreditlistSuccess
    }

    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let buttonMsgLable = ""
        let newBtnPath = '';

        if (subPageMode === url.CREDIT_LIST) {
            page_Id = pageId.CREDIT_LIST;
            masterPath = url.CREDIT_NOTE;
            newBtnPath = url.CREDIT_NOTE;
            buttonMsgLable = "Credit"
        }
        else if (subPageMode === url.DEBIT_LIST) {
            page_Id = pageId.DEBIT_LIST;
            masterPath = url.DEBIT_NOTE;
            newBtnPath = url.DEBIT_NOTE;
            buttonMsgLable = "Debit"
        }
        else if (subPageMode === url.GOODS_CREDIT_LIST) {
            page_Id = pageId.GOODS_CREDIT_LIST;
            masterPath = url.GOODS_CREDIT_NOTE;
            newBtnPath = url.GOODS_CREDIT_NOTE;
            buttonMsgLable = "Credit"
        }
        else if (subPageMode === url.GOODS_DEBIT_LIST) {
            page_Id = pageId.GOODS_DEBIT_LIST;
            masterPath = url.GOODS_DEBIT_NOTE;
            newBtnPath = url.GOODS_DEBIT_NOTE;
            buttonMsgLable = "Debit"
        };

        setOtherState({ masterPath, newBtnPath, buttonMsgLable, page_Id })
        setpageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbRadioButtonView(true));

        return () => {
            dispatch(GetCreditListSuccess([]));
            dispatch(Retailer_List_Success([]));
            dispatch(getSupplierSuccess([]));
        }
    }, []);


    //   Note Type Api for Type identify
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 5
        });
        dispatch(CredietDebitType(jsonBody));
    }, []);

    // Retailer DropDown List Type 1 for credit list drop down
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    // const NoteType = []
    // CreditDebitType.forEach(index => {
    //     if (otherState.buttonMsgLable === "Credit") {
    //         if ((index.Name === "CreditNote") || (index.Name === "Goods CreditNote")) {
    //             const arr = {
    //                 value: index.id,
    //                 label: index.Name,
    //             }
    //             NoteType.push(arr)
    //         }
    //     }
    //     else {
    //         if ((index.Name === "DebitNote") || (index.Name === "Goods DebitNote")) {
    //             const arr = {
    //                 value: index.id,
    //                 label: index.Name,
    //             }
    //             NoteType.push(arr)
    //         }
    //     }
    // })
    // NoteType.unshift({ value: "", label: " All" });

    useEffect(() => {
        if (CreditDebitType.length > 0) {
            goButtonHandler(true)
        }
    }, [CreditDebitType]);

    function noteType_BySubPageMode() {
        if (subPageMode === url.GOODS_CREDIT_LIST) {
            return CreditDebitType.find((index) => index.Name === "Goods CreditNote")?.id
        }
        else if (subPageMode === url.GOODS_DEBIT_LIST) {
            return CreditDebitType.find((index) => index.Name === "Goods DebitNote")?.id;
        }
        else if (subPageMode === url.CREDIT_LIST) {
            return CreditDebitType.find((index) => index.Name === "CreditNote")?.id
        }
        else if (subPageMode === url.DEBIT_LIST) {
            return CreditDebitType.find((index) => index.Name === "DebitNote")?.id;
        }

    }
    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            CustomerID: values.Customer.value,
            PartyID: _cfunc.loginSelectedPartyID(),
            NoteType: noteType_BySubPageMode(),
            Note: otherState.buttonMsgLable
        });
        dispatch(GetCreditList(jsonBody, hasPagePath));
    }

    function downBtnFunc(config) {
        config["ReportType"] = report.Credit;
        dispatch(getpdfReportdata(Edit_Credit_List_API, config))

    }

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

    useEffect(() => {   // Uploaded EInvoice useEffect 
        if (Uploaded_Credit_Debit_EInvoice.Status === true && Uploaded_Credit_Debit_EInvoice.StatusCode === 200) {
            dispatch(Uploaded_Credit_Debit_EInvoiceSuccess({ Status: false }))
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: JSON.stringify(Uploaded_Credit_Debit_EInvoice.Message),
            })
        }

        else if (Uploaded_Credit_Debit_EInvoice.Status === true) {
            dispatch(Uploaded_Credit_Debit_EInvoiceSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(Uploaded_Credit_Debit_EInvoice.Message),
            })
        }
    }, [Uploaded_Credit_Debit_EInvoice]);



    useEffect(async () => {   // Uploaded Cancel E-Invoice useEffect 

        if (Cancel_Credit_Debit_EInvoice.Status === true && Cancel_Credit_Debit_EInvoice.StatusCode === 200) {
            dispatch(Cancel_Credit_Debit_EInvoiceSuccess({ Status: false }))
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: Cancel_Credit_Debit_EInvoice.Message,
            })
            return
        }

        else if (Cancel_Credit_Debit_EInvoice.Status === true) {
            dispatch(Cancel_Credit_Debit_EInvoiceSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(Cancel_Credit_Debit_EInvoice.Message),
            })
            return
        }
    }, [Cancel_Credit_Debit_EInvoice]);

    function NoteTypeOnChange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.NoteType = e;
            a.hasValid.NoteType.valid = true
            return a
        })
    }

    function partySelectButtonHandler() {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }

    function partySelectOnChangeHandler() {
        dispatch(GetCreditListSuccess([]));
        dispatch(Retailer_List_Success([]));
        setState((i) => {
            const a = { ...i }
            a.values.Customer = { value: "", label: "All" }
            a.values.NoteType = { value: "", label: "All" }
            a.hasValid.Customer.valid = true;
            a.hasValid.NoteType.valid = true;
            return a
        })
    }
    const HeaderContent = () => {
        return (
            <div className="px-2 c_card_filter text-black" >
                <div className="row" >
                    <Col sm={2} className="">
                        <FormGroup className=" mb-2 row mt-3 " >
                            <Label className="col-sm-4 p-2"
                                style={{ width: "66px" }}>FromDate</Label>
                            <Col sm={7}>
                                <C_DatePicker
                                    name='FromDate'
                                    value={values.FromDate}
                                    onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm={2} className="">
                        <FormGroup className=" row mt-3 " >
                            <Label className="col-sm-4 p-2"
                                style={{ width: "60px" }}>ToDate</Label>
                            <Col sm={7}>
                                <C_DatePicker
                                    name="ToDate"
                                    value={values.ToDate}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm={3}>
                        <FormGroup className=" row mt-3 " >
                            <Label className="col-sm-2 p-2"
                                style={{ width: "85px" }}>Customer</Label>
                            <Col sm={7}>
                                <Select
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    value={values.Customer}
                                    options={customerOptions}
                                    onChange={CustomerOnChange}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    {/* <Col sm={3}>
                    <FormGroup className=" row mt-3 " >
                        <Label className="col-md-3 p-2"
                            style={{ width: "90px" }}>NoteType</Label>
                        <Col sm={8}>
                            <Select
                                name="Customer"
                                classNamePrefix="select2-Customer"
                                value={values.NoteType}
                                options={NoteType}
                                onChange={NoteTypeOnChange}
                                styles={{
                                    menu: provided => ({ ...provided, zIndex: 2 })
                                }}
                            />
                        </Col>
                    </FormGroup>
                </Col > */}

                    <Col sm={1} className="mt-3 " style={{ paddingLeft: "100px" }}>
                        <Go_Button onClick={goButtonHandler} loading={listBtnLoading} />
                    </Col>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(listBtnLoading || !pageField)} />
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
                            ButtonMsgLable={otherState.buttonMsgLable}
                            deleteName={"FullNoteNumber"}
                            MasterModal={otherState.MasterModal}
                            totalAmountShow={true}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default CreditList;