import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import {
    editBOMList,
    updateBOMListSuccess
} from "../../../store/Purchase/BOMRedux/action";
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import * as pageId from "../../../routes/allPageID"
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { deleteInwardId, deleteInwardIdSuccess } from "../../../store/Inter Branch/InwardRedux/action";
import { currentDate, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import Select from "react-select";
import { Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { IB_Invoicelistfilters, get_IB_InvoiceListPage, InwardButtonId } from "../../../store/Inter Branch/IB_Invoice_Redux/action";
import { GetCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import * as  mode from "../../../routes/PageMode";
import IB_Invoice from "./IB_Invoice";
import { formatDate } from "@fullcalendar/react";
import { Inward_Button_API } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";


const IB_Invoice_List = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    // const hasPagePath = history.location.pathname

    // const [pageMode, setpageMode] = useState(url.IB_INVOICE_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [IB_InvoiceFilter, setIB_InvoiceFilter] = useState({
        todate: currentDate, fromdate: currentDate, CustomerSelect: { value: "", label: "All" }
    });

    const reducers = useSelector(
        (state) => ({
            tableList: state.IBInvoiceReducer.IB_Invoice,
            deleteMsg: state.InwardReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            IB_InvoiceFilter: state.IBInvoiceReducer.IB_InvoiceFilter,
            customer: state.SupplierReducer.customer,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,

        })
    );
    const { userAccess, pageField, customer, } = reducers;
    const { fromdate, todate, CustomerSelect } = IB_InvoiceFilter;

    const hasPagePath = history.location.pathname;
    const pageMode = (hasPagePath === url.IB_INWARD_STP) ? mode.mode2save : mode.defaultList;
    const page_Id = (hasPagePath === url.IB_INWARD_STP) ? pageId.IB_INWARD_STP : pageId.IB_INVOICE_LIST;
    

    const action = {
        getList: get_IB_InvoiceListPage,
        editId: editBOMList,
        deleteId: deleteInwardId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteInwardIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        // setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"IB Invoice Count"} :0`))
        dispatch(GetCustomer())
        goButtonHandler(true)

    }, []);

    const CustomerOptions = customer.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    CustomerOptions.unshift({
        value: "",
        label: " All"
    });

    useEffect(() => {

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)

        }
    }, [userAccess])

    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Party: userParty(),
            Customer: CustomerSelect.value,

        });
        dispatch(get_IB_InvoiceListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...IB_InvoiceFilter }
        newObj.fromdate = date
        // dispatch(IB_Invoicelistfilters(newObj))
        setIB_InvoiceFilter(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...IB_InvoiceFilter }
        newObj.todate = date
        // dispatch(IB_Invoicelistfilters(newObj))
        setIB_InvoiceFilter(newObj)
    }

    function CustomerOnchange(e) {

        let newObj = { ...IB_InvoiceFilter }
        newObj.CustomerSelect = e
        setIB_InvoiceFilter(newObj)
    }

    // const InwardMakeBtnFunc = (list = []) => {
    //     dispatch(InwardButtonId(list[0].id))
    //     history.push({
    //         pathname: url.INWARD,
    //         pageMode: "save",
    //     })
    // }
  

    function downBtnFunc(row) {
        var ReportType = report.IBinvoice;
        dispatch(getpdfReportdata(Inward_Button_API, ReportType, row.id))
    }

    const makeBtnFunc = (list = {}) => {
        dispatch(InwardButtonId(list[0].id))
        history.push({
            pathname: url.INWARD,
            // editValue: obj,
            pageMode: mode.mode2save
        })
    };
    return (

        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">

                <div className="px-2 c_card_header text-black" >
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
                                            value={CustomerSelect}
                                            options={CustomerOptions}
                                            onChange={CustomerOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >

                            <Col sm="1" className="mt-3 ">
                                <Go_Button onClick={goButtonHandler} />
                            </Col>
                        </div>
                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={IB_Invoice}
                            masterPath={url.IB_INVOICE}
                            ButtonMsgLable={"IBInvoice"}
                            deleteName={"FullIBChallanNumber"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            filters={IB_InvoiceFilter}
                            makeBtnFunc={makeBtnFunc}
                            downBtnFunc={downBtnFunc}
                            makeBtnShow={pageMode === mode.defaultList ? false : true}
                            makeBtnName={"Make IB Invoice"}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default IB_Invoice_List;