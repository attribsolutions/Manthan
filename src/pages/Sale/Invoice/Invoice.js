import React, { useEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess, getpdfReportdata } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    formValid,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { GotoInvoiceBtn, SaveAndDownloadPDF, SaveButton } from "../../../components/Common/CommonButton";
import {
    updateBOMListSuccess
} from "../../../store/Production/BOMRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Tbody, Thead } from "react-super-responsive-table";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import {
    GoButtonForinvoiceAdd,
    GoButtonForinvoiceAddSuccess,
    Uploaded_EInvoiceAction,
    invoiceSaveAction,
    invoiceSaveActionSuccess,
    makeIB_InvoiceActionSuccess
} from "../../../store/Sales/Invoice/action";
import { GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import {
    invoice_discountCalculate_Func,
    innerStockCaculation,
    orderQtyOnChange,
    orderQtyUnit_SelectOnchange,
    stockQtyOnChange,
    settingBaseRoundOffAmountFunc
} from "./invoiceCaculations";
import "./invoice.scss"
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx } from "../../../CustomValidateForm";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";
import { getVehicleList } from "../../../store/Administrator/VehicleRedux/action";
import { Invoice_1_Edit_API_Singel_Get } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'

const Invoice = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const subPageMode = history.location.pathname
    const systemSetting = _cfunc.loginSystemSetting();

    const goBtnId = `ADDGoBtn${subPageMode}`
    const saveBtnid = `saveBtn${subPageMode}`

    const fileds = {
        InvoiceDate: currentDate_ymd,
        Customer: "",
        VehicleNo: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [orderItemDetails, setOrderItemDetails] = useState([])
    const [orderIDs, setOrderIDs] = useState([])

    // for invoicer page heder dicount functionality useSate ************************************
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)
    const [forceReload, setForceReload] = useState(false)
    // ****************************************************************************

    const [modalCss] = useState(false);
    const [pageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');

    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        gobutton_Add = { Status: false },
        vendorSupplierCustomer,
        makeIBInvoice,
        VehicleNumber,
        goBtnloading,
        saveBtnloading,
        saveAndPdfBtnLoading
    } = useSelector((state) => ({
        postMsg: state.InvoiceReducer.postMsg,
        updateMsg: state.BOMReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.CommonAPI_Reducer.customer,
        gobutton_Add: state.InvoiceReducer.gobutton_Add,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        VehicleNumber: state.VehicleReducer.VehicleList,
        makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
        saveBtnloading: state.InvoiceReducer.saveBtnloading,
        goBtnloading: state.InvoiceReducer.goBtnloading,
        saveAndPdfBtnLoading: state.InvoiceReducer.saveAndPdfBtnLoading,
    }));

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {

        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.INVOICE_1))
        dispatch(GoButtonForinvoiceAddSuccess([]))
        dispatch(getVehicleList())

    }, []);

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

    useEffect(async () => {
        if (postMsg.Status === true && postMsg.StatusCode === 200) {
            dispatch(invoiceSaveActionSuccess({ Status: false })); // Reset the status to false
debugger
            //************************* / Fetch PDF report data if saveAndDownloadPdfMode is true /
            if (postMsg.saveAndDownloadPdfMode) {
                const config = {
                    editId: postMsg.InvoiceID,
                    ReportType: report.invoice,
                };
                dispatch(getpdfReportdata(Invoice_1_Edit_API_Singel_Get, config));
            }

            // ***************** Upload E-Invoice if AutoEInvoice and EInvoiceApplicable are both "1"  *****/
            if (systemSetting.AutoEInvoice === "1" && systemSetting.EInvoiceApplicable === "1") {
                let btnId = `btn-E-Invoice-Upload-${postMsg.InvoiceID}`;
                try {
                    dispatch(Uploaded_EInvoiceAction({ btnId, RowId: postMsg.InvoiceID, UserID: _cfunc.loginUserID() }));
                } catch (error) { }
            }

            customAlert({
                Type: 1,
                Message: postMsg.Message,
            });

            // Redirect to appropriate page based on subPageMode
            if (subPageMode === url.INVOICE_1) {
                history.push({ pathname: url.INVOICE_LIST_1 });
            } else if (subPageMode === url.IB_INVOICE) {
                history.push({ pathname: url.IB_INVOICE_LIST });
            }
        } else if (postMsg.Status === true) {
            // Show error alert message with the JSON stringified postMsg.Message
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        }
    }, [postMsg]);


    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            history.push({
                pathname: url.MATERIAL_ISSUE_LIST,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateBOMListSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Status: true,
                Message: JSON.stringify(updateMsg.Message),
            })
        }
    }, [updateMsg, modalCss]);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {

        if (makeIBInvoice.Status === true && makeIBInvoice.StatusCode === 200) {
            setState((i) => {
                const obj = { ...i }
                obj.values.Customer = makeIBInvoice.customer;
                obj.hasValid.Customer.valid = true;
                return obj
            })

            dispatch(makeIB_InvoiceActionSuccess({ Status: false }))
        }
    }, [makeIBInvoice]);

    useEffect(() => {

        if (gobutton_Add.Status === true && gobutton_Add.StatusCode === 200) {
            setState((i) => {
                const obj = { ...i }
                obj.values.Customer = gobutton_Add.customer;
                obj.hasValid.Customer.valid = true;
                return obj
            })

            setOrderItemDetails(gobutton_Add.Data.OrderItemDetails);

            // **********************************************************
            totalAmountCalcuationFunc(gobutton_Add.Data.OrderItemDetails)// show breadcrump tolat amount function//passs table array 
            //*********************************************************** */

            setOrderIDs(gobutton_Add.Data.OrderIDs)
            dispatch(GoButtonForinvoiceAddSuccess({ Status: false }))
        }
    }, [gobutton_Add]);

    useEffect(() => _cfunc.tableInputArrowUpDounFunc("#table_Arrow"), [orderItemDetails]);

    const CustomerDropdown_Options = vendorSupplierCustomer.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const VehicleNumber_Options = VehicleNumber.map((index) => ({
        value: index.id,
        label: index.VehicleNumber,
    }));

    const pagesListColumns = [
        {//***************ItemName********************************************************************* */
            text: "Item Name",
            dataField: "ItemName",
            classes: () => ('invoice-item-row'),
            formatter: (cellContent, index1) => {
                return (
                    <>
                        <div className="invoice-item-row-div-1">
                            <samp id={`ItemName${index1.id}`}>{index1.ItemName}</samp>
                        </div>
                        {
                            (index1.StockInValid) ? <div><samp id={`StockInvalidMsg-${index1.id}`} style={{ color: "red" }}> {index1.StockInvalidMsg}</samp></div>
                                : <></>
                        }
                    </>
                )
            },
        },
        {//***************Quantity********************************************************************* */
            text: "Quantity/Unit",
            dataField: "",
            formatExtraData: { tableList: orderItemDetails },
            // classes: () => ('invoice-quantity-row1'),
            formatter: (cellContent, index1, keys_, { tableList = [] }) => (
                <>
                    <div className="div-1 mb-2" style={{ minWidth: "200px" }}>
                        <Input
                            type="text"
                            disabled={pageMode === 'edit' ? true : false}
                            id={`OrderQty-${index1.id}`}
                            className="input"
                            style={{ textAlign: "right" }}
                            key={index1.id}
                            autoComplete="off"
                            defaultValue={index1.Quantity}
                            onChange={(event) => {
                                orderQtyOnChange(event, index1);
                                totalAmountCalcuationFunc(tableList);
                            }}
                        />
                    </div>
                    <div className="div-1 ">
                        <div id="select">
                            <Select
                                classNamePrefix="select2-selection"
                                id={"ddlUnit"}
                                isDisabled={pageMode === 'edit' ? true : false}
                                defaultValue={index1.default_UnitDropvalue}
                                options={index1.UnitDetails.map(i => ({
                                    "label": i.UnitName,
                                    "value": i.UnitID,
                                    "ConversionUnit": i.ConversionUnit,
                                    "Unitlabel": i.Unitlabel,
                                    "BaseUnitQuantity": i.BaseUnitQuantity,
                                    "BaseUnitQuantityNoUnit": i.BaseUnitQuantityNoUnit,
                                }))}
                                onChange={(event) => {
                                    orderQtyUnit_SelectOnchange(event, index1);
                                    totalAmountCalcuationFunc(tableList);
                                }}
                            ></Select>
                        </div>
                    </div>
                    <div className="bottom-div">
                        <span>Order-Qty :</span>
                        <samp>{index1.OrderQty}</samp>
                        <samp>{index1.UnitName}</samp>
                    </div>
                </>
            ),
        },
        {//***************StockDetails********************************************************************* */
            text: "Stock Details",
            dataField: "StockDetails",
            formatExtraData: { tableList: orderItemDetails },
            formatter: (cellContent, index1, keys_, { tableList = [] }) => (
                <div>
                    <Table className="table table-responsive mb-1">
                        <Thead >
                            <tr >
                                <th style={{ zIndex: -1 }}>BatchCode</th>
                                <th style={{ zIndex: -1 }}>
                                    <div>
                                        <samp>Stock Quantity</samp>
                                    </div>
                                </th >
                                <th style={{ zIndex: -1 }}>
                                    <div>
                                        <samp>Quantity</samp>
                                    </div>
                                </th>
                                <th style={{ zIndex: -1 }}>Basic Rate</th>
                                <th style={{ zIndex: -1 }}>MRP</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {cellContent.map((index2) => (
                                <tr key={index1.id}>
                                    <td>
                                        <div style={{ width: "120px" }}>{index2.BatchCode}</div>
                                    </td>
                                    <td>
                                        <div style={{ width: "120px", textAlign: "right" }}>
                                            <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>{index2.ActualQuantity}</samp>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "150px" }}>
                                            <Input
                                                type="text"
                                                disabled={pageMode === 'edit' ? true : false}
                                                style={{ textAlign: "right" }}
                                                key={`batchQty${index1.id}-${index2.id}`}
                                                id={`batchQty${index1.id}-${index2.id}`}
                                                defaultValue={index2.Qty}
                                                onChange={(event) => {
                                                    stockQtyOnChange(event, index1, index2);
                                                    totalAmountCalcuationFunc(tableList);
                                                }}
                                            ></Input>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "50px" }}>
                                            <span id={`stockItemRate-${index1.id}-${index2.id}`}>{_cfunc.amountCommaSeparateFunc(index2.Rate)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ width: "50px" }}>{index2.MRP}</div>
                                    </td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>
            ),
        },
        {//***************Discount********************************************************************* */
            text: "Discount/unit",
            dataField: "",
            formatExtraData: {
                discountValueAll: discountValueAll,
                discountTypeAll: discountTypeAll,
                changeAllDiscount: changeAllDiscount,
                forceReload: forceReload,
                tableList: orderItemDetails
            },
            headerFormatter: () => {
                return (
                    <div className="">
                        {orderItemDetails.length <= 0 ?
                            <div className="col col-3 mt-2">
                                <Label>Discount/unit</Label>
                            </div>
                            :
                            <div className="row">
                                <div className=" mt-n2 mb-n2">
                                    <Label>Discount/unit</Label>
                                </div>
                                <div className="col col-6" style={{ width: "100px" }}>
                                    <Select
                                        type="text"
                                        defaultValue={discountTypeAll}
                                        classNamePrefix="select2-selection"
                                        options={discountDropOption}
                                        style={{ textAlign: "right" }}
                                        onChange={(e) => {
                                            setChangeAllDiscount(true);
                                            setDiscountTypeAll(e);
                                            setDiscountValueAll('');
                                        }}
                                    />
                                </div>
                                <div className="col col-6" style={{ width: "100px" }}>
                                    <CInput
                                        type="text"
                                        className="input"
                                        style={{ textAlign: "right" }}
                                        cpattern={decimalRegx}
                                        value={discountValueAll}
                                        onChange={(e) => {
                                            let e_val = Number(e.target.value);

                                            // Check if discount type is "percentage"
                                            if (discountTypeAll.value === 2) {// Discount type 2 represents "percentage"
                                                // Limit the input to the range of 0 to 100
                                                if (e_val > 100) {
                                                    e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                                } else if (!(e_val >= 0 && e_val < 100)) {
                                                    e.target.value = ""; // Clear the input value if it is less than 0
                                                }
                                            }

                                            setChangeAllDiscount(true);
                                            setDiscountValueAll(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                );
            },

            classes: () => "invoice-discount-row",
            formatter: (cellContent, index1, key, formatExtraData) => {
                let { tableList, discountValueAll, discountTypeAll } = formatExtraData;

                if (formatExtraData.changeAllDiscount) {
                    index1.Discount = discountValueAll;
                    index1.DiscountType = discountTypeAll.value;
                    innerStockCaculation(index1);
                    totalAmountCalcuationFunc(tableList);
                }
                if (!index1.DiscountType) { index1.DiscountType = discountTypeAll.value }

                const defaultDiscountTypelabel =
                    index1.DiscountType === 1 ? discountDropOption[0] : discountDropOption[1];

                return (
                    <>
                        <div className="mb-2">
                            <div className="parent">
                                <div className="child">
                                    <label className="label">Type&nbsp;&nbsp;&nbsp;</label>
                                </div>
                                <div className="child">
                                    <Select
                                        id={`DicountType_${key}`}
                                        classNamePrefix="select2-selection"
                                        key={`DicountType_${key}-${index1.id}`}
                                        value={defaultDiscountTypelabel}
                                        options={discountDropOption}
                                        onChange={(e) => {
                                            setChangeAllDiscount(false);
                                            setForceReload(!forceReload);
                                            index1.DiscountType = e.value;
                                            index1.Discount = '';
                                            innerStockCaculation(index1);
                                            totalAmountCalcuationFunc(tableList);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="parent">
                                <div className="child">
                                    <label className="label">Value&nbsp;</label>
                                </div>
                                <div className="child">
                                    <CInput
                                        className="input"
                                        id={`Dicount_${key}-${index1.id}`}
                                        style={{ textAlign: "right" }}
                                        type="text"
                                        value={index1.Discount}
                                        cpattern={decimalRegx}
                                        onChange={(e) => {

                                            let e_val = Number(e.target.value);
                                            // Check if discount type is "percentage"
                                            if (index1.DiscountType === 2) { // Discount type 2 represents "percentage"
                                                // Limit the input to the range of 0 to 100
                                                if (e_val > 100) {
                                                    e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                                } else if (!(e_val >= 0 && e_val < 100)) {
                                                    e.target.value = ''; // Clear the input value if it is less than 0
                                                }
                                            }
                                            index1.Discount = e.target.value;
                                            setChangeAllDiscount(false);
                                            setForceReload(!forceReload);
                                            innerStockCaculation(index1);
                                            totalAmountCalcuationFunc(tableList);
                                        }}

                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bottom-div">
                            <span>Amount:</span>
                            <samp id={`roundedTotalAmount-${index1.id}`}>
                                {_cfunc.amountCommaSeparateFunc(index1.roundedTotalAmount)}
                            </samp>
                        </div>
                    </>
                );
            },
        },
    ];

    const totalAmountCalcuationFunc = (tableList = []) => {
        const calcalateGrandTotal = settingBaseRoundOffAmountFunc(tableList)
        //toLocaleString is convert comma saprate Amount
        let count_label = `${"Total Amount"} :${Number(calcalateGrandTotal.sumOfGrandTotal).toLocaleString()}`
        dispatch(BreadcrumbShowCountlabel(count_label))
    }

    function InvoiceDateOnchange(y, v, e) {
        dispatch(GoButtonForinvoiceAddSuccess([]))
        onChangeDate({ e, v, state, setState })
    };

    function CustomerOnchange(hasSelect,) {

        setState((i) => {
            const v1 = { ...i }
            v1.values.Customer = hasSelect
            v1.hasValid.Customer.valid = true
            return v1
        })
    };

    function goButtonHandler(makeIBInvoice) {
        const btnId = goBtnId;
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        try {
            const jsonBody = JSON.stringify({
                FromDate: values.InvoiceDate,
                Customer: makeIBInvoice ? makeIBInvoice.customer.value : values.Customer.value,
                Party: _cfunc.loginPartyID(),
                OrderIDs: ""
            });
            dispatch(GoButtonForinvoiceAdd({ subPageMode, jsonBody, btnId }));

        } catch (e) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    };

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id
        const saveAndDownloadPdfMode = btnId.substring(0, 21) === "SaveAndDownloadPdfBtn";

        const validMsg = []
        const invoiceItems = []

        // IsComparGstIn= compare Supplier and Customer are Same State by GSTIn Number
        let IsComparGstIn = { GSTIn_1: values.Customer.GSTIN, GSTIn_2: _cfunc.loginUserGSTIN() }

        orderItemDetails.forEach((index) => {
            if (index.StockInValid) {
                validMsg.push(`${index.ItemName}:${index.StockInvalidMsg}`);
                return
            };

            index.StockDetails.forEach((ele) => {

                if (ele.Qty > 0) {
                    //**calculate Amount ,Discount Amount based on Discound type */

                    const calculate = invoice_discountCalculate_Func(ele, index, IsComparGstIn)

                    invoiceItems.push({
                        Item: index.Item,
                        Unit: index.default_UnitDropvalue.value,
                        BatchCode: ele.BatchCode,
                        Quantity: Number(ele.Qty).toFixed(3),
                        BatchDate: ele.BatchDate,
                        BatchID: ele.id,
                        BaseUnitQuantity: Number(ele.BaseUnitQuantity).toFixed(3),
                        LiveBatch: ele.LiveBatche,
                        MRP: ele.LiveBatcheMRPID,
                        MRPValue: ele.MRP,//changes
                        Rate: Number(ele.Rate).toFixed(2),

                        GST: ele.LiveBatcheGSTID,
                        CGST: Number(calculate.CGST_Amount).toFixed(2),
                        SGST: Number(calculate.SGST_Amount).toFixed(2),
                        IGST: Number(calculate.IGST_Amount).toFixed(2),

                        GSTPercentage: calculate.GST_Percentage,
                        CGSTPercentage: calculate.CGST_Percentage,
                        SGSTPercentage: calculate.SGST_Percentage,
                        IGSTPercentage: calculate.IGST_Percentage,

                        BasicAmount: Number(calculate.discountBaseAmt).toFixed(2),
                        GSTAmount: Number(calculate.roundedGstAmount).toFixed(2),
                        Amount: Number(calculate.roundedTotalAmount).toFixed(2),

                        TaxType: 'GST',
                        DiscountType: index.DiscountType,
                        Discount: Number(index.Discount) || 0,
                        DiscountAmount: Number(calculate.disCountAmt).toFixed(2),
                    })
                }
            })
        })

        if (validMsg.length > 0) {
            customAlert({
                Type: 4,
                Message: JSON.stringify(validMsg),
            })
            return
        }

        if (!(invoiceItems.length > 0)) {
            customAlert({
                Type: 4,
                Message: "Please Enter One Item Quantity",
            })
            return
        }

        //**grand total and Tcs Round Off calculations  */ 
        const calcalateGrandTotal = settingBaseRoundOffAmountFunc(orderItemDetails)//Pass Table Data 

        const forInvoice_1_json = () => ({  //** Json Body Generate For Invoice_1  Start+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
            InvoiceDate: values.InvoiceDate,
            InvoiceItems: invoiceItems,
            InvoicesReferences: orderIDs.map(i => ({ Order: i }))
        });

        const forIB_Invoice_json = async () => ({   //**   Json Body Generate For IB_Invoice  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
            IBChallanDate: values.InvoiceDate,
            IBChallanItems: invoiceItems,
            IBChallansReferences: await orderIDs.map(i => ({ Demand: i }))
        });

        const for_common_json = () => ({  //**  Json Body Generate Common for Both +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            CustomerGSTTin: values.Customer.GSTIN,
            GrandTotal: calcalateGrandTotal.sumOfGrandTotal,
            RoundOffAmount: calcalateGrandTotal.RoundOffAmount,
            TCSAmount: calcalateGrandTotal.TCS_Amount,
            Customer: values.Customer.value,
            Vehicle: values.VehicleNo.value ? values.VehicleNo.value : "",
            Party: _cfunc.loginPartyID(),
            CreatedBy: _cfunc.loginUserID(),
            UpdatedBy: _cfunc.loginUserID(),
        });

        try {

            if (formValid(state, setState)) {
                _cfunc.btnIsDissablefunc({ btnId, state: true })
                let jsonBody;  //json body decleration 
                if (subPageMode === url.INVOICE_1) {
                    jsonBody = JSON.stringify({ ...for_common_json(), ...forInvoice_1_json() });
                } else if (subPageMode === url.IB_INVOICE) {
                    jsonBody = JSON.stringify({ ...for_common_json(), ...forIB_Invoice_json() });
                }
                // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                if (pageMode === mode.edit) {
                    return
                }
                else {
                    dispatch(invoiceSaveAction({ subPageMode, jsonBody, btnId, saveAndDownloadPdfMode }));
                }
            }
        } catch (e) { _cfunc.CommonConsole("invode save Handler", e) }

    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <form noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>

                            <div className="row" >
                                <Col sm="4" className="">
                                    <FormGroup className="mb- row mt-3 " >
                                        <Label className="col-sm-8 p-2" style={{ width: "83px" }}>{fieldLabel.InvoiceDate}</Label>
                                        <Col sm="7">
                                            <C_DatePicker
                                                name="InvoiceDate"
                                                value={values.InvoiceDate}
                                                id="myInput11"
                                                disabled={(orderItemDetails.length > 0 || pageMode === "edit") ? true : false}
                                                onChange={InvoiceDateOnchange}
                                            />
                                            {isError.InvoiceDate.length > 0 && (
                                                <span className="invalid-feedback">{isError.InvoiceDate}</span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="4" className="">
                                    <FormGroup className="mb- row mt-3 " >
                                        <Label className="col-sm-6 p-2"
                                            style={{ width: "65px" }}>{fieldLabel.Customer}</Label>
                                        <Col sm="7">
                                            <Select

                                                name="Customer"
                                                value={values.Customer}
                                                isSearchable={true}
                                                isDisabled={orderItemDetails.length > 0 ? true : false}
                                                id={'customerselect'}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={CustomerDropdown_Options}
                                                onChange={CustomerOnchange}
                                                styles={{
                                                    menu: provided => ({ ...provided, zIndex: 2 })
                                                }}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="4" className="">
                                    <FormGroup className="mb- row mt-3 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "65px" }}>{fieldLabel.VehicleNo}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="VehicleNo"
                                                value={values.VehicleNo}
                                                isSearchable={true}
                                                id={'VehicleNoselect'}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={VehicleNumber_Options}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState })
                                                }}
                                                styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }}
                                            />
                                            {isError.VehicleNo.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.VehicleNo}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </div>
                        </Col>

                        <div>
                            <ToolkitProvider
                                keyField={"id"}
                                data={orderItemDetails}
                                columns={pagesListColumns}
                                search
                            >
                                {(toolkitProps) => (
                                    <React.Fragment>
                                        <Row>
                                            <Col xl="12">
                                                <div className="table-responsive table">
                                                    <BootstrapTable
                                                        keyField={"id"}
                                                        id="table_Arrow"
                                                        classes={"table  table-bordered "}
                                                        noDataIndication={
                                                            <div className="text-danger text-center ">
                                                                Items Not available
                                                            </div>
                                                        }
                                                        {...toolkitProps.baseProps}
                                                        onDataSizeChange={(e) => {
                                                            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                            {mySearchProps(toolkitProps.searchProps,)}
                                        </Row>

                                    </React.Fragment>
                                )}
                            </ToolkitProvider>
                        </div>

                        {/* {orderItemDetails.length > 0 ? <FormGroup>
                            <Col sm={2} style={{ marginLeft: "-40px" }} className={"row save1"}>
                                <SaveButton
                                    pageMode={pageMode}
                                    onClick={SaveHandler}
                                    id={saveBtnid}
                                    loading={saveBtnloading}
                                    userAcc={userPageAccessState}
                                />
                            </Col>
                        </FormGroup > : null} */}

                        {
                            (orderItemDetails.length > 0) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                                <Col>
                                    <SaveButton
                                        loading={saveBtnloading}
                                        id={saveBtnid}
                                        pageMode={pageMode}
                                        userAcc={userPageAccessState}
                                        onClick={SaveHandler}
                                        forceDisabled={saveAndPdfBtnLoading}
                                    />
                                </Col>
                                {
                                    (pageMode === mode.defaultsave) ?
                                        <Col>
                                            <SaveAndDownloadPDF
                                                loading={saveAndPdfBtnLoading}
                                                pageMode={pageMode}
                                                id={saveBtnid}
                                                userAcc={userPageAccessState}
                                                onClick={SaveHandler}
                                                forceDisabled={saveBtnloading}
                                            />
                                        </Col> : null}
                            </div>
                                : <div className="row save1"></div>
                        }
                    </form>
                </div>

            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default Invoice