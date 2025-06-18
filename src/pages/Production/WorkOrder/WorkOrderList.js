import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess, getpdfReportdata, } from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { date_ymd_func, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import {
    deleteWorkOrderId,
    deleteWorkOrderIdSuccess,
    editWorkOrderList,
    getWorkOrderListPage,
    getWorkOrderListPageSuccess,
    updateWorkOrderListSuccess,
} from "../../../store/Production/WorkOrder/action";
import WorkOrder from "./WorkOrder";
import { mode, url, pageId } from "../../../routes/index"
import { goButtonForMaterialIssue_Master_Action } from "../../../store/Production/Matrial_Issue/action";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import useCheckStockEntry from "../../../components/Common/commonComponent/CheckStockEntry";
import BatchTraceabilityReport from "../../../Reports/BatchTracebilityReport/Page";
import { BatchTraceabilityReport_API } from "../../../helpers/backend_helper";

import * as report from '../../../Reports/ReportIndex'

const WorkOrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = date_ymd_func();

    const subPageMode = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, })
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);
    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.WorkOrderReducer.loading,
            listBtnLoading: (state.MaterialIssueReducer.listBtnLoading || state.WorkOrderReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading),
            tableList: state.WorkOrderReducer.WorkOrderList,
            deleteMsg: state.WorkOrderReducer.deleteMsg,
            updateMsg: state.WorkOrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.WorkOrderReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            makeProductionReIssue: state.MaterialIssueReducer.GoButton
        })
    );

    const { pageField, makeProductionReIssue, goBtnLoading, listBtnLoading } = reducers;
    const { fromdate, todate } = hederFilters
    const page_Id = (subPageMode === url.MATERIAL_ISSUE_STP) ? pageId.MATERIAL_ISSUE_STP : pageId.WORK_ORDER_LIST;
    const page_mode = (subPageMode === url.MATERIAL_ISSUE_STP) ? mode.modeSTPList : mode.defaultList;

    const action = {
        getList: getWorkOrderListPage,
        editId: editWorkOrderList,
        deleteId: deleteWorkOrderId,
        postSucc: postMessage,
        updateSucc: updateWorkOrderListSuccess,
        deleteSucc: deleteWorkOrderIdSuccess
    }

    const { Actionhandler } = useCheckStockEntry(hederFilters.fromdate, commonPartyDropSelect);

    useEffect(() => {
        setpageMode(page_mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        goButtonHandler(true)
        return () => {
            if (subPageMode === url.WORK_ORDER_LIST) {
                dispatch(getWorkOrderListPageSuccess([]));
            }
        }
    }, []);

    useEffect(() => {
        if (makeProductionReIssue.Status === true && makeProductionReIssue.StatusCode === 200) {
            history.push({
                pathname: makeProductionReIssue.path,
                page_Mode: makeProductionReIssue.pageMode,
            })
        }
    }, [makeProductionReIssue])

    const goButtonHandler = (onload) => {

        const jsonBody = JSON.stringify({
            FromDate: ((onload === true) && (subPageMode === url.MATERIAL_ISSUE_STP)) ? "" : fromdate,
            ToDate: ((onload === true) && (subPageMode === url.MATERIAL_ISSUE_STP)) ? "" : todate,
            Party: _cfunc.loginSelectedPartyID()
        });
        dispatch(getWorkOrderListPage({ jsonBody, subPageMode }));
    }

    function fromdateOnchange(e, date) {

        let newObj = { ...hederFilters }
        newObj.fromdate = date
        setHederFilters(newObj)
    }

    function todateOnchange(e, date) {

        let newObj = { ...hederFilters }
        newObj.todate = date
        setHederFilters(newObj)
    }
    function downBtnFunc(config) {
        
        const { rowData } = config;
        const newConfig = {
            ...config,
            ReportType: report.Batch_Traceability_Report,
            jsonBody: { WorkOrderID: rowData.id }
        };

        dispatch(getpdfReportdata(BatchTraceabilityReport_API, newConfig));
    }


    const makeBtnFunc = (list = [], btnId) => {

        try {
            if (list.length > 0) {
                const jsonData = list[0];

                jsonData.NumberOfLot = jsonData.RemainingLot;  // Update NumberOfLot field to RemainingLot 
                jsonData.Quantity = jsonData.RemaningQty;  // Update Quantity field to RemaningQty 

                const jsonBody = JSON.stringify({
                    WorkOrder: jsonData.id,
                    Item: jsonData.Item,
                    Company: loginCompanyID(),
                    Party: loginPartyID(),
                    Quantity: parseInt(jsonData.Quantity),
                    NoOfLots: jsonData.NumberOfLot
                });



                Actionhandler({
                    action: goButtonForMaterialIssue_Master_Action, // The function you want to call
                    params: {
                        jsonBody,
                        pageMode: mode.modeSTPsave,
                        path: url.MATERIAL_ISSUE,
                        ListData: list[0],
                        goButtonCallByMode: true,
                        btnId
                    },
                });



                // dispatch(goButtonForMaterialIssue_Master_Action({
                //     jsonBody,
                //     pageMode: mode.modeSTPsave,
                //     path: url.MATERIAL_ISSUE,
                //     ListData: list[0],
                //     goButtonCallByMode: true,
                //     btnId
                // }));
            }
        } catch (e) {
            console.error("Error:", e);
        }
    };

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={goBtnLoading || pageField} />
            <div className="page-content">

                <div className="px-2   c_card_filter text-black"  >
                    <div className="row" >
                        <Col sm="5" >
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='fromdate'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm="5">
                            <FormGroup className=" mb-1 row mt-3 " >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "65px", marginRight: "0.4cm" }}>ToDate</Label>
                                <Col sm="6 ">
                                    <C_DatePicker
                                        options={{
                                            minDate: (_cfunc.disablePriviousTodate({ fromDate: fromdate })),
                                            maxDate: "today",
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        value={_cfunc.ToDate({ FromDate: fromdate, Todate: todate })}
                                        nane='todate'
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="1" ></Col>
                        <Col sm="1" className="mt-3 ">
                            <Go_Button loading={goBtnLoading} onClick={goButtonHandler} />
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={WorkOrder}
                            masterPath={url.WORK_ORDER}
                            newBtnPath={url.WORK_ORDER}
                            downBtnFunc={downBtnFunc}
                            ButtonMsgLable={""}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnName={"Make Material Issue"}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default WorkOrderList;