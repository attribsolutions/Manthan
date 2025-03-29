import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BreadcrumbReset, commonPageFieldList, commonPageFieldListSuccess, getpdfReportdata, } from "../../../store/actions";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { GetVender } from "../../../store/CommonAPI/SupplierRedux/actions";
import { date_ymd_func, loginPartyID } from "../../../components/Common/CommonFunction";
import { useHistory } from "react-router-dom";
import { deleteChallanId, deleteChallanIdSuccess, challanList_ForListPage, } from "../../../store/Inventory/ChallanRedux/actions";
import { makeGRN_Mode_1Action } from "../../../store/Inventory/GRNRedux/actions";
import Challan from "./IBInvoice";
import { C_DatePicker } from "../../../CustomValidateForm";
import { url, mode, pageId } from "../../../routes/index"
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { allLabelWithBlank } from "../../../components/Common/CommonErrorMsg/HarderCodeData";
import * as report from '../../../Reports/ReportIndex'
import { IB_Invoice_Singel_Get_for_Report_Api } from "../../../helpers/backend_helper";
import useCheckStockEntry from "../../../components/Common/commonComponent/CheckStockEntry";

const IBInvoiceList = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();

    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '' });
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, venderSelect: allLabelWithBlank })
    const reducers = useSelector(
        (state) => ({
            vender: state.CommonAPI_Reducer.vender,
            tableList: state.ChallanReducer.ChallanList,
            goBtnLoading: state.ChallanReducer.goBtnLoading,
            deleteMsg: state.ChallanReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            makeGRN: state.GRNReducer.GRNitem,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    const { pageField, vender, makeGRN, deleteMsg } = reducers;
    const { fromdate, todate, venderSelect } = hederFilters;

    const action = {
        deleteId: deleteChallanId,
        deleteSucc: deleteChallanIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false
        let newBtnPath = ''


        if (subPageMode === url.IB_INVOICE_LIST) {
            page_Id = pageId.IB_INVOICE_LIST;
            masterPath = url.IB_INVOICE;
            newBtnPath = url.IB_INVOICE;
            page_Mode = mode.modeSTPList
            makeBtnShow = true;
        }
        else if (subPageMode === url.VDC_INVOICE_LIST) {
            page_Id = pageId.VDC_INVOICE_LIST;
            masterPath = url.VDC_INVOICE;
            newBtnPath = url.VDC_INVOICE;
            page_Mode = mode.modeSTPList


        }
        setOtherState({ masterPath, makeBtnShow, newBtnPath })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(GetVender())
        goButtonHandler()
        dispatch(BreadcrumbReset())
    }, []);

    const { Actionhandler } = useCheckStockEntry(hederFilters.fromdate, commonPartyDropSelect);


    useEffect(() => {
        if (makeGRN.Status === true && makeGRN.StatusCode === 200) {
            history.push({
                pathname: makeGRN.path,
                page_Mode: makeGRN.page_Mode,
            })
        }
    }, [makeGRN])



    useEffect(() => {
        if (deleteMsg.Status === true && deleteMsg.StatusCode === 200) {
            goButtonHandler()
        }

    }, [deleteMsg])

    const venderOptions = vender.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    venderOptions.unshift({
        value: "",
        label: " All"
    });

    const makeBtnFunc = (list = []) => {

        const challanNo = list[0].FullChallanNumber
        const grnRef = [{
            Challan: list[0].id,
            Inward: false
        }];

        const jsonBody = JSON.stringify({
            OrderIDs: list[0].id.toString(),
            Mode: 2 // mode when challan to make GRN
        })

        Actionhandler({
            action: makeGRN_Mode_1Action, // The function you want to call
            params: {
                jsonBody,
                pageMode: mode.modeSTPsave,
                grnRef,
                path: url.IB_GRN,
                challanNo
            },
        })
    };

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Party: loginPartyID(),
            Customer: venderSelect === "" ? '' : venderSelect.value,
        });
        dispatch(challanList_ForListPage(jsonBody));
    }

    function downBtnFunc(config) {
        config["ReportType"] = report.invoice;
        dispatch(getpdfReportdata(IB_Invoice_Singel_Get_for_Report_Api, config))
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

    function venderOnchange(e) {
        let newObj = { ...hederFilters }
        newObj.venderSelect = e
        setHederFilters(newObj)
    }

    return (

        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.goBtnLoading || !pageField} />
            <div className="page-content">

                <div className="px-2  c_card_filter text-black " >
                    <div className="row">
                        <div className=" row">
                            <Col sm="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>FromDate</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            name='fromdate'
                                            value={fromdate}
                                            onChange={fromdateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "65px" }}>ToDate</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            nane='todate'
                                            value={todate}
                                            onChange={todateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>

                            <Col sm="5">
                                <FormGroup className="mb-2 row mt-3 " >
                                    <Label className="col-md-4 p-2"
                                        style={{ width: "115px" }}>Customer</Label>
                                    <Col md="5">
                                        <Select
                                            value={venderSelect}
                                            classNamePrefix="select2-Customer"
                                            options={venderOptions}
                                            onChange={venderOnchange}
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >

                            <Col sm="1" className="mt-3 ">
                                <Go_Button
                                    onClick={goButtonHandler}
                                />
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
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            // makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            downBtnFunc={downBtnFunc}
                            // goButnFunc={goButtonHandler}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"challan"}
                            makeBtnName={"Make GRN"}
                            deleteName={"FullChallanNumber"}
                            MasterModal={Challan}
                            forceNewBtnView={subPageMode === url.VDC_INVOICE_LIST ? true : false}
                        />
                        : null
                }

            </div>
        </React.Fragment>
    )
}

export default IBInvoiceList;