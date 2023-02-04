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
    iborderlistfilter,
    postDivision,
    postGoButtonForIBOrder
} from "../../../store/Inter Branch/IBOrderRedux/action";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { currentDate, excelDownCommonFunc, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { useMemo } from "react";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import { MetaTags } from "react-meta-tags";
import { initialFiledFunc } from "../../../components/Common/ComponentRelatedCommonFile/validationFunction";
import IBOrder from "./IBOrder";



const IBOrderList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname
    const [pageMode, setpageMode] = useState(url.IB_ORDER_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [iborderdate, setiborderdate] = useState(currentDate)

    const reducers = useSelector(

        (state) => ({
            Supplier: state.IBOrderReducer.Supplier,
            tableList: state.IBOrderReducer.iborderList,
            deleteMsg: state.IBOrderReducer.deleteMsg,
            updateMsg: state.IBOrderReducer.updateMsg,
            postMsg: state.IBOrderReducer.postMsg,
            editData: state.IBOrderReducer.editData,
            iborderlistFilter: state.IBOrderReducer.iborderlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            GoButton: state.IBOrderReducer.GoButton,
        })
    );

    const { userAccess, pageField, Supplier, tableList, iborderlistFilter } = reducers;
    const { fromdate, todate, SupplierSelect } = iborderlistFilter;

    const page_Id = (pageId.IB_ORDER_LIST);

    const fileds = {

        FormDate: currentDate,
        ToDate: currentDate,
    }
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const values = { ...state.values }

    const action = {
        getList: postIBOrderListPage,
        deleteId: deleteIBOrderId,
        postSucc: postMessage,
        updateSucc: updateIBOrderIdSuccess,
        deleteSucc: deleteIBOrderIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        setpageMode(hasPagePath)
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


    // useEffect(() => {

    //     const jsonBody = JSON.stringify({
    //         Supplier: SupplierSelect === "" ? '' : SupplierSelect.value,
    //         Customer: userParty(),
    //         EffectiveDate: iborderdate,
    //         IBOrderID: 0,
    //     });
    //     dispatch(postGoButtonForIBOrder(jsonBody));
    // }, []);

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
            Supplier:"",
            Customer: userParty(),
        })

        dispatch(postIBOrderListPage(jsonBody))
    };

    function FromdateOnchange(e, date) {
        let newObj = { ...iborderlistFilter }
        newObj.fromdate = date
        dispatch(iborderlistfilter(newObj))
    }

    function TodateOnchange(e, date) {
        let newObj = { ...iborderlistFilter }
        newObj.todate = date
        dispatch(iborderlistfilter(newObj))
    }

    function SupplierOnchange(e) {
        let newObj = { ...iborderlistFilter }
        newObj.divisionSelect = e
        dispatch(iborderlistfilter(newObj))
    }

    return (
        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm="3" className="">
                            <FormGroup className="mb- row mt-3 " >
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "90px" }}>From Date </Label>
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
                        <Col sm="3" className="">
                            <FormGroup className="mb- row mt-3 ">
                                <Label className="col-sm-5 p-2"
                                    style={{ width: "70px" }}>To Date </Label>
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

                        <Col sm="4">
                            <FormGroup className="mb-2 row mt-3">
                                <Label className="col-md-4 p-2"

                                    style={{ width: "80px" }}>Division</Label>
                                <Col sm="6">
                                    <Select
                                        classNamePrefix="select2-Customer"
                                        value={values.SupplierName}
                                        options={SupplierDropdown_Options}
                                        onChange={SupplierOnchange}
                                    />

                                </Col>
                            </FormGroup>
                        </Col >

                        <Col sm="1" className="mx-4 ">
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
                            deleteName={"FullIBOrderNumber"}
                            pageMode={pageMode}
                            makeBtnShow={pageMode === url.IB_ORDER_LIST ? false : true}
                            goButnFunc={goButtonHandler}
                            editBodyfunc={editBodyfunc}
                            filters={iborderlistFilter}
                        />
                        : null
                }
            </div>


        </React.Fragment>
    )
}

export default IBOrderList;