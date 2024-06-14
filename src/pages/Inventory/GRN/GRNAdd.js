
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button, Col, Dropdown, DropdownMenu, DropdownToggle, Input, Label, Row, FormGroup
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { useHistory } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

import { orderCalculateFunc } from "../../Purchase/Order/OrderPageCalulation";
import { SaveButton } from "../../../components/Common/CommonButton";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";

import { mode, url, pageId } from "../../../routes/index";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as _cfunc from "../../../components/Common/CommonFunction";
import * as _act from "../../../store/actions";

import { CInput, C_DatePicker, decimalRegx } from "../../../CustomValidateForm";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { useLayoutEffect } from "react";
import { pageFieldUseEffect, saveMsgUseEffect, table_ArrowUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { goButtonForRate_Master, saveRateMaster } from "../../../store/Administrator/RateMasterRedux/action";

//// This GRN  Add Page is Use For  Sweets and Snacks GRN  Add page Use for 2 MODE From vendor Order to GRN & Inter Branch GRN
let initialTableData = []
const GRNAdd = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode, setPageMode] = useState(mode.defaultsave);
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
    const [invoiceNo, setInvoiceNo] = useState('');
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [EditData, setEditData] = useState({});
    const [ratePostJsonBody, setRatePostJsonBody] = useState([]);

    const {
        items,
        postMsg,
        userAccess,
        pageField,
        saveBtnloading,
        RateMasterGoButton
    } = useSelector((state) => ({
        saveBtnloading: state.GRNReducer.saveBtnloading,
        items: state.GRNReducer.GRNitem,
        postMsg: state.GRNReducer.postMsg,
        updateMsg: state.GRNReducer.updateMsg,

        RateMasterGoButton: state.RateMasterReducer.RateMasterGoButton,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    useLayoutEffect(() => {
        dispatch(_act.commonPageFieldSuccess(null));
        dispatch(_act.commonPageField(pageId.GRN_ADD_1));
        const jsonBody = JSON.stringify({
            "PriceList": 0,
            "Party": _cfunc.loginSelectedPartyID(),
            "EffectiveDate": currentDate_ymd,
            "CompanyID": _cfunc.loginCompanyID()
        });

        dispatch(goButtonForRate_Master({ jsonBody }));
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
    debugger
    useEffect(() => saveMsgUseEffect({// saveMsgUseEffect common useEffect 

        postMsg, pageMode,
        history, dispatch,
        postSuccss: _act.saveGRNSuccess,
        listPath: ((postMsg.GRN_Reference === url.GRN_STP_3) || (postMsg.GRN_Reference === url.ORDER_LIST_1)) ? url.GRN_LIST_3 : url.GRN_LIST_1
    }), [postMsg]);

    useEffect(() => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            setgrnItemList([]);
            setGrnDetail({});
            setInvoiceNo([]);
            setOpenPOdata([]);

            if (ratePostJsonBody.length > 0) {
                dispatch(saveRateMaster(JSON.stringify(ratePostJsonBody)));
            }
        }
    }, [postMsg])

    useEffect(() => pageFieldUseEffect({// useEffect common pagefield for master
        state,
        setState,
        pageField
    }), [pageField]);

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [grnItemList]);

    useEffect(() => {

        if ((items.Status === true) && (items.StatusCode === 200)) {

            const grnItems = items.Data

            if ((grnItems.GRNReferences[0]?.GRN_From === url.IB_GRN_LIST)) { /// If GRN from IB GRN List then this 

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
                dispatch(_act.BreadcrumbShowCountlabel(`Count:${grnItems.OrderItem.length} ₹ ${sum.toFixed(2)}`));
            } else {                                                       // IF GRN From Vendor Order list 
                grnItems.OrderItem.forEach((ele, k) => {
                    ele.id = k + 1;
                    ele["poQuantity"] = ele.Quantity
                    ele["Quantity"] = ""
                    ele["poAmount"] = ele.Amount
                    ele["Amount"] = 0
                    ele["BatchDate"] = currentDate_ymd
                    ele["BatchCode"] = ''
                    ele["delbtn"] = false
                    ele["Invoice"] = null
                });
                dispatch(_act.BreadcrumbShowCountlabel(`Count:${grnItems.OrderItem.length} ₹ ${0}`));
            }


            initialTableData = []
            const grnDetails = { ...grnItems }

            initialTableData = grnDetails.OrderItem;
            setgrnItemList(initialTableData)
            grnDetails.OrderItem = []

            grnDetails["InvoiceDate"] = _cfunc.date_ymd_func(grnDetails.InvoiceDate)
            grnDetails["DemandDate"] = _cfunc.date_ymd_func(grnDetails.DemandDate)

            setGrnDetail(grnDetails)

            const myArr = grnDetails.challanNo.split(",");
            myArr.map(i => ({ Name: i, hascheck: false }))

            setOpenPOdata(grnDetails.GRNReferences)

            items.Status = false
            dispatch(_act.makeGRN_Mode_1ActionSuccess({ Status: false }))


        }

    }, [items])

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
            }

            if (hasEditVal) {
                setEditData(hasEditVal);
                const { GRNItems = [], GRNReferences = [], InvoiceNumber } = hasEditVal;

                let ChallanNo1 = ''

                GRNReferences.forEach(ele => {
                    ChallanNo1 = ChallanNo1.concat(`${ele.ChallanNo},`)
                });
                ChallanNo1 = ChallanNo1.replace(/,*$/, '');

                setInvoiceNo(InvoiceNumber)
                setGrnDetail(ChallanNo1);
                setgrnItemList(GRNItems)
                dispatch(_act.editGRNIdSuccess({ Status: false }))
                dispatch(_act.Breadcrumb_inputName(hasEditVal.ItemName))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
        }
    }, [])

    function val_onChange(val, row, type) {

        if (type === "qty") {
            row["Quantity"] = val;
        }
        else {
            row["Rate"] = val
        }
        const calculate = orderCalculateFunc(row)// change
        row["Amount"] = calculate.roundedTotalAmount
        try {
            document.getElementById(`abc${row.id}`).innerText = calculate.roundedTotalAmount

        }
        catch { alert("`abc${row.id}`") }

        let sum = 0
        grnItemList.forEach(ind => {
            sum = sum + parseFloat(ind.Amount)
        });
        setOrderAmount(sum.toFixed(2))
        dispatch(_act.BreadcrumbShowCountlabel(`Count:${grnItemList.length} ₹ ${sum.toFixed(2)}`));

    }

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
            text: "PO-Qty",
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
            text: "GRN-Qty",
            dataField: "",

            formatter: (value, row, k) => {

                try {
                    document.getElementById(`Quantity${k}`).value = row.Quantity
                } catch (e) { }
                return (
                    <span >
                        <Input type="text"
                            id={`Quantity${row.id}`}
                            defaultValue={row.Quantity}
                            className="text-end"
                            autoComplete="off"
                            key={row.id}
                            disabled={((pageMode === mode.view) || openPOdata[0]?.GRN_From === url.IB_GRN_LIST) ? true : false}
                            onChange={(e) => {
                                const val = e.target.value
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
                return { width: '130px', textAlign: 'center' };
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
                return { width: '150px', textAlign: 'center' };
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
                            disabled={openPOdata[0]?.GRN_From === url.IB_GRN_LIST}
                            defaultValue={row.Rate}
                            cpattern={decimalRegx}
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
                return { width: '100px', textAlign: 'center' };
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
            // sort: true,
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
                        disabled={((pageMode === mode.view) || openPOdata[0]?.GRN_From === url.IB_GRN_LIST) ? true : false}
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
            text: "Batch Date",
            dataField: "",
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
                        disabled={((pageMode === mode.view) || (openPOdata[0]?.GRN_From === url.IB_GRN_LIST)) ? true : false}
                        onChange={(e, date) => { row.BatchDate = date }}
                    />
                )
            },
            headerStyle: (colum, colIndex) => {
                return { width: '130px', textAlign: 'center', text: "center" };
            }
        },

        {//------------- Action column ----------------------------------
            text: "Action",
            dataField: "",
            hidden: (pageMode === mode.view) ? true : false,
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
        dispatch(_act.BreadcrumbShowCountlabel(`Count:${newArr.length} ₹ ${sum.toFixed(2)}`));
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
        dispatch(_act.BreadcrumbShowCountlabel(`Count:${newArr.length} ₹ ${sum.toFixed(2)}`));
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

    const saveHandeller = (event) => {

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

                const calculated = orderCalculateFunc(i)// amount calculation function 
                sum_roundedTotalAmount = sum_roundedTotalAmount + parseFloat(calculated.roundedTotalAmount)
                const arr = {
                    Item: i.Item,
                    Quantity: i.Quantity,
                    MRP: i.MRP,
                    MRPValue: i.MRPValue,
                    ReferenceRate: i.Rate,
                    Rate: i.Rate,
                    vendorOrderRate: i.vendorOrderRate,
                    Unit: i.Unit,
                    BaseUnitQuantity: i.BaseUnitQuantity,
                    BatchDate: i.BatchDate,
                    BatchCode: i.BatchCode,

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

                }

                let isfound = GRNItemArray.filter(ind => {
                    return ind.Item === i.Item
                })

                if (isfound.length > 0) {
                    let dubli = isfound.filter(ele => {
                        let condition = ((i.Rate === ele.Rate) && (i.BatchDate === ele.BatchDate) && (i.BatchCode === ele.BatchCode) && (i.Unit === ele.Unit))
                        return condition
                    })

                    if ((i.Quantity > 0)) {

                        if (dubli.length === 0) {
                            GRNItemArray.push(arr)
                        } else {
                            isvalidMsg.push(`${i.ItemName}:  This Item Is Dublicate...`)
                        }
                    }
                } else if ((i.Quantity > 0)) {
                    GRNItemArray.push(arr)
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
                    Type: 3,
                    Message: isvalidMsg,
                })
                return returnFunc()
            }

            const differentRates = [];

            GRNItemArray.forEach(grnItem => {
                const matchItemIdReturn = RateMasterGoButton.find(buttonItem => buttonItem.ItemID === grnItem.Item);
                if (matchItemIdReturn) {
                    const rateToCompare = parseFloat(matchItemIdReturn.CurrentRate);
                    const grnRate = parseFloat(grnItem.Rate);
                    const vendorRate = parseFloat(grnItem.vendorOrderRate);
                    if (grnRate !== vendorRate || grnRate !== rateToCompare) {
                        differentRates.push({ Item: grnItem.Item, Rate: grnItem.Rate });
                    }
                }
            });

            const RateJsonBody = differentRates.map((index) => ({
                "id": index.Item,
                "Rate": index.Rate,
                "CommonID": 0,
                "EffectiveDate": currentDate_ymd,
                "Party": _cfunc.loginPartyID(),
                "Company": _cfunc.loginCompanyID(),
                "CreatedBy": _cfunc.loginUserID(),
                "UpdatedBy": _cfunc.loginUserID(),
                "IsDeleted": 0,
                "Item": index.Item,
                "PriceList": 39
            }))

            setRatePostJsonBody(RateJsonBody);

            let GRNReferencesUpdate = openPOdata.map(item => ({
                ...item,
                Invoice: null
            }));


            const jsonBody = JSON.stringify({
                GRNDate: grnDate,
                Customer: grnDetail.Customer,
                GRNNumber: 1,
                GrandTotal: Number(sum_roundedTotalAmount).toFixed(2),
                Party: grnDetail.Supplier,
                InvoiceNumber: invoiceNo,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: 1,
                GRNItems: GRNItemArray,
                GRNReferences: GRNReferencesUpdate,
            });

            if (pageMode === mode.edit) {
                returnFunc()
            } else {
                dispatch(_act.saveGRNAction({ jsonBody, btnId, GRNReferencesUpdate }))
            }

        } catch (error) { returnFunc() }
    }

    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <div className="page-content" >

                    <div className="px-2 mb-1  c_card_header " >
                        <Row>
                            <Col sm={5}>

                                <FormGroup className=" row mt-2 " >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "130px" }}>GRN Date</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            name="GRNDate"
                                            value={values.GRNDate}
                                            disabled={(pageMode === mode.view) ? true : false}
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
                                            disabled={((pageMode === mode.view) || (openPOdata[0]?.GRN_From === url.IB_GRN_LIST)) ? true : false}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup className=" row " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>PO Number</Label>
                                    <Col sm="7">
                                        <Input type="text"
                                            style={{ backgroundColor: "white" }}
                                            disabled={((pageMode === mode.view) || (openPOdata[0]?.GRN_From === url.IB_GRN_LIST)) ? true : false}

                                            value={(openPOdata[0]?.GRN_From === url.IB_GRN_LIST) ? grnDetail.FullDemandNumber : grnDetail.challanNo}
                                            placeholder="Enter Challan No" />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm={5}>
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>{(openPOdata[0]?.GRN_From === url.IB_GRN_LIST) ? "Challan Date" : "Invoice Date"}</Label>
                                    <Col md="7">
                                        <C_DatePicker
                                            value={openPOdata[0]?.GRN_From === url.IB_GRN_LIST ? (grnDetail.InvoiceDate) : (grnDetail.DemandDate)}
                                            disabled={true}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup className="mb-2 row  " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "130px" }}>{(openPOdata[0]?.GRN_From === url.IB_GRN_LIST) ? "Challan No" : "Invoice No"}</Label>
                                    <Col md="7">
                                        <Input
                                            type="text"
                                            style={{ backgroundColor: "white" }}
                                            value={invoiceNo}
                                            placeholder={(openPOdata[0]?.GRN_From === url.IB_GRN_LIST) ? ` Enter Challan No` : `Enter Invoice No `}
                                            disabled={pageMode === mode.view ? true : false}
                                            onChange={(e) => setInvoiceNo(e.target.value)}
                                        />
                                    </Col>
                                </FormGroup>


                                <FormGroup className="mb-2 row  " >
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
                                                    disabled={openPOdata[0]?.GRN_From === url.IB_GRN_LIST}   // Make Default Disabled true from IB GRN list TO GRN
                                                    defaultChecked={openPOdata[0]?.POType === "Open PO" ? false : true}
                                                    onChange={handleCheckboxChange}
                                                />
                                        }
                                    </Col>
                                </FormGroup>

                            </Col>
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
export default GRNAdd

