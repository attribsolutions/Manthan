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
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate, excelDownCommonFunc, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import { useMemo } from "react";
import Receipts from "./Receipts";
import {
    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    updateBOMListSuccess
} from "../../../store/Production/BOMRedux/action";
import * as pageId from "../../../routes//allPageID";
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import { RECEIPTS_LIST } from "../../../routes/route_url";
import {
    postReceiptListPage,
    ReceiptGoButtonMaster, Receiptlistfilters
} from "../../../store/Accounting/Receipt/action";
import { initialFiledFunc, onChangeSelect } from "../../../components/Common/validationFunction";
import { Retailer_List } from "../../../store/CommonAPI/SupplierRedux/actions";

const ReceiptList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const fileds = {
        FromDate: currentDate,
        ToDate: currentDate,
        CustomerName: { value: "", label: "All" }
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(RECEIPTS_LIST)
    const [userAccState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            tableList: state.ReceiptReducer.ReceiptList,
            deleteMsg: state.BOMReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            RetailerList: state.CommonAPI_Reducer.RetailerList,
            editData: state.BOMReducer.editData,
            ReceiptFilters: state.ReceiptReducer.ReceiptFilters,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField, tableList, ReceiptFilters, RetailerList } = reducers;
    const { fromdate, todate } = ReceiptFilters;

    const action = {
        getList: postReceiptListPage,
        editId: editBOMList,
        deleteId: deleteBOMId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteBOMIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        const page_Id = pageId.RECEIPTS_LIST
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Receipt Count"} :0`))
        goButtonHandler(true)

    }, []);

    const downList = useMemo(() => {
        let PageFieldMaster = []
        if (pageField) { PageFieldMaster = pageField.PageFieldMaster; }
        return excelDownCommonFunc({ tableList, PageFieldMaster })
    }, [tableList])

    const values = { ...state.values }
    const { isError } = state;
    const { fieldLabel } = state;

    useEffect(() => {
        const pageId = 174
        let userAcc = userAccess.find((inx) => {
            return (inx.id === pageId)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)
        }
    }, [userAccess])

    const customerOptions = RetailerList.map((index) => ({
        value: index.id,
        label: index.Name,
    }));

    useEffect(() => {
        const jsonBody = JSON.stringify({
            Type: 4,
            PartyID: loginPartyID(),
            CompanyID: loginCompanyID()
        });
        dispatch(Retailer_List(jsonBody));
    }, []);

    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            CompanyID: loginCompanyID(),
            PartyID: loginPartyID(),
        });
        dispatch(postReceiptListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...ReceiptFilters }
        newObj.fromdate = date
        dispatch(Receiptlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...ReceiptFilters }
        newObj.todate = date
        dispatch(Receiptlistfilters(newObj))
    }

    function CustomerOnChange(e) {
        const jsonBody = JSON.stringify({
            Party: loginPartyID(),
            Customer: e.value
        });
        dispatch(ReceiptGoButtonMaster(jsonBody));
    }


    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">

                <div className="px-2   c_card_header text-black" >
                    <div className="row">
                        <Col sm="5">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "83px" }}>From Date</Label>
                                <Col sm="6">
                                    <Flatpickr
                                        name='fromdate'
                                        value={fromdate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="5" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "65px", marginRight: "0.4cm" }}>To Date</Label>
                                <Col sm="6 ">
                                    <Flatpickr
                                        name="todate"
                                        value={todate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                            defaultDate: "today"
                                        }}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="5">
                            <FormGroup className="mb-2 row mt-3 " >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "90px", marginRight: "0.4cm" }}>CustomerName </Label>
                                <Col sm="6">
                                    <Select
                                        name="CustomerName"
                                        value={values.CustomerName}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        options={customerOptions}
                                        onChange={(hasSelect, evn) => {
                                            onChangeSelect({ hasSelect, evn, state, setState });
                                            CustomerOnChange(hasSelect)
                                        }
                                        }
                                    />
                                    {isError.CustomerName.length > 0 && (
                                        <span className="invalid-feedback">{isError.CustomerName}</span>
                                    )}
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="2" className="mx-4 ">
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 m-3  "
                                onClick={() => goButtonHandler()}
                            >Go</Button>
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={Receipts}
                            masterPath={url.RECEIPTS}
                            newBtnPath={url.RECEIPTS}
                            ButtonMsgLable={"Receipt"}
                            deleteName={"Receipt"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default ReceiptList;