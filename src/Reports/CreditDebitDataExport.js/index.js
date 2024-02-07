import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import Select from "react-select";
import { globalTableSearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { postCreditDebitDataExport_API, postCreditDebitDataExport_API_Success } from "../../store/Report/CreditDebitDataExportRedux/action";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";

const CreditDebitDataExport = (props) => {  // also Receipt Data Export 

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const fileds = {
        FromDate: currentDate_ymd,
        ToDate: currentDate_ymd,

    }
    const [subPageMode] = useState(history.location.pathname);
    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [userPageAccessState, setUserAccState] = useState('');
    const [PartyDropdown, setPartyDropdown] = useState("");

    const {
        userAccess,
        tableData,
        ExcelBtnLoading,
        GoBtnLoading,
        Distributor,
        pageField
    } = useSelector((state) => ({
        tableData: state.CreditDebitDataExportReducer.CreditDebit_DataExportGobtn,
        GoBtnLoading: state.CreditDebitDataExportReducer.GoBtnLoading,
        Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
        ExcelBtnLoading: state.CreditDebitDataExportReducer.ExcelBtnLoading,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );

    const { Data = [], goBtnMode } = tableData;

    const values = { ...state.values }

    // Featch Modules List data  First Rendering
    const location = { ...history.location }
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        let pageID
        if (subPageMode === url.CREDIT_DATA_EXPORT) {
            pageID = pageId.CREDIT_DATA_EXPORT
        }
        else if (subPageMode === url.DEBIT_DATA_EXPORT) {
            pageID = pageId.DEBIT_DATA_EXPORT
        }
        else {
            pageID = pageId.RECEIPT_DATA_EXPORT
        }
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageID));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue())
        }
        return () => {
            dispatch(commonPageFieldSuccess(null));
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
        return () => { dispatch(postCreditDebitDataExport_API_Success([])); }
    }, [])

    useEffect(() => {
        if (goBtnMode === "downloadExcel") {
            let excelName
            if (subPageMode === url.CREDIT_DATA_EXPORT) {
                excelName = "Credit Data Export"
            }
            else if (subPageMode === url.DEBIT_DATA_EXPORT) {
                excelName = "Debit Data Export"
            }
            else {
                excelName = "Receipt Data Export"
            }

            if (Data.length > 0) {
                ExcelReportComponent({      // Download CSV
                    pageField,
                    excelTableData: Data,
                    excelFileName: excelName
                })
                dispatch(postCreditDebitDataExport_API_Success([]));   // Reset Excel Data
            }
        }
    }, [goBtnMode, Data, pageField]);

    function goButtonHandler(goBtnMode) {

        try {

            if ((isSCMParty) && (PartyDropdown === "")) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };

            const jsonBody = JSON.stringify({
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Party": (isSCMParty) ? PartyDropdown.value : _cfunc.loginPartyID(),
                "Customer": 0,
                "NoteTypeIDs": subPageMode === url.CREDIT_DATA_EXPORT ? "37,39" : subPageMode === url.DEBIT_DATA_EXPORT ? "38,40" : ''
            });

            const config = { jsonBody, subPageMode, goBtnMode: goBtnMode, btnId: goBtnMode };
            dispatch(postCreditDebitDataExport_API(config))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        dispatch(postCreditDebitDataExport_API_Success([]))
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        dispatch(postCreditDebitDataExport_API_Success([]))
    }

    const partyOnchange = (e) => {
        setPartyDropdown(e)
        dispatch(postCreditDebitDataExport_API_Success([]))
    }

    const Party_Option = Distributor.map(i => ({
        value: i.id,
        label: i.Name
    }));

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
                                loading={GoBtnLoading === "showOnTable"}
                                className="btn btn-success"
                                onClick={() => goButtonHandler("showOnTable")}
                            >
                                Show
                            </C_Button>

                        </Col>

                        <Col sm={2} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={ExcelBtnLoading === "downloadExcel"}
                                className="btn btn-primary"
                                onClick={() => goButtonHandler("downloadExcel")}
                            >
                                Excel 
                            </C_Button>
                        </Col>


                    </div>
                </div>

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="PartyID"
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
                                                keyField="PartyID"
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

export default CreditDebitDataExport;