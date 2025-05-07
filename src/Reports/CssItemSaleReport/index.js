

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, GetCustomer, GetVenderSupplierCustomer } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { Cx_DD_Diffrence_Gobtn_Action, Cx_DD_Diffrence_Gobtn_Success } from "../../store/Report/CX_DD_Diffrence_Report/action";
import { Cx_DD_Diffrence_Report_Party_Dropdown_API } from "../../helpers/backend_helper";
import { allLabelWithBlank, allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";
import { Css_Item_Sale_Gobtn_Action } from "../../store/Report/CssItemSaleReport/action";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";

const CssItemSaleReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        division: [allLabelWithBlank],
        customer: [allLabelWithBlank]
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [btnMode, setBtnMode] = useState("");

    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);
    const [partyDropdownOptions, setPartyDropdownOptions] = useState([]);
    const [partyDropdownLoading, setpartyDropdownLoading] = useState(false);



    const reducers = useSelector(
        (state) => ({
            tableData: state.Css_Item_sale_Reducer.Css_Item_Sale_ReportGobtn,
            GoBtnLoading: state.Css_Item_sale_Reducer.goBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect,

            vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,

            customer: state.CommonAPI_Reducer.customer,


        })
    );

    const { userAccess, tableData, GoBtnLoading, pageField, commonPartyDropSelect, vendorSupplierCustomer, customer } = reducers;
    const { Data = [], Type } = tableData

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(GetVenderSupplierCustomer({ subPageMode: url.IB_ORDER, RouteID: "", "PartyID": _cfunc.loginSelectedPartyID() }));
        dispatch(commonPageField(pageId.CSS_ITEM_SALE_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        dispatch(GetCustomer());


        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(Cx_DD_Diffrence_Gobtn_Success([]));
        }
    }, []);



    const [tableColumns] = DynamicColumnHook({ pageField })


    const supplierOptions = vendorSupplierCustomer.map((i) => ({
        value: i.id,
        label: i.Name,
        FSSAIExipry: i.FSSAIExipry,
        GSTIN: i.GSTIN,
        FSSAINo: i.FSSAINo,
        IsTCSParty: i.IsTCSParty,
        ISCustomerPAN: i.PAN,

    }))


    const customerOptions = customer.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

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

        if (Type === "excel") {
            debugger
            ExcelReportComponent({
                pageField,
                excelTableData: Data,
                excelFileName: "CSS Item Sale Report"
            })
        }
    }, [tableData]);



    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        dispatch(Cx_DD_Diffrence_Gobtn_Success([]));
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        dispatch(Cx_DD_Diffrence_Gobtn_Success([]));
    }



    const divisionOnchange = (e) => {

        if (e.length === 0) {
            e = [allLabelWithBlank]
        } else {
            e = e.filter(i => !(i.value === ''))
        }

        setState((i) => {
            const a = { ...i }
            a.values.division = e;
            a.hasValid.division.valid = true
            return a
        })
        dispatch(Cx_DD_Diffrence_Gobtn_Success([]));
    }


    const customerOnchange = (e) => {

        if (e.length === 0) {
            e = [allLabelWithBlank]
        } else {
            e = e.filter(i => !(i.value === ''))
        }

        setState((i) => {
            const a = { ...i }
            a.values.customer = e;
            a.hasValid.customer.valid = true
            return a
        })
        dispatch(Cx_DD_Diffrence_Gobtn_Success([]));
    }

    function goButtonHandler(BtnID) {
        debugger
        try {
            const jsonBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                PartyType: 0,
                Party: _cfunc.loginSelectedPartyID(),
                Employee: _cfunc.loginEmployeeID(),
                CompanyID: _cfunc.loginCompanyID(),
                ItemID: "0",
                CustomerID: values.customer.map(row => row.value).join(','),
                DivisionID: values.division.map(row => row.value).join(',')

            });

            dispatch(Css_Item_Sale_Gobtn_Action({ jsonBody, btnId: BtnID }));
        } catch (error) {
            _cfunc.CommonConsole(error);
        }
    }




    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2   c_card_filter text-black " >
                    <Row>
                        <Col sm={2} className="">
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

                        <Col sm={2} className="">
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
                                    style={{ width: "65px", marginRight: "20px" }}>Division</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="division"
                                        value={values.division}
                                        isSearchable={true}
                                        isMulti={true}
                                        isLoading={partyDropdownLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={supplierOptions}
                                        onChange={(e) => { divisionOnchange(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={3} className="">
                            <FormGroup className=" row mt-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px", marginRight: "20px" }}>Customer</Label>
                                <Col sm="8">
                                    <C_Select
                                        name="customer"
                                        value={values.customer}
                                        isMulti={true}
                                        isSearchable={true}
                                        isLoading={partyDropdownLoading}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={customerOptions}
                                        onChange={(e) => { customerOnchange(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={2} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && btnMode === "show") && true}
                                className="btn btn-success m-3 mr"
                                onClick={() => goButtonHandler("show")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && btnMode === "excel") && true}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("excel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>



                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={Data}
                        columns={tableColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField="id"
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Record Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {globalTableSearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                </div>

            </div>
        </React.Fragment >
    )
}

export default CssItemSaleReport;
