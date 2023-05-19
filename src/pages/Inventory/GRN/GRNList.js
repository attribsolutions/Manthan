import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import {
    deleteGRNId,
    deleteGRNIdSuccess,
    editGRNAction, getGRNListPage,
    grnlistfilters,
    updateGRNIdSuccess
} from "../../../store/Inventory/GRNRedux/actions";
import { GetVenderSupplierCustomer } from "../../../store/CommonAPI/SupplierRedux/actions";
import { btnIsDissablefunc, loginPartyID } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url"
import * as mode from "../../../routes/PageMode"
import * as pageId from "../../../routes/allPageID"
import { useHistory } from "react-router-dom";
import { makeChallanAction, makeChallanActionSuccess } from "../../../store/Inventory/ChallanRedux/actions";
import { Go_Button } from "../../../components/Common/CommonButton";
import GRNAdd from "./GRNAdd";
import { C_DatePicker } from "../../../CustomValidateForm";

const GRNList = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false, makeBtnShow: '', makeBtnName: '', IBType: '', orderType: ''
    });

    const reducers = useSelector(
        (state) => ({
            customer: state.CommonAPI_Reducer.vendorSupplierCustomer,
            tableList: state.GRNReducer.GRNList,
            deleteMsg: state.GRNReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            grnlistFilter: state.GRNReducer.grnlistFilter,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            makeChallan: state.ChallanReducer.makeChallan,

        })
    );
    const gobtnId = `gobtn-${subPageMode}`
    const { userAccess, pageField, customer, makeChallan, grnlistFilter } = reducers;
    const { fromdate, todate, venderSelect } = grnlistFilter;

    const action = {
        getList: getGRNListPage,
        editId: editGRNAction,
        deleteId: deleteGRNId,
        postSucc: postMessage,
        updateSucc: updateGRNIdSuccess,
        deleteSucc: deleteGRNIdSuccess
    }


    // Featch Modules List data  First Rendering
    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false
        let newBtnPath = ''
        if (subPageMode === url.GRN_LIST_1) {
            page_Id = pageId.GRN_LIST_1;
            masterPath = url.GRN_ADD_1;
            newBtnPath = url.GRN_STP_1;
            page_Mode = mode.modeSTPList
            makeBtnShow = false;
        }
        else if (subPageMode === url.GRN_LIST_3) {
            page_Id = pageId.GRN_LIST_3;
            masterPath = url.GRN_ADD_3;
            newBtnPath = url.GRN_STP_3;
            page_Mode = mode.modeSTPList
            makeBtnShow = false;
        }
        setSubPageMode(subPageMode)
        setOtherState({ masterPath, makeBtnShow, newBtnPath })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(GetVenderSupplierCustomer(subPageMode))
        goButtonHandler()
    }, []);

    useEffect(() => {
        if (makeChallan.Status === true && makeChallan.StatusCode === 200) {
            dispatch(makeChallanActionSuccess({ Status: false }))
            history.push({
                pathname: makeChallan.path,
                page_Mode: makeChallan.page_Mode,
            })
        }

    }, [makeChallan])

    const venderOptions = customer.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    venderOptions.unshift({
        value: "",
        label: " All"
    });


    const makeBtnFunc = (list = []) => {

        const id = list[0].id
        const makeBody = JSON.stringify({
            GRN: id,
        });
        dispatch(makeChallanAction({ makeBody, pageMode: mode.modeSTPsave, path: url.CHALLAN_LIST }))
    };

    function goButtonHandler() {
        const btnId = gobtnId;
        btnIsDissablefunc({ btnId, state: true })
        try {
            const filtersBody = JSON.stringify({
                FromDate: fromdate,
                ToDate: todate,
                Supplier: venderSelect === "" ? '' : venderSelect.value,
                Party: loginPartyID(),
                // OrderType: (subPageMode === url.GRN_LIST_1) ? order_Type.PurchaseOrder : order_Type.SaleOrder
            });
            dispatch(getGRNListPage({ filtersBody, btnId }));
        } catch (error) { }
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...grnlistFilter }
        newObj.fromdate = date
        dispatch(grnlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...grnlistFilter }
        newObj.todate = date
        dispatch(grnlistfilters(newObj))
    }

    function venderOnchange(e) {
        let newObj = { ...grnlistFilter }
        newObj.venderSelect = e
        dispatch(grnlistfilters(newObj))
    }

    const HeaderContent = () => {
        return <div className="px-2  c_card_filter text-black " >
            <div className="row">
                <div className=" row">
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
                                    nane='todate'
                                    value={todate}
                                    onChange={todateOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm="5">
                        <FormGroup className="mb-2 row mt-3 " >
                            <Label className="col-md-4 p-2"
                                style={{ width: "115px" }}>Supplier Name</Label>
                            <Col md="5">
                                <Select
                                    value={venderSelect}
                                    classNamePrefix="select2-Customer"
                                    options={venderOptions}
                                    onChange={venderOnchange}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button
                            id={gobtnId}
                            onClick={goButtonHandler}
                        />
                    </Col>
                </div>

            </div>
        </div>
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
                            goButnFunc={goButtonHandler}
                            HeaderContent={HeaderContent}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"GRN"}
                            // makeBtnName={"Make Challan"}
                            deleteName={"FullGRNNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={GRNAdd}
                        />
                        : null
                }

            </div>
        </React.Fragment>
    )
}

export default GRNList;