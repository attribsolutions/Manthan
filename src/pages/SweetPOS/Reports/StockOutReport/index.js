import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, FormGroup, Label, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { C_Button } from "../../../../components/Common/CommonButton";
import { C_DatePicker } from "../../../../CustomValidateForm";
import * as _cfunc from "../../../../components/Common/CommonFunction";
import { mode, pageId } from "../../../../routes/index"
import { MetaTags } from "react-meta-tags";
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess } from "../../../../store/actions";
import DynamicColumnHook from "../../../../components/Common/TableCommonFunc";
import { ExcelReportComponent } from "../../../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { globalTableSearchProps } from "../../../../components/Common/SearchBox/MySearch";
import { GoButton_For_StockOut_Action, GoButton_For_StockOut_Success } from "../../../../store/SweetPOSStore/Report/StockOutReportRedux/action";

const StockOutReport = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = _cfunc.date_ymd_func();

    const [headerFilters, setHeaderFilters] = useState('');
    const [userPageAccessState, setUserAccState] = useState('');
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState(0);

    const {
        goButtonData,
        pageField,
        userAccess,
    } = useSelector((state) => ({
        goButtonData: state.StockOutReportReducer.stockOutListData,
        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField
    })
    );

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
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(pageId.STOCK_OUT_REPORT))
        return () => {
            setTableData([]);
            dispatch(GoButton_For_StockOut_Success([]));
        }
    }, [])

    useEffect(() => {
        if (tableData.length === 0) {
            setBtnMode(0)
        }
    }, [tableData]);

    const [tableColumns] = DynamicColumnHook({ pageField, })

    useEffect(() => {

        try {
            if ((goButtonData.Status === true) && (goButtonData.StatusCode === 200)) {

                setBtnMode(0);
                const { Data } = goButtonData
                setTableData(Data);
                if (btnMode === 2) {
                    ExcelReportComponent({      // Download CSV
                        pageField,
                        excelTableData: Data,
                        excelFileName: "Stock Out Report"
                    })
                    dispatch(GoButton_For_StockOut_Success([]));
                }
            }
            else if ((goButtonData.Status === true)) {
                setTableData([]);
            }
            setBtnMode(0);

        }
        catch (e) { }

    }, [goButtonData]);

    function excel_And_GoBtnHandler(e, Btnmode) {

        setBtnMode(Btnmode);

        const jsonBody = JSON.stringify({
            "FromDate": fromdate,
            "ToDate": todate,
            "Party": _cfunc.loginPartyID(),
        });

        let config = { jsonBody }
        dispatch(GoButton_For_StockOut_Action(config));
    }

    function fromdateOnchange(e, date) {

        let newObj = { ...headerFilters }
        newObj.fromdate = date
        setHeaderFilters(newObj)
        setTableData([]);
        dispatch(GoButton_For_StockOut_Success([]));
    }

    function todateOnchange(e, date) {

        let newObj = { ...headerFilters }
        newObj.todate = date
        setHeaderFilters(newObj);
        setTableData([]);
        dispatch(GoButton_For_StockOut_Success([]));
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
                                        value={fromdate}
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
                                        value={todate}
                                        onChange={todateOnchange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>

                        <Col sm={4}></Col>
                        <Col sm={2} className=" d-flex justify-content-end" >
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 1 && true}
                                className="btn btn-success m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, 1)}
                            >
                                Show
                            </C_Button>
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={btnMode === 2 && true}
                                className="btn btn-primary m-3 mr"
                                onClick={(e) => excel_And_GoBtnHandler(e, 2)}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div>

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="id"
                        data={tableData}
                        columns={tableColumns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table" style={{ maxHeight: "77vh" }}>
                                            <BootstrapTable
                                                keyField="id"
                                                classes={"custom-table"}
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

export default StockOutReport;