import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Flatpickr from "react-flatpickr";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { excelDownCommonFunc } from "../../../components/Common/CommonFunction";
import { useMemo } from "react";
import MaterialIssueMaster from "./Material_IssueMaster";
import {
    deleteMaterialIssueId,
    deleteMaterialIssueIdSuccess,
    editMaterialIssueId,
    getMaterialIssueListPage,
    MaterialIssuelistfilters
} from "../../../store/Production/Matrial_Issue/action";
import * as url from "../../../routes/route_url"
import * as pageId from "../../../routes/allPageID"
import * as  mode from "../../../routes/PageMode";
import { MetaTags } from "react-meta-tags";
import { updateWorkOrderListSuccess } from "../../../store/Production/WorkOrder/action";

const MaterialIssueList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    // const [pageMode, setpageMode] = useState(page_mode)
    // const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            tableList: state.MaterialIssueReducer.materialIssueList,
            deleteMsg: state.MaterialIssueReducer.deleteMsg,
            updateMsg: state.WorkOrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.MaterialIssueReducer.editData,
            materialIssuelistFilters: state.MaterialIssueReducer.materialIssuelistFilters,
            produtionMake: state.ProductionReducer.produtionMake,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );

    const { userAccess, pageField, tableList, materialIssuelistFilters, produtionMake } = reducers;
    const { fromdate, todate } = materialIssuelistFilters;

    const hasPagePath = history.location.pathname;
    const pageMode = (hasPagePath === url.PRODUCTION_STP) ? mode.modeSTPsave : mode.defaultList;
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
        // setpageMode(page_mode)
        dispatch(BreadcrumbShowCountlabel(`${"Material Issue Count"} :0`))
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        goButtonHandler(true)

    }, []);

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])


    // useEffect(() => {
    //     let userAcc = userAccess.find((inx) => {
    //         return (inx.id === page_Id)
    //     })
    //     if (!(userAcc === undefined)) {
    //         // setUserAccState(userAcc)
    //     }
    // }, [userAccess]);

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
        history.push({
            pathname: url.PRODUCTION_MASTER,
            editValue: obj,
            pageMode: mode.modeSTPsave
        })
    };

    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
        });
        dispatch(getMaterialIssueListPage(jsonBody));
    };

    function fromdateOnchange(e, date) {
        let newObj = { ...materialIssuelistFilters }
        newObj.fromdate = date
        dispatch(MaterialIssuelistfilters(newObj))
    };

    function todateOnchange(e, date) {
        let newObj = { ...materialIssuelistFilters }
        newObj.todate = date
        dispatch(MaterialIssuelistfilters(newObj))
    };

    return (
        <React.Fragment>
          

            <div className="page-content">

                <div className="px-2  c_card_header text-black" >
                    <div className=" row" >
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