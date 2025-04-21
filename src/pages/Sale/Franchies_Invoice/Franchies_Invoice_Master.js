import React, { useEffect, useLayoutEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess, getpdfReportdata, postOrderConfirms_API, postOrderConfirms_API_Success } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
    onChangeText,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveAndDownloadPDF, SaveButton } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import {
    GoButtonForinvoiceAddSuccess,
    Uploaded_EInvoiceAction,
    invoiceSaveActionSuccess,
    makeIB_InvoiceActionSuccess,
    editInvoiceActionSuccess,
    updateInvoiceActionSuccess
} from "../../../store/Sales/Invoice/action";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import {
    settingBaseRoundOffAmountFunc,
} from "../../Sale/Invoice/invoiceCaculations";
import "../../Sale/Invoice/invoice.scss"
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx, } from "../../../CustomValidateForm";
import { getVehicleList, getVehicleListSuccess } from "../../../store/Administrator/VehicleRedux/action";
import { Franchies_Invoice_Singel_Get_for_Report_Api, } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import GlobalCustomTable from "../../../GlobalCustomTable";
import { changeCommonPartyDropDetailsAction } from "../../../store/Utilites/PartyDrodown/action";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { CheckStockEntryForFirstTransaction, CheckStockEntryForFirstTransactionSuccess, CheckStockEntryforBackDatedTransaction, CheckStockEntryforBackDatedTransactionSuccess } from "../../../store/Inventory/StockEntryRedux/action";
import { Franchies_invoice_Calculate_Func, DiscountCaculationForFranchies, orderQtyOnChange, orderQtyUnit_SelectOnchange, postWithBasicAuth, RoundCalculationFunc } from "./FranchiesInvoiceFunc";
import { FRANCHAISE_INVOICE_DELETE_API, FRANCHAISE_INVOICE_SAVE_API } from "../../../helpers/url_helper";

const Franchies_Invoice_Master = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const subPageMode = history.location.pathname
    const systemSetting = _cfunc.loginSystemSetting();

    const now = new Date();
    const date = now.toISOString().slice(0, 10); // e.g., 2024-11-29
    const time = now.toTimeString().slice(0, 8); // e.g., 13:32:54

    const saveBtnid = `saveBtn${subPageMode}`

    const fileds = {
        InvoiceDate: currentDate_ymd,
        Customer: "",
        VehicleNo: "",
        AdvanceAmount: "0",
        OrderID: 0
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [orderItemDetails, setOrderItemDetails] = useState([])
    const [orderIDs, setOrderIDs] = useState('')
    const [editInvoiceData, setEditInvoiceData] = useState('')

    // for invoice page heder discount functionality useSate ************************************
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)

    const [saveBtnloading, setSaveBtnloading] = useState(false);
    const [btnMode, setBtnMode] = useState('');
    const [franchiesSaveApiRep, setFranchiesSaveApiRep] = useState({});
    const [franchiesUpdateApiRep, setFranchiesUpdateApiRep] = useState({});
    const [createdBy, seteditCreatedBy] = useState("");


    // ****************************************************************************

    const [modalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const {

        updateMsg,
        pageField,
        userAccess,
        gobutton_Add = { Status: false },
        vendorSupplierCustomer,
        makeIBInvoice,
        VehicleNumber,
        editData,
        commonPartyDropSelect,
        StockEnteryForFirstYear,
    } = useSelector((state) => ({

        editData: state.InvoiceReducer.editData,
        updateMsg: state.InvoiceReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.CommonAPI_Reducer.customer,
        gobutton_Add: state.InvoiceReducer.gobutton_Add,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        VehicleNumber: state.VehicleReducer.VehicleList,
        makeIBInvoice: state.InvoiceReducer.makeIBInvoice,

        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect,
        StockEnteryForFirstYear: state.StockEntryReducer.StockEnteryForFirstYear,

    }));

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.FRANCHAISE_INVOICE))
        dispatch(GoButtonForinvoiceAddSuccess([]))

        return () => {
            dispatch(postOrderConfirms_API_Success({ Status: false }))
        }
    }, []);





    useEffect(() => {
        if (franchiesSaveApiRep?.Success === true && franchiesSaveApiRep?.status_code === 200) {

            let jsonBody = { OrderIDs: (franchiesSaveApiRep.OrderID).toString() }


            dispatch(postOrderConfirms_API({ jsonBody: jsonBody, conform_saveInvoice: true }))

            setFranchiesSaveApiRep({});
            const config = {
                editId: franchiesSaveApiRep?.TransactionID,////for saveAndDownloadPdfMode
                ReportType: report.invoice,//for saveAndDownloadPdfMode
                RowId: franchiesSaveApiRep?.TransactionID,//for Invoice-Upload
                UserID: _cfunc.loginUserID(),//for Invoice-Upload
            };
            //************************* / Fetch PDF report data if saveAndDownloadPdfMode is true /
            if (franchiesSaveApiRep?.saveAndDownloadPdfMode) {
                dispatch(getpdfReportdata(Franchies_Invoice_Singel_Get_for_Report_Api, config));
            }

            // ***************** Upload E-Invoice if AutoEInvoice and EInvoiceApplicable are both "1"  *****/
            if (systemSetting.AutoEInvoice === "1" && systemSetting.EInvoiceApplicable === "1") {
                try {
                    dispatch(Uploaded_EInvoiceAction(config));
                } catch (error) { }
            }

            customAlert({
                Type: 1,
                Message: franchiesSaveApiRep?.Message,
            });

            // Redirect to appropriate page based on subPageMode
            if (subPageMode === url.FRANCHAISE_INVOICE) {

                history.push({ pathname: url.POS_INVOICE_LIST, updatedRowBlinkId: franchiesSaveApiRep?.TransactionID });
            }
        } else if (franchiesSaveApiRep?.Success === true) {
            // Show error alert message with the JSON stringified postMsg.Message
            dispatch(postOrderConfirms_API_Success({ Status: false }))
            setFranchiesSaveApiRep({});
            customAlert({
                Type: 4,
                Message: JSON.stringify(franchiesSaveApiRep?.Message),
            });
        }
    }, [franchiesSaveApiRep]);

    useEffect(() => {
        if (franchiesUpdateApiRep?.Status === true && franchiesUpdateApiRep?.StatusCode === 200) {

            setFranchiesUpdateApiRep({});
            customAlert({
                Type: 1,
                Message: "POSInvoice Update Successfully",
            });

            // Redirect to appropriate page based on subPageMode
            if (subPageMode === url.FRANCHAISE_INVOICE) {
                history.push({ pathname: url.POS_INVOICE_LIST, updatedRowBlinkId: franchiesUpdateApiRep?.TransactionID });
            }

        } else if (franchiesUpdateApiRep?.Status === true) {
            // Show error alert message with the JSON stringified postMsg.Message
            setFranchiesUpdateApiRep({});
            customAlert({
                Type: 4,
                Message: JSON.stringify(franchiesUpdateApiRep?.Message),
            });
        }
    }, [franchiesUpdateApiRep]);

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            dispatch(getVehicleList({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }));
            dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "", "PartyID": commonPartyDropSelect.value }));
        }

        return () => {
            dispatch(GetVenderSupplierCustomerSuccess([]));
            dispatch(getVehicleListSuccess([]));
            dispatch(CheckStockEntryForFirstTransactionSuccess({ status: false }))
            dispatch(changeCommonPartyDropDetailsAction({ forceDisable: false }))//change party drop-down restore state
            dispatch(invoiceSaveActionSuccess({ Status: false })); // Reset the status to false
            setOrderItemDetails([]);
            setState((i) => {
                const obj = { ...i }
                obj.values.Customer = "";
                obj.values.VehicleNo = "";
                obj.hasValid.Customer.valid = true;
                obj.hasValid.VehicleNo.valid = true;
                return obj
            })
        }
    }, [commonPartyDropSelect]);

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


    useEffect(() => {

        if ((updateMsg.Status === true) && (updateMsg.StatusCode === 200) && !(modalCss)) {
            history.push({
                pathname: url.INVOICE_LIST_1,
            })
        } else if (updateMsg.Status === true && !modalCss) {
            dispatch(updateInvoiceActionSuccess({ Status: false }));
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
                obj.values.AdvanceAmount = gobutton_Add.customer.AdvanceAmount;
                obj.values.OrderID = gobutton_Add.customer.OrderIDs;
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

    useLayoutEffect(() => {

        if (((editData.Status === true) && (editData.StatusCode === 200))) {
            debugger
            setState((i) => {
                const obj = { ...i }
                obj.values.Customer = editData.customer;
                obj.hasValid.Customer.valid = true;

                obj.values.OrderID = editData.customer.OrderID;
                obj.values.AdvanceAmount = editData.Data?.AdvanceAmount;

                obj.values.InvoiceDate = editData.Data?.InvoiceDate;
                obj.hasValid.InvoiceDate.valid = true;

                return obj
            })

            setPageMode(editData.pageMode);
            setEditInvoiceData(editData);
            setOrderItemDetails(editData.Data?.OrderItemDetails);
            seteditCreatedBy(editData?.Data?.CreatedBy)


            if (editData.pageMode === mode.edit) {
                dispatch(changeCommonPartyDropDetailsAction({ forceDisable: true }))//change party drop-down disable when edit/view
            };

            // **********************************************************
            totalAmountCalcuationFunc(editData.Data.OrderItemDetails)// show breadcrump tolat amount function//passs table array 
            //*********************************************************** */
            setOrderIDs(editData.Data.OrderIDs)
            dispatch(editInvoiceActionSuccess({ Status: false }))
        }

    }, [editData]);

    useLayoutEffect(() => {

        if ((VehicleNumber.length > 0) && editInvoiceData !== '' && pageMode == mode.edit) {
            const foundVehicle = VehicleNumber.find(i => editInvoiceData.Data.Vehicle === i.id);

            setState((i) => {
                const obj = { ...i }
                if (foundVehicle !== undefined) {
                    obj.values.VehicleNo = { value: foundVehicle.id, label: foundVehicle.VehicleNumber };
                    obj.hasValid.VehicleNo.valid = true;
                }
                return obj
            })
        }
    }, [VehicleNumber, editInvoiceData, pageMode]);

    useEffect(() => {

        if (changeAllDiscount) {
            const updatedOrderItemTable = orderItemDetails.map((item) => ({
                ...item,
                Discount: discountValueAll,
                DiscountType: discountTypeAll.value,
            }));

            // Perform calculations based on the updated values for each item
            updatedOrderItemTable.forEach((index1) => {
                DiscountCaculationForFranchies(index1, subPageMode);
            });
            totalAmountCalcuationFunc(updatedOrderItemTable);
            // Set the updated array as the new orderItemTable
            setOrderItemDetails(updatedOrderItemTable);
        }
    }, [changeAllDiscount, discountValueAll, discountTypeAll.value]);

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
        {
            text: "Item Name",
            dataField: "ItemName",
        },
        {//***************Quantity********************************************************************* */
            text: "Quantity/Unit",
            dataField: "",
            formatExtraData: { tableList: orderItemDetails },
            attrs: () => ({ 'data-label': "Quantity/Unit" }),
            formatter: (cellContent, index1, keys_, { tableList = [] }) => (
                <>
                    <div>
                        <CInput
                            type="text"

                            id={`OrderQty-${index1.id}`}
                            placeholder="Enter quantity"
                            cpattern={decimalRegx}
                            className="right-aligned-placeholder mb-1"
                            key={`OrderQty-${index1.id}`}
                            autoComplete="off"
                            defaultValue={index1.Quantity}
                            onChange={(event) => {
                                orderQtyOnChange(event, index1, subPageMode);
                                totalAmountCalcuationFunc(tableList);
                            }}
                        />
                    </div>
                    <div>
                        <div id="select">
                            <Select
                                classNamePrefix="select2-selection"
                                id={"ddlUnit"}
                                isDisabled={true}
                                defaultValue={index1.default_UnitDropvalue}
                                options={index1.UnitDetails.map(i => ({
                                    "label": i.UnitName,
                                    "value": i.MUnitID,
                                    "ConversionUnit": i.ConversionUnit,
                                    "Unitlabel": i.UnitName,
                                    "BaseUnitQuantity": i.BaseUnitQuantity,
                                    "BaseUnitQuantityNoUnit": i.BaseUnitQuantityNoUnit,
                                }))}
                                onChange={(event) => {
                                    orderQtyUnit_SelectOnchange(event, index1, subPageMode);
                                    totalAmountCalcuationFunc(tableList);
                                }}
                            ></Select>
                        </div>
                    </div>
                    <div className="theme-font">
                        <span className="text-muted">Order-Qty :</span>
                        <samp>{index1.OrderQty}</samp>&nbsp;&nbsp;
                        <samp>{index1.UnitName}</samp>
                    </div>
                </>
            ),
        },
        {
            text: "MRP",
            dataField: "MRPValue",
        },
        {//***************Discount********************************************************************* */
            text: "Discount/unit",
            dataField: "",
            attrs: () => ({ 'data-label': "Discount/unit" }),
            formatExtraData: {
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
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 55 })
                                        }}
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
                                        className="right-aligned-placeholder"
                                        cpattern={decimalRegx}
                                        placeholder="Enter discount value"
                                        value={discountValueAll}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.replace(/^\.+/, '');
                                            e.target.value = e.target.value.replace(/^00+/, '0');
                                            let e_val = Number(e.target.value);

                                            if (discountTypeAll.value === 2) {// Discount type 2 represents "percentage"
                                                if (e_val >= 100) { // Limit the input to the range of 0 to 100
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
                let { tableList } = formatExtraData;

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
                                            index1.DiscountType = e.value;
                                            index1.Discount = '';
                                            DiscountCaculationForFranchies(index1);
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

                                        id={`Dicount_${key}-${index1.id}`}
                                        className="right-aligned-placeholder"
                                        type="text"
                                        placeholder="Enter discount value"
                                        value={index1.Discount}
                                        cpattern={decimalRegx}
                                        onChange={(e) => {

                                            e.target.value = e.target.value.replace(/^\.+/, '');
                                            e.target.value = e.target.value.replace(/^00+/, '0');
                                            let e_val = Number(e.target.value);


                                            if (index1.DiscountType === 2) {// Discount type 2 represents "percentage"
                                                if (e_val >= 100) { // Limit the input to the range of 0 to 100
                                                    e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                                } else if (!(e_val >= 0 && e_val < 100)) {
                                                    e.target.value = ""; // Clear the input value if it is less than 0
                                                }
                                            }

                                            index1.Discount = e.target.value;
                                            setChangeAllDiscount(false);
                                            DiscountCaculationForFranchies(index1);
                                            totalAmountCalcuationFunc(tableList);
                                        }}

                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bottom-div">
                            <span className="theme-font text-muted">Amount:</span>
                            <samp className='text-black' id={`item-TotalAmount-${index1.id}`}>
                                {_cfunc.amountCommaSeparateFunc((index1.ItemTotalAmount).toFixed(2) || 0)}
                            </samp>
                        </div>
                    </>
                );
            },
        },
    ];

    const totalAmountCalcuationFunc = (tableList = []) => {

        const calcalateGrandTotal = settingBaseRoundOffAmountFunc(tableList)
        const dataCount = tableList.length;

        const commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(calcalateGrandTotal.sumOfGrandTotal).toFixed(2));
        dispatch(BreadcrumbShowCountlabel(`Count:${dataCount} currency_symbol ${commaSeparateAmount} weight ${(calcalateGrandTotal.sumOfWeightageTotal).toFixed(3)} kg`))

    }

    useEffect(() => {
        const jsonBody = JSON.stringify({
            "FromDate": values.InvoiceDate,
            "PartyID": commonPartyDropSelect.value
        });

        const jsonBodyForBackdatedTransaction = JSON.stringify({
            "TransactionDate": values.InvoiceDate,
            "PartyID": commonPartyDropSelect.value,

        });

        if (commonPartyDropSelect.value > 0) {
            dispatch(CheckStockEntryForFirstTransaction({ jsonBody }))
            dispatch(CheckStockEntryforBackDatedTransaction({ jsonBody: jsonBodyForBackdatedTransaction }))

        }
    }, [values.InvoiceDate, commonPartyDropSelect.value])

    useEffect(() => {
        if (StockEnteryForFirstYear.Status === true && StockEnteryForFirstYear.StatusCode === 400) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(StockEnteryForFirstYear.Message),
            })
        }
    }, [StockEnteryForFirstYear])

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

    const SaveHandler = async (event, btnId) => {
        debugger
        event.preventDefault();
        setBtnMode(btnId)
        setSaveBtnloading(true)
        const validMsg = []
        const invoiceItems = []

        // IsComparGstIn= compare Supplier and Customer are Same State by GSTIn Number
        let IsComparGstIn = { GSTIn_1: values.Customer.GSTIN, GSTIn_2: _cfunc.loginUserGSTIN() }

        orderItemDetails.forEach((index) => {

            index.StockDetails.forEach((ele) => {

                if ((Number(ele.Qty) > 0) || (pageMode === mode.edit)) {

                    const calculate = Franchies_invoice_Calculate_Func(ele, index, IsComparGstIn)

                    invoiceItems.push({

                        "SaleDate": values.InvoiceDate,
                        "PartyID": _cfunc.loginPartyID(),
                        "ClientID": 0,
                        "ClientSaleItemID": 0,
                        "ClientSaleID": 0,
                        "ERPItemID": index.Item,
                        "ItemID": index.Item,
                        "IsMixItem": 0,
                        "MixItemId": null,
                        "ItemName": null,
                        "HSNCode": index.HSNCode,
                        "Quantity": Number(Number(ele.Qty).toFixed(3)),
                        "UnitID": (index.default_UnitDropvalue.value).toString(),

                        "DiscountType": index.DiscountType,
                        "DiscountValue": Number(Number(index.Discount).toFixed(2)) || 0,
                        "DiscountAmount": Number(Number(calculate.disCountAmt).toFixed(2)),

                        "MRP": parseFloat(ele.MRP),
                        "Rate": Number(Number(ele.Rate).toFixed(2)),
                        "Amount": Number(Number(calculate.ItemTotalAmount).toFixed(2)),
                        "BasicAmount": Number(Number(calculate.taxableAmount).toFixed(2)),

                        "GSTRate": parseFloat(ele.GST),
                        "GSTAmount": Number(Number(calculate.GST_Amount).toFixed(2)),

                        "CGSTRate": parseFloat(calculate.CGST_Percentage),
                        "CGSTAmount": Number(Number(calculate.CGST_Amount).toFixed(2)),

                        "SGSTRate": parseFloat(calculate.SGST_Percentage),
                        "SGSTAmount": Number(Number(calculate.SGST_Amount).toFixed(2)),

                        "IGSTRate": Number(Number(calculate.IGST_Percentage).toFixed(2)),
                        "IGSTAmount": Number(Number(calculate.IGST_Amount).toFixed(2)),
                    })
                }
            })

        })

        if (validMsg.length > 0) {
            customAlert({
                Type: 4,
                Message: validMsg,
            })
            setSaveBtnloading(false)

            return
        }
        if (!state.values.Customer?.value > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.customerIsRequired,
            })
            setSaveBtnloading(false)

            return
        }

        if (!(invoiceItems.length > 0)) {
            customAlert({
                Type: 4,
                Message: alertMessages.itemQtyIsRequired,
            })
            setSaveBtnloading(false)

            return
        }


        const RoundCalculation = RoundCalculationFunc(invoiceItems);
        if (Number(values.AdvanceAmount) > RoundCalculation.RoundedAmount) {
            customAlert({
                Type: 4,
                Message: alertMessages.AdvanceAmount,
            })
            setSaveBtnloading(false)
            return
        }

        try {
            let jsonBody = [{
                "ClientID": 0,
                "ClientSaleID": 0,
                "DivisionID": _cfunc.loginPartyID(),
                "MacID": null,
                "SaleDate": values.InvoiceDate,
                "CustomerID": values.Customer.value,
                "Mobile": '',
                "PaymentType": "Cash",
                "DiscountAmount": RoundCalculation.DiscountAmount,
                "TotalAmount": RoundCalculation.TotalAmount,
                "NetAmount": RoundCalculation.NetAmount,
                "RoundedAmount": RoundCalculation.RoundedAmount,
                "RoundOffAmount": RoundCalculation.RoundOffAmount,
                "CreatedBy": _cfunc.loginUserID(),
                "CreatedOn": `${date} ${time}`,
                "UpdatedBy": _cfunc.loginUserID(),
                "UpdatedOn": `${date} ${time}`,
                "IsDeleted": 0,
                "ReferenceInvoiceID": null,
                "Description": null,
                "AdvanceAmount": (Number(values.AdvanceAmount)).toFixed(2),
                "SaleItems": invoiceItems,
                "SPOSInvoicesReferences": [
                    {
                        "Order": values.OrderID
                    }
                ],
            }]

            if (pageMode === mode.edit) {
                const updateJsonBody = JSON.stringify([{
                    "DeletedTableAutoID": values.OrderID,
                    "ClientID": 0,
                    "ClientSaleID": values.OrderID,
                    "PartyID": values.Customer.PartyID,
                    "InvoiceDate": values.InvoiceDate,
                    "DeletedBy": _cfunc.loginUserID(),
                    "DeletedOn": `${date} ${time}`,
                    "ReferenceInvoiceID": null,
                    "isUpdate": true,
                    "UpdatedBy": _cfunc.loginUserID(),
                    "UpdatedOn": `${date} ${time}`,
                    "UpdatedInvoiceDetails": jsonBody
                }]);

                console.log("Invoice update JsonBody", updateJsonBody)
                const updateApiResponse = await postWithBasicAuth({
                    jsonBody: updateJsonBody,
                    APIName: FRANCHAISE_INVOICE_DELETE_API,
                });
                setFranchiesUpdateApiRep(updateApiResponse)

            }
            else {
                console.log("Invoice Save JsonBody", JSON.stringify(jsonBody))
                const saveApiRespone = await postWithBasicAuth({
                    jsonBody: jsonBody,
                    btnId: btnId,
                    OrderID: values.OrderID,
                    APIName: FRANCHAISE_INVOICE_SAVE_API,
                });
                setFranchiesSaveApiRep(saveApiRespone)
            }

            setSaveBtnloading(false)

        } catch (e) {
            _cfunc.CommonConsole("invoice save Handler", e)

        }
        finally {
            setSaveBtnloading(false);
        }
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <form noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>

                            <div className="row" >
                                <Col sm="3" className="">
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

                                <Col sm="3" className="">
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
                                                styles={{ menu: provided => ({ ...provided, zIndex: 3 }) }}
                                            />
                                            {isError.Customer.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.Customer}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="3" className="">
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
                                                styles={{ menu: provided => ({ ...provided, zIndex: 3 }) }}
                                            />
                                            {isError.VehicleNo.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.VehicleNo}</small></span>
                                            )}
                                        </Col>
                                    </FormGroup>
                                </Col>

                                <Col sm="3" className="">
                                    <FormGroup className="mb- row mt-3 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "127px" }}>{fieldLabel.AdvanceAmount}</Label>
                                        <Col sm="7">
                                            <Input
                                                name="AdvanceAmount"
                                                value={values.AdvanceAmount}
                                                placeholder="Enter Advance Amount"
                                                type='text'
                                                autoComplete='off'
                                                onChange={(event) => {
                                                    onChangeText({ event, state, setState })
                                                }}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </div>
                        </Col>

                        <div className="mb-1">
                            <GlobalCustomTable
                                keyField={"id"}
                                data={orderItemDetails}
                                columns={pagesListColumns}
                                id="table_Arrow"
                                noDataIndication={
                                    <div className="text-danger text-center ">
                                        Items Not available
                                    </div>
                                }
                                onDataSizeChange={(e) => {
                                    _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                }}
                            />
                        </div>

                        {(orderItemDetails.length > 0) &&
                            <SaveButtonDraggable>
                                <SaveButton
                                    loading={saveBtnloading}
                                    pageMode={pageMode}
                                    userAcc={userPageAccessState}
                                    editCreatedBy={createdBy}
                                    onClick={(e) => { SaveHandler(e, "save") }}
                                    forceDisabled={saveBtnloading || !StockEnteryForFirstYear.Data}
                                    module={"Invoice"}
                                />
                                {(pageMode === mode.defaultsave) &&
                                    <SaveAndDownloadPDF
                                        loading={saveBtnloading && btnMode === "print"}
                                        pageMode={pageMode}
                                        userAcc={userPageAccessState}
                                        onClick={(e) => { SaveHandler(e, "print") }}
                                        forceDisabled={(saveBtnloading) || !(StockEnteryForFirstYear.Data)}
                                        module={"Invoice"}
                                    />
                                }
                            </SaveButtonDraggable>
                        }
                    </form>
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

export default Franchies_Invoice_Master

