import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { GetVenderSupplierCustomer, GetVenderSupplierCustomerSuccess, getBaseUnit_ForDropDown, getpartyItemList, getpdfReportdata, getpdfReportdataSuccess } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { ItemRegister_API, PartyLedgerReport_API } from "../../helpers/backend_helper";
import C_Report from "../../components/Common/C_Report";
import PartyDropdown_Common from "../../components/Common/PartyDropdown";

const ItemRegisterReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Item: "",
        Unit: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [subPageMode] = useState(history.location.pathname);
    const [userPageAccessState, setUserAccState] = useState('');

    const reducers = useSelector(
        (state) => ({
            pdfdata: state.PdfReportReducers.pdfdata,
            ItemList: state.PartyItemsReducer.partyItem,
            BaseUnit: state.ItemMastersReducer.BaseUnit,
            goBtnLoading: state.PdfReportReducers.goBtnLoading,
            supplier: state.CommonAPI_Reducer.vendorSupplierCustomer,
            userAccess: state.Login.RoleAccessUpdateData,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            CustomerLoading: state.CommonAPI_Reducer.vendorSupplierCustomerLoading,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { userAccess, pdfdata, CustomerLoading, ItemList, BaseUnit } = reducers;

    const values = { ...state.values }

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;
        if (hasShowModal) {
            locationPath = props.masterPath;
        };
        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })
        if (userAcc) {
            setUserAccState(userAcc)
            _cfunc.breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])

    useEffect(() => {
        dispatch(getBaseUnit_ForDropDown());
        const jsonBody = JSON.stringify({ ..._cfunc.loginJsonBody() });
        dispatch(getpartyItemList(jsonBody));
    }, [])

    useEffect(() => {
        if ((pdfdata.Status === true) && (pdfdata.StatusCode === 204)) {
            dispatch(getpdfReportdataSuccess({ Status: false }))
            customAlert({
                Type: 3,
                Message: pdfdata.Message,
            })
            return
        }
    }, [pdfdata])

    const ItemOptions = ItemList.map((i) => ({
        value: i.Item,
        label: i.ItemName,
    }))

    const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
        .map(data => ({
            value: data.id,
            label: data.Name
        }));
    const onselecthandel = (e) => {
        setState((i) => {
            const a = { ...i }
            a.values.Item = e;
            a.hasValid.Item.valid = true
            return a
        })
    }

    const onUnitselecthandel = (e) => {
        setState((i) => {
            const a = { ...i }
            a.values.Unit = e;
            a.hasValid.Unit.valid = true
            return a
        })
    }

    function goButtonHandler() {

        if (_cfunc.loginSelectedPartyID() === 0) {
            customAlert({ Type: 3, Message: "Please Select Party" });
            return;
        };

        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Item": values.Item.value,
            "Unit": values.Unit.value,
            "Party": _cfunc.loginSelectedPartyID()
        });

        let config = {
            ReportType: report.ItemRegister, jsonBody, ItemName: values.Item.label, FromDate: values.FromDate, ToDate: values.ToDate, Unit: values.Unit
        }

        if (values.Item === "") {
            customAlert({
                Type: 3,
                Message: "Please Select Item",
            })
            return
        } else if (values.Unit === "") {
            customAlert({
                Type: 3,
                Message: "Please Select Unit",
            })
            return
        } else {
            dispatch(getpdfReportdata(ItemRegister_API, config))
        }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
    }

    function partySelectButtonHandler() {
        dispatch(GetVenderSupplierCustomer({ subPageMode, "PartyID": _cfunc.loginSelectedPartyID() }));
    }

    function partyOnChngeButtonHandler() {
        dispatch(getpdfReportdataSuccess({ Status: false }));
        dispatch(GetVenderSupplierCustomerSuccess([]));
        setState((i) => {
            let a = { ...i }
            a.values.Item = { value: "", label: "All" }
            a.hasValid.Item.valid = true;
            return a
        })
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <PartyDropdown_Common
                    goButtonHandler={partySelectButtonHandler}
                    changeButtonHandler={partyOnChngeButtonHandler} />

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col lg={0} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "70px" }}>FromDate</Label>
                                <Col sm={6}>
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col lg={0} className="">
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "55px" }}>ToDate</Label>
                                <Col sm={6}>
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "70px" }}>Item</Label>
                                <Col sm={7}>
                                    <C_Select
                                        name="Item"
                                        value={values.Item}
                                        isSearchable={true}
                                        isLoading={CustomerLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={ItemOptions}
                                        onChange={(e) => { onselecthandel(e) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "70px" }}>Unit</Label>
                                <Col sm={6}>
                                    <C_Select
                                        name="Unit"
                                        value={values.Unit}
                                        isSearchable={true}
                                        isLoading={CustomerLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={BaseUnit_DropdownOptions}
                                        onChange={(e) => { onUnitselecthandel(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={1} className="mt-3 ">
                            <C_Button
                                type="button"
                                className="btn btn-outline-primary border-1 font-size-12 text-center"
                                onClick={goButtonHandler}
                                loading={reducers.goBtnLoading} >
                                Print</C_Button>
                        </Col>
                    </div>
                </div>
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default ItemRegisterReport;