import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from "reactstrap";
import Flatpickr from "react-flatpickr"
import { MetaTags } from "react-meta-tags";
import { AlertState, BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../store/actions";
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
import { breadcrumbReturnFunc, btnIsDissablefunc, currentDate, loginCompanyID, loginPartyID, loginUserID, } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { countlabelFunc } from "../../../components/Common/CommonPurchaseList";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { BankListAPI, GetOpeningBalance, GetOpeningBalance_Success, ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success, ReceiptTypeAPI, saveReceiptMaster, saveReceiptMaster_Success } from "../../../store/Accounting/Receipt/action";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";

const Receipts = (props) => {
    debugger
    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {
        ReceiptDate: currentDate,
        OpeningBalanceAmt: "",
        Customer: "",
        ReceiptModeName: "",
        AmountPaid: 0,
        BankName: "",
        ChequeNo: "",
        DepositorBankName: "",
        Description: "",
        ChequeDate: currentDate,
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState(123);
    const [editCreatedBy, seteditCreatedBy] = useState("");

    //Access redux store Data /  'save_ModuleSuccess' action data
    const { postMsg,
        ReceiptGoButton,
        OpeningBalance,
        pageField,
        RetailerList,
        BankList,
        ReceiptModeList,
        ReceiptType,
        userAccess } = useSelector((state) => ({
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
        dispatch(BankListAPI())
    }, []);

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`Receipt Count :${Data.length}`))
    }, [ReceiptGoButton]);

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

    useEffect(() => {

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            let insidePageMode = null
            let Data = null
            if (hasShowloction) {
                insidePageMode = location.pageMode;
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props[mode.editValue]
                insidePageMode = props.pageMode;
                setPageMode(props.pageMode)
                setModalCss(true)
            }

            if (hasEditVal) {

                const { id, CustomerID, Customer,
                    Description, ReceiptMode, ReceiptModeName,
                    Bank, BankName, AmountPaid, DocumentNo, } = hasEditVal
                setState((i) => {
                    i.values.Customer = { value: CustomerID, label: Customer }
                    i.values.ReceiptModeName = { value: ReceiptMode, label: ReceiptModeName }
                    i.values.BankName = { value: Bank, label: BankName }
                    i.values.Description = Description
                    i.values.ChequeNo = DocumentNo
                    i.values.AmountPaid = AmountPaid

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

    //This UseEffect 'SetEdit' data and 'autoFocus' while this Component load First Time.
    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            dispatch(ReceiptGoButtonMaster_Success([]))
            setState(() => resetFunction(fileds, state))// Clear form values 
            // dispatch(Breadcrumb_inputName(''))
            if (pageMode === "other") {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                }))
            }
            else {
                dispatch(AlertState({
                    Type: 1,
                    Status: true,
                    Message: postMsg.Message,
                    RedirectPath: url.RECEIPTS_LIST,
                }))
            }
        }
        else if (postMsg.Status === true) {
            dispatch(saveReceiptMaster_Success({ Status: false }))
            dispatch(AlertState({
                Type: 4,
                Status: true,
                Message: JSON.stringify(postMsg.Message),
                RedirectPath: false,
                AfterResponseAction: false
            }));
        }
    }, [postMsg])

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
            text: "Receipt Date",
            dataField: "InvoiceDate",
        },
        {
            text: "Bill No",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Bill Amount",
            dataField: "GrandTotal",
        },
        {
            text: "Paid",
            dataField: "PaidAmount",
        },
        {
            text: "Bal Amt",
            dataField: "BalanceAmount",
        },
        {
            text: "Calculate",
            dataField: "",
            formatter: (cellContent, row, key) => {

                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <Input
                        key={`Quantity${row.FullInvoiceNumber}${key}`}
                        id={`Quantity${row.FullInvoiceNumber}`}
                        defaultValue={row.Calculate}
                        // value={row.Calculate}
                        // type="text"
                        autoComplete="off"
                        className="col col-sm text-center"
                        onChange={(e) => CalculateOnchange(e, row, key)}

                    />
                </span>)
            },
            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            },
        },
    ];

    const pageOptions = {
        // sizePerPage: 10,
        totalSize: Data.length,
        custom: true,
    };

    // Customer dropdown function
    function CustomerOnChange(e) {
        debugger
        setState((i) => {
            i.values.AmountPaid = 0
            i.hasValid.AmountPaid.valid = true;
            return i
        })
        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: e.value,
            ReceiptDate: values.ReceiptDate
        });
        const body = { jsonBody, pageMode }
        dispatch(ReceiptGoButtonMaster(body));
        dispatch(GetOpeningBalance(jsonBody));
    }

    // Calculate Input box onChange Function
    function CalculateOnchange(event, row, key) {
        debugger
        let input = event.target.value
        let result = /^\d*(\.\d{0,2})?$/.test(input);
        let val1 = 0;
        if (result) {
            let v1 = Number(row.BalanceAmount);
            let v2 = Number(input)
            if (v1 >= v2) { val1 = input }
            else { val1 = v1 };

        }
        else if (result === false) {
            val1 = row.Calculate
        }
        else {
            val1 = 0
        }

        event.target.value = val1;

        row.Calculate = event.target.value

        let CalculateAmount = Data.map((index) => {
            return parseFloat(index.Calculate)
        })

        const sum = CalculateAmount.reduce((partialSum, a) => partialSum + a, 0);

        // let sum1 = document.getElementById("AmountPaid").value = sum.toFixed(2)

        setState((i) => {
            let a = { ...i }
            a.values.AmountPaid = sum.toFixed(2)
            a.hasValid.AmountPaid.valid = true;
            return a
        })

    };

    function AmountPaid_onChange(event, state) {
        debugger
        let input = event.target.value

        let result = /^\d*(\.\d{0,2})?$/.test(input);

        let BalanceAmount = Data.map((index) => {
            return parseFloat(index.BalanceAmount)
        })
        const sum = BalanceAmount.reduce((partialSum, a) => partialSum + a, 0);

        let val1 = 0;
        if (result) {
            let v1 = Number(sum);
            let v2 = Number(input)
            if (v1 >= v2) { val1 = input }
            else { val1 = v1 };

        }
        else if (result === false) {
            val1 = input.slice(0, -1);
        }
        else {
            val1 = 0
        }
        event.target.value = val1;

        AmountPaidDistribution(val1)

    }

    function AmountPaidDistribution(val1) {
        let value = Number(val1)

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
                document.getElementById(`Quantity${index.FullInvoiceNumber}`).value = index.Calculate
            } catch (e) { }
        })
    }

    function ReceiptModeOnchange(event) {
        setState((i) => {
            i.values.BankName = '';
            i.values.DepositorBankName = '';
            i.values.ChequeNo = '';
            i.hasValid.BankName.valid = true;
            i.hasValid.DepositorBankName.valid = true;
            i.hasValid.ChequeNo.valid = true;
            return i
        })
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

        if (values.ReceiptModeName.label === "Cheque") {
            const invalidMsg1 = []

            if (values.BankName === "") {
                invalidMsg1.push(`BankName Is Required`)
            }
            if (values.DepositorBankName === "") {
                invalidMsg1.push(`DepositorBankName Is Required`)
            };
            if (values.ChequeNo === "") {
                invalidMsg1.push(`ChequeNo Is Required`)
            };

            if ((values.BankName === "")
                || (values.DepositorBankName === "")
                || (values.ChequeNo === "")
                || (values.ChequeDate === "")) {

                dispatch(
                    AlertState({
                        Type: 4,
                        Status: true,
                        Message: JSON.stringify(invalidMsg1),
                    })
                );
                return;
            }
        }

        const ReceiptTypeID = ReceiptType.find((index) => {
            return index.Name === "Receipt"
        })

        const ReceiptInvoices1 = Data.map((index) => ({
            Invoice: index.Invoice,
            GrandTotal: index.GrandTotal,
            PaidAmount: index.Calculate,
            flag: 0
        }))

        const FilterReceiptInvoices = ReceiptInvoices1.filter((index) => {
            return index.PaidAmount > 0
        })

        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                var BulkData = [{
                    "ReceiptDate": values.ReceiptDate,
                    "Description": values.Description,
                    "AmountPaid": values.AmountPaid,
                    "BalanceAmount": "",
                    "OpeningBalanceAdjusted": "",
                    "DocumentNo": values.ChequeNo,
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
                    "ReceiptInvoices": FilterReceiptInvoices
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
                <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

                <div className="page-content" style={{ marginBottom: "5cm" }}>

                    <form noValidate>
                        <div className="px-2 c_card_filter header text-black mb-2" >

                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.ReceiptDate}  </Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name='ReceiptDate'
                                                value={values.ReceiptDate}
                                                disabled={page_Mode===mode.modeSTPsave ? true:false}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
                                                onChange={ReceiptDate_Onchange}
                                            />
                                        </Col>

                                    </FormGroup>
                                </Col >
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.Customer} </Label>
                                        <Col sm="7">
                                            <Select
                                                name="Customer"
                                                isDisabled={page_Mode === mode.modeSTPsave ? true : false}
                                                value={values.Customer}
                                                isSearchable={true}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
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
                                    <FormGroup className=" row mt-2 " >
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
                                    <FormGroup className=" row mt-2 " >
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
                                                classNamePrefix="dropdown"
                                                options={ReceiptModeOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState, })
                                                    ReceiptModeOnchange(hasSelect)
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
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.BankName} </Label>
                                            <Col sm="7">
                                                <Select
                                                    name="BankName"
                                                    value={values.BankName}
                                                    isDisabled={page_Mode === mode.modeSTPsave ? true : false}
                                                    isSearchable={true}
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
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.DepositorBankName} </Label>
                                            <Col sm="7">
                                                <Select
                                                    name="DepositorBankName"
                                                    value={values.DepositorBankName}

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
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.ChequeNo}</Label>
                                            <Col sm="7">
                                                <Input
                                                    name="ChequeNo"
                                                    disabled={page_Mode === mode.modeSTPsave ? true : false}
                                                    value={values.ChequeNo}
                                                    type="text"
                                                    className={isError.ChequeNo.length > 0 ? "is-invalid form-control" : "form-control"}
                                                    placeholder="Please Enter Cheque Number"
                                                    autoComplete='off'
                                                    autoFocus={true}
                                                    onChange={(event) => {
                                                        onChangeText({ event, state, setState })
                                                    }}
                                                />
                                                {isError.ChequeNo.length > 0 && (
                                                    <span className="invalid-feedback">{isError.ChequeNo}</span>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col >

                                    <Col sm="6">
                                        <FormGroup className=" row mt-2 " >
                                            <Label className="col-sm-1 p-2"
                                                style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.ChequeDate}</Label>
                                            <Col sm="7">
                                                <Flatpickr
                                                    name='ChequeDate'
                                                    value={values.ChequeDate}
                                                    className="form-control d-block p-2 bg-white text-dark"
                                                    placeholder="Select..."
                                                    options={{
                                                        altInput: true,
                                                        altFormat: "d-m-Y",
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    onChange={ChequeDate_Onchange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col >
                                </Row>
                            }

                            <Row>
                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>  {fieldLabel.AmountPaid}</Label>
                                        <Col sm="7">
                                            <Input

                                                name="AmountPaid"
                                                id="AmountPaid"
                                                // defaultValue={values.AmountPaid}
                                                value={values.AmountPaid}
                                                disabled={page_Mode === mode.modeSTPsave ? true : false}
                                                className={isError.AmountPaid.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                    AmountPaid_onChange(event, state)
                                                }}
                                            />
                                            {isError.AmountPaid.length > 0 && (
                                                <span className="invalid-feedback">{isError.AmountPaid}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >

                                <Col sm="6">
                                    <FormGroup className=" row mt-2 " >
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
                                                autoFocus={true}
                                                onChange={(event) => { onChangeText({ event, state, setState }) }}
                                            />
                                            {isError.Description.length > 0 && (
                                                <span className="invalid-feedback">{isError.Description}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col >
                            </Row>

                        </div>

                        {/* <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                        >
                            {({ paginationProps, paginationTableProps }) => ( */}
                        <ToolkitProvider

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
                                            bordered={true}
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}

                                            {...toolkitProps.baseProps}
                                        // {...paginationTableProps}
                                        />

                                        {/* {countlabelFunc(toolkitProps, "", dispatch, "Receipt")} */}
                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>

                                    {/* <Row className="align-items-md-center mt-30">
                                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                                    <PaginationListStandalone
                                                        {...paginationProps}
                                                    />
                                                </Col>
                                            </Row> */}
                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>
                        {/* )
                            }

                        </PaginationProvider> */}

                        {Data.length > 0 ?
                            <FormGroup>
                                <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                    <SaveButton pageMode={pageMode}
                                        onClick={saveHandeller}
                                        userAcc={userPageAccessState}
                                        editCreatedBy={editCreatedBy}
                                        module={"Receipts"}
                                    />

                                </Col>
                            </FormGroup >
                            : null
                        }

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

export default Receipts

