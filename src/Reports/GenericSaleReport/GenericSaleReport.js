import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Change_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { BreadcrumbShowCountlabel, SSDD_List_under_Company, getBaseUnit_ForDropDown } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import { stockReport_GoButton_API } from "../../store/Report/StockReport/action";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { stockReport_GoButton_API_Success } from "../../store/Report/StockReport/action";

const GenericSaleReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();
    const isSCMParty = _cfunc.loginIsSCMParty();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');

    const [distributorDropdown, setDistributorDropdown] = useState("");

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
    const { tableData = [] } = reducers

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
        dispatch(stockReport_GoButton_API_Success([]))
        dispatch(getBaseUnit_ForDropDown());
        dispatch(SSDD_List_under_Company());
    }, [])

    useEffect(() => {
        dispatch(BreadcrumbShowCountlabel(`Stock Report Count:${tableData.length}`))
    }, [tableData])

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

        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "PartyID": distributorDropdown === "" ? _cfunc.loginPartyID() : distributorDropdown.value,
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
                <div className="px-2   c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={4} className="">
                            <FormGroup className="mb- row mt-3 mb-2 " >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "83px" }}>FromDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name='FromDate'
                                        value={fromdate}
                                        onChange={fromdateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={4} className="">
                            <FormGroup className="mb- row mt-3 mb-2" >
                                <Label className="col-sm-4 p-2"
                                    style={{ width: "65px" }}>ToDate</Label>
                                <Col sm="6">
                                    <C_DatePicker
                                        name="ToDate"
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        {/* {isSCMParty && */}
                            <Col sm={3} className="">
                                <FormGroup className="mb- row mt-3" >
                                    <Label className="col-sm-4 p-2"
                                        style={{ width: "65px", marginRight: "20px" }}>Distributor</Label>
                                    <Col sm="8">
                                        <Select
                                            name="Distributor"
                                            value={distributorDropdown}
                                            isSearchable={true}
                                            className="react-dropdown"
                                            classNamePrefix="dropdown"
                                            styles={{
                                                menu: provided => ({ ...provided, zIndex: 2 })
                                            }}
                                            options={Party_Option}
                                            onChange={(e) => { setDistributorDropdown(e) }}
                                        />
                                    </Col>
                                </FormGroup>
                            </Col>
                        {/* } */}

                        <Col sm="1" className="mt-3 ">
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

export default GenericSaleReport;