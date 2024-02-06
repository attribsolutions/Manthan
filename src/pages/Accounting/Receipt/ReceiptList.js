import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate_ymd, loginCompanyID, loginPartyID, loginUserAdminRole } from "../../../components/Common/CommonFunction";
import Receipts from "./Receipts";
import * as report from '../../../Reports/ReportIndex'
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import {
    deleteReceiptList,
    deleteReceiptList_Success,
    ReceiptListAPI,
    ReceiptListAPISuccess,
    ReceiptTypeAPI,
} from "../../../store/Accounting/Receipt/action";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { Retailer_List, Retailer_List_Success } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode"
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { Receipt_Print } from "../../../helpers/backend_helper";
import { C_DatePicker, C_Select } from "../../../CustomValidateForm";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { alertMessages } from "../../../components/Common/CommonErrorMsg/alertMsg";


const ReceiptList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const userAdminRole = loginUserAdminRole()

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: (state.ReceiptReducer.listBtnLoading || state.PdfReportReducers.ReportBtnLoading),
            retailerDropLoading: state.CommonAPI_Reducer.retailerDropLoading,
            loading: state.ReceiptReducer.loading,
            tableList: state.ReceiptReducer.ReceiptList,
            deleteMsg: state.ReceiptReducer.deleteMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
        })
    );

    const { userAccess, pageField, RetailerList, ReceiptType, retailerDropLoading, commonPartyDropSelect } = reducers;
    const values = { ...state.values }

    const action = {
        deleteId: deleteReceiptList,
        deleteSucc: deleteReceiptList_Success
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.RECEIPTS_LIST
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        // dispatch(BreadcrumbShowCountlabel(`${"Receipt Count"} :0`));
        return () => {
            dispatch(commonPageFieldListSuccess(null))
        }
    }, []);

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            goButtonHandler()
            const jsonBody = JSON.stringify({
                Type: 4,
                PartyID: commonPartyDropSelect.value,
                CompanyID: loginCompanyID()
            });
            dispatch(Retailer_List(jsonBody));
        }
        setState((i) => {
            let a = { ...i }
            a.values.Customer = { value: "", label: "All" }
            return a
        })
        return () => {
            dispatch(ReceiptListAPISuccess([]));
            dispatch(Retailer_List_Success([]));
        }

    }, [commonPartyDropSelect]);

    useEffect(() => {
        const page_Id = pageId.RECEIPTS_LIST
        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    useEffect(() => { // Receipt Type API Values **** only Post Json Body
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 3
        });
        dispatch(ReceiptTypeAPI(jsonBody));

    }, []);

    useEffect(() => { // When ReceiptType api call give me Receipt id then Go Button true
        if (ReceiptType.length > 0 && !(userAdminRole)) {
            goButtonHandler(true)
        }
    }, [ReceiptType]);

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    const goButtonHandler = () => {
        try {
            if (commonPartyDropSelect.value === 0) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            const ReceiptTypeID = ReceiptType.find((index) => {
                return index.Name === "Receipt"
            })

            const jsonBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                CustomerID: values.Customer.value,
                PartyID: commonPartyDropSelect.value,
                ReceiptType: ReceiptTypeID.id,
            });

            dispatch(ReceiptListAPI(jsonBody, hasPagePath));
        } catch (error) { }
        return
    };

    function downBtnFunc(config) {
        config["ReportType"] = report.Receipt;
        dispatch(getpdfReportdata(Receipt_Print, config))
    }

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

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: commonPartyDropSelect.value,
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    function CustomerOnChange(e) {

        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
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
                                style={{ width: "115px" }}>Customer</Label>
                            <Col sm="5">
                                <C_Select
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    value={values.Customer}
                                    isLoading={retailerDropLoading}
                                    options={customerOptions}
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
            </div>
        )
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={(reducers.loading || !pageField)} />
            <div className="page-content">
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={Receipts}
                            masterPath={url.RECEIPTS}
                            newBtnPath={url.RECEIPTS}
                            pageMode={pageMode}
                            HeaderContent={HeaderContent}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            ButtonMsgLable={"Receipt"}
                            deleteName={"FullReceiptNumber"}
                            totalAmountShow={true}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default ReceiptList;