import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";

import {
    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    updateBOMListSuccess
} from "../../../store/Production/BOMRedux/action";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import {
    deleteReceiptList,
    deleteReceiptList_Success,
    GetOpeningBalance,
    GetOpeningBalance_Success,
    ReceiptGoButtonMaster,
    ReceiptGoButtonMaster_Success,
    ReceiptListAPI, ReceiptTypeAPI,
} from "../../../store/Accounting/Receipt/action";
import { initialFiledFunc, onChangeSelect } from "../../../components/Common/validationFunction";
import { getSupplier, Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode"
import PaymentEntry from "./PaymentEntry";
import { get_Group_List_Api } from "../../../helpers/backend_helper";
import * as report from '../../../Reports/ReportIndex'
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";

const PaymentEntryList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        FromDate: currentDate,
        ToDate: currentDate,
        Customer: { value: "", label: "All" }
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))

    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [userAccState, setUserAccState] = useState('');
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, makeBtnShow: '', makeBtnName: '' });

    const reducers = useSelector(
        (state) => ({
            tableList: state.ReceiptReducer.ReceiptList,
            deleteMsg: state.ReceiptReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.supplier,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            editData: state.BOMReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            makeReceipt: state.ReceiptReducer.ReceiptGoButton,
            OpeningBalance: state.ReceiptReducer.OpeningBalance,
        })
    );

    const { userAccess, pageField, RetailerList, ReceiptType = [], makeReceipt } = reducers;
  
    const values = { ...state.values }

    const action = {
        getList: ReceiptListAPI,
        editId: editBOMList,
        deleteId: deleteReceiptList,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteReceiptList_Success
    }

    // Receipt Type API Values **** only Post Json Body
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: loginCompanyID(),
            TypeID: 3
        });
        dispatch(ReceiptTypeAPI(jsonBody));
    }, []);

    useEffect(() => {
        if (ReceiptType.length > 0) {
            goButtonHandler(true)
        }
    }, [ReceiptType]);

    useEffect(() => {

        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false;
        let newBtnPath = '';
        let makeBtnName = '';

        if (subPageMode === url.PAYMENT_ENTRY_LIST) {
            page_Id = pageId.PAYMENT_ENTRY_LIST;
            masterPath = url.PAYMENT_ENTRY;
            newBtnPath = url.PAYMENT_ENTRY;
        }
        else if (subPageMode === url.RECEIPTS_LIST_2) {
            page_Id = pageId.RECEIPTS_LIST_2
            page_Mode = mode.modeSTPsave
            makeBtnShow = true;
            makeBtnName = "Make Payment"
        }

        dispatch(ReceiptListAPI(""))//for clear privious order list
        setOtherState({ masterPath, makeBtnShow, newBtnPath, makeBtnName })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Receipt Count"} :0`))
        dispatch(getSupplier())

    }, []);

    // Featch Modules List data  First Rendering
    useEffect(() => {
        if ((makeReceipt.Status === true) && (makeReceipt.StatusCode === 200)) {
            // dispatch(ReceiptGoButtonMaster_Success({ Status: false }))
            // dispatch(GetOpeningBalance_Success({ Status: false }))
            history.push({
                pathname: makeReceipt.path,
                pageMode: makeReceipt.pageMode,
                editValue: makeReceipt.ListData,
                // Data: makeReceipt.Data
            })
        }
    }, [makeReceipt])

    useEffect(() => {
        const page_Id = pageId.PAYMENT_ENTRY_LIST
        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    function goButtonHandler() {
        const ReceiptTypeID = ReceiptType.find((index) => {
            return index.Name === "Payment Entry"
        })

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            CustomerID: values.Customer.value,
            PartyID: loginPartyID(),
            ReceiptType: ReceiptTypeID.id,
        });
        dispatch(ReceiptListAPI(jsonBody, subPageMode));
        // dispatch(GetOpeningBalance(jsonBody));
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
            PartyID: loginPartyID(),
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
                                <Flatpickr
                                    name='FromDate'
                                    value={values.FromDate}
                                    className="form-control d-block p-2 bg-white text-dark"
                                    placeholder="Select..."
                                    options={{
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
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
                                <Flatpickr
                                    name="ToDate"
                                    value={values.ToDate}
                                    className="form-control d-block p-2 bg-white text-dark"
                                    placeholder="Select..."
                                    options={{
                                        altInput: true,
                                        altFormat: "d-m-Y",
                                        dateFormat: "Y-m-d",
                                    }}
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
                                <Select
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    value={values.Customer}
                                    options={customerOptions}
                                    onChange={CustomerOnChange}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        )
    }

    function downBtnFunc(row) {
        var ReportType = report.Receipt;
        dispatch(getpdfReportdata(get_Group_List_Api, ReportType, row.id))
    }

    const makeBtnFunc = (list = []) => {
        debugger
        var { CustomerID, ReceiptDate } = list[0]

        try {
            const jsonBody = JSON.stringify({
                PartyID: loginPartyID(),
                CustomerID: CustomerID,
                ReceiptDate: ReceiptDate
            });
            const body = { jsonBody, pageMode, path: url.RECEIPTS, ListData: list[0] }
            dispatch(ReceiptGoButtonMaster(body));
            dispatch(GetOpeningBalance(jsonBody));

        } catch (e) { }
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">
                {/* {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={PaymentEntry}
                            masterPath={url.PAYMENT_ENTRY}
                            newBtnPath={url.PAYMENT_ENTRY}
                            pageMode={pageMode}
                            HeaderContent={HeaderContent}
                            goButnFunc={goButtonHandler}
                            ButtonMsgLable={"PaymentEntry"}
                            deleteName={"FullReceiptNumber"}

                        />
                        : null
                } */}
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
                            HeaderContent={HeaderContent}

                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            // editBodyfunc={editBodyfunc}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"PaymentEntry"}
                            deleteName={"FullReceiptNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={PaymentEntry}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default PaymentEntryList;