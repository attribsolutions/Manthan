import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { date_ymd_func, loginPartyID } from "../../../components/Common/CommonFunction";
import {
    updateWorkOrderListSuccess
} from "../../../store/Production/WorkOrder/action";
import {
    delete_ProductionId,
    delete_ProductionIdSuccess,
    edit_ProductionId,
    getProductionListPage,
    Productionlistfilters
} from "../../../store/Production/ProductionRedux/actions"
import * as report from '../../../Reports/ReportIndex'
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import * as url from "../../../routes/route_url"
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { production_Edit_API } from "../../../helpers/backend_helper";
import ProductionMaster from "./ProductionMaster";
import { makeBtnProduction_ReIssue_STP_action } from "../../../store/Production/ProductionReissueRedux/actions";
import { C_DatePicker } from "../../../CustomValidateForm";

const ProductionList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = date_ymd_func();

    const [subPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '' });
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd })
    const reducers = useSelector(
        (state) => ({
            tableList: state.ProductionReducer.ProductionList,
            deleteMsg: state.ProductionReducer.deleteMsg,
            updateMsg: state.WorkOrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.ProductionReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            makeProductionReIssue: state.ProductionReIssueReducer.makeProductionReIssue,
        })
    );

    const action = {
        editId: edit_ProductionId,
        deleteId: delete_ProductionId,
        postSucc: postMessage,
        updateSucc: updateWorkOrderListSuccess,
        deleteSucc: delete_ProductionIdSuccess
    }

    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let newBtnPath = '';
        let makeBtnShow = false;

        if (subPageMode === url.PRODUCTION_LIST) {
            page_Id = pageId.PRODUCTION_LIST;
            masterPath = url.PRODUCTION_MASTER;
            newBtnPath = url.PRODUCTION_STP;
        }

        else if (subPageMode === url.PRODUCTION_REISSUE_STP) {
            page_Id = pageId.PRODUCTION_REISSUE_STP
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
        }

        setOtherState({ masterPath, makeBtnShow, newBtnPath })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Production Count"} :0`))
        goButtonHandler(true)
    }, []);

    const { pageField, makeProductionReIssue } = reducers;
    const { fromdate, todate } = hederFilters




    useEffect(() => {
        if (makeProductionReIssue.Status === true && makeProductionReIssue.StatusCode === 200) {
            history.push({
                pathname: makeProductionReIssue.path,
                page_Mode: makeProductionReIssue.pageMode,
            })
        }
    }, [makeProductionReIssue])

    function downBtnFunc(row) {
        var ReportType = report.Stock;   //Stock
        dispatch(getpdfReportdata(production_Edit_API, ReportType, row.id))
    }

    const goButtonHandler = (onload = false) => {
        let FromDate
        let ToDate
        if (onload) {
            FromDate = currentDate_ymd;
            ToDate = currentDate_ymd;
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
        let newObj = { ...hederFilters }
        newObj.fromdate = date;
        setHederFilters(newObj);
    }

    function todateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.todate = date;
        setHederFilters(newObj);
    }

    const makeBtnFunc = (list = []) => {

        var Items = { value: list[0].Item, label: list[0].ItemName }
        try {
            const jsonBody = JSON.stringify({
                ProductionID: list[0].id,
                PartyID: loginPartyID()
            })
            const body = { jsonBody, pageMode, path: url.PRODUCTION_REISSUE, productionId: list[0].id, Items: Items }
            dispatch(makeBtnProduction_ReIssue_STP_action(body))

        } catch (e) { }
    }

    return (
        <React.Fragment>
            <div className="page-content">

                <div className="px-2  c_card_header"  >
                    <div className="row" >
                        <Col sm="5" >
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='fromdate'
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
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            makeBtnFunc={makeBtnFunc}

                            makeBtnName={"make ReIssue"}
                            ButtonMsgLable={"Production"}
                            deleteName={"ItemName"}
                            MasterModal={ProductionMaster}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}
export default ProductionList;