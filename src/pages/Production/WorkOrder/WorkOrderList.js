import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { excelDownCommonFunc, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import { useMemo } from "react";
import {
    deleteWorkOrderId,
    deleteWorkOrderIdSuccess,
    editWorkOrderList,
    getWorkOrderListPage,
    updateWorkOrderListSuccess,
    WorkOrderlistfilters
} from "../../../store/Production/WorkOrder/action";
import WorkOrder from "./WorkOrder";
import * as url from "../../../routes/route_url"
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { goButtonForMaterialIssue_Master_Action } from "../../../store/Production/Matrial_Issue/action";
import { C_DatePicker } from "../../../CustomValidateForm";

const WorkOrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
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
            makeProductionReIssue: state.MaterialIssueReducer.GoButton
        })
    );

    const { userAccess, pageField, tableList, workOrderlistFilters, makeProductionReIssue } = reducers;
    const { fromdate, todate } = workOrderlistFilters
    const page_Id = (hasPagePath === url.MATERIAL_ISSUE_STP) ? pageId.MATERIAL_ISSUE_STP : pageId.WORK_ORDER_LIST;
    const page_mode = (hasPagePath === url.MATERIAL_ISSUE_STP) ? mode.modeSTPsave : mode.defaultList;

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
        setpageMode(page_mode)
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

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    useEffect(() => {
        
        if (makeProductionReIssue.Status === true && makeProductionReIssue.StatusCode === 200) {
            history.push({
                pathname: makeProductionReIssue.path,
                page_Mode: makeProductionReIssue.pageMode,
            })
        }
    }, [makeProductionReIssue])

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
        
        // history.push({
        //     pathname: url.MATERIAL_ISSUE,
        //     pageMode: mode.modeSTPsave,
        //     [mode.editValue]: list[0]
        // })
        // const jsonBody = JSON.stringify({
        //     WorkOrder: id,
        //     Item: Item,
        //     Company: loginCompanyID(),
        //     Party: loginPartyID(),
        //     Quantity: parseInt(Quantity)
        // });
        // dispatch(goButtonForMaterialIssue_Master_Action(jsonBody));
        var jsonData = list[0]
        try {
            const jsonBody = JSON.stringify({
                WorkOrder: jsonData.id,
                Item: jsonData.Item,
                Company: loginCompanyID(),
                Party: loginPartyID(),
                Quantity: parseInt(jsonData.Quantity)
            })
            const body = { jsonBody, pageMode, path: url.MATERIAL_ISSUE, ListData: list[0] }
            dispatch(goButtonForMaterialIssue_Master_Action(body))

        } catch (e) { }
    }
    
    return (
        <React.Fragment>
            <div className="page-content">


                <div className="px-2   c_card_header text-black"  >
                    <div className="row" >
                        <Col sm="5" >
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
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
                                    style={{ width: "65px", marginRight: "0.4cm" }}>To Date</Label>
                                <Col sm="6 ">
                                    <C_DatePicker
                                        name="todate"
                                        value={todate}
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
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={WorkOrder}
                            masterPath={url.WORK_ORDER}
                            newBtnPath={url.WORK_ORDER}
                            ButtonMsgLable={"Work Order"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnShow={pageMode === mode.defaultList ? false : true}
                            makeBtnName={"Make Material Issue"}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default WorkOrderList;