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
    UpdateLoadingSheet,

} from "../../../store/Sales/LoadingSheetRedux/action";
import { LoadingSheet_API, MultipleInvoice_API } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { Button, Col, FormGroup, Label } from "reactstrap";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { useHistory } from "react-router-dom";
import { C_DatePicker } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import { Go_Button } from "../../../components/Common/CommonButton";
import { getpartysetting_API } from "../../../store/Administrator/PartySetting/action";

const LoadingSheetList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const currentDate_ymd = _cfunc.date_ymd_func()
    const systemSetting = _cfunc.loginSystemSetting();


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
            PartySettingdata: state.PartySettingReducer.PartySettingdata,
            LoadingSheetUpdateList: state.LoadingSheetReducer.LoadingSheetUpdate,
        })
    );

    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;
    const { userAccess, pageField, PartySettingdata, LoadingSheetUpdateList } = reducers;
    const { Data = {} } = PartySettingdata;

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
        dispatch(BreadcrumbShowCountlabel(`${"LoadingSheet Count"} :0`))
        goButtonHandler()
        dispatch(getpartysetting_API(_cfunc.loginUserDetails().Party_id, _cfunc.loginCompanyID()))

    }, []);

    useEffect(() => {
        if ((LoadingSheetUpdateList.Status === true) && (LoadingSheetUpdateList.StatusCode === 200)) {
            history.push({
                pathname: LoadingSheetUpdateList.path,
            })
        }
    }, [LoadingSheetUpdateList])

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            PartyID: _cfunc.loginPartyID(),
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

    function downBtnFunc(config) {

        if (config.downbtnType === "IsMultipleInvoicePrint") {
            config["ReportType"] = report.invoiceA5
            config["systemSetting"] = systemSetting
            dispatch(getpdfReportdata(MultipleInvoice_API, config))
        } else {
            config["ReportType"] = report.VanLoadingPartyWiseInvoice
            dispatch(getpdfReportdata(LoadingSheet_API, config))
        }
    }

    const otherBtn_1Func = (list) => {
        dispatch(UpdateLoadingSheet({ RowId: list.id, path: url.LOADING_SHEET_LIST_UPDATE, btnId: `btn-otherBtn_1-${list.id}` }));
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="px-2  c_card_filter text-black " >
                    <div className="row">
                        <div className=" row mt-2 mb-1">
                            <Col sm="5" className="">
                                <FormGroup className=" row" >
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
                            <Col sm="6" className="">
                                <FormGroup className="row" >
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
                        />

                        : null
                }
            </div>

        </React.Fragment>
    )
}

export default LoadingSheetList;