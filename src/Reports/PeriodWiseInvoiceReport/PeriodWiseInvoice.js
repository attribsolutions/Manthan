

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url, } from "../../routes/index"
import { MetaTags } from "react-meta-tags";

import * as report from '../../Reports/ReportIndex'
import C_Report from "../../components/Common/C_Report";
import Select, { components } from 'react-select';

import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getpdfReportdataSuccess, invoiceListGoBtnfilter, } from "../../store/actions";
import { divisionDropdown_Forlogin_ChangeDivisionPage_ApiCall, VendorSupplierCustomer } from "../../helpers/backend_helper";
import { allLabelWithBlank, } from "../../components/Common/CommonErrorMsg/HarderCodeData";
import { customAlert } from "../../CustomAlert/ConfirmDialog";

import data from "./Data.json"

const PeriodWiseInvoiceReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        division: [allLabelWithBlank],
        customer: [allLabelWithBlank]
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');

    const [DivisionOptions, setDivisionOptions] = useState([]);

    const [Customer, setCustomer] = useState([]);

    const [commaSeparatedIDs, setCommaSeparatedIDs] = useState('');


    const reducers = useSelector(
        (state) => ({
            tableList: state.InvoiceReducer.Invoicelist,
            tableData: state.Css_Item_sale_Reducer.Css_Item_Sale_ReportGobtn,
            GoBtnLoading: state.Css_Item_sale_Reducer.goBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect,
            vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
            customer: state.CommonAPI_Reducer.customer,
        })
    );

    const { userAccess, tableData, GoBtnLoading, tableList } = reducers;
    const { Data = [], Type } = tableData







    useEffect(async () => {
        dispatch(commonPageFieldSuccess(null));

        dispatch(commonPageField(pageId.PERIOD_WISE_INVOICE_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));


        const resp = await divisionDropdown_Forlogin_ChangeDivisionPage_ApiCall(_cfunc.loginEmployeeID())



        if (resp.Status === true && resp.StatusCode === 200) {
            const data = resp.Data.map((i) => ({
                value: i.Party_id,
                label: i.PartyName,
            }))
            setDivisionOptions(data)
        }

        // dispatch(GetCustomer());


        return () => {
            dispatch(commonPageFieldSuccess(null));

        }
    }, []);



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


    // 

    useEffect(() => {

        if (reducers.tableList && Array.isArray(reducers.tableList) && reducers.tableList.length > 0) {
            const ids = reducers.tableList.map(item => item.id).join(',');
            setCommaSeparatedIDs(ids);
            console.log("Comma Separated Invoice IDs:", ids);
        }
    }, [reducers.tableList]);




    useEffect(() => {
        debugger
        try {
            if (reducers.tableList.length === 0) {
                data["ReportType"] = report.Period_Wise_Invoice_Report;
                dispatch(getpdfReportdataSuccess(data))
                // dispatch(Css_Item_Sale_Gobtn_Success([]));
            }
            else if ((tableData.Status === true) && (tableData.StatusCode === 204)) {
                customAlert({
                    Type: 3,
                    Message: tableData.Message,
                })
                // dispatch(Css_Item_Sale_Gobtn_Success([]));
                return
            }
        }
        catch (e) { }

    }, [reducers.tableList]);




    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        // dispatch(Css_Item_Sale_Gobtn_Success([]));

    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        // dispatch(Css_Item_Sale_Gobtn_Success([]));

    }



    const divisionOnchange = async (e) => {

        if (!e || e.value === '') {
            setCustomer([]);
        } else {
            const PartyID = e.value;

            const jsonBody = {
                PartyID,
                Company: _cfunc.loginCompanyID(),
                Route: "",
                Type: 3
            };
            const Resp = await VendorSupplierCustomer(jsonBody);
            if (Resp && Resp.Status === true) {
                setCustomer(Resp.Data);
            }
        }

        setState((i) => {
            const a = { ...i }
            a.values.division = e;
            a.hasValid.division.valid = true;
            return a;
        });
    };





    const customerOnchange = (e) => {
        let selected = e;

        if (!selected || selected.value === '') {
            selected = allLabelWithBlank;
        }

        setState((i) => {
            const a = { ...i }
            a.values.customer = selected;
            a.hasValid.customer.valid = true;
            return a;
        });

        dispatch(invoiceListGoBtnfilter([]));
    }


    function goButtonHandler(BtnID) {
        debugger

        try {
            debugger
            const filtersBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                Customer: values.customer.value, // Ensure we send a string
                Party: values.division.value, // Ensure we send a string
                IBType: "",
                DashBoardMode: 0
            });

            const subPageMode = url.PERIOD_WISE_INVOICE_REPORT

            dispatch(invoiceListGoBtnfilter({ subPageMode, filtersBody, btnId: BtnID }));
        } catch (error) {
            _cfunc.CommonConsole(error);
        }
    }



    const CustomMultiValueLabel = props => {
        return (
            <components.MultiValueLabel {...props}>
                <div title={props.data.label}>
                    {props.data.label}
                </div>
            </components.MultiValueLabel>
        );
    };

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
                                    <Select
                                        name="division"
                                        value={values.division}
                                        isSearchable={true}
                                        isMulti={false}
                                        components={{ MultiValueLabel: CustomMultiValueLabel }}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={DivisionOptions}
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
                                    <Select
                                        name="customer"
                                        value={values.customer}
                                        isMulti={false}
                                        isSearchable={true}
                                        components={{ MultiValueLabel: CustomMultiValueLabel }}

                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={Customer.filter(
                                            (item, index, self) =>
                                                index === self.findIndex(t => t.id === item.id)
                                        ).map(i => ({
                                            value: i.id,
                                            label: i.Name,
                                        }))}
                                        onChange={(e) => { customerOnchange(e) }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>


                        <Col sm={2} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && Type === "Print") && true}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("Print")}
                            >
                                Print
                            </C_Button>
                        </Col>
                    </Row>
                </div>




            </div>
            <C_Report />

        </React.Fragment >
    )
}

export default PeriodWiseInvoiceReport;
