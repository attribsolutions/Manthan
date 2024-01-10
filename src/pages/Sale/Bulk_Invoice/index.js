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
import { bulkdata } from './data'
import { StockProvider } from './context/index';
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

    const bulkInvoiceData = [
        {
            "OrderIDs": [
                "21803"
            ],
            "OrderDate": "",
            "InvoiceAmount": 0,
            "customer": {
                "value": 389,
                "label": "Bedekar Super Market",
                "GSTIN": "",
                "IsTCSParty": false,
                "ISCustomerPAN": null

            },
            "OrderItemDetails": [
                {
                    "id": 127977,
                    "Item": 45,
                    "ItemName": "Kaju Katali 250 g",
                    "Quantity": 1,
                    "MRP": null,
                    "MRPValue": "265.00",
                    "Rate": "215.36",
                    "Unit": 133,
                    "UnitName": "No",
                    "DeletedMCUnitsUnitID": 1,
                    "ConversionUnit": "1.000",
                    "BaseUnitQuantity": "1.000",
                    "GST": 45,
                    "HSNCode": "21069099",
                    "GSTPercentage": "5.00",
                    "Margin": null,
                    "MarginValue": null,
                    "BasicAmount": "215.36",
                    "GSTAmount": "21.54",
                    "CGST": "10.77",
                    "SGST": "10.77",
                    "IGST": "0.00",
                    "CGSTPercentage": "2.50",
                    "SGSTPercentage": "2.50",
                    "IGSTPercentage": "0.00",
                    "Amount": "236.90",
                    "DiscountType": "",
                    "Discount": "",
                    "IsTCSParty": false,
                    "ISCustomerPAN": null,
                    "InpStockQtyTotal": "1",
                    "StockInValid": false,
                    "StockInvalidMsg": "",
                    "ItemTotalStock": 100,
                    "ItemTotalAmount": 230.44,
                    "OrderQty": 1,

                    "UnitDetails": [
                        {
                            "UnitID": 133,
                            "UnitName": "No",
                            "BaseUnitQuantity": "1.000",
                            "PODefaultUnit": false,
                            "SODefaultUnit": true,
                            "Rate": 219.46,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 1
                        },
                        {
                            "UnitID": 134,
                            "UnitName": "Kg (4 No)",
                            "BaseUnitQuantity": "4.000",
                            "PODefaultUnit": false,
                            "SODefaultUnit": false,
                            "Rate": 219.46,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 2
                        },
                        {
                            "UnitID": 135,
                            "UnitName": "Box (20 No)",
                            "BaseUnitQuantity": "20.000",
                            "PODefaultUnit": true,
                            "SODefaultUnit": false,
                            "Rate": 219.46,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 4
                        }
                    ],
                    "StockDetails": [
                        {
                            "id": 185262,
                            "Item": 45,
                            "BatchDate": "2023-11-06",
                            "BatchCode": "20231106_45_97_0",
                            "SystemBatchDate": "2023-11-06",
                            "SystemBatchCode": "20231106_45_97_0",
                            "LiveBatche": 43258,
                            "LiveBatcheMRPID": 665,
                            "LiveBatcheGSTID": 45,
                            "Rate": 219.46,
                            "MRP": "265.00",
                            "GST": "5.00",
                            "UnitName": "No",
                            "BaseUnitQuantity": "100.000",
                            "initialRate": 219.46,
                            "ActualQuantity": 100,
                            "Qty": 1
                        }
                    ],
                    "default_UnitDropvalue": {
                        "value": 133,
                        "label": "No",
                        "ConversionUnit": "1",
                        "Unitlabel": "No",
                        "BaseUnitQuantity": "1.000",
                        "BaseUnitQuantityNoUnit": "1.000"
                    },
                },
                {
                    "id": 127978,
                    "Item": 86,
                    "ItemName": "Sadha Pedha 200 g",
                    "Quantity": 1,
                    "MRP": null,
                    "MRPValue": "170.00",
                    "Rate": "138.16",
                    "Unit": 262,
                    "UnitName": "No",
                    "DeletedMCUnitsUnitID": 1,
                    "ConversionUnit": "1.000",
                    "BaseUnitQuantity": "1.000",
                    "GST": 86,
                    "HSNCode": "21069099",
                    "GSTPercentage": "5.00",
                    "Margin": null,
                    "MarginValue": null,
                    "BasicAmount": "138.16",
                    "GSTAmount": "13.82",
                    "CGST": "6.91",
                    "SGST": "6.91",
                    "IGST": "0.00",
                    "CGSTPercentage": "2.50",
                    "SGSTPercentage": "2.50",
                    "IGSTPercentage": "0.00",
                    "Amount": "151.98",
                    "DiscountType": "",
                    "Discount": "",
                    "IsTCSParty": false,
                    "ISCustomerPAN": null,
                    "InpStockQtyTotal": "1",
                    "StockInValid": false,
                    "StockInvalidMsg": "",
                    "ItemTotalStock": 99,
                    "ItemTotalAmount": 147.83,
                    "OrderQty": 1,

                    "UnitDetails": [
                        {
                            "UnitID": 262,
                            "UnitName": "No",
                            "BaseUnitQuantity": "1.000",
                            "PODefaultUnit": false,
                            "SODefaultUnit": true,
                            "Rate": 140.79,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 1
                        },
                        {
                            "UnitID": 263,
                            "UnitName": "Kg (5 No)",
                            "BaseUnitQuantity": "5.000",
                            "PODefaultUnit": false,
                            "SODefaultUnit": false,
                            "Rate": 140.79,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 2
                        },
                        {
                            "UnitID": 264,
                            "UnitName": "Box (20 No)",
                            "BaseUnitQuantity": "20.000",
                            "PODefaultUnit": true,
                            "SODefaultUnit": false,
                            "Rate": 140.79,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 4
                        }
                    ],
                    "StockDetails": [
                        {
                            "id": 185259,
                            "Item": 86,
                            "BatchDate": "2023-11-06",
                            "BatchCode": "20231106_86_97_0",
                            "SystemBatchDate": "2023-11-06",
                            "SystemBatchCode": "20231106_86_97_0",
                            "LiveBatche": 43255,
                            "LiveBatcheMRPID": 706,
                            "LiveBatcheGSTID": 86,
                            "Rate": 140.79,
                            "MRP": "170.00",
                            "GST": "5.00",
                            "UnitName": "No",
                            "BaseUnitQuantity": "99.000",
                            "initialRate": 140.79,
                            "ActualQuantity": 99,
                            "Qty": 1
                        }
                    ],

                    "default_UnitDropvalue": {
                        "value": 262,
                        "label": "No",
                        "ConversionUnit": "1",
                        "Unitlabel": "No",
                        "BaseUnitQuantity": "1.000",
                        "BaseUnitQuantityNoUnit": "1.000"
                    },

                },

            ],

        },
        {
            "OrderIDs": [
                "218031"
            ],
            "OrderDate": "",
            "InvoiceAmount": 0,
            "customer": {
                "value": 389,
                "label": "Bedekar Super Market",
                "GSTIN": "",
                "IsTCSParty": false,
                "ISCustomerPAN": null

            },
            "OrderItemDetails": [
                {
                    "id": 1279771,
                    "Item": 45,
                    "ItemName": "Kaju Katali 250 g",
                    "Quantity": 1,
                    "MRP": null,
                    "MRPValue": "265.00",
                    "Rate": "215.36",
                    "Unit": 133,
                    "UnitName": "No",
                    "DeletedMCUnitsUnitID": 1,
                    "ConversionUnit": "1.000",
                    "BaseUnitQuantity": "1.000",
                    "GST": 45,
                    "HSNCode": "21069099",
                    "GSTPercentage": "5.00",
                    "Margin": null,
                    "MarginValue": null,
                    "BasicAmount": "215.36",
                    "GSTAmount": "21.54",
                    "CGST": "10.77",
                    "SGST": "10.77",
                    "IGST": "0.00",
                    "CGSTPercentage": "2.50",
                    "SGSTPercentage": "2.50",
                    "IGSTPercentage": "0.00",
                    "Amount": "236.90",
                    "DiscountType": "",
                    "Discount": "",
                    "IsTCSParty": false,
                    "ISCustomerPAN": null,
                    "InpStockQtyTotal": "1",
                    "StockInValid": false,
                    "StockInvalidMsg": "",
                    "ItemTotalStock": 100,
                    "ItemTotalAmount": 230.44,
                    "OrderQty": 1,

                    "UnitDetails": [
                        {
                            "UnitID": 1331,
                            "UnitName": "No",
                            "BaseUnitQuantity": "1.000",
                            "PODefaultUnit": false,
                            "SODefaultUnit": true,
                            "Rate": 219.46,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 1
                        },
                        {
                            "UnitID": 1341,
                            "UnitName": "Kg (4 No)",
                            "BaseUnitQuantity": "4.000",
                            "PODefaultUnit": false,
                            "SODefaultUnit": false,
                            "Rate": 219.46,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 2
                        },
                        {
                            "UnitID": 135,
                            "UnitName": "Box (20 No)",
                            "BaseUnitQuantity": "20.000",
                            "PODefaultUnit": true,
                            "SODefaultUnit": false,
                            "Rate": 219.46,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 4
                        }
                    ],
                    "StockDetails": [
                        {
                            "id": 1852621,
                            "Item": 45,
                            "BatchDate": "2023-11-06",
                            "BatchCode": "20231106_45_97_0",
                            "SystemBatchDate": "2023-11-06",
                            "SystemBatchCode": "20231106_45_97_0",
                            "LiveBatche": 43258,
                            "LiveBatcheMRPID": 665,
                            "LiveBatcheGSTID": 45,
                            "Rate": 219.46,
                            "MRP": "265.00",
                            "GST": "5.00",
                            "UnitName": "No",
                            "BaseUnitQuantity": "100.000",
                            "initialRate": 219.46,
                            "ActualQuantity": 100,
                            "Qty": 1
                        }
                    ],
                    "default_UnitDropvalue": {
                        "value": 133,
                        "label": "No",
                        "ConversionUnit": "1",
                        "Unitlabel": "No",
                        "BaseUnitQuantity": "1.000",
                        "BaseUnitQuantityNoUnit": "1.000"
                    },
                },
                {
                    "id": 1279781,
                    "Item": 86,
                    "ItemName": "Sadha Pedha 200 g",
                    "Quantity": 1,
                    "MRP": null,
                    "MRPValue": "170.00",
                    "Rate": "138.16",
                    "Unit": 262,
                    "UnitName": "No",
                    "DeletedMCUnitsUnitID": 1,
                    "ConversionUnit": "1.000",
                    "BaseUnitQuantity": "1.000",
                    "GST": 86,
                    "HSNCode": "21069099",
                    "GSTPercentage": "5.00",
                    "Margin": null,
                    "MarginValue": null,
                    "BasicAmount": "138.16",
                    "GSTAmount": "13.82",
                    "CGST": "6.91",
                    "SGST": "6.91",
                    "IGST": "0.00",
                    "CGSTPercentage": "2.50",
                    "SGSTPercentage": "2.50",
                    "IGSTPercentage": "0.00",
                    "Amount": "151.98",
                    "DiscountType": "",
                    "Discount": "",
                    "IsTCSParty": false,
                    "ISCustomerPAN": null,
                    "InpStockQtyTotal": "1",
                    "StockInValid": false,
                    "StockInvalidMsg": "",
                    "ItemTotalStock": 99,
                    "ItemTotalAmount": 147.83,
                    "OrderQty": 1,

                    "UnitDetails": [
                        {
                            "UnitID": 262,
                            "UnitName": "No",
                            "BaseUnitQuantity": "1.000",
                            "PODefaultUnit": false,
                            "SODefaultUnit": true,
                            "Rate": 140.79,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 1
                        },
                        {
                            "UnitID": 263,
                            "UnitName": "Kg (5 No)",
                            "BaseUnitQuantity": "5.000",
                            "PODefaultUnit": false,
                            "SODefaultUnit": false,
                            "Rate": 140.79,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 2
                        },
                        {
                            "UnitID": 264,
                            "UnitName": "Box (20 No)",
                            "BaseUnitQuantity": "20.000",
                            "PODefaultUnit": true,
                            "SODefaultUnit": false,
                            "Rate": 140.79,
                            "BaseUnitQuantityNoUnit": "1.000",
                            "DeletedMCUnitsUnitID": 4
                        }
                    ],
                    "StockDetails": [
                        {
                            "id": 1852591,
                            "Item": 86,
                            "BatchDate": "2023-11-06",
                            "BatchCode": "20231106_86_97_0",
                            "SystemBatchDate": "2023-11-06",
                            "SystemBatchCode": "20231106_86_97_0",
                            "LiveBatche": 43255,
                            "LiveBatcheMRPID": 706,
                            "LiveBatcheGSTID": 86,
                            "Rate": 140.79,
                            "MRP": "170.00",
                            "GST": "5.00",
                            "UnitName": "No",
                            "BaseUnitQuantity": "99.000",
                            "initialRate": 140.79,
                            "ActualQuantity": 99,
                            "Qty": 1
                        }
                    ],

                    "default_UnitDropvalue": {
                        "value": 262,
                        "label": "No",
                        "ConversionUnit": "1",
                        "Unitlabel": "No",
                        "BaseUnitQuantity": "1.000",
                        "BaseUnitQuantityNoUnit": "1.000"
                    },

                },

            ],

        },

    ];






    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>

                <div className="page-content" >

                <StockProvider>
                <TesBulInvoce data={bulkdata} />
                </StockProvider>
                    

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