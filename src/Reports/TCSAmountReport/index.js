import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import Select from "react-select";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { TCS_Amount_Gobtn_Action, TCS_Amount_Gobtn_Success } from "../../store/Report/TCS_AmountRedux/action";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";

const TCSAmountReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,
    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [btnMode, setBtnMode] = useState("");
    const [PartyDropdown, setPartyDropdown] = useState({ value: "", label: "All" });

    const [updatetableColumn, setupdatetableColumn] = useState([{}]);

    const reducers = useSelector(
        (state) => ({
            tableData: state.TCSAmountReportReducer.tcsAmtReportGobtn,
            GoBtnLoading: state.TCSAmountReportReducer.goBtnLoading,
            PartyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

    const { userAccess, tableData = [], GoBtnLoading, pageField, PartyList } = reducers;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.TCS_AMOUNT_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(TCS_Amount_Gobtn_Success([]));
        }
    }, []);

    const [tableColumns] = DynamicColumnHook({ pageField })

    useEffect(() => {
        const newColumn = [{
            text: "PartyName",
            dataField: "PartyName",
        },
        ...tableColumns
        ];

        if (!isSCMParty) {
            newColumn.shift();
        }
        setupdatetableColumn(newColumn)

    }, [tableColumns])

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

        if (btnMode === "excel") {
            if (tableData.length > 0) {
                ExcelReportComponent({                // Download CSV
                    pageField,
                    excelTableData: tableData,
                    excelFileName: "TCS Amount Report",
                    extraColumn: isSCMParty ? "PartyName" : "",
                })
                dispatch(TCS_Amount_Gobtn_Success([]));
            }
        }
    }, [tableData]);

    function goAndExcel_Btn_Handler(btnId) {
        setBtnMode(btnId)
        try {

            const jsonBody = JSON.stringify({
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Party": isSCMParty ? PartyDropdown.value : _cfunc.loginPartyID()
            });

            dispatch(TCS_Amount_Gobtn_Action(jsonBody))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        dispatch(TCS_Amount_Gobtn_Success([]))
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        dispatch(TCS_Amount_Gobtn_Success([]))
    }

    const partyOnchange = (e) => {
        setPartyDropdown(e)
        dispatch(TCS_Amount_Gobtn_Success([]));
    }

    const Party_Option = PartyList.map(i => ({
        value: i.id,
        label: i.Name
    }));
    Party_Option.unshift({ value: "", label: "All" })

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">

                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={values.FromDate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={3} className="">
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={values.ToDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {isSCMParty &&
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                    <Col sm="8">
                                        <Select
                                            name="Party"
                                            value={PartyDropdown}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => { partyOnchange(e) }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        }

                        <Col sm={1} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && btnMode === "show") && true}
                                className="btn btn-success   "
                                onClick={() => goAndExcel_Btn_Handler("show")}
                            >
                                Show
                            </C_Button>
                        </Col>

                        <Col sm={2} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(GoBtnLoading && btnMode === "excel") && true}
                                className="btn btn-primary   "
                                onClick={() => goAndExcel_Btn_Handler("excel")}
                            >
                                Excel Download
                            </C_Button>
                        </Col>
                    </div>
                </div>

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="InvoiceNumber"
                        data={tableData}
                        columns={updatetableColumn}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField="InvoiceNumber"
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
                                            {mySearchProps(toolkitProps.searchProps)}
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

export default TCSAmountReport;