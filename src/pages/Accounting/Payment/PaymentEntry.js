import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldListSuccess, commonPageFieldSuccess } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction,
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import { getSupplier, getSupplierSuccess } from "../../../store/CommonAPI/SupplierRedux/actions";
import { BankListAPI, BankListAPISuccess, GetOpeningBalance, GetOpeningBalance_Success, ReceiptGoButtonMaster_Success, ReceiptTypeAPI, saveReceiptMaster, saveReceiptMaster_Success } from "../../../store/Accounting/Receipt/action";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const PaymentEntry = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const currentDate_ymd = _cfunc.date_ymd_func()

    const [modalCss] = useState(false);
    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy] = useState("");

    const fileds = {
        ReceiptDate: currentDate_ymd,
        OpeningBalanceAmt: "",
        Customer: "",
        ReceiptModeName: "",
        AmountPaid: "",
        Description: "",
        BankName: "",
        DocumentNo: "",
        ChequeDate: currentDate_ymd,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        pageField,
        SupplierList,
        OpeningBalance,
        BankList,
        ReceiptModeList,
        ReceiptType,
        saveBtnloading,
        SupplierDropdownLoading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.ReceiptReducer.saveBtnloading,
            SupplierDropdownLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            postMsg: state.ReceiptReducer.postMsg,
            SupplierList: state.CommonAPI_Reducer.supplier,
            OpeningBalance: state.ReceiptReducer.OpeningBalance,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            BankList: state.ReceiptReducer.bankList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { OpeningBalanceAmount = '' } = OpeningBalance
    
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    useEffect(() => {
        const page_Id = pageId.PAYMENT_ENTRY
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        if (!(commonPartyDropSelect.value === 0)) {
            dispatch(getSupplier({ PartyID: commonPartyDropSelect.value }));
        }
        return () => {
            dispatch(commonPageFieldListSuccess(null));
            dispatch(getSupplierSuccess([]));
            dispatch(GetOpeningBalance_Success([]));
        }
    }, []);

    useEffect(() => { // ReceiptMode Dropdown useEffect
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 4
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    // Receipt Type API Values **** only Post Json Body
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 3
        });
        dispatch(ReceiptTypeAPI(jsonBody));
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(async () => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            dispatch(ReceiptGoButtonMaster_Success([]))
            setState(() => resetFunction(fileds, state))// Clear form values 
            if (pageMode === "other") {
                customAlert({
                    Type: 1,
                    Message: postMsg.Message,
                })
            }
            else {
                let isPermission = await customAlert({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                })
                if (isPermission) {
                    history.push({ pathname: url.PAYMENT_ENTRY_LIST })
                }
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            })
        }
    }, [postMsg])

    const ReceiptTypeID = ReceiptType.find((index) => {
        return index.Name === "Payment Entry"
    })

    const SupplierOptions = SupplierList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const ReceiptModeOptions = ReceiptModeList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const bankList = BankList.map((index) => ({
        value: index.Bank,
        label: index.BankName,
        IsSelfDepositoryBank: index.IsSelfDepositoryBank
    }));

    const BankListOptions = bankList.filter((index) => {
        return index.IsSelfDepositoryBank === false
    })

    function ReceiptDate_Onchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ReceiptDate = date;
            a.hasValid.ReceiptDate.valid = true
            return a
        })
    }

    function ChequeDate_Onchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ChequeDate = date;
            a.hasValid.ChequeDate.valid = true
            return a
        })
    }

    function CustomerOnChange(e) {
        setState((i) => {
            i.values.AmountPaid = ''
            i.hasValid.AmountPaid.valid = false;
            return i
        })
        const jsonBody = JSON.stringify({
            PartyID: e.value,
            CustomerID: commonPartyDropSelect.value,
            ReceiptDate: values.ReceiptDate
        });

        dispatch(GetOpeningBalance(jsonBody));
    }

    function ReceiptModeOnchange(hasSelect, evn) {

        onChangeSelect({ hasSelect, evn, state, setState, })
        if ((hasSelect.label === "Cheque") || (hasSelect.label === "RTGS")) {
            dispatch(BankListAPI())
        }
        else {
            dispatch(BankListAPISuccess([]))
        }
    }

    const saveHandeller = async (event) => {
        event.preventDefault();
        const btnId = event.target.id
        if (values.ReceiptModeName.label === "Cheque") {
            const invalidMsg1 = []

            if (values.BankName === "") {
                invalidMsg1.push(alertMessages.bankNameIsRequired)
            }
            if (values.DocumentNo === "") {
                invalidMsg1.push(alertMessages.documentNoIsRequired)
            };

            if ((values.BankName === "")
                || (values.DepositorBankName === "")
                || (values.DocumentNo === "")
            ) {
                customAlert({
                    Type: 4,
                    Status: true,
                    Message: JSON.stringify(invalidMsg1),
                })
                return;
            }
        }

        try {
            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })
                if (Number(values.AmountPaid) === 0) {
                    customAlert({
                        Type: 4,
                        Message: alertMessages.paymentAmountGreaterThanZero,
                    })
                    return _cfunc.btnIsDissablefunc({ btnId, state: false })
                }
                var BulkData = [{
                    "ReceiptDate": values.ReceiptDate,
                    "Description": values.Description,
                    "AmountPaid": values.AmountPaid,
                    "BalanceAmount": "",
                    "OpeningBalanceAdjusted": "",
                    "DocumentNo": values.DocumentNo,
                    "AdvancedAmountAjusted": "",
                    "Bank": values.BankName.value,
                    "Customer": commonPartyDropSelect.value,
                    "ChequeDate": values.ReceiptModeName.label === "Cheque" ? values.ChequeDate : "",
                    "Party": values.Customer.value,
                    "ReceiptMode": values.ReceiptModeName.value,
                    "ReceiptType": ReceiptTypeID.id,
                    "CreatedBy": _cfunc.loginUserID(),
                    "UpdatedBy": _cfunc.loginUserID(),
                    "ReceiptInvoices": [],
                    "PaymentReceipt": []
                }]

                const jsonBody = JSON.stringify({
                    BulkData: BulkData
                })

                dispatch(saveReceiptMaster({ jsonBody, btnId }));

            }
        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    function partySelectButtonHandler() {
        dispatch(getSupplier({ PartyID: commonPartyDropSelect.value }));
    }

    function partySelectOnChangeHandler() {
        dispatch(getSupplierSuccess([]));
        dispatch(GetOpeningBalance_Success([]));
        setState((i) => {
            let a = { ...i }
            a.values.Customer = ''
            a.hasValid.Customer.valid = true;
            return a
        })
    }

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>
                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ReceiptDate'
                                                value={values.ReceiptDate}
                                                onChange={ReceiptDate_Onchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row> {/* Supplier Dropdown*/}
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <C_Select
                                                id="Customer "
                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                isLoading={SupplierDropdownLoading}
                                                className="react-dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                classNamePrefix="dropdown"
                                                options={SupplierOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    CustomerOnChange(hasSelect)
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
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.OpeningBalanceAmt}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="OpeningBalanceAmt"
                                                id="OpeningBalanceAmt"
                                                disabled={true}
                                                value={OpeningBalanceAmount}
                                                type="text"
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptModeName} </Label>
                                        <Col sm="7">
                                            <Select
                                                id="ReceiptModeName "
                                                name="ReceiptModeName"
                                                value={values.ReceiptModeName}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => {
                                                    ReceiptModeOnchange(hasSelect, evn)
                                                }}
                                            />
                                            {isError.ReceiptModeName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.ReceiptModeName}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                            {(values.ReceiptModeName.label === "Cheque") || (values.ReceiptModeName.label === "RTGS") ?

                                < Row >
                                    <Col sm="6">
                                        <FormGroup className=" row mt-1 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.BankName} </Label>
                                            <Col sm="7">
                                                <Select
                                                    name="BankName"
                                                    value={values.BankName}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    options={BankListOptions}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                    }}
                                                />
                                                {isError.BankName.length > 0 && (
                                                    <span className="invalid-feedback">{isError.BankName}</span>
                                                )}
                                            </Col>

                                        </FormGroup>
                                    </Col >

                                </Row>
                                : null}

                            {(values.ReceiptModeName.label === "Cheque") &&
                                <Row>

                                    <Col sm="6">
                                        <FormGroup className=" row mt-1 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.DocumentNo}</Label>
                                            <Col sm="7">
                                                <Input
                                                    name="DocumentNo"
                                                    id="txtName"
                                                    value={values.DocumentNo}
                                                    type="text"
                                                    className={isError.DocumentNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Cheque Number"
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })
                                                    }}
                                                />
                                                {isError.DocumentNo.length > 0 && (
                                                    <span className="invalid-feedback">{isError.DocumentNo}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className=" row mt-1 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.ChequeDate}</Label>
                                            <Col sm="7">
                                                <C_DatePicker
                                                    name='ChequeDate'
                                                    value={values.ChequeDate}
                                                    onChange={ChequeDate_Onchange}
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                </Row>
                            }

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.AmountPaid}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="AmountPaid"
                                                id="txtName"
                                                value={values.AmountPaid}
                                                type="text"
                                                className={isError.AmountPaid.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.AmountPaid.length > 0 && (
                                                <span className="invalid-feedback">{isError.AmountPaid}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-1 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.Description}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="Description"
                                                id="txtName"
                                                value={values.Description}
                                                type="text"
                                                className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Description"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                            {isError.Description.length > 0 && (
                                                <span className="invalid-feedback">{isError.Description}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                        </div>

                        <FormGroup>
                            <Col>
                                <SaveButton pageMode={pageMode}
                                    loading={saveBtnloading}
                                    onClick={saveHandeller}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={editCreatedBy}
                                />
                            </Col>
                        </FormGroup >

                    </form >
                </div >
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default PaymentEntry

