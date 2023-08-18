import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button, Change_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getBaseUnit_ForDropDown, getBaseUnit_ForDropDownSuccess } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { damageStockReport_GoButton_API, damageStockReport_GoButton_API_Success } from "../../store/Report/DamageStockReportRedux/action";
import DynamicColumnHook from "../../components/Common/TableCommonFunc";
import { mode, pageId, url } from "../../routes/index"
import * as XLSX from 'xlsx';

const DamageStockReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');

    const [partyDropdown, setPartyDropdown] = useState("");
    const [unitDropdown, setUnitDropdown] = useState("");
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);
   
    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.DamageStockReportReducer.listBtnLoading,
            goButtonData: state.DamageStockReportReducer.StockReportGobtn,
            BaseUnit: state.ItemMastersReducer.BaseUnit,
            SSDD_List: state.CommonPartyDropdownReducer.commonPartyDropdown,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        })
    );

    const { userAccess, BaseUnit, SSDD_List, pageField, goButtonData = [], } = reducers;
    const { fromdate = currentDate_ymd, todate = currentDate_ymd } = headerFilters;

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

        dispatch(getBaseUnit_ForDropDown());
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.DAMAGE_STOCK_REPORT))
        return () => {
            dispatch(commonPageFieldSuccess(null));
            dispatch(damageStockReport_GoButton_API_Success([]));
            dispatch(getBaseUnit_ForDropDownSuccess([]));
        }
    }, [])

    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {
                setBtnMode(0);
                const { Data } = goButtonData
                if (btnMode === 2) {
                    const worksheet = XLSX.utils.json_to_sheet(Data);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Damage Stock Report");
                    XLSX.writeFile(workbook, `Damage Stock Report.xlsx`);
                    dispatch(damageStockReport_GoButton_API_Success([]));
                }
                else {
                    setTableData(Data)
                }
            }
            else if ((goButtonData.Status === true)) {
                setTableData([]);
            }
            setBtnMode(0);
        }
        catch (e) { console.log(e) }

    }, [goButtonData]);

    useEffect(() => {
        if (tableData.length === 0) {
            setBtnMode(0)
        }
        dispatch(BreadcrumbShowCountlabel(`Count:${tableData.length}`));
    }, [tableData]);

    const [tableColumns] = DynamicColumnHook({ pageField })

    const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
        .map(data => ({
            value: data.id,
            label: data.Name
        }));

    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));

    function goButtonHandler(e, btnMode) {
        try {
            setBtnMode(btnMode)
            if (unitDropdown === "") {
                customAlert({
                    Type: 3,
                    Message: "Please Select Unit"
                })
                setBtnMode(0)
                return
            }
            else if ((isSCMParty) && (partyDropdown === "")) {
                customAlert({ Type: 3, Message: "Please Select Party" });
                setBtnMode(0)
                return;
            }

            const jsonBody = JSON.stringify({
                "FromDate": fromdate,
                "ToDate": todate,
                "Unit": unitDropdown.value,
                "PartyID": partyDropdown === "" ? _cfunc.loginPartyID() : partyDropdown.value,
            });

            dispatch(damageStockReport_GoButton_API({ jsonBody }))

        } catch (error) { _cfunc.CommonConsole(error) }
    }

    function fromdateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
    }

    function todateOnchange(e, date) {
        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj)
    }

    return (
        <React.Fragment>
            <MetaTags>{_cfunc.metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <div className="px-2 c_card_filter text-black mb-1" >
                    <div className="row" >
                        <Col sm={(isSCMParty) ? 2 : 3} className="">
                            <FormGroup className=" mb-2 row mt-3 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "66px" }}>FromDate</Label>
                                <Col sm={7}>
                                    <C_DatePicker
                                        name='fromdate'
                                        value={fromdate}
                                        disabled={true}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={(isSCMParty) ? 2 : 3} className="">
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "60px" }}>ToDate</Label>
                                <Col sm={7}>
                                    <C_DatePicker
                                        nane='todate'
                                        value={todate}
                                        disabled={true}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={(isSCMParty) ? 2 : 3}>
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-2 p-2"
                                    style={{ width: "85px" }}>Unit</Label>
                                <Col sm={7}>
                                    <Select
                                        name="Unit"
                                        value={unitDropdown}
                                        // isDisabled={tableData.length > 0 && true}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={BaseUnit_DropdownOptions}
                                        onChange={(e) => {
                                            setUnitDropdown(e);
                                            setTableData([]);
                                        }}
                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        {isSCMParty &&
                            <Col sm={3}>
                                <FormGroup className=" row mt-3 " >
                                    <Label className="col-md-3 p-2 "
                                        style={{ width: "90px" }}>Party</Label>
                                    <Col sm={7}>
                                        <Select
                                            name="Party"
                                            value={partyDropdown}
                                            isSearchable={true}
                                            // isDisabled={tableData.length > 0 && true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => {
                                                setPartyDropdown(e);
                                                setTableData([]);
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col >
                        }

                        <Col sm={1} className="mt-3" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 1 && true}
                                className="btn btn-success"
                                onClick={(e) => goButtonHandler(e, 1)}
                            >
                                Show
                            </C_Button>

                        </Col>

                        <Col sm={2} className="mt-3 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && true}
                                className="btn btn-primary"
                                onClick={(e) => goButtonHandler(e, 2)}
                            >
                                Excel Download
                            </C_Button>
                        </Col>
                    </div>

                </div>

                <ToolkitProvider
                    keyField={"id"}
                    data={tableData}
                    columns={tableColumns}
                    search
                >
                    {(toolkitProps,) => (
                        <React.Fragment>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive table">
                                        <BootstrapTable
                                            keyField={"id"}
                                            classes={"table  table-bordered table-hover"}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Record Not available
                                                </div>
                                            }
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
            <C_Report />
        </React.Fragment >
    )
}

export default DamageStockReport;;