import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../../store/actions";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList"
import { BIllOf_MATERIALS_LIST } from "../../../../routes/route_url";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import {
    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    getBOMListPage,
    updateBOMListSuccess
} from "../../../../store/Production/BOMRedux/action";
import BOMMaster from "../BOMMaster/BOMIndex";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import { C_DatePicker } from "../../../../CustomValidateForm";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { allLabelWithBlank } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";


const BOMList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(BIllOf_MATERIALS_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, venderSelect: allLabelWithBlank })

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

    const { userAccess, pageField } = reducers;
    const { fromdate, todate } = hederFilters;


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
        const page_Id = pageId.BIllOf_MATERIALS_LIST
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        // dispatch(BreadcrumbShowCountlabel(`${"BOM Count"} :0`))
        goButtonHandler(true)

    }, []);


    useEffect(() => {
        const pageId = 70
        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Company: _cfunc.loginCompanyID(),
            Party: _cfunc.loginPartyID(),
        });
        dispatch(getBOMListPage(jsonBody));
    }

    function fromdateOnchange(date) {
        let newObj = { ...hederFilters }
        newObj.fromdate = date
        setHederFilters(newObj)
    }

    function todateOnchange( date) {
        let newObj = { ...hederFilters }
        newObj.todate = date
        setHederFilters(newObj)
    }
    return (
        <React.Fragment>
            <div className="page-content">

                <div className="px-2   c_card_filter text-black"  >
                    <div className="row">
                        <Col sm="5">
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

                        <Col sm="5" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
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
                            MasterModal={BOMMaster}
                            masterPath={url.BIllOf_MATERIALS}
                            newBtnPath={url.BIllOf_MATERIALS}
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

export default BOMList;