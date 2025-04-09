
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Col, FormGroup, Label } from "reactstrap";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import { C_DatePicker, C_Select } from "../../../../CustomValidateForm";
import * as _act from "../../../../store/actions";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList"

import { Go_Button, PageLoadingSpinner } from "../../../../components/Common/CommonButton";
import * as report from '../../../../Reports/ReportIndex'
import { url, mode, pageId } from "../../../../routes/index"
import { order_Type } from "../../../../components/Common/C-Varialbes";
import { IB_Order_Get_Api, OrderPage_Edit_ForDownload_API } from "../../../../helpers/backend_helper";
import { comAddPageFieldFunc, initialFiledFunc } from "../../../../components/Common/validationFunction";
import { getOrderApprovalDetailAction, orderApprovalAction, postOrderConfirms_API, postOrderConfirms_API_Success } from "../../../../store/actions";
import { priceListByCompay_Action, priceListByCompay_ActionSuccess } from "../../../../store/Administrator/PriceList/action";
import { alertMessages } from "../../../../components/Common/CommonErrorMsg/alertMsg";
import { getOrdersMakeInvoiceDataAction, getOrdersMakeInvoiceDataActionSuccess } from "../../../../store/Sales/bulkInvoice/action";
import { allLabelWithBlank, allLabelWithZero } from "../../../../components/Common/CommonErrorMsg/HarderCodeData";
import { sideBarPageFiltersInfoAction } from "../../../../store/Utilites/PartyDrodown/action";
import { getBOMListPage } from "../../../../store/Production/BOMRedux/action";
import { Bulk_BOM_for_WorkOrder, Bulk_BOM_for_WorkOrderSuccess, Save_Bulk_BOM_for_WorkOrderSuccess } from "../../../../store/Production/WorkOrder/action";
import Select from "react-select"

const BulkWorkOrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Supplier: allLabelWithBlank,
        CustomerType: [allLabelWithBlank],
        Category: allLabelWithZero
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [hasBulkinvoiceSaveAccess, setHasBulkinvoiceSaveAccess] = useState(false);

    const orderList4_or_app_orderList = ((subPageMode === url.ORDER_LIST_4) || (subPageMode === url.APP_ORDER_LIST))

    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false,
        makeBtnShow: '',
        makeBtnName: '',
        IBType: '',
        showAprovalBtn: false
    });

    const reducers = useSelector(
        (state) => ({
            unhideMsg: state.GRNReducer.hideMsg,
            GRNitem: state.GRNReducer.GRNitem,
            makeIBInvoice: state.InvoiceReducer.makeIBInvoice,
            deleteMsg: state.OrderReducer.deleteMsg,
            updateMsg: state.OrderReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.OrderReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            orderApprovalMsg: state.OrderReducer.orderApprovalMsg,
            customerType: state.PriceListReducer.priceListByCompany,
            customerTypeDropLoading: state.PriceListReducer.listBtnLoading,
            orderConfirmMsg: state.OrderReducer.orderConfirmMsg,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            supplierDropLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            Bulk_Data: state.WorkOrderReducer.Bulk_Bom_for_WorkOrder,
            tableList: state.BOMReducer.BOMList,
            goBtnLoading: state.BOMReducer.loading,
            BulkBtnloading: state.WorkOrderReducer.BulkBtnloading,
            CategoryTypeList: state.categoryTypeReducer.categoryTypeListData,



        })
    );

    const {
        pageField,
        Bulk_Data,
        BulkBtnloading,
        CategoryTypeList,
        goBtnLoading
    } = reducers;

    const ordersBulkInvoiceData = useSelector(state => state.BulkInvoiceReducer.ordersBulkInvoiceData);
    const makeBulkInvoiceLoading = useSelector(state => state.BulkInvoiceReducer.makeBulkInvoiceLoading);
    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    const values = { ...state.values }
    const { fieldLabel } = state;

    const tableAction = {
        getList: getBOMListPage,
        deleteId: _act.deleteOrderId,
        postSucc: _act.saveOrderActionSuccess,
        updateSucc: _act.updateOrderIdSuccess,
        deleteSucc: _act.deleteOrderIdSuccess,
    }

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            goButtonHandler()
            dispatch(_act.getCategoryTypelist());//Category tab
            dispatch(_act.GetVenderSupplierCustomer({ subPageMode, PartyID: commonPartyDropSelect.value }));

        } else {
            dispatch(_act.getOrderListPageSuccess([]));
            dispatch(_act.GetVenderSupplierCustomerSuccess([]));
            setState((i) => {
                let a = { ...i }
                a.values.CustomerType = [allLabelWithBlank]
                a.values.Supplier = allLabelWithBlank
                a.hasValid.CustomerType.valid = true;
                a.hasValid.Supplier.valid = true;
                return a
            })
        }

    }, [commonPartyDropSelect]);

    // sideBar Page Filters Information
    useEffect(() => {
        const filtersArray = [
            { label: fieldLabel.FromDate, content: _cfunc.date_dmy_func(values.FromDate) },
            { label: fieldLabel.ToDate, content: _cfunc.date_dmy_func(values.ToDate) },
            ...(orderList4_or_app_orderList
                ? [{ label: fieldLabel.CustomerType, content: values.CustomerType.map(obj => obj.label).join(',') }]
                : []),
            { label: fieldLabel.Supplier, content: values.Supplier.label }
        ];
        dispatch(sideBarPageFiltersInfoAction(filtersArray));
    }, [pageField, state, orderList4_or_app_orderList]);

    // Featch Modules List data  First Rendering
    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false;
        let IBType = '';
        let newBtnPath = '';
        let makeBtnName = '';
        let showAprovalBtn = false;

        if (subPageMode === url.BULK_WORK_ORDER_LIST) {
            page_Id = pageId.BULK_WORK_ORDER_LIST;
            masterPath = url.BULK_WORK_ORDER;
            newBtnPath = url.ORDER_1;
            page_Mode = mode.modeSTPList

        }



        setOtherState({ masterPath, makeBtnShow, newBtnPath, makeBtnName, IBType, showAprovalBtn })
        setPageMode(page_Mode)
        dispatch(_act.commonPageFieldListSuccess(null))
        dispatch(_act.commonPageFieldList(page_Id))
        // dispatch(_act.BreadcrumbShowCountlabel(`${"Order Count"} :0`))
        if (!(_cfunc.loginSelectedPartyID() === 0)) {
            dispatch(_act.GetVenderSupplierCustomer({ subPageMode, PartyID: _cfunc.loginSelectedPartyID() }))
            goButtonHandler("event", IBType)
        }
        dispatch(priceListByCompay_Action());

        return () => {
            dispatch(_act.commonPageFieldListSuccess(null));
            dispatch(_act.getOrderListPageSuccess([]));//for clear privious order list  
            dispatch(_act.orderSinglegetSuccess({ Status: false }));
            dispatch(_act.GetVenderSupplierCustomerSuccess([]));
            dispatch(priceListByCompay_ActionSuccess([]));
            dispatch(Bulk_BOM_for_WorkOrderSuccess({ Status: false }));
            dispatch(Save_Bulk_BOM_for_WorkOrderSuccess({ Status: false }));



        }
    }, []);



    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldList
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])



    useEffect(() => {
        debugger
        if (Bulk_Data.Status === true && Bulk_Data.StatusCode === 200) {
    
            history.push({
                pathname: url.BULK_WORK_ORDER,
                state: Bulk_Data.Data
            })

        }

    }, [Bulk_Data]);
    function CategoryType_Handler(e) {
        debugger
        setState((i) => {
            const a = { ...i }
            a.values.Category = e;
            return { ...a }
        })
    }

    const CategoryTypeList_DropdownOptions = CategoryTypeList.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    CategoryTypeList_DropdownOptions.unshift(allLabelWithZero);
    function goButtonHandler() {

        try {
            const jsonBody = JSON.stringify({
                Company: _cfunc.loginCompanyID(),
                Party: _cfunc.loginPartyID(),
                Category: values.Category.value,
                ItemID: "",
                IsVDCItem: 0
            });
            dispatch(getBOMListPage(jsonBody));

        } catch (error) { console.log(error) }
    }

    const BulkInvoice_Handler = (allList = []) => {

        let checkRows = allList.filter(i => (i.selectCheck && !i.forceSelectDissabled))
        if (!checkRows.length > 0) {
            customAlert({
                Type: 4,
                Message: alertMessages.selectOneOrder,
            });
            return
        }
        let ID_String = checkRows.map(row => row.id).join(',')
        let Quantity_String = checkRows.map(row => row.EstimatedOutputQty).join(',')
        let Item_String = checkRows.map(row => row.Item).join(',')





        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            BOM_ID: ID_String,
            Quantity: Quantity_String,
            Item: Item_String,
            Party: _cfunc.loginPartyID(),
        });

        dispatch(Bulk_BOM_for_WorkOrder({ jsonBody }))
    }


    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.goBtnloading || !pageField} />

            <div className="page-content">
                <div className="px-2   c_card_filter text-black"  >
                    <div className="row">
                        <Col sm="4">
                            <FormGroup className="mb-3 row mt-3 ">
                                <Label className="mt-2" style={{ width: "115px" }}> Item Category </Label>
                                <Col sm={7}>
                                    <Select
                                        name="CategoryType"
                                        value={values.Category}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        classNamePrefix="dropdown"
                                        options={CategoryTypeList_DropdownOptions}
                                        onChange={CategoryType_Handler}
                                    />

                                </Col>
                            </FormGroup>
                        </Col>



                        <Col sm="7" ></Col>
                        <Col sm="1" className="mt-3 ">
                            <Go_Button loading={goBtnLoading} onClick={goButtonHandler} />
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={tableAction}
                            reducers={reducers}
                            showBreadcrumb={false}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            makeBtnName={otherState.makeBtnName}
                            selectCheckParams={{
                                // isShow: (subPageMode === url.BULK_WORK_ORDER_LIST),
                                selectSaveBtnHandler: BulkInvoice_Handler,
                                selectSaveBtnLabel: "Bulk Work Order",
                                selectHeaderLabel: "Select",
                                selectSaveBtnLoading: BulkBtnloading,
                            }}
                            totalAmountShow={true}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default BulkWorkOrderList;