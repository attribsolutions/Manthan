

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
    BreadcrumbShowCountlabel,
    Breadcrumb_inputName,
    commonPageField,
    commonPageFieldSuccess,
} from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AlertState } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeSelect,
    onChangeText,
    resetFunction
} from "../../../components/Common/validationFunction";
import { SaveButton } from "../../../components/Common/CommonButton";
import {
    breadcrumbReturnFunc,
    btnIsDissablefunc,
    loginCompanyID,
    loginPartyID,
    loginUserID
} from "../../../components/Common/CommonFunction";
import Select from "react-select";
import Flatpickr from "react-flatpickr"
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { CInput } from "../../../CustomValidateForm/CInput";
import { decimalRegx, onlyNumberRegx } from "../../../CustomValidateForm/RegexPattern"
import { ReceiptGoButtonMaster, ReceiptGoButtonMaster_Success } from "../../../store/Accounting/Receipt/action";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { postSelect_Field_for_dropdown } from "../../../store/Administrator/PartyMasterBulkUpdateRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { CredietDebitType, EditCreditlistSuccess, Invoice_Return_ID, Invoice_Return_ID_Success, saveCredit, saveCredit_Success } from "../../../store/Accounting/CreditRedux/action";
import { InvoiceNumber, InvoiceNumberSuccess } from "../../../store/Sales/SalesReturnRedux/action";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { calculateSalesReturnFunc } from "../../Sale/SalesReturn/SalesCalculation";

const Credit = (props) => {
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
        calculate: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds));
    const [pageMode, setPageMode] = useState(mode.defaultsave);//changes
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState(198);
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [calculation, Setcalculation] = useState([]);
    const [Table, setTable] = useState([]);
    const [Table1, setTable1] = useState([]);
    const [TotalSum, setTotalSum] = useState(0);

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        ReceiptGoButton,
        RetailerList,
        InvoiceNo,
        CreditDebitType,
        ReceiptModeList,
        InvoiceReturn,
        saveBtnloading,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.CredietDebitReducer.saveBtnloading,
            postMsg: state.CredietDebitReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            InvoiceReturn: state.CredietDebitReducer.InvoiceReturn,
            ReceiptGoButton: state.ReceiptReducer.ReceiptGoButton,
            ReceiptModeList: state.PartyMasterBulkUpdateReducer.SelectField,
            InvoiceNo: state.SalesReturnReducer.InvoiceNo,
            updateMsg: state.BankReducer.updateMessage,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    useEffect(() => {
        const page_Id = pageId.CREDIT//changes
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(ReceiptGoButtonMaster_Success([]))
        dispatch(Invoice_Return_ID_Success([]))
        dispatch(InvoiceNumberSuccess([]))
    }, []);

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;
    let { Data = [] } = ReceiptGoButton;
    const { InvoiceItems = [] } = InvoiceReturn;
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
                setTable(CRDRInvoices)

                setTable1(CRDRNoteItems)

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
            PartyID: loginPartyID(),
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

    const CreditDebitTypeId = CreditDebitType.find((index) => {
        return index.Name === "CreditNote"
    });

    const GoodsCreditType = CreditDebitType.find((index) => {
        return index.Name === "Goods CreditNote"
    })

    function DateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.DebitDate = date;
            a.hasValid.DebitDate.valid = true
            return a
        })
    };

    function InvoiceNoOnChange(e) {
        let id = e.value
        dispatch(Invoice_Return_ID(id));
    };

    function CustomerOnChange(e) { // Customer dropdown function
        setState((i) => {
            i.values.GrandTotal = 0
            i.hasValid.GrandTotal.valid = true;
            return i
        })

        const jsonBody = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: e.value,
            InvoiceID: ""
        });
        const body = { jsonBody, pageMode }
        dispatch(ReceiptGoButtonMaster(body));
        const jsonBody1 = JSON.stringify({
            PartyID: loginPartyID(),
            CustomerID: e.value
        });

        dispatch(InvoiceNumber(jsonBody1));
    };

    function CalculateOnchange(event, row, key) {  // Calculate Input box onChange Function
        let input = event.target.value
        let v1 = Number(row.BalanceAmount);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = v1;
        }
        row.Calculate = event.target.value
        let calSum = 0
        Data.forEach(element => {
            calSum = calSum + Number(element.Calculate)
        });
        setState((i) => {
            let a = { ...i }
            a.values.GrandTotal = calSum
            a.hasValid.GrandTotal.valid = true;
            return a
        })
    };

    function AmountPaid_onChange(event) {
        let input = event.target.value
        let sum = 0
        Data.forEach(element => {
            sum = sum + Number(element.BalanceAmount)
        });

        let v1 = Number(sum);
        let v2 = Number(input)
        if (!(v1 >= v2)) {
            event.target.value = Number(v1.toFixed(2));
        }
        onChangeText({ event, state, setState })
        AmountPaidDistribution(event.target.value)
        dispatch(BreadcrumbShowCountlabel(`${"Calculate Amount"} :${_cfunc.amountCommaSeparateFunc(event.target.value)}`))
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

    function val_onChange(val, row, type, key) {

        if (type === "qty") {
            row["Qty"] = val;
        }
        else {
            row["Rate"] = val
        }
        row.gstPercentage = row.GSTPercentage
        const calculate = calculateSalesReturnFunc(row)

        row["AmountTotal"] = Number(calculate.roundedTotalAmount);
        row["BasicAmount"] = Number(calculate.basicAmount);
        row["GSTAmount"] = Number(calculate.roundedGstAmount);
        row["CGSTAmount"] = Number(calculate.CGST_Amount);
        row["SGSTAmount"] = Number(calculate.SGST_Amount);

        let sum = 0
        InvoiceItems.forEach(ind => {
            if (ind.AmountTotal === undefined) {
                ind.AmountTotal = 0
            }
            var amt = parseFloat(ind.AmountTotal)
            sum = sum + amt
        });
        let v1 = (row.BaseUnitQuantity);
        let v2 = Number(val)
        if (!(v1 >= v2)) {
            val = v1;

        }
        setState((i) => {
            let a = { ...i }
            a.values.GrandTotal = Number(sum).toFixed(2)
            a.hasValid.GrandTotal.valid = true;
            return a
        })
        setTotalSum(sum)
        AmountPaidDistribution(sum)
        dispatch(BreadcrumbShowCountlabel(`${"Calculate Amount"} :${Number(sum).toFixed(2)}`))
        try {
            document.getElementById(`Qty${key}`).value = val
        } catch (e) { }
    };

    function UnitOnchange(e, row, key) {

        row.unit = e.value
    };

    const pagesListColumns1 = [
        {
            text: "ItemName",
            dataField: "ItemName",
        },
        {
            text: "BaseUnitQuantity",
            dataField: "BaseUnitQuantity",
        },
        {
            text: "Unit Name",
            dataField: "UnitName",
            headerStyle: (colum, colIndex) => {
                return { width: '60px', textAlign: 'center' };
            },
        },

        {
            text: "Quantity ",
            dataField: "",
            formatter: (cellContent, row, key) => {

                return (<span >

                    <CInput
                        key={`Qty${row.Item}${key}`}
                        id={`Qty${key}`}
                        cpattern={onlyNumberRegx}
                        defaultValue={null}
                        autoComplete="off"
                        className=" text-end"
                        onChange={(e) => {
                            const val = e.target.value
                            val_onChange(val, row, "qty", key)
                        }}
                    />
                </span>)
            }
        },
        {
            text: "Unit",
            dataField: "",
            formatter: (cellContent, row, key) => {

                if (pageMode !== mode.view) {
                    const Units = row.ItemUnitDetails.map((index) => ({
                        value: index.Unit,
                        label: index.UnitName,
                    }));


                    return (<span style={{ justifyContent: 'center', width: "100px" }}>
                        <Select
                            id={`Unit${key}`}
                            name="Unit"
                            defaultValue={row.Calculate}
                            isSearchable={true}
                            className="react-dropdown"
                            classNamePrefix="dropdown"
                            options={Units}
                            onChange={(e) => UnitOnchange(e, row, key)}

                        />
                    </span>)
                } else {
                    row.unit = { label: row.UnitName, value: row.Unit };
                    return (<span style={{ justifyContent: 'center', width: "100px" }}>

                        <Select
                            id={`Unit${key}`}
                            name="Unit"
                            defaultValue={row.unit}
                            disabled={true}
                            isSearchable={true}
                            className="react-dropdown"
                            classNamePrefix="dropdown"
                            onChange={(e) => UnitOnchange(e, row, key)}

                        />
                    </span>)

                }

            }
        },
        {
            text: "Rate",
            dataField: "",
            formatter: (cellContent, row, key) => {

                return (<span >
                    <CInput
                        type="text"
                        key={`Ratey${row.Item}${key}`}
                        id={`Ratey${key}`}
                        defaultValue={row.Rate}
                        disabled={pageMode === mode.view ? true : false}
                        cpattern={onlyNumberRegx}
                        autoComplete="off"
                        className=" text-end"
                        onChange={(e) => {
                            const val = e.target.value
                            val_onChange(val, row, "Rate")

                        }}
                    />
                </span>)
            }
        },
    ];

    const pagesListColumns = [
        {
            text: "InvoiceDate",
            dataField: "InvoiceDate",
        },
        {
            text: "Invoice No",
            dataField: "FullInvoiceNumber",
        },
        {
            text: "Invoice Amount",
            dataField: "GrandTotal",
            align: () => 'right',
            formatter: (cellContent) => <>{_cfunc.amountCommaSeparateFunc(cellContent)}</>,
        },
        {
            text: "Paid",
            dataField: "PaidAmount",
            align: () => 'right',
            formatter: (cellContent) => <>{_cfunc.amountCommaSeparateFunc(cellContent)}</>,
        },
        {
            text: "Bal Amt",
            dataField: "BalanceAmount",
            align: () => 'right',
            formatter: (cellContent) => <>{_cfunc.amountCommaSeparateFunc(cellContent)}</>,
        },
        {
            text: "Calculate",
            dataField: "",
            formatter: (cellContent, row, key) => {


                return (<span style={{ justifyContent: 'center', width: "100px" }}>
                    <CInput
                        key={`Quantity${row.FullInvoiceNumber}${key}`}
                        id={`Quantity${row.FullInvoiceNumber}`}
                        cpattern={decimalRegx}
                        defaultValue={pageMode === mode.view ? row.Amount : row.Calculate}
                        disabled={pageMode === mode.view ? true : false}
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

    const saveHandeller = async (event) => {
        const arr1 = []
        event.preventDefault();
        const btnId = event.target.id;
        if ((values.Amount === 0) || (values.Amount === "NaN")) {
            customAlert({
                Type: 3,
                Message: `Amount Paid value can not be ${values.Amount}`,
            })
            return btnIsDissablefunc({ btnId, state: false })
        }

        const ReceiptInvoices1 = Data.map((index) => ({
            Invoice: index.Invoice,
            GrandTotal: index.GrandTotal,
            PaidAmount: index.Calculate,
        }))
        const FilterReceiptInvoices = ReceiptInvoices1.filter((index) => {
            return index.PaidAmount > 0
        })

        let inValideUnits = []

        InvoiceItems.forEach(index => {

            if ((!(index.unit) && (index.Qty > 0))) {
                inValideUnits.push({ [`${index.ItemName}`]: "This Item Unit Is Required." })
            }

            if (index.Qty) {

                const CRDRNoteItems = {
                    CRDRNoteDate: values.CRDRNoteDate,
                    Item: index.Item,
                    Quantity: Number(index.Qty),
                    Unit: index.unit,
                    BaseUnitQuantity: index.BaseUnitQuantity,
                    MRP: index.MRP,
                    Rate: index.Rate,
                    BasicAmount: index.BasicAmount,
                    TaxType: index.TaxType,
                    GST: index.GST,
                    GSTAmount: index.CGSTAmount,
                    Amount: index.AmountTotal,
                    CGST: index.CGSTAmount,
                    SGST: index.SGSTAmount,
                    IGST: index.IGST,
                    BatchCode: index.BatchCode,
                    CGSTPercentage: index.CGSTPercentage,
                    SGSTPercentage: index.SGSTPercentage,
                    IGSTPercentage: index.IGSTPercentage,

                }
                arr1.push(CRDRNoteItems)
            }

        })

        if (inValideUnits.length > 0) {
            customAlert({
                Type: 3,
                Message: inValideUnits
            })
            return btnIsDissablefunc({ btnId, state: false })
        }

        try {
            if (formValid(state, setState)) {
                btnIsDissablefunc({ btnId, state: true })

                const jsonBody = JSON.stringify({
                    CRDRNoteDate: values.CRDRNoteDate,
                    Customer: values.Customer.value,
                    NoteType: arr1.length === 0 ? CreditDebitTypeId.id : GoodsCreditType.id,
                    GrandTotal: values.GrandTotal,
                    Narration: values.Narration,
                    NoteReason: values.NoteReason.value,
                    CRDRNoteItems: arr1 ? arr1 : [],
                    Party: loginPartyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    CRDRInvoices: FilterReceiptInvoices,
                })
                dispatch(saveCredit({ jsonBody, btnId }));
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
                        <div className="px-2 c_card_filter header text-black mb-1" >
                            <Row>
                                <Col sm="6">
                                    <FormGroup className="row mt-2" >
                                        <Label className="col-sm-1 p-2"
                                            style={{ width: "115px", marginRight: "0.4cm" }}>{fieldLabel.CRDRNoteDate}</Label>
                                        <Col sm="7">
                                            <Flatpickr
                                                name='CreditDate'
                                                value={values.CRDRNoteDate}
                                                className="form-control d-block p-2 bg-white text-dark"
                                                placeholder="Select..."
                                                options={{
                                                    altInput: true,
                                                    altFormat: "d-m-Y",
                                                    dateFormat: "Y-m-d",
                                                }}
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
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState });
                                                    CustomerOnChange(hasSelect)
                                                }}
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
                                                className={isError.GrandTotal.length > 0 ? "is-invalid form-control" : "form-control"}
                                                placeholder="Please Enter Amount"
                                                autoComplete='off'
                                                autoFocus={true}
                                                onChange={AmountPaid_onChange}
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
                                            <Select
                                                id="InvoiceNO "
                                                name="InvoiceNO"
                                                value={values.InvoiceNO}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={InvoiceNo_Options}
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

                        <ToolkitProvider
                            keyField="id"
                            data={Table1.length <= 0 ? InvoiceItems : Table1}
                            columns={pagesListColumns1}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    {InvoiceItems.length <= 0 ? null : <div className="table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            bordered={true}
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}

                                            {...toolkitProps.baseProps}

                                        />

                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>

                                    }
                                    {Table1.length <= 0 ? null : <div className="table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            bordered={true}
                                            striped={false}
                                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                            classes={"table align-middle table-nowrap table-hover"}
                                            headerWrapperClasses={"thead-light"}

                                            {...toolkitProps.baseProps}

                                        />

                                        {mySearchProps(toolkitProps.searchProps)}
                                    </div>
                                    }

                                </React.Fragment>
                            )
                            }
                        </ToolkitProvider>
                        {
                            <ToolkitProvider

                                keyField="id"
                                data={Table.length <= 0 ? Data : Table}
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

                                            />

                                            {mySearchProps(toolkitProps.searchProps)}
                                        </div>

                                    </React.Fragment>
                                )
                                }
                            </ToolkitProvider>}

                        {Data.length > 0 ?
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
                            : null
                        }

                    </form >
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
export default Credit;
