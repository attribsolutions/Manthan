import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Flatpickr from "react-flatpickr";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../../store/actions";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList"
import { BIllOf_MATERIALS, BIllOf_MATERIALS_LIST } from "../../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";

import { useHistory } from "react-router-dom";
import { excelDownCommonFunc, loginCompanyID, loginPartyID } from "../../../../components/Common/CommonFunction";
import { useMemo } from "react";
import {
    BOMlistfilters,
    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    getBOMListPage,
    updateBOMListSuccess
} from "../../../../store/Production/BOMRedux/action";
// } from "../../../../store/Production/BOMRedux/action";

import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import LoadingSheet from "./LoadingSheet";

const LoadingSheetList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(url.LOADING_SHEET_LIST)
    const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            tableList: state.BOMReducer.BOMList,
            deleteMsg: state.BOMReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            bomlistFilters: state.BOMReducer.bomlistFilters,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField, tableList, bomlistFilters } = reducers;
    const { fromdate, todate } = bomlistFilters;
    const page_Id = pageId.LOADING_SHEET_LIST

    const action = {
        getList: getBOMListPage,
        editId: editBOMList,
        deleteId: deleteBOMId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteBOMIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {

        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"BOM Count"} :0`))
        goButtonHandler(true)

    }, []);

    useEffect(() => {

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Company: loginCompanyID(),
            Party: loginPartyID(),
        });
        dispatch(getBOMListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...bomlistFilters }
        newObj.fromdate = date
        dispatch(BOMlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...bomlistFilters }
        newObj.todate = date
        dispatch(BOMlistfilters(newObj))
    }
    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">

                <div className="px-2   c_card_header text-black" >
                    <div className="row">
                        <Col sm="5">
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

                        <Col sm="5" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
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
                            MasterModal={LoadingSheet}
                            masterPath={url.LOADING_SHEET}
                            newBtnPath={url.LOADING_SHEET}
                            ButtonMsgLable={"BOM"}
                            deleteName={"ItemName"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default LoadingSheetList;