import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess,
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
import { Invoice_1_Edit_API_Singel_Get } from "../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import * as _cfunc from "../../../components/Common/CommonFunction";
import {
    Cancel_EInvoiceSuccess,
    Cancel_EwayBillSuccess,
    UpdateVehicleInvoice_Action,
    UpdateVehicleInvoice_Success,
    Uploaded_EInvoiceSuccess,
    Uploaded_EwayBillSuccess,
    deleteInvoiceId,
    deleteInvoiceIdSuccess,
    invoiceListGoBtnfilter,
    invoiceListGoBtnfilterSucccess
} from "../../../store/Sales/Invoice/action";
import { makeInward } from "../../../store/Inter Branch/InwardRedux/action";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { getVehicleList } from "../../../store/Administrator/VehicleRedux/action";

const InvoiceList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [pageMode, setPageMode] = useState(url.ORDER_LIST_1)
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [hederFilters, setHederFilters] = useState({ todate: currentDate_ymd, fromdate: currentDate_ymd, supplierSelect: { value: '', label: "All" } });
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '', IBType: '' });
    const [VehicleNoDropdown, setVehicleNoDropdown] = useState('')
    const [modal, setmodal] = useState(false);
    const [vehicleErrorMsg, setvehicleErrorMsg] = useState(false);
    const [InvoiceID, setInvoiceID] = useState("");

    const reducers = useSelector(
        (state) => ({
            tableList: state.InvoiceReducer.Invoicelist,
            postMsg: state.OrderReducer.postMsg,
            editData: state.InvoiceReducer.editData,
            updateMsg: state.OrderReducer.updateMsg,
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
        Update_Vehicle_Invoice
    } = reducers;

    const {
        fromdate,
        todate,
        supplierSelect
    } = hederFilters;

    const action = {
        deleteId: deleteInvoiceId,
        deleteSucc: deleteInvoiceIdSuccess
    }

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
        }
        else if (subPageMode === url.IB_GRN_LIST) {
            page_Id = pageId.IB_GRN_LIST;
            masterPath = url.IB_INVOICE
            IBType = "IBGRN"
        }
        else if (subPageMode === url.IB_INWARD_STP) {
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
        // dispatch(BreadcrumbShowCountlabel(`${"Count"} :0`))
        dispatch(GetVenderSupplierCustomer({ subPageMode, PartyID: _cfunc.loginSelectedPartyID() }))

        setmodal(false);
        if (!(_cfunc.loginSelectedPartyID() === 0)) {
            goButtonHandler("event", IBType)
        }
        return () => {
            dispatch(UpdateVehicleInvoice_Success([]));
        }

    }, [dispatch]);

    useEffect(() => {    // Vehicle Update against Invoice Id
        if (Update_Vehicle_Invoice.Status === true && Update_Vehicle_Invoice.StatusCode === 200) {
            dispatch(UpdateVehicleInvoice_Success([]));
            setInvoiceID('');
            setVehicleNoDropdown('');
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
        dispatch(getpdfReportdata(Invoice_1_Edit_API_Singel_Get, config))
    }

    function goButtonHandler(event, IBType) {

        try {
            if (_cfunc.loginSelectedPartyID() === 0) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            const filtersBody = JSON.stringify({
                FromDate: fromdate,
                ToDate: todate,
                Customer: supplierSelect.value === "" ? '' : supplierSelect.value,
                Party: _cfunc.loginSelectedPartyID(),
                IBType: IBType ? IBType : otherState.IBType
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
        dispatch(GetVenderSupplierCustomer({ subPageMode, PartyID: _cfunc.loginSelectedPartyID() }));
    }

    function partySelectOnChangeHandler() {
        dispatch(invoiceListGoBtnfilterSucccess([]));
        dispatch(GetVenderSupplierCustomerSuccess([]));
        let newObj = { ...hederFilters }
        newObj.supplierSelect = { value: '', label: "All" }
        setHederFilters(newObj)
    }

    function VehicleOnChangeHandler(e) {
        setVehicleNoDropdown(e)
        setvehicleErrorMsg(false);
    }

    function toggleModal() {
        setmodal(!modal);
        setVehicleNoDropdown('')
        setvehicleErrorMsg(false);
    };

    const makeBtnFunc = (list = {}, btnId) => {
        const config = { makeInwardId: list[0].id, btnId }
        dispatch(makeInward(config))
        history.push({
            pathname: url.INWARD,
        })
    };

    const HeaderContent = () => {
        return (
            <div className="px-2   c_card_filter text-black" >
                <div className="row" >

                    <Col sm="3" className="">
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
                    <Col sm="3" className="">
                        <FormGroup className="mb- row mt-3 " >
                            <Label className="col-sm-5 p-2"
                                style={{ width: "65px" }}>To Date</Label>
                            <Col sm="7">
                                <C_DatePicker
                                    name="todate"
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
                            <Col sm="5">
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

    function e_WayBill_ActionsBtnFunc(rowData) {

        const { VehicleNo = '', id } = rowData
        if (VehicleNo === null) {
            setmodal(true);
            dispatch(getVehicleList())
            setInvoiceID(id)
        }
    }

    const updateVehicleInvoice = () => {

        if (VehicleNoDropdown === "") {
            setvehicleErrorMsg(true);
        } else {
            const invoiceAndVehicleID = {
                Invoiceid: InvoiceID,
                vehicleid: VehicleNoDropdown.value,
            };
            dispatch(UpdateVehicleInvoice_Action(invoiceAndVehicleID));
        }
    };

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.listBtnLoading || !pageField} />
            <div className="page-content">
                <PartyDropdown_Common
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partySelectOnChangeHandler} />
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
                            HeaderContent={HeaderContent}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"Invoice"}
                            deleteName={"FullInvoiceNumber"}
                            makeBtnName={"Make GRN"}
                            filters={hederFilters}
                            forceNewBtnView={false}
                            e_WayBill_ActionsBtnFunc={e_WayBill_ActionsBtnFunc}
                        />
                        : null
                }

                <Modal
                    isOpen={modal}
                    toggle={toggleModal}
                    centered={true}
                >
                    <div className="modal-header" style={{ position: "relative" }}>
                        <h5 className="modal-title mt-0 align-middle">Please Select Vehicle Number</h5>
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
                            <Col sm="8" className="">
                                <FormGroup className="mb- row mt-1 " >
                                    <Label className="col-sm-6 p-2 text-black"
                                        style={{ width: "65px" }}>VehicleNo</Label>
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
                                                    maxHeight: "80px", // Set a fixed height for the dropdown
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
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={toggleModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
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