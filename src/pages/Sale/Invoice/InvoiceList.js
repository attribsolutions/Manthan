import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import Flatpickr from "react-flatpickr";
import {
    updateOrderIdSuccess,
} from "../../../store/Purchase/OrderPageRedux/actions";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess,
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import {  GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import {
    btnIsDissablefunc,
    currentDate_ymd,
    excelDownCommonFunc,
    loginPartyID
} from "../../../components/Common/CommonFunction";
import { useMemo } from "react";
import { Go_Button } from "../../../components/Common/CommonButton";
import * as report from '../../../Reports/ReportIndex'
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { Invoice_1_Edit_API_Singel_Get } from "../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { MetaTags } from "react-meta-tags";
import {
    deleteInvoiceId,
    deleteInvoiceIdSuccess,
    editInvoiceList,
    invoiceListGoBtnfilter
} from "../../../store/Sales/Invoice/action";
import { makeInward } from "../../../store/Inter Branch/InwardRedux/action";


const InvoiceList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const [pageMode, setPageMode] = useState(url.ORDER_LIST_1)
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [orderlistFilter, setorderlistFilter] = useState({ todate: currentDate_ymd, fromdate: currentDate_ymd, supplierSelect: { value: '', label: "All" } });
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '', IBType: '' });

    const reducers = useSelector(
        (state) => ({
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            tableList: state.InvoiceReducer.Invoicelist,
            GRNitem: state.GRNReducer.GRNitem,
            deleteMsg: state.InvoiceReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.InvoiceReducer.editData,
            // orderlistFilter: state.OrderReducer.orderlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const gobtnId = `gobtn-${subPageMode}`
    const { userAccess, pageField, supplier, tableList, } = reducers;
    const { fromdate, todate, supplierSelect } = orderlistFilter;

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
        let masterPath = '';
        let IBType = '';
        let newBtnPath = false;
        let makeBtnShow = false;


        if (subPageMode === url.INVOICE_LIST_1) {
            page_Id = pageId.INVOICE_LIST_1
            masterPath = url.INVOICE_1
            newBtnPath = url.INVOICE_1
        }
        else if (subPageMode === url.IB_INVOICE_LIST) {
            page_Id = pageId.IB_INVOICE_LIST;
            masterPath = url.IB_INVOICE
            newBtnPath = url.IB_INVOICE_STP
            IBType = "IBInvoice"
        }
        else if (subPageMode === url.IB_GRN_LIST) {
            page_Id = pageId.IB_GRN_LIST;
            masterPath = url.IB_INVOICE
            IBType = "IBGRN"
        }
        else if (subPageMode === url.IB_INWARD_STP) {
            page_Id = pageId.IB_INWARD_STP
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            IBType = "IBGRN"
        }
        setSubPageMode(subPageMode)
        setOtherState({ masterPath, makeBtnShow, newBtnPath, IBType })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Invoice Count"} :0`))
        dispatch(GetVenderSupplierCustomer(subPageMode))
        goButtonHandler("event", IBType)
    }, [dispatch]);

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));
    supplierOptions.unshift({
        value: "",
        label: " All"
    });

    function downBtnFunc(row) {
        
          
        var ReportType = report.invoice;
        dispatch(getpdfReportdata(Invoice_1_Edit_API_Singel_Get, ReportType, {editId: row.id}))
    }

    function goButtonHandler(event, IBType) {

        const btnId = gobtnId;
        btnIsDissablefunc({ btnId, state: true })
        try {
            const filtersBody = JSON.stringify({
                FromDate: fromdate,
                ToDate: todate,
                Customer: supplierSelect.value === "" ? '' : supplierSelect.value,
                Party: loginPartyID(),
                IBType: IBType ? IBType : otherState.IBType
            });

            dispatch(invoiceListGoBtnfilter({ subPageMode, filtersBody, btnId }));

        } catch (error) { btnIsDissablefunc({ btnId, state: true }) }
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.fromdate = date
        setorderlistFilter(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...orderlistFilter }
        newObj.todate = date
        setorderlistFilter(newObj)
    }

    function supplierOnchange(e) {

        let newObj = { ...orderlistFilter }
        newObj.supplierSelect = e
        setorderlistFilter(newObj)
    }

    const makeBtnFunc = (list = {}, btnId) => {
        const config = { makeInwardId: list[0].id, btnId }
        dispatch(makeInward(config))
        history.push({
            pathname: url.INWARD,
        })
    };
    const HeaderContent = () => {
        return (
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
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            HeaderContent={HeaderContent}
                            makeBtnFunc={makeBtnFunc}

                            ButtonMsgLable={"Invoice"}
                            deleteName={"FullInvoiceNumber"}
                            makeBtnName={"Make GRN"}
                            filters={orderlistFilter}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default InvoiceList;