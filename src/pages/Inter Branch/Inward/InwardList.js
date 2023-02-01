import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr";
import { Button, Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import {
    BOMlistfilters,
    deleteBOMId,
    deleteBOMIdSuccess,
    editBOMList,
    getBOMListPage,
    updateBOMListSuccess
} from "../../../store/Purchase/BOMRedux/action";
import * as url from "../../../routes/route_url";
import { MetaTags } from "react-meta-tags";
import Inward from "./Inward";
import PurchaseListPage from "../../../components/Common/ComponentRelatedCommonFile/purchase";
import * as pageId from "../../../routes/allPageID"
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { deleteInwardId, deleteInwardIdSuccess, getInwardListPage, Inwardlistfilters } from "../../../store/Inter Branch/InwardRedux/action";
import { currentDate, userCompany, userParty } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { getSupplier } from "../../../store/CommonAPI/SupplierRedux/actions";
import Select from "react-select";
import { Go_Button } from "../../../components/Common/ComponentRelatedCommonFile/CommonButton";

const InwardList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const hasPagePath = history.location.pathname

    const [pageMode, setpageMode] = useState(url.INWARD_LIST)
    const [userAccState, setUserAccState] = useState('');
    const [inwardlistFilter, setInwardlistFilter] = useState({ todate: currentDate, fromdate: currentDate, SupplierSelect: { value: '', label: "All" } });

    const reducers = useSelector(
        (state) => ({
            tableList: state.InwardReducer.InwardList,
            deleteMsg: state.InwardReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            InwardlistFilter: state.InwardReducer.InwardlistFilter,
            supplier: state.SupplierReducer.supplier,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField, InwardlistFilter, supplier } = reducers;
    const { fromdate, todate, SupplierSelect } = InwardlistFilter;
    const page_Id = pageId.INWARD_LIST

    const action = {
        getList: getInwardListPage,
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
        dispatch(BreadcrumbShowCountlabel(`${"Inward Count"} :0`))
        dispatch(getSupplier())
        goButtonHandler(true)

    }, []);

    const SupplierOptions = supplier.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    SupplierOptions.unshift({
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

    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Customer: userParty(),
            Supplier: SupplierSelect.value,
        });
        dispatch(getInwardListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...InwardlistFilter }
        newObj.fromdate = date
        dispatch(Inwardlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...InwardlistFilter }
        newObj.todate = date
        dispatch(Inwardlistfilters(newObj))
    }

    function SupplierOnchange(e) {
        let newObj = { ...inwardlistFilter }
        newObj.SupplierSelect = e
        setInwardlistFilter(newObj)
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

                                        style={{ width: "115px" }}>Supplier</Label>
                                    <Col sm="5">

                                        <Select
                                            classNamePrefix="select2-Customer"
                                            value={SupplierSelect}
                                            options={SupplierOptions}
                                            onChange={SupplierOnchange}
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
                            MasterModal={Inward}
                            masterPath={url.INWARD}
                            ButtonMsgLable={"Inward"}
                            deleteName={"IBInwardNumber"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            filters={inwardlistFilter}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default InwardList;