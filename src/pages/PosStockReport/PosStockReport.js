import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
    Col,
    Input,
    Row,
} from "reactstrap";

import paginationFactory, {
    PaginationListStandalone,
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//redux
import { useSelector, useDispatch } from "react-redux";
import "../../assets/CustomeTable/datatables.scss"
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { SpinnerState } from "../../store/Utilites/Spinner/actions";
import { GetPosStockReportDataAction, GetPosStockReportDataActionSuccess } from "../../store/PosStockReport/actions";

const PosStockReport = () => {

    const axios = require('axios');
    const dispatch = useDispatch();
    const current = new Date();
    const month = current.getMonth() + 1;

    const currentDate = `${current.getFullYear()}-${month < 10 ? `0${month}` : `${month}`}-${current.getDate()<10?`0${current.getDate()}`:`${current.getDate()}`}`;

    function AxiosApiCallFunction(FromDate, ToDate) {
        // alert(`//web.chitalebandhu.in:8080/FoodERPWebAPIChart/api/StockReport/GetDateWiseStockReport?FromDate=${FromDate}&ToDate=${ToDate}&CompanyID=1&DivisionID=35`)
        var config = {
            method: 'get',
            url: `//web.chitalebandhu.in:8080/FoodERPWebAPIChart/api/StockReport/GetDateWiseStockReport?FromDate=${FromDate}&ToDate=${ToDate}&CompanyID=1&DivisionID=35`,
            headers: { "Access-Control-Allow-Origin": "*" }
        };
        dispatch(SpinnerState(true));
        axios(config)
            .then(function (response) {
                dispatch(SpinnerState(false));
                if (response.data.StatusCode === 200) {
                    dispatch(GetPosStockReportDataActionSuccess(response.data.data))
                } else {
                    dispatch(GetPosStockReportDataActionSuccess([]))
                    alert("Data Not Found")
                }
            })
            .catch(function (error) {
                dispatch(SpinnerState(false));
                dispatch(GetPosStockReportDataActionSuccess([]))
                console.log('error', error);
                alert("NetWork Error")
            });
    }
    function SelectDate_GO_Button_Handller() {
        let FromDate = document.getElementById("fromDate-input").value;
        let ToDate = document.getElementById("toDate-input").value;
        AxiosApiCallFunction(FromDate, ToDate);
    }

    const { TableListData, } = useSelector((state) => ({
        TableListData: state.Pos_Stock_Report_Reducer.StockDataApi,
    }));

    console.log("Tablelist dat ", TableListData)
    useEffect(() => {
        let FromDate = document.getElementById("fromDate-input").value;
        let ToDate = document.getElementById("toDate-input").value;
        AxiosApiCallFunction(FromDate, ToDate);
        //  dispatch(GetFranchiseSellData(InitialDate_Function()))
    }, [])



    const pageOptions = {
        sizePerPage: 15,
        totalSize: TableListData.length, // replace later with size(users),
        custom: true,
    };
    const defaultSorted = [
        {
            dataField: "Name", // if dataField is not match to any column you defined, it will be ignored.
            order: "asc", // desc or asc
        },
    ];

    const pagesListColumns = [
        {
            text: "ItemName",
            dataField: "ItemName",
            sort: true,
        },
        {
            text: "Opening Balance",
            dataField: "OpeningBalance",
            sort: true,
        },
        {
            text: "GRN",
            dataField: "GRNInward",
            sort: true,
        },
        {
            text: "Sales",
            dataField: "Sale",
            sort: true,
        },
        {
            text: "Closing Balance",
            dataField: "ClosingBalance",
            sort: true,
        },

    ];
    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>PosSale List| FoodERP</title>
                </MetaTags>

                <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                >
                    {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                            keyField="id"
                            data={TableListData}
                            columns={pagesListColumns}
                            search
                        >
                            {toolkitProps => (
                                <React.Fragment>
                                    <Breadcrumbs
                                        title={"Count :"}
                                        breadcrumbItem={"Stock Report"}
                                        IsButtonVissible={false}
                                        SearchProps={toolkitProps.searchProps}
                                        breadcrumbCount={TableListData.length}
                                        RedirctPath={"/company"}
                                        IsSearch={true}
                                    />
                                    <hr></hr>
                                    <Row>
                                        <Col md={1}>
                                            <div className="mb-1 text-center">
                                                <label htmlFor="horizontal-toDate-input" className="col-ls-6 col-form-label">From Date</label>
                                            </div>
                                        </Col>
                                        <Col md={2}>
                                            <div className="mb-2">
                                                <Input
                                                    type="date"
                                                    defaultValue={currentDate}
                                                    id="fromDate-input"
                                                />
                                            </div>
                                        </Col>
                                        <Col md={1}>
                                            <div className="mb-3 text-center">
                                                <label htmlFor="horizontal-Form-input" className="col-ls-6 col-form-label">To Date</label>
                                            </div>
                                        </Col>
                                        <Col md={2}>
                                            <div className="mb-3">
                                                <Input
                                                    className="form-control"
                                                    type="date"
                                                    defaultValue={currentDate}
                                                    id="toDate-input"
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-3 align-left">
                                                <button className="btn btn-outline-success" type="button"
                                                    onClick={() => { SelectDate_GO_Button_Handller() }}
                                                >GO</button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl="12">
                                            <div className="table-responsive">
                                                <BootstrapTable
                                                    keyField={"id"}
                                                    responsive
                                                    bordered={false}
                                                    striped={false}
                                                    defaultSorted={defaultSorted}
                                                    classes={"table  table-bordered"}
                                                    {...toolkitProps.baseProps}
                                                    {...paginationTableProps}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="align-items-md-center mt-30">
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                            <PaginationListStandalone
                                                {...paginationProps}
                                            />
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            )}
                        </ToolkitProvider>
                    )}
                </PaginationProvider>
            </div >
        </React.Fragment >
    );
};

export default PosStockReport;



