import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";

import { date_ymd_func, loginSelectedPartyID } from "../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../routes/index"
import * as _act from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import { C_DatePicker } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { allLabelWithBlank } from "../../../components/Common/CommonErrorMsg/HarderCodeData";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { sideBarPageFiltersInfoAction } from "../../../store/Utilites/PartyDrodown/action";
import GRN_ADD_1 from "./GRN_ADD_1";
import GRNAdd3 from "./GRN_ADD_3";
import { Invoice_Singel_Get_for_Report_Api, Pos_Invoice_Singel_Get_for_Report_Api } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";


const GRNList = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();

    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false, makeBtnShow: '', makeBtnName: '', IBType: '', orderType: ''
    });
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd })
    const [supplierSelect, setSupplierSelect] = useState(allLabelWithBlank);
    const { fromdate, todate, } = hederFilters;

    const reducers = useSelector(
        (state) => ({
            loading: state.GRNReducer.loading,
            listBtnLoading: state.GRNReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading,
            customer: state.CommonAPI_Reducer.vendorSupplierCustomer,
            tableList: state.GRNReducer.GRNList,
            deleteMsg: state.GRNReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            AccontingGRNData: state.GRNReducer.AccontingGRNData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            makeChallan: state.ChallanReducer.makeChallan,

        })
    );
    const { pageField, customer, makeChallan, AccontingGRNData, listBtnLoading } = reducers;
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);
    console.log(listBtnLoading)
    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

    // sideBar Page Filters Information
    useEffect(() => {

        dispatch(sideBarPageFiltersInfoAction([
            { label: "FromDate", content: _cfunc.date_dmy_func(fromdate), },
            { label: "ToDate", content: _cfunc.date_dmy_func(todate), },
            { label: "Supplier Name", content: supplierSelect.label, }
        ]));


    }, [supplierSelect, fromdate, todate]);




    const action = {
        editId: _act.editGRNAction,
        deleteId: _act.deleteGRNId,
        postSucc: _act.saveGRNSuccess,
        updateSucc: _act.updateGRNIdSuccess,
        deleteSucc: _act.deleteGRNIdSuccess
    }

    useLayoutEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false;
        let newBtnPath = '';
        let MasterModal = '';
        let makeBtnName = '';

        if (subPageMode === url.IB_GRN_LIST) {
            page_Id = pageId.IB_GRN_LIST;
            masterPath = url.IB_GRN;
            newBtnPath = url.IB_INVOICE_FOR_GRN;
            page_Mode = mode.modeSTPList
            // makeBtnShow = false;
            makeBtnName = "Make IB Invoice"
            MasterModal = GRN_ADD_1
        }
        else if (subPageMode === url.GRN_LIST_3 && !_cfunc.IsSweetAndSnacksCompany()) {
            page_Id = pageId.GRN_LIST_3;
            masterPath = url.GRN_ADD_3;
            newBtnPath = url.GRN_STP_3;
            page_Mode = mode.modeSTPList
            // makeBtnShow = true;
            makeBtnName = "GRN"
            MasterModal = GRNAdd3

        } else if (subPageMode === url.GRN_LIST_3 && _cfunc.IsSweetAndSnacksCompany()) {
            page_Id = pageId.GRN_LIST_3;
            masterPath = url.GRN_ADD_1;
            newBtnPath = url.GRN_STP_3;
            page_Mode = mode.modeSTPList
            // makeBtnShow = true;
            makeBtnName = "Make Accounting GRN"
            MasterModal = GRN_ADD_1

        }
        else if (subPageMode === url.ACCOUNTING_GRN_LIST) {
            page_Id = pageId.ACCOUNTING_GRN_LIST;
            page_Mode = mode.modeSTPsave
            newBtnPath = url.GRN_FOR_ACCOUNTING_GRN;
        }

        else if (subPageMode === url.GRN_FOR_ACCOUNTING_GRN) {
            page_Id = pageId.GRN_FOR_ACCOUNTING_GRN;
            page_Mode = mode.modeSTPList
            makeBtnName = "Make Accounting GRN"

        }





        setSubPageMode(subPageMode)
        setOtherState({ masterPath, makeBtnShow, newBtnPath, MasterModal, makeBtnName })
        setPageMode(page_Mode)
        dispatch(_act.commonPageFieldListSuccess(null))
        dispatch(_act.commonPageFieldList(page_Id))

        // if (!(loginSelectedPartyID() === 0)) {
        //     dispatch(_act.GetVenderSupplierCustomer({ PartyID: loginSelectedPartyID(), subPageMode, RouteID: "" }))
        //     goButtonHandler()
        // }
        
        return () => {
            dispatch(_act.AccountingGRNSuccess({ Status: false }))
        }

    }, []);



    useEffect(() => {
        if (makeChallan.Status === true && makeChallan.StatusCode === 200) {
            dispatch(_act.makeChallanActionSuccess({ Status: false }))
            history.push({
                pathname: makeChallan.path,
                page_Mode: makeChallan.page_Mode,
            })
        }
    }, [makeChallan]);



    useEffect(() => {

        if (AccontingGRNData.Status === true && AccontingGRNData.StatusCode === 200 && AccontingGRNData?.pageMode === mode.modeSTPsave) {
            AccontingGRNData.Data["isAccountingGRN"] = true

            if (AccontingGRNData?.Data?.GRNReferences[0]?.Order === null) {
                dispatch(_act.AccountingGRNSuccess({ Status: false }))
                customAlert({ Type: 3, Message: "Order Detail Getting Null" });

                return;
            }

            history.push({
                pathname: AccontingGRNData.path,
                state: AccontingGRNData.Data,
            })
            dispatch(_act.AccountingGRNSuccess({ Status: false }))
        }
    }, [AccontingGRNData]);



    const venderOptions = customer.map((i) => ({
        value: i.id,
        label: i.Name,
    }));
    venderOptions.unshift(allLabelWithBlank);

    const makeBtnFunc = (list = []) => {

        const id = list[0].id

        if (subPageMode === url.GRN_LIST_3 || subPageMode === url.GRN_FOR_ACCOUNTING_GRN) {
            dispatch(_act.AccountingGRN({ btnId: `btn-${mode.makeBtn}-${id}`, editId: id, btnmode: mode.modeSTPsave, path: url.ACCOUNTING_GRN }))
        } else {
            const makeBody = JSON.stringify({
                GRN: id,
            });
            dispatch(_act.makeChallanAction({ makeBody, pageMode: mode.modeSTPsave, path: url.CHALLAN_LIST }))
        }
    };

    function goButtonHandler() {
        try {
            if (loginSelectedPartyID() === 0) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            const filtersBody = JSON.stringify({
                FromDate: fromdate,
                ToDate: todate,
                Supplier: supplierSelect.value,
                Party: loginSelectedPartyID(),
                DashBoardMode: 0

            });
            dispatch(_act.getGRNListPage({ filtersBody, subPageMode }));
        } catch (error) { }
    }

    function downBtnFunc(config) {

        config["ReportType"] = report.invoice;
        config["editId"] = config.rowData.InvoiceID
        dispatch(_act.getpdfReportdata(Invoice_Singel_Get_for_Report_Api, config))
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
        setSupplierSelect(e)
    }


    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >
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

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"

                                style={{ width: "115px" }}>Supplier Name</Label>
                            <Col sm="5">
                                <Select
                                    value={supplierSelect}
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
                            loading={reducers.loading}
                            onClick={goButtonHandler}
                        />
                    </Col>
                </div>
            </div >
        )
    }


    const partySelectButtonHandler = () => {
        goButtonHandler();
        setSupplierSelect(allLabelWithBlank);
        dispatch(_act.GetVenderSupplierCustomer({ PartyID: loginSelectedPartyID(), subPageMode, RouteID: "" }))
    }

    function partySelectOnChangeHandler() {
        dispatch(_act.getGRNListPageSuccess([]));
        setSupplierSelect(allLabelWithBlank);
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.loading || !pageField} />
            <div className="page-content">
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
                            downBtnFunc={downBtnFunc}
                            goButnFunc={goButtonHandler}
                            HeaderContent={HeaderContent}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={""}
                            deleteName={"FullGRNNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={otherState.MasterModal}
                            totalAmountShow={true}
                            forceNewBtnView={true}
                        />
                        : null
                }

            </div>
        </React.Fragment>
    )
}

export default GRNList;