import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { BreadcrumbReset, BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import Order from "../Order/Order";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import PurchaseListPage, { countlabelFunc } from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import { GetVender } from "../../../store/CommonAPI/SupplierRedux/actions";
import { excelDownCommonFunc, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url"
import * as mode from "../../../routes/PageMode"
import { MetaTags } from "react-meta-tags";
import { order_Type } from "../../../components/Common/C-Varialbes";
import { useHistory } from "react-router-dom";
import { challanlistfilters, deleteChallanId, deleteChallanIdSuccess, getChallanListPage,  } from "../../../store/Inventory/ChallanRedux/actions";
import { getGRN_itemMode2 } from "../../../store/Purchase/GRNRedux/actions";

const ChallanList = () => {
    const history = useHistory();
    const pageMode = history.location.pathname
    const dispatch = useDispatch();

    const reducers = useSelector(
        (state) => ({
            vender: state.SupplierReducer.vender,
            tableList: state.ChallanReducer.ChallanList,
            deleteMsg: state.ChallanReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            ChallanlistFilter: state.ChallanReducer.ChallanlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
    const { userAccess, pageField, vender, tableList, ChallanlistFilter } = reducers;
    const { fromdate, todate, venderSelect } = ChallanlistFilter;

    const action = {
        // getList: getChallanListPage,
        deleteId: deleteChallanId,
        deleteSucc: deleteChallanIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(138))
        dispatch(GetVender())
        goButtonHandler()
        dispatch(BreadcrumbReset())
    }, []);

    const venderOptions = vender.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    venderOptions.unshift({
        value: "",
        label: " All"
    });

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])

    const makeBtnFunc = (list = []) => {
    debugger
        const obj = {...list[0], id: list[0].id }
        console.log(obj)
        history.push({
            pathname: url.GRN_ADD,
            pageMode: mode.modeSTPsave
        })
        
        const jsonBody = JSON.stringify({
            OrderIDs:list[0].id.toString(),
            Mode:""
        })

        dispatch(getGRN_itemMode2({ jsonBody }))
    };

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Party: userParty(),
            Customer: venderSelect === "" ? '' : venderSelect.value,
        });
        dispatch(getChallanListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...ChallanlistFilter }
        newObj.fromdate = date
        dispatch(challanlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...ChallanlistFilter }
        newObj.todate = date
        dispatch(challanlistfilters(newObj))
    }

    function venderOnchange(e) {
        let newObj = { ...ChallanlistFilter }
        newObj.venderSelect = e
        dispatch(challanlistfilters(newObj))
    }

    return (

        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            {/* <BreadcrumbNew userAccess={userAccess} pageId={pageId.GRN_lIST} /> */}
            <div className="page-content">
                {/* <Breadcrumb
                    pageHeading={"GRN List"}
                    newBtnView={true}
                    showCount={true}
                    excelBtnView={true}
                    pageMode={GRN_STP}
                    newBtnPagePath={GRN_STP}
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
                                        style={{ width: "115px" }}>Customer</Label>
                                    <Col md="5">
                                        <Select
                                            value={venderSelect}
                                            classNamePrefix="select2-Customer"
                                            options={venderOptions}
                                            onChange={venderOnchange}
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
                            masterPath={url.CHALLAN}
                            newBtnPath={url.CHALLAN}
                            ButtonMsgLable={"challan"}
                            // pageMode={pageMode}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnShow={pageMode === url.CHALLAN_LIST}
                            makeBtnName={"Make GRN"}
                            // deleteName={"FullGRNNumber"}
                            pageMode={mode.defaultList}
                            goButnFunc={goButtonHandler}
                        />

                        : null
                      

                }

            </div>
        </React.Fragment>
    )
}

export default ChallanList;