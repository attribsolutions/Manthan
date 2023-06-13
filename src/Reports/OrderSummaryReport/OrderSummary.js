import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../store/actions";
import Select from "react-select";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { Retailer_List } from "../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button } from "../../components/Common/CommonButton";
import { delete_SalesReturn_Id, delete_SalesReturn_Id_Succcess, salesReturnListAPI } from "../../store/Sales/SalesReturnRedux/action";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { url, mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";

const OrderSummary = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Customer: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [userPageAccessState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            loading: state.SalesReturnReducer.loading,
            tableList: state.SalesReturnReducer.salesReturnList,
            deleteMsg: state.SalesReturnReducer.deleteMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField, RetailerList, } = reducers;
    const values = { ...state.values }

    const action = {
        getList: salesReturnListAPI,
        deleteId: delete_SalesReturn_Id,
        postSucc: postMessage,
        deleteSucc: delete_SalesReturn_Id_Succcess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.SALES_RETURN_LIST
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Sales Return Count"} :0`))
        goButtonHandler(true)
    }, []);

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: _cfunc.loginPartyID(),
            CompanyID: _cfunc.loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
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

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    customerOptions.unshift({
        value: "",
        label: " All"
    });

    // useEffect(() => {

    //     if (ProductMarginData.length > 1) {

    //         let newArray = []
    //         ProductMarginData.forEach(i => {
    //             let obj = i
    //             i.ItemMargins.forEach(ele => {
    //                 const keys = Object.keys(ele);
    //                 keys.forEach(key => {
    //                     obj[key] = ele[key]
    //                 })
    //             })
    //             delete obj.ItemMargins
    //             newArray.push(obj)
    //         })

    //         const worksheet = XLSX.utils.json_to_sheet(newArray);
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, "ProductMargin1");
    //         XLSX.writeFile(workbook, "Product Margin Report.xlsx");

    //         dispatch(getExcel_Button_API_Success([]));
    //     }
    // }, [ProductMarginData]);

    // function excelhandler(event) {
    //     debugger
    //     event.preventDefault();
    //     const userDetails = loginUserDetails()
    //     const btnId = "excelbtn-id"
    //     const ProductMargin = []
    //     dispatch(getExcel_Button_API())
    // }

    function goButtonHandler() {

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            CustomerID: values.Customer.value,
            PartyID: _cfunc.loginPartyID(),
        });
        dispatch(salesReturnListAPI(jsonBody));

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


    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
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
                                    <Select
                                        name="Customer"
                                        classNamePrefix="select2-Customer"
                                        value={values.Customer}
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
            </div>
        </React.Fragment>
    )
}

export default OrderSummary;