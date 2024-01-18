import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Input, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../components/Common/CommonButton";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { getCurrent_Month_And_Year } from "../../pages/Accounting/Claim Tracking Entry/ClaimRelatedFunc";
import { getClaimTrackingEntrySuccess, getClaimTrackingEntrylist } from "../../store/Accounting/ClaimTrackingEntryRedux/action";
import { C_Select } from "../../CustomValidateForm";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { API_URL_LIVE } from "../../routes/route_url";

const ClaimTrackingReport = (props) => {  // also Receipt Data Export 

    const dispatch = useDispatch();
    const history = useHistory();
    const userAdminRole = _cfunc.loginUserAdminRole();

    const [userPageAccessState, setUserAccState] = useState('');
    const [yearAndMonth, setYearAndMonth] = useState(getCurrent_Month_And_Year);
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
        partyList: state.CommonPartyDropdownReducer.commonPartyDropdown,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    }));

    const { Data = [], goBtnMode } = tableData;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.CLAIM_TRACKING_REPORT));
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(getClaimTrackingEntrySuccess([]));
        }
    }, []);

    //Max Month is current Month
    const maxMonthCurrent = useMemo(() => {
        const current = getCurrent_Month_And_Year();
        return `${current.Year}-${current.Month}`
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
                        return <a href={`${API_URL_LIVE}/media/${cell}`} style={{ cursor: "pointer", }} target="_blank" rel="noopener noreferrer" > Download Credit Note </a>

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
                "Year": yearAndMonth.Year,
                "Month": yearAndMonth.Month,
                "Party": userAdminRole ? partySelect.value : _cfunc.loginPartyID(),
                "Employee": !userAdminRole ? 0 : _cfunc.loginEmployeeID(),
            })

            const config = { jsonBody, subPageMode: url.CLAIM_TRACKING_REPORT };
            dispatch(getClaimTrackingEntrylist(config))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    async function MonthAndYearOnchange(e) {
        const selectdMonth = getCurrent_Month_And_Year(e.target.value);
        setYearAndMonth(selectdMonth);
        dispatch(getClaimTrackingEntrySuccess([]));
    }

    const Party_Option = partyList.map(i => ({
        value: i.id,
        label: i.Name
    }));

    Party_Option.unshift({
        value: "",
        label: " All"
    });

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">

                <div className="px-3 c_card_filter header text-black mb-1" >

                    <Row >
                        <Col sm="5" className="mt-1 mb-n1">
                            <FormGroup className="row mt-2" >
                                <Label className="col-sm-1 p-2"
                                    style={{ width: "115px", marginRight: "0.1cm" }}>Claim For The Month </Label>
                                <Col sm="7">
                                    <Input className="form-control"
                                        type="month"
                                        value={`${yearAndMonth.Year}-${yearAndMonth.Month}`}
                                        onChange={(e) => MonthAndYearOnchange(e)}
                                        max={maxMonthCurrent}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        {userAdminRole &&
                            <Col sm="5" className="mt-1 mb-n1">
                                <FormGroup className="row mt-2" >
                                    <Label className="col-sm-6 p-2" style={{ width: "65px" }}> Party</Label>
                                    <Col sm="7">
                                        <C_Select
                                            name="PartyName"
                                            value={partySelect}
                                            isSearchable={true}
                                            // isLoading={partyLoading}
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
                        <Col sm={1} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={((GoBtnLoading) && (btnMode === "showOnTable")) && true}
                                className="btn btn-success"
                                onClick={() => goButtonHandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                        </Col>

                        <Col sm={1} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={((GoBtnLoading) && (btnMode === "downloadExcel")) && true}
                                className="btn btn-primary"
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

export default ClaimTrackingReport;