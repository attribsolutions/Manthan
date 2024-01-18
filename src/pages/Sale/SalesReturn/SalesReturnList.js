import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    commonPageFieldList,
    commonPageFieldListSuccess,
    getpdfReportdata
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, Retailer_List, Retailer_List_Success } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import SalesReturn from "./SalesReturn";
import { confirm_SalesReturn_Id, confirm_SalesReturn_Id_Succcess, delete_SalesReturn_Id, delete_SalesReturn_Id_Succcess, post_Send_to_superStockiest_Id, salesReturnListAPI, salesReturnListAPISuccess } from "../../../store/Sales/SalesReturnRedux/action";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import * as _cfunc from "../../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../../routes/index"
import SalesReturnView_Modal from "./SalesReturnConfirm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import * as report from '../../../Reports/ReportIndex'
import { ReturnPrint_API } from "../../../helpers/backend_helper";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { async } from "q";
import { return_discountCalculate_Func } from "./SalesCalculation";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";

const SalesReturnList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultList)
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [otherState, setOtherState] = useState({ masterPath: '', newBtnPath: '', buttonMsgLable: '' });
    const [PurchaseReturnMode_3_Access, setPurchaseReturnMode_3_Access] = useState(false)

    let customerdropdownLabel = subPageMode === url.SALES_RETURN_LIST ? "Customer" : "Supplier"

    const reducers = useSelector(
        (state) => ({
            sendToSSbtnLoading: state.SalesReturnReducer.sendToSSbtnLoading,
            retailerDropLoading: state.CommonAPI_Reducer.retailerDropLoading,
            vendorSupplierCustomerLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            loading: state.SalesReturnReducer.loading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            listBtnLoading: (state.SalesReturnReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading),
            tableList: state.SalesReturnReducer.salesReturnList,
            sendToSSbtnTableData: state.SalesReturnReducer.sendToSSbtnTableData,
            deleteMsg: state.SalesReturnReducer.deleteMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            viewData_redux: state.SalesReturnReducer.confirmBtnData,
            ApprovrMsg: state.SalesReturnReducer.ApprovrMsg,
        })
    );

    const { pageField, RetailerList, supplier, sendToSSbtnTableData, userAccess, ApprovrMsg, loading, sendToSSbtnLoading, retailerDropLoading, vendorSupplierCustomerLoading } = reducers;

    const values = { ...state.values }

    const action = {
        getList: salesReturnListAPI,
        deleteId: delete_SalesReturn_Id,
        deleteSucc: delete_SalesReturn_Id_Succcess
    }

    // userAccess useEffect
    useEffect(() => {

        userAccess.find((index) => {
            if (index.id === pageId.PURCHASE_RETURN_MODE_3) {
                return setPurchaseReturnMode_3_Access(true)
            }
        });
    }, [userAccess])

    // Featch Modules List data  First Rendering
    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let newBtnPath = false;
        let buttonMsgLable = '';

        if (subPageMode === url.PURCHASE_RETURN_LIST) {
            page_Id = pageId.PURCHASE_RETURN_LIST
            masterPath = url.PURCHASE_RETURN
            newBtnPath = url.PURCHASE_RETURN
            buttonMsgLable = "Purchase Return"
        }
        else if (subPageMode === url.SALES_RETURN_LIST) {
            page_Id = pageId.SALES_RETURN_LIST;
            masterPath = url.SALES_RETURN
            newBtnPath = url.SALES_RETURN
            buttonMsgLable = "Sales Return"
        }
        setPageMode(page_Mode)
        setSubPageMode(subPageMode)
        setOtherState({ masterPath, newBtnPath, buttonMsgLable })
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        if (!(_cfunc.loginSelectedPartyID() === 0)) {
            goButtonHandler()
        }

        return () => {
            dispatch(salesReturnListAPISuccess([]));
            dispatch(GetVenderSupplierCustomerSuccess([]));
            dispatch(Retailer_List_Success([]));
        }
    }, []);

    useEffect(async () => {

        if ((sendToSSbtnTableData.Status === true) && (sendToSSbtnTableData.StatusCode === 200)) {
            const { Data = [] } = sendToSSbtnTableData;
            let grand_total = 0;
            const updatedTableDataPromises = Data.map((item, index) => {
                return _cfunc.fetchFiles(item.ReturnItemImages)
                    .then(files => {
                        const calculate = return_discountCalculate_Func(item);
                        item["roundedTotalAmount"] = calculate.roundedTotalAmount;
                        grand_total += Number(calculate.roundedTotalAmount);

                        return {
                            ...item,
                            id: index + 1,
                            salesQuantity: item.Quantity,
                            Quantity: item.ApprovedQuantity,
                            tableBatchDate: _cfunc.date_dmy_func(item.BatchDate),
                            File: files  // Adding files to the item object
                        };
                    });
            });
            // Wait for all the file fetching and calculations to complete
            const updatedTableData = await Promise.all(updatedTableDataPromises);

            history.push({
                pathname: url.PURCHASE_RETURN_MODE_3,
                updatedTableData: updatedTableData,
                GrandTotal: grand_total
            })
        }
    }, [sendToSSbtnTableData])

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
        dispatch(GetVenderSupplierCustomer({ subPageMode, PartyID: _cfunc.loginSelectedPartyID() }))
    }, []);

    useEffect(() => {
        if ((ApprovrMsg.Status === true) && (ApprovrMsg.StatusCode === 200)) {
            goButtonHandler()
        }
    }, [ApprovrMsg])

    useEffect(() => {
        if ((reducers.viewData_redux.Status === true) && (reducers.viewData_redux.pageMode === mode.modeSTPsave)) {

            history.push({
                pathname: url.GOODS_CREDIT_NOTE,
                editValue: reducers.viewData_redux.Data[0],
                pageMode: mode.modeSTPsave
            })
        }
        return () => {
            dispatch(confirm_SalesReturn_Id_Succcess({ Status: false }))
        }
    }, [reducers.viewData_redux.pageMode])


    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    const supplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    supplierOptions.unshift({
        value: "",
        label: " All"
    });

    const goButtonHandler = () => {

        try {
            if (_cfunc.loginSelectedPartyID() === 0) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            const salesReturnJsonBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                CustomerID: values.Customer.value,
                PartyID: _cfunc.loginSelectedPartyID(),
            });
            const purchaseReturnJsonBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                CustomerID: _cfunc.loginSelectedPartyID(),
                PartyID: values.Customer.value,
            });

            let jsonBody;
            if (subPageMode === url.SALES_RETURN_LIST) {
                jsonBody = (salesReturnJsonBody);
            }
            else {
                jsonBody = (purchaseReturnJsonBody);
            }
            dispatch(salesReturnListAPI(jsonBody));
        } catch (error) { }
        return
    };

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    function CustomerOnChange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
            return a
        })
    }

    function viewApprovalBtnFunc(config) {
        config["viewMode"] = subPageMode
        dispatch(confirm_SalesReturn_Id(config))
    }

    const makeBtnFunc = (List, btnId) => {

        const id = List[0].id
        const config = {
            editId: id,
            pageMode: mode.modeSTPsave,
            btnId: btnId
        };

        dispatch(confirm_SalesReturn_Id(config))
    };

    function downBtnFunc(config) {
        config["ReportType"] = report.Return;
        dispatch(getpdfReportdata(ReturnPrint_API, config))
    }

    const partySelectButtonHandler = () => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginSelectedPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
        dispatch(GetVenderSupplierCustomer({ subPageMode, PartyID: _cfunc.loginSelectedPartyID() }))
        goButtonHandler()
    }

    function partySelectOnChangeHandler() {
        dispatch(salesReturnListAPISuccess([]));
        dispatch(Retailer_List_Success([]));
        dispatch(GetVenderSupplierCustomerSuccess([]));

        setState((i) => {
            let a = { ...i }
            a.values.Customer = { value: "", label: "All" }
            a.hasValid.Customer.valid = true;
            return a
        })
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
                                    name='FromDate'
                                    value={values.FromDate}
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
                                    name="ToDate"
                                    value={values.ToDate}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"

                                style={{ width: "115px" }}>{customerdropdownLabel}</Label>
                            <Col sm="5">
                                <C_Select
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    value={values.Customer}
                                    isLoading={subPageMode === url.SALES_RETURN_LIST ? retailerDropLoading : vendorSupplierCustomerLoading}
                                    options={subPageMode === url.SALES_RETURN_LIST ? customerOptions : supplierOptions}
                                    onChange={CustomerOnChange}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button loading={reducers.loading} onClick={goButtonHandler} />
                    </Col>
                </div>
            </div >
        )
    }

    const selectSaveBtnHandler = (row = []) => {

        let ischeck = row.filter(i => (i.selectCheck))
        if (!ischeck.length > 0) {
            customAlert({
                Type: 4,
                Message: "Please Select One Checkbox",
            });
            return
        }
        let idString = ischeck.map(obj => obj.id).join(',')
        let jsonBody = JSON.stringify({ PartyID: _cfunc.loginSelectedPartyID(), ReturnID: idString })
        dispatch(post_Send_to_superStockiest_Id({ jsonBody, ReturnID: idString }))
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <PageLoadingSpinner isLoading={(loading || !pageField)} />

                <PartyDropdown_Common pageMode={pageMode}
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partySelectOnChangeHandler} />

                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={SalesReturn}
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            subPageMode={subPageMode}
                            pageMode={pageMode}
                            viewApprovalBtnFunc={viewApprovalBtnFunc}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnName={"Create Credit Note for"}
                            HeaderContent={HeaderContent}
                            downBtnFunc={downBtnFunc}
                            goButnFunc={goButtonHandler}
                            ButtonMsgLable={otherState.buttonMsgLable}
                            deleteName={"FullReturnNumber"}
                            totalAmountShow={true}
                            selectCheckParams={{
                                isShow: ((subPageMode === url.SALES_RETURN_LIST) && PurchaseReturnMode_3_Access),
                                selectSaveBtnHandler: selectSaveBtnHandler,
                                selectSaveBtnLabel: "Send To Supplier",
                                selectHeaderLabel: "Select",
                                selectSaveBtnLoading: sendToSSbtnLoading
                            }}

                        />
                        : null
                }
            </div>
            <SalesReturnView_Modal />
        </React.Fragment>
    )
}

export default SalesReturnList;