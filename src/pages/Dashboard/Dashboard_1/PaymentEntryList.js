import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { ReceiptListAPI } from '../../../store/Accounting/Receipt/action';
import { currentDate_ymd, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import * as url from "../../../routes/route_url";
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
import "./table1.scss";

export default function PaymentEntryList() {

    const dispatch = useDispatch();

    const { tableList, } = useSelector((state) => ({
        tableList: state.ReceiptReducer.ReceiptList,
    }));

    useEffect(() => {
        const jsonBody = JSON.stringify({
            FromDate: currentDate_ymd,
            ToDate: currentDate_ymd,
            CustomerID: "",
            PartyID: loginPartyID(),
            ReceiptType: 30,
        });
        dispatch(ReceiptListAPI(jsonBody, url.PAYMENT_ENTRY_LIST));
    }, [])


    const pagesListColumns = [
        {
            text: "Date",
            dataField: "ReceiptDate",
        },
        {
            text: "FullReceiptNumber",
            dataField: "FullReceiptNumber",
        },
        {
            text: "AmountPaid",
            dataField: "AmountPaid",
            align: "right"
        },
        {
            text: "DocumentNo",
            dataField: "Cheque No",
        },
        {
            text: "ChequeDate",
            dataField: "ChequeDate",
        },
    ];

    return (

        <ToolkitProvider

            keyField="Invoice"
            data={tableList}
            columns={pagesListColumns}
            search
        >
            {toolkitProps => (
                <React.Fragment>
                    <div className="table-container">
                        <BootstrapTable
                            keyField={"Invoice"}
                            bordered={true}
                            striped={false}
                            noDataIndication={<div className="text-danger text-center ">Record Not available</div>}
                            classes={"table align-middle table-nowrap table-hover"}
                            headerWrapperClasses={"thead-light"}

                            {...toolkitProps.baseProps}

                        />

                        {mySearchProps(toolkitProps.searchProps)}
                    </div>

                </React.Fragment>
            )
            }
        </ToolkitProvider>
    )
}

