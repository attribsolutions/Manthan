import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode"
import Inward from "./Inward";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { BreadcrumbShowCountlabel, commonPageFieldList, commonPageFieldListSuccess } from "../../../store/actions";
import { deleteInwardId, deleteInwardIdSuccess, getInwardListPage } from "../../../store/Inter Branch/InwardRedux/action";
import { currentDate_ymd, loginPartyID } from "../../../components/Common/CommonFunction";
import {  GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { Go_Button } from "../../../components/Common/CommonButton";
import { C_DatePicker } from "../../../CustomValidateForm";

const InwardList = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const subPageMode = history.location.pathname

    const [pageMode, setpageMode] = useState(mode.defaultList)
    const [inwardlistFiltersState, setInwardlistFilter] = useState({ todate: currentDate_ymd, fromdate: currentDate_ymd, SupplierSelect: { value: '', label: "All" } });

    const reducers = useSelector(
        (state) => ({
            tableList: state.InwardReducer.InwardList,
            deleteMsg: state.InwardReducer.deleteMsg,
            updateMsg: state.BOMReducer.updateMsg,
            postMsg: state.OrderReducer.postMsg,
            editData: state.BOMReducer.editData,
            // InwardlistFilter: state.InwardReducer.InwardlistFilter,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );

    const { userAccess, pageField,  supplier } = reducers;
    const { fromdate, todate, SupplierSelect } = inwardlistFiltersState;
    const page_Id = pageId.INWARD_LIST

    const action = {
        getList: getInwardListPage,
        editId: () => { },
        deleteId: deleteInwardId,
        postSucc: postMessage,
        updateSucc: () => { },
        deleteSucc: deleteInwardIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        // dispatch(BreadcrumbShowCountlabel(`${"Inward Count"} :0`))
        dispatch(GetVenderSupplierCustomer({ subPageMode, RouteID: "" }))
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


    const goButtonHandler = () => {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Customer: loginPartyID(),
            Supplier: SupplierSelect.value,
        });
        dispatch(getInwardListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...inwardlistFiltersState }
        newObj.fromdate = date
        setInwardlistFilter(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...inwardlistFiltersState }
        newObj.todate = date
        setInwardlistFilter(newObj)
    }

    function SupplierOnchange(e) {
        let newObj = { ...inwardlistFiltersState }
        newObj.SupplierSelect = e
        setInwardlistFilter({ ...newObj })
    }
    return (
        <React.Fragment>

            <div className="page-content">

                <div className="px-2 c_card_header text-black" >
                    <div className="px-2   c_card_filter text-black" >
                        <div className="row" >
                            <Col sm="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>From Date</Label>
                                    <Col sm="7">
                                        <C_DatePicker
                                            name='fromdate'
                                            value={fromdate}
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
                                        <C_DatePicker
                                            name="todate"
                                            value={todate}
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
                        <CommonPurchaseList
                            action={action}
                            reducers={reducers}
                            showBreadcrumb={false}
                            masterPath={Inward}
                            newBtnPath={url.IB_INWARD_STP}
                            makeBtnShow={false}
                            ButtonMsgLable={"Inward"}
                            deleteName={"IBInwardNumber"}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            filters={inwardlistFiltersState}
                        />
                        : null
                }
            </div>
        </React.Fragment>
    )
}

export default InwardList;