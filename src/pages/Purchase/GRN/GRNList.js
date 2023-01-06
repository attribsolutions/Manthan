import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import Order from "../Order/Order";
import { GRN_ADD_Mode_2, ORDER } from "../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import {
    deleteGRNId,
    deleteGRNIdSuccess,
    editGRNId, getGRNListPage,
    grnlistfilters,
    updateGRNIdSuccess
} from "../../../store/Purchase/GRNRedux/actions";
import { getSupplier } from "../../../store/CommonAPI/SupplierRedux/actions";
import { excelDownCommonFunc, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url"
const GRNList = () => {

    const dispatch = useDispatch();

    const reducers = useSelector(
        (state) => ({
            supplier: state.SupplierReducer.supplier,
            tableList: state.GRNReducer.GRNList,
            deleteMsg: state.GRNReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            grnlistFilter: state.GRNReducer.grnlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { userAccess, pageField, supplier, tableList, grnlistFilter } = reducers;
    const { fromdate, todate, supplierSelect } = grnlistFilter;

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Supplier,
    }));

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])

    const action = {
        getList: getGRNListPage,
        editId: editGRNId,
        deleteId: deleteGRNId,
        postSucc: postMessage,
        updateSucc: updateGRNIdSuccess,
        deleteSucc: deleteGRNIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(56))
        dispatch(getSupplier())
        goButtonHandler()
    }, []);

    function goButtonHandler() {
        
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Supplier: supplierSelect === "" ? '' : supplierSelect.value,
            Party: userParty(),
        });
        dispatch(getGRNListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...grnlistFilter }
        newObj.fromdate = date
        dispatch(grnlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...grnlistFilter }
        newObj.todate = date
        dispatch(grnlistfilters(newObj))
    }

    function supplierOnchange(e) {
        let newObj = { ...grnlistFilter }
        newObj.supplierSelect = e
        dispatch(grnlistfilters(newObj))
    }

    return (

        <React.Fragment>
            <div className="page-content">
                {/* <Breadcrumb
                    pageHeading={"GRN List"}
                    newBtnView={true}
                    showCount={true}
                    excelBtnView={true}
                    pageMode={GRN_ADD_Mode_2}
                    newBtnPagePath={GRN_ADD_Mode_2}
                    excelData={downList} /> */}

                <div className="px-2  c_card_filter text-black " >
                    <div className="row">
                        <div className=" row">
                            <Col sm="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>From Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            name='fromdate'
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            value={fromdate}
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
                                            nane='todate'
                                            className="form-control d-block p-2 bg-white text-dark"
                                            value={todate}
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
                                    <Col md="5">
                                        <Select
                                            value={supplierSelect}
                                            classNamePrefix="select2-Customer"
                                            options={supplierOptions}
                                            onChange={supplierOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >

                            <Col sm="1" className="mt-3 ">
                                <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                    onClick={() => goButtonHandler()}
                                >Go</Button>
                            </Col>
                        </div>

                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            showBreadcrumb={false}
                            reducers={reducers}
                            MasterModal={Order}
                            masterPath={url.GRN_ADD_Mode_2}
                            ButtonMsgLable={"GRNNumber"}
                            deleteName={"GRNNumber"}
                            pageMode={"List"}
                            goButnFunc={goButtonHandler}
                        />
                        : null
                }

            </div>
        </React.Fragment>
    )
}

export default GRNList;