
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import Order from "./Order";
import * as _act from "../../../store/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"

import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import * as report from '../../../Reports/ReportIndex'
import { url, mode, pageId } from "../../../routes/index"
import { order_Type } from "../../../components/Common/C-Varialbes";
import { IB_Order_Get_Api, order_Single_and_Multiple_Print_API } from "../../../helpers/backend_helper";
import { comAddPageFieldFunc, initialFiledFunc } from "../../../components/Common/validationFunction";
import { orderApprovalAction, postOrderConfirms_API, postOrderConfirms_API_Success } from "../../../store/actions";
import { orderApprovalMessage } from "./orderApproval";
import { priceListByCompay_Action, priceListByCompay_ActionSuccess } from "../../../store/Administrator/PriceList/action";
import OrderView from "./OrderView";
import OrderView_Modal from "./OrderView";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { getOrdersMakeInvoiceDataAction, getOrdersMakeInvoiceDataActionSuccess } from "../../../store/Sales/bulkInvoice/action";
import { allLabelWithBlank } from "../../../components/Common/CommonErrorMsg/HarderCodeData";
import { sideBarPageFiltersInfoAction } from "../../../store/Utilites/PartyDrodown/action";
import { getCountryList_Action } from "../../../store/Administrator/CountryRedux/action";
import useCheckStockEntry from "../../../components/Common/commonComponent/CheckStockEntry";



const OrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const IsFranchises = _cfunc.loginUserIsFranchisesRole()
    let originalStorageDetails = JSON.parse(localStorage.getItem("roleId"));


    const isSweetAndSnacksCompany = _cfunc.IsSweetAndSnacksCompany()

    const LoginDetails = _cfunc.loginUserDetails();
    const isVisibleRateDrop = _cfunc.checkRateDropVisibility()

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Supplier: allLabelWithBlank,
        CustomerType: [allLabelWithBlank],
        CountryName: { value: LoginDetails?.Country_id, label: LoginDetails?.Country }
    }

    const initialSubPageMode = useMemo(() => {
        if (_cfunc.IsAuthorisedURL({ subPageMode: history.location.pathname, URL: url.ORDER_LIST_2 })) {
            return url.ORDER_LIST_2;
        }
        return history.location.pathname;
    }, []);

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(initialSubPageMode);
    const [pageMode, setPageMode] = useState(mode.defaultList);

    const [extraSelect, setExtraSelect] = useState(false);



    const orderList4_or_app_orderList = ((subPageMode === url.ORDER_LIST_4) || (subPageMode === url.APP_ORDER_LIST))

    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false,
        makeBtnShow: '',
        makeBtnName: '',
        IBType: '',
        showAprovalBtn: false
    });

    let reducers = useSelector(
        (state) => ({
            unhideMsg: state.GRNReducer.hideMsg,
            tableList: state.OrderReducer.orderList,
            GRNitem: state.GRNReducer.GRNitem,
            makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
            deleteMsg: state.OrderReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.OrderReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,

            orderApprovalMsg: state.OrderReducer.orderApprovalMsg,
            // approvalDetail: state.OrderReducer.approvalDetail,

            customerType: state.PriceListReducer.priceListByCompany,
            customerTypeDropLoading: state.PriceListReducer.listBtnLoading,

            orderConfirmMsg: state.OrderReducer.orderConfirmMsg,

            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            supplierDropLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,

            gobutton_Add_invoice: state.InvoiceReducer.gobutton_Add,
            goBtnloading: state.OrderReducer.goBtnLoading,

            countryList: state.CountryReducer.CountryList,
            countryListloading: state.CountryReducer.loading,

            printAllBtnLoading: state.PdfReportReducers.printAllBtnLoading,

            listBtnLoading: (state.OrderReducer.listBtnLoading
                || state.InvoiceReducer.listBtnLoading
                || state.PdfReportReducers.listBtnLoading
                || state.OrderReducer.orderConfirmLoading
                || state.InvoiceReducer.listBtnLoading
                || state.GRNReducer.listBtnLoading
                || state.PdfReportReducers.ReportBtnLoading),

        })
    );

    const gobtnId = `gobtn-${subPageMode}`
    const {
        pageField,
        GRNitem,
        supplier,
        makeIBInvoice,
        orderApprovalMsg,
        // approvalDetail,
        customerType,
        orderConfirmMsg,
        gobutton_Add_invoice,
        customerTypeDropLoading,
        supplierDropLoading,
        unhideMsg,
        userAccess,
        countryListloading,
        countryList,
        printAllBtnLoading,
        tableList
    } = reducers;

    const ordersBulkInvoiceData = useSelector(state => state.BulkInvoiceReducer.ordersBulkInvoiceData);
    const makeBulkInvoiceLoading = useSelector(state => state.BulkInvoiceReducer.makeBulkInvoiceLoading);
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    const values = { ...state.values }
    const { fieldLabel } = state;

    const tableAction = {
        getList: _act.getOrderListPage,
        deleteId: _act.deleteOrderId,
        postSucc: _act.saveOrderActionSuccess,
        updateSucc: _act.updateOrderIdSuccess,
        deleteSucc: _act.deleteOrderIdSuccess,
    }


    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            goButtonHandler()
            dispatch(_act.GetVenderSupplierCustomer({ subPageMode, PartyID: commonPartyDropSelect.value }));

        } else {
            dispatch(_act.getOrderListPageSuccess([]));
            dispatch(_act.GetVenderSupplierCustomerSuccess([]));
            setState((i) => {
                let a = { ...i }
                a.values.CustomerType = [allLabelWithBlank]
                a.values.Supplier = allLabelWithBlank
                a.hasValid.CustomerType.valid = true;
                a.hasValid.Supplier.valid = true;
                return a
            })
        }

    }, [commonPartyDropSelect]);

    const { Actionhandler } = useCheckStockEntry(values.FromDate, commonPartyDropSelect);

    // sideBar Page Filters Information
    useEffect(() => {
        const filtersArray = [
            { label: fieldLabel.FromDate, content: _cfunc.date_dmy_func(values.FromDate) },
            { label: fieldLabel.ToDate, content: _cfunc.date_dmy_func(values.ToDate) },
            ...(orderList4_or_app_orderList
                ? [{ label: fieldLabel.CustomerType, content: values.CustomerType.map(obj => obj.label).join(',') }]
                : []),
            { label: fieldLabel.Supplier, content: values.Supplier.label }
        ];
        dispatch(sideBarPageFiltersInfoAction(filtersArray));
    }, [pageField, state, orderList4_or_app_orderList]);

    // Featch Modules List data  First Rendering
    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false;
        let IBType = '';
        let newBtnPath = '';
        let makeBtnName = '';
        let showAprovalBtn = false;

        if (subPageMode === url.ORDER_LIST_1) {
            page_Id = pageId.ORDER_LIST_1;
            masterPath = url.ORDER_1;
            newBtnPath = url.ORDER_1;
            page_Mode = mode.modeSTPList
            makeBtnShow = true;
            makeBtnName = "Make GRN"
        }
        else if (subPageMode === url.ORDER_LIST_2) {
            const IsAuthorisedURL = _cfunc.IsAuthorisedURL({ subPageMode: history.location.pathname, URL: url.ORDER_LIST_2 })
            if (IsAuthorisedURL) {
                page_Id = pageId.ORDER_LIST_2
                masterPath = url.POS_ORDER_IN_POS;
                newBtnPath = url.POS_ORDER_IN_POS;
                showAprovalBtn = true
            } else {
                page_Id = pageId.ORDER_LIST_2
                masterPath = url.ORDER_2;
                newBtnPath = url.ORDER_2;
                showAprovalBtn = true
            }
        }
        else if (subPageMode === url.IB_ORDER_PO_LIST) {
            page_Id = pageId.IB_ORDER_PO_LIST
            masterPath = url.IB_ORDER;
            newBtnPath = url.IB_ORDER;
            IBType = "IBPO"
        }
        else if (subPageMode === url.IB_ORDER_SO_LIST) {
            page_Id = pageId.IB_ORDER_SO_LIST
            masterPath = url.IB_SALES_ORDER;
            page_Mode = mode.modeSTPList
            newBtnPath = url.IB_SALES_ORDER;
            makeBtnShow = true;
            makeBtnName = "Make IB Invoice"
            IBType = "IBSO"
        }

        else if (subPageMode === url.ORDER_LIST_4) {
            page_Id = pageId.ORDER_LIST_4
            masterPath = url.ORDER_4;
            page_Mode = mode.modeSTPList
            newBtnPath = url.ORDER_4;
            makeBtnShow = true;
            makeBtnName = "Make Invoice"
            showAprovalBtn = true    //Showing  AprovalBtn  in sales order list
        }

        else if (subPageMode === url.APP_ORDER_LIST) {
            page_Id = pageId.APP_ORDER_LIST
            // masterPath = url.ORDER_4;
            page_Mode = mode.modeSTPList
            // newBtnPath = url.ORDER_4;
            makeBtnShow = true;
            makeBtnName = "Make Invoice"
        }

        else if (subPageMode === url.IB_INVOICE_STP) {
            page_Id = pageId.IB_INVOICE_STP
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make Invoice"
            IBType = "IBSO"
        }
        else if (subPageMode === url.GRN_STP_1) {
            page_Id = pageId.GRN_STP_1
            page_Mode = mode.modeSTPList
            makeBtnShow = true;
            makeBtnName = "Make GRN"
        }
        else if (subPageMode === url.GRN_STP_3) {
            page_Id = pageId.GRN_STP_3
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make GRN"

        } else if (subPageMode === url.ORDER_QUATATION_LIST) {
            page_Id = pageId.ORDER_QUATATION_LIST
            masterPath = url.ORDER_QUATATION;
            newBtnPath = url.ORDER_QUATATION;
        }




        setOtherState({ masterPath, makeBtnShow, newBtnPath, makeBtnName, IBType, showAprovalBtn })
        setPageMode(page_Mode)
        dispatch(_act.commonPageFieldListSuccess(null))

        dispatch(_act.commonPageFieldList(page_Id))
        // dispatch(_act.BreadcrumbShowCountlabel(`${"Order Count"} :0`))
        if (!(_cfunc.loginSelectedPartyID() === 0)) {
            dispatch(_act.GetVenderSupplierCustomer({ subPageMode, PartyID: _cfunc.loginSelectedPartyID() }))
            goButtonHandler("event", IBType)
        }
        dispatch(priceListByCompay_Action());
        dispatch(getCountryList_Action());
        return () => {
            dispatch(_act.commonPageFieldListSuccess(null));
            dispatch(_act.getOrderListPageSuccess([]));//for clear privious order list  
            dispatch(_act.orderSinglegetSuccess({ Status: false }));
            dispatch(_act.GetVenderSupplierCustomerSuccess([]));
            dispatch(priceListByCompay_ActionSuccess([]));
            localStorage.setItem("roleId", JSON.stringify(originalStorageDetails));
        }
    }, []);




    useEffect(() => {
        if (subPageMode === url.GRN_STP_3) {
            dispatch(_act.BreadcrumbRadioButtonView(true));
        }
    }, [])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldList
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    useEffect(() => {

        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {

            history.push({
                pathname: GRNitem.path,
                page_Mode: GRNitem.pageMode,
            })
        }
    }, [GRNitem])

    useEffect(() => {

        if (makeIBInvoice.Status === true && makeIBInvoice.StatusCode === 200) {
            history.push({
                pathname: makeIBInvoice.path,
                page_Mode: makeIBInvoice.page_Mode,
            })
        }
    }, [makeIBInvoice]);

    useEffect(() => {
        if (gobutton_Add_invoice.Status === true && gobutton_Add_invoice.StatusCode === 200) {

            history.push({
                pathname: gobutton_Add_invoice.path,
            })
        }
    }, [gobutton_Add_invoice]);

    useEffect(() => {
        if (ordersBulkInvoiceData.Status === true && ordersBulkInvoiceData.StatusCode === 200) {

            dispatch(getOrdersMakeInvoiceDataActionSuccess({ ...ordersBulkInvoiceData, Status: false }));
            history.push({
                pathname: url.BULK_INVOICE,
            })
        }
        else if (ordersBulkInvoiceData.Status === true && ordersBulkInvoiceData.StatusCode === 204) {
            customAlert({
                Type: 3,
                Message: ordersBulkInvoiceData.Message,
            })
            dispatch(getOrdersMakeInvoiceDataActionSuccess({ Status: false }));
            return
        }
    }, [ordersBulkInvoiceData]);

    useEffect(() => {
        const Todate = _cfunc.ToDate({ FromDate: values.FromDate, Todate: values.ToDate })
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = Todate;
            a.hasValid.ToDate.valid = true
            return a
        })

    }, [values.FromDate]);

    //order confirm
    useEffect(() => {

        if (orderConfirmMsg.Status === true && orderConfirmMsg.StatusCode === 200 && !(orderConfirmMsg.conform_saveInvoice)) {
            dispatch(postOrderConfirms_API_Success({ Status: false }))
            goButtonHandler("event",)
            customAlert({
                Type: 1,
                Message: orderConfirmMsg.Message,
            })


        } else if (orderApprovalMsg.Status === true) {
            dispatch(postOrderConfirms_API_Success({ Status: false }))
            customAlert({
                Type: 2,
                Message: JSON.stringify(orderConfirmMsg.Message),
            })
        }
    }, [orderConfirmMsg]);

    useEffect(() => {

        orderApprovalMessage({ dispatch, orderApprovalMsg, goButtonHandler })

    }, [orderApprovalMsg]);

    // useEffect(() => {
    //     orderApprovalFunc({ dispatch, approvalDetail })
    // }, [approvalDetail]);

    useEffect(() => {
        if (unhideMsg.Status === true && unhideMsg.StatusCode === 200) {
            dispatch(_act.hideInvoiceForGRFActionSuccess({ Status: false }));
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: unhideMsg.Message,
            })
        } else if (unhideMsg.Status === true) {
            dispatch(_act.hideInvoiceForGRFActionSuccess({ Status: false }));
            customAlert({
                Type: 2,
                Message: JSON.stringify(unhideMsg.Message),
            })
        }

    }, [unhideMsg]);

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    supplierOptions.unshift({
        value: "",
        label: " All"
    });

    const customerTypeOptions = customerType.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    const CountryListOptions = countryList?.map((data) => ({
        value: data.id,
        label: data.Country,
        CurrencySymbol: data.CurrencySymbol
    }));

    function oderAprovalBtnFunc({ editId, btnId }) {

        // _cfunc.btnIsDissablefunc({ btnId, state: false })
        let config = {}
        config.btnId = btnId;
        config.orderId = editId;
        // dispatch(getOrderApprovalDetailAction(config))
        dispatch(orderApprovalAction({ jsonBody: JSON.stringify({ Order: editId }), btnId }))
    }

    const makeBtnFunc = (list = [], btnId) => {

        const obj = list[0]

        const customer = {
            value: obj.CustomerID,
            label: obj.Customer,
            GSTIN: obj.CustomerGSTIN,
            IsTCSParty: obj.IsTCSParty,
            ISCustomerPAN: obj.CustomerPAN,
            AdvanceAmount: obj.AdvanceAmount,
            OrderID: obj.id
        }

        const jsonBody = JSON.stringify({
            FromDate: obj.OrderDate,
            Customer: obj.CustomerID,
            Party: _cfunc.loginSelectedPartyID(),
            OrderIDs: obj.id.toString(),
            IsRateWise: isVisibleRateDrop ? 2 : 1

        });

        if (subPageMode === url.IB_INVOICE_STP) {
            dispatch(_act.makeIB_InvoiceAction({
                jsonBody, path: url.IB_INVOICE,
                pageMode: mode.defaultsave,
                customer,
                btnId
            }));
        }
        else if (orderList4_or_app_orderList) {
            Actionhandler({
                action: _act.GoButtonForinvoiceAdd, // The function you want to call
                params: {
                    jsonBody,
                    btnId,
                    customer,
                    subPageMode: _cfunc.loginUserIsFranchisesRole() ? url.FRANCHAISE_INVOICE : url.INVOICE_1,
                    path: _cfunc.loginUserIsFranchisesRole() ? url.FRANCHAISE_INVOICE : url.INVOICE_1,
                    pageMode: mode.defaultsave,

                },
            });
        }
        else {

            var isGRNSelect = ''

            const grnRef = []
            if (list.length > 0) {
                list.forEach(ele => {
                    if (ele.hasSelect) {
                        grnRef.push({
                            Invoice: (ele.OrderType === 3) ? ele.id : null,
                            Order: (ele.OrderType === 1) ? ele.id : null,
                            Full_OrderNumber: ele.FullOrderNumber,
                            Inward: url.GRN_STP_3 ? true : false,
                            Challan: ele.POType === "Challan" ? ele.id : '',
                            POType: ele.POType,
                            OrderDate: ele.OrderDate,
                            CustomerID: ele.CustomerID,
                            CustomerName: ele.Customer,
                            GRN_From: subPageMode

                        });
                        isGRNSelect = isGRNSelect.concat(`${ele.id},`)

                    }
                });

                if (isGRNSelect) {
                    let path = (subPageMode === url.GRN_STP_3 ? url.GRN_ADD_3 : url.GRN_ADD_1)
                    isGRNSelect = isGRNSelect.replace(/,*$/, '');//****** withoutLastComma  function */
                    let isMode = 1                               // define isMode for MakeBtn API
                    if (list[0].POType === "Challan") {
                        isMode = 2
                    }

                    if (subPageMode === url.GRN_STP_3) {
                        isMode = isSweetAndSnacksCompany ? 1 : 3
                        path = isSweetAndSnacksCompany ? url.GRN_ADD_1 : url.GRN_ADD_3
                    } else if (subPageMode === url.IB_ORDER_SO_LIST) {
                        path = url.IB_INVOICE
                    }

                    const jsonBody = JSON.stringify({
                        OrderIDs: isGRNSelect,
                        Mode: subPageMode === url.IB_ORDER_SO_LIST ? undefined : isMode,
                        DemandDate: subPageMode === url.IB_ORDER_SO_LIST ? list[0].OrderDate : undefined,
                        Party: subPageMode === url.IB_ORDER_SO_LIST ? _cfunc.loginPartyID() : undefined
                    })

                    if (subPageMode === url.ORDER_LIST_1) {
                        Actionhandler({
                            action: _act.makeGRN_Mode_1Action, // The function you want to call
                            params: { jsonBody, subPageMode, pageMode, path: path, grnRef, InvoiceDate: obj.dashboardOrderDate, btnId: `btn-makeBtn-${obj.id}` },
                        });
                    } else {
                        dispatch(_act.makeGRN_Mode_1Action({ jsonBody, subPageMode, pageMode, path: path, grnRef, InvoiceDate: obj.dashboardOrderDate, btnId: `btn-makeBtn-${obj.id}` }))

                    }


                } else {
                    alert("Please Select Order1")
                }
            }
        }
    }

    function editBodyfunc(config) {

        const { rowData } = config;
        try {
            const jsonBody = JSON.stringify({
                Party: rowData.SupplierID,
                Customer: rowData.CustomerID,
                EffectiveDate: rowData.OrderDate,
                OrderID: (subPageMode === url.IB_ORDER_PO_LIST) ? 0 : rowData.id,
                Demand: (subPageMode === url.IB_ORDER_PO_LIST) ? rowData.id : 0,
                RateParty: rowData.CustomerID,
                OrderType: ((subPageMode === url.ORDER_4) || (subPageMode === url.APP_ORDER_LIST)) ? order_Type.SaleOrder : order_Type.PurchaseOrder
            })

            dispatch(_act.editOrderId({ jsonBody, ...config, subPageMode }));
        } catch (error) { }
    }

    function downBtnFunc(config) {

        let id = config.rowData.id
        config["ReportType"] = report.order1;
        if (subPageMode === url.IB_ORDER_PO_LIST || subPageMode === url.IB_ORDER_SO_LIST) {
            dispatch(_act.getpdfReportdata(IB_Order_Get_Api, config))
        } else {
            config['jsonBody'] = {
                "OrderIDs": id.toString()
            }

            dispatch(_act.getpdfReportdata(order_Single_and_Multiple_Print_API, config))
        }

    }

    function thermalprintBtnFunc(config) {
        let id = config.rowData.id
        const reportType = report.orderThermalPrintReport
        config["ReportType"] = reportType;
        config['jsonBody'] = {
            "OrderIDs": id.toString()
        }
        dispatch(_act.getpdfReportdata(order_Single_and_Multiple_Print_API, config))
    }


    function minPrintBtn_Func(config) {
        let id = config.rowData.id
        let reportType = ""
        if (subPageMode === url.ORDER_LIST_4) {
            reportType = report.FrenchiesesOrder
        } else {
            reportType = report.FrenchiesesOrder
        }
        config["ReportType"] = reportType;
        config['jsonBody'] = {
            "OrderIDs": id.toString()
        }
        dispatch(_act.getpdfReportdata(order_Single_and_Multiple_Print_API, config))
    }



    async function hideBtnFunc(rowdata) {
        const isHideValue = rowdata[0].isHideValue
        const RowInvoiceId = rowdata[0].id

        let jsonBody = JSON.stringify({ InvoiceID: RowInvoiceId, Mode: isHideValue, Comment: "" })
        const isConfirmed = await customAlert({
            Type: 7,
            Message: alertMessages.unHideInvoiceOrNot,
        });

        if (isConfirmed) {
            dispatch(_act.hideInvoiceForGRFAction({ jsonBody }))
        }
    }

    function viewApprovalBtnFunc(config) {
        let id = config.rowData.id

        config['jsonBody'] = {
            "OrderIDs": id.toString()
        }
        dispatch(_act.viewOrderSingleget(config))
    }

    function goButtonHandler(event, IBType) {

        _cfunc.btnIsDissablefunc({ btnId: gobtnId, state: true })
        try {
            if ((_cfunc.loginSelectedPartyID() === 0)) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            let filtersBody = {}
            const isCustomerType = values.CustomerType.filter(i => !(i.value === '')).map(obj => obj.value).join(',');

            const PO_filters = {
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Supplier": values.Supplier.value,
                "Customer": _cfunc.loginSelectedPartyID(),
                "OrderType": order_Type.PurchaseOrder,
                "CustomerType": "",
                "IBType": IBType ? IBType : otherState.IBType,
                "DashBoardMode": 0,
                "Country": values.CountryName.value

            }
            const SO_filters = {
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Supplier": _cfunc.loginSelectedPartyID(),//Suppiler swipe
                "Customer": values.Supplier.value,//customer swipe
                "OrderType": order_Type.SaleOrder,
                "CustomerType": isCustomerType,
                "IBType": IBType ? IBType : otherState.IBType,
                "DashBoardMode": 0,
                "Country": values.CountryName.value

            }
            const GRN_STP_3_filters = {
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Supplier": values.Supplier.value,
                "Customer": _cfunc.loginSelectedPartyID(),
                "OrderType": isSweetAndSnacksCompany ? order_Type.PurchaseOrder : order_Type.InvoiceToGRN,
                "CustomerType": '',
                "IBType": IBType ? IBType : otherState.IBType,
                "DashBoardMode": 0,
                "Country": values.CountryName.value

            }

            if (orderList4_or_app_orderList || subPageMode === url.IB_ORDER_SO_LIST) {
                filtersBody = JSON.stringify(SO_filters);
            }
            else if (subPageMode === url.GRN_STP_3) {
                filtersBody = JSON.stringify(GRN_STP_3_filters);
            }
            else {
                filtersBody = JSON.stringify(PO_filters);
            }

            dispatch(_act.getOrderListPage({ subPageMode, filtersBody, btnId: gobtnId, userAccess }));

        } catch (error) { _cfunc.btnIsDissablefunc({ btnId: gobtnId, state: false }) }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    function supplierOnchange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.Supplier = e;
            a.hasValid.Supplier.valid = true
            return a
        })
    }

    function CountryOnchange(e) {

        let StorageDetails = JSON.parse(localStorage.getItem("roleId"));

        StorageDetails.Country = e.label;  // Updating age
        StorageDetails.Country_id = e.value;
        StorageDetails.CurrencySymbol = e.CurrencySymbol;
        StorageDetails.Weight = e.Weight;
        localStorage.setItem("roleId", JSON.stringify(StorageDetails));
        setState((i) => {
            const a = { ...i }
            a.values.CountryName = e;
            a.hasValid.CountryName.valid = true
            return a
        })

        const elements = document.querySelectorAll('.CurrencySymbol-Class');
        elements.forEach((element) => {
            element.innerHTML = e.CurrencySymbol;
        });
        dispatch(_act.getOrderListPageSuccess([]));//for clear privious order list  

    }
    function customerTypeOnchange(e = []) {

        if (e.length === 0) {
            e = [allLabelWithBlank]
        } else {
            e = e.filter(i => !(i.value === ''))
        }
        setState((i) => {
            const a = { ...i }
            a.values.CustomerType = e;
            a.hasValid.CustomerType.valid = true
            return a
        })
    }

    const OrderConfirm_Handler = (row = []) => {


        let ischeck = row.filter(i => (i.selectCheck && !i.forceSelectDissabled))
        if (!ischeck.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneOrder,
            });
            return
        }
        let idString = ischeck.map(obj => obj.id).join(',')
        let jsonBody = { OrderIDs: idString }
        dispatch(postOrderConfirms_API({ jsonBody }))
    }

    const BulkInvoice_Handler = (allList = []) => {
        debugger
        // let checkRows = allList.filter(i => ((i.selectCheck || i.ExtraSelect) && (!i.forceSelectDissabled) || (!i.forceExtraSelectDissabled)))

        let checkRows = allList.filter(i => {
            return (((i.selectCheck || i.ExtraSelect)) && ((!i.forceSelectDissabled) || (!i.forceExtraSelectDissabled)));
        });

        if (((subPageMode === url.ORDER_LIST_4) && (isSweetAndSnacksCompany))) {
            const isSameCustumer = checkRows.every(item => item.CustomerID === checkRows[0].CustomerID);
            if (!isSameCustumer) {
                customAlert({
                    Type: 3,
                    Message: alertMessages.selectSameCustomer,
                });
                return
            }
        }

        if (!checkRows.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneOrder,
            });
            return
        }
        let idString = checkRows.map(row => row.id).join(',')
        let jsonBody = {
            OrderIDs: idString,
            "Customer": null,
            "Party": _cfunc.loginSelectedPartyID(),
            IsRateWise: isVisibleRateDrop ? 2 : 1
        }


        dispatch(getOrdersMakeInvoiceDataAction({ jsonBody, subPageMode: subPageMode, path: url.INVOICE_1 }));
    }

    const pageFieldMaster = reducers?.pageField?.PageFieldMaster;

    if (Array.isArray(pageFieldMaster) && !(IsFranchises)) {

        for (let i = pageFieldMaster.length - 1; i >= 0; i--) {
            if (pageFieldMaster[i].ControlID === "AdvanceAmount") {
                pageFieldMaster.splice(i, 1);
            }
        }
    }


    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >
                    <Col lg={(orderList4_or_app_orderList) ? 2 : 3} className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>  {!(fieldLabel.FromDate === '') ? fieldLabel.FromDate : "FromDate"}</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    options={{
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
                                    name='FromDate'
                                    value={values.FromDate}
                                    onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col lg={(orderList4_or_app_orderList) ? 2 : 3} className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>  {!(fieldLabel.ToDate === '') ? fieldLabel.ToDate : "ToDate"}</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    options={{
                                        minDate: (_cfunc.disablePriviousTodate({ fromDate: values.FromDate })),
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
                                    name="ToDate"
                                    value={_cfunc.ToDate({ FromDate: values.FromDate, Todate: values.ToDate })}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>


                    {(orderList4_or_app_orderList) &&
                        <Col lg={3}>
                            <FormGroup className="mb-1 row mt-3 " >
                                <Label className="col-sm p-2"
                                >
                                    {!(fieldLabel.CustomerType === '') ? fieldLabel.CustomerType : "Customer Type"}
                                </Label>
                                <Col sm="8">
                                    <C_Select
                                        name="CustomerType"
                                        classNamePrefix="select2-Customer"
                                        value={values.CustomerType}
                                        options={customerTypeOptions}
                                        onChange={customerTypeOnchange}
                                        isMulti={true}
                                        isLoading={customerTypeDropLoading}
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                    />
                                </Col>
                            </FormGroup>

                        </Col >}

                    <Col lg={(orderList4_or_app_orderList) ? 4 : 5}>
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"

                                style={{ width: "115px" }}>{(!(fieldLabel.Supplier === '')) ? fieldLabel.Supplier : (orderList4_or_app_orderList ? "Customer" : "Supplier")}</Label>
                            <Col sm="8">

                                <C_Select
                                    name="Supplier"
                                    classNamePrefix="select2-Customer"
                                    value={values.Supplier}
                                    options={supplierOptions}
                                    onChange={supplierOnchange}
                                    isLoading={supplierDropLoading}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>


                        </FormGroup>
                    </Col >


                    <Col sm="1" className="mt-3 ">
                        <Go_Button loading={reducers.goBtnloading} id={gobtnId} onClick={goButtonHandler} />
                    </Col>
                </div>
                <div>
                    {
                        (subPageMode === url.ORDER_LIST_4 && LoginDetails?.PartyType === "Division") &&

                        <Col lg={2} className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}> {(!(fieldLabel.CountryName === '')) ? fieldLabel.CountryName : "Country"}</Label>
                                <Col sm="7">
                                    <C_Select
                                        name="CountryName"
                                        classNamePrefix="select2-Customer"
                                        value={values.CountryName}
                                        options={CountryListOptions}
                                        onChange={CountryOnchange}
                                        isLoading={countryListloading}
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                    }
                </div>
            </div >
        )
    }

    const ExtraSelectBtnHandler = (row = []) => {

        let config = {};
        let ischeck = row.filter(i => (i.ExtraSelect))
        if (!ischeck.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneOrder,
            });
            return
        }
        let idString = ischeck.map(obj => obj.id).join(',')
        config["ReportType"] = report.FrenchiesesOrder;
        config['jsonBody'] = { OrderIDs: idString }
        dispatch(_act.getpdfReportdata(order_Single_and_Multiple_Print_API, config))

    };





    const headerselecthandler = ({ event, tableList }) => {

        const isChecked = event.currentTarget.checked
        let updatedTableList = []

        if (subPageMode === url.ORDER_LIST_4 && isSweetAndSnacksCompany) {
            updatedTableList = tableList.map(row => ({

                ...row,
                ExtraSelect: row.InvoiceCreated ? false : isChecked
            }));
        } else {
            updatedTableList = tableList.map(row => ({
                ...row,
                ExtraSelect: isChecked
            }));
        }



        dispatch(_act.getOrderListPageSuccess(updatedTableList))
    }


    const selecthandler = ({ event, rowData, tableList }) => {
        const isChecked = event.currentTarget.checked
        rowData.ExtraSelect = isChecked

    }


    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.goBtnloading || !pageField} />

            <div className="page-content">

                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={tableAction}
                            reducers={reducers}
                            showBreadcrumb={false}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            minPrintBtn_Func={minPrintBtn_Func}
                            HeaderContent={HeaderContent}
                            viewApprovalBtnFunc={viewApprovalBtnFunc}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            editBodyfunc={editBodyfunc}
                            thermalprintBtnFunc={thermalprintBtnFunc}
                            makeBtnFunc={makeBtnFunc}
                            hideBtnFunc={hideBtnFunc}
                            ButtonMsgLable={subPageMode === url.IB_ORDER_PO_LIST ? "Demand" : subPageMode === url.IB_ORDER_SO_LIST ? "" : "Order"}
                            deleteName={"FullOrderNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={Order}
                            ViewModal={OrderView}
                            oderAprovalBtnFunc={oderAprovalBtnFunc}
                            extraSelect={extraSelect}
                            selectCheckParams={{
                                isExtraSelectShow: (subPageMode === url.ORDER_LIST_4 && LoginDetails?.PartyType === "Division") || (subPageMode === url.ORDER_LIST_4 && (isSweetAndSnacksCompany)) ? true : false,
                                ExtraSelectBtnHandler: ((subPageMode === url.ORDER_LIST_4) && (isSweetAndSnacksCompany)) ? BulkInvoice_Handler : ExtraSelectBtnHandler,
                                ExtraSelectLabel: (subPageMode === url.ORDER_LIST_4 && LoginDetails?.PartyType === "Division") ? "Print All" : "Bulk Invoice",
                                headerselecthandler: headerselecthandler,
                                selecthandler: selecthandler,
                                ExtraBtnLoading: printAllBtnLoading || makeBulkInvoiceLoading,
                                // isShow: (subPageMode === url.ORDER_LIST_4 || (hasBulkinvoiceSaveAccess && subPageMode === url.APP_ORDER_LIST)),
                                selectSaveBtnHandler: (subPageMode === url.ORDER_LIST_4) ? OrderConfirm_Handler : BulkInvoice_Handler,
                                selectSaveBtnLabel: (subPageMode === url.ORDER_LIST_4) ? "Confirm" : "Bulk Invoice",
                                selectHeaderLabel: (subPageMode === url.ORDER_LIST_4) ? "Confirm" : "Bulk Invoice",
                                selectSaveBtnLoading: subPageMode === url.APP_ORDER_LIST && makeBulkInvoiceLoading,
                            }}
                            totalAmountShow={true}
                        />
                        : null
                }

            </div>

            <OrderView_Modal />{/** order view component */}

        </React.Fragment>
    )
}

export default OrderList;