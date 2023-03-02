import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import Flatpickr from "react-flatpickr";
import {
    deleteOrderId,
    deleteOrderIdSuccess,
    editOrderId,
    getOrderListPage,
    updateOrderIdSuccess,
    orderlistfilters,
} from "../../../store/Purchase/OrderPageRedux/actions";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import Order from "./Order";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { getGRN_itemMode2 } from "../../../store/Inventory/GRNRedux/actions";
import { getSupplier, GetVender, GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { currentDate, excelDownCommonFunc, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import { Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import * as report from '../../../Reports/ReportIndex'
import * as url from "../../../routes/route_url";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import { OrderPage_Edit_ForDownload_API } from "../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";

import { MetaTags } from "react-meta-tags";
import { order_Type } from "../../../components/Common/C-Varialbes";
import { GoButtonForinvoiceAdd, makeIB_InvoiceAction, makeIB_InvoiceActionSuccess } from "../../../store/Sales/Invoice/action";


const OrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    // const [userAccState, setUserAccState] = useState('');
    const [orderlistFilter, setorderlistFilter] = useState('');
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, makeBtnShow: '', makeBtnName: '' ,IBType: ''});

    const reducers = useSelector(
        (state) => ({
            supplier: state.SupplierReducer.vendorSupplierCustomer,
            tableList: state.OrderReducer.orderList,
            GRNitem: state.GRNReducer.GRNitem,
            makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
            deleteMsg: state.OrderReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.OrderReducer.editData,
            // orderlistFilter: state.OrderReducer.orderlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );


    const { fromdate = currentDate, todate = currentDate, supplierSelect = { value: "", label: "All" } ,} = orderlistFilter;
    const { userAccess, pageField, GRNitem, supplier, tableList, makeIBInvoice } = reducers;


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

        if (subPageMode === url.ORDER_LIST_1) {
            page_Id = pageId.ORDER_LIST_1;
            masterPath = url.ORDER_1;
            newBtnPath = url.ORDER_1;
        }
        else if (subPageMode === url.ORDER_LIST_2) {
            page_Id = pageId.ORDER_LIST_2
            masterPath = url.ORDER_2;
            newBtnPath = url.ORDER_2;
        }
        else if (subPageMode === url.IB_ORDER_PO_LIST) {
            page_Id = pageId.IB_ORDER_PO_LIST
            masterPath = url.IB_ORDER;
            newBtnPath = url.IB_ORDER;
            IBType="IBPO"
        }
        else if (subPageMode === url.IB_ORDER_SO_LIST) {
            page_Id = pageId.IB_ORDER_SO_LIST
            masterPath = url.IB_ORDER;
            // newBtnPath = url.IB_ORDER;
            IBType="IBSO"
        }
        else if (subPageMode === url.ORDER_LIST_4) {
            page_Id = pageId.ORDER_LIST_4
            masterPath = url.ORDER_4;
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make Invoice"
        }
        else if (subPageMode === url.IB_INVOICE_STP) {
            page_Id = pageId.IB_INVOICE_STP
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make Invoice"
        }
        else if (subPageMode === url.GRN_STP) {
            page_Id = pageId.GRN_STP
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make GRN"
        }
        dispatch(getOrderListPage(""))//for clear privious order list
        setOtherState({ masterPath, makeBtnShow, newBtnPath, makeBtnName })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Order Count"} :0`))
        dispatch(GetVenderSupplierCustomer(subPageMode))
        goButtonHandler(IBType)

    }, []);

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    supplierOptions.unshift({
        value: "",
        label: " All"
    });

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])



    useEffect(() => {
        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
            history.push({
                pathname: GRNitem.path,
                page_Mode: GRNitem.page_Mode,
            })
        }
    }, [GRNitem])

    useEffect(() => {
        debugger
        if (makeIBInvoice.Status === true && makeIBInvoice.StatusCode === 200) {

            history.push({
                pathname: makeIBInvoice.path,
                page_Mode: makeIBInvoice.page_Mode,
            })
        }
    }, [makeIBInvoice])


    const makeBtnFunc = (list = []) => {

        const obj = list[0]
        if (subPageMode === url.IB_INVOICE_STP) {
            const jsonBody = JSON.stringify({
                FromDate: obj.preOrderDate,
                Customer: obj.CustomerID,
                Party: userParty(),
                OrderIDs: `${obj.id}`
            });
            const customer = {
                value: obj.CustomerID,
                label: obj.Customer
            }
            dispatch(makeIB_InvoiceAction({ jsonBody, path: url.IB_INVOICE, pageMode: mode.defaultsave, customer }));
        }
        else {
            var isGRNSelect = ''
            var challanNo = ''
            const grnRef = []
            if (list.length > 0) {
                list.forEach(ele => {
                    if (ele.hasSelect) {
                        grnRef.push({
                            Invoice: null,
                            Order: ele.POType === "Challan" ? '' : ele.id,
                            ChallanNo: ele.FullOrderNumber,
                            Inward: false,
                            Challan: ele.POType === "Challan" ? ele.id : ''
                        });
                        isGRNSelect = isGRNSelect.concat(`${ele.id},`)
                        challanNo = challanNo.concat(`${ele.FullOrderNumber},`)
                    }
                });

                if (isGRNSelect) {

                    isGRNSelect = isGRNSelect.replace(/,*$/, '');//****** withoutLastComma  function */
                    challanNo = challanNo.replace(/,*$/, '');           //****** withoutLastComma  function */

                    const jsonBody = JSON.stringify({
                        OrderIDs: isGRNSelect,
                        Mode: list[0].POType === "Challan" ? 2 : 1
                    })

                    dispatch(getGRN_itemMode2({ jsonBody, pageMode, path: url.GRN_ADD, grnRef, challanNo }))

                } else {
                    alert("Please Select Order1")
                }
            }
        }
    }

    function editBodyfunc(rowData, btnMode) {
        const jsonBody = JSON.stringify({
            Party: rowData.SupplierID,
            Customer: rowData.CustomerID,
            EffectiveDate: rowData.preOrderDate,
            OrderID: rowData.id
        })
        dispatch(editOrderId(jsonBody, btnMode));
    }

    function downBtnFunc(row) {
        var ReportType = report.order1;
        dispatch(getpdfReportdata(OrderPage_Edit_ForDownload_API, ReportType, row.id))
    }

    function goButtonHandler(IBType) {
        debugger
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Supplier: supplierSelect.value,
            Customer: userParty(),
            OrderType: order_Type.PurchaseOrder,
            IBType: IBType ? IBType : otherState.IBType
            
        });

        dispatch(getOrderListPage(subPageMode, pageMode, jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.fromdate = date
        setorderlistFilter(newObj)
        // dispatch(orderlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.todate = date
        setorderlistFilter(newObj)
        // dispatch(orderlistfilters(newObj))
    }

    function supplierOnchange(e) {
        let newObj = { ...orderlistFilter }
        newObj.supplierSelect = e
        setorderlistFilter(newObj)
    }

    function InOutOnchange(e) {
        let newObj = { ...orderlistFilter }
        newObj.inOut = e
        setorderlistFilter(newObj)
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="7">
                                    <Flatpickr
                                        name='fromdate'
                                        value={fromdate}
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
                                    style={{ width: "65px" }}>To Date</Label>
                                <Col sm="7">
                                    <Flatpickr
                                        name="todate"
                                        value={todate}
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

                                    style={{ width: "115px" }}>Supplier Name</Label>
                                <Col sm="5">
                                    <Select
                                        classNamePrefix="select2-Customer"
                                        value={supplierSelect}
                                        options={supplierOptions}
                                        onChange={supplierOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >
                        {/* {
                            (subPageMode === url.IB_ORDER_PO_LIST) ?
                                <Col sm="3">
                                    <FormGroup className="mb-2 row mt-3 " >
                                        <Label className="col-md-4 p-2"

                                            style={{ width: "90px" }}>List Type</Label>
                                        <Col sm="5">
                                            <Select
                                                classNamePrefix="select2-Customer"
                                                value={inOut}
                                                options={[{ value: 1, label: "Order Received" }, { value: 2, label: "Order Given" }]}
                                                onChange={InOutOnchange}
                                            />
                                        </Col>
                                    </FormGroup>
                                </Col >
                                : null
                        } */}


                        <Col sm="1" className="mt-3 ">
                            <Go_Button onClick={goButtonHandler} />
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            editBodyfunc={editBodyfunc}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"Order"}
                            deleteName={"FullOrderNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={Order}

                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default OrderList;