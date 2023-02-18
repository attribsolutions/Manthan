import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import { PRODUCTIONRE_ISSUE_LIST, PRODUCTIONRE_ISSUE} from "../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate, excelDownCommonFunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import {
    getWorkOrderListPage,
    updateWorkOrderListSuccess
} from "../../../store/Purchase/WorkOrder/action";
import ProductionReIssue from "./ProductionReIssue";
import { update_ProductionReIssueIdSuccess, delete_ProductionReIssueId, edit_ProductionReIssueId, getProductionReIssueListPage, ProductionReIssuelistfilters } from "../../../store/Purchase/ProductionRedux/actions";
import { MetaTags } from "react-meta-tags";
import * as report from '../../../Reports/ReportIndex'
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { Material_Issue_Edit_API, production_Edit_API } from "../../../helpers/backend_helper";

const ProductionReIssueList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const hasPagePath = history.location.pathname
    const [pageMode, setpageMode] = useState(PRODUCTIONRE_ISSUE_LIST)
    const [userAccState, setUserAccState] = useState('');
    const reducers = useSelector(
        (state) => ({
            tableList: state.ProductionReIssueReducer.ProductionReIssueList,
            deleteMsg: state.ProductionReIssueReducer.deleteMsg,
            updateMsg: state.ProductionReIssueReducer.updateMsg,
            postMsg: state.ProductionReIssueReducer.postMsg,
            editData: state.ProductionReIssueReducer.editData,
            productionFilter: state.ProductionReIssueReducer.productionReIssueFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const action = {
         getList: getProductionReIssueListPage,
        editId: edit_ProductionReIssueId,
        deleteId: delete_ProductionReIssueId,
        postSucc: postMessage,
        updateSucc: update_ProductionReIssueIdSuccess,
        deleteSucc: delete_ProductionReIssueIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        setpageMode(hasPagePath)
        dispatch(BreadcrumbShowCountlabel(`${"Production Count"} :0`))
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(pageId.PRODUCTIONRE_ISSUE_LIST))
        goButtonHandler(true)
    }, []);
    const { userAccess, pageField, tableList, productionReIssueFilter } = reducers;
    const { fromdate, todate } = productionReIssueFilter

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList]);

    useEffect(() => {
        
        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId.PRODUCTIONRE_ISSUE_LIST)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])
    function downBtnFunc(row) {
        var ReportType = report.Stock;   //Stock
        dispatch(getpdfReportdata(production_Edit_API,ReportType, row.id))
    }

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
        let newObj = { ...productionReIssueFilter }
        newObj.fromdate = date
        dispatch(ProductionReIssuelistfilters(newObj))
    }
    function todateOnchange(e, date) {
        let newObj = { ...productionReIssueFilter }
        newObj.todate = date
        dispatch(ProductionReIssuelistfilters(newObj))
    }
    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">

                <div className="px-2  c_card_header">
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
                            MasterModal={ProductionReIssue}
                            masterPath={PRODUCTIONRE_ISSUE}
                            ButtonMsgLable={"ProductionReIssue"}
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
export default ProductionReIssueList;