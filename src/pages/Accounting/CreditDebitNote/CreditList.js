import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../store/actions";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList"
import { useHistory } from "react-router-dom";
import * as report from '../../../Reports/ReportIndex'
import { updateBOMListSuccess } from "../../../store/Production/BOMRedux/action";
import * as pageId from "../../../routes/allPageID";
import * as url from "../../../routes/route_url";
import { initialFiledFunc } from "../../../components/Common/validationFunction";
import * as mode from "../../../routes/PageMode"
import { getpdfReportdata } from "../../../store/Utilites/PdfReport/actions";
import { Edit_Credit_List_API, } from "../../../helpers/backend_helper";
import { Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import { Go_Button } from "../../../components/Common/CommonButton";
import {
    CredietDebitType,
    Edit_CreditList_ID,
    GetCreditList,
    deleteCreditlistSuccess,
    delete_CreditList_ID,
    GetCreditListSuccess
} from "../../../store/Accounting/CreditRedux/action";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";
import * as _cfunc from "../../../components/Common/CommonFunction"
import { C_DatePicker } from "../../../CustomValidateForm";


const CreditList = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" },
        NoteType: { value: "", label: "All" },
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [otherState, setOtherState] = useState({
        masterPath: '',
        buttonMsgLable: '',
        page_Id: ''
    });
    const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            tableList: state.CredietDebitReducer.CreditList,
            deleteMsg: state.CredietDebitReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            CreditDebitType: state.CredietDebitReducer.CreditDebitType,
            editData: state.CredietDebitReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField, RetailerList, CreditDebitType } = reducers;
    const values = { ...state.values }

    const action = {
        getList: GetCreditList,
        editId: Edit_CreditList_ID,
        deleteId: delete_CreditList_ID,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteCreditlistSuccess
    }

    useEffect(() => {
        dispatch(GetCreditListSuccess([]))
    }, [])

    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let buttonMsgLable = ""
        let newBtnPath = '';

        if (subPageMode === url.CREDIT_LIST) {
            page_Id = pageId.CREDIT_LIST;
            masterPath = url.CREDIT;
            newBtnPath = url.CREDIT;
            buttonMsgLable = "Credit"
        }
        else if (subPageMode === url.DEBIT_LIST) {
            page_Id = pageId.DEBIT_LIST;
            masterPath = url.DEBIT;
            newBtnPath = url.DEBIT;
            buttonMsgLable = "Debit"
        }
        setOtherState({ masterPath, newBtnPath, buttonMsgLable, page_Id })
        setpageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${buttonMsgLable} Count : 0`))
    }, []);


    //   Note Type Api for Type identify
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Company: _cfunc.loginCompanyID(),
            TypeID: 5
        });
        dispatch(CredietDebitType(jsonBody));
    }, []);


    // Retailer DropDown List Type 1 for credit list drop down
    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    const NoteType = []
    CreditDebitType.forEach(index => {
        if (otherState.buttonMsgLable === "Credit") {
            if ((index.Name === "CreditNote") || (index.Name === "Goods CreditNote")) {
                const arr = {
                    value: index.id,
                    label: index.Name,
                }
                NoteType.push(arr)
            }
        }
        else {
            if ((index.Name === "DebitNote") || (index.Name === "Goods DebitNote")) {
                const arr = {
                    value: index.id,
                    label: index.Name,
                }
                NoteType.push(arr)
            }
        }
    })
    NoteType.unshift({ value: "", label: " All" });

    useEffect(() => {
        if (CreditDebitType.length > 0) {
            goButtonHandler(true)
        }
    }, [CreditDebitType]);

    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            CustomerID: values.Customer.value,
            PartyID: _cfunc.loginPartyID(),
            NoteType: values.NoteType.value,
            Note: otherState.buttonMsgLable
        });
        dispatch(GetCreditList(jsonBody, hasPagePath));
    }

    function downBtnFunc(row) {
        var ReportType = report.Credit;
        dispatch(getpdfReportdata(Edit_Credit_List_API, ReportType, { editId: row.id }))
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

    function CustomerOnChange(e) {
        setState((i) => {
            const a = { ...i }
            a.values.Customer = e;
            a.hasValid.Customer.valid = true
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

    const HeaderContent = () => {
        return (
            <div className="px-2 c_card_filter text-black" >
                <div className="row" >
                    <Col sm={2} className="">
                        <FormGroup className=" mb-2 row mt-3 " >
                            <Label className="col-sm-4 p-2"
                                style={{ width: "66px" }}>FromDate</Label>
                            <Col sm={7}>
                                <C_DatePicker
                                    name='FromDate'
                                    value={values.FromDate}
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
                                <C_DatePicker
                                    name="ToDate"
                                    value={values.ToDate}
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
                                    value={values.NoteType}
                                    options={NoteType}
                                    onChange={NoteTypeOnChange}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm={1} className="mt-3 " style={{ paddingLeft: "100px" }}>
                        <Go_Button onClick={goButtonHandler} />
                    </Col>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
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
                            HeaderContent={HeaderContent}
                            goButnFunc={goButtonHandler}
                            downBtnFunc={downBtnFunc}
                            ButtonMsgLable={otherState.buttonMsgLable}
                            deleteName={"FullNoteNumber"}
                            MasterModal={otherState.MasterModal}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default CreditList;