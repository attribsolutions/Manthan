import React, { useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../../store/actions";
import {

    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    updateBOMListSuccess
} from "../../../../store/Production/BOMRedux/action";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import LoadingSheet from "./LoadingSheet";
import { getLoadingSheetList, LoadingSheetlistfilter, LoadingSheetlistfilters } from "../../../../store/Sales/LoadingSheetRedux/action";
import CommonListPage from "../../../../components/Common/CommonMasterListPage";
import { LoadingSheet_API } from "../../../../helpers/backend_helper";
import * as report from '../../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../../store/Utilites/PdfReport/actions";
import Flatpickr from "react-flatpickr";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { loginPartyID } from "../../../../components/Common/CommonFunction";
import Select from "react-select";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList";

const LoadingSheetList = () => {
    const dispatch = useDispatch();
    const reducers = useSelector(
        (state) => ({
            LoadingSheetlistfilters: state.LoadingSheetReducer.LoadingSheetList,
            deleteMsg: state.BOMReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            bomlistFilters: state.BOMReducer.bomlistFilters,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, pageField, LoadingSheetlistfilters } = reducers;
    const { fromdate, todate } = LoadingSheetlistfilters;

    const page_Id = pageId.LOADING_SHEET_LIST

    const action = {
        // getList: getLoadingSheetList,
        editId: editBOMList,
        deleteId: deleteBOMId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteBOMIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"LoadingSheet Count"} :0`))
        // dispatch(getLoadingSheetList())
    }, []);

    function goButtonHandler() {
        debugger
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            PartyID: loginPartyID(),
        });
        dispatch(getLoadingSheetList(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...LoadingSheetlistfilters }
        newObj.fromdate = date
        dispatch(LoadingSheetlistfilter(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...LoadingSheetlistfilters }
        newObj.todate = date
        dispatch(LoadingSheetlistfilter(newObj))
    }


    function downBtnFunc(row) {
        var ReportType = report.VanLoadingPartyWiseInvoice;
        dispatch(getpdfReportdata(LoadingSheet_API, ReportType, row.id))
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">
                <div className="px-2  c_card_filter text-black " >
                    <div className="row">
                        <div className=" row">
                            <Col sm="5" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>From Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            name='fromdate'
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            value={fromdate}
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={fromdateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="5" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "65px" }}>To Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            nane='todate'
                                            className="form-control d-block p-2 bg-white text-dark"
                                            value={todate}
                                            placeholder="Select..."
                                            options={{
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            onChange={todateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="2" className="mt-3 ">
                                <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                    onClick={() => goButtonHandler()}
                                >Go</Button>
                            </Col>
                        </div>

                    </div>
                </div>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            // masterPath={otherState.masterPath}
                            // newBtnPath={otherState.newBtnPath}
                            // makeBtnShow={otherState.makeBtnShow}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            ButtonMsgLable={"LoadingSheet"}
                            deleteName={"FullGRNNumber"}
                            MasterModal={LoadingSheet}
                        />

                        : null
                }
            </div>

        </React.Fragment>
    )
}

export default LoadingSheetList;