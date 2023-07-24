import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row, } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button, Go_Button } from "../../components/Common/CommonButton";
import { C_DatePicker, C_Select } from "../../CustomValidateForm";
import * as _cfunc from "../../components/Common/CommonFunction";
import { mode, url } from "../../routes/index"
import { MetaTags } from "react-meta-tags";
import C_Report from "../../components/Common/C_Report";
import { StockProcessing_API_Success, StockProcessing_Action, stockReport_1_GoButton_API, stockReport_1_GoButton_API_Success } from "../../store/Report/StockReport/action";
import { stockReport_GoButton_API_Success } from "../../store/Report/StockReport/action";
import { getBaseUnit_ForDropDown } from "../../store/actions";
import { customAlert } from "../../CustomAlert/ConfirmDialog";

const StockReport_1 = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [unitDropdown, setUnitDropdown] = useState("");

    const reducers = useSelector(
        (state) => ({
            listBtnLoading: state.StockReportReducer.listBtnLoading,
            stockProcessingLoading: state.StockReportReducer.stockProcessingLoading,
            StockProcessingBtn: state.StockReportReducer.StockProcessingBtn,
            BaseUnit: state.ItemMastersReducer.BaseUnit,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageFieldList
        })
    );
    const { tableData = [] } = reducers

    const { userAccess, BaseUnit, StockProcessingBtn } = reducers;
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
        dispatch(stockReport_1_GoButton_API_Success([]))
        dispatch(getBaseUnit_ForDropDown());
    }, [])

    useEffect(async () => {

        if ((StockProcessingBtn.Status === true) && (StockProcessingBtn.StatusCode === 200)) {
            dispatch(StockProcessing_API_Success([]))
            customAlert({
                Type: 1,
                Message: StockProcessingBtn.Message,
            })

        }
        else if (StockProcessingBtn.Status === true) {
            dispatch(StockProcessing_API_Success([]))
            customAlert({
                Type: 4,
                Message: JSON.stringify(StockProcessingBtn.Message),
            })
        }
    }, [StockProcessingBtn])

    const BaseUnit_DropdownOptions = BaseUnit.map(data => ({
        value: data.id,
        label: data.Name
    }));

    function StockProccessHandler() {

        const btnId = `gobtn-${url.STOCK_REPORT_1}`
        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": _cfunc.loginPartyID(),
        });
        dispatch(StockProcessing_Action({ jsonBody, btnId }))
    }

    function goButtonHandler() {

        const btnId = `gobtn-${url.STOCK_REPORT_1}`
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
            "Party": _cfunc.loginPartyID(),
        });
        dispatch(stockReport_1_GoButton_API({ jsonBody, btnId }))
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
                <div className="px-2 c_card_filter text-black" >
                    <div className="row" >
                        <Col sm={3}>
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

                        <Col sm={3}>
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

                        <Col sm={3}>
                            <FormGroup className=" row mt-3 " >
                                <Label className="col-sm-2 p-2"
                                    style={{ width: "85px" }}>Unit</Label>
                                <Col sm={7}>
                                    <C_Select
                                        name="Unit"
                                        value={unitDropdown}
                                        isDisabled={tableData.length > 0 && true}
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

                        <Col sm={1} className="mt-3 ">
                            <C_Button
                                type="button"
                                loading={reducers.stockProcessingLoading}
                                color="btn btn-outline-primary border-1 font-size-10 text-center"
                                onClick={() => StockProccessHandler()}>
                                Stock Process
                            </C_Button>

                        </Col>

                        <Col sm={1} className="mt-3 " style={{ paddingLeft: "100px" }}>
                            < Go_Button loading={reducers.listBtnLoading}
                                onClick={(e) => goButtonHandler()}
                            />
                        </Col>
                    </div>

                </div>
                {/* 
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
                </ToolkitProvider> */}
            </div>
            <C_Report />
        </React.Fragment >
    )
}

export default StockReport_1;