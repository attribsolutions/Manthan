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
} from "../../../../store/Purchase/OrderPageRedux/actions";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../../store/actions";
import PurchaseListPage from "../../../../components/Common/CmponentRelatedCommonFile/purchase"

import { BillOfMaterialsList, GRN_ADD, GST_ADD_Mode_2, ORDER, ORDER_lIST } from "../../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { getSupplier } from "../../../../store/CommonAPI/SupplierRedux/actions";
import { currentDate, excelDownCommonFunc } from "../../../../components/Common/CmponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import { getBOMListPage } from "../../../../store/Purchase/BOMRedux/action";


const BOMList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(BillOfMaterialsList)
    const [userAccState, setUserAccState] = useState('');
    const [fromdate, setFromdate] = useState();
    const [todate, setTodate] = useState();

    const reducers = useSelector(
        (state) => ({
            tableList: state.BOMReducer.BOMList,
            GRNitem: state.GRNReducer.GRNitem,
            deleteMsg: state.OrderReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.OrderReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const action = {
        getList: getBOMListPage,
        editId: editOrderId,
        deleteId: deleteOrderId,
        postSucc: postMessage,
        updateSucc: updateOrderIdSuccess,
        deleteSucc: deleteOrderIdSuccess
    }

 // Featch Modules List data  First Rendering
useEffect(() => {
    setpageMode(hasPagePath)
    dispatch(commonPageFieldListSuccess(null))
    dispatch(commonPageFieldList(70))
    goButtonHandler(true)

}, []);

const { userAccess, pageField,tableList } = reducers;

const downList = useMemo(() => {
    let PageFieldMaster = []
    if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
    return excelDownCommonFunc({ tableList, PageFieldMaster })
}, [tableList])


useEffect(() => {
    const pageId =70
    let userAcc = userAccess.find((inx) => {
        return (inx.id === pageId)
    })
    if (!(userAcc === undefined)) {
        setUserAccState(userAcc)
    }
}, [userAccess])

const goButtonHandler = (onload = false) => {
    debugger
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
    const jsonBody = JSON.stringify({
        FromDate: FromDate,
        ToDate: ToDate,
        Company: 1,
    }
    );
    dispatch(getBOMListPage(jsonBody));
}

return (
    <React.Fragment>
        <div className="page-content">
            <Breadcrumb
                pageHeading={userAccState.PageHeading}
                newBtnView={true}
                showCount={true}
                excelBtnView={true}
                excelData={downList} />

            <div className="px-2 mb-1 mt-n1" style={{ backgroundColor: "#dddddd" }} >
                <div className=" mt-1 row">
                    <Col md="4" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "100px" }}>From Date</Label>
                            <Col md="7">
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
                    <Col md="4" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "100px" }}>To Date</Label>
                            <Col md="7">
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

                    <Col md="1" className="mt-3 ">
                        <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
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
                        // MasterModal={Order}
                        masterPath={ORDER}
                        ButtonMsgLable={"Order"}
                        deleteName={"Name"}
                        pageMode={pageMode}
                    // onsavefunc={onsavefunc}
                    />
                    : null
            }
        </div>


    </React.Fragment>
)
}

export default BOMList;