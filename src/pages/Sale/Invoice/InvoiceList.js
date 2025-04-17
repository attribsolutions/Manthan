import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess,
    makeGRN_Mode_1Action,
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label, Modal, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import * as report from '../../../Reports/ReportIndex'
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import { CheckStockEntryforBackDatedTransaction, Invoice_Singel_Get_for_Report_Api, OrderPage_Edit_ForDownload_API, Pos_Invoice_Singel_Get_for_Report_Api } from "../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";
import {
    Cancel_EInvoiceSuccess,
    Cancel_EwayBillSuccess,
    InvoiceSendToScm,
    InvoiceSendToScmSuccess,
    UpdateVehicleInvoice_Action,
    UpdateVehicleInvoice_Success,
    Uploaded_EInvoiceSuccess,
    Uploaded_EwayBillSuccess,
    deleteInvoiceId,
    deleteInvoiceIdSuccess,
    invoiceListGoBtnfilter,
    invoiceListGoBtnfilterSucccess,
    GoButtonForinvoiceAdd,
    editInvoiceAction,
    updateInvoiceActionSuccess,
    InvoiceBulkDelete_IDs_Action,
    InvoiceBulkDelete_IDs_Succcess
} from "../../../store/Sales/Invoice/action";
import { makeInward } from "../../../store/Inter Branch/InwardRedux/action";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { getVehicleList } from "../../../store/Administrator/VehicleRedux/action";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";
import { allLabelWithBlank } from "../../../components/Common/CommonErrorMsg/HarderCodeData";
import { sideBarPageFiltersInfoAction } from "../../../store/Utilites/PartyDrodown/action";
import { date_dmy_func } from "../../../components/Common/CommonFunction";
import { CheckStockEntryforBackDatedTransactionSuccess } from "../../../store/Inventory/StockEntryRedux/action";
import useCheckStockEntry from "../../../components/Common/commonComponent/CheckStockEntry";

const InvoiceList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode, setPageMode] = useState(url.ORDER_LIST_1)
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [hederFilters, setHederFilters] = useState({ todate: currentDate_ymd, fromdate: currentDate_ymd, supplierSelect: allLabelWithBlank });
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '', IBType: '' });
    const [VehicleNoDropdown, setVehicleNoDropdown] = useState({ value: "", label: "Select..." })
    const [modal, setmodal] = useState(false);
    const [vehicleErrorMsg, setvehicleErrorMsg] = useState(false);
    const [InvoiceID, setInvoiceID] = useState("");



    const reducers = useSelector(
        (state) => ({
            tableList: state.InvoiceReducer.Invoicelist,
            postMsg: state.OrderReducer.postMsg,
            editData: state.InvoiceReducer.editData,
            updateMsg: state.InvoiceReducer.updateMsg,
            deleteMsg: state.InvoiceReducer.deleteMsg,
            userAccess: state.Login.RoleAccessUpdateData,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            supplierDropLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            GRNitem: state.GRNReducer.GRNitem,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            goBtnloading: state.InvoiceReducer.goBtnloading,
            Uploaded_EInvoice: state.InvoiceReducer.Uploaded_EInvoice,
            Uploaded_EwayBill: state.InvoiceReducer.Uploaded_EwayBill,
            Cancel_EInvoice: state.InvoiceReducer.Cancel_EInvoice,
            Cancel_EwayBill: state.InvoiceReducer.Cancel_EwayBill,
            VehicleNumber: state.VehicleReducer.VehicleList,
            Update_Vehicle_Invoice: state.InvoiceReducer.Update_Vehicle_Invoice,
            makeGRN: state.GRNReducer.GRNitem,

            sendToScmMsg: state.InvoiceReducer.sendToScmMsg,
            invoiceBulkDeleteLoading: state.InvoiceReducer.invoiceBulkDeleteLoading,
            invoiceBulkDelete: state.InvoiceReducer.invoiceBulkDelete,
            listBtnLoading: (state.InvoiceReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading)
        })
    );

    const {
        pageField,
        supplier,
        Uploaded_EInvoice,
        Uploaded_EwayBill,
        Cancel_EInvoice,
        Cancel_EwayBill,
        supplierDropLoading,
        VehicleNumber,
        Update_Vehicle_Invoice,
        sendToScmMsg,
        invoiceBulkDelete,
        invoiceBulkDeleteLoading,
        makeGRN,

    } = reducers;

    const {
        fromdate,
        todate,
        supplierSelect
    } = hederFilters;

    const action = {
        deleteId: deleteInvoiceId,
        deleteSucc: deleteInvoiceIdSuccess,
        updateSucc: updateInvoiceActionSuccess
    }
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

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
            { label: "FromDate", content: date_dmy_func(fromdate), },
            { label: "ToDate", content: date_dmy_func(todate), },
            { label: "Customer", content: supplierSelect.label, }
        ]));

    }, [hederFilters]);

    const { Actionhandler } = useCheckStockEntry(hederFilters.fromdate, commonPartyDropSelect);

    // Featch Modules List data  First Rendering
    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let IBType = '';
        let newBtnPath = false;
        let makeBtnShow = false;

        if (subPageMode === url.INVOICE_LIST_1) {
            page_Id = pageId.INVOICE_LIST_1
            masterPath = url.INVOICE_1
            newBtnPath = url.INVOICE_1
        }
        else if (subPageMode === url.IB_INVOICE_LIST) {
            page_Id = pageId.IB_INVOICE_LIST;
            masterPath = url.IB_INVOICE
            newBtnPath = url.IB_INVOICE_STP
            IBType = "IBInvoice"
        } else if (subPageMode === url.IB_INWARD_STP) {
            page_Id = pageId.IB_INWARD_STP
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            IBType = "IBGRN"
        }
        setSubPageMode(subPageMode)
        setOtherState({ masterPath, makeBtnShow, newBtnPath, IBType })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        // dispatch(GetVenderSupplierCustomer({ subPageMode, PartyID: commonPartyDropSelect.value }))

        setmodal(false);
        if (!(commonPartyDropSelect.value === 0)) {
            goButtonHandler("event", IBType)
        }
        return () => {
            dispatch(UpdateVehicleInvoice_Success([]));
            dispatch(invoiceListGoBtnfilterSucccess([]));
        }

    }, [dispatch]);

    useEffect(() => {    // Vehicle Update against Invoice Id
        if (Update_Vehicle_Invoice.Status === true && Update_Vehicle_Invoice.StatusCode === 200) {
            dispatch(UpdateVehicleInvoice_Success([]));
            setInvoiceID('');
            setVehicleNoDropdown({ value: "", label: "Select..." });
            setvehicleErrorMsg(false);
            goButtonHandler("event");
            setmodal(false);
            customAlert({
                Type: 1,
                Message: JSON.stringify(Update_Vehicle_Invoice.Message),
            })
        }

        else if (Update_Vehicle_Invoice.Status === true) {
            dispatch(UpdateVehicleInvoice_Success([]))
            setmodal(false);
            customAlert({
                Type: 3,
                Message: JSON.stringify(Update_Vehicle_Invoice.Message),
            })
        }
    }, [Update_Vehicle_Invoice]);

    useEffect(() => {    // Vehicle Update against Invoice Id
        if (sendToScmMsg.Status === true && sendToScmMsg.StatusCode === 200) {
            dispatch(InvoiceSendToScmSuccess({ Status: false }));
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: JSON.stringify(sendToScmMsg.Message),
            })
        } else if (sendToScmMsg.Status === true && sendToScmMsg.StatusCode === 204) {
            dispatch(InvoiceSendToScmSuccess({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(sendToScmMsg.Message),
            })
        }
    }, [sendToScmMsg]);

    useEffect(() => {   // Uploaded EInvoice useEffect 
        if (Uploaded_EInvoice.Status === true && Uploaded_EInvoice.StatusCode === 200) {
            dispatch(Uploaded_EInvoiceSuccess({ Status: false }))
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: JSON.stringify(Uploaded_EInvoice.Message),
            })
        }

        else if (Uploaded_EInvoice.Status === true) {
            dispatch(Uploaded_EInvoiceSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(Uploaded_EInvoice.Message),
            })
        }
    }, [Uploaded_EInvoice]);

    useEffect(() => {   // Uploaded E-way Bill useEffect 

        if ((Uploaded_EwayBill.Status === true) && (Uploaded_EwayBill.StatusCode === 200)) {
            dispatch(Uploaded_EwayBillSuccess({ Status: false }))
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: JSON.stringify(Uploaded_EwayBill.Message),
            })
        }

        else if (Uploaded_EwayBill.Status === true) {
            dispatch(Uploaded_EwayBillSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(Uploaded_EwayBill.Message),
            })
            return
        }
    }, [Uploaded_EwayBill]);

    useEffect(async () => {   // Uploaded Cancel E-Invoice useEffect 

        if (Cancel_EInvoice.Status === true && Cancel_EInvoice.StatusCode === 200) {
            dispatch(Cancel_EInvoiceSuccess({ Status: false }))
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: Cancel_EInvoice.Message,
            })
            return
        }

        else if (Cancel_EInvoice.Status === true) {
            dispatch(Cancel_EInvoiceSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(Cancel_EInvoice.Message),
            })
            return
        }
    }, [Cancel_EInvoice]);

    useEffect(async () => {    // Uploaded Cancel E-way Bill useEffect 

        if (Cancel_EwayBill.Status === true && Cancel_EwayBill.StatusCode === 200) {
            dispatch(Cancel_EwayBillSuccess({ Status: false }))
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: Cancel_EwayBill.Message,
            })
            return
        }
        else if (Cancel_EwayBill.Status === true) {
            dispatch(Cancel_EwayBillSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(Cancel_EwayBill.Message),
            })
            return
        }
    }, [Cancel_EwayBill]);

    useEffect(() => {
        const Todate = _cfunc.ToDate({ FromDate: hederFilters.fromdate, Todate: hederFilters.todate })
        setHederFilters((i) => {
            const a = { ...i }
            a.todate = Todate;
            return a
        })

    }, [hederFilters.fromdate]);

    useEffect(async () => {    // Invoice bulk delete useEffect 

        if (invoiceBulkDelete.Status === true && invoiceBulkDelete.StatusCode === 200) {
            dispatch(InvoiceBulkDelete_IDs_Succcess({ Status: false }))
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: invoiceBulkDelete.Message,
            })
            return
        }
        else if (invoiceBulkDelete.Status === true) {
            dispatch(InvoiceBulkDelete_IDs_Succcess({ Status: false }))
            customAlert({
                Type: 3,
                Message: JSON.stringify(invoiceBulkDelete.Message),
            })
            return
        }
    }, [invoiceBulkDelete]);


    useEffect(() => {
        if (makeGRN.Status === true && makeGRN.StatusCode === 200) {
            history.push({
                pathname: makeGRN.path,
                page_Mode: makeGRN.page_Mode,
            })
        }
    }, [makeGRN])

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    supplierOptions.unshift({
        value: "",
        label: " All"
    });

    const VehicleNumber_Options = VehicleNumber.map((index) => ({
        value: index.id,
        label: index.VehicleNumber,
    }));

    function downBtnFunc(config) {

        config["ReportType"] = report.invoice;
        config["Invoice_Identifier_ID"] = config.rowData.Identify_id
        if (config.rowData.Identify_id === 1) {
            dispatch(getpdfReportdata(Invoice_Singel_Get_for_Report_Api, config))
        } else {
            dispatch(getpdfReportdata(Pos_Invoice_Singel_Get_for_Report_Api, config))
        }

    }

    function goButtonHandler(event, IBType) {

        try {
            if (commonPartyDropSelect.value === 0) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            const filtersBody = JSON.stringify({
                FromDate: fromdate,
                ToDate: todate,
                Customer: supplierSelect.value === "" ? '' : supplierSelect.value,
                Party: commonPartyDropSelect.value,
                IBType: IBType ? IBType : otherState.IBType,
                DashBoardMode: 0

            });

            dispatch(invoiceListGoBtnfilter({ subPageMode, filtersBody }));

        } catch (error) { _cfunc.CommonConsole(error) }
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

    function supplierOnchange(e) {
        let newObj = { ...hederFilters }
        newObj.supplierSelect = e
        setHederFilters(newObj);
    }

    const partySelectButtonHandler = (e) => {
        goButtonHandler()
        dispatch(GetVenderSupplierCustomer({ subPageMode, PartyID: commonPartyDropSelect.value }));
    }

    function partySelectOnChangeHandler() {
        dispatch(invoiceListGoBtnfilterSucccess([]));
        dispatch(GetVenderSupplierCustomerSuccess([]));
        let newObj = { ...hederFilters }
        newObj.supplierSelect = allLabelWithBlank
        setHederFilters(newObj)
    }

    function VehicleOnChangeHandler(e) {
        setVehicleNoDropdown(e)
        setvehicleErrorMsg(false);
    }

    function toggleModal() {
        setmodal(!modal);
        setVehicleNoDropdown({ value: "", label: "Select..." })
        setvehicleErrorMsg(false);
    };

    const makeBtnFunc = (list = {}, btnId) => {


        const grnRef = [{
            Challan: list[0].id,
            Inward: false,
            GRN_From: subPageMode,
            OrderDate: list[0]?.InvoiceDate,
            Invoice_NO: list[0].FullInvoiceNumber
        }];

        const jsonBody = JSON.stringify({
            OrderIDs: list[0].id.toString(),
            Mode: 4
        })

        Actionhandler({
            action: makeGRN_Mode_1Action, // The function you want to call
            params: {
                jsonBody,
                pageMode: mode.modeSTPsave,
                grnRef,
                path: url.IB_GRN,
            },
        })
    };
    //Added For send To Scm Button 
    function sendToScmBtnFunc(config) {
        const InvoiceID = config.rowData.id
        let jsonBody = {}
        if (_cfunc.IsSweetAndSnacksCompany()) {
            jsonBody = JSON.stringify({ InvoiceID: InvoiceID })
        } else {
            jsonBody = JSON.stringify({ Invoice: InvoiceID })
        }
        const btnId = config.btnId
        dispatch(InvoiceSendToScm({ jsonBody, btnId }))
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
                                    options={{
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

                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>ToDate</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    options={{
                                        minDate: (_cfunc.disablePriviousTodate({ fromDate: fromdate })),
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
                                    name="todate"
                                    value={_cfunc.ToDate({ FromDate: fromdate, Todate: todate })}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>Customer</Label>
                            <Col sm="8">
                                <C_Select
                                    classNamePrefix="react-select"
                                    value={supplierSelect}
                                    options={supplierOptions}
                                    onChange={supplierOnchange}
                                    isLoading={supplierDropLoading}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button onClick={goButtonHandler}
                            loading={reducers.goBtnloading} />
                    </Col>
                </div>
            </div>
        )
    }

    // function e_WayBill_ActionsBtnFunc(rowData) {

    //     const { VehicleNo = '', id } = rowData
    //     if (VehicleNo === null) {
    //         setmodal(true);
    //         dispatch(getVehicleList())
    //         setInvoiceID(id)
    //     }
    // }


    function UpdateDetailsBtnFunc(config) {
        const { id, VehicleNo, VehicleID } = config.rowData
        setmodal(true);
        dispatch(getVehicleList())
        setInvoiceID(id)
        if ((VehicleID === null) || VehicleNo === null) {
            setVehicleNoDropdown({ value: "", label: "Select..." });
        } else {
            setVehicleNoDropdown({ value: VehicleID, label: VehicleNo })
        }
    }

    const updateVehicleInvoice = () => {

        if (VehicleNoDropdown.value === "") {
            setvehicleErrorMsg(true);
        } else {
            const invoiceAndVehicleID = {
                Invoiceid: InvoiceID,
                vehicleid: VehicleNoDropdown.value,
            };
            dispatch(UpdateVehicleInvoice_Action(invoiceAndVehicleID));
        }
    };

    async function editBodyfunc(config) {

        const { rowData } = config;
        const jsonBodyForBackdatedTransaction = JSON.stringify({
            "TransactionDate": rowData.InvoiceDate,
            "PartyID": commonPartyDropSelect.value,
        });

        if (commonPartyDropSelect.value > 0) {
            const response = await CheckStockEntryforBackDatedTransaction({ jsonBody: jsonBodyForBackdatedTransaction })
            if (response.Status === true && response.StatusCode === 400) {
                dispatch(CheckStockEntryforBackDatedTransactionSuccess({ status: false }))
                customAlert({ Type: 3, Message: response.Message });
                return
            }
        }
        const customer = {
            value: rowData.CustomerID,
            label: rowData.Customer,
            GSTIN: rowData.CustomerGSTIN,
            IsTCSParty: rowData.IsTCSParty,
            ISCustomerPAN: rowData.CustomerPAN
        }

        dispatch(editInvoiceAction({
            ...config,
            customer,
            subPageMode: url.INVOICE_1,
            path: url.INVOICE_1,
        }));



    }

    const selectDeleteBtnHandler = (row = []) => {

        let isAllcheck = row.filter(i => (i.hasAllSelect))
        let isRowcheck = row.filter(i => (i.selectCheck))
        let ischeck = [];
        if (isAllcheck.length > 0 && isRowcheck.length > 0 && isAllcheck.length === isRowcheck.length) {
            ischeck = row.filter(i => !(i.forceSelectDissabled))
        } else {
            ischeck = row.filter(i => (!i.forceSelectDissabled && i.selectCheck))
        }
        if (!ischeck.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneCheckbox,
            });
            return
        }
        let idString = ischeck.map(obj => obj.id).join(',')
        let jsonBody = JSON.stringify({ Invoice_ID: idString })
        dispatch(InvoiceBulkDelete_IDs_Action({ jsonBody }))
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.listBtnLoading || !pageField || supplierDropLoading} />
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
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            editBodyfunc={editBodyfunc}
                            HeaderContent={HeaderContent}
                            makeBtnFunc={makeBtnFunc}
                            sendToScmBtnFunc={sendToScmBtnFunc}
                            ButtonMsgLable={subPageMode === url.IB_INVOICE_FOR_GRN ? "GRN" : "Invoice"}
                            deleteName={"FullInvoiceNumber"}
                            makeBtnName={"Make"}
                            filters={hederFilters}
                            forceNewBtnView={false}
                            UpdateDetailsBtnFunc={UpdateDetailsBtnFunc}
                            totalAmountShow={true}
                            selectCheckParams={{
                                // isShow: (subPageMode === url.INVOICE_LIST_1),
                                selectSaveBtnHandler: selectDeleteBtnHandler,
                                selectSaveBtnLabel: "Delete",
                                selectHeaderLabel: "Select",
                                selectSaveBtnLoading: invoiceBulkDeleteLoading,
                                pageloading: reducers.listBtnLoading || supplierDropLoading    ////   non selectable  till page loading
                            }}

                        />
                        : null
                }

                <Modal
                    isOpen={modal}
                    toggle={toggleModal}
                    centered={true}
                >
                    <div className="modal-header" style={{ position: "relative" }}>
                        <h4 className="modal-title mt-0 align-middle">Please Select Vehicle Number</h4>
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Row >
                            <Col sm="12" className="">
                                <FormGroup className="mb- row mt-1 " >
                                    <Label className="col-sm-6 p-2 text-black font-size-18"
                                        style={{ width: "105px" }}>Vehicle No</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="VehicleNo"
                                            value={VehicleNoDropdown}

                                            isSearchable={true}
                                            id={'VehicleNoselect'}
                                            className="card-header align-items-center d-flex"
                                            classNamePrefix="dropdown"
                                            options={VehicleNumber_Options}
                                            onChange={(e) => { VehicleOnChangeHandler(e) }}
                                            styles={{
                                                menu: (provided) => ({
                                                    ...provided,
                                                    zIndex: 5,
                                                    maxHeight: "300px", // Set a fixed height for the dropdown
                                                    overflowY: "auto", // Add a scrollbar if the content exceeds the height
                                                }),
                                            }}
                                        />
                                        {(vehicleErrorMsg) && (
                                            <span className="text-danger f-8"><small>Please Select Vehicle Number</small></span>
                                        )}

                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>

                        <div className="modal-footer justify-content-start modal-footer p-4">
                            <button
                                type="button"
                                className="btn btn-secondary pr-3 pl-3"
                                onClick={toggleModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary pr-3 pl-3"
                                onClick={updateVehicleInvoice}>
                                Update
                            </button>
                        </div>


                    </div>
                </Modal>
            </div>
        </React.Fragment>
    )
}

export default InvoiceList;