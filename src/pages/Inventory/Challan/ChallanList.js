import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BreadcrumbReset, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { GetVender } from "../../../store/CommonAPI/SupplierRedux/actions";
import { date_ymd_func, loginPartyID } from "../../../components/Common/CommonFunction";
import { useHistory } from "react-router-dom";
import {  deleteChallanId, deleteChallanIdSuccess, challanList_ForListPage, } from "../../../store/Inventory/ChallanRedux/actions";
import { makeGRN_Mode_1Action } from "../../../store/Inventory/GRNRedux/actions";
import Challan from "./Challan";
import { C_DatePicker } from "../../../CustomValidateForm";
import { url, mode, pageId } from "../../../routes/index"

const ChallanList = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();

    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '' });
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, venderSelect: { value: '', label: "All" } })
    const reducers = useSelector(
        (state) => ({
            vender: state.CommonAPI_Reducer.vender,
            tableList: state.ChallanReducer.ChallanList,
            deleteMsg: state.ChallanReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            makeGRN: state.GRNReducer.GRNitem,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
    const { userAccess, pageField, vender, makeGRN } = reducers;
    const { fromdate, todate, venderSelect } = hederFilters;

    const action = {
        deleteId: deleteChallanId,
        deleteSucc: deleteChallanIdSuccess
    }

    // Featch Modules List data  First Rendering
    useEffect(() => {
        let page_Id = '';
        let page_Mode = mode.defaultList;
        let masterPath = '';
        let makeBtnShow = false
        let newBtnPath = ''


        if (subPageMode === url.CHALLAN_LIST) {
            page_Id = pageId.CHALLAN_LIST;
            masterPath = url.CHALLAN;
            newBtnPath = url.CHALLAN;
            page_Mode = mode.modeSTPList
            makeBtnShow = true;
        }
        setOtherState({ masterPath, makeBtnShow, newBtnPath })
        setPageMode(page_Mode)
        dispatch(commonPageFieldListSuccess(null))
        dispatch(commonPageFieldList(page_Id))
        dispatch(GetVender())
        goButtonHandler()
        dispatch(BreadcrumbReset())
    }, []);

    useEffect(() => {
        if (makeGRN.Status === true && makeGRN.StatusCode === 200) {
            history.push({
                pathname: makeGRN.path,
                page_Mode: makeGRN.page_Mode,
            })
        }
    }, [makeGRN])

    const venderOptions = vender.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    venderOptions.unshift({
        value: "",
        label: " All"
    });

    const makeBtnFunc = (list = []) => {

        const challanNo = list[0].FullChallanNumber
        const grnRef = [{
            Challan: list[0].id,
            Inward: false
        }];

        const jsonBody = JSON.stringify({
            OrderIDs: list[0].id.toString(),
            Mode: 2 // mode when challan to make GRN
        })
        dispatch(makeGRN_Mode_1Action({ jsonBody, pageMode: mode.modeSTPsave, grnRef, path: url.GRN_ADD_1, challanNo }))
    };

    function goButtonHandler() {
        const jsonBody = JSON.stringify({
            FromDate: fromdate,
            ToDate: todate,
            Party: loginPartyID(),
            Customer: venderSelect === "" ? '' : venderSelect.value,
        });
        dispatch(challanList_ForListPage(jsonBody));
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.fromdate = date
        setHederFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...hederFilters }
        newObj.todate = date
        setHederFilters(newObj)
    }

    function venderOnchange(e) {
        let newObj = { ...hederFilters }
        newObj.venderSelect = e
        setHederFilters(newObj)
    }

    return (

        <React.Fragment>
            <div className="page-content">

                <div className="px-2  c_card_filter text-black " >
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
                                        style={{ width: "115px" }}>Customer</Label>
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
                                <Button type="button" color="btn btn-outline-success border-2 font-size-12 "
                                    onClick={() => goButtonHandler()}
                                >Go</Button>
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
                            masterPath={otherState.masterPath}
                            newBtnPath={otherState.newBtnPath}
                            makeBtnShow={otherState.makeBtnShow}
                            pageMode={pageMode}
                            goButnFunc={goButtonHandler}
                            makeBtnFunc={makeBtnFunc}
                            ButtonMsgLable={"challan"}
                            makeBtnName={"Make GRN"}
                            deleteName={"FullGRNNumber"}
                            MasterModal={Challan}
                        />
                        : null
                }

            </div>
        </React.Fragment>
    )
}

export default ChallanList;