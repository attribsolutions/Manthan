import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate, excelDownCommonFunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import {
    updateWorkOrderListSuccess
} from "../../../store/Purchase/WorkOrder/action";
import {
    delete_ProductionId,
    delete_ProductionIdSuccess,
    edit_ProductionId,
    getProductionListPage,
    Productionlistfilters
} from "../../../store/Purchase/ProductionRedux/actions";

import { MetaTags } from "react-meta-tags";
import * as report from '../../../Reports/ReportIndex'

import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import * as url from "../../../routes/route_url"

import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { production_Edit_API } from "../../../helpers/backend_helper";
import ProductionMaster from "./ProductionMaster";

const ProductionList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false });

    const [userAccState, setUserAccState] = useState('');
    const reducers = useSelector(
        (state) => ({
            tableList: state.ProductionReducer.ProductionList,
            deleteMsg: state.ProductionReducer.deleteMsg,
            updateMsg: state.WorkOrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.ProductionReducer.editData,
            productionFilter: state.ProductionReducer.productionFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const action = {
        // getList: ,
        editId: edit_ProductionId,
        deleteId: delete_ProductionId,
        postSucc: postMessage,
        updateSucc: updateWorkOrderListSuccess,
        deleteSucc: delete_ProductionIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let master_Path = '';
        let make_btn = false

        if (subPageMode === url.PRODUCTION_LIST) {
            page_Id = pageId.PRODUCTION_LIST;
            master_Path = url.PRODUCTION_MASTER;
        }

        else if (subPageMode === url.PRODUCTION_REISSUE_STP) {
            page_Id = pageId.PRODUCTION_REISSUE_STP
                page_Mode = mode.mode2save
            make_btn = true;
        };
        // dispatch(getOrderListPage(""))//for clear privious order list
        setOtherState({ masterPath: master_Path, makeBtnShow: make_btn })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Production Count"} :0`))
        goButtonHandler(true)
    }, []);

    const { userAccess, pageField,  productionFilter } = reducers;
    const { fromdate, todate } = productionFilter

 
    useEffect(() => {

        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId.PRODUCTION_LIST)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])


    function downBtnFunc(row) {
        var ReportType = report.Stock;   //Stock
        dispatch(getpdfReportdata(production_Edit_API, ReportType, row.id))
    }

    // useEffect(() => {
    //     if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
    //         history.push({
    //             pathname: GRNitem.path,
    //             page_Mode: GRNitem.page_Mode,
    //         })
    //     }
    // }, [GRNitem])

    const goButtonHandler = (onload = false) => {
        let FromDate
        let ToDate
        if (onload) {
            FromDate = currentDate;
            ToDate = currentDate;
        } else {
            ToDate = todate;
            FromDate = fromdate;
        }
        const jsonBody = JSON.stringify({
            FromDate: FromDate,
            ToDate: ToDate,
        });

        dispatch(getProductionListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...productionFilter }
        newObj.fromdate = date
        dispatch(Productionlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...productionFilter }
        newObj.todate = date
        dispatch(Productionlistfilters(newObj))
    }

    const makeBtnFunc = (list = []) => {
        history.push({
            pathname: url.PRODUCTIONRE_ISSUE,
            // page_Mode: ,
        })
        // var isGRNSelect = ''
        // var challanNo = ''
        // const grnRef = []
        // if (list.length > 0) {
        //     list.forEach(ele => {
        //         if (ele.hasSelect) {
        //             grnRef.push({
        //                 Invoice: null,
        //                 Order: ele.id,
        //                 ChallanNo: ele.FullOrderNumber,
        //                 Inward: false
        //             });
        //             isGRNSelect = isGRNSelect.concat(`${ele.id},`)
        //             challanNo = challanNo.concat(`${ele.FullOrderNumber},`)
        //         }
        //     });

        //     if (isGRNSelect) {

        //         isGRNSelect = isGRNSelect.replace(/,*$/, '');//****** withoutLastComma  function */
        //         challanNo = challanNo.replace(/,*$/, '');           //****** withoutLastComma  function */

        //         const jsonBody = JSON.stringify({
        //             OrderIDs: isGRNSelect,
        //             Mode:list[0].POType===""?"":1
        //         })

        //         dispatch(getGRN_itemMode2({ jsonBody, pageMode, path: url.GRN_ADD, grnRef, challanNo }))

        //     } else {
        //         alert("Please Select Order1")
        //     }
        // }
    }
    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">

                <div className="px-2  c_card_header"  >
                    <div className="row" >
                        <Col sm="5" >
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="6">
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
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="5">
                            <FormGroup className=" mb-1 row mt-3 " >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "65px", marginRight: "0.4cm" }}>To Date</Label>
                                <Col sm="6 ">
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
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="1" className="mx-4 ">
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 m-3  "
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
                            MasterModal={ProductionMaster}
                            masterPath={otherState.masterPath}
                            page_Mode={pageMode}
                            makeBtnShow={otherState.makeBtnShow}
                            makeBtnName={"make ReIssue"}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"Production"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            downBtnFunc={downBtnFunc}
                            goButnFunc={goButtonHandler}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}
export default ProductionList;