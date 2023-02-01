import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import {
    editBOMList,
    updateBOMListSuccess
} from "../../../store/Purchase/BOMRedux/action";
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import * as pageId from "../../../routes/allPageID"
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { deleteInwardId, deleteInwardIdSuccess } from "../../../store/Inter Branch/InwardRedux/action";
import { currentDate, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import Select from "react-select";
import { Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";
import { Challanlistfilters, getChallanListPage, InwardButtonId } from "../../../store/Inter Branch/ChallanRedux/action";
import { GetCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";

const ChallanList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(url.CHALLAN_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [challanlistFilter, setChallanlistFilter] = useState({ todate: currentDate, fromdate: currentDate, });

    const reducers = useSelector(
        (state) => ({
            tableList: state.ChallanReducer.ChallanList,
            deleteMsg: state.InwardReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            ChallanlistFilter: state.ChallanReducer.ChallanlistFilter,
            customer: state.SupplierReducer.customer,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,

        })
    );
    const { userAccess, pageField, ChallanlistFilter, customer, } = reducers;
    const { fromdate, todate, CustomerSelect } = ChallanlistFilter;

    const page_Id = pageId.CHALLAN_LIST

    const action = {
        getList: getChallanListPage,
        editId: editBOMList,
        deleteId: deleteInwardId,
        postSucc: postMessage,
        updateSucc: updateBOMListSuccess,
        deleteSucc: deleteInwardIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        setpageMode(hasPagePath)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(BreadcrumbShowCountlabel(`${"Challan Count"} :0`))
        dispatch(GetCustomer())
        goButtonHandler(true)

    }, []);

    const CustomerOptions = customer.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    // CustomerOptions.unshift({
    //     value: "",
    //     label: " All"
    // });

    useEffect(() => {

        let userAcc = userAccess.find((inx) => {
            return (inx.id === page_Id)
        })
        if (!(userAcc === undefined)) {
            setUserAccState(userAcc)

        }
    }, [userAccess])

    const goButtonHandler = () => {

        const jsonBody = JSON.stringify({
            FromDate: "2023-01-06",
            ToDate: "2023-01-24",
            Party: 5,
            Customer: 4,
        });
        dispatch(getChallanListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...challanlistFilter }
        newObj.fromdate = date
        // dispatch(Challanlistfilters(newObj))
        setChallanlistFilter(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...challanlistFilter }
        newObj.todate = date
        // dispatch(Challanlistfilters(newObj))
        setChallanlistFilter(newObj)
    }

    function CustomerOnchange(e) {
        let newObj = { ...challanlistFilter }
        newObj.CustomerSelect = e
        setChallanlistFilter(newObj)
    }

    const InwardMakeBtnFunc = (list = []) => {
        debugger
        dispatch(InwardButtonId(list[0].id))
        history.push({
            pathname: url.INWARD,
            pageMode: "save",
            // editValue: InwardData
        })
    }

    return (

        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>

            <div className="page-content">

                <div className="px-2 c_card_header text-black" >
                    <div className="px-2   c_card_filter text-black" >
                        <div className="row" >
                            <Col sm="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>From Date</Label>
                                    <Col sm="7">
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
                                            onChange={fromdateOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col sm="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "65px" }}>To Date</Label>
                                    <Col sm="7">
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
                                            classNamePrefix="select2-Customer"
                                            value={CustomerSelect}
                                            options={CustomerOptions}
                                            onChange={CustomerOnchange}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >

                            <Col sm="1" className="mt-3 ">
                                <Go_Button onClick={goButtonHandler} />
                            </Col>
                        </div>
                    </div>
                </div>
                {
                    (pageField) ?
                        <PurchaseListPage
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            // MasterModal={Challan}
                            // masterPath={url.CHALLAN}
                            ButtonMsgLable={"Challan"}
                            deleteName={"FullIBChallanNumber"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            filters={challanlistFilter}
                            InwardMakeBtnFunc={InwardMakeBtnFunc}
                            InwardMakeBtnShow={pageMode === url.CHALLAN_LIST ? true : false}
                            InwardMakeBtnName={"Make Inward"}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default ChallanList;