
import Select from "react-select";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button, Col, Dropdown, DropdownMenu, DropdownToggle, Input, Label, Row, FormGroup
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import Flatpickr from "react-flatpickr";
import { orderCalculateFunc } from "../../Purchase/Order/OrderPageCalulation";
import { C_Button, SaveButton } from "../../../components/Common/CommonButton";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";

import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";
import * as _act from "../../../store/actions";

import { CInput, C_DatePicker, decimalRegx, decimalRegx_3dit } from "../../../CustomValidateForm";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { pageFieldUseEffect, saveMsgUseEffect, table_ArrowUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { goButtonForRate_Master, saveRateMaster } from "../../../store/Administrator/RateMasterRedux/action";
import { Get_ledger, Invoice_No_Message } from "../../../helpers/backend_helper";




//// This GRN_ADD_1 Page is Use For  Sweets and Snacks GRN  Add page Use for 2 MODE From vendor Order to GRN & Inter Branch GRN
let initialTableData = []



function initialState(history) {

    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.GRN_ADD_1 || sub_Mode === url.BATCH_TRACEABILITY) {
        page_Id = pageId.GRN_ADD_1;
        listPath = url.GRN_LIST_3;
    }
    else if ((sub_Mode === url.ACCOUNTING_GRN)) {
        page_Id = pageId.ACCOUNTING_GRN;
        listPath = url.ACCOUNTING_GRN_LIST;
    } else if ((sub_Mode === url.IB_GRN)) {
        page_Id = pageId.IB_GRN;
        listPath = url.IB_INVOICE_FOR_GRN;
    }
    else if ((sub_Mode === url.GRN_LIST_3) && _cfunc.IsSweetAndSnacksCompany()) {
        page_Id = pageId.GRN_ADD_1;
        listPath = url.GRN_LIST_3;
    }
    return { page_Id, listPath, sub_Mode }
};



const GRN_ADD_1 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();


    const [pageMode, setPageMode] = useState(mode.defaultsave);

    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [subPageMode] = useState(initialState(history).sub_Mode)

    const [ledgerSelect, setLedgerSelect] = useState();

    const [ledgerOptions, setledgerOptions] = useState([]);

    const [ledgerDetailList, setledgerDetailList] = useState([]);

    const [comment, setComment] = useState('');


    const [userPageAccessState, setUserAccState] = useState('');

    const fileds = {
        GRNDate: currentDate_ymd,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [grnDate, setgrnDate] = useState(currentDate_ymd);
    const [orderAmount, setOrderAmount] = useState(0);

    const [grnDetail, setGrnDetail] = useState({});
    const [grnItemList, setgrnItemList] = useState([]);
    const [openPOdrp, setOpenPOdrp] = useState(false);
    const [openPOdata, setOpenPOdata] = useState([]);

    const [roundoffAmount, setRoundoffAmount] = useState(0);

    const [invoiceNo, setInvoiceNo] = useState('');

    const [PostingDate, setPostingDate] = useState(currentDate_ymd);



    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [EditData, setEditData] = useState({});
    const [ratePostJsonBody, setRatePostJsonBody] = useState([]);

    const {
        items,
        postMsg,
        userAccess,
        pageField,
        saveBtnloading,
        RateMasterGoButton,
        AccontingGRN,
        genralMaster_type69
    } = useSelector((state) => ({
        saveBtnloading: state.GRNReducer.saveBtnloading,
        items: state.GRNReducer.GRNitem,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,
        AccontingGRN: state.GRNReducer.AccontingGRNpayload,
        RateMasterGoButton: state.RateMasterReducer.RateMasterGoButton,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        genralMaster_type69: state.PartyMasterBulkUpdateReducer.SelectField,

    }));

    useEffect(() => {
        dispatch(_act.commonPageFieldSuccess(null));
        dispatch(_act.commonPageField(page_id));
        const jsonBody = JSON.stringify({
            "PriceList": 0, // hard code 0 PriceList find On backend side based on loginPartyID
            "Party": _cfunc.loginPartyID(),
            "EffectiveDate": currentDate_ymd,
            "CompanyID": _cfunc.loginCompanyID()
        });
        if (subPageMode === url.ACCOUNTING_GRN) {
            dispatch(goButtonForRate_Master({ jsonBody }));
        }
        const jsonBody_1 = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 69
        });
        dispatch(_act.postSelect_Field_for_dropdown(jsonBody_1));

        return () => {
            dispatch(_act.Update_accounting_GRN_Success({ Status: false }))
        }
    }, [])


    const values = { ...state.values }
    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => userAccessUseEffect({ // userAccess common useEffect 
        props,
        userAccess,
        dispatch,
        setUserAccState,
    }), [userAccess]);

    useEffect(() => saveMsgUseEffect({// saveMsgUseEffect common useEffect 
        postMsg, pageMode,
        history, dispatch,
        postSuccss: _act.saveGRNSuccess,
        listPath: ((postMsg.GRN_Reference === url.GRN_STP_3) || (postMsg.GRN_Reference === url.ORDER_LIST_1) || (postMsg.GRN_Reference === url.VDC_INVOICE_LIST)) ? url.GRN_LIST_3 : url.IB_GRN_LIST
    }), [postMsg]);

    useEffect(() => {

        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            setgrnItemList([]);
            setGrnDetail({});
            setInvoiceNo([]);
            setOpenPOdata([]);

            // if (ratePostJsonBody.length > 0) {
            //     dispatch(saveRateMaster(JSON.stringify(ratePostJsonBody)));
            // }
        }
    }, [postMsg])

    const discrepancyOptions = genralMaster_type69.map(index => ({
        value: index.id,
        label: index.Name,
    }));
    // useEffect(() => {
    //     if (ratePostJsonBody.length > 0 && subPageMode === url.ACCOUNTING_GRN) {
    //         dispatch(saveRateMaster(JSON.stringify(ratePostJsonBody)));
    //     }
    // }, [ratePostJsonBody])


    useEffect(() => {
        debugger
        if ((AccontingGRN.Status === true) && (AccontingGRN.StatusCode === 200)) {
            if (ratePostJsonBody.length > 0 && subPageMode === url.ACCOUNTING_GRN) {
                dispatch(saveRateMaster(JSON.stringify(ratePostJsonBody)));
            }
            customAlert({
                Type: 1,
                Message: AccontingGRN.Message,
            })
            history.push({
                pathname: listPath,
            });
        }
        else if ((AccontingGRN.Status === false) && (AccontingGRN.StatusCode === 406)) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(AccontingGRN.Message),
            });
        }
    }, [AccontingGRN])

    useEffect(() => pageFieldUseEffect({// useEffect common pagefield for master
        state,
        setState,
        pageField
    }), [pageField]);

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [grnItemList]);

    useEffect(async () => {

        console.log("grnDetail", grnDetail)
        const resp = await Get_ledger()
        if (resp.Status === true && resp.StatusCode === 200) {

            setledgerOptions(resp.Data.map((i) => ({  //initial decleration
                ...i,
                value: i.id,
                label: i.Name,
                BasicAmount: 0,
                GST_Amount: 0,
                Taxable_Amount: 0,
                GST_Percent: 0,
                CGST: 0,
                SGST: 0,
                IGST: 0,
            })));
        }
    }, [])



    const onchangeHandler = (e, row, k, Type) => {
        let BasicAmount = 0
        let GST_Percentage = 0
        if (Type === "Amount") {
            BasicAmount = _cfunc.getFixedNumber(e.target.value, 2)
            GST_Percentage = row.GST_Percent
        } else if (Type === "GST") {
            BasicAmount = row.BasicAmount
            GST_Percentage = _cfunc.getFixedNumber(e.target.value, 2)
        }

        let GST_Amount = Number((((BasicAmount) * Number(GST_Percentage)) / 100).toFixed(2));
        let CGST_Amount = 0.00
        let SGST_Amount = 0.00
        let IGST_Amount = 0.00
        let Taxable_Amount = 0.00
        if (IsIGST) {
            IGST_Amount = GST_Amount
            Taxable_Amount = Number(((BasicAmount) + (IGST_Amount)).toFixed(2))
        } else {
            CGST_Amount = Number(((GST_Amount) / 2).toFixed(2))
            SGST_Amount = Number(((GST_Amount) / 2).toFixed(2))
            Taxable_Amount = Number((((CGST_Amount) + (SGST_Amount)) + (BasicAmount)).toFixed(2));
        }

        row["BasicAmount"] = BasicAmount
        row["GST_Amount"] = (GST_Amount).toFixed(2);
        row["Taxable_Amount"] = (Taxable_Amount).toFixed(2);
        row["CGST"] = CGST_Amount;
        row["SGST"] = SGST_Amount;
        row["IGST"] = IGST_Amount;

        const Taxable_Amount_elment = document.getElementById(`Taxable_Amount${row.id}`)
        if (Taxable_Amount_elment) {
            Taxable_Amount_elment.innerText = (Taxable_Amount).toFixed(2)
        }
        const CGST_elment = document.getElementById(`CGST-Ledger-${row.id}`)
        if (CGST_elment) {
            CGST_elment.innerText = row.CGST
        }
        const SGST_elment = document.getElementById(`SGST-Ledger-${row.id}`)
        if (SGST_elment) {
            SGST_elment.innerText = row.SGST
        }
        const IGST_elment = document.getElementById(`IGST-Ledger-${row.id}`)
        if (IGST_elment) {
            IGST_elment.innerText = row.IGST
        }
        const ledgerAmount = ledgerDetailList.reduce((acc, ele) => acc + Number(ele.Taxable_Amount), 0)

        const GRNAmount = grnItemList.reduce((total, ind) => {
            return total + (parseFloat(ind.Amount) || 0);
        }, 0);
        const AmountWithExpence = Number((Number(GRNAmount) + Number(ledgerAmount)).toFixed(2))
        const RoundAmount = Number(AmountWithExpence) + Number(roundoffAmount)
        const elements = document.querySelectorAll('.amount-countable-Calulation');
        elements.forEach(element => { element.innerText = _cfunc.amountCommaSeparateFunc((RoundAmount).toFixed(2)); });

    }

    useEffect(() => {

        if ((items.Status === true) && (items.StatusCode === 200)) {
            const grnItems = items.Data
            if ((grnItems.GRNReferences[0]?.GRN_From === url.IB_INVOICE_FOR_GRN)) { /// If GRN from IB GRN List then this 

                let sum = 0

                grnItems.OrderItem.forEach((ele, k) => {
                    const calculate = orderCalculateFunc(ele)


                    sum = sum + parseFloat(calculate.roundedTotalAmount)
                    ele.id = k + 1;
                    ele["poQuantity"] = ele.Quantity
                    ele["Quantity"] = ele.Quantity
                    ele["poAmount"] = ele.Amount
                    ele["Amount"] = calculate.roundedTotalAmount
                    ele["BatchDate"] = currentDate_ymd
                    ele["BatchCode"] = ele.BatchCode
                    ele["delbtn"] = false
                    ele["Invoice"] = null

                });
                dispatch(_act.BreadcrumbShowCountlabel(`Count:${grnItems.OrderItem.length} currency_symbol ${sum.toFixed(2)}`));
            } else {                                                       // IF GRN From Vendor Order list 
                grnItems.OrderItem.forEach((ele, k) => {
                    ele.id = k + 1;
                    ele["poQuantity"] = ele.Quantity
                    ele["Quantity"] = ""
                    ele["poAmount"] = ele.Amount
                    ele["Amount"] = 0
                    ele["BatchDate"] = currentDate_ymd
                    ele["BatchCode"] = ele.BatchCode
                    ele["delbtn"] = false
                    ele["Invoice"] = null
                    ele["ItemExpiryDate"] = undefined
                });
                dispatch(_act.BreadcrumbShowCountlabel(`Count:${grnItems.OrderItem.length} currency_symbol ${0}`));
            }


            initialTableData = []
            const grnDetails = { ...grnItems }

            initialTableData = grnDetails.OrderItem;
            setgrnItemList(initialTableData)
            grnDetails.OrderItem = []

            grnDetails["InvoiceDate"] = _cfunc.date_ymd_func(grnDetails.InvoiceDate)
            grnDetails["DemandDate"] = _cfunc.date_ymd_func(grnDetails.DemandDate)

            setGrnDetail(grnDetails)
            setInvoiceNo(grnDetails.GRNReferences[0]?.Invoice_NO)

            setOpenPOdata(grnDetails.GRNReferences)

            items.Status = false
            dispatch(_act.makeGRN_Mode_1ActionSuccess({ Status: false }))


        }

    }, [items])


    useEffect(() => {

        if (history?.location?.state?.isAccountingGRN && subPageMode === url.ACCOUNTING_GRN) { // Accounting GRN

            const Data = history.location.state
            const grnDetails = { ...Data }

            const OrderDetail = grnDetails?.GRNReferences[0]?.Order
            let sum = 0

            Data.GRNItems.forEach((index, k) => {
                index["GSToption"] = index.GSTDropdown?.map(i => ({ value: i.GST, label: i.GSTPercentage, }));
                if (index.GST === null) {
                    const deFaultValue = index.GSTDropdown?.filter(i => i.GSTPercentage === index.GSTPercentage);
                    if (deFaultValue.length === 0) {
                        const highestGSTObject = index.GSTDropdown?.reduce((maxObj, current) =>
                            current.GST > maxObj.GST ? current : maxObj, index.GSTDropdown[0]);
                        index["GSTPercentage"] = highestGSTObject.GSTPercentage
                        index["GST"] = highestGSTObject.GST;
                    }
                    else {
                        index["GSTPercentage"] = deFaultValue[0]?.GSTPercentage
                        index["GST"] = deFaultValue[0]?.GST;
                    }

                } else {
                    if (index.GSTDropdown) {
                        const deFaultValue = index.GSTDropdown?.filter(i => i.GST === index.GST);
                        index["GSTPercentage"] = (deFaultValue === undefined) ? "" : deFaultValue[0]?.GSTPercentage;
                        index["GST"] = (deFaultValue === undefined) ? "" : deFaultValue[0]?.GST;
                    } else {
                        index["GSTPercentage"] = index.GSTPercentage
                    }
                }

                const calculate = orderCalculateFunc(index, { GSTIn_1: OrderDetail?.Supplier?.GSTIN, GSTIn_2: OrderDetail?.Customer?.GSTIN })

                sum = sum + parseFloat(calculate.roundedTotalAmount)
                index.id = k + 1;
                index["poQuantity"] = index.Quantity
                index["Quantity"] = index.Quantity
                index["poAmount"] = index.Amount
                index["CGST"] = calculate.CGST_Amount
                index["SGST"] = calculate.SGST_Amount
                index["IGST"] = calculate.IGST_Amount
                index["Amount"] = calculate.roundedTotalAmount
                index["BatchDate"] = currentDate_ymd
                index["BatchCode"] = index.BatchCode
                index["delbtn"] = false
                index["Invoice"] = null
                index["BasicAmount"] = calculate.basicAmount
                index["ItemExpiryDate"] = index.ItemExpiryDate
            });
            const RoundAmount = (Number(sum) + Number(Data.RoundOffAmount))

            setOrderAmount((RoundAmount).toFixed(2))


            dispatch(_act.BreadcrumbShowCountlabel(`Count:${Data.GRNItems.length} currency_symbol ${_cfunc.amountCommaSeparateFunc((RoundAmount).toFixed(2))}`));

            initialTableData = []
            setRoundoffAmount(Data.RoundOffAmount)

            grnDetails["SupplierName"] = Data.PartyName
            grnDetails["Supplier"] = Data.Party


            grnDetails.GRNReferences[0]["Full_OrderNumber"] = OrderDetail.FullOrderNumber
            grnDetails.GRNReferences[0]["Order"] = null  // If accounting Grn then send null  Order
            grnDetails.GRNReferences[0]["Inward"] = OrderDetail.OrderReferences[0].Inward ///when Accounting grn alwys true
            grnDetails.GRNReferences[0]["CustomerID"] = OrderDetail.Customer.id
            grnDetails.GRNReferences[0]["CustomerName"] = OrderDetail.Customer.Name
            grnDetails.GRNReferences[0]["Order"] = OrderDetail.id
            grnDetails.GRNReferences[0]["OrderDate"] = OrderDetail.OrderDate
            grnDetails.GRNReferences[0]["POType"] = OrderDetail.POType.id


            initialTableData = grnDetails.GRNItems;
            setgrnItemList(initialTableData)
            setgrnDate(grnDetails.GRNDate)
            grnDetails.GRNItems = []

            grnDetails["InvoiceDate"] = _cfunc.date_ymd_func(grnDetails.InvoiceDate)
            grnDetails["DemandDate"] = _cfunc.date_ymd_func(grnDetails.DemandDate)
            grnDetails["SupplierGSTIN"] = OrderDetail?.Supplier?.GSTIN
            grnDetails["CustomerGSTIN"] = OrderDetail?.Customer?.GSTIN

            setGrnDetail(grnDetails)
            setInvoiceNo(grnDetails?.InvoiceNumber)
            setOpenPOdata(grnDetails.GRNReferences)
            items.Status = false


        }

    }, [history.location.state])

    useEffect(() => {
        debugger
        if ((hasShowloction || hasShowModal)) {
            let hasEditVal = null
            if (hasShowloction) {
                setPageMode(location.pageMode)
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                setPageMode(props.pageMode)
            }

            if (hasEditVal) {
                setEditData(hasEditVal);
                const { GRNItems = [], GRNReferences = [], InvoiceNumber, GrandTotal } = hasEditVal;
                GRNReferences[0]["Full_OrderNumber"] = GRNReferences[0]?.Order?.FullOrderNumber
                setOpenPOdata(GRNReferences)
                setInvoiceNo(InvoiceNumber)
                setGrnDetail(hasEditVal);
                setgrnItemList(GRNItems)
                dispatch(_act.BreadcrumbShowCountlabel(`Count:${GRNItems.length} currency_symbol ${_cfunc.amountCommaSeparateFunc((Number(GrandTotal)).toFixed(2))}`));

                dispatch(_act.editGRNIdSuccess({ Status: false }))
                dispatch(_act.Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }

    }, [])

    const GSTChangeHandler = (event, row, k) => {

        const calculate = orderCalculateFunc(row, { GSTIn_1: grnDetail?.SupplierGSTIN, GSTIn_2: grnDetail?.CustomerGSTIN })// change
        row["Amount"] = calculate.roundedTotalAmount
        try {

            const CGST_elment = document.getElementById(`CGST${row.id}`)
            if (CGST_elment) {
                CGST_elment.innerText = calculate.CGST_Amount
            }
            const SGST_elment = document.getElementById(`SGST${row.id}`)
            if (SGST_elment) {
                SGST_elment.innerText = calculate.SGST_Amount
            }
            const IGST_elment = document.getElementById(`IGST${row.id}`)
            if (IGST_elment) {
                IGST_elment.innerText = calculate.IGST_Amount
            }

            document.getElementById(`abc${row.id}`).innerText = calculate.roundedTotalAmount
            document.getElementById(`BasicAmount${row.id}`).innerText = calculate.basicAmount

            const ledgerAmount = ledgerDetailList.reduce((acc, ele) => acc + Number(ele.Taxable_Amount), 0)

            const GRNAmount = grnItemList.reduce((total, ind) => {
                return total + (parseFloat(ind.Amount) || 0);
            }, 0);
            const AmountWithExpence = Number((Number(GRNAmount) + Number(ledgerAmount)).toFixed(2))
            const RoundAmount = Number(AmountWithExpence) + Number(roundoffAmount)
            const elements = document.querySelectorAll('.amount-countable-Calulation');
            elements.forEach(element => { element.innerText = _cfunc.amountCommaSeparateFunc((RoundAmount).toFixed(2)); });
        }
        catch { alert("`abc${row.id}`") }
    }

    function val_onChange(val, row, type,) {

        if (type === "qty") {
            row["Quantity"] = val;
        }
        else {
            row["Rate"] = val
        }
        const calculate = orderCalculateFunc(row, { GSTIn_1: grnDetail?.SupplierGSTIN, GSTIn_2: grnDetail?.CustomerGSTIN })// change
        row["Amount"] = calculate.roundedTotalAmount
        try {
            document.getElementById(`abc${row.id}`).innerText = calculate.roundedTotalAmount

            document.getElementById(`BasicAmount${row.id}`).innerText = calculate.basicAmount


        }
        catch { alert(`abc${row.id}`) }

        let sum = 0
        grnItemList.forEach(ind => {
            sum = sum + parseFloat(ind.Amount)
        });


        const CGST_elment = document.getElementById(`CGST${row.id}`)
        if (CGST_elment) {
            CGST_elment.innerText = calculate.CGST_Amount
        }
        const SGST_elment = document.getElementById(`SGST${row.id}`)
        if (SGST_elment) {
            SGST_elment.innerText = calculate.SGST_Amount
        }
        const IGST_elment = document.getElementById(`IGST${row.id}`)
        if (IGST_elment) {
            IGST_elment.innerText = calculate.IGST_Amount
        }

        // setOrderAmount(sum.toFixed(2))

        const AmountWithExpence = Number((Number(sum) + Number(ledgerDetailList.reduce((acc, ele) => acc + Number(ele.Taxable_Amount), 0))).toFixed(2))
        const Roundoffamount = Number(AmountWithExpence) + Number(roundoffAmount)
        const elements = document.querySelectorAll('.amount-countable-Calulation');
        elements.forEach(element => { element.innerText = _cfunc.amountCommaSeparateFunc((Roundoffamount).toFixed(2)); });


        // dispatch(_act.BreadcrumbShowCountlabel(`Count:${grnItemList.length} currency_symbol ${sum.toFixed(2)}`));

    }
    const IsIGST = useMemo(() => {
        return _cfunc.compareGSTINState(grnDetail.SupplierGSTIN, grnDetail.CustomerGSTIN);
    }, [grnDetail.SupplierGSTIN, grnDetail.CustomerGSTIN]);

    const tableColumnsMode_1 = [
        {//------------- ItemName column ----------------------------------
            text: "Item Name",
            dataField: "ItemName",
            formatter: (value, row) => {
                return (<div className=" mt-2">
                    <span key={row.id}>{value}</span>
                </div>)
            }
        },

        {//------------- Quntity first column ----------------------------------
            text: subPageMode === url.ACCOUNTING_GRN ? "GRN-Qty" : "PO-Qty",
            dataField: "poQuantity",
            hidden: pageMode === mode.view ? true : false,
            formatter: (value, row, k) => {
                return (
                    <div className="text-end" >
                        <samp key={row.id} className="font-asian"> {value}</samp>
                    </div>
                )
            },
            headerStyle: () => {
                return { width: '100px', textAlign: 'center', text: "end" };
            }
        },

        {//  ------------Quntity column -----------------------------------  
            text: subPageMode === url.ACCOUNTING_GRN ? "Accounting GRN-Qty" : "GRN-Qty",
            dataField: "",
            formatExtraData: { ledgerDetailList, roundoffAmount },
            formatter: (value, row, k,) => {
                return (
                    <span >
                        <Input type="text"
                            id={`Quantity${row.id}`}
                            defaultValue={row.Quantity}
                            className="text-end"
                            placeholder="Enter GRN-Qty"
                            autoComplete="off"
                            key={row.id}
                            disabled={((pageMode === mode.view) || openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN) ? true : false}
                            onChange={(e) => {
                                let val = e.target.value
                                if (subPageMode === url.ACCOUNTING_GRN) {
                                    if (Number(val) > Number(row.poQuantity)) {
                                        val = row.poQuantity
                                        e.target.value = row.poQuantity
                                        row["Quantity"] = row.poQuantity;
                                    } else {
                                        row["Quantity"] = Number(val) || 0;
                                    }
                                }
                                let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                                if ((isnum) || (val === '')) {
                                    val_onChange(val, row, "qty")
                                } else {
                                    document.getElementById(`Quantity${row.id}`).value = row.Quantity
                                }
                            }}
                        />
                    </span>
                )
            },
            headerStyle: () => {
                return { width: '150px', textAlign: 'center' };
            }
        },
        {  //-------------GST column ----------------------------------
            text: "GST",
            dataField: "GSTDropdown",
            align: () => ('right'),
            style: () => ({ minWidth: "100px" }),
            formatExtraData: { ledgerDetailList, roundoffAmount },
            formatter: (cellContent, row, key) => (
                <Select
                    id={`GST${key}`}
                    name="GST"
                    defaultValue={{ value: row.GST, label: row.GSTPercentage, }}
                    isSearchable={true}
                    className="react-dropdown"
                    classNamePrefix="dropdown"
                    styles={{
                        menu: provided => ({ ...provided, zIndex: 2 })
                    }}
                    options={row.GSToption}
                    onChange={(event) => {
                        row.GSTPercentage = event.label;
                        row.GST = event.value;
                        GSTChangeHandler(event, row, key)

                    }}
                />
            ),

            headerStyle: (colum, colIndex) => {
                return { width: '140px', textAlign: 'center' };
            }
        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            dataField: "",
            formatter: (value, row) => {

                if (row.UnitDetails === undefined) {
                    row["UnitDetails"] = []
                }
                if (row.UnitName === undefined) {
                    row["Unit"] = row.UnitDetails[0].Unit
                    row["UnitName"] = row.UnitDetails[0].UnitName
                    row["BaseUnitQuantity"] = row.UnitDetails[0].BaseUnitQuantity
                }
                return (
                    <Select
                        classNamePrefix="select2-selection"
                        id={"ddlUnit"}
                        key={row.id}
                        isDisabled={true}
                        // isDisabled={pageMode === mode.view ? true : false}
                        defaultValue={{ value: row.Unit, label: row.UnitName }}
                        options={
                            row.UnitDetails.map(i => ({
                                label: i.UnitName,
                                value: i.Unit,
                                baseUnitQty: i.BaseUnitQuantity
                            }))
                        }
                        onChange={e => {
                            row["Unit"] = e.value;
                            row["UnitName"] = e.label
                            row["BaseUnitQuantity"] = e.baseUnitQty
                        }}
                    >
                    </Select >
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '160px', textAlign: 'center' };
            }
        },

        {  //-------------MRP column ----------------------------------
            text: "MRP",
            dataField: "",
            hidden: true,
            formatter: (value, row, k) => {
                return (
                    <span className="text-right" >
                        <CInput

                            type="text"
                            className=" text-end"
                            defaultValue={row.MRPValue}
                            cpattern={decimalRegx}
                            id={`MRP${row.id}`}
                            autoComplete="off"
                            key={row.id}
                            disabled={true}
                        // disabled={pageMode === mode.view ? true : false}
                        // onChange={(e) => {
                        //     const val = e.target.value
                        //     let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                        //     if ((isnum) || (val === '')) {
                        //         row.MRPValue = val;
                        //     } else {
                        //         document.getElementById(`MRP${row.id}`).value = row.Quantity
                        //     }
                        // }}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center' };
            }
        },

        {  //-------------Rate column ----------------------------------
            text: "Basic Rate",
            dataField: "",
            formatExtraData: { ledgerDetailList, roundoffAmount },
            formatter: (value, row, k) => {
                if (row.Rate === undefined) { row["Rate"] = 0 }
                if (row.Amount === undefined) { row["Amount"] = 0 }

                return (
                    <span className="text-right" >
                        <CInput
                            key={row.id}
                            type="text"
                            id={`Ratey${k}`}
                            className=" text-end"
                            disabled={openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN}
                            defaultValue={row.Rate}
                            cpattern={decimalRegx_3dit}
                            autoComplete="off"
                            // disabled={((row.GST === '') || (pageMode === mode.view)) ? true : false}
                            onChange={e => {
                                row["Rate"] = e.target.value;
                                const qty = document.getElementById(`Quantity${row.id}`)
                                const val = e.target.value
                                if (val > 0) {
                                    val_onChange(val, row, "rate")
                                    qty.disabled = false
                                } else {
                                    val_onChange(0, row, "rate")
                                    qty.disabled = true
                                }
                            }}
                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '170px', textAlign: 'center' };
            }
        },
        {//------------- ItemName column ----------------------------------
            text: "Basic Amount",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`BasicAmount${row.id}`}>{row.BasicAmount}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },

        {
            text: "CGST",
            dataField: "CGST",
            formatExtraData: { ledgerDetailList, roundoffAmount },
            hidden: IsIGST || !(subPageMode === url.ACCOUNTING_GRN),
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`CGST${row.id}`}>{row.CGST}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return {
                    width: IsIGST ? '100px' : '136px', textAlign: 'center', text: "center"
                };
            }
        },

        {
            text: "SGST",
            dataField: "SGST",
            formatExtraData: { ledgerDetailList, roundoffAmount },
            hidden: IsIGST || !(subPageMode === url.ACCOUNTING_GRN),
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`SGST${row.id}`}>{row.SGST}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },

        {
            text: "IGST",
            dataField: "IGST",
            formatExtraData: { ledgerDetailList, roundoffAmount },
            hidden: !IsIGST || !(subPageMode === url.ACCOUNTING_GRN),
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`IGST${row.id}`}>{row.IGST}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },

        {//------------- ItemName column ----------------------------------
            text: "Amount",
            dataField: "",
            // sort: true,
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`abc${row.id}`}>{row.Amount}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },

        {//------------- Batch Code column ----------------------------------
            text: "BatchCode",
            dataField: "",
            hidden: (subPageMode === url.ACCOUNTING_GRN),
            style: {
                width: "250px"
            },
            formatter: (value, row, k) => {

                try {
                    document.getElementById(`Batch${row.id}`).value = row.BatchCode
                } catch (e) { }
                return (
                    <Input type="text"
                        key={row.id}
                        id={`Batch${row.id}`}
                        placeholder="Batch Code..."
                        className="text-end "
                        disabled={((pageMode === mode.view) || openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN || subPageMode === url.ACCOUNTING_GRN) ? true : false}
                        defaultValue={row.BatchCode}
                        onChange={e => { row["BatchCode"] = e.target.value }}
                        autoComplete="off"
                    />
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },


        {//------------- Batch Date column ----------------------------------
            text: "Item Expiry Date",
            dataField: "",
            hidden: openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN || (subPageMode === url.ACCOUNTING_GRN),
            formatter: (value, row, k) => {

                return (
                    <C_DatePicker
                        id={`ItemExpiryDate${k}`}
                        key={row.id}
                        value={row.ItemExpiryDate}
                        disabled={((pageMode === mode.view) || openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN || subPageMode === url.ACCOUNTING_GRN) ? true : false}
                        placeholder="Enter Item Expiry Date"
                        options={{

                            altInput: true,
                            altFormat: "d-m-Y",
                            dateFormat: "Y-m-d",
                        }}
                        onChange={(e, date) => { row.ItemExpiryDate = date }}
                    />
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },



        {//------------- Batch Date column ----------------------------------
            text: "Batch Date",
            dataField: "",
            hidden: (subPageMode === url.ACCOUNTING_GRN),
            formatter: (value, row, k) => {
                try {
                    document.getElementById(`BatchDate${k}`).value = row.BatchDate
                } catch (e) { }
                return (
                    <C_DatePicker
                        id={`BatchDate${k}`}
                        key={row.id}
                        value={row.BatchDate}

                        data-enable-time
                        disabled={((pageMode === mode.view) || (openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN) || subPageMode === url.ACCOUNTING_GRN) ? true : false}
                        onChange={(e, date) => { row.BatchDate = date }}
                    />
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },

        {//------------- Batch Date column ----------------------------------
            text: "Discrepancy",
            dataField: "",
            formatExtraData: { discrepancyOptions },
            hidden: (subPageMode === url.ACCOUNTING_GRN),
            formatter: (cellContent, index1) => {

                return (
                    <>
                        <div className="div-1 mb-1" style={{ minWidth: "70px" }}>
                            <div>
                                <Select
                                    classNamePrefix="select2-selection"
                                    placeholder="Select..."
                                    defaultValue={index1.defaultDiscrepancy}
                                    options={discrepancyOptions}
                                    onChange={event => index1.defaultDiscrepancy = event}

                                ></Select>
                            </div>
                        </div>
                        <div className="div-1" style={{ minWidth: "70px" }}>
                            <Input
                                type="text"
                                className="input"
                                autoComplete="off"
                                placeholder="Enter Item Related Quary"
                                defaultValue={index1.DiscrepancyComment}
                                onChange={event => index1.DiscrepancyComment = event.target.value}
                            />
                        </div>
                    </>
                )
            }
        },

        {//------------- Action column ----------------------------------
            text: "Action",
            dataField: "",
            hidden: (pageMode === mode.view || openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN || subPageMode === url.ACCOUNTING_GRN) ? true : false,
            formatter: (value, row, k, a, v) => (
                <div className="d-flex justify-Content-center mt-2" >
                    <div> <Button
                        type="button"
                        data-mdb-toggle="tooltip" data-mdb-placement="top"
                        onClick={(e) => copybtnOnclick(row)}
                        className="badge badge-soft-primary font-size-12 btn btn-primary
                     waves-effect waves-light w-xxs border border-light"
                    >
                        <i className="bx bxs-copy font-size-8 "></i>
                    </Button ></div>

                    <div >
                        {row.delbtn ? <div >
                            <Button
                                // style={pageMode==='edit'? 'Block' :"None"}

                                type="button"
                                data-mdb-toggle="tooltip" data-mdb-placement="top"
                                onClick={(e) => deletebtnOnclick(row)}
                                className="badge badge-soft-danger font-size-12 btn btn-danger
                                      waves-effect waves-light w-xxs border border-light"
                            >
                                <i class="mdi mdi-delete font-size-8 "></i>
                            </Button >
                        </div>
                            : null}

                    </div>
                </div>

            ),
            headerStyle: (colum, colIndex) => {
                return { width: '30px', textAlign: 'center', text: "center" };
            }
        },
    ];

    const DeleteHandler = (row, ledgerDetailList) => {
        debugger
        const Data = ledgerDetailList.filter((item) => item.id !== row.id);

        const ledgerAmount = Data.reduce((acc, ele) => acc + Number(ele.Taxable_Amount), 0)

        const GRNAmount = grnItemList.reduce((total, ind) => {
            return total + (parseFloat(ind.Amount) || 0);
        }, 0);
        const AmountWithExpence = Number((Number(GRNAmount) + Number(ledgerAmount)).toFixed(2))

        const elements = document.querySelectorAll('.amount-countable-Calulation');
        elements.forEach(element => { element.innerText = _cfunc.amountCommaSeparateFunc(AmountWithExpence); });


        setledgerDetailList(Data);
    }



    const ledgerColumn = [
        {//------------- ItemName column ----------------------------------
            text: "Ledger Name",
            dataField: "Name",
            formatter: (cellContent, row) => {

                return (<div className=" mt-2">
                    <span key={row.id}>{cellContent}</span>
                </div>)
            }
        },

        {
            text: "Basic Amount",
            dataField: "BasicAmount",
            formatExtraData: { grnItemList, roundoffAmount },
            formatter: (value, row, k) => {
                return (
                    <span className="text-right" >
                        <Input
                            type="text"
                            className=" text-end"
                            style={{ backgroundColor: "white" }}
                            id={`BasicAmount${row.id}`}
                            autoComplete="off"
                            key={row.id}
                            defaultValue={row.BasicAmount}
                            placeholder="Enter BasicAmount"
                            onChange={(e) => {
                                const value = e.target.value;
                                let input = ""
                                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                                    input = e.target.value
                                    onchangeHandler(e, row, k, "Amount")
                                } else {
                                    e.target.value = input
                                }
                            }}

                        />
                    </span>
                )
            },

            headerStyle: (colum, colIndex) => {
                return { width: '433px', textAlign: 'center' };
            }
        },

        {
            text: "GST Type",
            dataField: "GST_Type",

            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`GST_Type${row.id}`}>{value}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },


        {
            text: "GST %",
            dataField: "GST_Percent",
            formatExtraData: { grnItemList, roundoffAmount },
            formatter: (value, row, k) => (
                <div className="row mt-1" >


                    <Input type="text"
                        id={`GST_Percent${row.id}`}
                        defaultValue={row.GST_Percent}
                        className="text-end"
                        placeholder="Enter GST %"
                        autoComplete="off"
                        key={row.id}
                        disabled={((pageMode === mode.view) || openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN) ? true : false}
                        onChange={(e) => {

                            let val = e.target.value
                            let isnum = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)?([eE][+-]?[0-9]+)?$/.test(val);
                            if ((isnum) || (val === '')) {
                                row["GST_Percent"] = val;
                                onchangeHandler(e, row, k, "GST")
                            } else {
                                document.getElementById(`GST_Percent${row.id}`).value = row.GST_Percent
                            }
                        }}
                    />


                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: IsIGST ? "140px" : '100px', textAlign: 'center', text: "center" };
            }
        },

        {
            text: "CGST",
            dataField: "CGST",
            hidden: IsIGST,
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`CGST-Ledger-${row.id}`}>{row.CGST}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return {
                    width: IsIGST ? '100px' : '136px', textAlign: 'center', text: "center"
                };
            }
        },

        {
            text: "SGST",
            dataField: "SGST",
            hidden: IsIGST,
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`SGST-Ledger-${row.id}`}>{row.SGST}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },

        {
            text: "IGST",
            dataField: "IGST",
            hidden: !IsIGST,
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`IGST-Ledger-${row.id}`}>{row.IGST}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '100px', textAlign: 'center', text: "center" };
            }
        },
        {//------------- ItemName column ----------------------------------
            text: "Taxable Amount",
            dataField: "Taxable_Amount",
            // sort: true,
            formatter: (value, row, k) => (
                <div className="row mt-1" >
                    <div className="text-end ">
                        <samp key={row.id} id={`Taxable_Amount${row.id}`}>{row.Taxable_Amount}</samp>
                    </div>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },



        {//------------- ItemName column ----------------------------------
            text: "Action",
            dataField: "",
            formatExtraData: { grnItemList, ledgerDetailList },
            // sort: true,
            formatter: (value, row, k, { ledgerDetailList }) => (
                <div className="row mt-1" >
                    <span className="d-flex justify-content-center align-items-center">
                        <Button
                            id={"deleteid"}
                            type="button"

                            className="badge badge-soft-danger font-size-12 btn btn-danger waves-effect waves-light w-xxs border border-light btn btn-secondary"
                            data-mdb-toggle="tooltip" data-mdb-placement="top" title='Delete Item'
                            onClick={() => { DeleteHandler(row, ledgerDetailList); }}
                        >
                            <i className="mdi mdi-delete font-size-16"></i>
                        </Button>
                    </span>
                </div>
            ),
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }

        },



    ];

    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const copybtnOnclick = (r) => {
        const id = r.id

        const newArr = []
        let list = [...initialTableData];

        list.forEach(element => {

            if (element.id < id) {
                newArr.push(element)
            }
            else if (element.id === id) {
                newArr.push(element);
                const ele = { ...element }
                ele.id = element.id + 1
                ele.delbtn = true
                ele.Quantity = 0
                newArr.push(ele)
            }
            else {
                const ele1 = { ...element }
                ele1.id = element.id + 1
                newArr.push(ele1)
            }
        });

        initialTableData = newArr
        setgrnItemList(newArr)
        let sum = 0
        newArr.forEach(ind => {
            sum = sum + parseFloat(ind.Amount)
        });
        dispatch(_act.BreadcrumbShowCountlabel(`Count:${newArr.length} currency_symbol ${sum.toFixed(2)}`));
    }

    const deletebtnOnclick = (r) => {
        const list = [...initialTableData];
        const newArr = list.filter(i => { return (!(i.id === r.id)) })
        initialTableData = newArr
        setgrnItemList(newArr)
        let sum = 0
        newArr.forEach(ind => {
            sum = sum + parseFloat(ind.Amount)
        });
        dispatch(_act.BreadcrumbShowCountlabel(`Count:${newArr.length} currency_symbol ${sum.toFixed(2)}`));
    }

    const handleCheckboxChange = (e) => {
        if (openPOdata[0]?.POType === "Open PO" && e.target.checked) {
            const isfuturedate = _cfunc.isFutureDate(_cfunc.date_dmy_func(openPOdata[0]?.OrderDate))
            if (isfuturedate) {
                customAlert({
                    Type: 3,
                    Message: `PO Date ${_cfunc.date_dmy_func(openPOdata[0]?.OrderDate)}`,
                })
                e.target.checked = false
                return
            }

        }

        // Ensure openPOdata is not undefined and has at least one element
        if (openPOdata && openPOdata.length > 0) {
            openPOdata[0].Inward = e.target.checked;
            setOpenPOdata([...openPOdata]); // Update the state with the new value
            setOpenPOdrp(true);
        } else {
            console.error('openPOdata is undefined or empty');
        }
    };


    const ledgerAddHandler = () => {
        debugger
        if (!ledgerSelect) {
            customAlert({
                Type: 3,
                Message: `Please Select Ledger`,
            })
            return
        }
        if (ledgerDetailList.length > 0) {
            const isfound = ledgerDetailList.filter(ind => {

                return ind.id === ledgerSelect.id
            })
            if (isfound.length > 0) {
                customAlert({
                    Type: 3,
                    Message: `${isfound[0].label} Ledger Already Added...`,
                })
                return
            }

        }

        grnItemList.sort((a, b) => a.GSTPercentage - b.GSTPercentage);

        let GST_Details = [];
        let currentGST = null;
        let SGST = 0;
        let CGST = 0;

        grnItemList.forEach((item, index) => {
            const gst = Number(item.GSTPercentage);

            if (currentGST === null) {
                currentGST = gst;
            }

            if (gst === currentGST) {
                SGST += Number(item.SGST);
                CGST += Number(item.CGST);
            }

            const isLastItem = index === grnItemList.length - 1;
            const nextGST = !isLastItem ? Number(grnItemList[index + 1].GSTPercentage) : null;

            if (gst !== nextGST || isLastItem) {
                GST_Details.push({
                    GSTPercentage: currentGST,
                    SGST: Number(SGST.toFixed(2)),
                    CGST: Number(CGST.toFixed(2))
                });

                currentGST = nextGST;
                SGST = 0;
                CGST = 0;
            }
        });

        const GST_Type = _cfunc.compareGSTINState(grnDetail.SupplierGSTIN, grnDetail.CustomerGSTIN)
        const updatedLedgerSelect = {
            ...ledgerSelect,
            GST_Type: GST_Type ? "IGST" : "CGST/SGST",
        };

        setledgerDetailList(item => [...item, updatedLedgerSelect])
    }

    const saveHandeller = async (event) => {

        event.preventDefault();

        const btnId = event.target.id
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        function returnFunc() {
            _cfunc.btnIsDissablefunc({ btnId, state: false })
        }
        try {
            const GRNItemArray = []
            const isvalidMsg = [];
            let sum_roundedTotalAmount = 0
            grnItemList.forEach(i => {

                const calculated = orderCalculateFunc(i, { GSTIn_1: grnDetail?.SupplierGSTIN, GSTIn_2: grnDetail?.CustomerGSTIN })// amount calculation function 
                sum_roundedTotalAmount = sum_roundedTotalAmount + parseFloat(calculated.roundedTotalAmount)
                const arr = {
                    Item: i.Item,
                    Quantity: subPageMode === url.ACCOUNTING_GRN ? i.poQuantity : i.Quantity,
                    AccountingQuantity: subPageMode === url.ACCOUNTING_GRN ? i.Quantity : 0,
                    SystemBatchCode: i.SystemBatchCode,  // only for Accounting GRN else undefined
                    SystemBatchDate: i.SystemBatchDate,  // only for Accounting GRN else undefined
                    MRP: i.MRP,
                    MRPValue: _cfunc.IsSweetAndSnacksCompany() ? "1" : i.MRPValue,
                    ReferenceRate: i.Rate,
                    Rate: i.Rate,
                    vendorOrderRate: i.vendorOrderRate,
                    Unit: i.Unit,
                    BaseUnitQuantity: i.BaseUnitQuantity,
                    BatchDate: i.BatchDate,
                    BatchCode: i.BatchCode,
                    ItemExpiryDate: i.ItemExpiryDate,
                    GST: i.GST,
                    CGST: calculated.CGST_Amount,
                    SGST: calculated.SGST_Amount,
                    IGST: calculated.IGST_Amount,
                    GSTPercentage: calculated.GST_Percentage,
                    CGSTPercentage: calculated.CGST_Percentage,
                    SGSTPercentage: calculated.SGST_Percentage,
                    IGSTPercentage: calculated.IGST_Percentage,
                    BasicAmount: calculated.basicAmount,
                    GSTAmount: calculated.roundedGstAmount,
                    Amount: calculated.roundedTotalAmount,
                    TaxType: 'GST',
                    DiscountType: 1,
                    Discount: Number(i.Discount) || 0,
                    DiscountAmount: Number(calculated.disCountAmt).toFixed(2),
                    DiscrepancyReason: i?.defaultDiscrepancy?.value,
                    DiscrepancyComment: i.DiscrepancyComment || ""


                }

                let isfound = GRNItemArray.filter(ind => {
                    return ind.Item === i.Item
                })

                if (isfound.length > 0) {
                    if ((Number(i.Quantity) > 0)) {
                        // if (dubli.length === 0) {
                        GRNItemArray.push(arr)
                        // } else {
                        //     isvalidMsg.push(`${i.ItemName}:  This Item Is Dublicate...`)
                        // }

                    }
                } else if ((Number(i.Quantity) > 0)) {
                    GRNItemArray.push(arr)
                    if (!(openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN)) {
                        if (i.ItemExpiryDate === undefined && subPageMode === url.GRN_ADD_1) {
                            isvalidMsg.push(`${i.ItemName}:  This Item ExpiryDate Required . `)
                        }
                    }
                }

            })

            if (invoiceNo === '') {

                customAlert({
                    Type: 3,
                    Message: alertMessages.invoiceNoIsRequired,
                })
                return returnFunc()
            }
            if (GRNItemArray.length === 0) {

                customAlert({
                    Type: 3,
                    Message: alertMessages.itemQtyIsRequired
                })
                return returnFunc()
            }

            if (isvalidMsg.length > 0) {

                customAlert({
                    Type: 10,
                    Message: JSON.stringify(isvalidMsg),
                })
                return returnFunc()
            }

            const differentRates = [];

            if (subPageMode === url.ACCOUNTING_GRN) {
                GRNItemArray.forEach(grnItem => {
                    const matchItemIdReturn = RateMasterGoButton.find(buttonItem => buttonItem.ItemID === grnItem.Item);
                    if (matchItemIdReturn) {
                        const rateToCompare = parseFloat(matchItemIdReturn.CurrentRate);
                        const grnRate = parseFloat(grnItem.Rate);
                        const vendorRate = parseFloat(grnItem.vendorOrderRate);
                        if (grnRate !== vendorRate || grnRate !== rateToCompare) {
                            differentRates.push({ Item: grnItem.Item, Rate: grnItem.Rate, UnitID: grnItem.Unit });
                        }
                    }
                });
            } else {
                GRNItemArray.forEach(grnItem => {
                    differentRates.push({ Item: grnItem.Item, Rate: grnItem.Rate, UnitID: grnItem.Unit });
                });
            }
            const RateJsonBody = differentRates.map((index) => ({
                "id": index.Item,
                "Rate": index.Rate,
                "CommonID": 0,
                "EffectiveDate": grnDate,
                "Party": null,
                "Company": _cfunc.loginCompanyID(),
                "CreatedBy": _cfunc.loginUserID(),
                "UpdatedBy": _cfunc.loginUserID(),
                "UnitID": index.UnitID,
                "IsDeleted": 0,
                "Item": index.Item,
                "PriceList": grnDetail?.PriceList_id  // Price list ID 0 Hard code    
            }))


            if (subPageMode === url.ACCOUNTING_GRN) {
                setRatePostJsonBody(RateJsonBody);
            }
            let GRNReferencesUpdate = openPOdata.map(item => ({
                ...item,
                Inward: openPOdata[0]?.Inward,
                Invoice: null

            }));

            const jsonData = JSON.stringify({
                InvoiceDate: openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN ? (grnDetail?.InvoiceDate) : (grnDetail?.DemandDate),
                InvoiceNumber: invoiceNo,
                Customer: grnDetail?.Customer,
            });
            if (subPageMode === url.GRN_ADD_1) {
                const Response = await Invoice_No_Message({ jsonBody: jsonData })
                if (Response.Status === false && Response.StatusCode === 400) {
                    const isConfirmed = await customAlert({
                        Type: 7,
                        Message: Response.Message,
                    });
                    if (!isConfirmed) {
                        return
                    }
                } else if ((Response.Status === false && Response.StatusCode === 406)) {
                    customAlert({
                        Type: 3,
                        Message: Response.Message,
                    })
                    return
                }
            } else if (!invoiceNo) {
                customAlert({
                    Type: 3,
                    Message: "Invoice Number is required.",
                })
                return
            }


            console.log("ledgerDetailList", ledgerDetailList)


            const GRNExpenses = ledgerDetailList.map(item => ({
                GRN: grnDetail.id,
                Ledger: item.id,
                BasicAmount: item.BasicAmount,
                GSTPercentage: item.GST_Percent,
                CGST: item.CGST,
                SGST: item.SGST,
                IGST: item.IGST,
                Amount: item.Taxable_Amount
            }))

            const Manual_sum_roundedTotalAmount = Number(sum_roundedTotalAmount) + Number(roundoffAmount);

            const jsonBody = JSON.stringify({
                RoundOffAmount: roundoffAmount,
                Comment: comment,
                PostingDate: PostingDate,
                GRNDate: grnDate,
                FullGRNNumber: grnDetail?.FullGRNNumber,  //Only for Accounting GRN Mode
                IsSave: (subPageMode === url.ACCOUNTING_GRN) ? 0 : 1,
                InvoiceDate: openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN ? (grnDetail?.InvoiceDate) : (grnDetail?.DemandDate),
                Customer: grnDetail?.Customer,
                GRNNumber: 1,
                GrandTotal: (subPageMode === url.ACCOUNTING_GRN) ? (Manual_sum_roundedTotalAmount).toFixed(2) : Number(sum_roundedTotalAmount).toFixed(2),
                Party: grnDetail?.Supplier,
                InvoiceNumber: invoiceNo,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: 1,
                GRNItems: GRNItemArray,
                GRNReferences: GRNReferencesUpdate,
                IsGRNType: (openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN) ? 0 : 1,
                GRNExpenses: (subPageMode === url.ACCOUNTING_GRN) ? GRNExpenses : undefined,
                TotalExpense: (subPageMode === url.ACCOUNTING_GRN) ? ledgerDetailList.reduce((acc, ele) => acc + Number(ele.Taxable_Amount), 0) : undefined,
                AccountingGRNStatus: 0,
            });

            if (pageMode === mode.edit) {
                returnFunc()
            } else if (subPageMode === url.ACCOUNTING_GRN) {
                dispatch(_act.Update_accounting_GRN({ jsonBody, updateId: grnDetail?.id, btnId, GRNReferencesUpdate }))
            } else {
                dispatch(_act.saveGRNAction({ jsonBody, btnId, GRNReferencesUpdate }))
            }




        } catch (error) { returnFunc() }
    }


    function calculateAmountWithExpense(ledgerDetailList = [], grnItemList = []) {
        const ledgerAmount = ledgerDetailList.reduce((acc, ele) => acc + Number(ele.Taxable_Amount), 0);

        const GRNAmount = grnItemList.reduce((total, ind) => {
            ; // Keep this if you want to debug
            return total + (parseFloat(ind.Amount) || 0);
        }, 0);

        return Number((GRNAmount + ledgerAmount).toFixed(2));
    }




    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" >

                    <div className="px-2 c_card_filter text-black mb-1" >
                        <Row>
                            <Col sm={4}>
                                <FormGroup className=" row mt-2 " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "130px" }}>GRN Date</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            name="GRNDate"
                                            value={grnDate}
                                            disabled={((pageMode === mode.view) || subPageMode === url.ACCOUNTING_GRN) ? true : false}
                                            onChange={(e, date) => { setgrnDate(date) }}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Supplier Name</Label>
                                    <Col md="7">
                                        < Input
                                            style={{ backgroundColor: "white" }}
                                            type="text"
                                            value={pageMode === mode.view ? EditData.CustomerName : grnDetail.SupplierName}
                                            disabled={((pageMode === mode.view) || (openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN) || subPageMode === url.ACCOUNTING_GRN) ? true : false}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>PO Number</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}
                                            disabled={((pageMode === mode.view) || (openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN) || subPageMode === url.ACCOUNTING_GRN) ? true : false}

                                            value={openPOdata[0]?.Full_OrderNumber === undefined ? grnDetail.FullDemandNumber : openPOdata[0]?.Full_OrderNumber}
                                            placeholder="Enter PO Number" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={4}>
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>{"Invoice Date"}</Label>
                                    <Col md="7">
                                        <C_DatePicker
                                            value={openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN ? (grnDetail.InvoiceDate) : (grnDetail.DemandDate)}
                                            disabled={(openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN || openPOdata[0]?.GRN_From === url.ORDER_LIST_1 || grnDetail.isAccountingGRN) ? false : true}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="row" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>{"Invoice No"}</Label>
                                    <Col md="7">
                                        <Input
                                            type="text"
                                            style={{ backgroundColor: "white" }}
                                            value={invoiceNo}
                                            placeholder={`Enter Invoice No `}
                                            disabled={(pageMode === mode.view || openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN)}
                                            onChange={(e) => setInvoiceNo(e.target.value)}
                                        />
                                    </Col>
                                </FormGroup>

                                {(subPageMode === url.ACCOUNTING_GRN) && <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>{"GRN NO"}</Label>
                                    <Col md="7">
                                        <Input
                                            value={grnDetail.FullGRNNumber}
                                            disabled={true}
                                        />
                                    </Col>
                                </FormGroup>
                                }

                                {(subPageMode === url.ACCOUNTING_GRN) ? null : <FormGroup className="mb-2 row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>Close PO</Label>
                                    <Col md="7" style={{ marginLeft: "-14px" }}>
                                        {
                                            openPOdata.length > 1 ?
                                                <Dropdown
                                                    className="d-none d-lg-inline-block ms-1"

                                                    isOpen={openPOdrp}
                                                    toggle={() => {
                                                        setOpenPOdrp(!openPOdrp)
                                                    }}
                                                >
                                                    <DropdownToggle
                                                        className="btn header-item noti-icon mt-n2 mb-n3 "
                                                        tag="button"
                                                    >
                                                        <FeatherIcon
                                                            icon="square"
                                                            className="icon-sm text-primary"
                                                        />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-lg dropdown-menu-custom"  >
                                                        <Row className="row  g-0 " >
                                                            {openPOdata.map((index, key) => {
                                                                return (
                                                                    <Col className="col col-6 dropdown-icon-item-custom  text-black "
                                                                    >
                                                                        <li onClick={e => {
                                                                            openPOdata[key].Inward = !openPOdata[key].Inward
                                                                            document.getElementById(`hasInwardCheck${key}`).checked = openPOdata[key].Inward;
                                                                        }} >
                                                                            <Row className="row ">
                                                                                <Col className=" col user-select ">
                                                                                    <li>
                                                                                        <Label className="" >{index.ChallanNo}</Label>
                                                                                    </li>
                                                                                </Col>

                                                                                <Col className=" col  mt-2" style={{ paddingLeft: "inherit" }}>
                                                                                    <Input
                                                                                        id={`hasInwardCheck${key}`}
                                                                                        className="col col-2 text-black "
                                                                                        type="checkbox"
                                                                                        defaultChecked={openPOdata[key].Inward}
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        </li>
                                                                    </Col>
                                                                )
                                                            })}
                                                        </Row>

                                                    </DropdownMenu>
                                                </Dropdown>

                                                :
                                                <Input
                                                    type="checkbox"
                                                    style={{ paddingTop: "7px", marginLeft: "20px", marginTop: "10px" }}
                                                    placeholder="Enter Invoice No"
                                                    disabled={openPOdata[0]?.GRN_From === url.IB_INVOICE_FOR_GRN || subPageMode === url.ACCOUNTING_GRN}   // Make Default Disabled true from IB GRN list TO GRN
                                                    defaultChecked={(subPageMode === url.ACCOUNTING_GRN) ? openPOdata[0]?.Inward : openPOdata[0]?.POType === "Open PO" ? false : true}
                                                    onChange={handleCheckboxChange}
                                                />
                                        }
                                    </Col>
                                </FormGroup>}
                            </Col>


                            {subPageMode === url.ACCOUNTING_GRN ? <Col sm={4}>

                                {subPageMode === url.ACCOUNTING_GRN && <FormGroup className="row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>{"Posting Date"}</Label>
                                    <Col md="7">
                                        <C_DatePicker
                                            value={(PostingDate)}
                                            options={{
                                                maxDate: "",
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={(e, date) => { setPostingDate(date) }}
                                        />
                                    </Col>
                                </FormGroup>}

                                <FormGroup className="row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>{"Round off Total"}</Label>
                                    <Col md="7">
                                        <Input
                                            type="text"
                                            style={{ backgroundColor: "white" }}
                                            defaultValue={roundoffAmount}
                                            placeholder={`Enter Roundoff Amount`}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                let input = ""
                                                if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                                                    // Convert user input to number, default to 0 if blank
                                                    const inputAdjustment = Number(value) || 0;
                                                    input = e.target.value
                                                    // Add/subtract from amountWithExpence
                                                    const Amount = Number(calculateAmountWithExpense(ledgerDetailList, grnItemList)) + (inputAdjustment);

                                                    // Update DOM elements
                                                    const elements = document.querySelectorAll('.amount-countable-Calulation');
                                                    elements.forEach(element => {
                                                        element.innerText = _cfunc.amountCommaSeparateFunc((Amount).toFixed(2));
                                                    });

                                                    setRoundoffAmount(inputAdjustment);
                                                } else {
                                                    e.target.value = input
                                                }
                                            }}

                                        />
                                    </Col>
                                </FormGroup>

                                {(subPageMode === url.ACCOUNTING_GRN) && <FormGroup className=" row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>{"Ledger"}</Label>
                                    <Col md="7">
                                        <Select
                                            value={ledgerSelect}
                                            classNamePrefix="select2-Customer"
                                            options={ledgerOptions}
                                            onChange={(e) => {
                                                setLedgerSelect(e)
                                            }}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                    </Col>

                                    <Col className="mt-1">
                                        {pageMode !== mode.view &&
                                            <C_Button
                                                className="btn btn-outline-primary"
                                                onClick={ledgerAddHandler}
                                            >Add
                                            </C_Button>
                                        }
                                    </Col>
                                </FormGroup>
                                }

                            </Col> :
                                <Col sm={4}>
                                    <FormGroup className=" row mt-2" >
                                        <Label className="col-md-4 p-2"
                                            style={{ width: "100px" }}>Comment</Label>
                                        <Col md="7">
                                            <Input
                                                type="text"
                                                value={comment}
                                                placeholder="Enter Comment"
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>


                            }

                        </Row>
                    </div>

                    <ToolkitProvider
                        keyField="id"
                        defaultSorted={defaultSorted}
                        data={grnItemList}
                        columns={tableColumnsMode_1}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table table-Rresponsive">
                                            <BootstrapTable
                                                responsive
                                                id="table_Arrow"
                                                bordered={false}
                                                striped={false}
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Items Not available
                                                    </div>
                                                }
                                                {...toolkitProps.baseProps}
                                            />
                                            {globalTableSearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>

                    {(subPageMode === url.ACCOUNTING_GRN && (ledgerDetailList.length > 0)) && <ToolkitProvider
                        keyField="id"
                        data={ledgerDetailList}
                        columns={ledgerColumn}
                        search
                    >
                        {toolkitProps => (
                            <React.Fragment>
                                <BootstrapTable
                                    keyField={"id"}
                                    bordered={true}
                                    striped={false}
                                    noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                                    classes={"table align-middle table-nowrap table-hover"}
                                    headerWrapperClasses={"thead-light"}
                                    {...toolkitProps.baseProps}
                                />
                                {globalTableSearchProps(toolkitProps.searchProps)}

                            </React.Fragment>
                        )
                        }
                    </ToolkitProvider>}

                    {
                        (grnItemList.length > 0) &&
                        <SaveButtonDraggable>
                            <SaveButton pageMode={pageMode}
                                loading={saveBtnloading}
                                editCreatedBy={editCreatedBy}
                                userAcc={userPageAccessState}
                                module={"GRN"} onClick={saveHandeller}
                            />
                        </SaveButtonDraggable>
                    }
                </div >

            </React.Fragment >
        )
    } else {
        return null
    }

}
export default GRN_ADD_1

