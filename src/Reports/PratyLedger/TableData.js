import { date_dmy_func } from "../../components/Common/CommonFunction";
import { numberWithCommas } from "../Report_common_function";

export const columns = [
    "Date",
    "Document No",
    "Particular",
    "DR-Amount ",
    "CR-Amount ",
    "Balance",
];
export const PageHedercolumns = [
    "Distributor",
    "Customer"
]
export const Rows = (data) => {

    const { InvoiceItems = [] } = data
    InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let TotalCash = 0
    let TotalInQuantity = 0
    let TotalOutQuantity = 0
    let TotalRecieptAmount = 0
    let TotalBalance = 0
    let TotalInAmount = 0

    InvoiceItems.forEach((element, key) => {
      
        const tableitemRow = [
            date_dmy_func(element.Date),
            element.DocumentNO,
            element.Particular,
            element.Amount,
            element.RecieptAmount,
            Number(element.Balance).toFixed(2),

        ];

        function totalLots() {
            TotalInAmount = Number(TotalInAmount) + Number(element.Amount)
            TotalRecieptAmount = Number(TotalRecieptAmount) + Number(element.RecieptAmount)
            TotalCash = Number(TotalCash) + Number(element.Cash)
            TotalBalance = Number(TotalBalance) + Number(element.Balance)
        };

        function totalrow() {
            return [
                " ",
                " ",
                "Monthly Total",
                `${numberWithCommas(Number(TotalInAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalRecieptAmount).toFixed(2))}`,
                ""
            ];
        };


        function OpeningBalance() {
            return [
                " ",
                " ",
                "Opening Balance",
                ``,
                "",
                `${numberWithCommas(Number(data.Open).toFixed(2))}`,
            ];
        };

        function ClosingBalance() {
            return [
                " ",
                " ",
                "Closing Balance",
                ``,
                "",
                `${numberWithCommas(Number(data.Close).toFixed(2))}`,
            ];
        };

        function TaxFreeSale() {
            return [
                " ",
                " ",
                "Tax Free Sale",
                `${numberWithCommas(Number(data.TaxFreeSale).toFixed(2))}`,
                "",
                ``,
            ];
        };
        function Taxablesale5() {
            return [
                " ",
                " ",
                "Taxable sale 5.00 %",
                `${numberWithCommas(Number(data.TaxableSale5).toFixed(2))}`,
                "",
                ``,
            ];
        }; function Tax5() {
            return [
                " ",
                " ",
                "Tax 5.00 %",
                `${numberWithCommas(Number(data.GSTAmount5).toFixed(2))}`,
                "",
                ``,
            ];
        }; function Taxablesale12() {
            return [
                " ",
                " ",
                "Taxable sale 12.00 %",
                `${numberWithCommas(Number(data.TaxableSale12).toFixed(2))}`,
                "",
                ``,
            ];
        }; function Tax12() {
            return [
                " ",
                " ",
                "Tax 12.00 %",
                `${numberWithCommas(Number(data.GSTAmount12).toFixed(2))}`,
                "",
                ``,
            ];
        }; function Taxablesale18() {
            return [
                " ",
                " ",
                "Taxable sale 18.00 %",
                `${numberWithCommas(Number(data.TaxableSale18).toFixed(2))}`,
                "",
                ``,
            ];
        };
        function Tax18() {
            return [
                " ",
                " ",
                "Tax 18.00 %",
                `${numberWithCommas(Number(data.GSTAmount18).toFixed(2))}`,
                "",
                ``,
            ];
        };
        function TotalTaxableScale() {
            return [
                " ",
                " ",
                "Total Taxable Scale",
                `${numberWithCommas(Number(data.TotalTaxableSale).toFixed(2))}`,
                "",
                ``,
            ];
        };
        function TotalCreditNote() {
            return [
                " ",
                " ",
                "Total Credit Note",
                "",
                `${numberWithCommas(Number(data.TotalCreditNote).toFixed(2))}`,
                ``,
            ];
        };
        function TotalDebitNote() {
            return [
                " ",
                " ",
                "Total Debit Note",
                `${numberWithCommas(Number(data.TotalDebitNote).toFixed(2))}`,
                ``,
                ``,
            ];
        };
        function TotalTCS() {
            return [
                " ",
                " ",
                "Total TCS",
                `${numberWithCommas(Number(data.TotalTCS).toFixed(2))}`,
                "",
                ``,
            ];
        };

        function BlankRow() {
            return [
                " ",
                " ",
                "",
                ``,
                "",
                ``,
            ];
        };



        if (key === 0) {
            returnArr.push(OpeningBalance());
        }
        returnArr.push(tableitemRow);
        data["tableTot"] = totalLots()
        if (key === InvoiceItems.length - 1) {
            returnArr.push(totalrow());
            returnArr.push(ClosingBalance());
            returnArr.push(BlankRow());
            returnArr.push(TaxFreeSale());
            returnArr.push(Taxablesale5());
            returnArr.push(Tax5());
            returnArr.push(Taxablesale12());
            returnArr.push(Tax12());
            returnArr.push(Taxablesale18());
            returnArr.push(Tax18());
            returnArr.push(TotalTaxableScale());
            returnArr.push(TotalCreditNote());
            returnArr.push(TotalDebitNote());
            returnArr.push(TotalTCS());

        }
    })


    return returnArr;
}
export const ReportHederRows = (data) => {
    var reportArray = [
        [`In the books of ${data.Distributor}`],
        [`Party Name : ${data.CustomerName}`, ` PAN No : ${data.DistributorPAN}`],
        [`PAN No : ${data.CustomerPAN}`, `GSTIN :${data.DistributorGSTIN}`],
        [`GSTIN :${data.CustomerGSTIN}`, `Opening Balance:  ${numberWithCommas(Number(data.Open).toFixed(2))}`],
        [`Period : ${date_dmy_func(data.FormDate)} to ${date_dmy_func(data.ToDate)}`, `Closing Balance:  ${numberWithCommas(Number(data.Close).toFixed(2))}`]

    ]

    return reportArray;
}