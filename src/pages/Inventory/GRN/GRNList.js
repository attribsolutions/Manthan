import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import Select from "react-select";
import CommonPurchaseList from "../../../components/Common/CommonPurchaseList";
import { date_ymd_func, loginSelectedPartyID } from "../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../routes/index"
import * as _act from "../../../store/actions";
import { useHistory } from "react-router-dom";
import { Go_Button, PageLoadingSpinner } from "../../../components/Common/CommonButton";
import GRNAdd from "./GRNAdd";
import { C_DatePicker } from "../../../CustomValidateForm";
import PartyDropdown_Common from "../../../components/Common/PartyDropdown";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

const GRNList = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const currentDate_ymd = date_ymd_func();

    const [subPageMode, setSubPageMode] = useState(history.location.pathname);
    const [pageMode, setPageMode] = useState(mode.defaultList);
    const [otherState, setOtherState] = useState({
        masterPath: '',
        makeBtnShow: false, makeBtnShow: '', makeBtnName: '', IBType: '', orderType: ''
    });
    const [hederFilters, setHederFilters] = useState({ fromdate: currentDate_ymd, todate: currentDate_ymd, venderSelect: { value: '', label: "All" } })

    const reducers = useSelector(
        (state) => ({
            loading: state.GRNReducer.loading,
            listBtnLoading: state.GRNReducer.listBtnLoading,
            customer: state.CommonAPI_Reducer.vendorSupplierCustomer,
            tableList: state.GRNReducer.GRNList,
            deleteMsg: state.GRNReducer.deleteMsg,
            updateMsg: state.GRNReducer.updateMsg,
            postMsg: state.GRNReducer.postMsg,
            editData: state.GRNReducer.editData,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList,
            makeChallan: state.ChallanReducer.makeChallan,

        })
    );

    const gobtnId = `gobtn-${subPageMode}`
    const { pageField, customer, makeChallan } = reducers;
    const { fromdate, todate, venderSelect } = hederFilters;

    const action = {
        editId: _act.editGRNAction,
        deleteId: _act.deleteGRNId,
        postSucc: _act.saveGRNSuccess,
        updateSucc: _act.updateGRNIdSuccess,
        deleteSucc: _act.deleteGRNIdSuccess
    }



    useLayoutEffect(() => {
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
        dispatch(_act.commonPageFieldListSuccess(null))
        dispatch(_act.commonPageFieldList(page_Id))

        if (!(loginSelectedPartyID() === 0)) {
            dispatch(_act.GetVenderSupplierCustomer({ PartyID: loginSelectedPartyID(), subPageMode, RouteID: "" }))
            goButtonHandler()
        }
    }, []);

    useEffect(() => {
        if (makeChallan.Status === true && makeChallan.StatusCode === 200) {
            dispatch(_act.makeChallanActionSuccess({ Status: false }))
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
        dispatch(_act.makeChallanAction({ makeBody, pageMode: mode.modeSTPsave, path: url.CHALLAN_LIST }))
    };

    function goButtonHandler() {
        try {
            if (loginSelectedPartyID() === 0) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                return;
            };
            const filtersBody = JSON.stringify({
                FromDate: fromdate,
                ToDate: todate,
                Supplier: venderSelect === "" ? '' : venderSelect.value,
                Party: loginSelectedPartyID(),
            });
            dispatch(_act.getGRNListPage({ filtersBody }));
        } catch (error) { }
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
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </Col >

                    <Col sm="1" className="mt-3 ">
                        <Go_Button
                            id={gobtnId}
                            loading={reducers.loading}
                            onClick={goButtonHandler}
                        />
                    </Col>
                </div>

            </div>
        </div>
    }

    const partySelectButtonHandler = () => {
        goButtonHandler()
        dispatch(_act.GetVenderSupplierCustomer({ PartyID: loginSelectedPartyID(), subPageMode, RouteID: "" }))
    }

    function partyOnChngeButtonHandler() {
        dispatch(_act.getGRNListPageSuccess([]));
        let newObj = { ...hederFilters }
        newObj.venderSelect = { value: '', label: "All" }
        setHederFilters(newObj)
    }

    return (
        <React.Fragment>
            <PageLoadingSpinner isLoading={reducers.loading || !pageField} />
            <div className="page-content">
                <PartyDropdown_Common
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler} />

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
                            deleteName={"FullGRNNumber"}
                            makeBtnName={otherState.makeBtnName}
                            MasterModal={GRNAdd}
                            totalAmountShow={true}
                        />
                        : null
                }

            </div>
        </React.Fragment>
    )
}

export default GRNList;