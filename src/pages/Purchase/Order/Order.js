import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MetaTags } from "react-meta-tags"
import { useHistory } from "react-router-dom";
import {
    Alert,
    Button,
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
    Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Franchies_Order_Calculate_Func, orderCalculateFunc } from "./OrderPageCalulation";
import { SaveButton, Go_Button, Change_Button, GotoInvoiceBtn, PageLoadingSpinner, DashboardLoader, C_Button } from "../../../components/Common/CommonButton";
import { globalTableSearchProps } from "../../../components/Common/SearchBox/MySearch";

import OrderPageTermsTable from "./OrderPageTermsTable";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import PartyItems from "../../Adminisrator/PartyItemPage/PartyItems";

import { customAlert } from "../../../CustomAlert/ConfirmDialog"
import { order_Type } from "../../../components/Common/C-Varialbes";
import { CInput, C_DatePicker, C_Select, decimalRegx, onlyNumberRegx, decimalRegx_3dit, C_ItemSelect, C_TimePicker } from "../../../CustomValidateForm/index";

import * as _act from "../../../store/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import { editPartyItemID } from "../../../store/Administrator/PartyItemsRedux/action";
import { getPartyListAPI, getPartyListAPISuccess } from "../../../store/Administrator/PartyRedux/action";
import { pageFieldUseEffect, table_ArrowUseEffect, updateMsgUseEffect, userAccessUseEffect } from "../../../components/Common/CommonUseEffect";
import { orderApprovalFunc, orderApprovalMessage } from "./orderApproval";
import { GetRoutesList, GetRoutesListSuccess } from "../../../store/Administrator/RoutesRedux/actions";
import { ORDER_4 } from "../../../routes/route_url";
import "../../../GlobalCustomTable/GlobalCustomTable.scss"
import "./order.scss"
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { changeCommonPartyDropDetailsAction } from "../../../store/Utilites/PartyDrodown/action";
import SaveButtonDraggable from "../../../components/Common/saveButtonDraggable";
import { allLabelWithBlank } from "../../../components/Common/CommonErrorMsg/HarderCodeData";
import { Group_Subgroup_func, GroupSubgroupDisplay, ModifyTableData_func } from "../../../components/Common/TableCommonFunc";
import AddMaster from "../../Adminisrator/EmployeePages/Drodown";
import PartyMaster from "../../Adminisrator/PartyMaster/MasterAdd/PartyIndex";
import paginationFactory from "react-bootstrap-table2-paginator";



let editVal = {}
let initial_BredcrumbMsg = `Count:0 currency_symbol 0.00 weight 0.00 kg`
function initialState(history) {

    let page_Id = '';
    let listPath = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.ORDER_1) {
        page_Id = pageId.ORDER_1;
        listPath = url.ORDER_LIST_1
    }
    else if ((sub_Mode === url.ORDER_2) || _cfunc.IsAuthorisedURL({ subPageMode: sub_Mode, URL: url.ORDER_2 })) {
        page_Id = pageId.ORDER_2;
        listPath = url.ORDER_LIST_2
    }
    else if (sub_Mode === url.IB_ORDER) {
        page_Id = pageId.IB_ORDER;
        listPath = url.IB_ORDER_PO_LIST;
    }
    else if ((sub_Mode === url.ORDER_4)) {
        page_Id = pageId.ORDER_4;
        listPath = url.ORDER_LIST_4
    } else if (sub_Mode === url.IB_SALES_ORDER) {
        page_Id = pageId.IB_SALES_ORDER;
        listPath = url.IB_ORDER_SO_LIST
    }
    else if (sub_Mode === url.ORDER_QUATATION) {
        page_Id = pageId.ORDER_QUATATION;
        listPath = url.ORDER_QUATATION_LIST
    }
    return { page_Id, listPath }
};


const Order = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const IsFranchisesRole = _cfunc.loginUserIsFranchisesRole()
    const isSweetAndSnacksCompany = _cfunc.IsSweetAndSnacksCompany()
    const isVisibleRateDrop = _cfunc.checkRateDropVisibility()

    const advanceAmountRef = useRef(0);
    const discountTypeAllRef = useRef(null);
    const discountAllValueRef = useRef(null);
    const discountRefs = useRef({});



    const descriptionRef = useRef("");
    const ordersNotSave = _cfunc.loginSystemSetting().OrdersnotSave

    const currentDate_ymd = IsFranchisesRole ? _cfunc.Frenchies_date_ymd_func() : _cfunc.date_ymd_func();
    const CurrentOrderDate = _cfunc.date_ymd_func()
    const Weight = _cfunc.loginUserDetails().Weight
    const CurrentTime = _cfunc.CurrentTime()   ///03:32:15 PM

    const initialSubPageMode = useMemo(() => {
        if (_cfunc.IsAuthorisedURL({ subPageMode: history.location.pathname, URL: url.ORDER_2 })) {
            return url.ORDER_2;
        }
        return history.location.pathname;
    }, []);

    const fileds = {
        id: "",
        Supplier: "",
        Route: "",
        Item: '',
        AdvanceAmount: 0,
        Description: "",
        OrderAmount: "0.00",
        Total_weigtage: "0.00",
    }

    const allowedRoles = _cfunc.loginSystemSetting()?.IsShowRouteDropdwon?.split(",") || [];







    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [editCreatedBy, seteditCreatedBy] = useState("");
    const [page_id] = useState(() => initialState(history).page_Id)
    const [listPath] = useState(() => initialState(history).listPath)
    const [subPageMode] = useState(initialSubPageMode)

    const [modalCss, setModalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [description, setDescription] = useState('')

    // const [processedData, setprocessedData] = useState([])




    const [deliverydate, setdeliverydate] = useState(IsFranchisesRole ? _cfunc.deliverydate_ForFranchise() : currentDate_ymd)

    const [billAddr, setbillAddr] = useState('')
    const [shippAddr, setshippAddr] = useState('');

    const [poFromDate, setpoFromDate] = useState(currentDate_ymd);
    const [poToDate, setpoToDate] = useState(currentDate_ymd);
    const [orderdate, setorderdate] = useState(currentDate_ymd);

    const [supplierSelect, setSupplierSelect] = useState('');
    const [routeSelect, setRouteSelect] = useState(allLabelWithBlank);
    const [itemSelect, setItemSelect] = useState("");
    const [itemSelectDropOptions, setitemSelectOptions] = useState([]);

    const [selecedItemWiseOrder, setSelecedItemWiseOrder] = useState(true)


    const [newRowId, setNewRowId] = useState(null);

    const [termsAndConTable, setTermsAndConTable] = useState([]);
    const [orderTypeSelect, setorderTypeSelect] = useState([]);
    const [isOpen_assignLink, setisOpen_assignLink] = useState(false)
    const [orderItemTable, setOrderItemTable] = useState([])

    const [findPartyItemAccess, setFindPartyItemAccess] = useState(false)
    const [FSSAI_Date_Is_Expired, setFSSAI_Date_Is_Expired] = useState("")
    const [FrenchiesesCustomerMasterAccess, setFrenchiesesCustomerMasterAccess] = useState(false);


    // for Order page heder dicount functionality useSate ************************************
    // const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    // const [changeAllDiscount, setChangeAllDiscount] = useState(false)

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
        commonPartyDropSelect,
        partyItemListLoading,
        PartyItemPostMsg,
        CustomerSave
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
        CustomerSave: state.PartyMasterReducer.postMsg,


        partyItemListLoading: state.PartyItemsReducer.partyItemListLoading,
        PartyItemPostMsg: state.PartyItemsReducer.postMsg,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));;

    const { fieldLabel } = state;

    const location = { ...history.location }

    const orderFromMaterialIssue = location?.editValue?.OrderFromMaterialIssue

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
        } else if (ind.id === pageId.FRANCHISE_CUSTOMER_MASTER && subPageMode === url.ORDER_4) {
            setFrenchiesesCustomerMasterAccess(true)

        }
    };



    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(18, 0, 0, 0); // 18:00 is 6 PM
    let delay = targetTime - now; // Calculate the time difference in milliseconds

    if (delay < 0) {
        delay += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }
    setTimeout(() => {
        myFunction();
    }, delay);

    const myFunction = () => {
        if (IsFranchisesRole) {
            setdeliverydate(_cfunc.Frenchies_date_ymd_func())
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
        // setItemSelect(allLabelWithBlank);
        setRouteSelect(allLabelWithBlank);
        setSupplierSelect('')
        return () => {
            dispatch(getPartyListAPISuccess([]));
            dispatch(GetRoutesListSuccess([]));
            dispatch(_act.GetVenderSupplierCustomerSuccess([]));

            setSelecedItemWiseOrder(true)
            setOrderItemTable([])
            dispatch(_act.GoButton_For_Order_AddSuccess(null))
        }

    }, [commonPartyDropSelect]);


    // useEffect(() => {

    //     setprocessedData(ModifyTableData_func(orderItemTable));
    // }, [orderItemTable])

    // const processedData = useMemo(() => ModifyTableData_func(orderItemTable), [orderItemTable]);

    const processedData = useMemo(() => {
        console.log("itemSelect", itemSelect)
        debugger
        if (itemSelect?.value === "") {
            return ModifyTableData_func(orderItemTable);
        } else {
            return orderItemTable;
        }
    }, [itemSelect, orderItemTable]);

    useEffect(() => { // hasEditVal useEffect

        if ((hasShowloction || hasShowModal)) {

            let hasEditVal = null
            if (hasShowloction) {
                if (orderFromMaterialIssue) {
                    setPageMode(mode.defaultsave)
                } else {
                    setPageMode(location.pageMode)
                }
                hasEditVal = location.editValue
            }
            else if (hasShowModal) {
                hasEditVal = props.editValue
                if (orderFromMaterialIssue) {
                    setPageMode(mode.defaultsave)
                } else {
                    setPageMode(props.pageMode)

                }
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
                setdeliverydate(_cfunc.getDateTime_ymd(hasEditVal.OrderDate))
                setshippAddr({ label: hasEditVal.ShippingAddress, value: hasEditVal.ShippingAddressID })
                setbillAddr({ label: hasEditVal.BillingAddress, value: hasEditVal.BillingAddressID });
                setDescription(hasEditVal.Description)


                editVal = {}
                editVal = hasEditVal
                // setOrderAmount(hasEditVal.OrderAmount)
                setorderTypeSelect({ value: hasEditVal.POType, label: hasEditVal.POTypeName })


                // setpoToDate(hasEditVal.POToDate)
                // setpoFromDate(hasEditVal.POFromDate)

                const { TermsAndConditions = [] } = hasEditVal;
                const termsAndCondition = TermsAndConditions.map(i => ({
                    value: i.id,
                    label: i.TermsAndCondition,
                    IsDeleted: 0
                }))



                let Total_weigtage = 0
                // let orderItems = hasEditVal.OrderItems.map((ele, k) => {

                //     const weightage = (Number(ele["Weightage"])) || 0.00;
                //     const row_weightage = (Number(ele.Quantity) * Number(ele.BaseUnitQuantity)) / Number(weightage)
                //     if (!isNaN(row_weightage) && row_weightage !== null) {
                //         Total_weigtage += row_weightage;
                //     }

                //     ele["id"] = k + 1
                //     return ele
                // });



                let orderItems = hasEditVal.OrderItems.map((ele, k) => {
                    // Calculate weightage and total weightage
                    const weightage = Number(ele["Weightage"]) || 0.00;
                    const row_weightage = (Number(ele.Quantity) * Number(ele.BaseUnitQuantity)) / weightage;
                    if (!isNaN(row_weightage) && row_weightage !== null && isFinite(row_weightage)) {
                        Total_weigtage += row_weightage;
                    }
                    // Add id, value, and label properties
                    return {
                        ...ele,
                        id: k + 1,
                        value: ele.Item_id,
                        label: ele.ItemName
                    };
                });

                setitemSelectOptions(orderItems)


                if (orderFromMaterialIssue) {
                    orderItems = orderItems
                        .filter(item => hasEditVal?.Item_Id.includes(item.Item_id));
                    setpoToDate(currentDate_ymd)
                    setpoFromDate(currentDate_ymd)
                } else {
                    orderItems = orderItems.filter((i) => i.Quantity)
                    setpoToDate(hasEditVal.POToDate)
                    setpoFromDate(hasEditVal.POFromDate)
                }



                const commaSeparateAmount = _cfunc.amountCommaSeparateFunc(Number(hasEditVal.OrderAmount).toFixed(2));

                setState(i => {

                    const state = { ...i }
                    state.values.AdvanceAmount = hasEditVal.AdvanceAmount
                    state.values.Description = hasEditVal.Description

                    state.values.OrderAmount = commaSeparateAmount
                    state.values.Total_weigtage = Total_weigtage

                    return state
                })

                setOrderItemTable(orderItems)
                setTermsAndConTable(termsAndCondition)




                dispatch(_act.BreadcrumbShowCountlabel(`Count:${orderItems.length} currency_symbol ${commaSeparateAmount} weight ${(Total_weigtage).toFixed(2)} kg`))


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

    useEffect(() => {
        if ((CustomerSave.Status === true) && (CustomerSave.StatusCode === 200)) {
            dispatch(_act.GetVenderSupplierCustomer({ subPageMode, RouteID: "", "PartyID": commonPartyDropSelect.value }));

        }
    }, [CustomerSave])


    useEffect(() => {
        if ((PartyItemPostMsg.Status === true) && (PartyItemPostMsg.StatusCode === 200)) {
            dispatch(_act.GoButton_For_Order_AddSuccess(null))
        }
    }, [PartyItemPostMsg])


    useEffect(async () => {
        if ((postMsg.Status === true) && (postMsg.StatusCode === 200)) {
            dispatch(_act.saveOrderActionSuccess({ Status: false }))
            setSelecedItemWiseOrder(true)

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


                dispatch(_act.GoButton_For_Order_AddSuccess(null))
                if ((subPageMode === url.ORDER_4) && (postMsg.gotoInvoiceMode)) {

                    // const customer = supplierSelect
                    const customer = {
                        ...supplierSelect, // Spread existing customer fields
                        OrderID: postMsg.TransactionID, // Add OrderID
                        AdvanceAmount: advanceAmountRef.current.value ? advanceAmountRef.current.value : 0, // Add AdvanceAmount
                    };
                    const jsonBody = JSON.stringify({
                        OrderIDs: postMsg.OrderID.toString(),
                        FromDate: orderdate,
                        Customer: supplierSelect.value,
                        Party: commonPartyDropSelect.value,
                        IsRateWise: isVisibleRateDrop ? 2 : 1
                    });
                    dispatch(_act.GoButtonForinvoiceAdd({
                        jsonBody,
                        subPageMode: IsFranchisesRole ? url.FRANCHAISE_INVOICE : url.INVOICE_1,
                        path: IsFranchisesRole ? url.FRANCHAISE_INVOICE : url.INVOICE_1,
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
            dispatch(_act.GoButton_For_Order_AddSuccess(null))
        }
    }, [goBtnOrderdata]);

    useEffect(() => {
        if ((supplierAddress.length > 0) && ((!((hasShowloction || hasShowModal)) || (orderFromMaterialIssue)))) {
            setbillAddr(supplierAddress[0]);
            setshippAddr(supplierAddress[0]);
        }
    }, [supplierAddress]);

    useEffect(() => {
        if ((orderType.length > 0) && ((!((hasShowloction || hasShowModal)) || (orderFromMaterialIssue)))) {
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

        if (newRowId !== null) {
            const inputEl = document.getElementById(`Quantity-${newRowId}`);
            if (inputEl) {
                inputEl.focus();
            }
        }
    }, [orderItemTable]);




    // useEffect(() => {

    //     if (changeAllDiscount) {
    //         const updatedOrderItemTable = orderItemTable.map((item) => ({
    //             ...item,
    //             Discount: discountValueAll,
    //             DiscountType: discountTypeAll.value,
    //         }));

    //         // Perform calculations based on the updated values for each item
    //         updatedOrderItemTable.forEach((item) => {
    //             itemWise_CalculationFunc(item, undefined, updatedOrderItemTable);
    //         });

    //         // Set the updated array as the new orderItemTable

    //         setOrderItemTable(updatedOrderItemTable);
    //     }
    // }, [changeAllDiscount, discountValueAll, discountTypeAll.value]);



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



    const rowStyle = (row, rowIndex) => {
        if (row.GroupRow) {
            return { backgroundColor: 'white', fontWeight: 'bold', fontSize: '18px' };
        } else if (row.SubGroupRow) {
            return { backgroundColor: '#f2f2f2', fontWeight: 'bold', fontSize: '15px' };
        }
        return {};
    };

    const rowClasses = (row) => {

        if (row.GroupRow || row.SubGroupRow) {
            return 'group-row hide-border';
        }
        return '';
    };





    const pagesListColumns = [

        {//------------- ItemName column ----------------------------------
            dataField: "ItemName",
            text: "Item Name",
            classes: 'table-cursor-pointer',
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "ItemName", "sticky-col": "true", }),
            sort: true,
            headerStyle: () => {
                return { minWidth: '100px', textAlign: 'center' };
            },
            sortValue: (cell, row) => row["ItemName"],
            headerFormatter: (value, row, k, f) => {
                return (
                    <div className="d-flex justify-content-between" key={row.id}>
                        <div>
                            Item Name
                        </div>
                        <div onClick={assignItem_onClick}>
                            <samp id={"__assignItem_onClick"}
                                style={{ display: "none", cursor: "pointer" }}
                                className="text-primary fst-italic text-decoration-underline"
                            >
                                Assign-Items
                                {partyItemListLoading && <Spinner style={{ height: "13px", width: "13px" }} color="primary" />}
                            </samp>
                        </div>

                    </div>
                )
            },

            formatter: (value, row, k) => {
                if (row.SubGroupRow) {
                    const [Group, SubGroup] = row.Group_Subgroup.split('-');
                    return (
                        <GroupSubgroupDisplay group={Group} subgroup={SubGroup} />
                    );
                } else {
                    const [itemName] = row.ItemName.split('-');

                    return (
                        <>
                            <div>
                                {(subPageMode === url.ORDER_2) && IsFranchisesRole && < div className="checkbox-wrapper-31" style={{ marginRight: "20px" }}
                                    title="Select to highlight this item for printing.">
                                    <input type="checkbox"
                                        onChange={(e) => { row.IsHighlightItemInPrint = e.target.checked }}
                                    />
                                    <svg viewBox="0 0 35.6 35.6">
                                        <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                        <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                        <polyline
                                            className="check"
                                            points="11.78 18.12 15.55 22.23 25.17 12.87"
                                        ></polyline>
                                    </svg>
                                </div>}
                                {itemName}
                            </div >
                        </>
                    )
                }


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
                if (row.SubGroupRow) {
                    return (
                        <CInput
                            key={`Quantity-${k}`}
                            id={`Quantity-${row.Item_id}`}
                            cpattern={(subPageMode === url.ORDER_1 || subPageMode === url.ORDER_4 || subPageMode === url.ORDER_2) ? decimalRegx_3dit : onlyNumberRegx}
                            defaultValue={(row.Quantity)}
                            className=" text-end"
                            style={{ display: 'none' }}
                            onChange={(e) => {

                                row["Quantity"] = e.target.value
                                itemWise_CalculationFunc(row, undefined, tableList)
                            }}
                        />)

                }
                return (
                    <>
                        <CInput
                            key={`Quantity-${k}`}
                            id={`Quantity-${row.Item_id}`}
                            cpattern={(subPageMode === url.ORDER_1 || subPageMode === url.ORDER_4 || subPageMode === url.ORDER_2 || subPageMode === url.IB_SALES_ORDER || subPageMode === url.IB_ORDER) ? decimalRegx_3dit : onlyNumberRegx}
                            defaultValue={(row.Quantity)}
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
                return { width: '10%', textAlign: 'center' };
            },
            formatExtraData: { tableList: orderItemTable },
            formatter: (value, row, key, { tableList }) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                if (!row.UnitName) {
                    row["Unit_id"] = 0;
                    row["UnitName"] = 'null';
                    if (IsFranchisesRole && subPageMode === url.ORDER_4) {
                        row.UnitDetails.forEach(i => {
                            if (i?.IsBase) {
                                defaultUnit(i)
                            }
                        });
                    } else {
                        row.UnitDetails.forEach(i => {
                            if ((i.PODefaultUnit) && !(subPageMode === url.ORDER_4)) {
                                defaultUnit(i)
                            }
                            else if ((i.SODefaultUnit) && (subPageMode === url.ORDER_4)) {
                                defaultUnit(i)
                            }
                        });
                    }


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
                        // if (!(subPageMode === url.ORDER_1 || subPageMode === url.IB_ORDER)) {
                        row["Rate"] = ((i.BaseUnitQuantity / i.BaseUnitQuantityNoUnit) * i.Rate).toFixed(2);
                        // }
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
                    <div style={{ width: "130px" }}>
                        <Select
                            id={"ddlUnit"}
                            key={`ddlUnit${row.id}`}
                            defaultValue={{ value: row.Unit_id, label: row.UnitName }}
                            isDisabled={subPageMode === url.ORDER_4 && IsFranchisesRole}
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
                            styles={{
                                menu: provided => ({ ...provided, zIndex: 2 })
                            }}
                        >
                        </Select >
                    </div>
                )

            },

        },

        {//------------- Rate column ----------------------------------
            text: (IsFranchisesRole && subPageMode === url.ORDER_4) ? "MRP" : "Basic Rate",
            classes: 'table-cursor-pointer',
            dataField: "",
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "Basic Rate" }),
            headerStyle: () => {
                return { width: '9%', textAlign: 'center' };
            },

            formatExtraData: { tableList: orderItemTable },
            formatter: (value, row, k, { tableList }) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                if (subPageMode === url.ORDER_1 || subPageMode === url.IB_ORDER || subPageMode === url.IB_SALES_ORDER) {
                    return (
                        <div key={row.id} className="text-end">
                            <CInput
                                type="text"
                                id={`Rate-${k}`}
                                cpattern={decimalRegx}
                                defaultValue={row.Rate}
                                disabled={subPageMode === url.IB_ORDER}
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
            hidden: (subPageMode === url.ORDER_1 || subPageMode === url.IB_ORDER || subPageMode === url.IB_SALES_ORDER || IsFranchisesRole || isSweetAndSnacksCompany) && true,
            formatter: (value, row, k) => {
                if (row.GroupRow || row.SubGroupRow) { return }
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
                return { width: '12%', textAlign: 'center' };
            },
            hidden: (subPageMode === url.ORDER_1 || subPageMode === url.IB_ORDER || subPageMode === url.IB_SALES_ORDER || isSweetAndSnacksCompany) && true,
            headerFormatter: () => {
                // const handleTypeChange = (e) => {
                //     discountTypeAllRef.current = e;
                //     orderItemTable.forEach((row, key) => {
                //         if (!row.GroupRow && !row.SubGroupRow) {
                //             row.DiscountType = e.value;
                //             if (row.Quantity !== null && row.Quantity !== undefined) {
                //                 itemWise_CalculationFunc(row, undefined, orderItemTable);
                //             }
                //         }
                //     });
                // };
                // const handleValueChange = (e) => {
                //     discountTypeAllRef.current = e;
                //     orderItemTable.forEach((row, key) => {
                //         if (!row.GroupRow && !row.SubGroupRow) {
                //             row.Discount = e;


                //             if (row.Quantity !== null && row.Quantity !== undefined) {
                //                 itemWise_CalculationFunc(row, undefined, orderItemTable);
                //             }
                //         }
                //     });
                // };
                return (
                    // <div className="" >
                    //     {orderItemTable.length <= 0 ?
                    //         <div className="col col-3 mt-2">
                    //             <Label>Discount/unit</Label>
                    //         </div>
                    //         :
                    //         <div className="row">
                    //             <div className=" mt-n2 mb-n2">
                    //                 <Label>Discount/unit</Label>
                    //             </div>
                    //             <div className="col col-6" >
                    //                 <Select
                    //                     type="text"
                    //                     defaultValue={discountTypeAllRef.current}
                    //                     classNamePrefix="select2-selection"
                    //                     options={discountDropOption}
                    //                     isDisabled={(subPageMode === url.ORDER_2)}
                    //                     style={{ textAlign: "right" }}
                    //                     onChange={(e) => { handleTypeChange(e) }}

                    //                 />
                    //             </div>
                    //             <div className="col col-6" >
                    //                 <CInput
                    //                     type="text"
                    //                     className="input"
                    //                     style={{ textAlign: "right" }}
                    //                     cpattern={decimalRegx}
                    //                     defaultValue={discountAllValueRef.current}
                    //                     disabled={(subPageMode === url.ORDER_2)}
                    //                     onChange={(e) => {

                    //                         e.target.value = e.target.value.replace(/^\.+/, '');
                    //                         e.target.value = e.target.value.replace(/^00+/, '0');
                    //                         let e_val = Number(e.target.value);

                    //                         // if (discountTypeAll.value === 2) {// Discount type 2 represents "percentage"
                    //                         if (e_val > 100) { // Limit the input to the range of 0 to 100
                    //                             e.target.value = 100; // Set the input value to 100 if it exceeds 100
                    //                         } else if (!(e_val >= 0 && e_val < 100)) {
                    //                             e.target.value = ""; // Clear the input value if it is less than 0
                    //                         }
                    //                         handleValueChange(e_val)
                    //                         // setOrderItemTable(updatedItems);
                    //                         // }
                    //                         // setChangeAllDiscount(true);
                    //                         // setDiscountValueAll(e.target.value);
                    //                     }}
                    //                 />
                    //             </div>
                    //         </div>
                    //     }
                    // </div>

                    <>
                        <Label>Discount/unit</Label>
                    </>
                );
            },










            classes: () => "order-discount-row",
            formatter: (cellContent, row, key, formatExtraData) => {
                if (row.GroupRow || row.SubGroupRow) { return }

                let { tableList } = formatExtraData;

                if ((row.DiscountType === "0") || (row.DiscountType === 0)) { row.DiscountType = discountDropOption[1].value }

                const defaultDiscountTypelabel =
                    ((row.DiscountType === "1") || (row.DiscountType === 1)) ? discountDropOption[0] : discountDropOption[1];

                discountRefs.current[row.id]?.setValue(row.DiscountType);


                return (
                    // <>
                    //     <div className="mb-2">
                    //         <div className="parent">
                    //             {/* <div className="child">
                    //                 <label className="label">Type&nbsp;&nbsp;&nbsp;</label>
                    //             </div> */}
                    //             <div className="child">
                    //                 <Select
                    //                     id={`DicountType_${key}-${row.id}`}

                    //                     classNamePrefix="select2-selection"
                    //                     key={`DicountType_${key}-${row.id}`}
                    //                     defaultValue={defaultDiscountTypelabel}
                    //                     isDisabled={(subPageMode === url.ORDER_2)}
                    //                     options={discountDropOption}
                    //                     onChange={(e) => {
                    //                         
                    //                         // setChangeAllDiscount(false);
                    //                         row.DiscountType = e.value;
                    //                         row.Discount = '';
                    //                         const elementId = `Dicount_${key}-${row.id}`;
                    //                         const element = document.getElementById(elementId);
                    //                         if (element) {
                    //                             element.value = ""; // or any dynamic value
                    //                         }
                    //                         itemWise_CalculationFunc(row, undefined, tableList)
                    //                     }}
                    //                 />
                    //             </div>
                    //         </div>
                    //     </div>
                    //     <div>
                    //         <div className="parent">
                    //             {/* <div className="child">
                    //                 <label className="label">Value&nbsp;</label>
                    //             </div> */}
                    //             <div className="child">
                    //                 <Input
                    //                     // className="input"
                    //                     id={`Dicount_${key}-${row.id}`}
                    //                     style={{ textAlign: "right" }}
                    //                     type="text"
                    //                     defaultValue={row.Discount}
                    //                     disabled={(subPageMode === url.ORDER_2)}
                    //                     // cpattern={decimalRegx}
                    //                     onChange={(e) => {
                    //                         
                    //                         e.target.value = e.target.value.replace(/^\.+/, '');
                    //                         e.target.value = e.target.value.replace(/^00+/, '0');
                    //                         let e_val = Number(e.target.value);


                    //                         if (row.DiscountType === 2) {// Discount type 2 represents "percentage"
                    //                             if (e_val >= 100) { // Limit the input to the range of 0 to 100
                    //                                 e.target.value = 100; // Set the input value to 100 if it exceeds 100
                    //                             } else if (!(e_val >= 0 && e_val < 100)) {
                    //                                 e.target.value = ""; // Clear the input value if it is less than 0
                    //                             }
                    //                         }


                    //                         row.Discount = e.target.value;
                    //                         // setChangeAllDiscount(false);
                    //                         itemWise_CalculationFunc(row, undefined, tableList)
                    //                     }}

                    //                 />
                    //             </div>
                    //         </div>
                    //     </div>

                    // </>
                    <>
                        <div className="d-flex align-items-center gap-2 ">


                            <Input
                                id={`Dicount_${key}-${row.id}`}
                                style={{ textAlign: "right", width: "100px" }}
                                type="text"
                                defaultValue={row.Discount}
                                disabled={(subPageMode === url.ORDER_2)}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/^\.+/, '');
                                    e.target.value = e.target.value.replace(/^00+/, '0');
                                    let e_val = Number(e.target.value);

                                    if (row.DiscountType === 2) {
                                        if (e_val >= 100) {
                                            e.target.value = 100;
                                        } else if (!(e_val >= 0 && e_val < 100)) {
                                            e.target.value = "";
                                        }
                                    }

                                    row.Discount = e.target.value;
                                    itemWise_CalculationFunc(row, undefined, tableList);
                                }}

                            />

                            <Select
                                id={`DicountType_${key}-${row.id}`}
                                classNamePrefix="select2-selection"
                                key={`DicountType_${key}-${row.id}`}
                                defaultValue={defaultDiscountTypelabel}
                                isDisabled={(subPageMode === url.ORDER_2)}
                                options={discountDropOption}
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        width: 70,
                                        height: 38,
                                    }),
                                }}
                                onChange={(e) => {
                                    row.DiscountType = e.value;
                                    row.Discount = '';
                                    const elementId = `Dicount_${key}-${row.id}`;
                                    const element = document.getElementById(elementId);
                                    if (element) {
                                        element.value = "";
                                    }
                                    itemWise_CalculationFunc(row, undefined, tableList);
                                }}
                            />
                        </div>


                    </>

                );

            },

        },

        { //------------- Comment column ----------------------------------
            text: "Amount",
            classes: 'table-cursor-pointer',
            headerStyle: () => {
                return { width: '8%', textAlign: 'right' };
            },
            dataField: "",
            hidden: (subPageMode === url.ORDER_1 || subPageMode === url.IB_ORDER) && true,
            attrs: () => ({
                style: { textAlign: 'right' }  // Align body cells to the right
            }),
            formatter: (value, row, k) => {
                if (row.GroupRow || row.SubGroupRow) { return }
                return (
                    <span   >
                        <span id={`Item-Amount-${row.Item_id}`}>0.00</span>
                    </span>
                )

            },
        },

        { //------------- Comment column ----------------------------------
            text: "Comment",
            classes: 'table-cursor-pointer',
            dataField: "",
            hidden: (subPageMode === url.IB_ORDER) && true,
            attrs: (cell, row, rowIndex, colIndex) => ({ 'data-label': "Comment" }),
            formatter: (value, row, k) => {
                if (row.GroupRow || row.SubGroupRow) { return }

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

        const validationMessage = _cfunc.validateOrder(page_id, deliverydate);  // Get the validation message

        if (validationMessage !== "") {
            // If validation fails, show the message and stop further execution
            customAlert({ Type: 4, Message: validationMessage });
            return;  // Stop further execution if validation fails
        }

        // Continue with the rest of the code if validation passes
        setSupplierSelect(e);

        if (subPageMode === url.ORDER_4) {
            dispatch(_act.getSupplierAddress(e.value));
            if (!_cfunc.loginUserIsFranchisesRole()) {

                let Date = currentDate_ymd;
                if ((e.FSSAIExipry === "") || (e.FSSAIExipry === null)) {
                    setFSSAI_Date_Is_Expired("There is No FSSAI Expiry Date Please Insert FSSAI Date!");
                } else if (e.FSSAIExipry < Date) {
                    setFSSAI_Date_Is_Expired("FSSAI Expired");
                } else {
                    setFSSAI_Date_Is_Expired("");
                }
            }
        }
        setSelecedItemWiseOrder(true)
        setOrderItemTable([]);
        setItemSelect('');
        goButtonHandler(e.value);

        const elements = document.querySelectorAll('.amount-countable-Calulation');
        const weightage_lable = document.querySelectorAll('.weightage-lable');
        const weightage_value = document.querySelectorAll('.weightage-value');
        weightage_lable.forEach(element => { element.innerText = "weight:"; });
        weightage_value.forEach(element => { element.innerText = `${(0).toFixed(2)} kg`; });
        elements.forEach(element => { element.innerText = 0.00; });

    }

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
            // dispatch(_act.GoButton_For_Order_AddSuccess([]))
        };
    };

    function itemWise_CalculationFunc(row, IsComparGstIn, tableList = []) {

        let calculate = {} //order calculation function 
        if (IsFranchisesRole && subPageMode === url.ORDER_4) {
            calculate = Franchies_Order_Calculate_Func(row)
        } else {
            calculate = orderCalculateFunc(row) //order calculation function 
        }
        row["Amount"] = calculate.roundedTotalAmount


        let totals = tableList.reduce(
            (accumulator, currentObject) => {

                const amount = Number(currentObject["Amount"]) || 0.00;
                const weightage = (Number(currentObject["Weightage"])) || 0.00;

                const row_weightage = Number(weightage) === 0
                    ? 0
                    : (Number(currentObject.Quantity) * Number(currentObject.BaseUnitQuantity)) / Number(weightage);

                if (Number(currentObject["Amount"]) > 0) {

                    return {
                        amountSum: accumulator.amountSum + amount,
                        weightageSum: accumulator.weightageSum + row_weightage,
                    };
                }
                return {
                    ...accumulator,
                    amountSum: accumulator.amountSum + amount,
                };
            },
            { amountSum: 0.00, weightageSum: 0.00 }
        );

        if (Number(totals.weightageSum) >= 500) {
            const Overweight = Number(totals.weightageSum) * (Number(Weight) / 100)
            totals.weightageSum = totals.weightageSum + Overweight
        }

        const Item_Amount_Element = document.getElementById(`Item-Amount-${row.Item_id}`)
        if (Item_Amount_Element) {
            Item_Amount_Element.innerText = _cfunc.amountCommaSeparateFunc(Number(row.Amount).toFixed(2));
        }
        const commaSeparateAmount = _cfunc.amountCommaSeparateFunc(totals.amountSum.toFixed(2))

        const elements = document.querySelectorAll('.amount-countable-Calulation');


        const weightage_lable = document.querySelectorAll('.weightage-lable');
        const weightage_value = document.querySelectorAll('.weightage-value');
        weightage_lable.forEach(element => { element.innerText = "weight:"; });
        weightage_value.forEach(element => { element.innerText = `${(totals.weightageSum).toFixed(2)} kg`; });
        elements.forEach(element => { element.innerText = commaSeparateAmount; });

    };

    const item_AddButtonHandler = () => {



        let isfound = orderItemTable.find(i => i.value === itemSelect.value);

        if (!itemSelect) {
            customAlert({ Type: 4, Message: alertMessages.itemNameIsRequired })
        }
        else if (isfound === undefined) {
            setOrderItemTable([itemSelect].concat(orderItemTable))
        }
        else {
            customAlert({ Type: 3, Message: alertMessages.ItemNameAlreadyExists })
        }



        dispatch(_act.BreadcrumbShowCountlabel(`Count:${[itemSelect].concat(orderItemTable).length} currency_symbol ${state.values.OrderAmount} weight ${state.values.Total_weigtage} kg`))
        setNewRowId(itemSelect.Item_id)
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
            Demand: ((subPageMode === url.ORDER_1) || (pageMode === mode.defaultsave)) ? 0 : editVal.id,  //IB Purachase Order  
            OrderType: order_Type.PurchaseOrder,
        }
        let SO_body = {
            Party: commonPartyDropSelect.value, //swap  party and customer for sale oerder
            Customer: selectSupplier ? selectSupplier : supplierSelect.value,//swap  party and customer for sale oerder
            RateParty: selectSupplier ? selectSupplier : supplierSelect.value,
            EffectiveDate: orderdate,
            OrderID: (pageMode === mode.defaultsave) ? 0 : editVal.id,
            Demand: ((subPageMode === url.ORDER_1) || (pageMode === mode.defaultsave)) ? 0 : editVal.id,  //IB Purachase Order   
            OrderType: order_Type.SaleOrder,
        }


        let jsonBody;   //json body decleration 
        if (subPageMode === url.ORDER_4 || subPageMode === url.IB_SALES_ORDER) {
            jsonBody = JSON.stringify({ ...SO_body, });
        }
        else {
            jsonBody = JSON.stringify({ ...PO_Body, });
        }
        let config = { subPageMode, jsonBody, btnId }
        dispatch(_act.GoButton_For_Order_Add(config))
    };

    const handleGoButtonClick = (e) => {

        const validationMessage = _cfunc.validateOrder(page_id, deliverydate);  // Get the validation message

        if (validationMessage !== "") {
            // If validation fails, show the message and stop further execution
            customAlert({ Type: 4, Message: validationMessage });
            return;  // Stop further execution if validation fails
        }

        if (itemSelectDropOptions.length === orderItemTable.length) {
            customAlert({ Type: 4, Message: "Already added all items." });
            return;  // Stop further execution if validation fails
        }

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

        console.log("state", state)

        dispatch(_act.BreadcrumbShowCountlabel(`Count:${itemSelectDropOptions.length} currency_symbol ${state.values.OrderAmount} weight ${state.values.Total_weigtage} kg`))
        setSelecedItemWiseOrder(false)

        setOrderItemTable(itemSelectDropOptions)
        setItemSelect(allLabelWithBlank)

    };


    // Function to handle the form submission
    const saveHandler = async (gotoInvoiceMode = false) => {

        try {
            const validationMessage = _cfunc.validateOrder(page_id, deliverydate);  // Get the validation message

            if (validationMessage !== "") {
                // If validation fails, show the message and stop further execution
                customAlert({ Type: 4, Message: validationMessage });
                return;  // Stop further execution if validation fails
            }
            // Get the division from the loginPartyID function
            const division = commonPartyDropSelect.value;
            const supplier = supplierSelect.value;

            const validationMessages = []; // Stores validation messages for items
            const orderItems = []; // Stores processed order items
            const vdcPoValidationMessages = []; // Stores VDC-PO validation messages
            let sumOfOrderAmount = 0;//total grand total amount

            // Loop through the order items
            orderItemTable.forEach(item => {

                // Check for item quantity and rate validity
                if ((item.Quantity > 0) && !(item.Rate > 0)) {
                    validationMessages.push({ [item.ItemName]: alertMessages.itemRateIsRequired });
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
                item.Quantity = isNaN(parseFloat(item.Quantity)) ? 0 : parseFloat(item.Quantity);

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

                let calculated = {}
                if (IsFranchisesRole && subPageMode === url.ORDER_4) {
                    calculated = Franchies_Order_Calculate_Func(item)
                } else {
                    calculated = orderCalculateFunc(item, { GSTIn_1: supplierSelect.GSTIN, GSTIn_2: _cfunc.loginUserGSTIN() });
                }

                // Create an object for the order item
                const orderItem = {
                    Item: item.Item_id,
                    Quantity: isDelete ? 0 : item.Quantity,
                    MRP: item.MRP_id,
                    MRPValue: _cfunc.loginCompanyID() === 4 ? "1" : item.MRPValue,
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
                    Comment: item.Comment,
                    OrderItem: item.IsHighlightItemInPrint,
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

            const hasNonPositiveQuantity = array => array.every(item => item.Quantity <= 0);
            const result = hasNonPositiveQuantity(orderItems);

            if (orderItems.length === 0 || result) {
                customAlert({
                    Type: 4,
                    Message: alertMessages.itemQtyIsRequired,
                });
                return;
            }

            if (orderTypeSelect.length === 0) {
                customAlert({
                    Type: 4,
                    Message: alertMessages.select_PO_Type,
                });
                return;
            }
            if ((termsAndConditions.length === 0) && !(subPageMode === url.ORDER_2)
                && !(subPageMode === url.ORDER_4) && !(subPageMode === url.IB_ORDER)
            ) {
                customAlert({
                    Type: 4,
                    Message: alertMessages.enterOneTerms_and_Cond,
                });
                return;
            }

            if (advanceAmountRef.current.value && Number(advanceAmountRef.current.value) > sumOfOrderAmount) {
                customAlert({
                    Type: 4,
                    Message: alertMessages.AdvanceAmount,
                });
                return;
            }

            const po_JsonBody = {
                Customer: division,
                Supplier: supplier,
                OrderType: order_Type.PurchaseOrder,
                IsConfirm: false, // PO Order then IsConfirm true
                AdvanceAmount: advanceAmountRef.current.value ? advanceAmountRef.current.value : 0

            }
            const SO_JsonBody = {
                Customer: supplier,// swipe supllier 
                Supplier: division,// swipe Customer
                OrderType: order_Type.SaleOrder,
                IsConfirm: IsFranchisesRole ? false : true, // SO Order then IsConfirm true
                AdvanceAmount: advanceAmountRef.current.value ? advanceAmountRef.current.value : 0
            }

            const IB_PO_JsonBody = {
                DemandDate: orderdate,
                DemandAmount: sumOfOrderAmount,
                DemandItem: orderItems,
                Customer: division,
                Supplier: supplier,
                OrderType: order_Type.PurchaseOrder,
                AdvanceAmount: advanceAmountRef.current.value ? advanceAmountRef.current.value : 0

            }

            const IB_SO_JsonBody = {
                DemandDate: orderdate,
                DemandAmount: sumOfOrderAmount,
                DemandItem: orderItems,
                Customer: supplier,
                Supplier: division,
                OrderType: order_Type.SaleOrder,
                AdvanceAmount: advanceAmountRef.current.value ? advanceAmountRef.current.value : 0

            }



            const OrderDate = deliverydate.split(' ')[0]; // Date and time  split
            debugger
            const comm_jsonBody = {
                OrderDate: OrderDate,// only date 
                DeliveryDate: IsFranchisesRole ? deliverydate : (pageMode === mode.edit) ? deliverydate : `${deliverydate} ${_cfunc.getCurrenthours_min_sec()}`,  //date with time  as develiery date
                OrderAmount: sumOfOrderAmount,
                OrderItem: orderItems,
                Description: descriptionRef.current.value,
                BillingAddress: billAddr.value,
                ShippingAddress: shippAddr.value,
                OrderNo: 1,
                FullOrderNumber: "PO0001",
                DemandNo: 1,
                FullDemandNumber: "PO0001",
                Division: division,
                POType: orderTypeSelect.value,
                POFromDate: orderTypeSelect.value === 1 ? CurrentOrderDate : poFromDate,
                POToDate: orderTypeSelect.value === 1 ? CurrentOrderDate : poToDate,
                CreatedBy: _cfunc.loginUserID(),
                UpdatedBy: _cfunc.loginUserID(),
                OrderTermsAndConditions: termsAndConditions
            };

            let jsonBody;   //json body decleration 
            if (subPageMode === url.IB_ORDER) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...IB_PO_JsonBody });
            } else if (subPageMode === url.IB_SALES_ORDER) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...IB_SO_JsonBody });
            } else if (subPageMode === url.ORDER_4) {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...SO_JsonBody });
            }
            else {
                jsonBody = JSON.stringify({ ...comm_jsonBody, ...po_JsonBody });
            }
            // +*********************************

            if (pageMode === mode.edit) {
                dispatch(_act.updateOrderIdAction({ jsonBody, updateId: editVal.id, gotoInvoiceMode, subPageMode }))

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
                            <div className="px-2 c_card_filter text-black" >
                                <div>
                                    <Row >
                                        <Col sm="4" >
                                            <FormGroup className=" row mt-2" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "115px" }}>Delivery Date</Label>
                                                <Col sm="7">

                                                    {(IsFranchisesRole && subPageMode === url.ORDER_4) ?
                                                        <C_TimePicker
                                                            value={deliverydate}
                                                            placeholder="Select FromDate"
                                                            name="fromdate"
                                                            data-enable-time
                                                            data-enable-seconds
                                                            data-enable-input={true} // Enable manual input
                                                            options={{
                                                                altInput: true,
                                                                altFormat: 'd-m-Y H:i:S', // Updated date format with 24-hour time
                                                                dateFormat: 'Y-m-d H:i:S', // Updated date format with 24-hour time
                                                                minDate: "today",

                                                            }}
                                                            onChange={(obj, selectedDate) => {
                                                                setdeliverydate(selectedDate)
                                                            }}
                                                        ></C_TimePicker>
                                                        : <C_DatePicker
                                                            options={{
                                                                altInput: true,
                                                                altFormat: "d-m-Y",
                                                                dateFormat: "Y-m-d",
                                                                minDate: "today",
                                                            }}
                                                            name="deliverydate"
                                                            value={deliverydate}
                                                            onChange={(e, date) => { setdeliverydate(date) }}
                                                        />}
                                                </Col>

                                            </FormGroup>
                                        </Col>

                                        {(subPageMode === ORDER_4 &&

                                            allowedRoles.includes(_cfunc.loginRoleID().toString())) ? (

                                            <Col sm="3">
                                                <FormGroup className="row mt-2">
                                                    <Label className="col-sm-5 p-2" style={{ width: "130px" }}>
                                                        {fieldLabel.Route}
                                                    </Label>
                                                    <Col sm="7">
                                                        <C_Select
                                                            classNamePrefix="react-select"
                                                            value={routeSelect}
                                                            options={RouteOptions}
                                                            isDisabled={(orderItemTable.length > 0 || pageMode === "edit" || goBtnloading)}
                                                            onChange={(e) => { RouteOnChange(e) }}
                                                            isLoading={routesDropLoading}
                                                            styles={{
                                                                menu: provided => ({ ...provided, zIndex: 2 })
                                                            }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        ) : (
                                            <Col sm="3" /> // Empty space if dropdown not shown
                                        )}






                                        <Col sm="4" className="">

                                            <FormGroup className="row mt-2" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "129px" }}>{fieldLabel.Supplier}</Label>
                                                <Col sm="7">
                                                    <C_Select
                                                        value={supplierSelect}
                                                        isDisabled={(pageMode === mode.edit || goBtnloading) ? orderFromMaterialIssue ? false : true : false}
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
                                                <Col sm="1" style={{ marginTop: "-12px" }} >
                                                    {(FrenchiesesCustomerMasterAccess && pageMode === mode.defaultsave) && <AddMaster
                                                        masterModal={PartyMaster}
                                                        location={{ pathname: url.FRANCHISE_CUSTOMER_MASTER }}
                                                        masterPath={url.FRANCHISE_CUSTOMER_MASTER}
                                                        RedirectPath={url.ORDER_4}
                                                        ModelClose={(CustomerSave.Status === true) && (CustomerSave.StatusCode === 200)}



                                                    />}
                                                </Col>

                                            </FormGroup>

                                        </Col>

                                        <Col sm="1">                      {/*Go_Button  */}

                                            <div className="row mt-2  pr-1">
                                                {pageMode === mode.defaultsave || pageMode === mode.edit ?
                                                    // (!selecedItemWiseOrder && itemSelectDropOptions.length > 0) ?
                                                    // (!goBtnDissable) ?

                                                    <Go_Button
                                                        loading={goBtnloading}
                                                        id={`go-btn${subPageMode}`}
                                                        Lable={itemSelectDropOptions.length > 0 ? `All Item` : `Go`}
                                                        iconClass={itemSelectDropOptions.length > 0 ? `bx bx-list-plus fa-2x` : ``}
                                                        onClick={handleGoButtonClick}
                                                        styles={{ padding: itemSelectDropOptions.length > 0 ? ` 0px` : `6px` }}
                                                    />
                                                    // :
                                                    // <Change_Button
                                                    //     id={`change-btn${subPageMode}`}
                                                    //     onClick={(e) => {
                                                    //         setSupplierSelect('')
                                                    //         setGoBtnDissable(false)
                                                    //         setSelecedItemWiseOrder(true)
                                                    //         setOrderItemTable([])
                                                    //         setItemSelect(allLabelWithBlank)
                                                    //         dispatch(_act.GoButton_For_Order_AddSuccess([]));
                                                    //         dispatch(_act.BreadcrumbShowCountlabel(initial_BredcrumbMsg))
                                                    //     }}
                                                    // />
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
                                                    <input type="text"
                                                        className="form-control"
                                                        defaultValue={state.values.Description}
                                                        ref={descriptionRef}
                                                        placeholder='Enter Order Description'


                                                    />

                                                </div>

                                            </FormGroup>
                                        </Col >

                                        {(IsFranchisesRole && subPageMode === url.ORDER_4) ? <Col sm='3'>
                                            <FormGroup className="row mt-1" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "130px" }}>{fieldLabel.AdvanceAmount}</Label>
                                                <div className="col-7">
                                                    <input type="text"
                                                        defaultValue={state.values.AdvanceAmount}
                                                        id="AdvanceAmount_id"
                                                        className="form-control"
                                                        ref={advanceAmountRef}
                                                        onChange={e => {
                                                            const value = e.target.value;
                                                            if (/^\d*$/.test(value)) {
                                                                e.target.value = value;
                                                            } else {
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                        placeholder='Enter Advance Amount'
                                                    />
                                                </div>
                                            </FormGroup>
                                        </Col > : <Col sm="3" />}

                                        <Col sm="4">
                                            <FormGroup className="row mt-1" >
                                                <Label className="col-sm-5 p-2"
                                                    style={{ width: "129px" }}>{fieldLabel.Item}</Label>

                                                <Col sm="7">
                                                    <C_Select
                                                        value={itemSelect}
                                                        isDisabled={(goBtnloading) ? true : false}
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

                                            {pageMode === mode.defaultsave || pageMode === mode.edit ?
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
                                                                // setSupplierSelect('')

                                                                setItemSelect('')
                                                                setSelecedItemWiseOrder(true)
                                                                if (pageMode === mode.edit) {
                                                                    let orderItem = orderItemTable
                                                                        .filter((i) => i.Quantity)
                                                                        .sort((a, b) => a.Quantity - b.Quantity)
                                                                    setOrderItemTable(orderItem)
                                                                    dispatch(_act.BreadcrumbShowCountlabel(`Count:${orderItem.length} currency_symbol ${state.values.OrderAmount} weight ${state.values.Total_weigtage} kg`))
                                                                } else {

                                                                    let orderItem = orderItemTable
                                                                        .filter((i) => i.Quantity)
                                                                        .sort((a, b) => a.Quantity - b.Quantity)
                                                                    setOrderItemTable(orderItem)
                                                                    // setOrderItemTable([])
                                                                    // const elements = document.querySelectorAll('.amount-countable-Calulation');
                                                                    // const weightage_lable = document.querySelectorAll('.weightage-lable');
                                                                    // const weightage_value = document.querySelectorAll('.weightage-value');
                                                                    // weightage_lable.forEach(element => { element.innerText = "weight:"; });
                                                                    // weightage_value.forEach(element => { element.innerText = `${(0).toFixed(2)} kg`; });
                                                                    // elements.forEach(element => { element.innerText = 0.00; });
                                                                    // 
                                                                    dispatch(_act.BreadcrumbShowCountlabel(`Count:${0} currency_symbol ${state.values.OrderAmount} weight ${state.values.Total_weigtage} kg`))
                                                                }
                                                                // dispatch(_act.GoButton_For_Order_AddSuccess([]))
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
                            {subPageMode === url.ORDER_1 &&
                                <div className="px-2 c_card_filter text-black" >
                                    <div>
                                        <Row >
                                            <Col sm="4" >
                                                <FormGroup className=" row mt-2" >
                                                    <Label className="col-sm-5 p-2"
                                                        style={{ width: "115px" }}>Billing Address</Label>
                                                    <Col sm="7">
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
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col sm='3' />

                                            <Col sm="4" className="">
                                                <FormGroup className="row mt-2" >
                                                    <Label className="col-form-label-sm p-2"
                                                        style={{ width: "129px", fontSize: "14px" }}>Shipping Address</Label>
                                                    <Col sm="7">
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
                                                    </Col>

                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm="4">                               {/*  Description field */}
                                                <FormGroup className="row mt-1" >
                                                    <Label className="col-sm-5 p-2"
                                                        style={{ width: "115px" }}>PO Type</Label>
                                                    <div className="col-7">
                                                        <Select
                                                            value={orderTypeSelect}
                                                            classNamePrefix="select2-Customer"
                                                            options={orderTypeOptions}
                                                            // isDisabled={subPageMode === url.ORDER_1 && true}
                                                            onChange={(e) => { setorderTypeSelect(e) }}
                                                            isLoading={orderTypeDropLoading}
                                                            styles={{
                                                                menu: provided => ({ ...provided, zIndex: 2 })
                                                            }}
                                                        />
                                                    </div>
                                                </FormGroup>
                                            </Col >
                                            <Col sm="3" />

                                        </Row>

                                        {(orderTypeSelect.label === 'Open PO') && <Row >
                                            <Col sm="4" >
                                                <FormGroup className=" row mt-2" >
                                                    <Label className="col-sm-5 p-2"
                                                        style={{ width: "115px" }}>PO From Date</Label>
                                                    <Col sm="7">
                                                        <C_DatePicker
                                                            options={{
                                                                altInput: true,
                                                                altFormat: "d-m-Y",
                                                                dateFormat: "Y-m-d",
                                                                minDate: "today",
                                                            }}
                                                            id="pofromdate"
                                                            name="pofromdate"
                                                            value={poFromDate}
                                                            onChange={(e, date) => { setpoFromDate(date) }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col sm='3' />
                                            <Col sm="4" className="">
                                                <FormGroup className="row mt-2" >
                                                    <Label className="col-form-label-sm p-2"
                                                        style={{ width: "130px", fontSize: "14px" }}>PO To Date</Label>
                                                    <Col sm="7">
                                                        <C_DatePicker
                                                            options={{
                                                                altInput: true,
                                                                altFormat: "d-m-Y",
                                                                dateFormat: "Y-m-d",
                                                                minDate: "today",
                                                            }}
                                                            id="potodate"
                                                            name="potodate"
                                                            value={poToDate}
                                                            onChange={(e, date) => { setpoToDate(date) }}
                                                        />
                                                    </Col>

                                                </FormGroup>
                                            </Col>

                                        </Row>}
                                    </div>

                                </div>

                            }

                        </div>


                        <ToolkitProvider
                            keyField={"Item_id"}
                            data={processedData}
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
                                        rowStyle={rowStyle}
                                        rowClasses={rowClasses}
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
                                    {globalTableSearchProps(toolkitProps.searchProps)}


                                </React.Fragment>
                            )}
                        </ToolkitProvider>

                        <OrderPageTermsTable
                            tableList={termsAndConTable}
                            setfunc={setTermsAndConTable}
                            privious={editVal.TermsAndConditions}
                            tableData={orderItemTable} />

                        {
                            ((orderItemTable.length > 0) && (!isOpen_assignLink)) &&

                            <SaveButtonDraggable>
                                <SaveButton
                                    loading={saveBtnloading}
                                    editCreatedBy={editCreatedBy}
                                    pageMode={pageMode}
                                    userAcc={userPageAccessState}
                                    onClick={() => saveHandler(false)}
                                    forceDisabled={gotoInvoiceBtnLoading}
                                />
                                {
                                    (subPageMode === url.ORDER_4) && (pageMode === mode.defaultsave) &&

                                    <GotoInvoiceBtn
                                        forceDisabled={gotoInvoiceBtnLoading}
                                        loading={gotoInvoiceBtnLoading}
                                        pageMode={pageMode}
                                        userAcc={userPageAccessState}
                                        onClick={() => saveHandler(true)}
                                    />
                                }

                            </SaveButtonDraggable>



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

