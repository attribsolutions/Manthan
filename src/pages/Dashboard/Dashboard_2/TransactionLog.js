import React, { useEffect, useState } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { convertDateTime_ydm, date_ymd_func, getDateTime_dmy, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { order_Type } from '../../../components/Common/C-Varialbes';
import { getOrderListPage, getOrderListPageSuccess } from '../../../store/Purchase/OrderPageRedux/actions';
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
import { Button, Col, Row, Spinner } from 'reactstrap';
import { makeGRN_Mode_1Action } from '../../../store/Inventory/GRNRedux/actions';
import { mode, url } from "../../../routes/index";
import SimpleBar from "simplebar-react"
import { TransactionLog_Go_Btn_Api } from '../../../helpers/backend_helper';



export default function TransactionLog() {

    const [formDateSelect] = useState(() => getDateTime_dmy(1));//offSetTime 1 hour earlier
    const [toDateSelect] = useState(getDateTime_dmy);
    const [tableData, setTableData] = useState([]);



    const dispatch = useDispatch();
    const history = useHistory();
    const currentDate_ymd = date_ymd_func();

    const { tableList, GRNitem, listBtnLoading, commonPartyDropSelect } = useSelector((state) => ({
        tableList: state.OrderReducer.orderList,
        GRNitem: state.GRNReducer.GRNitem,
        listBtnLoading: state.GRNReducer.listBtnLoading,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));


    const TableListWithNonDeleteRecord = tableList.filter(i => i.IsRecordDeleted === false);


    useEffect(() => {

        const fetchData = async () => {

            const jsonBody = JSON.stringify({
                "FromDate": convertDateTime_ydm(formDateSelect),
                "ToDate": convertDateTime_ydm(toDateSelect),
                "TransactionType": '',
                "User": '',
                "Party": '',
            });

            const resp3 = await TransactionLog_Go_Btn_Api({ jsonBody });

            if (resp3.StatusCode === 200) {
                debugger
                setTableData(resp3.Data);
            }
        };

        // Use setInterval to call fetchData every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Call fetchData initially when the component mounts
        fetchData();

        // Clean up the interval when the component unmounts or when the dependencies change
        return () => {
            clearInterval(intervalId);
        };
    }, []);



    const tableColumns = [
        {
            text: "Transaction Date",
            dataField: "TransactionDate",
            sort: true
        }, {
            text: "Employee Name (User Name)",
            dataField: "UserName",
            sort: true
        }, {
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

    ]


    return (
        <ToolkitProvider
            keyField={"id"}
            // defaultSorted={defaultSorted}
            data={tableData}
            columns={tableColumns}
            search
        >
            {(toolkitProps,) => (
                <React.Fragment>
                    <Row>
                        <Col xl="12">
                            <SimpleBar className="table-responsive " style={{ maxHeight: "352px" }}>
                                <BootstrapTable
                                    keyField={"id"}
                                    id="table_Arrow"
                                    classes={"table  table-bordered table-hover"}
                                    noDataIndication={
                                        <div className="text-danger text-center ">
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
    )
}

