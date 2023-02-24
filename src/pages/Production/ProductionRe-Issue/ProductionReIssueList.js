import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { MetaTags } from "react-meta-tags";
import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as report from '../../../Reports/ReportIndex';
import * as pageId from "../../../routes/allPageID";
import * as mode from "../../../routes/PageMode";
import * as url from "../../../routes/route_url";
import {
    delete_Production_ReIssueId, delete_Production_ReIssueIdSuccess,
    edit_Production_ReIssueId, getProduction_ReIssueListPage,
    Save_Production_ReIssueSuccess,
    update_Production_ReIssueIdSuccess
}
from "../../../store/Production/ProductionReissueRedux/actions";
//  from "../../store/Production/ProductionReissueRedux/actions";
import { commonPageFieldList } from "../../../store/actions";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { production_Edit_API } from "../../../helpers/backend_helper";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import ProductionReIssueAdd from "./PrductionReIssueAdd";


const ProductionReIssueList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({ masterPath: url.PRODUCTION_REISSUE, makeBtnShow: false, newBtnPath: url.PRODUCTION_REISSUE_STP });

    const [userAccState, setUserAccState] = useState('');;
    const [todate, settodate] = useState(currentDate);
    const [fromdate, setfromdate] = useState(currentDate);

    const reducers = useSelector(
        (state) => ({
            tableList: state.ProductionReIssueReducer.productionReIssueList,
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
        getList: getProduction_ReIssueListPage,
        editId: edit_Production_ReIssueId,
        deleteId: delete_Production_ReIssueId,
        postSucc: Save_Production_ReIssueSuccess,
        updateSucc: update_Production_ReIssueIdSuccess,
        deleteSucc: delete_Production_ReIssueIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldList(pageId.PRODUCTION_REISSUE_LIST))
        goButtonHandler(true)
    }, []);

    const { userAccess, pageField } = reducers;


    useEffect(() => {

        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId.PRODUCTION_REISSUE_LIST)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    function downBtnFunc(row) {
        var ReportType = report.Stock;   //Stock
        dispatch(getpdfReportdata(production_Edit_API, ReportType, row.id))
    }

    const goButtonHandler = (onload = false) => {
        // let FromDate
        // let ToDate
        // if (onload) {
        //     FromDate = currentDate;
        //     ToDate = currentDate;
        // } else {
        //     ToDate = todate;
        //     FromDate = fromdate;
        // }
        // debugger
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
        });

        dispatch(getProduction_ReIssueListPage(jsonBody));
    }
    function fromdateOnchange(e, date) {
        setfromdate(date)
        // let newObj = { ...productionReIssueFilter }
        // newObj.fromdate = date
        // dispatch(ProductionReIssuelistfilters(newObj))
    }
    function todateOnchange(e, date) {
        settodate(date)

        // let newObj = { ...productionReIssueFilter }
        // newObj.todate = date
        // dispatch(ProductionReIssuelistfilters(newObj))
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
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            // makeBtnFunc={makeBtnFunc}

                            ButtonMsgLable={"ProductionReIssue"}
                            deleteName={"ItemName"}
                            MasterModal={ProductionReIssueAdd}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}
export default ProductionReIssueList;