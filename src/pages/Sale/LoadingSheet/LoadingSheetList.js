import React, { useEffect, useState, } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import LoadingSheet from "./LoadingSheet";
import {
    DeleteLoadingSheet,
    DeleteLoadingSheetSucccess,
    LoadingSheetListAction,
    LoadingSheetListActionSuccess,
    UpdateLoadingSheet,

} from "../../../store/Sales/LoadingSheetRedux/action";
import { LoadingSheet_API, MultipleInvoice_API } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { Col, FormGroup, Label } from "reactstrap";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { useHistory } from "react-router-dom";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const LoadingSheetList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const currentDate_ymd = _cfunc.date_ymd_func()

    const [headerFilters, setHeaderFilters] = useState('');
    const [pageMode] = useState(mode.defaultList);

    const reducers = useSelector(
        (state) => ({
            loading: state.LoadingSheetReducer.loading,
            listBtnLoading: (state.LoadingSheetReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading),
            tableList: state.LoadingSheetReducer.LoadingSheetlist,
            deleteMsg: state.LoadingSheetReducer.deleteMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            LoadingSheetUpdateList: state.LoadingSheetReducer.LoadingSheetUpdate,
        })
    );

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;
    const { pageField, LoadingSheetUpdateList } = reducers;


    const action = {
        getList: LoadingSheetListAction,
        deleteId: DeleteLoadingSheet,
        deleteSucc: DeleteLoadingSheetSucccess
    }

    let page_Id = pageId.LOADING_SHEET_LIST
    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        // dispatch(BreadcrumbShowCountlabel(`${"LoadingSheet Count"} :0`))
        if (!(_cfunc.loginSelectedPartyID() === 0)) {
            goButtonHandler()
        }
        return () => {
            dispatch(LoadingSheetListActionSuccess([]))
        }
    }, []);

    useEffect(() => {
        if ((LoadingSheetUpdateList.Status === true) && (LoadingSheetUpdateList.StatusCode === 200)) {
            history.push({
                pathname: LoadingSheetUpdateList.path,
            })
        }
    }, [LoadingSheetUpdateList])

    const goButtonHandler = () => {
        try {
            if ((_cfunc.loginSelectedPartyID() === 0)) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            const jsonBody = JSON.stringify({
                FromDate: fromdate,
                ToDate: todate,
                PartyID: _cfunc.loginSelectedPartyID(),
            });

            dispatch(LoadingSheetListAction(jsonBody));
        } catch (error) { }
        return
    };

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

    function downBtnFunc(config) {

        if (config.btnmode === "MultiInvoice") {
            config["ReportType"] = report.invoice;
            config["forceA5"] = true;
            dispatch(getpdfReportdata(MultipleInvoice_API, config))
        } else {
            config["ReportType"] = report.VanLoadingPartyWiseInvoice
            dispatch(getpdfReportdata(LoadingSheet_API, config))
        }
    }

    const otherBtn_1Func = (list) => {
        dispatch(UpdateLoadingSheet({ RowId: list.rowData.id, path: url.LOADING_SHEET_LIST_UPDATE, btnId: `btn-otherBtn_1-${list.id}` }));
    };

    function partyOnChngeButtonHandler() {
        dispatch(LoadingSheetListActionSuccess([]))
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.loading || !pageField} />

            <div className="page-content">

                <PartyDropdown_Common changeButtonHandler={partyOnChngeButtonHandler} />

                <div className="px-2  c_card_filter text-black " >
                    <div className="row">
                        <div className=" row mt-2 mb-1">
                            <Col sm="5" className="">
                                <FormGroup className=" row" >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>From Date</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            options={{
                                                maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            name='fromdate'
                                            value={fromdate}
                                            onChange={fromdateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="6" className="">
                                <FormGroup className="row" >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "65px" }}>To Date</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            options={{
                                                maxDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                                                altInput: true,
                                                altFormat: "d-m-Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                            nane='todate'
                                            value={todate}
                                            onChange={todateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="1" className="">
                                <Go_Button loading={reducers.loading}
                                    id={'LoadingSheet'}
                                    onClick={goButtonHandler} />
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
                            masterPath={LoadingSheet}
                            newBtnPath={url.LOADING_SHEET}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            otherBtn_1Func={otherBtn_1Func}
                            ButtonMsgLable={"LoadingSheet"}
                            deleteName={"LoadingSheetNo"}
                            MasterModal={LoadingSheet}
                            totalAmountShow={true}
                        />

                        : null
                }
            </div>

        </React.Fragment>
    )
}

export default LoadingSheetList;