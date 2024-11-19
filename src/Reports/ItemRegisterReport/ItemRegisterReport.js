import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc, } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { getBaseUnit_ForDropDown, goButtonPartyItemAddPage, getpdfReportdata, getpdfReportdataSuccess, goButtonPartyItemAddPageSuccess } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import * as report from '../ReportIndex'
import { ItemRegister_API } from "../../helpers/backend_helper";
import C_Report from "../../components/Common/C_Report";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";

const ItemRegisterReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        Item: "",
        Unit: { value: 1, label: 'No' },
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
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
    const hasShowModal = props.hasOwnProperty(mode.editValue);

    const { commonPartyDropSelect } = useSelector((state) => state.CommonPartyDropdownReducer);

    // Common Party select Dropdown useEffect
    useEffect(() => {
        if (commonPartyDropSelect.value > 0) {
            partySelectButtonHandler();
        } else {
            partySelectOnChangeHandler();
        }
    }, [commonPartyDropSelect]);

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
        if (!(commonPartyDropSelect.value === 0)) {
            const jsonBody = JSON.stringify({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value });
            dispatch(goButtonPartyItemAddPage({ jsonBody }));
        };

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

        if (commonPartyDropSelect.value === 0) {
            customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
            return;
        };

        const jsonBody = JSON.stringify({
            "FromDate": values.FromDate,
            "ToDate": values.ToDate,
            "Item": values.Item.value,
            "Unit": values.Unit.value,
            "Party": commonPartyDropSelect.value
        });

        let config = {
            ReportType: report.ItemRegister, jsonBody, ItemName: values.Item.label, FromDate: values.FromDate, ToDate: values.ToDate, Unit: values.Unit
        }

        if (values.Item === "") {
            customAlert({
                Type: 3,
                Message: alertMessages.itemNameIsRequired,
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
        const jsonBody = JSON.stringify({ ..._cfunc.loginJsonBody(), "PartyID": commonPartyDropSelect.value });
        dispatch(goButtonPartyItemAddPage({ jsonBody }));
    }

    function partySelectOnChangeHandler() {
        dispatch(getpdfReportdataSuccess({ Status: false }));
        dispatch(goButtonPartyItemAddPageSuccess([]));
        setState((i) => {
            let a = { ...i }
            a.values.Item = ""
            a.hasValid.Item.valid = true;
            return a
        })
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
        
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2  " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="7">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Item</Label>
                                <Col sm="8">
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


                        <Col sm={2} >
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Unit</Label>
                                <Col sm="7">
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



                        <Col sm={1} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                className="btn btn-outline-primary border-1 font-size-12 text-center m-3 mr"
                                onClick={goButtonHandler}
                                loading={reducers.goBtnLoading} >
                                Print</C_Button>
                        </Col>
                    </Row>
                </div>


            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default ItemRegisterReport;