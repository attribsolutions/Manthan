import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    deleteOrderId,
    deleteOrderIdSuccess,
    editOrderId,
    getOrderListPage,
    updateOrderIdSuccess,
    // getOrderList
} from "../../../store/Purchase/OrderPageRedux/actions";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonListPage from "../../../components/Common/CmponentRelatedCommonFile/commonListPage"
import Order from "../Order/Order";
import { ORDER } from "../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb3";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import PurchaseListPage from "../../../components/Common/CmponentRelatedCommonFile/purchase";
const GRNList = () => {

    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            tableList: state.OrderReducer.orderList,
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
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(50))
        dispatch(getOrderListPage());
    }, []);

    const { pageField } = reducers;
    function func1() {

    }
    return (

        <React.Fragment>
            <div className="page-content">
                <Breadcrumb
                    pageHeading={"GRN List"}
                    newBtnView={true}
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
                                        id="orderdate"
                                        name="orderdate"
                                        // value={podate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            minDate: "pageMode" === "edit" ? "podate" : "today",
                                            // maxDate: pageMode === "edit" ? podate : "",
                                            defaultDate: "pageMode" === "edit" ? "" : "today"

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
                                        id="orderdate"
                                        name="orderdate"
                                        // value={podate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            minDate: "pageMode" === "edit" ? "podate" : "today",
                                            // maxDate: pageMode === "edit" ? podate : "",
                                            defaultDate: "pageMode" === "edit" ? "" : "today"
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
                                        value={"supplierSelect"}
                                        classNamePrefix="select2-Customer"
                                        isDisabled={"pageMode" === "edit" ? true : false}
                                        options={"supplierOptions"}
                                    // onChange={(e) => { setsupplierSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col md="1" className="mt-3 ">
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                            // onClick={GoButton_Handler}
                            >Go</Button>
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            showBreadcrumb={false}
                            reducers={reducers}
                            MasterModal={Order}
                            masterPath={ORDER}
                            ButtonMsgLable={"Order"}
                            deleteName={"Name"}
                            listHeader={func1()}
                            pageMode={"List"}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default GRNList;