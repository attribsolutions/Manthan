

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import * as report from '../../Reports/ReportIndex'
import C_Report from "../../components/Common/C_Report";
import Select, { components } from 'react-select';

import { globalTableSearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getpdfReportdataSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";

import { divisionDropdown_Forlogin_ChangeDivisionPage_ApiCall, VendorSupplierCustomer } from "../../helpers/backend_helper";
import { allLabelWithBlank, allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";

import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { Stock_adjustment_Report_Action, Stock_adjustment_Report_Success } from "../../store/Report/StockAdjustMentRedux/action";

const StockadjustmentReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
        division: [allLabelWithZero],
        customer: [allLabelWithBlank]
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [DivisionOptions, setDivisionOptions] = useState([]);
    const [Customer, setCustomer] = useState([]);

    const reducers = useSelector(
        (state) => ({
            tableData: state.Stock_Adjustment_Report_Reducer.StockAdjustment_Data,
            GoBtnLoading: state.Stock_Adjustment_Report_Reducer.goBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField,
            commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect,
            vendorSupplierCustomer: state.CommonAPI_Reducer.vendorSupplierCustomer,
            customer: state.CommonAPI_Reducer.customer,
        })
    );

    const { userAccess, tableData, GoBtnLoading, pageField } = reducers;
    const { Data = [], Type } = tableData

    useEffect(async () => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.STOCK_ADJUSTMENT_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        const resp = await divisionDropdown_Forlogin_ChangeDivisionPage_ApiCall(_cfunc.loginEmployeeID())
        if (resp.Status === true && resp.StatusCode === 200) {
            const data = resp.Data.map((i) => ({
                value: i.Party_id,
                label: i.PartyName,
            }))
            setDivisionOptions(data)
        }

        return () => {
            dispatch(commonPageFieldSuccess(null));


        }
    }, []);

    const [tableColumns] = DynamicColumnHook({ pageField })
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
        try {
            if ((tableData.Status === true) && (tableData.StatusCode === 200)) {
                if (tableData.Data.length === 0) {
                    customAlert({
                        Type: 3,
                        Message: tableData.Message,
                    })
                    return
                }
                if (Type === "Print") {
                    let config = { rowData: { Data: [] } }
                    config.rowData["ReportType"] = report.Stockadjustment_Report;
                    config.rowData["Status"] = tableData.Status
                    config.rowData["StatusCode"] = tableData.StatusCode
                    config.rowData["Data"] = tableData.Data
                    config.rowData["Data"]["Date"] = `From  ${_cfunc.date_dmy_func(values.FromDate)}  To  ${_cfunc.date_dmy_func(values.ToDate)}`
                    dispatch(getpdfReportdataSuccess(config.rowData))
                    dispatch(Stock_adjustment_Report_Success([]));
                } else if (Type === "excel") {
                    ExcelReportComponent({
                        pageField,
                        excelTableData: Data,
                        excelFileName: "Stock Adjustment Report"
                    })

                }
            }
            else if ((tableData.Status === true) && (tableData.StatusCode === 204)) {
                customAlert({
                    Type: 3,
                    Message: tableData.Message,
                })
                dispatch(Stock_adjustment_Report_Success([]));
                return
            }
        }
        catch (e) { }

    }, [tableData]);



    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        dispatch(Stock_adjustment_Report_Success([]));

    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        dispatch(Stock_adjustment_Report_Success([]));

    }



    const divisionOnchange = async (e) => {

        if (e.length === 0) {
            e = [allLabelWithBlank]
            setCustomer([]);
        } else {
            e = e.filter(i => !(i.value === ''))
        }

        const prev = values.division || [];
        const current = e || [];

        const added = current.filter(opt => !prev.some(p => p.value === opt.value));
        const removed = prev.filter(opt => !current.some(c => c.value === opt.value));

        // When something is added
        if (added.length > 0) {
            const PartyID = added[0].value;

            const jsonBody = {
                PartyID,
                Company: _cfunc.loginCompanyID(),
                Route: "",
                Type: 3
            };
            const Resp = await VendorSupplierCustomer(jsonBody);
            if (Resp && Resp.Status === true) {

                setCustomer(prevData => [...prevData, ...Resp.Data]);
            }
        }

        // When something is removed
        if (removed.length > 0) {
            const PartyID = removed[0].value;

            const jsonBody = {
                PartyID,
                Company: _cfunc.loginCompanyID(),
                Route: "",
                Type: 3
            };
            const Resp = await VendorSupplierCustomer(jsonBody);
            if (Resp && Resp.Status === true) {
                // Remove matching data based on unique key, assume `id` is unique
                setCustomer(prevData => {
                    const updatedData = [...prevData]; // make a copy

                    Resp.Data.forEach(toRemove => {
                        const index = updatedData.findIndex(item => item.id === toRemove.id);
                        if (index !== -1) {
                            updatedData.splice(index, 1); // remove only one matching item
                        }
                    });

                    return updatedData;
                });
            }
        }

        setState((i) => {
            const a = { ...i }
            a.values.division = e;
            a.hasValid.division.valid = true
            return a
        })
        dispatch(Stock_adjustment_Report_Success([]));

    }



    function goButtonHandler(BtnID) {
        try {
            const jsonBody = JSON.stringify({
                FromDate: values.FromDate,
                ToDate: values.ToDate,
                Party: values.division.map(row => row.value).join(',')
            });
            dispatch(Stock_adjustment_Report_Action({ jsonBody, btnId: BtnID }));
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
                                    style={{ width: "65px", marginRight: "20px" }}>Division</Label>
                                <Col sm="8">
                                    <Select
                                        name="division"
                                        value={values.division}
                                        isSearchable={true}
                                        isMulti={true}
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


                        <Col sm={3} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && GoBtnLoading === "show")}
                                className="btn btn-success m-3 mr"
                                onClick={() => goButtonHandler("show")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && GoBtnLoading === "excel")}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("excel")}
                            >
                                Excel
                            </C_Button>


                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && GoBtnLoading === "Print")}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("Print")}
                            >
                                Print
                            </C_Button>
                        </Col>
                    </Row>
                </div>



                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={Type === "show" ? Data : []}
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
            <C_Report />

        </React.Fragment >
    )
}

export default StockadjustmentReport;
