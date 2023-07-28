import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { Col, FormGroup, Label, Modal } from "reactstrap";
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
import { OrderPage_Edit_ForDownload_API } from "../../../helpers/backend_helper";
import { comAddPageFieldFunc, initialFiledFunc } from "../../../components/Common/validationFunction";
import { getOrderApprovalDetailAction, postOrderConfirms_API, postOrderConfirms_API_Success } from "../../../store/actions";
import { orderApprovalFunc, orderApprovalMessage } from "./orderApproval";
import { priceListByCompay_Action, priceListByCompay_ActionSuccess } from "../../../store/Administrator/PriceList/action";
import OrderView from "./OrderView";
import OrderView_Modal from "./OrderView";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";


const OrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Supplier: { value: "", label: "All" },
        CustomerType: [{ value: "", label: "All" }]
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);

    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false,
        makeBtnShow: '',
        makeBtnName: '',
        IBType: '',
        showAprovalBtn: false
    });

    const reducers = useSelector(
        (state) => ({

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
            approvalDetail: state.OrderReducer.approvalDetail,

            customerType: state.PriceListReducer.priceListByCompany,
            customerTypeDropLoading: state.PriceListReducer.listBtnLoading,

            orderConfirmMsg: state.OrderReducer.orderConfirmMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,

            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            supplierDropLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,

            gobutton_Add_invoice: state.InvoiceReducer.gobutton_Add,
            goBtnloading: state.OrderReducer.goBtnLoading,
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
        approvalDetail,
        customerType,
        orderConfirmMsg,
        gobutton_Add_invoice,
        customerTypeDropLoading,
        supplierDropLoading
    } = reducers;

    const values = { ...state.values }
    const { fieldLabel } = state;

    const tableAction = {
        getList: _act.getOrderListPage,
        deleteId: _act.deleteOrderId,
        postSucc: _act.saveOrderActionSuccess,
        updateSucc: _act.updateOrderIdSuccess,
        deleteSucc: _act.deleteOrderIdSuccess,
    }

    // Featch Modules List data  First Rendering
    useLayoutEffect(() => {

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
        }
        else if (subPageMode === url.ORDER_LIST_2) {
            page_Id = pageId.ORDER_LIST_2
            masterPath = url.ORDER_2;
            newBtnPath = url.ORDER_2;
            showAprovalBtn = true
        }
        else if (subPageMode === url.IB_ORDER_PO_LIST) {
            page_Id = pageId.IB_ORDER_PO_LIST
            masterPath = url.IB_ORDER;
            newBtnPath = url.IB_ORDER;
            IBType = "IBPO"
        }
        else if (subPageMode === url.IB_ORDER_SO_LIST) {
            page_Id = pageId.IB_ORDER_SO_LIST
            masterPath = url.IB_ORDER;
            makeBtnShow = true;
            makeBtnName = "Make IBInvoice"
            IBType = "IBSO"
        }
        else if (subPageMode === url.ORDER_LIST_4) {
            page_Id = pageId.ORDER_LIST_4
            masterPath = url.ORDER_4;
            page_Mode = mode.modeSTPList
            newBtnPath = url.ORDER_4;
            makeBtnShow = true;
            makeBtnName = "Make Invoice"
            showAprovalBtn = true                      //Showing  AprovalBtn  in sales order list

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
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make GRN"
        }
        else if (subPageMode === url.GRN_STP_3) {
            page_Id = pageId.GRN_STP_3
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make GRN"

        }

        setOtherState({ masterPath, makeBtnShow, newBtnPath, makeBtnName, IBType, showAprovalBtn })
        setPageMode(page_Mode)
        dispatch(_act.commonPageFieldListSuccess(null))
        dispatch(_act.commonPageFieldList(page_Id))
        dispatch(_act.BreadcrumbShowCountlabel(`${"Order Count"} :0`))
        dispatch(_act.GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))
        if (!(_cfunc.loginPartyID() === 0)) {
            goButtonHandler("event", IBType)
        }
        dispatch(priceListByCompay_Action());

        return () => {
            dispatch(_act.commonPageFieldListSuccess(null))
            dispatch(_act.getOrderListPageSuccess([]))//for clear privious order list  
            dispatch(_act.orderSinglegetSuccess({ Status: false }))
            dispatch(_act.GetVenderSupplierCustomerSuccess([]))
            dispatch(priceListByCompay_ActionSuccess([]))


        }
    }, []);

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
                page_Mode: GRNitem.page_Mode,
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

        if (orderConfirmMsg.Status === true && orderConfirmMsg.StatusCode === 200) {
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

    useEffect(() => {
        orderApprovalFunc({ dispatch, approvalDetail })
    }, [approvalDetail]);


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

    function oderAprovalBtnFunc({ editId, btnId }) {

        // _cfunc.btnIsDissablefunc({ btnId, state: false })
        let config = {}
        config.btnId = btnId;
        config.orderId = editId;
        dispatch(getOrderApprovalDetailAction(config))
    }

    const makeBtnFunc = (list = [], btnId) => {

        const obj = list[0]

        const customer = {
            value: obj.CustomerID,
            label: obj.Customer,
            GSTIN: obj.CustomerGSTIN,
            IsTCSParty: obj.IsTCSParty,
            ISCustomerPAN: obj.CustomerPAN
        }
        const jsonBody = JSON.stringify({
            FromDate: obj.preOrderDate,
            Customer: obj.CustomerID,
            Party: _cfunc.loginPartyID(),
            OrderIDs: obj.id.toString(),
        });

        if (subPageMode === url.IB_INVOICE_STP) {
            dispatch(_act.makeIB_InvoiceAction({
                jsonBody, path: url.IB_INVOICE,
                pageMode: mode.defaultsave,
                customer,
                btnId
            }));
        }
        else if (subPageMode === url.ORDER_LIST_4) {
            dispatch(_act.GoButtonForinvoiceAdd({
                jsonBody,
                btnId,
                customer,
                subPageMode: url.INVOICE_1,
                path: url.INVOICE_1,
                pageMode: mode.defaultsave,

            }));
        }
        else {
            var isGRNSelect = ''
            var challanNo = ''
            const grnRef = []
            if (list.length > 0) {
                list.forEach(ele => {
                    if (ele.hasSelect) {
                        grnRef.push({
                            Invoice: (subPageMode === url.GRN_STP_3) ? ele.id : null,
                            Order: !(subPageMode === url.GRN_STP_3) ? ele.POType === "Challan" ? '' : ele.id : null,
                            ChallanNo: ele.FullOrderNumber,
                            Inward: url.GRN_STP_3 ? true : false,
                            Challan: ele.POType === "Challan" ? ele.id : ''
                        });
                        isGRNSelect = isGRNSelect.concat(`${ele.id},`)
                        challanNo = challanNo.concat(`${ele.FullOrderNumber},`)
                    }
                });

                if (isGRNSelect) {
                    let path = (subPageMode === url.GRN_STP_3 ? url.GRN_ADD_3 : url.GRN_ADD_1)
                    isGRNSelect = isGRNSelect.replace(/,*$/, '');//****** withoutLastComma  function */
                    challanNo = challanNo.replace(/,*$/, '');           //****** withoutLastComma  function */

                    let isMode = 1                               // define isMode for MakeBtn API

                    if (list[0].POType === "Challan") {
                        isMode = 2
                    }
                    else if (subPageMode === url.GRN_STP_3) {
                        isMode = 3
                    }
                    const jsonBody = JSON.stringify({
                        OrderIDs: isGRNSelect,
                        Mode: isMode
                    })

                    dispatch(_act.makeGRN_Mode_1Action({ jsonBody, pageMode, path: path, grnRef, challanNo, btnId: `btn-makeBtn-${obj.id}` }))

                } else {
                    alert("Please Select Order1")
                }
            }
        }
    }

    function editBodyfunc(config) {
        const { rowData, btnId } = config;
        _cfunc.btnIsDissablefunc({ btnId, state: true })
        try {
            const jsonBody = JSON.stringify({
                Party: rowData.SupplierID,
                Customer: rowData.CustomerID,
                EffectiveDate: rowData.preOrderDate,
                OrderID: rowData.id,
                RateParty: rowData.CustomerID,
                OrderType: subPageMode === url.ORDER_4 ? order_Type.SaleOrder : order_Type.PurchaseOrder
            })
            dispatch(_act.editOrderId({ jsonBody, ...config }));
        } catch (error) { _cfunc.btnIsDissablefunc({ btnId, state: false }) }
    }

    function downBtnFunc(config) {
        config["ReportType"] = report.order1;
        dispatch(_act.getpdfReportdata(OrderPage_Edit_ForDownload_API, config))
    }

    function viewApprovalBtnFunc(config) {
        dispatch(_act.viewOrderSingleget(config))
    }

    function goButtonHandler(event, IBType) {

        _cfunc.btnIsDissablefunc({ btnId: gobtnId, state: true })
        try {
            if (_cfunc.loginPartyID() === 0) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            let filtersBody = {}
            const isCustomerType = values.CustomerType.filter(i => !(i.value === '')).map(obj => obj.value).join(',');

            const PO_filters = {
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Supplier": values.Supplier.value,
                "Customer": _cfunc.loginPartyID(),
                "OrderType": order_Type.PurchaseOrder,
                "CustomerType": "",
                "IBType": IBType ? IBType : otherState.IBType
            }
            const SO_filters = {
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Supplier": _cfunc.loginPartyID(),//Suppiler swipe
                "Customer": values.Supplier.value,//customer swipe
                "OrderType": order_Type.SaleOrder,
                "CustomerType": isCustomerType,
                "IBType": IBType ? IBType : otherState.IBType
            }
            const GRN_STP_3_filters = {
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Supplier": values.Supplier.value,
                "Customer": _cfunc.loginPartyID(),
                "OrderType": order_Type.InvoiceToGRN,
                "CustomerType": '',
                "IBType": IBType ? IBType : otherState.IBType
            }
            if (subPageMode === url.ORDER_LIST_4) {
                filtersBody = JSON.stringify(SO_filters);
            }
            else if (subPageMode === url.GRN_STP_3) {
                filtersBody = JSON.stringify(GRN_STP_3_filters);
            }
            else {
                filtersBody = JSON.stringify(PO_filters);
            }
            dispatch(_act.getOrderListPage({ subPageMode, filtersBody, btnId: gobtnId }));

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

    function customerTypeOnchange(e = []) {

        if (e.length === 0) {
            e = [{ value: "", label: "All" }]
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

    const selectSaveBtnHandler = (row = []) => {

        let ischeck = row.filter(i => (i.selectCheck))
        if (!ischeck.length > 0) {
            customAlert({
                Type: 2,
                Message: "Please Select One Order",
            });
            return
        }
        let idString = ischeck.map(obj => obj.id).join(',')
        let jsonBody = { OrderIDs: idString }
        dispatch(postOrderConfirms_API({ jsonBody }))
    }

    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >

                    <Col sm={subPageMode === url.ORDER_LIST_4 ? 2 : 3} >
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>
                                {!(fieldLabel.FromDate === '') ? fieldLabel.FromDate : "FromDate"}
                            </Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name='FromDate'
                                    value={values.FromDate}
                                    onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm={subPageMode === url.ORDER_LIST_4 ? 2 : 3} >
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>
                                {!(fieldLabel.ToDate === '') ? fieldLabel.ToDate : "ToDate"}
                            </Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name="ToDate"
                                    value={values.ToDate}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    {subPageMode === url.ORDER_LIST_4 ?
                        <Col sm="3">
                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"
                                    style={{ width: "115px" }}>
                                    {!(fieldLabel.CustomerType === '') ? fieldLabel.CustomerType : "Customer Type"}
                                </Label>
                                <Col sm="7">
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
                        </Col >
                        :
                        <Col sm='1' />
                    }



                    <Col sm="3">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>
                                {!(fieldLabel.Supplier === '') ? fieldLabel.Supplier : "Supplier"}
                            </Label>
                            <Col sm="7">
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

                    <Col sm="1" />
                    <Col sm="1" className="mt-3 ">
                        <Go_Button loading={reducers.loading} id={gobtnId} onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        )
    }

    function partyOnChngeButtonHandler() {
        dispatch(_act.getOrderListPageSuccess([]))
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.goBtnLoading || !pageField} />
            <div className="page-content">
                <PartyDropdown_Common changeButtonHandler={partyOnChngeButtonHandler} />
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
                            HeaderContent={HeaderContent}
                            viewApprovalBtnFunc={viewApprovalBtnFunc}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            editBodyfunc={editBodyfunc}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"Order"}
                            deleteName={"FullOrderNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={Order}
                            ViewModal={OrderView}
                            oderAprovalBtnFunc={otherState.showAprovalBtn && oderAprovalBtnFunc}
                            selectCheckParams={{
                                isRoleAccess: (true),
                                isShow: subPageMode === url.ORDER_LIST_4,
                                selectSaveBtnHandler: selectSaveBtnHandler,
                                selectSaveBtnLabel: "Confirm",
                                selectHeaderLabel: "Confirm"
                            }}
                        />
                        : null
                }
            </div>

            <OrderView_Modal />{/** order view component */}

        </React.Fragment>
    )
}

export default OrderList;