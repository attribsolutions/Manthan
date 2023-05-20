import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { date_ymd_func, excelDownCommonFunc, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import {
    deleteWorkOrderId,
    deleteWorkOrderIdSuccess,
    editWorkOrderList,
    getWorkOrderListPage,
    updateWorkOrderListSuccess,
} from "../../../store/Production/WorkOrder/action";
import WorkOrder from "./WorkOrder";
import { mode, url, pageId } from "../../../routes/index"
import { goButtonForMaterialIssue_Master_Action } from "../../../store/Production/Matrial_Issue/action";
import { C_DatePicker } from "../../../CustomValidateForm";

const WorkOrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = date_ymd_func();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, })
    const reducers = useSelector(
        (state) => ({
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

    const { pageField, makeProductionReIssue } = reducers;
    const { fromdate, todate } = hederFilters
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

    useEffect(() => {
        setpageMode(page_mode)
        dispatch(BreadcrumbShowCountlabel(`${"Work Order Count"} :0`))
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        goButtonHandler(true)

    }, []);

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
        let newObj = { ...hederFilters }
        newObj.fromdate = date
        setHederFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.todate = date
        setHederFilters(newObj)
    }


    const makeBtnFunc = (list = []) => {

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