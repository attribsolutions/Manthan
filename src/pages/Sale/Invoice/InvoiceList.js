import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import {
    updateOrderIdSuccess,
} from "../../../store/Purchase/OrderPageRedux/actions";
import {
    BreadcrumbShowCountlabel,
    CommonBreadcrumbDetails,
    commonPageFieldList,
    commonPageFieldListSuccess,
} from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { GetCustomer, GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import {
    currentDate,
    excelDownCommonFunc,
    userParty
} from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import { Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import * as report from '../../../Reports/ReportIndex'
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { Invoice_1_Edit_API_Singel_Get } from "../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { MetaTags } from "react-meta-tags";
import Invoice from "./Invoice";
import {
    deleteInvoiceId,
    deleteInvoiceIdSuccess,
    editInvoiceList,
    invoiceListGoBtnfilter
} from "../../../store/Sales/Invoice/action";

import "./css.css"

const InvoiceList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode, setPageMode] = useState(url.ORDER_LIST_1)
    const [userAccState, setUserAccState] = useState('');
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false });

    // const [fromdate, setfromdate] = useState(currentDate);
    // const [todate, settodate] = useState(currentDate);
    // const [supplierSelect, setsupplierSelect] = useState({ value: '', label: "All" });
    const [orderlistFilter, setorderlistFilter] = useState({ todate: currentDate, fromdate: currentDate, supplierSelect: { value: '', label: "All" } });

    const reducers = useSelector(
        (state) => ({
            supplier: state.SupplierReducer.vendorSupplierCustomer,
            tableList: state.InvoiceReducer.Invoicelist,
            GRNitem: state.GRNReducer.GRNitem,
            deleteMsg: state.InvoiceReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.InvoiceReducer.editData,
            orderlistFilter: state.OrderReducer.orderlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { userAccess, pageField, supplier, tableList, } = reducers;
    const { fromdate, todate, supplierSelect } = orderlistFilter;

    const page_Id = pageId.INVOICE_LIST_2

    const action = {
        getList: invoiceListGoBtnfilter,
        deleteId: deleteInvoiceId,
        postSucc: postMessage,
        editId: editInvoiceList,
        updateSucc: updateOrderIdSuccess,
        deleteSucc: deleteInvoiceIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
     
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let master_Path = '';
        let make_btn = false

        if (subPageMode === url.INVOICE_LIST_1) {
            page_Id = pageId.INVOICE_LIST_2
            master_Path = url.INVOICE_1
        }
        else if (subPageMode === url.INVOICE_LIST_2) {
            page_Id = pageId.INVOICE_LIST_2;
            master_Path = url.ORDER_LIST_3
        }
        else if (subPageMode === url.IB_INWARD_STP) {
            page_Id = pageId.IB_INWARD_STP
            page_Mode = mode.mode2save
            make_btn = true;
        }
      
        setOtherState({ masterPath: master_Path, makeBtnShow: make_btn })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Invoice Count"} :0`))
        dispatch(GetVenderSupplierCustomer(subPageMode))
        goButtonHandler(true)
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

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)

        }
    }, [userAccess])

    function downBtnFunc(row) {
        var ReportType = report.invoice;
        dispatch(getpdfReportdata(Invoice_1_Edit_API_Singel_Get, ReportType, row.id))
    }

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Customer: supplierSelect.value === "" ? '' : supplierSelect.value,
            Party: userParty(),
        });

        dispatch(invoiceListGoBtnfilter(subPageMode, jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.fromdate = date
        // dispatch(orderlistfilters(newObj))
        setorderlistFilter(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.todate = date
        // dispatch(orderlistfilters(newObj))
        setorderlistFilter(newObj)
    }

    function supplierOnchange(e) {
        let newObj = { ...orderlistFilter }
        newObj.supplierSelect = e
        // dispatch(orderlistfilters(newObj))
        setorderlistFilter(newObj)
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {/* <BreadcrumbNew userAccess={userAccess} pageId={page_Id} /> */}

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

                                    style={{ width: "115px" }}>Customer</Label>
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
                            MasterModal={Invoice}
                            masterPath={otherState.masterPath}
                            ButtonMsgLable={"Invoice"}
                            deleteName={"FullInvoiceNumber"}
                            pageMode={pageMode}
                            makeBtnShow={otherState.makeBtnShow}
                            // makeBtnFunc={makeBtnFunc}
                            makeBtnName={"Make GRN"}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            // editBodyfunc={editBodyfunc}
                            filters={orderlistFilter}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default InvoiceList;