import React, { useEffect, useLayoutEffect, useState } from "react";
import { MetaTags } from "react-meta-tags"
import { useHistory } from "react-router-dom";
import {
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { orderCalculateFunc } from "./OrderPageCalulation";
import { SaveButton, Go_Button, Change_Button, GotoInvoiceBtn, PageLoadingSpinner, DashboardLoader, C_Button } from "../../../components/Common/CommonButton";
import { mySearchProps } from "../../../components/Common/SearchBox/MySearch";

import OrderPageTermsTable from "./OrderPageTermsTable";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import PartyItems from "../../Adminisrator/PartyItemPage/PartyItems";

import { customAlert } from "../../../CustomAlert/ConfirmDialog"
import { order_Type } from "../../../components/Common/C-Varialbes";
import { CInput, C_DatePicker, C_Select, decimalRegx, onlyNumberRegx } from "../../../CustomValidateForm/index";

import * as _act from "../../../store/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import { editPartyItemID } from "../../../store/Administrator/PartyItemsRedux/action";
import { getPartyListAPI, getPartyListAPISuccess } from "../../../store/Administrator/PartyRedux/action";
import { pageFieldUseEffect, table_ArrowUseEffect, updateMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { orderApprovalFunc, orderApprovalMessage } from "./orderApproval";
import { GetRoutesList, GetRoutesListSuccess } from "../../../store/Administrator/RoutesRedux/actions";
import { ORDER_4 } from "../../../routes/route_url";
// import NewCommonPartyDropdown from "../../../components/Common/NewCommonPartyDropdown";
import "../../../CustomTable2/CustomTable.scss"
import "./order.scss"
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { changeCommonPartyDropDetailsAction } from "../../../store/Utilites/PartyDrodown/action";


let editVal = {}
let initial_BredcrumbMsg = `Count:0 ₹ 0.00`
function initialState(history) {

    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.ORDER_1) {
        page_Id = pageId.ORDER_1;
        listPath = url.ORDER_LIST_1
    }
    else if (sub_Mode === url.ORDER_2) {
        page_Id = pageId.ORDER_2;
        listPath = url.ORDER_LIST_2
    }
    else if (sub_Mode === url.IB_ORDER) {
        page_Id = pageId.IB_ORDER;
        listPath = url.IB_ORDER_PO_LIST;
    }
    else if (sub_Mode === url.ORDER_4) {
        page_Id = pageId.ORDER_4;
        listPath = url.ORDER_LIST_4
    }
    return { page_Id, listPath }
};

const Order = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        id: "",
        Supplier: "",
        Route: "",
        Item: ''
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [subPageMode] = useState(history.location.pathname)
    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [description, setDescription] = useState('')

    const [deliverydate, setdeliverydate] = useState(currentDate_ymd)
    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('');

    const [poFromDate, setpoFromDate] = useState(currentDate_ymd);
    const [poToDate, setpoToDate] = useState(currentDate_ymd);
    const [orderdate, setorderdate] = useState(currentDate_ymd);

    const [supplierSelect, setSupplierSelect] = useState('');
    const [routeSelect, setRouteSelect] = useState({ value: '', label: "All" });
    const [itemSelect, setItemSelect] = useState({ value: '', label: "All" });
    const [itemSelectDropOptions, setitemSelectOptions] = useState([]);
    const [selecedItemWiseOrder, setSelecedItemWiseOrder] = useState(true)
    const [goBtnDissable, setGoBtnDissable] = useState(false)

    const [termsAndConTable, setTermsAndConTable] = useState([]);
    const [orderTypeSelect, setorderTypeSelect] = useState('');
    const [isOpen_assignLink, setisOpen_assignLink] = useState(false)
    const [orderItemTable, setOrderItemTable] = useState([])
    const [findPartyItemAccess, setFindPartyItemAccess] = useState(false)
    const [FSSAI_Date_Is_Expired, setFSSAI_Date_Is_Expired] = useState("")

    // for Order page heder dicount functionality useSate ************************************
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)

    // ****************************************************************************

    const {
        goBtnOrderdata,
        postMsg,
        vendorSupplierCustomer,
        userAccess,
        orderType,
        updateMsg,
        supplierAddress,
        pageField,
        partyList_redux,
        assingItemData = '',
        approvalDetail,
        orderApprovalMsg,
        gobutton_Add_invoice,
        invoiceGoBtnloading,
        goBtnloading,
        saveBtnloading,
        gotoInvoiceBtnLoading,
        RoutesList,
        supplierADDdropLoading,
        supplierDropLoading,
        orderTypeDropLoading,
        routesDropLoading,
        commonPartyDropSelect
    } = useSelector((state) => ({
        goBtnOrderdata: state.OrderReducer.goBtnOrderAdd,

        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        supplierDropLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,

        supplierAddress: state.CommonAPI_Reducer.supplierAddress,
        supplierADDdropLoading: state.CommonAPI_Reducer.supilerADDLoading,

        orderType: state.CommonAPI_Reducer.orderType,
        orderTypeDropLoading: state.CommonAPI_Reducer.orderTypeLoading,

        postMsg: state.OrderReducer.postMsg,
        updateMsg: state.OrderReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        orderApprovalMsg: state.OrderReducer.orderApprovalMsg,
        approvalDetail: state.OrderReducer.approvalDetail,
        assingItemData: state.PartyItemsReducer.editData,

        partyList_redux: state.PartyMasterReducer.partyList,
        partyDropLoading: state.PartyMasterReducer.partyDropLoading,

        RoutesList: state.RoutesReducer.RoutesList,
        routesDropLoading: state.RoutesReducer.goBtnLoading,

        gobutton_Add_invoice: state.InvoiceReducer.gobutton_Add,
        invoiceGoBtnloading: state.InvoiceReducer.goBtnloading,

        goBtnloading: state.OrderReducer.goBtnLoading,
        saveBtnloading: state.OrderReducer.saveBtnloading,
        gotoInvoiceBtnLoading: state.OrderReducer.gotoInvoiceBtnLoading,

        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));;

    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useLayoutEffect(() => {
        dispatch(_act.commonPageFieldSuccess(null));
        dispatch(_act.GoButton_For_Order_AddSuccess(null));
        dispatch(_act.commonPageField(page_id));
        dispatch(_act.getTermAndCondition());
        dispatch(_act.getOrderType());
        return () => {
            dispatch(_act.commonPageFieldSuccess(null));
            dispatch(_act.GoButton_For_Order_AddSuccess(null))
            dispatch(_act.getTermAndCondition_Success([]));
        }

    }, []);

    useEffect(() => userAccessUseEffect({ // userAccess useEffect 
        props,
        userAccess,
        dispatch,
        setUserAccState,
        otherloginAccss// for other pages login role access chack
    }), [userAccess]);

    const otherloginAccss = (ind) => {
        if ((ind.id === pageId.PARTYITEM) && !(subPageMode === url.IB_ORDER)) {
            setFindPartyItemAccess(true)
        }
    };

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            dispatch(GetRoutesList({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value }));
            dispatch(getPartyListAPI({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value, IsRetailer: 0 }));
            dispatch(_act.GetVenderSupplierCustomer({ subPageMode, RouteID: "", "PartyID": commonPartyDropSelect.value }));
            if (!(subPageMode === url.ORDER_4)) {
                dispatch(_act.getSupplierAddress(commonPartyDropSelect.value))
            }
        }
        setItemSelect({ value: '', label: "All" });
        setRouteSelect({ value: '', label: "All" });
        setSupplierSelect('')
        return () => {
            dispatch(getPartyListAPISuccess([]));
            dispatch(GetRoutesListSuccess([]));
            dispatch(_act.GetVenderSupplierCustomerSuccess([]));
            setGoBtnDissable(false)
            setSelecedItemWiseOrder(true)
            setOrderItemTable([])
            dispatch(_act.GoButton_For_Order_AddSuccess([]))
        }


    }, [commonPartyDropSelect]);

    useEffect(() => { // hasEditVal useEffect

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

                setorderdate(hasEditVal.OrderDate)

                if (subPageMode === url.ORDER_4) {
                    setSupplierSelect({
                        label: hasEditVal.CustomerName,
                        value: hasEditVal.Customer,
                        GSTIN: hasEditVal.CustomerGSTIN,
                    });
                } else {

                    setSupplierSelect({
                        label: hasEditVal.SupplierName,
                        value: hasEditVal.Supplier,
                        GSTIN: hasEditVal.SupplierGSTIN,
                    });
                }
                setdeliverydate(hasEditVal.DeliveryDate)
                setshippAddr({ label: hasEditVal.ShippingAddress, value: hasEditVal.ShippingAddressID })
                setbillAddr({ label: hasEditVal.BillingAddress, value: hasEditVal.BillingAddressID });
                setDescription(hasEditVal.Description)
                editVal = {}
                editVal = hasEditVal
                // setOrderAmount(hasEditVal.OrderAmount)
                setorderTypeSelect({ value: hasEditVal.POType, label: hasEditVal.POTypeName })

                setpoToDate(hasEditVal.POToDate)
                setpoFromDate(hasEditVal.POFromDate)

                const { TermsAndConditions = [] } = hasEditVal;
                const termsAndCondition = TermsAndConditions.map(i => ({
                    value: i.id,
                    label: i.TermsAndCondition,
                    IsDeleted: 0
                }))

                const orderItems = hasEditVal.OrderItems.map((ele, k) => {
                    ele["id"] = k + 1
                    return ele
                });

                orderItems.sort((a, b) => {
                    if (a.Quantity === null && b.Quantity !== null) {
                        return 1;
                    } else if (a.Quantity !== null && b.Quantity === null) {
                        return -1;
                    } else if (a.Quantity === null && b.Quantity === null) {
                        return 0;
                    } else {
                        return a.Quantity - b.Quantity;
                    }
                });



                setOrderItemTable(orderItems)
                setTermsAndConTable(termsAndCondition)

                const commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(hasEditVal.OrderAmount));
                dispatch(_act.BreadcrumbShowCountlabel(`Count:${orderItems.length} ₹ ${commaSeparateAmount}`))
                seteditCreatedBy(hasEditVal.CreatedBy)
            }
            dispatch(_act.editOrderIdSuccess({ Status: false }))
            dispatch(changeCommonPartyDropDetailsAction({ forceDisable: true }))//change party drop-down disable when edit/view
        } else {
            dispatch(_act.BreadcrumbShowCountlabel(initial_BredcrumbMsg))
        }
        return () => {
            dispatch(changeCommonPartyDropDetailsAction({ forceDisable: false }))//change party drop-down restore state
        }
    }, []);

    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(_act.saveOrderActionSuccess({ Status: false }))
            setSelecedItemWiseOrder(true)
            setGoBtnDissable(false)
            // setOrderAmount(0);
            setTermsAndConTable([]);
            // setorderTypeSelect('');
            setisOpen_assignLink(false)
            setOrderItemTable([])
            setSupplierSelect('');

            // ??******************************+++++++++++++++++++++++++++++++++++++++++
            const liveMode = false  // temporary not working code thats why false use line no. 253 to 289
            const aprovalSapCallMode = (postMsg.IsSAPCustomer > 0)

            if ((subPageMode === url.ORDER_2) && liveMode && aprovalSapCallMode) { //        SAP OEDER-APROVUAL CODE
                let config = { orderId: postMsg.OrderID }

                dispatch(_act.getOrderApprovalDetailAction(config));

            } else {// ??******************************+++++++++++++++++++++++++++++++++++++++++++++++


                dispatch(_act.GoButton_For_Order_AddSuccess([]))
                if ((subPageMode === url.ORDER_4) && (postMsg.gotoInvoiceMode)) {

                    const customer = supplierSelect
                    const jsonBody = JSON.stringify({
                        OrderIDs: postMsg.OrderID.toString(),
                        FromDate: orderdate,
                        Customer: supplierSelect.value,
                        Party: commonPartyDropSelect.value,
                    });
                    dispatch(_act.GoButtonForinvoiceAdd({
                        jsonBody,
                        subPageMode: url.INVOICE_1,
                        path: url.INVOICE_1,
                        pageMode: mode.defaultsave,
                        customer,
                        errorMsg: "Order Save Successfully But Can't Make Invoice"
                    }));
                }
                else {
                    const a = await customAlert({
                        Type: 1,
                        Message: postMsg.Message,
                    })
                    if (a) {
                        history.push({
                            pathname: listPath,
                            updatedRowBlinkId: postMsg.OrderID
                        });
                    }
                }

            }
        }
        else if ((postMsg.Status === true)) {

            dispatch(_act.saveOrderActionSuccess({ Status: false }))
            customAlert({
                Type: 4,
                Message: JSON.stringify(postMsg.Message),
            });
        }
    }, [postMsg])

    useEffect(() => updateMsgUseEffect({
        updateMsg, modalCss,
        history, dispatch,
        updateSuccss: _act.updateOrderIdSuccess,
        listPath: listPath
    }), [updateMsg])

    useEffect(() => pageFieldUseEffect({// useEffect common pagefield for master
        state,
        setState,
        pageField
    }), [pageField])

    useEffect(() => table_ArrowUseEffect("#table_Arrow"), [orderItemTable]);

    useEffect(() => {
        if (assingItemData.Status === true) {
            setisOpen_assignLink(true);
        }
    }, [assingItemData]);

    useEffect(() => {
        if (goBtnOrderdata) {
            let { OrderItems = [], TermsAndConditions = [] } = goBtnOrderdata
            if (!selecedItemWiseOrder) { setOrderItemTable(OrderItems) }
            setitemSelectOptions(OrderItems.map(i => ({ ...i, value: i.Item_id, label: i.ItemName })))

            setTermsAndConTable(TermsAndConditions)
            dispatch(_act.GoButton_For_Order_AddSuccess(''))
        }
    }, [goBtnOrderdata]);

    useEffect(() => {
        if ((supplierAddress.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setbillAddr(supplierAddress[0]);
            setshippAddr(supplierAddress[0]);
        }
    }, [supplierAddress]);

    useEffect(() => {
        if ((orderType.length > 0) && (!((hasShowloction || hasShowModal)))) {
            setorderTypeSelect({
                value: orderType[0].id,
                label: orderType[0].Name,
            });
        }
    }, [orderType]);

    useEffect(() => {
        orderApprovalFunc({ dispatch, approvalDetail })
    }, [approvalDetail]);

    useEffect(() => {
        orderApprovalMessage({ dispatch, orderApprovalMsg, listPath, history })
    }, [orderApprovalMsg]);

    useEffect(() => {
        try {
            document.getElementById("__assignItem_onClick").style.display = ((supplierSelect.value > 0) && (findPartyItemAccess) && !goBtnloading) ? "block" : "none"
        } catch (e) { }
    }, [goBtnloading, supplierSelect, findPartyItemAccess]);

    useEffect(() => {
        if (gobutton_Add_invoice.Status === true && gobutton_Add_invoice.StatusCode === 200) {
            history.push({
                pathname: gobutton_Add_invoice.path,
            })
        }
    }, [gobutton_Add_invoice]);

    useEffect(() => {

        if (changeAllDiscount) {
            const updatedOrderItemTable = orderItemTable.map((item) => ({
                ...item,
                Discount: discountValueAll,
                DiscountType: discountTypeAll.value,
            }));

            // Perform calculations based on the updated values for each item
            updatedOrderItemTable.forEach((item) => {
                itemWise_CalculationFunc(item, undefined, updatedOrderItemTable);
            });

            // Set the updated array as the new orderItemTable
            setOrderItemTable(updatedOrderItemTable);
        }
    }, [changeAllDiscount, discountValueAll, discountTypeAll.value]);

    const supplierOptions = vendorSupplierCustomer.map((i) => ({
        value: i.id,
        label: i.Name,
        FSSAIExipry: i.FSSAIExipry,
        GSTIN: i.GSTIN,
        FSSAINo: i.FSSAINo,
        IsTCSParty: i.IsTCSParty,
        ISCustomerPAN: i.PAN,

    }))

    const orderTypeOptions = orderType.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    const RoutesListOptions = RoutesList.map((index) => ({
        value: index.id,
        label: index.Name,
        IsActive: index.IsActive
    }));

    const RouteOptions = RoutesListOptions.filter((index) => {
        return index.IsActive === true
    });

    RouteOptions.unshift({
        value: "",
        label: "All"
    });

    const pagesListColumns = [
        { //---------------"GroupName"------------
            dataField: "GroupName",
            text: "Group",
            classes: 'table-cursor-pointer',
            sort: true,
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "GroupName" }),
            headerStyle: () => {
                return { minWidth: '100px', textAlign: 'center' };
            },
        },
        {//-----------------"SubGroupName"------------------
            dataField: "SubGroupName",
            text: "SubGroup",
            classes: 'table-cursor-pointer',
            sort: true,
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "SubGroupName" }),
            headerStyle: () => {
                return { minWidth: '100px', textAlign: 'center' };
            },
        },

        {//------------- ItemName column ----------------------------------
            dataField: "ItemName",
            text: "Item Name",
            classes: 'table-cursor-pointer',
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "ItemName", "sticky-col": "true" }),
            sort: true,
            headerStyle: () => {
                return { minWidth: '200px', textAlign: 'center' };
            },
            sortValue: (cell, row) => row["ItemName"],
            headerFormatter: (value, row, k, f) => {
                return (
                    <div className="d-flex justify-content-between" key={row.id}>
                        <div>
                            Item Name
                        </div>
                        <div onClick={assignItem_onClick}>
                            <samp id={"__assignItem_onClick"} style={{ display: "none", cursor: "pointer" }} className="text-primary fst-italic text-decoration-underline"
                            >
                                Assign-Items</samp>
                        </div>

                    </div>
                )
            },
        },
        {
            dataField: "StockQuantity",
            text: "Stock Quantity",
            classes: 'table-cursor-pointer',
            align: () => "right",
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "StockQuantity" }),
            sort: true,
            headerStyle: () => {
                return { minWidth: '100px', textAlign: 'center' };
            },
        },

        { //------------- Quantity column ----------------------------------
            text: "Quantity",
            classes: 'table-cursor-pointer',
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "Quantity" }),
            headerStyle: () => {
                return { width: '10%', textAlign: 'center' };
            },
            formatExtraData: { tableList: orderItemTable },
            formatter: (value, row, k, { tableList }) => {

                return (
                    <>
                        <CInput
                            key={`Quantity-${k}`}
                            id={`Quantity-${k}`}
                            cpattern={onlyNumberRegx}
                            defaultValue={row.Quantity}
                            autoComplete="off"
                            className=" text-end"
                            onChange={(e) => {
                                row["Quantity"] = e.target.value
                                itemWise_CalculationFunc(row, undefined, tableList)
                            }}
                        />
                    </>
                )
            },

        },

        {  //------------- Unit column ----------------------------------
            text: "Unit",
            classes: 'table-cursor-pointer',
            dataField: "",
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "Unit" }),
            headerStyle: () => {
                return { width: '9%', textAlign: 'center' };
            },
            formatExtraData: { tableList: orderItemTable },
            formatter: (value, row, key, { tableList }) => {

                if (!row.UnitName) {
                    row["Unit_id"] = 0;
                    row["UnitName"] = 'null';

                    row.UnitDetails.forEach(i => {
                        if ((i.PODefaultUnit) && !(subPageMode === url.ORDER_4)) {
                            defaultUnit(i)
                        }
                        else if ((i.SODefaultUnit) && (subPageMode === url.ORDER_4)) {
                            defaultUnit(i)
                        }
                    });
                    // ********************** //if default unit is not selected then auto first indx unit select
                    if ((row["UnitName"] === 'null') && row.UnitDetails.length > 0) {
                        defaultUnit(row.UnitDetails[0])
                    }
                    // **********************                   

                    function defaultUnit(i) {
                        row["Unit_id"] = i.UnitID;
                        row["po_Unit_id"] = i.UnitID;
                        row["UnitName"] = i.UnitName;
                        row["BaseUnitQuantity"] = i.BaseUnitQuantity;
                        row["Rate"] = ((i.BaseUnitQuantity / i.BaseUnitQuantityNoUnit) * i.Rate).toFixed(2);
                    }

                } else {
                    row.UnitDetails.forEach(i => {
                        if ((row.Unit_id === i.UnitID)) {
                            row["BaseUnitQuantity"] = i.BaseUnitQuantity;
                            row["UnitName"] = i.UnitName;
                        }
                    });

                }
                if (pageMode === mode.edit) {

                    if (!row["edit_Qty"]) {
                        if (row.Quantity > 0) {
                            row["editrowId"] = true
                            row["edit_Qty"] = row.Quantity

                        } else {
                            row["edit_Qty"] = 0
                            row["editrowId"] = false
                        }
                    }

                    if (!row["edit_Unit_id"]) {
                        row["edit_Unit_id"] = row.Unit_id;
                    }

                    if (!row["edit_Discount"]) {
                        row["edit_Discount"] = row.Discount;
                    }
                    if (!row["edit_DiscountType"]) {
                        row["edit_DiscountType"] = row.DiscountType;
                    }
                }

                return (
                    <div >
                        <Select
                            id={"ddlUnit"}
                            key={`ddlUnit${row.id}`}
                            defaultValue={{ value: row.Unit_id, label: row.UnitName }}
                            options={
                                row.UnitDetails.map(i => ({
                                    label: i.UnitName,
                                    value: i.UnitID,

                                    BaseUnitQuantity: i.BaseUnitQuantity,
                                    Rate: i.Rate,
                                    BaseUnitQuantityNoUnit: i.BaseUnitQuantityNoUnit
                                }))
                            }
                            onChange={e => {
                                row["Unit_id"] = e.value;
                                row["UnitName"] = e.label
                                row["BaseUnitQuantity"] = e.BaseUnitQuantity;

                                row["Rate"] = ((e.BaseUnitQuantity / e.BaseUnitQuantityNoUnit) * e.Rate).toFixed(2);
                                itemWise_CalculationFunc(row, undefined, tableList)

                                document.getElementById(`Rate-${key}`).innerText = _cfunc.amountCommaSeparateFunc(Number(row.Rate).toFixed(2))
                            }}
                        >
                        </Select >
                    </div>
                )
            },

        },

        {//------------- Rate column ----------------------------------
            text: "Basic Rate",
            classes: 'table-cursor-pointer',
            dataField: "",
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "Basic Rate" }),
            headerStyle: () => {
                return { width: '9%', textAlign: 'center' };
            },
            formatExtraData: { tableList: orderItemTable },
            formatter: (value, row, k, { tableList }) => {
                if (subPageMode === url.ORDER_1) {
                    return (
                        <div key={row.id} className="text-end">
                            <CInput
                                type="text"
                                id={`Rate-${k}`}
                                cpattern={decimalRegx}
                                defaultValue={row.Rate}
                                className="text-end"
                                onChange={(event) => {
                                    row.Rate = event.target.value;
                                    itemWise_CalculationFunc(row, undefined, tableList)

                                }}
                            />

                        </div>
                    )
                }
                else {
                    return (
                        <div key={row.id} className="text-end">

                            <span id={`Rate-${k}`}>{_cfunc.amountCommaSeparateFunc(Number(row.Rate).toFixed(2))}</span>
                        </div>
                    )
                }

            },

        },

        {//------------- MRP column ----------------------------------
            text: "MRP",
            classes: 'table-cursor-pointer',
            dataField: "",
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "MRP" }),
            headerStyle: () => {
                return { width: '8%', textAlign: 'center' };
            },
            formatter: (value, row, k) => {

                return (
                    <div key={row.id} className="text-end">
                        <span>{row.MRPValue}</span>
                    </div>
                )
            },

        },
        {//***************Discount********************************************************************* */
            text: "Discount/unit",
            dataField: "",
            formatExtraData: {
                tableList: orderItemTable
            },
            attrs: () => ({ 'data-label': "Discount/unit" }),
            headerStyle: () => {
                return { width: '11%', textAlign: 'center' };
            },
            headerFormatter: () => {
                return (
                    <div className="" >
                        {orderItemTable.length <= 0 ?
                            <div className="col col-3 mt-2">
                                <Label>Discount/unit</Label>
                            </div>
                            :
                            <div className="row">
                                <div className=" mt-n2 mb-n2">
                                    <Label>Discount/unit</Label>
                                </div>
                                <div className="col col-6" >
                                    <Select
                                        type="text"
                                        defaultValue={discountTypeAll}
                                        classNamePrefix="select2-selection"
                                        options={discountDropOption}
                                        isDisabled={(subPageMode === url.ORDER_2)}
                                        style={{ textAlign: "right" }}
                                        onChange={(e) => {
                                            setChangeAllDiscount(true);
                                            setDiscountTypeAll(e);
                                            setDiscountValueAll('');
                                        }}
                                    />
                                </div>
                                <div className="col col-6" >
                                    <CInput
                                        type="text"
                                        className="input"
                                        style={{ textAlign: "right" }}
                                        cpattern={decimalRegx}
                                        value={discountValueAll}
                                        disabled={(subPageMode === url.ORDER_2)}
                                        onChange={(e) => {
                                            e.target.value = e.target.value.replace(/^\.+/, '');
                                            e.target.value = e.target.value.replace(/^00+/, '0');
                                            let e_val = Number(e.target.value);

                                            if (discountTypeAll.value === 2) {// Discount type 2 represents "percentage"
                                                if (e_val > 100) { // Limit the input to the range of 0 to 100
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

            classes: () => "order-discount-row",
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
                                        isDisabled={(subPageMode === url.ORDER_2)}
                                        options={discountDropOption}
                                        onChange={(e) => {
                                            setChangeAllDiscount(false);
                                            index1.DiscountType = e.value;
                                            index1.Discount = '';
                                            itemWise_CalculationFunc(index1, undefined, tableList)
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
                                        disabled={(subPageMode === url.ORDER_2)}
                                        cpattern={decimalRegx}
                                        onChange={(e) => {

                                            e.target.value = e.target.value.replace(/^\.+/, '');
                                            e.target.value = e.target.value.replace(/^00+/, '0');
                                            let e_val = Number(e.target.value);


                                            if (index1.DiscountType === 2) {// Discount type 2 represents "percentage"
                                                if (e_val > 100) { // Limit the input to the range of 0 to 100
                                                    e.target.value = 100; // Set the input value to 100 if it exceeds 100
                                                } else if (!(e_val >= 0 && e_val < 100)) {
                                                    e.target.value = ""; // Clear the input value if it is less than 0
                                                }
                                            }


                                            index1.Discount = e.target.value;
                                            setChangeAllDiscount(false);
                                            itemWise_CalculationFunc(index1, undefined, tableList)
                                        }}

                                    />
                                </div>
                            </div>
                        </div>

                    </>
                );
            },
        },

        { //------------- Comment column ----------------------------------
            text: "Comment",
            classes: 'table-cursor-pointer',
            dataField: "",
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "Comment" }),
            formatter: (value, row, k) => {
                return (
                    <span >
                        <Input type="text"
                            id={`Comment${k}`}
                            key={`Comment${row.id}`}

                            defaultValue={row.Comment}
                            autoComplete="off"
                            onChange={(e) => { row["Comment"] = e.target.value }}
                        />
                    </span>
                )
            },

            headerStyle: () => {
                return { width: '9%', textAlign: 'center' };
            }
        },
    ];

    const defaultSorted = [
        {
            dataField: "ItemName", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    function supplierOnchange(e) {

        setSupplierSelect(e);
        if (subPageMode === url.ORDER_4) {
            dispatch(_act.getSupplierAddress(e.value))
            let Date = currentDate_ymd
            if ((e.FSSAIExipry === "") || (e.FSSAIExipry === null)) {
                setFSSAI_Date_Is_Expired("There is No FSSAI Expiry Date Please Insert FSSAI Date!")
            }
            else if (e.FSSAIExipry < Date) {
                setFSSAI_Date_Is_Expired("FSSAI Expired")
            } else {
                setFSSAI_Date_Is_Expired("")
            }
        }
        setOrderItemTable([])
        setItemSelect('')
        goButtonHandler(e.value)
    };

    function itemSelectOnchange(e) {
        setItemSelect(e)
    };

    function Open_Assign_func() {
        setisOpen_assignLink(false)
        dispatch(_act.editPartyItemIDSuccess({ Status: false }));
        _cfunc.breadcrumbReturnFunc({ dispatch, userAcc: userPageAccessState })
        goButtonHandler()
    };

    function RouteOnChange(event) {
        setSupplierSelect('')
        dispatch(_act.GetVenderSupplierCustomer({ subPageMode, RouteID: event.value, "PartyID": commonPartyDropSelect.value }))
        setRouteSelect(event)
    }

    async function assignItem_onClick(event) {
        event.stopPropagation();
        const isParty = subPageMode === url.ORDER_1 ? supplierSelect.value : commonPartyDropSelect.value
        const config = {
            editId: isParty,
            Party: isParty,
            btnmode: mode.assingLink,
            subPageMode,
            btnId: `btn-assingLink-${supplierSelect.value}`
        }

        const isConfirmed = await customAlert({
            Type: 7,
            Message: alertMessages.doYouConfirmChoice,
        });

        if (isConfirmed) {

            const jsonBody = JSON.stringify({ ..._cfunc.loginJsonBody(), ...{ PartyID: isParty } });

            dispatch(editPartyItemID({ jsonBody, config }))
            dispatch(_act.GoButton_For_Order_AddSuccess([]))
        };
    };

    function itemWise_CalculationFunc(row, IsComparGstIn, tableList = []) {

        const calculate = orderCalculateFunc(row) //order calculation function 
        row["Amount"] = calculate.roundedTotalAmount
        const sumOfAmount = tableList.reduce((accumulator, currentObject) => accumulator + (Number(currentObject["Amount"]) || 0), 0);

        const commaSeparateAmount = _cfunc.amountCommaSeparateFunc(sumOfAmount)
        dispatch(_act.BreadcrumbShowCountlabel(`Count:${tableList.length} ₹ ${commaSeparateAmount}`))
    };

    const item_AddButtonHandler = () => {

        setGoBtnDissable(true)

        let isfound = orderItemTable.find(i => i.value === itemSelect.value);

        if (!itemSelect) {
            customAlert({ Type: 4, Message: `Select Item Name` })
        }
        else if (isfound === undefined) {
            setOrderItemTable([itemSelect].concat(orderItemTable))
        }
        else {
            customAlert({ Type: 3, Message: "This Item Already Exist" })
        }
        setItemSelect('')
    }

    const goButtonHandler = async (selectSupplier) => {

        if (!supplierSelect > 0 && !selectSupplier) {
            await customAlert({
                Type: 4,
                Message: `Please Select ${fieldLabel.Supplier}`
            })
            return;
        }
        let btnId = `go-btn${subPageMode}`
        _cfunc.btnIsDissablefunc({ btnId, state: true })

        dispatch(_act.BreadcrumbShowCountlabel(initial_BredcrumbMsg))


        let PO_Body = {
            Party: selectSupplier ? selectSupplier : supplierSelect.value,
            Customer: commonPartyDropSelect.value,
            RateParty: commonPartyDropSelect.value,
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id,
            OrderType: order_Type.PurchaseOrder,
        }
        let SO_body = {
            Party: commonPartyDropSelect.value, //swap  party and customer for sale oerder
            Customer: selectSupplier ? selectSupplier : supplierSelect.value,//swap  party and customer for sale oerder
            RateParty: selectSupplier ? selectSupplier : supplierSelect.value,
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id,
            OrderType: order_Type.SaleOrder,
        }


        let jsonBody;   //json body decleration 
        if (subPageMode === url.ORDER_4) {
            jsonBody = JSON.stringify({ ...SO_body, });
        }
        else {
            jsonBody = JSON.stringify({ ...PO_Body, });
        }
        let config = { subPageMode, jsonBody, btnId }
        dispatch(_act.GoButton_For_Order_Add(config))
    };

    // Function to handle the form submission
    const saveHandler = async (event) => {
        event.preventDefault();

        // Extract the ID from the target element
        const buttonId = event.target.id;
        const gotoInvoiceMode = buttonId.substring(0, 14) === "gotoInvoiceBtn";

        try {
            // Get the division from the loginPartyID function
            const division = commonPartyDropSelect.value;
            const supplier = supplierSelect.value;

            const validationMessages = []; // Stores validation messages for items
            const orderItems = []; // Stores processed order items
            const vdcPoValidationMessages = []; // Stores VDC-PO validation messages
            let sumOfOrderAmount = 0;//total grand total amount

            // Loop through the order items
            await orderItemTable.forEach(item => {

                // Check for item quantity and rate validity
                if ((item.Quantity > 0) && !(item.Rate > 0)) {
                    validationMessages.push({ [item.ItemName]: "This Item Rate Is Required..." });
                }
                else if (pageMode === mode.edit) {
                    // Check if the item quantity or unit has changed in edit mode
                    const isChange = (
                        !(Number(item.edit_Qty) === Number(item.Quantity))
                        || !(item.edit_Unit_id === item.Unit_id)
                        || !(Number(item.edit_Discount) === Number(item.Discount))
                        || !(Number(item.edit_DiscountType) === Number(item.DiscountType))
                    );

                    let isEdit = 0;
                    if (isChange && !(item.edit_Qty === 0)) {
                        isEdit = 1;
                    }
                    processOrderItem({ item, isEdit });
                }
                else {
                    const isEdit = 0;
                    processOrderItem({ item, isEdit });
                }
                sumOfOrderAmount = (Number(sumOfOrderAmount) + Number(item["Amount"])).toFixed(2) //total grand total amount

            });

            // Function to handle order items
            function processOrderItem({ item, isEdit }) {

                // Handle quantity for null or undefined values
                item.Quantity = !Number(item.Quantity) ? 0 : item.Quantity;

                // Check various conditions for item processing
                if ((item.Quantity > 0) && (item.Rate > 0) && !(orderTypeSelect.value === 3)) {
                    // Item is not deleted and has value changes
                    processValueChanged({ item, isEdit, isDelete: false });
                }
                else if (!(item.Quantity < 0) && (item.editrowId) && !(orderTypeSelect.value === 3)) {
                    // Item is deleted (set quantity to 0) and has value changes
                    processValueChanged({ item, isEdit, isDelete: true });
                }
                else if (!(item.Quantity < 0) && !(item.editrowId) && !(orderTypeSelect.value === 3)) {
                    // Item is not deleted and has no value changes, skip
                    return;
                }
                else if ((item.Quantity > 0) && (item.Rate > 0)) { // Logic for VDC-PO
                    if (item.Bom) {
                        if ((orderItems.length === 0)) {
                            // First VDC-PO item, not deleted and has value changes
                            processValueChanged({ item, isEdit, isDelete: false });
                        } else {
                            if (vdcPoValidationMessages.length === 0) {
                                vdcPoValidationMessages.push({ ["VDC-PO Type"]: "This Type Of Order Only One Item Quantity Accept..." });
                            }
                        }
                    } else {
                        vdcPoValidationMessages.push({ [item.ItemName]: "This Is Not VDC-PO Item..." });
                    }
                }
                else if ((item.Quantity < 1) && (item.editrowId)) {
                    if (item.Bom) {
                        if ((orderItems.length === 0)) {
                            // First VDC-PO item, deleted and has value changes
                            processValueChanged({ item, isEdit, isDelete: true });
                        } else {
                            if (vdcPoValidationMessages.length === 0) {
                                vdcPoValidationMessages.push({ ["VDC-PO Type"]: "This Type of order Only One Item Quantity Accept..." });
                            }
                        }
                    } else {
                        vdcPoValidationMessages.push({ [item.ItemName]: "This Is Not VDC-PO Item..." });
                    }
                }
            }

            // Function to handle value changes in order items
            function processValueChanged({ item, isEdit, isDelete }) {

                const calculated = orderCalculateFunc(item, { GSTIn_1: supplierSelect.GSTIN, GSTIn_2: _cfunc.loginUserGSTIN() });

                // Create an object for the order item
                const orderItem = {
                    Item: item.Item_id,
                    Quantity: isDelete ? 0 : item.Quantity,
                    MRP: item.MRP_id,
                    MRPValue: item.MRPValue,
                    Rate: item.Rate,
                    Unit: item.Unit_id,
                    BaseUnitQuantity: (Number(item.BaseUnitQuantity) * Number(item.Quantity)).toFixed(2),
                    Margin: "",
                    GST: item.GST_id,
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
                    DiscountType: item.DiscountType,
                    Discount: Number(item.Discount) || 0,
                    DiscountAmount: Number(calculated.disCountAmt).toFixed(2),
                    IsDeleted: isEdit, // Set to 1 if item is edited, otherwise 0 for delete
                    Comment: item.Comment
                };

                orderItems.push(orderItem);
            }

            // Get terms and conditions
            const termsAndConditions = await termsAndConTable.map(item => ({
                TermsAndCondition: item.value,
                IsDeleted: item.IsDeleted
            }));


            // Check for any validation errors
            if (vdcPoValidationMessages.length > 0) {
                customAlert({
                    Type: 4,
                    Message: vdcPoValidationMessages,
                });
                return;
            }
            if (validationMessages.length > 0) {
                customAlert({
                    Type: 4,
                    Message: validationMessages,
                });
                return;
            }
            if (orderItems.length === 0) {
                customAlert({
                    Type: 4,
                    Message: "Please Select 1 Item Quantity",
                });
                return;
            }
            if (orderTypeSelect.length === 0) {
                customAlert({
                    Type: 4,
                    Message: "Please Select PO Type",
                });
                return;
            }
            if ((termsAndConditions.length === 0) && !(subPageMode === url.ORDER_2)
                && !(subPageMode === url.ORDER_4) && !(subPageMode === url.IB_ORDER)
            ) {
                customAlert({
                    Type: 4,
                    Message: "Please Enter One Terms And Condition",
                });
                return;
            }

            const po_JsonBody = {
                Customer: division,
                Supplier: supplier,
                OrderType: order_Type.PurchaseOrder,
                IsConfirm: false  // PO Order then IsConfirm true
            }
            const SO_JsonBody = {
                Customer: supplier,// swipe supllier 
                Supplier: division,// swipe Customer
                OrderType: order_Type.SaleOrder,
                IsConfirm: true   // SO Order then IsConfirm true
            }
            const IB_JsonBody = {
                DemandDate: orderdate,
                DemandAmount: sumOfOrderAmount,
                DemandItem: orderItems,
                Customer: division,
                Supplier: supplier,
                OrderType: order_Type.PurchaseOrder,
            }
            const comm_jsonBody = {
                OrderDate: deliverydate,// order Date as a delivery date 
                DeliveryDate: deliverydate,
                OrderAmount: sumOfOrderAmount,
                OrderItem: orderItems,

                Description: description,
                BillingAddress: billAddr.value,
                ShippingAddress: shippAddr.value,
                OrderNo: 1,
                FullOrderNumber: "PO0001",
                Division: division,
                POType: orderTypeSelect.value,
                POFromDate: orderTypeSelect.value === 1 ? currentDate_ymd : poFromDate,
                POToDate: orderTypeSelect.value === 1 ? currentDate_ymd : poToDate,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
                OrderTermsAndConditions: termsAndConditions
            };


            let jsonBody;   //json body decleration 
            if (subPageMode === url.IB_ORDER) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...IB_JsonBody });
            }
            else if (subPageMode === url.ORDER_4) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...SO_JsonBody });
            }
            else {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...po_JsonBody });
            }
            // +*********************************

            if (pageMode === mode.edit) {
                dispatch(_act.updateOrderIdAction({ jsonBody, updateId: editVal.id, gotoInvoiceMode }))

            } else {

                dispatch(_act.saveOrderAction({ jsonBody, subPageMode, gotoInvoiceMode }))
            }
        } catch (error) {
            _cfunc.CommonConsole("order_save_", error);
        }
    };


    if (!(userPageAccessState === "")) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
                <PageLoadingSpinner isLoading={!pageField} />
                <div>
                    {invoiceGoBtnloading && <div className="c_spinner-container">
                        <div className="d-flex">
                            <div className="">
                                <span className="font-size-18 color-primary">Please Wait...</span>
                            </div>
                            <DashboardLoader />
                        </div>

                    </div>}

                    <div className="page-content">

                        <div>
                            <div className="px-2 c_card_filter header text-black" >{/* Order Date And Supplier Name,Go_Button*/}

                                <div>
                                    <Row >
                                        <Col sm="4" >
                                            <FormGroup className=" row mt-2" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "115px" }}>Delivery Date</Label>
                                                <Col sm="7">
                                                    <C_DatePicker
                                                        options={{
                                                            altInput: true,
                                                            altFormat: "d-m-Y",
                                                            dateFormat: "Y-m-d",
                                                            minDate: "today",
                                                        }}
                                                        name="deliverydate"
                                                        value={deliverydate}
                                                        disabled={(orderItemTable.length > 0 || pageMode === "edit") ? true : false}
                                                        onChange={(e, date) => { setdeliverydate(date) }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        {(subPageMode === ORDER_4) ?
                                            <Col sm="3">
                                                <FormGroup className=" row mt-2 " >
                                                    <Label className="col-sm-5 p-2"
                                                        style={{ width: "65px" }}>{fieldLabel.Route}</Label>
                                                    <Col sm="7">

                                                        <C_Select
                                                            classNamePrefix="react-select"
                                                            value={routeSelect}
                                                            options={RouteOptions}
                                                            isDisabled={(orderItemTable.length > 0 || pageMode === "edit" || goBtnloading) ? true : false}
                                                            // onChange={(e) => { setRouteSelect(e) }}
                                                            onChange={(e) => { RouteOnChange(e) }}
                                                            isLoading={routesDropLoading}
                                                            styles={{
                                                                menu: provided => ({ ...provided, zIndex: 2 })
                                                            }}
                                                        />

                                                    </Col>
                                                </FormGroup>
                                            </Col >
                                            : <Col sm='3' />
                                        }

                                        <Col sm="4" className="">
                                            <FormGroup className="row mt-2" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "115px" }}>{fieldLabel.Supplier}</Label>
                                                <Col sm="7">
                                                    <C_Select
                                                        value={supplierSelect}
                                                        isDisabled={(orderItemTable.length > 0 || pageMode === "edit" || goBtnloading) ? true : false}
                                                        options={supplierOptions}
                                                        onChange={supplierOnchange}
                                                        isLoading={supplierDropLoading}
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />
                                                    {(FSSAI_Date_Is_Expired) &&
                                                        <span className="text-danger f-8">
                                                            <small>{FSSAI_Date_Is_Expired} </small>
                                                        </span>
                                                    }
                                                </Col>

                                            </FormGroup>
                                        </Col>

                                        <Col sm="1">                      {/*Go_Button  */}

                                            <div className="row mt-2  pr-1">
                                                {pageMode === mode.defaultsave ?
                                                    // (!selecedItemWiseOrder && itemSelectDropOptions.length > 0) ?
                                                    (!goBtnDissable) ?

                                                        < Go_Button
                                                            loading={goBtnloading}
                                                            id={`go-btn${subPageMode}`}
                                                            onClick={(e) => {
                                                                if (commonPartyDropSelect.value === 0) {
                                                                    customAlert({
                                                                        Type: 4,
                                                                        Message: "Select Party",
                                                                    });
                                                                    return;
                                                                }
                                                                if (supplierSelect === '') {
                                                                    customAlert({
                                                                        Type: 4,
                                                                        Message: `Please Select ${fieldLabel.Supplier}`
                                                                    })
                                                                    return;
                                                                }
                                                                setSelecedItemWiseOrder(false)
                                                                setOrderItemTable(itemSelectDropOptions)
                                                                setItemSelect({ value: '', label: "All" })
                                                                setGoBtnDissable(true)
                                                            }} />
                                                        : (!selecedItemWiseOrder) &&
                                                        <Change_Button
                                                            id={`change-btn${subPageMode}`}
                                                            onClick={(e) => {
                                                                setSupplierSelect('')
                                                                setGoBtnDissable(false)
                                                                setSelecedItemWiseOrder(true)
                                                                setOrderItemTable([])
                                                                setItemSelect({ value: '', label: "All" })
                                                                dispatch(_act.GoButton_For_Order_AddSuccess([]))
                                                            }}
                                                        />
                                                    : null
                                                }
                                            </div>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col sm="4">                               {/*  Description field */}
                                            <FormGroup className="row mt-1" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "115px" }}>Description</Label>
                                                <div className="col-7">
                                                    <Input type="text"
                                                        value={description}
                                                        placeholder='Enter Order Description'
                                                        onChange={e => setDescription(e.target.value)}
                                                    />

                                                </div>

                                            </FormGroup>
                                        </Col >
                                        <Col sm="3" />
                                        <Col sm="4">
                                            <FormGroup className="row mt-1" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "115px" }}>{fieldLabel.Item}</Label>

                                                <Col sm="7">
                                                    <C_Select
                                                        value={itemSelect}
                                                        isDisabled={(pageMode === "edit" || goBtnloading) ? true : false}
                                                        options={itemSelectDropOptions}
                                                        isLoading={goBtnloading}
                                                        onChange={itemSelectOnchange}
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />
                                                </Col>

                                            </FormGroup>
                                        </Col>
                                        <Col sm="1"  >

                                            {pageMode === mode.defaultsave ?
                                                <div className="row mt-2 pr-1"  >
                                                    {(selecedItemWiseOrder && itemSelectDropOptions.length > 0) ?
                                                        <C_Button
                                                            className="btn btn-outline-info border-1 font-size-12 "
                                                            disabled={goBtnloading}
                                                            onClick={() => item_AddButtonHandler()} >
                                                            Add Item
                                                        </C_Button>
                                                        :
                                                        ((itemSelectDropOptions.length > 0)) &&
                                                        <Button
                                                            color="btn btn-secondary border-1 font-size-12"
                                                            className='text-blac1k'
                                                            disabled={goBtnloading}
                                                            onClick={() => {
                                                                setSupplierSelect('')
                                                                setGoBtnDissable(false)
                                                                setSelecedItemWiseOrder(true)
                                                                setOrderItemTable([])
                                                                setItemSelect('')
                                                                dispatch(_act.GoButton_For_Order_AddSuccess([]))
                                                            }} >
                                                            Item Wise
                                                        </Button>

                                                    }

                                                </div> : null
                                            }
                                        </Col>

                                    </Row>
                                </div>

                            </div>

                            <div className="px-2  mb-1 c_card_body text-black" >              {/*  Description and Delivery Date  field */}

                                {subPageMode === url.ORDER_1 ? <div>                             {/*  Billing Address   and Shipping Address*/}
                                    <div className="row mt-2 ">

                                        <div className="col col-6">                             {/* Billing Address */}
                                            <FormGroup className="row  " >
                                                <Label className=" p-2"
                                                    style={{ width: "115px" }}>Billing Address</Label>
                                                <div className="col col-6">
                                                    <C_Select
                                                        value={billAddr}
                                                        classNamePrefix="select2-Customer"
                                                        options={supplierAddress}
                                                        onChange={(e) => { setbillAddr(e) }}
                                                        isLoading={supplierADDdropLoading}
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />
                                                </div>
                                            </FormGroup>
                                        </div >

                                        <div className="col col-6">                               {/*  Billing Shipping Address */}
                                            <FormGroup className=" row " >
                                                <Label className=" p-2"
                                                    style={{ width: "130px" }}>Shipping Address</Label>
                                                <div className="col col-6">
                                                    <Select
                                                        value={shippAddr}
                                                        classNamePrefix="select2-Customer"
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                        isLoading={supplierADDdropLoading}
                                                        options={supplierAddress}
                                                        onChange={(e) => { setshippAddr(e) }}
                                                    />
                                                </div>
                                            </FormGroup>
                                        </div >
                                    </div>

                                    <div className="row" >                                        {/**PO Type  (PO From Date and PO To Date)*/}
                                        <div className="col col-6" >                              {/**PO Type */}
                                            <FormGroup className=" row  " >
                                                <Label className=" p-2"
                                                    style={{ width: "115px" }}>PO Type</Label>
                                                <div className="col col-6 ">
                                                    <Select
                                                        value={orderTypeSelect}
                                                        classNamePrefix="select2-Customer"
                                                        options={orderTypeOptions}
                                                        onChange={(e) => { setorderTypeSelect(e) }}
                                                        isLoading={orderTypeDropLoading}
                                                        styles={{
                                                            menu: provided => ({ ...provided, zIndex: 2 })
                                                        }}
                                                    />
                                                </div>
                                            </FormGroup>
                                        </div >
                                    </div>


                                    {(orderTypeSelect.label === 'Open PO') ?
                                        <div className="row" >                                    {/*PO From Date */}
                                            <div className="col col-6" >
                                                <FormGroup className=" row " >
                                                    <Label className=" p-2"
                                                        style={{ width: "115px" }}>PO From Date</Label>
                                                    <div className="col col-6 ">
                                                        <C_DatePicker
                                                            id="pofromdate"
                                                            name="pofromdate"
                                                            value={poFromDate}
                                                            onChange={(e, date) => { setpoFromDate(date) }}
                                                        />
                                                    </div>
                                                </FormGroup>
                                            </div >

                                            <div className="col col-6" >                        {/*PO To Date */}
                                                <FormGroup className=" row  " >
                                                    <Label className=" p-2"
                                                        style={{ width: "130px" }}>PO To Date</Label>
                                                    <div className="col col-6 ">
                                                        <C_DatePicker
                                                            id="potodate"
                                                            name="potodate"
                                                            value={poToDate}
                                                            onChange={(e, date) => { setpoToDate(date) }}
                                                        />
                                                    </div>
                                                </FormGroup>
                                            </div >
                                        </div> : null}
                                </div>
                                    : null}

                            </div>

                        </div>


                        <ToolkitProvider
                            keyField={"Item_id"}
                            data={orderItemTable}
                            columns={pagesListColumns}
                            search
                        >
                            {(toolkitProps,) => (
                                <React.Fragment>

                                    <BootstrapTable
                                        keyField={"Item_id"}
                                        id="table_Arrow"
                                        defaultSorted={!selecedItemWiseOrder ? defaultSorted : ''}
                                        classes='custom-table'
                                        noDataIndication={
                                            <div className="text-danger text-center table-cursor-pointer">
                                                Items Not available
                                            </div>
                                        }
                                        onDataSizeChange={(e) => {
                                            _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
                                        }}
                                        {...toolkitProps.baseProps}
                                    />
                                    {mySearchProps(toolkitProps.searchProps)}


                                </React.Fragment>
                            )}
                        </ToolkitProvider>

                        <OrderPageTermsTable tableList={termsAndConTable} setfunc={setTermsAndConTable} privious={editVal.TermsAndConditions} tableData={orderItemTable} />

                        {
                            ((orderItemTable.length > 0) && (!isOpen_assignLink)) ? <div className="row save1" style={{ paddingBottom: 'center' }}>
                                <Col>
                                    <SaveButton
                                        loading={saveBtnloading}
                                        editCreatedBy={editCreatedBy}
                                        pageMode={pageMode}
                                        userAcc={userPageAccessState}
                                        onClick={saveHandler}
                                        forceDisabled={gotoInvoiceBtnLoading}
                                    />
                                </Col>
                                {
                                    (subPageMode === url.ORDER_4) && (pageMode === mode.defaultsave) ?
                                        <Col>
                                            <GotoInvoiceBtn
                                                forceDisabled={gotoInvoiceBtnLoading}
                                                loading={gotoInvoiceBtnLoading}
                                                pageMode={pageMode}
                                                userAcc={userPageAccessState}
                                                onClick={saveHandler}
                                            />
                                        </Col> : null}
                            </div>
                                : <div className="row save1"></div>
                        }
                    </div >
                </div>
                <Modal
                    isOpen={isOpen_assignLink}
                    toggle={() => {
                        setisOpen_assignLink(false)
                    }}
                    size="xl"
                >

                    <PartyItems
                        editValue={assingItemData.Data}
                        isAssing={true}
                        masterPath={url.PARTYITEM}
                        redirectPath={subPageMode}
                        isOpenModal={Open_Assign_func}
                        pageMode={mode.assingLink}
                    />

                </Modal>

            </React.Fragment >
        )
    } else {
        return null
    }

}

export default Order
