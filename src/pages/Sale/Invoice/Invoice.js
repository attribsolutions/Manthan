import React, { useEffect, useLayoutEffect, useState, } from "react";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Spinner,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess, getpdfReportdata } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveAndDownloadPDF, SaveButton } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import {
    GoButtonForinvoiceAddSuccess,
    Uploaded_EInvoiceAction,
    invoiceSaveAction,
    invoiceSaveActionSuccess,
    makeIB_InvoiceActionSuccess,
    editInvoiceActionSuccess,
    updateInvoiceAction,
    updateInvoiceActionSuccess,
    InvoiceSendToScm
} from "../../../store/Sales/Invoice/action";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess } from "../../../store/CommonAPI/SupplierRedux/actions";
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
import { getVehicleList, getVehicleListSuccess } from "../../../store/Administrator/VehicleRedux/action";
import { Get_Invoice_Batch_Details, Invoice_Singel_Get_for_Report_Api } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import GlobalCustomTable from "../../../GlobalCustomTable";
import { changeCommonPartyDropDetailsAction } from "../../../store/Utilites/PartyDrodown/action";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { CheckStockEntryForFirstTransaction, CheckStockEntryForFirstTransactionSuccess, CheckStockEntryforBackDatedTransaction, CheckStockEntryforBackDatedTransactionSuccess } from "../../../store/Inventory/StockEntryRedux/action";
import VehicleMaster from "../../Adminisrator/VehiclePages/VehicleMaster";
import DriverMaster from "../../Adminisrator/DriverPage/DriverMaster";
import AddMaster from "../../Adminisrator/EmployeePages/Drodown";
import { getDriverList } from "../../../store/Administrator/DriverRedux/action";
import { width } from "dom-helpers";
import { getOrdersMakeInvoiceDataActionSuccess } from "../../../store/Sales/bulkInvoice/action";
import { hideBtnCss } from "../../../components/Common/ListActionsButtons";

const Invoice = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const subPageMode = history.location.pathname
    const systemSetting = _cfunc.loginSystemSetting();
    const isSweetsAndSnacksCompany = _cfunc.IsSweetAndSnacksCompany()



    const fileds = {
        InvoiceDate: currentDate_ymd,
        Customer: "",
        VehicleNo: "",
        DriverName: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [orderItemDetails, setOrderItemDetails] = useState([])
    const [orderIDs, setOrderIDs] = useState('')
    const [editInvoiceData, setEditInvoiceData] = useState('')

    const [Vehicle_AddAccess, setVehicle_AddAccess] = useState(false)
    const [Driver_AddAccess, setDriver_AddAccess] = useState(false)

    const [ReloadedBatch, setReloadedBatch] = useState([])

    const [BatchReload, setBatchReload] = useState(false)








    // for invoice page heder discount functionality useSate ************************************
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)

    // ****************************************************************************

    const [modalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
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
        editData,
        saveBtnloading,
        saveAndPdfBtnLoading,
        commonPartyDropSelect,
        StockEnteryForFirstYear,
        StockEnteryForBackdated,
        DriverList
    } = useSelector((state) => ({
        postMsg: state.InvoiceReducer.postMsg,
        editData: state.InvoiceReducer.editData,
        updateMsg: state.InvoiceReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        DriverList: state.DriverReducer.DriverList,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.CommonAPI_Reducer.customer,
        gobutton_Add: state.InvoiceReducer.gobutton_Add,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        VehicleNumber: state.VehicleReducer.VehicleList,
        makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
        saveBtnloading: state.InvoiceReducer.saveBtnloading,
        saveAndPdfBtnLoading: state.InvoiceReducer.saveAndPdfBtnLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect,
        StockEnteryForFirstYear: state.StockEntryReducer.StockEnteryForFirstYear,
        StockEnteryForBackdated: state.StockEntryReducer.StockEnteryForBackdated,

    }));

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.INVOICE_1))
        dispatch(GoButtonForinvoiceAddSuccess([]))


    }, []);

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            dispatch(getVehicleList({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }));
            dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "", "PartyID": commonPartyDropSelect.value }));
        }

        if (isSweetsAndSnacksCompany) {
            const jsonBody = {
                ..._cfunc.loginJsonBody(),
                PartyID: commonPartyDropSelect.value
            };
            dispatch(getDriverList(jsonBody));
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
        let VehicleMasterID = pageId.VEHICLE
        let DriverMasterID = pageId.DRIVER


        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        userAccess.forEach(inx => {
            if (inx.id === VehicleMasterID) {
                setVehicle_AddAccess(true)
            }
            if (inx.id === DriverMasterID) {
                setDriver_AddAccess(true)
            }
        })


        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])




    useEffect(async () => {
        if (postMsg.Status === true && postMsg.StatusCode === 200) {

            dispatch(invoiceSaveActionSuccess({ Status: false })); // Reset the status to false
            const config = {
                editId: postMsg.TransactionID.join(', '),////for saveAndDownloadPdfMode
                ReportType: report.invoice,//for saveAndDownloadPdfMode
                RowId: postMsg.TransactionID.join(', '),//for Invoice-Upload
                UserID: _cfunc.loginUserID(),//for Invoice-Upload
                subPageMode: subPageMode
            };
            //************************* / Fetch PDF report data if saveAndDownloadPdfMode is true /
            if (postMsg.saveAndDownloadPdfMode) {
                dispatch(getpdfReportdata(Invoice_Singel_Get_for_Report_Api, config));
            }

            // ***************** Upload E-Invoice if AutoEInvoice and EInvoiceApplicable are both "1"  *****/
            if (systemSetting.AutoEInvoice === "1" && systemSetting.EInvoiceApplicable === "1") {
                try {
                    dispatch(Uploaded_EInvoiceAction(config));
                } catch (error) { }
            }

            if (_cfunc.IsSweetAndSnacksCompany() && systemSetting.AutoInvoiceSendToSap === "1") {
                const jsonBody = JSON.stringify({ InvoiceID: postMsg.TransactionID[0] })
                const btnId = config.btnId
                dispatch(InvoiceSendToScm({ jsonBody, btnId }))
            }

            customAlert({
                Type: 1,
                Message: postMsg.Message,
            });

            // Redirect to appropriate page based on subPageMode
            if (subPageMode === url.INVOICE_1) {
                history.push({ pathname: url.INVOICE_LIST_1, updatedRowBlinkId: postMsg.TransactionID.join(', ') });
            } else if (subPageMode === url.IB_INVOICE) {
                history.push({ pathname: url.IB_INVOICE_LIST });
            }
        } else if (postMsg.Status === true) {
            // Show error alert message with the JSON stringified postMsg.Message
            dispatch(invoiceSaveActionSuccess({ Status: false })); // Reset the status to false
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        }
    }, [postMsg]);

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
                return obj
            })

            setOrderItemDetails(gobutton_Add.Data.OrderItemDetails);

            // **********************************************************
            totalAmountCalcuationFunc(gobutton_Add.Data.OrderItemDetails)// show breadcrump tolat amount function//passs table array 
            //*********************************************************** */
            setOrderIDs(gobutton_Add.Data.OrderIDs)
            dispatch(getOrdersMakeInvoiceDataActionSuccess({ Status: false }))
            dispatch(GoButtonForinvoiceAddSuccess({ Status: false }))

        }
    }, [gobutton_Add]);

    useLayoutEffect(() => {

        if (((editData.Status === true) && (editData.StatusCode === 200))) {

            setState((i) => {
                const obj = { ...i }
                obj.values.Customer = editData.customer;
                obj.hasValid.Customer.valid = true;

                obj.values.InvoiceDate = editData.Data.InvoiceDate;
                obj.hasValid.InvoiceDate.valid = true;

                return obj
            })

            setPageMode(editData.pageMode);
            setEditInvoiceData(editData);
            setOrderItemDetails(editData.Data.OrderItemDetails);

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
                innerStockCaculation(index1);
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


    const Reloadhandler = async ({ ItemID }) => {
        setBatchReload(ItemID)

        const jsonBody = JSON.stringify({
            Item: ItemID,
            Party: _cfunc.loginSelectedPartyID()
        });

        const Reloaded_Batch = await Get_Invoice_Batch_Details({ jsonBody })
        if (Reloaded_Batch.Status === true && Reloaded_Batch.StatusCode === 200) {
            setReloadedBatch(Reloaded_Batch.Data)
            setBatchReload(false)
        }


    }

    const pagesListColumns = [
        {//***************ItemName********************************************************************* */
            text: "Item Name",
            dataField: "ItemName",
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "ItemName", "sticky-col": "true" }),
            // headerClasses: 'd-none d-sm-table-cell', // Hide on mobile
            formatter: (cellContent, index1) => {
                return (
                    <>
                        <div>
                            <samp className="theme-font"
                                id={`ItemName${index1.id}`}>{index1.ItemName}</samp>
                        </div>
                        <div style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            width: "100%", // Set the width to the desired container width
                        }}>
                            <samp id={`StockInvalidMsg-${index1.id}`}
                                style={{
                                    display: index1.StockInValid ? "block" : "none",
                                    color: "red",
                                    animation: "scrollRightToLeft 15s linear infinite",
                                }}>
                                {index1.StockInvalidMsg}
                            </samp>
                        </div>
                    </>
                )
            },
        },
        {//***************Quantity********************************************************************* */
            text: "Quantity/Unit",
            dataField: "",
            formatExtraData: { tableList: orderItemDetails, ReloadedBatch: ReloadedBatch },
            attrs: () => ({ 'data-label': "Quantity/Unit" }),


            headerFormatter: (column, colIndex, components) => {

                return (
                    <div className="custom-header" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        paddingRight: '8px',
                        paddingLeft: '8px'
                    }}>
                        <strong>{column.text}</strong>
                        {_cfunc.strToBool(systemSetting.IsTrayEnterQuantity) && <span style={{ color: 'gray', fontWeight: 'normal' }}>Total Tray : <span id="TotalTray_ID">{orderItemDetails.reduce((sum, item) => sum + (item.TrayQuantity || 0), 0)}</span></span>}
                    </div>
                );
            },

            formatter: (cellContent, index1, keys_, { tableList = [] }) => (
                <>
                    {!_cfunc.strToBool(systemSetting.IsTrayEnterQuantity) && <>
                        <div>
                            <Input
                                type="text"

                                id={`OrderQty-${index1.id}`}
                                placeholder="Enter quantity"
                                className="right-aligned-placeholder mb-1"
                                style={{
                                    border: index1.StockInValid ? '2px solid red' : "1px solid #ced4da"
                                }}
                                key={`OrderQty-${index1.id}`}
                                autoComplete="off"
                                defaultValue={index1.Quantity}
                                onChange={(event) => {
                                    orderQtyOnChange(event, index1,);
                                    totalAmountCalcuationFunc(tableList);
                                    const el = document.getElementById("TotalTray_ID");
                                    if (el) {
                                        el.innerText = tableList.reduce((sum, item) => sum + (item.TrayQuantity || 0), 0);
                                    }


                                }}
                            />
                        </div>
                        <div>
                            <div id="select">
                                <Select
                                    classNamePrefix="select2-selection"
                                    id={"ddlUnit"}
                                    isDisabled={pageMode === mode.edit && true}
                                    defaultValue={index1.default_UnitDropvalue}
                                    options={index1.UnitDetails.map(i => ({
                                        "label": i.UnitName,
                                        "value": i.UnitID,
                                        "ConversionUnit": i.ConversionUnit,
                                        "Unitlabel": i.UnitName,
                                        "BaseUnitQuantity": i.BaseUnitQuantity,
                                        "BaseUnitQuantityNoUnit": i.BaseUnitQuantityNoUnit,
                                    }))}
                                    onChange={(event) => {
                                        orderQtyUnit_SelectOnchange(event, index1);
                                        totalAmountCalcuationFunc(tableList);
                                    }}
                                ></Select>
                            </div>
                        </div></>
                    }

                    {_cfunc.strToBool(systemSetting.IsTrayEnterQuantity) && <>
                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <Input
                                type="text"
                                id={`OrderQty-${index1.id}`}
                                placeholder="Enter quantity"
                                className="right-aligned-placeholder"
                                style={{
                                    border: index1.StockInValid ? "2px solid red" : "1px solid #ced4da",
                                    width: "40%",
                                }}
                                key={`OrderQty-${index1.id}`}
                                autoComplete="off"
                                defaultValue={index1.Quantity}
                                onChange={(event) => {
                                    orderQtyOnChange(event, index1);
                                    totalAmountCalcuationFunc(tableList);
                                    const el = document.getElementById("TotalTray_ID");
                                    if (el) {
                                        el.innerText = tableList.reduce((sum, item) => sum + (item.TrayQuantity || 0), 0);
                                    }
                                }}
                            />
                            <Select
                                classNamePrefix="select2-selection"
                                id={"ddlUnit"}
                                isDisabled={true}
                                defaultValue={index1.default_UnitDropvalue}
                                options={index1.UnitDetails.map(i => ({
                                    label: i.UnitName,
                                    value: i.UnitID,
                                    ConversionUnit: i.ConversionUnit,
                                    Unitlabel: i.UnitName,
                                    BaseUnitQuantity: i.BaseUnitQuantity,
                                    BaseUnitQuantityNoUnit: i.BaseUnitQuantityNoUnit,
                                }))}
                                onChange={(event) => {
                                    orderQtyUnit_SelectOnchange(event, index1);
                                    totalAmountCalcuationFunc(tableList);
                                }}
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        width: "40%",
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        minHeight: "30px", // Ensuring alignment
                                        height: "38px",
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        height: "30px",
                                        padding: "0px 8px",
                                    }),
                                    input: (provided) => ({
                                        ...provided,
                                        margin: "0px",
                                    }),
                                    indicatorsContainer: (provided) => ({
                                        ...provided,
                                        height: "30px",
                                    }),
                                }}
                            />
                        </div>
                        <div style={{ borderBottom: "1px solid #ddd", margin: "5px -11px 5px -11px", }}></div>
                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <div className="theme-font " style={{ width: "40%" }}>
                                <span className="text-muted">Tray Quantity:</span>
                            </div>
                            <Input
                                type="text"
                                id={`TrayQty-${index1.id}`}
                                placeholder="Enter quantity"
                                className="right-aligned-placeholder"
                                style={{
                                    border: index1.StockInValid ? "2px solid red" : "1px solid #ced4da",
                                    width: "40%",
                                }}
                                key={`TrayQty-${index1.id}`}
                                autoComplete="off"
                                defaultValue={index1.TrayQuantity}
                                onChange={(event) => {
                                    index1.TrayQuantity = _cfunc.getFixedNumber(event.target.value)
                                    const el = document.getElementById("TotalTray_ID");
                                    if (el) {
                                        el.innerText = tableList.reduce((sum, item) => sum + (item.TrayQuantity || 0), 0);
                                    }
                                }}
                            />
                        </div>
                        <div style={{ borderBottom: "1px solid #ddd", margin: "5px -11px 5px -11px", }}></div> </>}

                    <div className="theme-font">
                        <span className="text-muted">Order-Qty :</span>
                        <samp>{index1.OrderQty}</samp>&nbsp;&nbsp;
                        <samp>{index1.UnitName}</samp>
                    </div>
                    <div>
                        <samp className="theme-font text-muted" >Available stock :</samp>
                        <label className="text-black">{_cfunc.roundToDecimalPlaces(index1.ItemTotalStock, 3)}</label>
                    </div>
                </>
            ),
        },
        {//***************StockDetails********************************************************************* */
            text: "Stock Details",
            dataField: "StockDetails",
            attrs: () => ({ 'data-label1': "Stock Details", "stock-header": "true" }),
            headerStyle: { zIndex: "2" },
            formatExtraData: { tableList: orderItemDetails, ReloadedBatch: ReloadedBatch },
            formatter: (cellContent, index1, keys_, { tableList = [], ReloadedBatch = [] }) => {

                if ((ReloadedBatch.length > 0) && (index1.Item === ReloadedBatch[0].Item)) {

                    // index1.StockDetails = ReloadedBatch
                    let totalAmount = 0;
                    let remainingOrderQty = parseFloat(index1.Quantity); // Convert to a number
                    let totalStockQty = 0;
                    index1.StockDetails = ReloadedBatch.map(index2 => {

                        index2.initialRate = index2.Rate;  //initialize

                        const _hasRate = ((index1.default_UnitDropvalue.BaseUnitQuantity / index1.default_UnitDropvalue.BaseUnitQuantityNoUnit) * index2.initialRate);
                        const _hasActualQuantity = (index2.BaseUnitQuantity / index1.default_UnitDropvalue.BaseUnitQuantity);


                        index2.Rate = _cfunc.roundToDecimalPlaces(_hasRate, 2);//max 2 decimal  //initialize
                        index2.ActualQuantity = _cfunc.roundToDecimalPlaces(_hasActualQuantity, 3);//max 3 decimal  //initialize

                        //+++++++++++++++++++++ stock Distribute +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        const stockQty = parseFloat(index2.ActualQuantity); // Convert to a number
                        totalStockQty += stockQty;

                        const qtyToDeduct = Math.min(remainingOrderQty, stockQty);
                        index2.Qty = _cfunc.roundToDecimalPlaces(qtyToDeduct, 3); // Round to three decimal places
                        remainingOrderQty = _cfunc.roundToDecimalPlaces(remainingOrderQty - qtyToDeduct, 3); // Round the remaining order quantity

                        if (qtyToDeduct > 0) {// Calculate total amount if quantity is greater than 0

                            const calculatedItem = invoice_discountCalculate_Func(index2, index1);

                            totalAmount += parseFloat(calculatedItem.roundedTotalAmount); // Convert to a number
                        }
                        index1._batchProcessed = true;
                        return index2;
                    });

                    index1.ItemTotalStock = _cfunc.roundToDecimalPlaces(totalStockQty, 3); //max 3 decimal
                    index1.ItemTotalAmount = _cfunc.roundToDecimalPlaces(totalAmount, 2); //max 2 decimal

                    // Check for stock availability and set corresponding message
                    if (index1.ItemTotalStock < Number(index1.Quantity)) {
                        index1.StockInValid = true;
                        const diffrence = Math.abs(Number(index1.ItemTotalStock) - Number(index1.Quantity));
                        const msg1 = `Short Stock Quantity ${index1.Quantity}`;
                        const msg2 = `Short Stock Quantity ${diffrence}`;
                        index1.StockInvalidMsg = index1.ItemTotalStock === 0 ? msg1 : msg2;
                    } else {
                        index1.StockInValid = false
                    }

                    cellContent = index1.StockDetails
                    setReloadedBatch([])
                }
                return (
                    <div className="table-responsive">
                        <table className="custom-table ">
                            <thead >
                                <tr>
                                    <th>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>BatchCode</span>
                                            <Button
                                                id="Reload"
                                                type="button"
                                                style={{ borderRadius: "20px", cursor: "pointer" }}
                                                className={hideBtnCss}
                                                onClick={() => { Reloadhandler({ ItemID: index1.Item }) }}
                                                data-mdb-toggle="tooltip"
                                                data-mdb-placement="top"
                                                title="Reload Batch"
                                            >
                                                {(BatchReload === index1.Item) ? <Spinner style={{ width: "19px", height: "19px" }} ></Spinner> : <i className="bx bx-sync" style={{ fontSize: "20px" }}></i>}
                                            </Button>
                                        </div>
                                    </th>

                                    <th>Stock </th>
                                    <th>Quantity</th>
                                    <th>Basic Rate</th>
                                    {!isSweetsAndSnacksCompany && <th>MRP</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {cellContent.map((index2) => (
                                    <tr key={index1.id}>
                                        <td data-label="BatchCode">{index2.BatchCode}</td>
                                        <td data-label="Stock Quantity" style={{ textAlign: "right" }} >
                                            <samp id={`ActualQuantity-${index1.id}-${index2.id}`}>{index2.ActualQuantity}</samp>
                                        </td>
                                        <td data-label='Quantity'>
                                            <Input
                                                type="text"
                                                placeholder="Manually enter quantity"
                                                className="right-aligned-placeholder"
                                                key={`batchQty${index1.id}-${index2.id}`}
                                                id={`batchQty${index1.id}-${index2.id}`}
                                                defaultValue={index2.Qty}
                                                onChange={(event) => {
                                                    stockQtyOnChange(event, index1, index2);
                                                    totalAmountCalcuationFunc(tableList);

                                                }}
                                            />
                                        </td>
                                        <td data-label='Basic Rate' style={{ textAlign: "right" }}>
                                            <span id={`stockItemRate-${index1.id}-${index2.id}`}>{_cfunc.amountCommaSeparateFunc(index2.Rate)}</span>
                                        </td>
                                        {!isSweetsAndSnacksCompany && <td data-label='MRP' style={{ textAlign: "right" }}>{_cfunc.amountCommaSeparateFunc(_cfunc.roundToDecimalPlaces(index2.MRP, 2))}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            },
        },
        {//***************Discount********************************************************************* */
            text: "Discount/unit",
            dataField: "",
            attrs: () => ({ 'data-label': "Discount/unit" }),
            formatExtraData: {
                tableList: orderItemDetails,
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
                                        // style={{ textAlign: "right",zIndex: 2 }}
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
                debugger
                if (!index1.DiscountType) { index1.DiscountType = discountTypeAll.value }

                const defaultDiscountTypelabel =
                    ((index1.DiscountType === "1") || (index1.DiscountType === 1)) ? discountDropOption[0] : discountDropOption[1];

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
                                            innerStockCaculation(index1);
                                            totalAmountCalcuationFunc(tableList);
                                        }}

                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bottom-div">
                            <span className="theme-font text-muted">Amount:</span>
                            <samp className='text-black' id={`item-TotalAmount-${index1.id}`}>
                                {_cfunc.amountCommaSeparateFunc(index1.ItemTotalAmount)}
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
        const commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(calcalateGrandTotal.sumOfGrandTotal));
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

    const DriverOptions = DriverList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const SaveHandler = async (event) => {

        event.preventDefault();
        const btnId = event.target.id;

        let saveAndDownloadPdfMode = false;

        if (btnId === "") {
            saveAndDownloadPdfMode = true
        }

        const validMsg = []
        const invoiceItems = []

        // IsComparGstIn= compare Supplier and Customer are Same State by GSTIn Number
        let IsComparGstIn = { GSTIn_1: values.Customer.GSTIN, GSTIn_2: _cfunc.loginUserGSTIN() }

        orderItemDetails.forEach((index) => {
            if (index.StockInValid) {
                validMsg.push({ [index.ItemName]: ` ${index.StockInvalidMsg}.` })
                return
            };

            let isSameMRPinStock = ''; //this is check is Enterd stock Quantity is Same MRP
            index.StockDetails.forEach((ele) => {

                if ((Number(ele.Qty) > 0) || (pageMode === mode.edit)) {

                    if ((isSameMRPinStock === "") && !(isSameMRPinStock === false)) {//this is check is Enterd stock Quantity is Same MRP
                        isSameMRPinStock = parseFloat(ele.MRP)
                    } else if (isSameMRPinStock !== parseFloat(ele.MRP)) {
                        isSameMRPinStock = false
                    }
                    if (!Number(ele.Rate) > 0) {//** */ rate validation check  */
                        validMsg.push({ [index.ItemName]: alertMessages.rateNotAvailable })
                        return
                    };

                    //**calculate Amount ,Discount Amount based on Discound type */

                    const calculate = invoice_discountCalculate_Func(ele, index, IsComparGstIn)

                    invoiceItems.push({
                        "Item": index.Item,
                        "Unit": index.default_UnitDropvalue.value,
                        "BatchCode": ele.BatchCode,
                        "Quantity": Number(ele.Qty).toFixed(3),
                        "BatchDate": ele.BatchDate,
                        "BatchID": ele.id,
                        "BaseUnitQuantity": Number(ele.BaseUnitQuantity).toFixed(3),
                        "PreviousInvoiceBaseUnitQuantity": Number(ele.BaseUnitQuantity).toFixed(3),
                        "TrayQuantity": index.TrayQuantity,
                        "LiveBatch": ele.LiveBatche,
                        "MRP": ele.LiveBatcheMRPID,
                        "MRPValue": ele.MRP,//changes
                        "Rate": Number(ele.Rate).toFixed(2),

                        "GST": ele.LiveBatcheGSTID,
                        "CGST": Number(calculate.CGST_Amount).toFixed(2),
                        "SGST": Number(calculate.SGST_Amount).toFixed(2),
                        "IGST": Number(calculate.IGST_Amount).toFixed(2),

                        "GSTPercentage": calculate.GST_Percentage,
                        "CGSTPercentage": calculate.CGST_Percentage,
                        "SGSTPercentage": calculate.SGST_Percentage,
                        "IGSTPercentage": calculate.IGST_Percentage,

                        "BasicAmount": Number(calculate.discountBaseAmt).toFixed(2),
                        "GSTAmount": Number(calculate.roundedGstAmount).toFixed(2),
                        "Amount": Number(calculate.roundedTotalAmount).toFixed(2),

                        "TaxType": 'GST',
                        "DiscountType": index.DiscountType,
                        "Discount": Number(index.Discount) || 0,
                        "DiscountAmount": Number(calculate.disCountAmt).toFixed(2),
                    })
                }
            })

            if (isSameMRPinStock === false) {
                validMsg.push({ [index.ItemName]: alertMessages.multiple_MRP_notAllowed })
                return
            };
        })

        if (validMsg.length > 0) {
            customAlert({
                Type: 4,
                Message: validMsg,
            })
            return
        }
        if (!state.values.Customer?.value > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.customerIsRequired,
            })
            return
        }

        if (!(invoiceItems.length > 0)) {
            customAlert({
                Type: 4,
                Message: alertMessages.itemQtyIsRequired,
            })
            return
        }

        //**grand total and Tcs Round Off calculations  */ 
        const calcalateGrandTotal = settingBaseRoundOffAmountFunc(orderItemDetails)//Pass Table Data 

        const forInvoice_1_json = () => ({  //** Json Body Generate For Invoice_1  Start+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
            InvoiceDate: values.InvoiceDate,
            InvoiceItems: invoiceItems,
            // InvoicesReferences: [{ Order: orderIDs }],

            InvoicesReferences: orderIDs
                .split(',')
                .filter(id => id)
                .map(id => ({ Order: id })),

        });

        const forIB_Invoice_json = async () => ({   //**   Json Body Generate For IB_Invoice  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
            IBChallanDate: values.InvoiceDate,
            IBChallanItems: invoiceItems,
            IBChallansReferences: [{ Order: orderIDs }],
        });

        const for_common_json = () => ({  //**  Json Body Generate Common for Both +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            CustomerGSTTin: values.Customer.GSTIN,
            GrandTotal: calcalateGrandTotal.sumOfGrandTotal,
            RoundOffAmount: calcalateGrandTotal.RoundOffAmount,
            TCSAmount: calcalateGrandTotal.TCS_Amount,
            Customer: values.Customer.value,
            Vehicle: values.VehicleNo.value ? values.VehicleNo.value : "",
            Driver: values.DriverName.value ? values.DriverName.value : "",
            Party: commonPartyDropSelect.value,
            CreatedBy: _cfunc.loginUserID(),
            UpdatedBy: _cfunc.loginUserID(),
        });

        try {
            let jsonBody;  //json body decleration 
            if (subPageMode === url.INVOICE_1) {
                const body = { InvoiceData: [{ ...for_common_json(), ...forInvoice_1_json() }] }
                jsonBody = JSON.stringify(body);
            } else if (subPageMode === url.IB_INVOICE) {
                jsonBody = JSON.stringify({ ...for_common_json(), ...forIB_Invoice_json() });
            }
            // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            if (pageMode === mode.edit) {
                jsonBody = JSON.stringify({ ...for_common_json(), ...forInvoice_1_json() });
                const config = { updateId: editInvoiceData.editId, subPageMode, jsonBody };
                dispatch(updateInvoiceAction(config));
            }
            else {

                if (StockEnteryForBackdated.Status === true && StockEnteryForBackdated.StatusCode === 400) {
                    customAlert({ Type: 3, Message: StockEnteryForBackdated.Message });
                } else {
                    dispatch(invoiceSaveAction({ subPageMode, jsonBody, btnId, saveAndDownloadPdfMode }));
                }
            }

        } catch (e) { _cfunc.CommonConsole("invoice save Handler", e) }
    }

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <form noValidate>
                        <Col className="px-2 mb-1 c_card_filter header text-black" sm={12}>

                            <div className="row" >
                                <Col sm={2} className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-8 p-2" style={{ width: "100px" }}>{fieldLabel.InvoiceDate}</Label>
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

                                <Col sm={4} className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-6 p-2"
                                            style={{ width: "70px" }}>{fieldLabel.Customer}</Label>
                                        <Col sm="10">
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

                                <Col sm={3} className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-5 p-2"
                                            style={{ width: "70px" }}>{fieldLabel.VehicleNo}</Label>
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
                                        {(Vehicle_AddAccess) &&
                                            <Col md="1" className="mt-md-n2">
                                                <AddMaster
                                                    masterModal={VehicleMaster}
                                                    masterPath={url.VEHICLE}
                                                />
                                            </Col>}
                                    </FormGroup>
                                </Col>


                                <Col sm={3} className="">
                                    <FormGroup className="mb- row mt-2 " >
                                        <Label className="col-sm-6 p-2"
                                            style={{ width: "70px" }}>{fieldLabel.DriverName}</Label>
                                        <Col sm="7">
                                            <Select
                                                name="DriverName"
                                                value={values.DriverName}
                                                isSearchable={true}

                                                id={'customerselect'}
                                                className="react-dropdown"
                                                classNamePrefix="dropdown"
                                                options={DriverOptions}
                                                onChange={(hasSelect, evn) => {
                                                    onChangeSelect({ hasSelect, evn, state, setState })
                                                }}
                                                styles={{ menu: provided => ({ ...provided, zIndex: 3 }) }}
                                            />
                                            {isError.DriverName.length > 0 && (
                                                <span className="text-danger f-8"><small>{isError.DriverName}</small></span>
                                            )}
                                        </Col>
                                        {(Driver_AddAccess) &&
                                            <Col md="1" className="mt-md-n2">
                                                <AddMaster
                                                    masterModal={DriverMaster}
                                                    masterPath={url.DRIVER}
                                                />
                                            </Col>}
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
                                    onClick={SaveHandler}
                                    forceDisabled={saveBtnloading || !StockEnteryForFirstYear.Data}
                                    module={"Invoice"}
                                />
                                {(pageMode === mode.defaultsave) &&
                                    <SaveAndDownloadPDF
                                        loading={saveAndPdfBtnLoading}
                                        pageMode={pageMode}
                                        userAcc={userPageAccessState}
                                        onClick={SaveHandler}
                                        forceDisabled={(saveAndPdfBtnLoading) || !(StockEnteryForFirstYear.Data)}
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

export default Invoice