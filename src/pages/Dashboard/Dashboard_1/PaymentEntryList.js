import React, { useEffect } from 'react'
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { ReceiptListAPI } from '../../../store/Accounting/Receipt/action';
import { currentDate_ymd, loginPartyID } from '../../../components/Common/CommonFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as url from "../../../routes/route_url";
import { mySearchProps } from '../../../components/Common/SearchBox/MySearch';
import "./table1.scss";

export default function PaymentEntryList() {

    const dispatch = useDispatch();
    const history = useHistory();

    const { tableList, } = useSelector((state) => ({
        tableList: state.ReceiptReducer.ReceiptList,
    }));

    // let tableList = [
    //     {
    //         id: 1,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE1",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "756.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T11:34:56.905875"
    //     },
    //     {
    //         id: 2,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE2",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T13:00:41.516093"
    //     },
    //     {
    //         id: 3,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 4,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 5,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 6,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 7,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 8,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 9,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 10,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 11,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 12,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },

    //     {
    //         id: 13,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 14,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 15,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     }
    //     ,
    //     {
    //         id: 16,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },
    //     {
    //         id: 17,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     },

    //     {
    //         id: 18,
    //         ReceiptDate: "2023-06-16",
    //         FullReceiptNumber: "RE3",
    //         CustomerID: 13,
    //         Customer: "Demo SS",
    //         PartyID: 97,
    //         Party: "Demo DD",
    //         Description: "zsdfadfa",
    //         ReceiptMode: 31,
    //         ReceiptModeName: "Cash",
    //         ReceiptType: 30,
    //         ReceiptTypeName: "Payment Entry",
    //         AmountPaid: "1000.000",
    //         DocumentNo: "",
    //         BalanceAmount: null,
    //         OpeningBalanceAdjusted: null,
    //         ChequeDate: "",
    //         Bank: null,
    //         BankName: null,
    //         DepositorBank: null,
    //         DepositorBankName: null,
    //         CreatedBy: 57,
    //         CreatedOn: "2023-06-16T16:27:17.534320"
    //     }
    // ]

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

