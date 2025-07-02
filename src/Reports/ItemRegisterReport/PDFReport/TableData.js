import { convertOnlyTimefunc, date_dmy_func, getFixedNumber, loginUserDetails } from "../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../Report_common_function";

export const columns = [
    "Date",
    "Name",
    "Document No",
    "Document Type",
    "In Qty",
    "Out Qty",
    "Balance",

];





export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]






export const Rows = (data) => {

    const openingBalance = Number(data[data.length - 1].OpeningBalance);

    // InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];

    let TotalQuantityIn = 0
    let TotalQuantityOut = 0
    let TotalBalance = 0
    let Unit = data.Period.Unit.label
    let BalanceAmount = Number(openingBalance)

    data.forEach((element, key) => {

        let RowQuantityIn = 0
        let RowQuantityOut = 0

        if (Unit === "No") {
            RowQuantityIn = Number(element.QtyInNo)
            RowQuantityOut = Number(element.QtyInNo)
        }
        if (Unit === "Kg") {
            RowQuantityIn = Number(element.QtyInKg)
            RowQuantityOut = Number(element.QtyInKg)
        }
        if (Unit === "Box") {
            RowQuantityIn = Number(element.QtyInBox)
            RowQuantityOut = Number(element.QtyInBox)
        }

        if (element.Sequence === 1) {
            element.QuantityIn = RowQuantityIn
            element.QuantityOut = 0
            element.DocumentType = "GRN"
            element.QuantityType = "In"
        } if (element.Sequence === 2) {
            element.QuantityIn = RowQuantityIn
            element.QuantityOut = 0
            element.DocumentType = "SalesReturn"
            element.QuantityType = "In"
        } if (element.Sequence === 3) {
            element.QuantityIn = RowQuantityIn
            element.QuantityOut = 0
            element.DocumentType = "Stock"
            element.QuantityType = "In"
        } if (element.Sequence === 4) {
            element.QuantityOut = RowQuantityOut
            element.QuantityIn = 0
            element.DocumentType = "Sale"
            element.QuantityType = "Out"
        } if (element.Sequence === 5) {
            element.QuantityOut = RowQuantityOut
            element.QuantityIn = 0
            element.DocumentType = "Purchase Return"
            element.QuantityType = "Out"
        } if (element.Sequence === 6) {
            element.DocumentType = "StockAdjustment"
            element.QuantityIn = RowQuantityIn
            element.QuantityOut = 0
            element.QuantityType = "In"
        } if (element.Sequence === 7) {
            element.QuantityIn = RowQuantityIn
            element.QuantityOut = 0
            element.DocumentType = "Production"
            element.QuantityType = "In"
        } if (element.Sequence === 8) {
            element.QuantityOut = RowQuantityOut
            element.QuantityIn = 0
            element.DocumentType = "IB Sale"
            element.QuantityType = "Out"
        } if (element.Sequence === 9) {
            element.QuantityIn = RowQuantityIn
            element.QuantityOut = 0
            element.DocumentType = "IB Purchase"
            element.QuantityType = "In"
        } if (element.Sequence === 10) {
            element.QuantityOut = RowQuantityOut
            element.QuantityIn = 0
            element.DocumentType = "Material Issue"
            element.QuantityType = "Out"
        }


        if (element.TransactionNumber === "STOCK") {
            BalanceAmount = element.QuantityIn
        } else {
            BalanceAmount = (BalanceAmount + element.QuantityIn) - (element.QuantityOut);
        }
        const tableitemRow = [
            `${date_dmy_func(element.TransactionDate)} ${convertOnlyTimefunc(element.CreatedOn)}`,
            element.Name,
            element.TransactionNumber,
            element.DocumentType,
            (element.QuantityType === "In") ? (numberWithCommas(Number(RowQuantityIn).toFixed(2))) : "",
            (element.QuantityType === "Out") ? (numberWithCommas(Number(RowQuantityOut).toFixed(2))) : "",
            numberWithCommas(Number(BalanceAmount).toFixed(2))
        ];

        function totalLots() {
            TotalQuantityOut = Number(TotalQuantityOut) + Number(element.QuantityOut)
            TotalQuantityIn = Number(TotalQuantityIn) + Number(element.QuantityIn)
            TotalBalance = Number(TotalBalance) + Number(BalanceAmount)
        };

        if (key === data.length - 3) {
            data["Close"] = BalanceAmount
        }



        function totalopen() {
            return [
                `Opening Balance: ${data[data.length - 1].OpeningBalance}`,
                "",
                "Total",
                ``,
                ``,
                ``,
                ``,


            ];
        };

        function totalclose() {
            return [
                `Closing Balance: ${data[data.length - 1].ClosingBalance}`,
                "",
                "Total",
                ``,
                ``,
                ``,
                ``,


            ];
        };


        // if (Gst === 0) { Gst = element.GSTPercentage };
        // let aa = { TotalCGst: 0, totalSGst: 0 }
        // if (data["tableTot"] === undefined) { data["tableTot"] = aa }

        // else {
        //     // returnArr.push(totalrow());
        if (key === 0) {
            returnArr.push(totalopen());
        }
        if (key !== data.length - 1) {
            returnArr.push(tableitemRow);
            totalLots()
        }

        if (key === data.length - 2) {
            returnArr.push(totalclose())

        }

    })
    return returnArr;
}


export const ReportHederRows = (data) => {

    const UserDetails = loginUserDetails()
    var reportArray = [
        [`                   ${UserDetails.PartyName}`, `              : ${data.Period.ItemName}`,],
        [`                       ${date_dmy_func(data.Period.FromDate)}`, `                    ${date_dmy_func(data.Period.ToDate)}`,],
        // [`                  `, ,],
    ]
    return reportArray;
}