import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import { postDeleteInvoiceDataExport_API, postDeleteInvoiceDataExport_API_Success } from "../../store/Report/InvoiceDataExportRedux/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import Select from "react-select";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { ExcelReportComponent } from "../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import { alertMessages } from "../../components/Common/CommonErrorMsg/alertMsg";

const DeleteInvoiceDataExport = (props) => {

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
    const [PartyDropdown, setPartyDropdown] = useState("");

    const reducers = useSelector(
        (state) => ({
            tableData: state.InvoiceDataExportReducer.DeleteInvoiceDataExportGobtn,
            GoBtnLoading: state.InvoiceDataExportReducer.GoBtnLoading,
            Distributor: state.CommonPartyDropdownReducer.commonPartyDropdownOption,
            ExcelBtnLoading: state.InvoiceDataExportReducer.ExcelBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

    const { userAccess, tableData = [], ExcelBtnLoading, GoBtnLoading, Distributor, pageField } = reducers;
    const { DeletedInvoiceExportSerializerDetails = [] } = tableData;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.DELETE_INVOICE_DATA_EXPORT));
        if (_cfunc.CommonPartyDropValue().value > 0) {
            setPartyDropdown(_cfunc.CommonPartyDropValue());
        }
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(postDeleteInvoiceDataExport_API_Success([]))
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
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        return () => {
            dispatch(postDeleteInvoiceDataExport_API_Success([]));
        }
    }, [])

    useEffect(() => {

        if (tableData.btnId === "excel_btnId") {
            if (DeletedInvoiceExportSerializerDetails.length > 0) {
                ExcelReportComponent({                // Download CSV
                    pageField,
                    excelTableData: DeletedInvoiceExportSerializerDetails,
                    excelFileName: "Deleted Invoice Data Export"
                })
                dispatch(postDeleteInvoiceDataExport_API_Success([]));
            }
        }
    }, [tableData]);

    function excelhandler() {

        try {
            if ((isSCMParty) && (PartyDropdown === "")) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            const jsonBody = JSON.stringify({
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Party": PartyDropdown === "" ? _cfunc.loginPartyID() : PartyDropdown.value,
            });
            let config = { jsonBody, btnId: "excel_btnId" }
            dispatch(postDeleteInvoiceDataExport_API(config))
            dispatch(postDeleteInvoiceDataExport_API_Success([]))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function goButtonHandler() {
        try {
            const btnId = `gobtn-${url.DELETE_INVOICE_DATA_EXPORT}`
            if ((isSCMParty) && (PartyDropdown === "")) {
                customAlert({ Type: 3, Message: alertMessages.commonPartySelectionIsRequired });
                return;
            };
            const jsonBody = JSON.stringify({
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Party": PartyDropdown === "" ? _cfunc.loginPartyID() : PartyDropdown.value,
            });
            let config = { jsonBody, btnId: btnId }
            dispatch(postDeleteInvoiceDataExport_API(config))
            dispatch(postDeleteInvoiceDataExport_API_Success([]))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.FromDate = date;
            a.hasValid.FromDate.valid = true
            return a
        })
        dispatch(postDeleteInvoiceDataExport_API_Success([]))
    }

    function todateOnchange(e, date) {
        setState((i) => {
            const a = { ...i }
            a.values.ToDate = date;
            a.hasValid.ToDate.valid = true
            return a
        })
        dispatch(postDeleteInvoiceDataExport_API_Success([]))
    }

    const partyOnchange = (e) => {
        setPartyDropdown(e)
        dispatch(postDeleteInvoiceDataExport_API_Success([]))
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
                                loading={GoBtnLoading === `gobtn-${url.DELETE_INVOICE_DATA_EXPORT}`}
                                className="btn btn-success   "
                                onClick={goButtonHandler}
                            >
                                Show
                            </C_Button>

                        </Col>

                        <Col sm={2} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={ExcelBtnLoading === `excel_btnId`}
                                className="btn btn-primary   "
                                onClick={(e) => { excelhandler() }}
                            >
                                Excel Download
                            </C_Button>
                        </Col>


                    </div>
                </div>
                <div className="mt-1">
                    <ToolkitProvider
                        keyField="PartyID"
                        // data={tableData.btnId !== "excel_btnId" ? DeletedInvoiceExportSerializerDetails : [{}]}
                        // columns={tableData.btnId !== "excel_btnId" ? tableColumns : [{}]}
                        data={DeletedInvoiceExportSerializerDetails}
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
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize > 0 && dataSize - 1}`));
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

export default DeleteInvoiceDataExport;