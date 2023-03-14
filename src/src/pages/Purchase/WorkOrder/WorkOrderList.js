import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase"
import { Button, Col, Fade, FormGroup, Label } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useHistory } from "react-router-dom";
import { excelDownCommonFunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import {
    deleteWorkOrderId,
    deleteWorkOrderIdSuccess,
    editWorkOrderList,
    getWorkOrderListPage,
    updateWorkOrderListSuccess,
    WorkOrderlistfilters
} from "../../../store/Purchase/WorkOrder/action";
import WorkOrder from "./WorkOrder";
import { getProduction_Mode2 } from "../../../store/Purchase/ProductionRedux/actions";
import * as url from "../../../routes/route_url"
import * as pageId from "../../../routes/allPageID"

const WorkOrderList = () => {
    
    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(url.WORK_ORDER_LIST)
    const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            tableList: state.WorkOrderReducer.WorkOrderList,
            deleteMsg: state.WorkOrderReducer.deleteMsg,
            updateMsg: state.WorkOrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.WorkOrderReducer.editData,
            workOrderlistFilters: state.WorkOrderReducer.workOrderlistFilters,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { userAccess, pageField, tableList, workOrderlistFilters, GRNitem } = reducers;
    const { fromdate, todate } = workOrderlistFilters

    const action = {
        getList: getWorkOrderListPage,
        editId: editWorkOrderList,
        deleteId: deleteWorkOrderId,
        postSucc: postMessage,
        updateSucc: updateWorkOrderListSuccess,
        deleteSucc: deleteWorkOrderIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = (hasPagePath === url.MATERIAL_ISSUE_ADD_Mode_2) ? pageId.MATERIAL_ISSUE_ADD_Mode_2 : pageId.WORK_ORDER_LIST;
        setpageMode(hasPagePath)
        dispatch(BreadcrumbShowCountlabel(`${"Work Order Count"} :0`))
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        goButtonHandler(true)

    }, []);

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])


    useEffect(() => {
        const page_Id = (hasPagePath === url.MATERIAL_ISSUE_ADD_Mode_2) ? pageId.MATERIAL_ISSUE_ADD_Mode_2 : pageId.WORK_ORDER_LIST;

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    // useEffect(() => {
    //     if (GRNitem.Status === true && GRNitem.StatusCode === 200) {
    //         history.push({
    //             pathname: GRNitem.path,
    //             pageMode: GRNitem.pageMode,
    //         })
    //     }
    // }, [GRNitem])

    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
        });
        dispatch(getWorkOrderListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...workOrderlistFilters }
        newObj.fromdate = date
        dispatch(WorkOrderlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...workOrderlistFilters }
        newObj.todate = date
        dispatch(WorkOrderlistfilters(newObj))
    }

    const makeBtnFunc = (list = []) => {

        history.push({
            pathname: url.MATERIAL_ISSUE,
            pageMode: "save",
            editValue: list[0]
        })

    }
    return (
        <React.Fragment>
            <div className="page-content">
                {/* <Breadcrumb
                    pageHeading={userAccState.PageHeading}
                    newBtnView={(pageMode === url.WORK_ORDER_LIST) ? true : false}
                    showCount={true}
                    excelBtnView={true}
                    excelData={downList} /> */}

                <div className="px-2   c_card_header text-black"  >
                    <div className="row" >
                        <Col sm="5" >
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="6">
                                    <Flatpickr
                                        name='fromdate'
                                        value={fromdate}
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
                                        value={todate}
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
                            MasterModal={WorkOrder}
                            masterPath={url.WORK_ORDER}
                            ButtonMsgLable={"Work Order"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnShow={pageMode === url.WORK_ORDER_LIST ? false : true}
                            makeBtnName={"Make Material Issue"}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default WorkOrderList;