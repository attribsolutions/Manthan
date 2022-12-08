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
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import Order from "./Order";
import { GRN_ADD, GST_ADD_Mode_2, ORDER, ORDER_lIST } from "../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { getGRN_itemMode2 } from "../../../store/Purchase/GRNRedux/actions";
import { getSupplier } from "../../../store/CommonAPI/SupplierRedux/actions";
import { currentDate, excelDownCommonFunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";


const OrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [supplierSelect, setsupplierSelect] = useState({ value: '' });
    const [pageMode, setpageMode] = useState(ORDER_lIST)
    const [userAccState, setUserAccState] = useState('');
    const [fromdate, setFromdate] = useState();
    const [todate, setTodate] = useState();

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
        setpageMode(hasPagePath)
        const pageId = (hasPagePath === GST_ADD_Mode_2) ? 60 : 54;
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(pageId))
        dispatch(getSupplier());
        goButtonHandler(true)

    }, []);

    const { userAccess, pageField, GRNitem, supplier, tableList } = reducers;

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
        const pageId = (hasPagePath === GST_ADD_Mode_2) ? 60 : 54;
        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {
        if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
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

    const goButtonHandler = (onload = false) => {
        let FromDate
        let ToDate

        if (onload) {
            const currentdate = currentDate()
            FromDate = currentdate;
            ToDate = currentdate;
        } else {
            ToDate = todate;
            FromDate = fromdate;
        }

        let supplier = supplierSelect.value
        let customer = 0
        try {
            customer = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
            return
        }
        const jsonBody = JSON.stringify({
            FromDate: FromDate,
            ToDate: ToDate,
            Supplier: supplier,
            Customer: customer
        }
        );
        console.log(jsonBody)
        dispatch(getOrderListPage(jsonBody));
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={(pageMode === ORDER_lIST) ? true : false}
                    showCount={true}
                    excelBtnView={true}
                    excelData={downList}/>

                <div className="px-2 mb-1 mt-n1 c_card_filter"  >
                    <div className=" mt-1 row">
                        <Col sm="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="7">
                                    <Flatpickr
                                        name='fromdate'
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"

                                        }}
                                        onChange={(e, date) => { setFromdate(date) }}
                                        onReady={(e, date) => { setFromdate(date) }}
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
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={(e, date) => { setTodate(date) }}
                                        onReady={(e, date) => { setTodate(date) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="5">
                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"
                                    style={{ width:"115px"}}>Supplier Name</Label>
                                <Col sm="5">
                                    <Select
                                        classNamePrefix="select2-Customer"
                                        options={supplierOptions}
                                        onChange={(e) => { setsupplierSelect(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        <Col sm="1" className="mt-3 ">
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 mb-2 "
                                onClick={() => goButtonHandler()}
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
                            deleteName={"OrderDate"}
                            pageMode={pageMode}
                            onsavefunc={onsavefunc}
                            goButnFunc={goButtonHandler}

                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default OrderList;