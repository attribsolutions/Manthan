import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import Order from "../Order/Order";
import { GST_ADD_Mode_2, ORDER, ORDER_lIST } from "../../../routes/route_url";
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
    updateGRNIdSuccess
} from "../../../store/Purchase/GRNRedux/actions";
import { goButton } from "../../../store/Purchase/OrderPageRedux/actions";
import { getSupplier } from "../../../store/CommonAPI/SupplierRedux/actions";
import { excelDownCommonFunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


let onlodTodate = null
let onlodFromdate = null


const GRNList = () => {

    const dispatch = useDispatch();
    const [supplierSelect, setsupplierSelect] = useState({ value: '' });
    const [fromdate, setFromdate] = useState('');
    const [todate, setTodate] = useState('');



    const reducers = useSelector(
        (state) => ({
            supplier: state.SupplierReducer.supplier,
            tableList: state.GRNReducer.GRNList,
            deleteMsg: state.GRNReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { userAccess, pageField, supplier, tableList } = reducers;


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
    }, []);



    const goButtonHandler = (onload = false) => {
        // debugger
        let FromDate
        let ToDate

        if (!(onlodFromdate) || !(onlodTodate)) {
            return
        }
        if (onload) {
            FromDate = onlodFromdate;
            ToDate = onlodTodate;
        } else {
            ToDate = todate;
            FromDate = fromdate;
        }

        let supplier = supplierSelect.value;
        let party;

        try {
            party = JSON.parse(localStorage.getItem("roleId")).Party_id
        } catch (e) {
            alert(e)
            return
        }
        const jsonBody = JSON.stringify({
            FromDate: FromDate,
            ToDate: ToDate,
            Supplier: supplier,
            Party: party,
        }
        );
        dispatch(getGRNListPage(jsonBody));
    }




    return (

        <React.Fragment>
            <div className="page-content">
                <Breadcrumb
                    pageHeading={"GRN List"}
                    newBtnView={true}
                    showCount={true}
                    excelBtnView={true}
                    pageMode={GST_ADD_Mode_2}
                    newBtnPagePath={GST_ADD_Mode_2}
                    excelData={downList} />

                <div className="px-2 mb-1 mt-n1 c_card_header">
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
                                        onReady={(e, date) => {
                                            onlodFromdate = date;
                                            setFromdate(date);
                                            goButtonHandler(true)
                                        }}
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
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={(e, date) => { setTodate(date) }}
                                        onReady={(e, date) => {
                                            onlodTodate = date;
                                            setTodate(date);
                                            goButtonHandler(true)
                                        }}
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
                                        // value={"supplier"}
                                        classNamePrefix="select2-Customer"
                                        // isDisabled={"pageMode" === "edit" ? true : false}
                                        options={supplierOptions}
                                        onChange={(e) => { setsupplierSelect(e) }}
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
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            showBreadcrumb={false}
                            reducers={reducers}
                            MasterModal={Order}
                            masterPath={ORDER}
                            ButtonMsgLable={"GRN"}
                            deleteName={"CreatedBy"}
                            pageMode={"List"}

                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default GRNList;