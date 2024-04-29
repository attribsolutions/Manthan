import React, { useRef } from 'react';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Col, Row } from 'reactstrap';
import SimpleBar from "simplebar-react"



export default function TransactionLog(props) {
    const tableColumns = [
        {
            text: "Transaction Date",
            dataField: "TransactionDate",
        },
        {
            text: "Employee Name (User Name)",
            dataField: "UserName",
            sort: true
        },
        {
            text: "IP Address",
            dataField: "IPaddress",
            sort: true
        },
        {
            text: "Transaction Type",
            dataField: "TransactionType",
            sort: true
        },
        {
            text: "Transaction Detail",
            dataField: "TransactionDetails",
            sort: true
        },
        {
            text: "Party Name",
            dataField: "PartyName",
            sort: true
        },
        {
            text: "Customer Name",
            dataField: "CustomerName",
            sort: true
        },
    ];
    const defaultSorted = [{
        dataField: 'TransactionDate',
        order: 'asc'
    }];


    return (
        <ToolkitProvider keyField={"id"} data={props.logData} columns={tableColumns} search>
            {(toolkitProps) => (
                <React.Fragment>
                    <Row>
                        <Col xl="12">
                            <SimpleBar className="" style={{ maxHeight: "352px" }} >
                                <BootstrapTable
                                    keyField={"id"}
                                    id="table_Arrow"
                                    defaultSorted={defaultSorted}
                                    classes={"table table-bordered table-hover"}
                                    noDataIndication={
                                        <div className="text-danger text-center">
                                            Record Not available
                                        </div>
                                    }
                                    {...toolkitProps.baseProps}
                                />
                            </SimpleBar>
                        </Col>
                    </Row>
                </React.Fragment>
            )}
        </ToolkitProvider>
    );
}
