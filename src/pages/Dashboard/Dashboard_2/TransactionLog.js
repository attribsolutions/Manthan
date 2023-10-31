


// import React, { useEffect, useState } from 'react';
// import ToolkitProvider from "react-bootstrap-table2-toolkit";
// import BootstrapTable from "react-bootstrap-table-next";
// import { convertDateTime_ydm, date_ymd_func, getDateTime_dmy, loginPartyID } from '../../../components/Common/CommonFunction';
// import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import { order_Type } from '../../../components/Common/C-Varialbes';
// import { getOrderListPage, getOrderListPageSuccess } from '../../../store/Purchase/OrderPageRedux/actions';
// import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
// import { Button, Col, Row, Spinner } from 'reactstrap';
// import { makeGRN_Mode_1Action } from '../../../store/Inventory/GRNRedux/actions';
// import { mode, url } from "../../../routes/index";
// import SimpleBar from "simplebar-react"
// import { TransactionLog_Go_Btn_Api } from '../../../helpers/backend_helper';

// export default function TransactionLog() {
//     const [formDateSelect, setformDateSelect] = useState(getCurrentDateTimeMinus15Minutes); // offSetTime 1 hour earlier
//     const [toDateSelect, settoDateSelect] = useState(getCurrentDateTime);
//     const [tableData, setTableData] = useState([]);


//     const dispatch = useDispatch();
//     const history = useHistory();
//     const currentDate_ymd = date_ymd_func();

//     const { GRNitem, listBtnLoading, commonPartyDropSelect } = useSelector((state) => ({
//         GRNitem: state.GRNReducer.GRNitem,
//         listBtnLoading: state.GRNReducer.listBtnLoading,
//         commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
//     }));

//     function getCurrentDateTime() {
//         const now = new Date();
//         const day = now.getDate().toString().padStart(2, '0');
//         const month = (now.getMonth() + 1).toString().padStart(2, '0');
//         const year = now.getFullYear();
//         const hours = now.getHours().toString().padStart(2, '0');
//         const minutes = now.getMinutes().toString().padStart(2, '0');

//         return `${day}-${month}-${year} ${hours}:${minutes}`;
//     }

//     function getCurrentDateTimeMinus15Minutes() {
//         const now = new Date();
//         now.setMinutes(now.getMinutes() - 2);

//         const day = now.getDate().toString().padStart(2, '0');
//         const month = (now.getMonth() + 1).toString().padStart(2, '0');
//         const year = now.getFullYear();
//         const hours = now.getHours().toString().padStart(2, '0');
//         const minutes = now.getMinutes().toString().padStart(2, '0');

//         return `${day}-${month}-${year} ${hours}:${minutes}`;
//     }

//     useEffect(() => {

//         const fetchData = async () => {
//             let FromDate = getCurrentDateTimeMinus15Minutes()
//             let ToDate = getCurrentDateTime()
//             setformDateSelect(FromDate)
//             settoDateSelect(ToDate)
//             console.log("formDateSelect", FromDate)
//             console.log("toDateSelect", ToDate)
//             const jsonBody = JSON.stringify({
//                 "FromDate": convertDateTime_ydm(FromDate),
//                 "ToDate": convertDateTime_ydm(ToDate),
//                 "TransactionType": '',
//                 "User": '',
//                 "Party": '',
//             });

//             const resp3 = await TransactionLog_Go_Btn_Api({ jsonBody });

//             if (resp3.StatusCode === 200) {

//                 setTableData(resp3.Data);
//             }
//         };

//         // Use setInterval to call fetchData every 5 seconds
//         const intervalId = setInterval(fetchData, 2000);

//         // Call fetchData initially when the component mounts
//         fetchData();

//         // Clean up the interval when the component unmounts
//         return () => {
//             clearInterval(intervalId);
//         };

//     }, []);

//     const tableColumns = [
//         {
//             text: "Transaction Date",
//             dataField: "TransactionDate",
//             sort: true,
//         }, {
//             text: "Employee Name (User Name)",
//             dataField: "UserName",
//             sort: true
//         }, {
//             text: "IP Address",
//             dataField: "IPaddress",
//             sort: true
//         },
//         {
//             text: "Transaction Type",
//             dataField: "TransactionType",
//             sort: true
//         },
//         {
//             text: "Transaction Detail",
//             dataField: "TransactionDetails",
//             sort: true
//         },
//         {
//             text: "Party Name",
//             dataField: "PartyName",
//             sort: true
//         },
//         {
//             text: "Customer Name",
//             dataField: "CustomerName",
//             sort: true
//         },
//     ]

//     return (
//         <ToolkitProvider
//             keyField={"id"}
//             data={tableData}
//             columns={tableColumns}
//             search
//         >
//             {(toolkitProps) => (
//                 <React.Fragment>
//                     <Row>
//                         <Col xl="12">
//                             <SimpleBar className="table-responsive" style={{ maxHeight: "352px" }}>
//                                 <BootstrapTable
//                                     keyField={"id"}
//                                     id="table_Arrow"
//                                     classes={"table table-bordered table-hover"}
//                                     noDataIndication={
//                                         <div className="text-danger text-center ">
//                                             Record Not available
//                                         </div>
//                                     }
//                                     {...toolkitProps.baseProps}
//                                 />
//                             </SimpleBar>
//                         </Col>
//                     </Row>
//                 </React.Fragment>
//             )}
//         </ToolkitProvider>
//     )
// }


import React, { useEffect, useState, useRef } from 'react';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { convertDateTime_ydm, date_ymd_func } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Spinner } from 'reactstrap';
import { TransactionLog_Go_Btn_Api } from '../../../helpers/backend_helper';
import SimpleBar from "simplebar-react"


export default function TransactionLog() {
    const [formDateSelect, setformDateSelect] = useState(getCurrentDateTimeMinus15Minutes);
    const [toDateSelect, settoDateSelect] = useState(getCurrentDateTime);
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
