import React, { useEffect, useState, useRef } from 'react';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { convertDateTime_ydm } from '../../../components/Common/CommonFunction';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { TransactionLog_Go_Btn_Api } from '../../../helpers/backend_helper';


export default function TransactionLog() {
    const [tableData, setTableData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const tableRef = useRef(null);

    const dispatch = useDispatch();

    function getCurrentDateTime() {
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    function getCurrentDateTimeMinus15Minutes() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - 5); // Adjusted to 15 minutes

        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    const fetchData = async () => {
        let FromDate = getCurrentDateTimeMinus15Minutes();
        let ToDate = getCurrentDateTime();

        const jsonBody = JSON.stringify({
            "FromDate": convertDateTime_ydm(FromDate),
            "ToDate": convertDateTime_ydm(ToDate),
            "TransactionType": '',
            "User": '',
            "Party": '',
        });

        const resp3 = await TransactionLog_Go_Btn_Api({ jsonBody });

        if (resp3.StatusCode === 200) {
            setTableData((prevData) => [...prevData, ...resp3.Data]);
        }
    };

    const handleScroll = () => {

        if (tableRef.current.scrollTop + tableRef.current.clientHeight >= tableRef.current.scrollHeight) {

            setPageNumber(pageNumber + 1);
        }
    };

    useEffect(() => {

        if (tableRef.current) {

            tableRef.current.addEventListener('scroll', handleScroll);
        }

        fetchData();

        return () => {
            if (tableRef.current) {
                tableRef.current.removeEventListener('scroll', handleScroll);

            }
        };
    }, [pageNumber]);

    useEffect(() => {
        const scrollSpeed = 3; // Adjust the scroll speed as needed
        const scrollInterval = 50; // Adjust the interval duration as needed

        const scrollContent = () => {
            const scrollElem = tableRef.current;
            scrollElem.scrollTop += scrollSpeed;

            if (scrollElem.scrollTop + scrollElem.clientHeight >= scrollElem.scrollHeight) {

                scrollElem.scrollTop = 0;
            }
        };

        const intervalId = setInterval(scrollContent, scrollInterval);

        return () => {
            clearInterval(intervalId); // Clear the interval when the component unmounts
        };
    }, []);

    const tableColumns = [
        {
            text: "Transaction Date",
            dataField: "TransactionDate",
            // sort: true,
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
        <ToolkitProvider keyField={"id"} data={tableData} columns={tableColumns} search>
            {(toolkitProps) => (
                <React.Fragment>
                    <Row>
                        <Col xl="12">
                            {/* <SimpleBar className="table-responsive " style={{ maxHeight: "352px" }} ref={tableRef}> */}
                            <div
                                className="table-responsive"
                                style={{ maxHeight: "352px", overflow: "auto", }}
                                ref={tableRef}
                            >

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

                            </div>
                            {/* </SimpleBar> */}
                        </Col>
                    </Row>
                </React.Fragment>
            )}
        </ToolkitProvider>
    );
}
