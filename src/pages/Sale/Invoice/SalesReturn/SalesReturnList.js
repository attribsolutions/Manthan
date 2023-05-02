import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import {
    BreadcrumbShowCountlabel,
    commonPageFieldList,
    commonPageFieldListSuccess
} from "../../../../store/actions";
import Select from "react-select";
import CommonPurchaseList from "../../../../components/Common/CommonPurchaseList"
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate, loginCompanyID, loginPartyID } from "../../../../components/Common/CommonFunction";
import { editBOMList, updateBOMListSuccess } from "../../../../store/Production/BOMRedux/action";
import * as pageId from "../../../../routes//allPageID";
import * as url from "../../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import { initialFiledFunc } from "../../../../components/Common/validationFunction";
import { GetVender, Retailer_List } from "../../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button } from "../../../../components/Common/CommonButton";
import * as mode from "../../../../routes/PageMode"
import SalesReturn from "./SalesReturn";
import { delete_SalesReturn_Id, delete_SalesReturn_Id_Succcess, salesReturnListAPI } from "../../../../store/Sales/SalesReturnRedux/action";

const SalesReturnList = () => {

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
            tableList: state.SalesReturnReducer.salesReturnList,
            deleteMsg: state.SalesReturnReducer.deleteMsg,
            // updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            ReceiptType: state.ReceiptReducer.ReceiptType,
            // editData: state.BOMReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField, RetailerList, } = reducers;
    const values = { ...state.values }

    const action = {
        getList: salesReturnListAPI,
        // editId: editBOMList,
        deleteId: delete_SalesReturn_Id,
        postSucc: postMessage,
        // updateSucc: updateBOMListSuccess,
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

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 1,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    useEffect(() => {
        const page_Id = pageId.SALES_RETURN_LIST
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

        const jsonBody = JSON.stringify({
            FromDate: values.FromDate,
            ToDate: values.ToDate,
            CustomerID: values.Customer.value,
            PartyID: loginPartyID(),
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
                            MasterModal={SalesReturn}
                            masterPath={url.SALES_RETURN}
                            newBtnPath={url.SALES_RETURN}
                            pageMode={pageMode}
                            HeaderContent={HeaderContent}
                            goButnFunc={goButtonHandler}
                            ButtonMsgLable={"SalesReturn"}
                            deleteName={"FullReturnNumber"}

                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default SalesReturnList;