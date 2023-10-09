import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { ReceiptListAPI, ReceiptListAPISuccess } from '../../../store/Accounting/Receipt/action';
import { currentDate_ymd, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import * as url from "../../../routes/route_url";
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
import SimpleBar from "simplebar-react"
import "./table1.scss";

export default function PaymentEntryList() {

    const dispatch = useDispatch();

    const { tableList, commonPartyDropSelect } = useSelector((state) => ({
        tableList: state.ReceiptReducer.ReceiptList,
        commonPartyDropSelect: state.CommonPartyDropdownReducer.commonPartyDropSelect
    }));

    useEffect(() => {

    }, [])

    // Common Party Dropdown useEffect
    useEffect(() => {

        if (commonPartyDropSelect.value > 0) {
            const jsonBody = JSON.stringify({
                FromDate: currentDate_ymd,
                ToDate: currentDate_ymd,
                CustomerID: "",
                PartyID: commonPartyDropSelect.value,
                ReceiptType: 30,
            });
            dispatch(ReceiptListAPI(jsonBody, url.PAYMENT_ENTRY_LIST));
        }
        return () => {
            dispatch(ReceiptListAPISuccess([]))
        }

    }, [commonPartyDropSelect]);

    const pagesListColumns = [
        {
            text: "Date",
            dataField: "dashboardReceiptDate",
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
                    {/* <div className="table-container"> */}
                    <SimpleBar className="table-responsive " style={{ maxHeight: "352px" }}>

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
                    {/* </div> */}
                    </SimpleBar>

                </React.Fragment>
            )
            }
        </ToolkitProvider>
    )
}

