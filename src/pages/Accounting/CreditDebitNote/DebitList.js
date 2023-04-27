import React, { useEffect, useLayoutEffect, useState } from "react";
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
import * as report from '../../../Reports/ReportIndex'
import { editBOMList, updateBOMListSuccess } from "../../../store/Production/BOMRedux/action";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import {
    deleteReceiptList, deleteReceiptList_Success, ReceiptListAPI, ReceiptListAPISuccess, ReceiptTypeAPI,
} from "../../../store/Accounting/Receipt/action";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button } from "../../../components/Common/CommonButton";
import * as mode from "../../../routes/PageMode"
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { Receipt_Print } from "../../../helpers/backend_helper";
import Debit from "./Debit";

const DebitList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        FromDate: currentDate,
        ToDate: currentDate,
        Customer: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            tableList: state.ReceiptReducer.ReceiptList,
            deleteMsg: state.ReceiptReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            editData: state.BOMReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
     
    const { userAccess, pageField, RetailerList, ReceiptType } = reducers;
    const values = { ...state.values }

    const action = {
        getList: ReceiptListAPI,
        editId: editBOMList,
        deleteId: deleteReceiptList,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteReceiptList_Success
    }

    useEffect(() => {
        dispatch(ReceiptListAPISuccess([]))
    }, [])

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.DEBIT_LIST
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Debit Count"} :0`))
    }, []);

    useEffect(() => {
        const page_Id = pageId.DEBIT_LIST
        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

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
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    // const NoteType= []
    // CreditDebitType.forEach(index => {
    //     if (index.Name === "CreditNote" || index.Name === "Goods CreditNote") {
    //         const arr = {
    //             value: index.id,
    //             label: index.Name,
    //         }
    //         NoteType.push(arr)
    //     }
    // })

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    function goButtonHandler() {

        const ReceiptTypeID = ReceiptType.find((index) => {
            return index.Name === "Receipt"
        })

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            CustomerID: values.Customer.value,
            PartyID: loginPartyID(),
            ReceiptType: ReceiptTypeID.id,
        });
        dispatch(ReceiptListAPI(jsonBody, hasPagePath));
    }

    function downBtnFunc(row) {
        var ReportType = report.Receipt;
        dispatch(getpdfReportdata(Receipt_Print, ReportType, row.id))
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

    function NoteTypeOnChange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.NoteType = e;
            a.hasValid.NoteType.valid = true
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
                    <Col sm={2} className="">
                        <FormGroup className=" mb-2 row mt-3 " >
                            <Label className="col-sm-4 p-2"
                                style={{ width: "66px" }}>FromDate</Label>
                            <Col sm={7}>
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

                    <Col sm={2} className="">
                        <FormGroup className=" row mt-3 " >
                            <Label className="col-sm-4 p-2"
                                style={{ width: "60px" }}>ToDate</Label>
                            <Col sm={7}>
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

                    <Col sm={3}>
                        <FormGroup className=" row mt-3 " >
                            <Label className="col-sm-2 p-2"
                                style={{ width: "85px" }}>Customer</Label>
                            <Col sm={7}>
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

                    <Col sm={3}>
                        <FormGroup className=" row mt-3 " >
                            <Label className="col-md-3 p-2"
                                style={{ width: "90px" }}>NoteType</Label>
                            <Col sm={8}>
                                <Select
                                    name="Customer"
                                    classNamePrefix="select2-Customer"
                                    // value={values.NoteType}
                                    // options={NoteType}
                                    onChange={NoteTypeOnChange}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm={2} className="mt-3 " style={{ paddingLeft: "100px" }}>
                        <Go_Button onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={Debit}
                            masterPath={url.DEBIT}
                            newBtnPath={url.DEBIT}
                            pageMode={pageMode}
                            // HeaderContent={HeaderContent}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            // ButtonMsgLable={"Receipt"}
                            deleteName={"FullReceiptNumber"}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default DebitList;