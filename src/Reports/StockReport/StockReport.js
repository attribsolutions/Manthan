import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { SSDD_List_under_Company, getBaseUnit_ForDropDown } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { stockReport_GoButton_API } from "../../store/Report/StockReport/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { customAlert } from "../../CustomAlert/ConfirmDialog";

const StockReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');

    const [partyDropdown, setPartyDropdown] = useState("");
    const [unitDropdown, setUnitDropdown] = useState("");

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.StockReportReducer.listBtnLoading,
            tableData: state.StockReportReducer.StockReportGobtn,
            BaseUnit: state.ItemMastersReducer.BaseUnit,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { tableData } = reducers

    const { userAccess, BaseUnit, SSDD_List } = reducers;
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
        dispatch(SSDD_List_under_Company());
    }, [])

    const BaseUnit_DropdownOptions = BaseUnit.filter(index => index.Name === "No" || index.Name === "Kg" || index.Name === "Box")
        .map(data => ({
            value: data.id,
            label: data.Name
        }));

    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));

    function goButtonHandler() {
        const btnId = `gobtn-${url.STOCK_REPORT}`

        if (unitDropdown === "") {
            customAlert({
                Type: 4,
                Message: "Please Select Unit"
            })
            return
        }
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Unit": unitDropdown.value,
            "PartyID": partyDropdown === "" ? _cfunc.loginPartyID() : partyDropdown.value,
        });
        dispatch(stockReport_GoButton_API({ jsonBody, btnId }))
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

    const pagesListColumns = [
        {
            text: "ItemName",
            dataField: "ItemName",
        },
        {
            text: "Quantity",
            dataField: "ActualQty",
        },
        {
            text: "Unit",
            dataField: "Unit",
        }
    ];

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

                        <Col sm={(isSCMParty) ? 3 : 4}>
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-2 p-2"
                                    style={{ width: "85px" }}>Unit</Label>
                                <Col sm={7}>
                                    <Select
                                        name="Unit"
                                        value={unitDropdown}
                                        isSearchable={true}
                                        className="react-dropdown"
                                        classNamePrefix="dropdown"
                                        styles={{
                                            menu: provided => ({ ...provided, zIndex: 2 })
                                        }}
                                        options={BaseUnit_DropdownOptions}
                                        onChange={(e) => { setUnitDropdown(e) }}

                                    />
                                </Col>
                            </FormGroup>
                        </Col >

                        {isSCMParty &&
                            <Col sm={3}>
                                <FormGroup className=" row mt-3 " >
                                    <Label className="col-md-3 p-2"
                                        style={{ width: "90px" }}>Party</Label>
                                    <Col sm={8}>
                                        <Select
                                            name="Party"
                                            value={partyDropdown}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => { setPartyDropdown(e) }}

                                        />
                                    </Col>
                                </FormGroup>
                            </Col >
                        }

                        <Col sm={1} className="mt-3 " style={{ paddingLeft: "100px" }}>
                            <Go_Button onClick={goButtonHandler} loading={reducers.listBtnLoading} />
                        </Col>
                    </div>

                </div>

                <ToolkitProvider
                    keyField={"Item"}
                    data={tableData}
                    columns={pagesListColumns}
                    search
                >
                    {(toolkitProps,) => (
                        <React.Fragment>
                            <Row>
                                <Col xl="12">
                                    <div className="table-responsive table">
                                        <BootstrapTable
                                            keyField={"Item"}
                                            id="table_Arrow"
                                            classes={"table  table-bordered table-hover"}
                                            noDataIndication={
                                                <div className="text-danger text-center ">
                                                    Record Not available
                                                </div>
                                            }
                                            onDataSizeChange={(e) => {
                                                _cfunc.tableInputArrowUpDounFunc("#table_Arrow")
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
            <C_Report />
        </React.Fragment >
    )
}

export default StockReport;