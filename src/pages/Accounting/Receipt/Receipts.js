import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { commonPageField, commonPageFieldSuccess } from "../../../store/actions";
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
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    currentDate_ymd,
    loginCompanyID,
    loginPartyID,
    loginUserID,
    metaTagLabel,
} from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import {
    BankListAPI,
    BankListAPISuccess,
    GetOpeningBalance,
    GetOpeningBalance_Success,
    ReceiptGoButtonMaster,
    ReceiptGoButtonMaster_Success,
    ReceiptTypeAPI,
    saveReceiptMaster,
    saveReceiptMaster_Success
} from "../../../store/Accounting/Receipt/action";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CInput, C_DatePicker, C_Select } from "../../../CustomValidateForm/index";
import { decimalRegx } from "../../../CustomValidateForm/RegexPattern";
import * as _cfunc from "../../../components/Common/CommonFunction";

const Receipts = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const loginSystemSetting = _cfunc.loginSystemSetting()

    const fileds = {
        ReceiptDate: currentDate_ymd,
        OpeningBalanceAmt: "",
        Customer: "",
        ReceiptModeName: "",
        AmountPaid: 0,
        BankName: "",
        DocumentNo: "",
        DepositorBankName: "",
        Description: "",
        ChequeDate: currentDate_ymd,
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [ID, setID] = useState("");
    const [pageMode, setPageMode] = useState(mode.defaultsave);

    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [IsSystemSetting, setIsSystemSetting] = useState(false);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        retailerDropLoading,
        ReceiptGoButton,
        OpeningBalance,
        pageField,
        RetailerList,
        BankList,
        ReceiptModeList,
        ReceiptType,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            retailerDropLoading: state.CommonAPI_Reducer.retailerDropLoading,
            saveBtnloading: state.ReceiptReducer.saveBtnloading,
            postMsg: state.ReceiptReducer.postMsg,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            OpeningBalance: state.ReceiptReducer.OpeningBalance,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            BankList: state.ReceiptReducer.bankList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const page_Mode = location.pageMode
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const { Data = [] } = ReceiptGoButton
    const { OpeningBalanceAmount = '' } = OpeningBalance

    useEffect(() => {
        const page_Id = pageId.RECEIPTS
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
    }, []);

    // Customer dropdown Options
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    // Receipt Mode dropdown Values
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 4
        });
        dispatch(postSelect_Field_for_dropdown(jsonBody));
    }, []);

    // Receipt Type API Values **** only Use Post Json Body
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 3
        });
        dispatch(ReceiptTypeAPI(jsonBody));
    }, []);

    // pageField useEffect
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
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {

        if (loginSystemSetting.IsAmountadjustedinInvoice === "0") {
            setIsSystemSetting(true)
        }
    }, []);

    // loction useEffect
    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            let insidePageMode = null
            let Data = null
            if (hasShowloction) {
                insidePageMode = location.pageMode;
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props[mode.editValue]
                insidePageMode = props.pageMode;
                setModalCss(true)
            }

            if (hasEditVal) {

                const { id, CustomerID, Customer,
                    Description, ReceiptMode, ReceiptModeName,
                    Bank, BankName, AmountPaid, DocumentNo, } = hasEditVal
                setID(id)
                setState((i) => {
                    i.values.Customer = { value: CustomerID, label: Customer }
                    i.values.ReceiptModeName = ReceiptModeName === undefined ?
                        { value: '', label: "Select..." }
                        : { value: ReceiptMode, label: ReceiptModeName }
                    i.values.BankName = { value: Bank, label: BankName }
                    i.values.Description = Description
                    i.values.DocumentNo = DocumentNo
                    i.values.AmountPaid = AmountPaid.replace(/,/g, "");

                    i.hasValid.Customer.valid = true;
                    i.hasValid.AmountPaid.valid = true;
                    i.hasValid.BankName.valid = true;
                    i.hasValid.Description.valid = true;
                    i.hasValid.ReceiptModeName.valid = true;
                    return i
                })
                AmountPaidDistribution(AmountPaid);
            }
        }
        else {
            dispatch(ReceiptGoButtonMaster_Success({ Status: false }))
            dispatch(GetOpeningBalance_Success(''))
        }
    }, [])

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
                    history.push({ pathname: url.RECEIPTS_LIST })
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

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [Data]);

    const customerOptions = RetailerList.map((index) => ({
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

    const DepositorBankOptions = bankList.filter((index) => {
        return index.IsSelfDepositoryBank === true
    })

    const BankListOptions = bankList.filter((index) => {
        return index.IsSelfDepositoryBank === false
    })

    const pagesListColumns = [
        {
            text: "InvoiceDate",
            dataField: "InvoiceDate",

        },
        {
            text: "Bill No",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Bill Amount",
            dataField: "GrandTotal",
            align: () => ("right")
        },
        {
            text: "Paid",
            dataField: "PaidAmount",
            align: () => ("right")
        },
        {
            text: "Bal Amt",
            dataField: "BalanceAmount",
            align: () => ("right")
        },
        {
            text: "Calculate",
            dataField: "",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        key={`Quantity-${row.Invoice}`}
                        id={`Quantity-${row.Invoice}`}
                        cpattern={decimalRegx}
                        defaultValue={row.Calculate}
                        autoComplete="off"
                        className=" text-end"
                        onChange={(e) => CalculateOnchange(e, row, key)}
                    />
                </span>)
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
        },
    ];

    function CustomerOnChange(e) { // Customer dropdown function

        setState((i) => {
            i.values.AmountPaid = 0
            i.hasValid.AmountPaid.valid = true;
            return i
        })
        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: e.value,
            InvoiceID: ""
        });

        const jsonBody1 = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: e.value,
            ReceiptDate: values.ReceiptDate
        });

        const body = { jsonBody, pageMode }
        dispatch(ReceiptGoButtonMaster(body));
        dispatch(GetOpeningBalance(jsonBody1));
    }

    function CalculateOnchange(event, row, key) {  // Calculate Input box onChange Function

        let input = event.target.value

        let v1 = Number(row.BalanceAmount);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }

        row.Calculate = event.target.value

        if ((page_Mode === "") || (page_Mode === undefined) || (page_Mode === mode.modeSTPList)) {
            let calSum = 0
            Data.forEach(element => {
                calSum = calSum + Number(element.Calculate)
            });

            setState((i) => {
                let a = { ...i }
                a.values.AmountPaid = calSum
                a.hasValid.AmountPaid.valid = true;
                return a
            })
        }
    };

    function AmountPaid_onChange(event) {

        if (IsSystemSetting) {
            onChangeText({ event, state, setState })
        }
        else {
            let input = event.target.value
            let sum = 0
            Data.forEach(element => {
                sum = sum + Number(element.BalanceAmount)
            });

            let v1 = Number(sum);
            let v2 = Number(input)
            if (!(v1 >= v2)) {
                event.target.value = v1;
            }
            onChangeText({ event, state, setState })
            AmountPaidDistribution(event.target.value)
        }
    }

    function AmountPaidDistribution(val1) {

        const withoutCommaSeparator = val1.replace(/,/g, "");
        let value = Number(withoutCommaSeparator)

        let Amount = value

        Data.map((index) => {

            let amt = Number(index.BalanceAmount)
            if ((Amount > amt) && !(amt === 0)) {

                Amount = Amount - amt
                index.Calculate = amt.toFixed(2)
            }
            else if ((Amount <= amt) && (Amount > 0)) {
                index.Calculate = Amount.toFixed(2)
                Amount = 0
            }
            else {
                index.Calculate = 0;
            }
            try {
                document.getElementById(`Quantity-${index.Invoice}`).value = index.Calculate
            } catch (e) { }
        })
    }

    function ReceiptModeOnchange(hasSelect, evn,) {
        onChangeSelect({ hasSelect, evn, state, setState, })
        setState((i) => {
            i.values.BankName = '';
            i.values.DepositorBankName = '';
            i.values.DocumentNo = '';
            i.hasValid.BankName.valid = true;
            i.hasValid.DepositorBankName.valid = true;
            i.hasValid.DocumentNo.valid = true;
            return i
        })
        if ((hasSelect.label === "Cheque") || (hasSelect.label === "RTGS")) {
            dispatch(BankListAPI())
        }
        else {
            dispatch(BankListAPISuccess([]))
        }
    }

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

    const saveHandeller = async (event) => {

        event.preventDefault();
        const btnId = event.target.id;

        let calSum = 0
        Data.forEach(element => {
            calSum = calSum + Number(element.Calculate)
        });

        if (!(IsSystemSetting)) {
            let diffrence = Math.abs(calSum - values.AmountPaid);
            if (Number(values.AmountPaid) < calSum) {
                customAlert({
                    Type: 4,
                    Message: `Amount Paid value is Excess ${diffrence}`,
                })
                return btnIsDissablefunc({ btnId, state: false })

            }
            else if (Number(values.AmountPaid) > calSum) {
                customAlert({
                    Type: 4,
                    Message: `Amount Paid value is Short ${diffrence}`,
                })
                return btnIsDissablefunc({ btnId, state: false })

            }
        }

        if ((values.ReceiptModeName.value === undefined) || values.ReceiptModeName.value === "") {
            customAlert({
                Type: 4,
                Message: "Receipt Mode Is Required",
            })
            return btnIsDissablefunc({ btnId, state: false })
        }

        if ((values.AmountPaid === '')
            || (values.AmountPaid === "NaN")
            || (values.AmountPaid === undefined)
            || (values.AmountPaid === 0)
            || (values.AmountPaid === "0")) {
            customAlert({
                Type: 4,
                Message: `The Receipt amount must be greater than zero.`,
            })
            return btnIsDissablefunc({ btnId, state: false })
        }

        const invalidMsg1 = []
        if (values.ReceiptModeName.label === "Cheque") {

            if (values.BankName === "") {
                invalidMsg1.push(`Bank Name Is Required`)
            }
            if (values.DepositorBankName === "") {
                invalidMsg1.push(`Depositor Bank Name Is Required`)
            };
            if (values.DocumentNo === "") {
                invalidMsg1.push(`Cheque Number Is Required`)
            };

            if (invalidMsg1.length > 0) {
                customAlert({
                    Type: 4,
                    Message: JSON.stringify(invalidMsg1)
                })
                return btnIsDissablefunc({ btnId, state: false })
            }
        }

        const ReceiptTypeID = ReceiptType.find((index) => {
            return index.Name === "Receipt"
        })

        const ReceiptInvoices1 = Data.map((index) => ({
            Invoice: index.Invoice,
            GrandTotal: index.GrandTotal,
            PaidAmount: index.Calculate,
        }))

        const FilterReceiptInvoices = ReceiptInvoices1.filter((index) => {
            return index.PaidAmount > 0
        })

        const PaymentReceipt = [{ Payment: ID }]

        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                var BulkData = [{
                    "ReceiptDate": values.ReceiptDate,
                    "Description": values.Description,
                    "AmountPaid": values.AmountPaid,
                    "BalanceAmount": "",
                    "OpeningBalanceAdjusted": "",
                    "DocumentNo": values.DocumentNo,
                    "AdvancedAmountAjusted": "",
                    "Bank": values.BankName.value,
                    "Customer": values.Customer.value,
                    "ChequeDate": values.ReceiptModeName.label === "Cheque" ? values.ChequeDate : "",
                    "DepositorBank": values.DepositorBankName.value,
                    "Party": loginPartyID(),
                    "ReceiptMode": values.ReceiptModeName.value,
                    "ReceiptType": ReceiptTypeID.id,
                    "CreatedBy": loginUserID(),
                    "UpdatedBy": loginUserID(),
                    "ReceiptInvoices": !(IsSystemSetting) ? FilterReceiptInvoices : [],
                    "PaymentReceipt": page_Mode === mode.modeSTPsave ? PaymentReceipt : []
                }]

                const jsonBody = JSON.stringify({
                    BulkData: BulkData
                })

                if (pageMode === mode.edit) {
                    // dispatch(updateCategoryID({ jsonBody, updateId: values.id, btnId }));
                }
                else {
                    dispatch(saveReceiptMaster({ jsonBody, btnId }));
                }
            }
        } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
    };

    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)
    var IsEditMode_Css = ''
    if ((modalCss) || (pageMode === mode.dropdownAdd)) { IsEditMode_Css = "-5.5%" };

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-1" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptDate}  </Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name='ReceiptDate'
                                                value={values.ReceiptDate}
                                                // disabled={page_Mode === mode.modeSTPsave ? true : false}
                                                onChange={ReceiptDate_Onchange}
                                            />
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
                                            <C_Select
                                                name="Customer"
                                                isDisabled={(page_Mode === mode.modeSTPsave) || (page_Mode === mode.modeSTPList) ? true : false}
                                                value={values.Customer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                classNamePrefix="dropdown"
                                                isLoading={retailerDropLoading}
                                                options={customerOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    CustomerOnChange(hasSelect)
                                                }
                                                }
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="invalid-feedback">{isError.Customer}</span>
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
                                                isDisabled={page_Mode === mode.modeSTPsave ? true : false}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => {
                                                    ReceiptModeOnchange(hasSelect, evn)
                                                    // onChangeSelect({ hasSelect, evn, state, setState, })
                                                }}
                                            />

                                            {(isError.ReceiptModeName.length > 0) && (values.ReceiptModeName.value === undefined) ? (
                                                <span className="text-danger f-8"><small>{isError.ReceiptModeName}</small></span>
                                            ) : <></>}
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
                                                    isDisabled={page_Mode === mode.modeSTPsave ? true : false}
                                                    isSearchable={true}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
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

                                    <Col sm="6">
                                        <FormGroup className=" row mt-1 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.DepositorBankName} </Label>
                                            <Col sm="7">
                                                <Select
                                                    name="DepositorBankName"
                                                    value={values.DepositorBankName}
                                                    styles={{
                                                        menu: provided => ({ ...provided, zIndex: 2 })
                                                    }}
                                                    isSearchable={true}
                                                    className="react-dropdown"
                                                    classNamePrefix="dropdown"
                                                    options={DepositorBankOptions}
                                                    onChange={(hasSelect, evn) => {
                                                        onChangeSelect({ hasSelect, evn, state, setState });
                                                    }}
                                                />
                                                {isError.DepositorBankName.length > 0 && (
                                                    <span className="invalid-feedback">{isError.DepositorBankName}</span>
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
                                                    disabled={page_Mode === mode.modeSTPsave ? true : false}
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
                                                    disabled={page_Mode === mode.modeSTPsave ? true : false}
                                                    value={values.ChequeDate}
                                                    onChange={ChequeDate_Onchange}
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
                                            <CInput

                                                name="AmountPaid"
                                                id="AmountPaid"
                                                cpattern={decimalRegx}
                                                // defaultValue={values.AmountPaid}
                                                value={values.AmountPaid}
                                                disabled={page_Mode === mode.modeSTPsave ? true : false}
                                                className={isError.AmountPaid.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={AmountPaid_onChange}

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
                                                id="Description"
                                                name="Description"
                                                value={values.Description}
                                                type="text"
                                                className={isError.Description.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Description"
                                                autoComplete='off'
                                                // autoFocus={true}
                                                onChange={(event) => { onChangeText({ event, state, setState }) }}
                                            />
                                            {isError.Description.length > 0 && (
                                                <span className="invalid-feedback">{isError.Description}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>

                        {!(IsSystemSetting) && <ToolkitProvider
                            keyField="id"
                            data={Data}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <div className="table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            id="table_Arrow"
                                            bordered={true}
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}
                                            {...toolkitProps.baseProps}
                                        />
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>
                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>
                        }

                        {!(IsSystemSetting) ?
                            Data.length > 0 ?
                                <FormGroup>
                                    <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                        <SaveButton pageMode={pageMode}
                                            loading={saveBtnloading}
                                            onClick={saveHandeller}
                                            userAcc={userPageAccessState}
                                            editCreatedBy={editCreatedBy}
                                        />
                                    </Col>
                                </FormGroup > : null
                            : <FormGroup >
                                <Col style={{ marginTop: "8px" }}>
                                    <SaveButton pageMode={pageMode}
                                        loading={saveBtnloading}
                                        onClick={saveHandeller}
                                        userAcc={userPageAccessState}
                                        editCreatedBy={editCreatedBy}
                                    />
                                </Col>
                            </FormGroup >
                        }

                    </form>
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

export default Receipts

