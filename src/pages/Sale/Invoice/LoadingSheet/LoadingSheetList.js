import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../../store/actions";
import * as pageId from "../../../../routes//allPageID";
import LoadingSheet from "./LoadingSheet";
import {
    DeleteLoadingSheet,
    DeleteLoadingSheetSucccess,
    LoadingSheetListAction,
    UpdateLoadingSheet
} from "../../../../store/Sales/LoadingSheetRedux/action";
import { LoadingSheet_API, MultipleInvoice_API } from "../../../../helpers/backend_helper";
import * as report from '../../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../../store/Utilites/PdfReport/actions";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { currentDate_ymd, loginPartyID } from "../../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList";
import * as url from "../../../../routes/route_url"
import * as mode from "../../../../routes/PageMode"


import { useHistory } from "react-router-dom";
import { C_DatePicker } from "../../../../CustomValidateForm";

const LoadingSheetList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const subPageMode = history.location.pathname;

    const [headerFilters, setHeaderFilters] = useState('');
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '' });
    const [pageMode, setPageMode] = useState(mode.defaultList);

    const reducers = useSelector(
        (state) => ({
            tableList: state.LoadingSheetReducer.LoadingSheetlist,
            deleteMsg: state.LoadingSheetReducer.deleteMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;
    const { userAccess, pageField } = reducers;

    const action = {
        getList: LoadingSheetListAction,
        deleteId: DeleteLoadingSheet,
        deleteSucc: DeleteLoadingSheetSucccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false
        let newBtnPath = ''

        if (subPageMode === url.LOADING_SHEET_LIST) {
            page_Id = pageId.LOADING_SHEET;
            masterPath = url.LOADING_SHEET;
            newBtnPath = url.LOADING_SHEET;
            // page_Mode = mode.modeSTPList
            // makeBtnShow = true;
        }
        setOtherState({ masterPath, makeBtnShow, newBtnPath })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"LoadingSheet Count"} :0`))
        goButtonHandler()
    }, []);

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            PartyID: loginPartyID(),
        });
        dispatch(LoadingSheetListAction(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj)
    }

    function downBtnFunc(row, downbtnType) {
        console.log(downbtnType)
        if (downbtnType === "IsMultipleInvoicePrint") {
            let ReportType = report.invoiceA5
            dispatch(getpdfReportdata(MultipleInvoice_API, ReportType, row.id))
        } else {
            let ReportType = report.VanLoadingPartyWiseInvoice
            dispatch(getpdfReportdata(LoadingSheet_API, ReportType, row.id))
        }
    }

    const updateBtnFunc = (list) => {

        dispatch(UpdateLoadingSheet(list.id));
        history.push(url.LOADING_SHEET_LIST_UPDATE, list);

    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="px-2  c_card_filter text-black " >
                    <div className="row">
                        <div className=" row">
                            <Col sm="5" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>From Date</Label>
                                    <Col sm="7">
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
                                        style={{ width: "65px" }}>To Date</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            nane='todate'
                                            value={todate}
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
                            pageMode={pageMode}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            updateBtnFunc={updateBtnFunc}
                            ButtonMsgLable={"LoadingSheet"}
                            deleteName={"LoadingSheetNo"}
                            MasterModal={LoadingSheet}
                        />

                        : null
                }
            </div>

        </React.Fragment>
    )
}

export default LoadingSheetList;