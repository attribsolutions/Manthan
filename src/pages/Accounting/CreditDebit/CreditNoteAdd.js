

import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import {
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    loginCompanyID,
    loginPartyID,
    loginUserID
} from "../../../components/Common/CommonFunction";
import Select from "react-select";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { CInput } from "../../../CustomValidateForm/CInput";
import { decimalRegx } from "../../../CustomValidateForm/RegexPattern"
import { ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success } from "../../../store/Accounting/Receipt/action";
import { Retailer_List, Retailer_List_Success } from "../../../store/CommonAPI/SupplierRedux/actions";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CredietDebitType, EditCreditlistSuccess, Invoice_Return_ID, Invoice_Return_ID_Success, saveCredit, saveCredit_Success } from "../../../store/Accounting/CreditRedux/action";
import { InvoiceNumber, InvoiceNumberSuccess } from "../../../store/Sales/SalesReturnRedux/action";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";

const CreditNoteAdd = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        CRDRNoteDate: currentDate_ymd,
        Customer: "",
        NoteReason: "",
        servicesItem: "",
        Narration: "",
        GrandTotal: 0,
        InvoiceNO: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds));
    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(198);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    const {
        postMsg,
        pageField,
        RetailerList,
        InvoiceNo,
        CreditDebitType,
        ReceiptModeList,
        saveBtnloading,
        invoiceNoDropDownLoading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.CredietDebitReducer.saveBtnloading,
            invoiceNoDropDownLoading: state.SalesReturnReducer.invoiceNoDropDownLoading,
            postMsg: state.CredietDebitReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            InvoiceNo: state.SalesReturnReducer.InvoiceNo,
            updateMsg: state.BankReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.CREDIT_NOTE//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(ReceiptGoButtonMaster_Success([]))
        dispatch(Invoice_Return_ID_Success([]))
        dispatch(InvoiceNumberSuccess([]))
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location };
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes

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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    // This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
                setModalCss(true)
            }
            if (hasEditVal) {

                const { CRDRNoteDate, Customer, NoteReason, servicesItem, Narration, GrandTotal, CRDRInvoices, CustomerID, CRDRNoteItems, FullNoteNumber, NoteType } = hasEditVal
                const { values, fieldLabel, hasValid, required, isError } = { ...state }

                values.CRDRNoteDate = CRDRNoteDate;
                values.Customer = { label: Customer, value: CustomerID };
                values.NoteReason = { label: NoteReason, value: "" };
                values.InvoiceNO = { label: NoteType === "CreditNote" ? null : FullNoteNumber, value: "" };
                values.servicesItem = servicesItem;
                values.Narration = Narration;
                values.GrandTotal = GrandTotal;
                CRDRInvoices.map((index, key) => (
                    key,
                    index.BalanceAmount = index.GrandTotal - index.PaidAmount
                ));


                setState({ values, fieldLabel, hasValid, required, isError })
                dispatch(Breadcrumb_inputName(hasEditVal.Name))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(EditCreditlistSuccess({ Status: false }))
        }
    }, []);

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveCredit_Success({ Status: false }))
            setState(() => resetFunction(fileds, state)) //Clear form values 
            dispatch(Breadcrumb_inputName(''))

            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let alertResponse = await customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
                if (alertResponse) {
                    history.push({ pathname: url.CREDIT_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveCredit_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField]);

    // Retailer DropDown List Type 1 for credit list drop down
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    // Note Reason Type id 6 Required
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 6
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    //   Note Type Api for Type identify
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 5
        });
        dispatch(CredietDebitType(jsonBody));
    }, [])

    const PartyOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptModeOptions = ReceiptModeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const InvoiceNo_Options = InvoiceNo.map((index) => ({
        value: index.Invoice,
        label: index.FullInvoiceNumber,
    }));

    const creditNoteTypeId = CreditDebitType.find((index) => {
        return index.Name === "CreditNote"
    });

    function DateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.CRDRNoteDate = date;
            a.hasValid.CRDRNoteDate.valid = true
            return a
        })
    };

    function InvoiceNoOnChange(e) {
        dispatch(Invoice_Return_ID(e.value));
    };

    function CustomerOnChange(e) { // Customer dropdown function
        dispatch(Invoice_Return_ID_Success([]))
        setState((i) => {
            i.values.GrandTotal = 0
            i.values.InvoiceNO = ""
            i.values.Customer = e

            i.hasValid.GrandTotal.valid = true;
            i.hasValid.GrandTotal.valid = true;
            i.hasValid.Customer.valid = true;
            return i
        })

        const jsonBody = JSON.stringify({
            PartyID: _cfunc.loginSelectedPartyID(),
            CustomerID: e.value,
            InvoiceID: ""
        });

        const body = { jsonBody, pageMode }
        dispatch(ReceiptGoButtonMaster(body));
        const jsonBody1 = JSON.stringify({
            PartyID: _cfunc.loginSelectedPartyID(),
            CustomerID: e.value
        });

        dispatch(InvoiceNumber(jsonBody1));
    };

    const saveHandeller = async (event) => {
        event.preventDefault();

        const validMsg = []

        if (!values.Customer?.value > 0) {
            validMsg.push({ "Customer": 'Is Required.' })
        };
        if (!values.NoteReason?.value > 0) {
            validMsg.push({ "Note Reason": 'Is Required.' })
        };
        if (!values.InvoiceNO?.value > 0) {
            validMsg.push({ "InvoiceNO": 'Is Required.' })
        };
        if (!Number(values.GrandTotal) > 0) {
            validMsg.push({ "Amount": 'Is Required.' })
        };
        if (validMsg.length > 0) {
            customAlert({ Type: 3, Message: validMsg });
            return
        };
        try {

            const jsonBody = JSON.stringify({
                CRDRNoteDate: values.CRDRNoteDate,
                Customer: values.Customer.value,
                NoteType: creditNoteTypeId.id,
                GrandTotal: values.GrandTotal,

                Narration: values.Narration,
                NoteReason: values.NoteReason.value,
                Party: _cfunc.loginSelectedPartyID(),
                CreatedBy: loginUserID(),
                UpdatedBy: loginUserID(),
                CRDRNoteItems: [],
                CRDRInvoices: [{ Invoice: values.InvoiceNO.value, }],
            })
            dispatch(saveCredit({ jsonBody }));

        } catch (e) { }
    };

    function partySelectButtonHandler() {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }

    function partyOnChngeButtonHandler() {
        dispatch(Retailer_List_Success([]));
        dispatch(Invoice_Return_ID_Success([]))
        dispatch(ReceiptGoButtonMaster_Success([]));
        dispatch(InvoiceNumberSuccess([]));
        setState((i) => {
            let a = { ...i }
            a.values.Customer = ''
            a.values.InvoiceNO = ''
            a.hasValid.Customer.valid = true;
            a.hasValid.InvoiceNO.valid = true;
            return a
        })
    }

    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>
                    <PartyDropdown_Common pageMode={pageMode}
                        goButtonHandler={partySelectButtonHandler}
                        changeButtonHandler={partyOnChngeButtonHandler}
                    />
                    <div className="px-2 c_card_filter header text-black mb-1" >
                        <Row>
                            <Col sm="6">
                                <FormGroup className="row mt-2" >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CRDRNoteDate}</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            name='CreditDate'
                                            value={values.CRDRNoteDate}
                                            onChange={DateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >

                            <Col sm="6">
                                <FormGroup className=" row mt-2 " >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Narration}</Label>
                                    <Col sm="7">
                                        <Input
                                            name="Narration"
                                            id="Narration"
                                            value={values.Narration}
                                            type="text"
                                            className={isError.Narration.length > 0 ? "is-invalid form-control" : "form-control"}
                                            placeholder="Please Enter Comment"
                                            autoComplete='off'
                                            autoFocus={true}
                                            onChange={(event) => {
                                                onChangeText({ event, state, setState })
                                            }}
                                        />
                                        {isError.Narration.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.Narration}</small></span>
                                        )}
                                    </Col>

                                </FormGroup>
                            </Col >
                        </Row>

                        <Row>
                            <Col sm="6">
                                <FormGroup className=" row mt-1 " >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                    <Col sm="7">
                                        <Select
                                            id="Customer"
                                            name="Customer"
                                            value={values.Customer}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            options={PartyOptions}
                                            onChange={CustomerOnChange}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                        {isError.Customer.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                        )}
                                    </Col>

                                </FormGroup>
                            </Col >
                            <Col sm="6">
                                <FormGroup className=" row mt-1 " >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.NoteReason}</Label>
                                    <Col sm="7">
                                        <Select
                                            id="NoteReason "
                                            name="NoteReason"
                                            value={values.NoteReason}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            options={ReceiptModeOptions}
                                            onChange={(hasSelect, evn) => { onChangeSelect({ hasSelect, evn, state, setState, }) }}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                        {isError.NoteReason.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.NoteReason}</small></span>
                                        )}

                                    </Col>
                                </FormGroup>
                            </Col >
                        </Row>

                        <Row>
                            <Col sm="6">
                                <FormGroup className=" row mt-1 " >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.GrandTotal}</Label>
                                    <Col sm="7">
                                        <CInput
                                            name="GrandTotal"
                                            id="GrandTotal"
                                            cpattern={decimalRegx}
                                            value={values.GrandTotal}
                                            type="text"
                                            className={isError.GrandTotal.length > 0 ? "is-invalid form-control text-end" : " text-end form-control"}
                                            placeholder="Please Enter Amount"
                                            autoComplete='off'
                                            autoFocus={true}
                                            onChange={(event) => onChangeText({ event, state, setState })}
                                        />
                                        {isError.GrandTotal.length > 0 && (
                                            <span className="text-danger f-8"><small>{isError.GrandTotal}</small></span>

                                        )}
                                    </Col>


                                </FormGroup>
                            </Col >
                            <Col sm="6">
                                <FormGroup className=" row mt-1 " >
                                    <Label className="col-sm-1 p-2"
                                        style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.InvoiceNO}</Label>
                                    <Col sm="7">
                                        <C_Select
                                            id="InvoiceNO "
                                            name="InvoiceNO"
                                            value={values.InvoiceNO}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            options={InvoiceNo_Options}
                                            isLoading={invoiceNoDropDownLoading}
                                            onChange={(hasSelect, evn) => {
                                                onChangeSelect({ hasSelect, evn, state, setState, })
                                                InvoiceNoOnChange(hasSelect)
                                            }}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />

                                    </Col>
                                </FormGroup>
                            </Col >

                        </Row>
                    </div>


                    <FormGroup>
                        <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                onClick={saveHandeller}
                                userAcc={userPageAccessState}
                                editCreatedBy={editCreatedBy}
                                module={"Receipts"}

                            />
                        </Col>
                    </FormGroup >



                </div>
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};
export default CreditNoteAdd;
