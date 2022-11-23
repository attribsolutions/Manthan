import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import {
    deleteOrderId,
    deleteOrderIdSuccess,
    editOrderIdSuccess,
    editOrderId,
    getOrderListPage,
    updateOrderIdSuccess,
    // getOrderList
} from "../../../store/Purchase/OrderPageRedux/actions";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/CmponentRelatedCommonFile/purchase"
import Order from "./Order";
import { GRN_ADD, ORDER } from "../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { getGRN_itemMode2 } from "../../../store/Purchase/GRNRedux/actions";
import { getSupplier } from "../../../store/CommonAPI/SupplierRedux/actions";

const OrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const location = { ...history.location }
    const hasPageMode = location.hasOwnProperty("pageMode")



    const [supplierSelect, setsupplierSelect] = useState({ value: '' });
    const [pageMode, setpageMode] = useState("list")
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
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const action = {
        getList: getOrderListPage,
        editId: editOrderId,
        deleteId: deleteOrderId,
        postSucc: postMessage,
        updateSucc: updateOrderIdSuccess,
        deleteSucc: deleteOrderIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {

        let mode = "list"
        if (hasPageMode) {
            mode = location.pageMode
            setpageMode(mode)
        }
        const pageId = (mode === "list") ? 54 : 60;
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(pageId))
        dispatch(getSupplier())
        goButtonHandler()

    }, []);

    const { pageField, userAccess, GRNitem, supplier } = reducers;
    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));



    useEffect(() => {
        let mode = "list"
        if (hasPageMode) { mode = location.pageMode }
        const pageId = (mode === "list") ? 54 : 60;

        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {
        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
            // GRNitem.Status = false
            // dispatch(getGRN_itemMode2_Success(GRNitem))
            history.push({
                pathname: GRNitem.path,
                pageMode: GRNitem.pageMode
            })
        }
    }, [GRNitem])

    const onsavefunc = (list = []) => {
        var isGRNSelect = ''
        var challanNo = ''
        const grnRef = []
        if (list.length > 0) {
            list.forEach(ele => {
                if (ele.GRNSelect) {
                    grnRef.push({
                        Invoice: null,
                        Order: ele.id,
                        ChallanNo: ele.FullOrderNumber
                    });
                    isGRNSelect = isGRNSelect.concat(`${ele.id},`)
                    challanNo = challanNo.concat(`${ele.FullOrderNumber},`)
                }
            });

            if (isGRNSelect) {
                const jsonBody = JSON.stringify({
                    OrderIDs: isGRNSelect
                })

                dispatch(getGRN_itemMode2({ jsonBody, pageMode, GRN_ADD, grnRef, challanNo }))

            } else {
                alert("Please Select Order1")
            }
        }

    }

    const goButtonHandler = () => {

        let supplier = supplierSelect.value
        let todate
        let fromdate
        let customer = 0
        try {
            todate = document.getElementById("todate").value
            fromdate = document.getElementById("fromdate").value
            customer = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
            return
        }

        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Supplier: supplier,
            Customer: customer
        }
        );
        debugger
        dispatch(getOrderListPage(jsonBody));
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={(pageMode === "list") ? true : false}
                    showCount={true}
                    excelBtnView={true}

                    excelData={"downList"} />

                <div className="px-2 mb-1 mt-n1" style={{ backgroundColor: "#dddddd" }} >
                    <div className=" mt-1 row">
                        <Col md="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "100px" }}>From Date</Label>
                                <Col md="7">
                                    <Flatpickr
                                        id="todate"
                                        name="todate"
                                        // value={podate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            minDate: "today",
                                            // maxDate: pageMode === "edit" ? podate : "",
                                            defaultDate: "today"

                                        }}
                                    // onChange={(e, date) => { setpoDate(date) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "100px" }}>To Date</Label>
                                <Col md="7">
                                    <Flatpickr
                                        id="fromdate"
                                        name="fromdate"
                                        // value={podate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            minDate: "today",
                                            // maxDate: pageMode === "edit" ? podate : "",
                                            defaultDate: "today"
                                        }}
                                    // onChange={(e, date) => { setpoDate(date) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col md="3">
                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"
                                    style={{ width: "130px" }}>Supplier Name</Label>
                                <Col md="7">
                                    <Select
                                        // value={"supplierSelect"}
                                        classNamePrefix="select2-Customer"
                                        // isDisabled={"pageMode" === "edit" ? true : false}
                                        options={supplierOptions}
                                        onChange={(e) => { setsupplierSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col md="1" className="mt-3 ">
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                onClick={goButtonHandler}
                            >Go</Button>
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
                            masterPath={ORDER}
                            ButtonMsgLable={"Order"}
                            deleteName={"Name"}
                            pageMode={pageMode}
                            onsavefunc={onsavefunc}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default OrderList;