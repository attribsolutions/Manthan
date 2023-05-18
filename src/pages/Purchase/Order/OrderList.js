import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import Flatpickr from "react-flatpickr";
import {
    deleteOrderId,
    deleteOrderIdSuccess,
    editOrderId,
    editOrderIdSuccess,
    getOrderListPage,
    getOrderListPageSuccess,
    orderApprovalAction,
    orderApprovalActionSuccess,
    updateOrderIdSuccess,
} from "../../../store/Purchase/OrderPageRedux/actions";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import Order from "./Order";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { makeGRN_Mode_1Action } from "../../../store/Inventory/GRNRedux/actions";
import { GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { btnIsDissablefunc, convertDatefunc, currentDate_ymd, loginPartyID } from "../../../components/Common/CommonFunction";
import { Go_Button } from "../../../components/Common/CommonButton";
import * as report from '../../../Reports/ReportIndex'
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import { OrderPage_Edit_ForDownload_API } from "../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { order_Type } from "../../../components/Common/C-Varialbes";
import { GoButtonForinvoiceAdd, makeIB_InvoiceAction } from "../../../store/Sales/Invoice/action";
import { comAddPageFieldFunc, initialFiledFunc } from "../../../components/Common/validationFunction";
import { CustomAlert } from "../../../CustomAlert/ConfirmDialog";


const OrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Supplier: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false,
        makeBtnShow: '',
        makeBtnName: '',
        IBType: '',
        isOrderApproval: false
    });

    const reducers = useSelector(
        (state) => ({
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            tableList: state.OrderReducer.orderList,
            GRNitem: state.GRNReducer.GRNitem,
            makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
            deleteMsg: state.OrderReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.OrderReducer.editData,
            orderApprovalMsg: state.OrderReducer.orderApprovalMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,

        })
    );

    const gobtnId = `gobtn-${subPageMode}`
    const { pageField, GRNitem, supplier, makeIBInvoice, orderApprovalMsg } = reducers;

    const values = { ...state.values }
    const { fieldLabel } = state;

    const action = {
        getList: getOrderListPage,
        deleteId: deleteOrderId,
        postSucc: postMessage,
        updateSucc: updateOrderIdSuccess,
        deleteSucc: deleteOrderIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false;
        let IBType = '';
        let newBtnPath = '';
        let makeBtnName = '';
        let isOrderApproval = false;

        if (subPageMode === url.ORDER_LIST_1) {
            page_Id = pageId.ORDER_LIST_1;
            masterPath = url.ORDER_1;
            newBtnPath = url.ORDER_1;
        }
        else if (subPageMode === url.ORDER_LIST_2) {
            page_Id = pageId.ORDER_LIST_2
            masterPath = url.ORDER_2;
            newBtnPath = url.ORDER_2;
            isOrderApproval = true
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
        dispatch(getOrderListPageSuccess([]))//for clear privious order list
        setOtherState({ masterPath, makeBtnShow, newBtnPath, makeBtnName, IBType, isOrderApproval })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Order Count"} :0`))
        dispatch(GetVenderSupplierCustomer(subPageMode))
        goButtonHandler("event", IBType)

    }, []);

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldList
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    supplierOptions.unshift({
        value: "",
        label: " All"
    });

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
        
        if (orderApprovalMsg.Status === true && orderApprovalMsg.StatusCode === 200) {
            dispatch(orderApprovalActionSuccess({ Status: false }))
            CustomAlert({
                Type: 1,
                Message: orderApprovalMsg.Message,
            })
        } else if (orderApprovalMsg.Status === true) {
            dispatch(orderApprovalActionSuccess({ Status: false }))
            CustomAlert({
                Type: 4,
                Message: JSON.stringify(orderApprovalMsg.Message),
            })
        }

    }, [orderApprovalMsg]);


    const makeBtnFunc = (list = []) => {

        const obj = list[0]
        if (subPageMode === url.IB_INVOICE_STP) {
            const jsonBody = JSON.stringify({
                FromDate: obj.preOrderDate,
                Customer: obj.CustomerID,
                Party: loginPartyID(),
                OrderIDs: `${obj.id}`
            });
            const customer = {
                value: obj.CustomerID,
                label: obj.Customer
            }
            dispatch(makeIB_InvoiceAction({ jsonBody, path: url.IB_INVOICE, pageMode: mode.defaultsave, customer }));
        }
        else if (subPageMode === url.ORDER_LIST_4) {
            const { CustomerID, id, OrderDate } = obj
            history.push(url.INVOICE_1, obj);

            const jsonBody = JSON.stringify({
                OrderIDs: id.toString(),
                FromDate: convertDatefunc(OrderDate),
                Customer: CustomerID,
                Party: loginPartyID(),
            });
            dispatch(GoButtonForinvoiceAdd({ subPageMode: url.INVOICE_1, jsonBody, btnId: gobtnId }));
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

                    dispatch(makeGRN_Mode_1Action({ jsonBody, pageMode, path: path, grnRef, challanNo }))

                } else {
                    alert("Please Select Order1")
                }
            }
        }
    }

    function editBodyfunc(config) {
        const { rowData, btnId } = config;
        btnIsDissablefunc({ btnId, state: true })
        try {
            const jsonBody = JSON.stringify({
                Party: rowData.SupplierID,
                Customer: rowData.CustomerID,
                EffectiveDate: rowData.preOrderDate,
                OrderID: rowData.id,
                RateParty: rowData.CustomerID
            })
            dispatch(editOrderId({ jsonBody, ...config }));
        } catch (error) { btnIsDissablefunc({ btnId, state: false }) }
    }

    function downBtnFunc(row) {
        var ReportType = report.order1;
        dispatch(getpdfReportdata(OrderPage_Edit_ForDownload_API, ReportType, row.id))
    }

    function goButtonHandler(event, IBType) {

        btnIsDissablefunc({ btnId: gobtnId, state: true })
        try {
            let filtersBody = {}
            const PO_filters = {
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                Supplier: values.Supplier.value,
                Customer: loginPartyID(),
                OrderType: order_Type.PurchaseOrder,
                IBType: IBType ? IBType : otherState.IBType
            }
            const SO_filters = {
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                Supplier: loginPartyID(),//Suppiler swipe
                Customer: values.Supplier.value,//customer swipe
                OrderType: order_Type.SaleOrder,
                IBType: IBType ? IBType : otherState.IBType
            }
            const GRN_STP_3_filters = {
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                Supplier: values.Supplier.value,
                Customer: loginPartyID(),
                OrderType: order_Type.InvoiceToGRN,
                IBType: IBType ? IBType : otherState.IBType
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
            dispatch(getOrderListPage({ subPageMode, filtersBody, btnId: gobtnId }));

        } catch (error) { btnIsDissablefunc({ btnId: gobtnId, state: false }) }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        // let newObj = { ...orderlistFilter }
        // newObj.fromdate = date
        // setorderlistFilter(newObj)
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        // let newObj = { ...orderlistFilter }
        // newObj.todate = date
        // setorderlistFilter(newObj)
    }

    function supplierOnchange(e) {

        setState((i) => {
            const a = { ...i }
            a.values.Supplier = e;
            a.hasValid.Supplier.valid = true
            return a
        })
        // let newObj = { ...orderlistFilter }
        // newObj.supplierSelect = e
        // setorderlistFilter(newObj)
    }

    function orderApprovalFunc(editData) {

        const { Data, btnId } = editData;

        let isorderItemSet = [];
        Data.OrderItems.forEach(i => {
            if (i.Quantity > 0) {
                isorderItemSet.push({
                    "OrderNo": Data.id,//parent id
                    "ItemNo": i.Item_id, //OrderItem--id
                    "Material": i.SAPItemCode,//OrderItem--SAPItemCode
                    "Quantity": i.Quantity,//OrderItem--Quantity
                    "Unit": i.SAPUnitName,//OrderItem--SAPUnitName
                    "Plant": Data.SupplierSAPCode,//parent
                    "Batch": ""// blank
                })
            }
        })
        let body = {
            "Customer": Data.CustomerSAPCode,//parent--CustomerSAPCode 
            "DocDate": Data.OrderDate, //parent--OrderDate
            "Indicator": "F",
            "OrderNo": Data.id,//parent--id
            "Stats": "1",
            "OrderItemSet": isorderItemSet,
            "CancelFlag": "" //blank
        }
        const jsonBody = JSON.stringify(body);

        dispatch(editOrderIdSuccess({ Status: false }))
        dispatch(orderApprovalAction({ jsonBody, btnId }))
    }

    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "83px" }}>
                                {!(fieldLabel.FromDate === '') ? fieldLabel.FromDate : "FromDate"}
                            </Label>
                            <Col sm="7">
                                <Flatpickr
                                    name='FromDate'
                                    value={values.FromDate}
                                    className="form-control d-block p-2 bg-white text-dark"
                                    placeholder="Select..."
                                    options={{
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
                                    onChange={fromdateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>
                                {!(fieldLabel.ToDate === '') ? fieldLabel.ToDate : "ToDate"}
                            </Label>
                            <Col sm="7">
                                <Flatpickr
                                    name="ToDate"
                                    value={values.ToDate}
                                    className="form-control d-block p-2 bg-white text-dark"
                                    placeholder="Select..."
                                    options={{
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>
                                {!(fieldLabel.Supplier === '') ? fieldLabel.Supplier : "Supplier"}
                            </Label>
                            <Col sm="5">
                                <Select
                                    name="Supplier"
                                    classNamePrefix="select2-Customer"
                                    value={values.Supplier}
                                    options={supplierOptions}
                                    onChange={supplierOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button id={gobtnId} onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="page-content">
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            HeaderContent={HeaderContent}

                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            editBodyfunc={editBodyfunc}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"Order"}
                            deleteName={"FullOrderNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={Order}
                            orderApproval={otherState.isOrderApproval && orderApprovalFunc}

                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default OrderList;