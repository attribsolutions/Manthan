import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Col, FormGroup, Label, Row, Spinner, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import Select from "react-select";
import { SSDD_List_under_Company, } from "../../store/actions";
import C_Report from "../../components/Common/C_Report";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { mySearchProps } from "../../components/Common/SearchBox/MySearch";
import { GoButton_For_GenericSale_Action, GoButton_For_GenericSale_Success } from "../../store/Report/GenericSaleRedux/action";
import * as XLSX from 'xlsx';

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
            listBtnLoading: state.GenericSaleReportReducer.listBtnLoading,
            tableData: state.GenericSaleReportReducer.genericSaleGobtn,
            SSDD_List: state.CommonAPI_Reducer.SSDD_List,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { tableData = [] } = reducers

    const { userAccess, listBtnLoading, SSDD_List } = reducers;
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
        dispatch(GoButton_For_GenericSale_Success([]))
        dispatch(SSDD_List_under_Company());
    }, [])

    const Party_Option = SSDD_List.map(i => ({
        value: i.id,
        label: i.Name
    }));

    useEffect(() => {

        if (tableData.Status === true && tableData.StatusCode === 200) {
            const { Data } = tableData
            const worksheet = XLSX.utils.json_to_sheet(Data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "ProductMargin1");
            XLSX.writeFile(workbook, "Generic Sale Report.xlsx");

            dispatch(GoButton_For_GenericSale_Success([]));
        }
    }, [tableData]);

    function goButtonHandler() {

        const btnId = `gobtn-${url.GENERIC_SALE_REPORT}`

        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": distributorDropdown === "" ? _cfunc.loginPartyID() : distributorDropdown.value,
        });
        dispatch(GoButton_For_GenericSale_Action({ jsonBody, btnId }))
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

                        {isSCMParty &&
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
                        }

                        <Col sm="1" className="mt-3 ">
                            < Go_Button loading={listBtnLoading}
                                onClick={(e) => goButtonHandler()} />
                        </Col>
                    </div>
                </div>
            </div>
         
        </React.Fragment >
    )
}

export default GenericSaleReport;