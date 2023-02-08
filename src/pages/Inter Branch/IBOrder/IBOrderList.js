import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import {
    deleteIBOrderId,
    deleteIBOrderIdSuccess,
    editIBOrderId,
    postIBOrderListPage,
    updateIBOrderIdSuccess,
    postDivision,

} from "../../../store/Inter Branch/IBOrderRedux/action";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import { MetaTags } from "react-meta-tags";
import IBOrder from "./IBOrder";
import * as  mode from "../../../routes/PageMode";
import { MakeIBInvoice } from "../../../store/Inter Branch/IB_Invoice_Redux/action";

const IBOrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    // const hasPagePath = history.location.pathname
    // const [pageMode, setpageMode] = useState(url.IB_ORDER_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [iborderdate, setiborderdate] = useState(
        {
            fromdate: currentDate,
            todate: currentDate,
            SupplierSelect: { value: '', label: "All" },
            InOutSelect: {
                value: 1,
                label: 'IN',
            }
        })

    const reducers = useSelector(

        (state) => ({
            Supplier: state.IBOrderReducer.Supplier,
            tableList: state.IBOrderReducer.iborderList,
            deleteMsg: state.IBOrderReducer.deleteMsg,
            updateMsg: state.IBOrderReducer.updateMsg,
            postMsg: state.IBOrderReducer.postMsg,
            editData: state.IBOrderReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            GoButton: state.IBOrderReducer.GoButton,
        })
    );

    const { userAccess, pageField, Supplier, iborderlistFilter } = reducers;
    const { fromdate, todate, SupplierSelect, InOutSelect } = iborderdate;

    const hasPagePath = history.location.pathname;
    const pageMode = (hasPagePath === url.IB_INVOICE_STP) ? mode.mode2save : mode.defaultList;
    const page_Id = (hasPagePath === url.IB_INVOICE_STP) ? pageId.IB_INVOICE_STP : pageId.IB_ORDER_LIST;

    const action = {
        getList: postIBOrderListPage,
        deleteId: deleteIBOrderId,
        postSucc: postMessage,
        updateSucc: updateIBOrderIdSuccess,
        deleteSucc: deleteIBOrderIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"IBOrder Count"} :0`))
        goButtonHandler(true)
    }, []);

    const SupplierDropdown_Options = Supplier.map((i) => ({ label: i.Name, value: i.id }))

    useEffect(() => {

        const jsonBody = JSON.stringify({
            Company: userCompany(),
            Party: userParty()
        });
        dispatch(postDivision(jsonBody));
    }, []);

    SupplierDropdown_Options.unshift({
        value: "",
        label: " All"
    });

    useEffect(() => {

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)

        }
    }, [userAccess])


    function editBodyfunc(rowData) {

        const jsonBody = JSON.stringify({
            Supplier: rowData.SupplierID,
            Customer: rowData.CustomerID,
            EffectiveDate: rowData.IBOrderDate,
            IBOrderID: rowData.id
        })
        var Mode = "edit"
        dispatch(editIBOrderId(jsonBody, Mode));
    }


    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Supplier: SupplierSelect.value,
            Customer: userParty(),
            InOut: InOutSelect.value
        })
        dispatch(postIBOrderListPage(jsonBody))
    };

    function FromdateOnchange(e, date) {
        let newObj = { ...iborderdate }
        newObj.fromdate = date
        // dispatch(iborderlistfilter(newObj))
        setiborderdate(newObj)
    }

    function TodateOnchange(e, date) {
        let newObj = { ...iborderdate }
        newObj.todate = date
        // dispatch(iborderlistfilter(newObj))
        setiborderdate(newObj)
    }

    function SupplierOnchange(e) {
        debugger
        let newObj = { ...iborderdate }
        newObj.SupplierSelect = e
        // dispatch(iborderlistfilter(newObj))
        setiborderdate(newObj)
    }

    function InOutOnchange(e) {
        let newObj = { ...iborderdate }
        newObj.InOutSelect = e
        // dispatch(iborderlistfilter(newObj))
        setiborderdate(newObj)
    }


    const makeBtnFunc = (list = {}) => {
        const obj = { ...list[0] }
        history.push({
            pathname: url.IB_INVOICE,
            editValue: obj,
            pageMode: mode.mode2save
        })
    };

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >

                        <Col sm="3">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-2 p-2"
                                    style={{ width: "110px" }}>From Date </Label>
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
                                        }}
                                        onChange={FromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="3" >
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "110px", marginLeft: "-50px" }}>To Date </Label>
                                <Col sm="6">
                                    <Flatpickr
                                        name="todate"
                                        value={todate}
                                        className="form-control d-block p-2 bg-white text-dark"
                                        placeholder="Select..."
                                        options={{
                                            altInput: true,
                                            altFormat: "d-m-Y",
                                            dateFormat: "Y-m-d",
                                        }}
                                        onChange={TodateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm="3">
                            <FormGroup className="mb-2 row mt-3">
                                <Label className=" p-2 pl-2"
                                    style={{ width: "80px", marginLeft: "-50px" }}>Division</Label>
                                <Col sm="6">
                                    <Select
                                        classNamePrefix="select2-Customer"
                                        value={SupplierSelect}
                                        options={SupplierDropdown_Options}
                                        onChange={SupplierOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        {!(page_Id === pageId.IB_INVOICE_STP) ?
                            <Col sm="3">
                                <FormGroup className="mb-2 row mt-3">
                                    <Label className=" p-2"
                                        style={{ width: "80px", marginLeft: "-100px" }}>In/Out</Label>
                                    <Col sm="6">
                                        <Select
                                            classNamePrefix="select2-Customer"
                                            value={InOutSelect}
                                            options={[{
                                                value: 1,
                                                label: 'IN',
                                            },
                                            {
                                                value: 2,
                                                label: 'Out',
                                            }]}
                                            onChange={InOutOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >
                            : <></>}

                        <Col sm="1"
                            style={{ width: "80px", marginLeft: "-100px" }}>
                            <Button type="button" color="btn btn-outline-success border-2 font-size-12 m-3  "
                                onClick={() => goButtonHandler()}
                            >Go</Button>
                        </Col>
                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            MasterModal={IBOrder}
                            masterPath={url.IB_ORDER}
                            ButtonMsgLable={"IBOrder"}
                            deleteName={"id"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            editBodyfunc={editBodyfunc}
                            filters={iborderlistFilter}
                            makeBtnFunc={makeBtnFunc}
                            makeBtnShow={pageMode === mode.defaultList ? false : true}
                            makeBtnName={"Make IB Invoice"}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default IBOrderList;