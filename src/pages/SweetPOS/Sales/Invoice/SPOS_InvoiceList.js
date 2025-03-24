import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess,
    Get_Items_Drop_Down,
    getUserDetailsAction,
    loginSuccessAction,
    loginUser,
    makeGRN_Mode_1Action,
    postOrderConfirms_API_Success,
} from "../../../../store/actions";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Input, Label, Modal, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess } from "../../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button, PageLoadingSpinner } from "../../../../components/Common/CommonButton";
import * as report from '../../../../Reports/ReportIndex'
import * as url from "../../../../routes/route_url";
import * as pageId from "../../../../routes/allPageID"
import * as mode from "../../../../routes/PageMode"
import { CashierName_Api, CheckStockEntryforBackDatedTransaction, Invoice_Singel_Get_for_Report_Api, OrderPage_Edit_ForDownload_API, Pos_Invoice_Singel_Get_for_Report_Api } from "../../../../helpers/backend_helper";
import { getpdfReportdata } from "../../../../store/Utilites/PdfReport/actions";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import {
    Cancel_EInvoiceSuccess,
    Cancel_EwayBillSuccess,
    InvoiceSendToScm,
    InvoiceSendToScmSuccess,
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
    InvoiceBulkDelete_IDs_Succcess,
    Pos_UpdateVehicleCustomerInvoice_Action,
    Pos_UpdateVehicleCustomerInvoice_Action_Success,
    InvoiceFilterSelect_Action_Success,

} from "../../../../store/Sales/Invoice/action";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { getVehicleList } from "../../../../store/Administrator/VehicleRedux/action";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";
import { allLabelWithBlank } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";
import { sideBarPageFiltersInfoAction } from "../../../../store/Utilites/PartyDrodown/action";
import { date_dmy_func } from "../../../../components/Common/CommonFunction";
import { postWithBasicAuth } from "../../../Sale/Franchies_Invoice/FranchiesInvoiceFunc";
import { FRANCHAISE_INVOICE_DELETE_API } from "../../../../helpers/url_helper";
import { C_FilterSelect } from "./CustomFilter";

// import { C_FilterSelect } from "./CustomFilter";



const State = {
    paymentMode: {
        Cash: false,
        Card: false,
        UPI: false,
    },
    invoiceAmount: {
        Less_Than: false,
        Greater_Than: false,
        Invoice_Amount: "",
        Between_InvoiceAmount: false,
        Between_InvoiceAmount_1: "",
        Between_InvoiceAmount_2: "",
    },
    InvoiceNumber: {
        Less_Than: false,
        Greater_Than: false,
        Invoice_Number: "",
        Between_InvoiceNumber: false,
        Between_InvoiceNumber_1: "",
        Between_InvoiceNumber_2: "",
    },
    Customers: { SelectedCustomer: [] },
    cashier: { SelectedCashier: [] },
    Item: { SelectedItem: [] },
    EInvoice: {
        EInvoiceCreated: false,
        EInvoiceNotCreated: false,
    },
    EWayBill: {
        EWayBillCreated: false,
        EWayBillNotCreated: false,
    },

}

const initial_state = {
    updatedState: State,
    jsonFilter: State,
};

const SweetPosInvoiceList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const filterStateRef = useRef(initial_state);
    const SelectStateRef = useRef([]);

    const InvoiceAdvanceFilter = (_cfunc.loginSystemSetting().InvoiceAdvanceFilter === "ON");

    const now = new Date();
    const date = now.toISOString().slice(0, 10); // e.g., 2024-11-29
    const time = now.toTimeString().slice(0, 8); // e.g., 13:32:54

    const currentDate_ymd = _cfunc.date_ymd_func();

    const initialSubPageMode = useMemo(() => {
        if (_cfunc.IsAuthorisedURL({ subPageMode: history.location.pathname, URL: url.POS_INVOICE_LIST })) {
            return url.POS_INVOICE_LIST;
        }
        return history.location.pathname;
    }, []);

    const [pageMode, setPageMode] = useState(url.ORDER_LIST_1)
    const [subPageMode, setSubPageMode] = useState(initialSubPageMode);
    const [hederFilters, setHederFilters] = useState({ todate: currentDate_ymd, fromdate: currentDate_ymd, supplierSelect: allLabelWithBlank });
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '', IBType: '' });
    const [Vehicle_No, setVehicle_No] = useState({ value: null, label: "Select..." })
    const [Customer, setCustomer] = useState('')

    const [CashierOption, setCashierOption] = useState([])




    const [modal, setmodal] = useState(false);
    const [vehicleErrorMsg, setvehicleErrorMsg] = useState(false);
    const [InvoiceID, setInvoiceID] = useState("");
    const [deleteBtnloading, setDeleteBtnloading] = useState(false);

    const [franchiesDeleteApiRep, setFranchiesDeleteApiRep] = useState({});

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
            FilterSelectData: state.InvoiceReducer.FilterSelectData,
            VehicleNumber: state.VehicleReducer.VehicleList,
            Update_Vehicle_Customer_Invoice: state.InvoiceReducer.Update_Vehicle_Customer_Invoice,
            makeGRN: state.GRNReducer.GRNitem,
            sendToScmMsg: state.InvoiceReducer.sendToScmMsg,
            invoiceBulkDeleteLoading: state.InvoiceReducer.invoiceBulkDeleteLoading,
            invoiceBulkDelete: state.InvoiceReducer.invoiceBulkDelete,
            listBtnLoading: (state.InvoiceReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading || deleteBtnloading),
            ItemDropDown: state.StockEntryReducer.ItemDropDown,
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
        Update_Vehicle_Customer_Invoice,
        sendToScmMsg,
        invoiceBulkDelete,
        invoiceBulkDeleteLoading,
        makeGRN,
        listBtnLoading,
        FilterSelectData,
        ItemDropDown
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


    // const handleChildStateChange = (state) => {
    //     
    //     setChildState(state);
    // };




    useEffect(() => {

        dispatch(sideBarPageFiltersInfoAction([
            { label: "FromDate", content: date_dmy_func(fromdate), },
            { label: "ToDate", content: date_dmy_func(todate), },
            { label: "Customer", content: supplierSelect.label, }
        ]));

    }, [hederFilters]);

    // Featch Modules List data  First Rendering
    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let IBType = '';
        let newBtnPath = false;
        let makeBtnShow = false;

        if ((subPageMode === url.POS_INVOICE_LIST)) {
            page_Id = pageId.POS_INVOICE_LIST
            masterPath = url.FRANCHAISE_INVOICE
            newBtnPath = url.FRANCHAISE_INVOICE
        }

        setSubPageMode(subPageMode)
        setOtherState({ masterPath, makeBtnShow, newBtnPath, IBType })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))

        setmodal(false);


        if ((localStorage.getItem("token"))) {
            dispatch(commonPageFieldList(page_Id))
            if (!(commonPartyDropSelect.value === 0)) {
                goButtonHandler("event", IBType)
            }
        }

        return () => {
            dispatch(UpdateVehicleInvoice_Success([]));
            dispatch(invoiceListGoBtnfilterSucccess([]));
            dispatch(Pos_UpdateVehicleCustomerInvoice_Action_Success([]));


        }

    }, [dispatch]);

    useEffect(async () => {
        dispatch(Get_Items_Drop_Down({
            jsonBody: JSON.stringify({
                UserID: _cfunc.loginUserID(),
                RoleID: _cfunc.loginRoleID(),
                CompanyID: _cfunc.loginCompanyID(),
                IsSCMCompany: _cfunc.loginIsSCMCompany(),
                CompanyGroup: _cfunc.loginCompanyGroup(),
                PartyID: _cfunc.loginSelectedPartyID(),
            })
        }));
        dispatch(postOrderConfirms_API_Success({ Status: false }))

        const Resp = await CashierName_Api({
            jsonBody: JSON.stringify({
                Party: _cfunc.loginPartyID(),
            })
        })
        setCashierOption(Resp?.Data)

    }, [])


    useEffect(() => {    // Vehicle Update against Invoice Id
        if (Update_Vehicle_Customer_Invoice.Status === true && Update_Vehicle_Customer_Invoice.StatusCode === 200) {
            dispatch(UpdateVehicleInvoice_Success([]));
            setInvoiceID('');
            setVehicle_No({ value: "", label: "Select..." });
            setCustomer("")
            setvehicleErrorMsg(false);
            goButtonHandler("event");
            setmodal(false);
            customAlert({
                Type: 1,
                Message: JSON.stringify(Update_Vehicle_Customer_Invoice.Message),
            })
        }

        else if (Update_Vehicle_Customer_Invoice.Status === true) {
            dispatch(UpdateVehicleInvoice_Success([]))
            setmodal(false);
            customAlert({
                Type: 3,
                Message: JSON.stringify(Update_Vehicle_Customer_Invoice.Message),
            })
        }
    }, [Update_Vehicle_Customer_Invoice]);

    useEffect(() => {    // Vehicle Update against Invoice Id
        if (sendToScmMsg.Status === true && sendToScmMsg.StatusCode === 200) {
            dispatch(InvoiceSendToScmSuccess({ Status: false }));
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

    const handleFilterChange = useCallback((filterData) => {
        filterStateRef.current.updatedState = filterData.updatedState;
        filterStateRef.current.jsonFilter = filterData.jsonFilter;

    }, []);




    const SelecthandleChange = useCallback((SelectState) => {
        SelectStateRef.current = SelectState;
    }, []);

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
        const Todate = _cfunc.ToDate({ FromDate: hederFilters.fromdate, Todate: hederFilters.todate })
        setHederFilters((i) => {
            const a = { ...i }
            a.todate = Todate;
            return a
        })

    }, [hederFilters.fromdate]);

    useEffect(() => {
        if (makeGRN.Status === true && makeGRN.StatusCode === 200) {
            history.push({
                pathname: makeGRN.path,
                page_Mode: makeGRN.page_Mode,
            })
        }
    }, [makeGRN])

    const supplierOptions = useMemo(() => {
        // Create the options array with the 'All' option at index 0
        return [
            { value: "", label: "All" },  // First option
            ...supplier.map((i) => ({     // Spread the mapped supplier options
                value: i.id,
                label: i.Name,
            })),
        ];
    }, [supplier]);

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

    function minPrintBtn_Func(config) {
        config["ReportType"] = report.PosInvoice;
        dispatch(getpdfReportdata(Pos_Invoice_Singel_Get_for_Report_Api, config))
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
                DashBoardMode: 0,
                ...(InvoiceAdvanceFilter ? filterStateRef.current.jsonFilter : {}),
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
        setVehicle_No(e)
        setvehicleErrorMsg(false);
    }


    function CustomerOnChangeHandler(e) {
        setCustomer(e)
        setvehicleErrorMsg(false);
    }


    function toggleModal() {
        setmodal(!modal);
        setVehicle_No({ value: "", label: "Select..." })
        setCustomer("")

        setvehicleErrorMsg(false);
    };

    const makeBtnFunc = (list = {}) => {


        const grnRef = [{
            Challan: list[0].id,
            Inward: false,
            GRN_From: subPageMode,
            OrderDate: list[0]?.InvoiceDate,
            Invoice_NO: list[0].FullInvoiceNumber
        }];

        const jsonBody = JSON.stringify({
            OrderIDs: list[0].id.toString(),
            Mode: 2
        })
        dispatch(makeGRN_Mode_1Action({
            jsonBody,
            pageMode: mode.modeSTPsave,
            grnRef,
            path: url.GRN_ADD_1,
        }))

    };



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
                        {InvoiceAdvanceFilter ? <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>Advance Filter</Label>
                            <Col sm="7">
                                <C_FilterSelect
                                    CustomerOption={supplierOptions}
                                    ItemOption={ItemDropDown}
                                    CashierOption={CashierOption}
                                    onFilterChange={handleFilterChange}
                                    jsonFilter={filterStateRef.current.jsonFilter}
                                    SelecthandleChange={SelecthandleChange}
                                    SelectState={SelectStateRef.current}
                                    State={filterStateRef.current.updatedState}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup> :

                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-md-4 p-2"
                                    style={{ width: "115px" }}>Customer</Label>
                                <Col sm="7">
                                    <C_Select
                                        value={supplierSelect}
                                        options={supplierOptions}
                                        isLoading={supplierDropLoading}
                                        onChange={supplierOnchange}
                                        // onFilterChange={handleFilterChange}
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                    />
                                </Col>
                            </FormGroup>

                        }
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button onClick={goButtonHandler}
                            loading={reducers.goBtnloading} />
                    </Col>
                </div>
            </div>
        )
    }


    function UpdateDetailsBtnFunc(config) {

        const { id, CustomerID, Customer, VehicleNo, VehicleID } = config.rowData
        setmodal(true);
        dispatch(getVehicleList())
        setInvoiceID(id)
        setCustomer({ value: CustomerID, label: Customer })

        if ((VehicleID === null) || VehicleNo === null) {
            setVehicle_No({ value: null, label: "Select..." });
        } else {
            setVehicle_No({ value: VehicleID, label: VehicleNo })
        }

    }

    const updateVehicleInvoice = () => {

        const jsonBody = JSON.stringify({
            InvoiceID: InvoiceID,
            vehicle: Vehicle_No.value,
            Customer: Customer.value
        });
        dispatch(Pos_UpdateVehicleCustomerInvoice_Action({ jsonBody }));



    };

    async function editBodyfunc(config) {

        const { rowData } = config;

        const customer = {
            value: rowData.CustomerID,
            label: rowData.Customer,
            GSTIN: rowData.CustomerGSTIN,
            IsTCSParty: rowData.IsTCSParty,
            ISCustomerPAN: rowData.CustomerPAN,
            PartyID: rowData.PartyID,
            OrderID: rowData.id,
        }

        dispatch(editInvoiceAction({
            ...config,
            customer,
            subPageMode: url.FRANCHAISE_INVOICE,
            path: url.FRANCHAISE_INVOICE,
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

    useEffect(() => {   // Uploaded E-way Bill useEffect 

        if ((franchiesDeleteApiRep.Status === true) && (franchiesDeleteApiRep.StatusCode === 200)) {

            setFranchiesDeleteApiRep({})
            goButtonHandler("event")
            customAlert({
                Type: 1,
                Message: JSON.stringify(franchiesDeleteApiRep.Message),
            })
        }

        else if (franchiesDeleteApiRep.Status === true) {
            setFranchiesDeleteApiRep({})
            customAlert({
                Type: 3,
                Message: JSON.stringify(franchiesDeleteApiRep.Message),
            })
            return
        }
    }, [franchiesDeleteApiRep]);

    async function deleteBodyfunc(config) {
        let btnId = `btn-isdelete-${config.deleteId}`
        setDeleteBtnloading(btnId)
        let rowData = config.rowData

        const jsonBody = JSON.stringify([{
            "DeletedTableAutoID": config.deleteId,
            "ClientID": 0,
            "ClientSaleID": config.deleteId,
            "PartyID": rowData.PartyID,
            "InvoiceDate": rowData.InvoiceDate,
            "DeletedBy": _cfunc.loginUserID(),
            "DeletedOn": `${date} ${time}`,
            "ReferenceInvoiceID": null,
            "isUpdate": false,
            "UpdatedBy": _cfunc.loginUserID(),
            "UpdatedOn": `${date} ${time}`,
            "UpdatedInvoiceDetails": []
        }]);
        console.log(jsonBody)

        let alertRepsponse = await customAlert({
            Type: 8,
            Message: `${alertMessages.deleteOrNot} Invoice : "${config.deleteId}"`,
        })
        if (alertRepsponse) {
            const jsonData = await postWithBasicAuth({
                jsonBody: jsonBody,
                APIName: FRANCHAISE_INVOICE_DELETE_API,
            });
            setDeleteBtnloading(false)
            setFranchiesDeleteApiRep(jsonData)
        }

        setDeleteBtnloading(false)


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
                            UpdateDetailsBtnFunc={UpdateDetailsBtnFunc}
                            minPrintBtn_Func={minPrintBtn_Func}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            editBodyfunc={editBodyfunc}
                            deleteBodyfunc={deleteBodyfunc}
                            HeaderContent={HeaderContent}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={subPageMode === url.IB_INVOICE_FOR_GRN ? "GRN" : "Invoice"}
                            deleteName={"FullInvoiceNumber"}
                            makeBtnName={"Make"}
                            filters={hederFilters}
                            forceNewBtnView={false}
                            // e_Invoice_ActionsBtnFunc={e_Invoice_ActionsBtnFunc}
                            // e_WayBill_ActionsBtnFunc={e_WayBill_ActionsBtnFunc}
                            totalAmountShow={true}
                            selectCheckParams={{
                                isShow: (subPageMode === url.INVOICE_LIST_1),
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
                        <h4 className="modal-title mt-0 align-middle">Update Details</h4>
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
                    <div className="modal-body" style={{ height: "250px", width: "500px" }}>
                        <Row >
                            {_cfunc.loginUserIsFranchisesRole() && <Col sm="12" className="">
                                <FormGroup className="mb- row mt-1 " >
                                    <Label className="col-sm-6 p-2 text-black font-size-18"
                                        style={{ width: "105px" }}>Customer</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="Customer"
                                            value={Customer}
                                            isSearchable={true}
                                            id={'VehicleNoselect'}
                                            className="card-header align-items-center d-flex"
                                            classNamePrefix="dropdown"
                                            options={supplierOptions.slice(1)}
                                            onChange={(e) => { CustomerOnChangeHandler(e) }}
                                            styles={{
                                                menu: (provided) => ({
                                                    ...provided,
                                                    zIndex: 5,
                                                    maxHeight: "300px",
                                                    overflowY: "auto",
                                                }),
                                            }}
                                        />

                                    </Col>
                                </FormGroup>
                            </Col>}
                            <Col sm="12" className="">
                                <FormGroup className="mb- row mt-1  mb-4" >
                                    <Label className="col-sm-6 p-2 text-black font-size-18"
                                        style={{ width: "105px" }}>Vehicle No</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="Customer"
                                            value={Vehicle_No}
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
                                                    maxHeight: "300px",
                                                    overflowY: "auto",
                                                }),
                                            }}
                                        />
                                        {(vehicleErrorMsg) && (
                                            <span className="text-danger f-8"><small>Please Select Vehicle No </small></span>
                                        )}
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="justify-content-start modal-footer p-4">
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
                                {"Update"}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>

        </React.Fragment>
    )
}

export default SweetPosInvoiceList;







