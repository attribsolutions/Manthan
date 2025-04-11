import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { date_ymd_func } from "../../../components/Common/CommonFunction";
import MaterialIssueMaster from "./Material_IssueMaster";
import {
    deleteMaterialIssueId,
    deleteMaterialIssueIdSuccess,
    editMaterialIssueId,
    getMaterialIssueListPage,
    getMaterialIssueListPageSuccess,
} from "../../../store/Production/Matrial_Issue/action";
import { mode, url, pageId } from "../../../routes/index";
import { updateWorkOrderListSuccess } from "../../../store/Production/WorkOrder/action";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import useCheckStockEntry from "../../../components/Common/commonComponent/CheckStockEntry";

const MaterialIssueList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = date_ymd_func();

    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, })

    const reducers = useSelector(
        (state) => ({
            goBtnLoading: state.MaterialIssueReducer.listGoBtnloading,
            listBtnLoading: state.MaterialIssueReducer.listBtnLoading,
            tableList: state.MaterialIssueReducer.materialIssueList,
            deleteMsg: state.MaterialIssueReducer.deleteMsg,
            updateMsg: state.WorkOrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.MaterialIssueReducer.editData,
            produtionMake: state.ProductionReducer.produtionMake,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    const { pageField, produtionMake, goBtnLoading } = reducers;
    const { fromdate, todate } = hederFilters;

    const hasPagePath = history.location.pathname;
    const pageMode = (hasPagePath === url.PRODUCTION_STP) ? mode.modeSTPList : mode.defaultList;
    const page_Id = (hasPagePath === url.PRODUCTION_STP) ? pageId.PRODUCTION_STP : pageId.MATERIAL_ISSUE_LIST;

    const action = {
        getList: getMaterialIssueListPage,
        editId: editMaterialIssueId,
        deleteId: deleteMaterialIssueId,
        postSucc: postMessage,
        updateSucc: updateWorkOrderListSuccess,
        deleteSucc: deleteMaterialIssueIdSuccess,
    }
    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        goButtonHandler(true)
        return () => {
            dispatch(getMaterialIssueListPageSuccess([]));
        }
    }, []);

    const { Actionhandler } = useCheckStockEntry(hederFilters.fromdate, commonPartyDropSelect);

    useEffect(() => {
        if (produtionMake.Status === true && produtionMake.StatusCode === 406) {
            history.push({
                pathname: produtionMake.path,
                pageMode: produtionMake.pageMode,
            })
        }
    }, [produtionMake]);

    const makeBtnFunc = (list = {}) => {
        const obj = { ...list[0], EstimatedQuantity: list[0].LotQuantity }
        Actionhandler({
            callback: () => {
                history.push({
                    pathname: url.PRODUCTION_MASTER,
                    editValue: obj,
                    pageMode: mode.modeSTPsave,
                });
            },
        })

    };

    const goButtonHandler = (onload) => {
        const jsonBody = JSON.stringify({
            FromDate: ((onload === true) && (hasPagePath === url.PRODUCTION_STP)) ? "" : fromdate,
            ToDate: ((onload === true) && (hasPagePath === url.PRODUCTION_STP)) ? "" : todate,
            Party: _cfunc.loginSelectedPartyID()
        });
        dispatch(getMaterialIssueListPage(jsonBody));
    };

    function fromdateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.fromdate = date
        setHederFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.todate = date
        setHederFilters(newObj)
    };

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={goBtnLoading || !pageField} />
            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className=" row" >
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
                            <Go_Button
                                loading={goBtnLoading}
                                onClick={goButtonHandler} />
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={MaterialIssueMaster}
                            masterPath={url.MATERIAL_ISSUE}
                            newBtnPath={url.MATERIAL_ISSUE_STP}
                            ButtonMsgLable={"Material Issue"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnShow={pageMode === mode.defaultList ? false : true}
                            makeBtnName={"Make Production"}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default MaterialIssueList;