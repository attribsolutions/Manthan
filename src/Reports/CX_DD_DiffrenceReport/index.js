import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { initialFiledFunc } from "../../components/Common/validationFunction";
import { C_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, pageId } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../store/actions";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { Cx_DD_Diffrence_Gobtn_Action, Cx_DD_Diffrence_Gobtn_Success } from "../../store/Report/CX_DD_Diffrence_Report/action";
import { Cx_DD_ExcelDownload, Cx_DD_ExcelDownload_PartyAll } from "./excelDownload";
import { Cx_DD_Diffrence_Report_Party_Dropdown_API } from "../../helpers/backend_helper";
import { allLabelWithZero } from "../../components/Common/CommonErrorMsg/HarderCodeData";

const CX_DD_DiffrenceReport = (props) => {

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

    const [PartyDropdown, setPartyDropdown] = useState(allLabelWithZero);
    const [partyDropdownOptions, setPartyDropdownOptions] = useState([]);
    const [partyDropdownLoading, setpartyDropdownLoading] = useState(false);

    const [updatetableColumn, setupdatetableColumn] = useState([{}]);

    const reducers = useSelector(
        (state) => ({
            tableData: state.Cx_DD_Diffrence_Reducer.Cx_DD_Diff_ReportGobtn,
            GoBtnLoading: state.Cx_DD_Diffrence_Reducer.goBtnLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

    const { userAccess, tableData = [], GoBtnLoading, pageField, } = reducers;

    useEffect(() => {
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.CX_DD_DIFFERENCE_REPORT));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(Cx_DD_Diffrence_Gobtn_Success([]));
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setpartyDropdownLoading(true);
            try {
                const partyAPIReposnse = await Cx_DD_Diffrence_Report_Party_Dropdown_API();
                if (partyAPIReposnse.StatusCode === 200) {
                    const options = partyAPIReposnse.Data.map((index) => ({
                        value: index.SupplierID,
                        label: index.SupplierName,
                    }));
                    setPartyDropdownOptions([allLabelWithZero, ...options]);
                }
            } catch (e) { }
            finally {
                setpartyDropdownLoading(false);
            }
        };
        fetchData();
    }, []);

    const [tableColumns] = DynamicColumnHook({ pageField })

    useEffect(() => {
        const newColumn = [{
            text: "SupplierName",
            dataField: "SupplierName",
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
            let excelFileName = `CX-DD Difference Report ${_cfunc.date_dmy_func(values.FromDate)} - ${_cfunc.date_dmy_func(values.ToDate)}`
            if (tableData.length > 0) {
                if (PartyDropdown.value === 0 && (isSCMParty)) {
                    Cx_DD_ExcelDownload_PartyAll({                // Download CSV
                        pageField,
                        excelData: tableData,
                        excelFileName: excelFileName,
                        extraColumn: "SupplierName",
                    })
                } else {
                    Cx_DD_ExcelDownload({            // Download CSV
                        pageField,
                        excelData: tableData,
                        excelFileName: excelFileName,
                        extraColumn: isSCMParty ? "SupplierName" : "",
                        PartyName: isSCMParty ? PartyDropdown.label : _cfunc.loginPartyName(),
                    })
                }
            }
        }
    }, [tableData]);

    async function goAndExcel_Btn_Handler(btnId) {
        setBtnMode(btnId)
        try {
            const jsonBody = JSON.stringify({
                "FromDate": values.FromDate,
                "ToDate": values.ToDate,
                "Party": isSCMParty ? PartyDropdown.value : _cfunc.loginPartyID()
            });
            // dispatch(Cx_DD_Diffrence_Gobtn_Action({ "FromDate": "2023-12-01", "ToDate": "2023-12-19", "Party": 21 }));
            dispatch(Cx_DD_Diffrence_Gobtn_Action(jsonBody));

        } catch (error) { _cfunc.CommonConsole(error) }
    }

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

    const partyOnchange = (e) => {
        setPartyDropdown(e)
        dispatch(Cx_DD_Diffrence_Gobtn_Success([]));
    }

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
                                        <C_Select
                                            name="Party"
                                            value={PartyDropdown}
                                            isSearchable={true}
                                            isLoading={partyDropdownLoading}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={partyDropdownOptions}
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
                                className="btn btn-success"
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
                                className="btn btn-primary"
                                onClick={() => goAndExcel_Btn_Handler("excel")}
                            >
                                Excel 
                            </C_Button>
                        </Col>
                    </div>
                </div>

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
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

export default CX_DD_DiffrenceReport;