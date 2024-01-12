import React, { useEffect, useLayoutEffect, useState, } from "react";
import {
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageFieldSuccess, getpdfReportdata } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { commonPageField } from "../../../store/actions";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeDate,
    onChangeSelect,
} from "../../../components/Common/validationFunction";
import Select from "react-select";
import { SaveAndDownloadPDF, SaveButton } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode";
import * as pageId from "../../../routes/allPageID"
import * as url from "../../../routes/route_url"
import {
    GoButtonForinvoiceAdd,
    GoButtonForinvoiceAddSuccess,
    Uploaded_EInvoiceAction,
    invoiceSaveAction,
    invoiceSaveActionSuccess,
    makeIB_InvoiceActionSuccess,
    editInvoiceActionSuccess,
    updateInvoiceAction,
    updateInvoiceActionSuccess
} from "../../../store/Sales/Invoice/action";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess } from "../../../store/CommonAPI/SupplierRedux/actions";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import {
    invoice_discountCalculate_Func,
    innerStockCaculation,
    orderQtyOnChange,
    orderQtyUnit_SelectOnchange,
    stockQtyOnChange,
    settingBaseRoundOffAmountFunc
} from "../Invoice/invoiceCaculations";
import "../Invoice/invoice.scss"
import * as _cfunc from "../../../components/Common/CommonFunction";
import { CInput, C_DatePicker, decimalRegx } from "../../../CustomValidateForm";
import { getVehicleList, getVehicleListSuccess } from "../../../store/Administrator/VehicleRedux/action";
import { Invoice_Singel_Get_for_Report_Api } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import CustomTable from "../../../CustomTable2";
import NewCommonPartyDropdown from "../../../components/Common/NewCommonPartyDropdown";
import { useMemo } from "react";
import BulkTableComponent from "./table/index";
import TesBulInvoce from "./test";
// import { bulkdata,data } from './data'
import bulkdata from './data2'
// import { StockProvider } from './context/index';
import { BulkInvoiceProvider } from "./contex";

const Bulk_Invoice2 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const subPageMode = history.location.pathname
    const systemSetting = _cfunc.loginSystemSetting();

    const goBtnId = `ADDGoBtn${subPageMode}`
    const saveBtnid = `saveBtn${subPageMode}`

    const fileds = {
        InvoiceDate: currentDate_ymd,
        Customer: "",
        VehicleNo: ""
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [orderItemDetails, setOrderItemDetails] = useState([])
    const [orderIDs, setOrderIDs] = useState([])
    const [editInvoiceData, setEditInvoiceData] = useState('')

    // for invoice page heder discount functionality useSate ************************************
    const [discountValueAll, setDiscountValueAll] = useState("");
    const [discountTypeAll, setDiscountTypeAll] = useState({ value: 2, label: " % " });
    const [discountDropOption] = useState([{ value: 1, label: "Rs" }, { value: 2, label: "%" }])
    const [changeAllDiscount, setChangeAllDiscount] = useState(false)

    // ****************************************************************************

    const [modalCss] = useState(false);
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [userPageAccessState, setUserAccState] = useState('');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    const {
        postMsg,
        updateMsg,
        pageField,
        userAccess,
        gobutton_Add = { Status: false },
        vendorSupplierCustomer,
        makeIBInvoice,
        VehicleNumber,
        goBtnloading,
        editData,
        saveBtnloading,
        saveAndPdfBtnLoading,
        commonPartyDropSelect
    } = useSelector((state) => ({
        postMsg: state.InvoiceReducer.postMsg,
        editData: state.InvoiceReducer.editData,
        updateMsg: state.InvoiceReducer.updateMsg,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,
        customer: state.CommonAPI_Reducer.customer,
        gobutton_Add: state.InvoiceReducer.gobutton_Add,
        vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
        VehicleNumber: state.VehicleReducer.VehicleList,
        makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
        saveBtnloading: state.InvoiceReducer.saveBtnloading,
        goBtnloading: state.InvoiceReducer.goBtnloading,
        saveAndPdfBtnLoading: state.InvoiceReducer.saveAndPdfBtnLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty("editValue")

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.INVOICE_1))
        dispatch(GoButtonForinvoiceAddSuccess([]))

    }, []);

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])








    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                    <BulkInvoiceProvider data={bulkdata}>
                        <TesBulInvoce />
                    </BulkInvoiceProvider>


                    {/* {bulkInvoiceData.map((i, key) => (
                                <BulkTableComponent
                                    parentKey={key}
                                    singleInvoiceData={i.OrderItemDetails}
                                />
                            ))} */}


                </div>

            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default Bulk_Invoice2