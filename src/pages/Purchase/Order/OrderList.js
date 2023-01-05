import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
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
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { getGRN_itemMode2 } from "../../../store/Purchase/GRNRedux/actions";
import { getSupplier } from "../../../store/CommonAPI/SupplierRedux/actions";
import { excelDownCommonFunc, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import { Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import * as report from '../../../Reports/ReportIndex'
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import { OrderPage_Edit_ForDownload_API } from "../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";

const OrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname
    const [pageMode, setpageMode] = useState(url.ORDER_lIST)
    const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            supplier: state.SupplierReducer.supplier,
            tableList: state.OrderReducer.orderList,
            GRNitem: state.GRNReducer.GRNitem,
            deleteMsg: state.OrderReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.OrderReducer.editData,
            orderlistFilter: state.OrderReducer.orderlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
    const { userAccess, pageField, GRNitem, supplier, tableList, orderlistFilter } = reducers;
    const { fromdate, todate, supplierSelect } = orderlistFilter;

    const action = {
        getList: getOrderListPage,
        deleteId: deleteOrderId,
        postSucc: postMessage,
        updateSucc: updateOrderIdSuccess,
        deleteSucc: deleteOrderIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        setpageMode(hasPagePath)
        const page_Id = (hasPagePath === url.GRN_ADD_Mode_2) ? pageId.GRN_ADD_Mode_2 : pageId.ORDER_lIST;
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Orders Count"} :0`))
        dispatch(getSupplier());
        goButtonHandler(true)

    }, []);


    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])


    useEffect(() => {
        const page_Id = (hasPagePath === url.GRN_ADD_Mode_2) ? pageId.GRN_ADD_Mode_2 : pageId.ORDER_lIST;

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
           
        }
    }, [userAccess])

    useEffect(() => {
        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
            history.push({
                pathname: GRNitem.path,
                pageMode: GRNitem.pageMode,
            })
        }
    }, [GRNitem])

    const makeBtnFunc = (list = []) => {

        var isGRNSelect = ''
        var challanNo = ''
        const grnRef = []
        if (list.length > 0) {
            list.forEach(ele => {
                if (ele.hasSelect) {
                    grnRef.push({
                        Invoice: null,
                        Order: ele.id,
                        ChallanNo: ele.FullOrderNumber,
                        Inward: false
                    });
                    isGRNSelect = isGRNSelect.concat(`${ele.id},`)
                    challanNo = challanNo.concat(`${ele.FullOrderNumber},`)
                }
            });

            if (isGRNSelect) {

                isGRNSelect = isGRNSelect.replace(/,*$/, '');//****** withoutLastComma  function */
                challanNo = challanNo.replace(/,*$/, '');           //****** withoutLastComma  function */

                const jsonBody = JSON.stringify({
                    OrderIDs: isGRNSelect
                })

                dispatch(getGRN_itemMode2({ jsonBody, pageMode, path: url.GRN_ADD, grnRef, challanNo }))

            } else {
                alert("Please Select Order1")
            }
        }

    }
    function editBodyfunc(rowData) {

        const jsonBody = JSON.stringify({
            Party: rowData.SupplierID,
            Customer: rowData.CustomerID,
            EffectiveDate: rowData.preOrderDate,
            OrderID: rowData.id
        })
        var Mode = "edit"
        dispatch(editOrderId(jsonBody, Mode));
    }
    function downBtnFunc(row) {
        var ReportType = report.order1;
        dispatch(getpdfReportdata(OrderPage_Edit_ForDownload_API, ReportType, row.id))
    }

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Supplier: supplierSelect === "" ? '' : supplierSelect.value,
            Customer: userParty(),
        });

        dispatch(getOrderListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.fromdate = date
        dispatch(orderlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.todate = date
        dispatch(orderlistfilters(newObj))
    }

    function supplierOnchange(e) {
        let newObj = { ...orderlistFilter }
        newObj.supplierSelect = e
        dispatch(orderlistfilters(newObj))
    }

    return (
        <React.Fragment>
            <div className="page-content">
                {/* <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={(pageMode === url.ORDER_lIST) ? true : false}
                    showCount={true}
                    excelBtnView={true}
                    excelData={downList} /> */}

                <div className="px-2   c_card_filter text-black" >
                    <div className=" row" style={{ marginBottom: "-12px" }}>
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
                            MasterModal={Order}
                            masterPath={url.ORDER}
                            ButtonMsgLable={"Order"}
                            deleteName={"FullOrderNumber"}
                            pageMode={pageMode}
                            makeBtnShow={pageMode === url.ORDER_lIST ? false : true}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnName={"Make GRN"}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            editBodyfunc={editBodyfunc}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default OrderList;