import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { getClaimTrackingEntrySuccess, getClaimTrackingEntrylist } from "../../store/Accounting/ClaimTrackingEntryRedux/action";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";

const ClaimTrackingReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [fromDate, setFromDate] = useState(currentDate_ymd)
    const [toDate, setToDate] = useState(currentDate_ymd)

    const [userPageAccessState, setUserAccState] = useState('');

    const [partySelect, setPartySelect] = useState({
        value: "",
        label: " All"
    });
    const [btnMode, setBtnMode] = useState("");

    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    const {
        userAccess,
        tableData,
        ExcelBtnLoading,
        GoBtnLoading,
        partyList,
        pageField
    } = useSelector((state) => ({
        tableData: state.ClaimTrackingEntry_Reducer.claimTrackingEntryList,
        GoBtnLoading: state.ClaimTrackingEntry_Reducer.GoBtnLoading,
        ExcelBtnLoading: state.ClaimTrackingEntry_Reducer.ExcelBtnLoading,
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const { Data = [], goBtnMode } = tableData;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.CLAIM_TRACKING_REPORT));
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartySelect(_cfunc.CommonPartyDropValue());
        }
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(getClaimTrackingEntrySuccess([]));
        }
    }, []);

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

    const [tableColumns] = DynamicColumnHook({ pageField })

    useEffect(() => {

        tableColumns.forEach(element => {
            if (element.dataField === "CreditNoteUpload") {

                let formatter = element.formatter = (cell, row) => {

                    if (cell !== "") {
                        return <a href={cell} style={{ cursor: "pointer", }} target="_blank" rel="noopener noreferrer" > Download Credit Note </a>

                    }
                }
                element["formatter"] = formatter
            }
        });

    }, [tableColumns, Data])

    useEffect(() => {
        if (btnMode === "downloadExcel") {
            if (Data.length > 0) {

                ExcelReportComponent({      // Download CSV
                    pageField,
                    excelTableData: Data,
                    excelFileName: "Claim Tracking Report"
                })
                dispatch(getClaimTrackingEntrySuccess([]));   // Reset Excel Data
            }
        }
    }, [Data, pageField]);

    function goButtonHandler(goBtnMode) {
        setBtnMode(goBtnMode)
        try {
            const jsonBody = JSON.stringify({
                "FromDate": fromDate,
                "ToDate": toDate,
                "Party": isSCMParty ? partySelect.value : _cfunc.loginPartyID(),
                "Employee": !isSCMParty ? 0 : _cfunc.loginEmployeeID(),
            })

            const config = { jsonBody, subPageMode: url.CLAIM_TRACKING_REPORT };
            dispatch(getClaimTrackingEntrylist(config))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    const Party_Option = partyList.map(i => ({
        value: i.id,
        label: i.Name
    }));

    Party_Option.unshift({
        value: "",
        label: " All"
    });

    function fromdateOnchange(e, date) {
        setFromDate(date)
        dispatch(getClaimTrackingEntrySuccess([]));
    }

    function todateOnchange(e, date) {
        setToDate(date);
        dispatch(getClaimTrackingEntrySuccess([]));
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
                                        value={fromDate}
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
                                        value={toDate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {isSCMParty &&
                            <Col sm={4} className="">
                                <FormGroup className=" row mt-2" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px", marginRight: "20px" }}>Party</Label>
                                    <Col sm="8">
                                        <C_Select
                                            name="PartyName"
                                            value={partySelect}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => {
                                                setPartySelect(e);
                                                dispatch(getClaimTrackingEntrySuccess([]));
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        }
                        <Col sm={isSCMParty ? 2 : 6} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={((GoBtnLoading) && (btnMode === "showOnTable")) && true}
                                className="btn btn-success m-3 mr"

                                onClick={() => goButtonHandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={((GoBtnLoading) && (btnMode === "downloadExcel")) && true}
                                className="btn btn-primary m-3 mr"
                                onClick={() => goButtonHandler("downloadExcel")}
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

export default ClaimTrackingReport;