import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { BreadcrumbReset, commonPageFieldList, commonPageFieldListSuccess, } from "../../../store/actions";
import { Button, Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";

import Flatpickr from "react-flatpickr";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { GetVender } from "../../../store/CommonAPI/SupplierRedux/actions";
import { loginPartyID } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url"
import * as mode from "../../../routes/PageMode"
import * as pageId from "../../../routes/allPageID"

import { MetaTags } from "react-meta-tags";
import { useHistory } from "react-router-dom";
import { challanlistfilters, deleteChallanId, deleteChallanIdSuccess, challanList_ForListPage, } from "../../../store/Inventory/ChallanRedux/actions";
import { getGRN_itemMode2 } from "../../../store/Inventory/GRNRedux/actions";
import Challan from "./Challan";

const ChallanList = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({ masterPath: '', makeBtnShow: false, newBtnPath: '' });

    const reducers = useSelector(
        (state) => ({
            vender: state.CommonAPI_Reducer.vender,
            tableList: state.ChallanReducer.ChallanList,
            deleteMsg: state.ChallanReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            ChallanlistFilter: state.ChallanReducer.ChallanlistFilter,
            makeGRN: state.GRNReducer.GRNitem,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
        })
    );
    const { userAccess, pageField, vender, ChallanlistFilter, makeGRN } = reducers;
    const { fromdate, todate, venderSelect } = ChallanlistFilter;

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
        
        // const obj = { ...list[0], id: list[0].id }
        // history.push({
        //     pathname: url.GRN_ADD,
        //     pageMode: mode.modeSTPsave
        // })
        const challanNo = list[0].FullChallanNumber
        const grnRef = [{
            Challan: list[0].id,
            Inward: false
        }];

        const jsonBody = JSON.stringify({
            OrderIDs: list[0].id.toString(),
            Mode: 2 // mode when challan to make GRN
        })
        dispatch(getGRN_itemMode2({ jsonBody, pageMode: mode.modeSTPsave, grnRef, path: url.GRN_ADD, challanNo }))
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
        let newObj = { ...ChallanlistFilter }
        newObj.fromdate = date
        dispatch(challanlistfilters(newObj))
    }

    function todateOnchange(e, date) {
        let newObj = { ...ChallanlistFilter }
        newObj.todate = date
        dispatch(challanlistfilters(newObj))
    }

    function venderOnchange(e) {
        let newObj = { ...ChallanlistFilter }
        newObj.venderSelect = e
        dispatch(challanlistfilters(newObj))
    }

    return (

        <React.Fragment>
            <MetaTags> <title>{userAccess.PageHeading}| FoodERP-React FrontEnd</title></MetaTags>
            <div className="page-content">

                <div className="px-2  c_card_filter text-black " >
                    <div className="row">
                        <div className=" row">
                            <Col sm="3" className="">
                                <FormGroup className="mb- row mt-3 " >
                                    <Label className="col-sm-5 p-2"
                                        style={{ width: "83px" }}>From Date</Label>
                                    <Col sm="7">
                                        <Flatpickr
                                            name='fromdate'
                                            className="form-control d-block p-2 bg-white text-dark"
                                            placeholder="Select..."
                                            value={fromdate}
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
                                            nane='todate'
                                            className="form-control d-block p-2 bg-white text-dark"
                                            value={todate}
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
                            // downBtnFunc={downBtnFunc}
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