
export const columns = [
    "Date",
    "Name",
    "Document No",
    "GRN",
    "Sales Return",
    "Stock",
    "Sale",
    "Purchase Return",
    "Balance",

];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {

    // InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalIssueQuanity = 0
    let TotalInQuantity = 0
    let TotalOutQuantity = 0
    let TotalBalance = 0


    data.forEach((element, key) => {
        let Unit = data.Period.Unit.label
        let GRN = ""
        let SalesReturn = ""
        let Stock = ""
        let Sale = ""
        let PurchaseReturn = ""

        if (Unit === "No") {
            GRN = element.QtyInNo
            SalesReturn = element.QtyInNo
            Stock = element.QtyInNo
            Sale = element.QtyInNo
            PurchaseReturn = element.QtyInNo
        }

        if (Unit === "Kg") {
            GRN = element.QtyInNo
            SalesReturn = element.QtyInNo
            Stock = element.QtyInNo
            Sale = element.QtyInNo
            PurchaseReturn = element.QtyInNo
        }
        if (Unit === "Box") {
            GRN = element.QtyInNo
            SalesReturn = element.QtyInNo
            Stock = element.QtyInNo
            Sale = element.QtyInNo
            PurchaseReturn = element.QtyInNo
        }


        const tableitemRow = [
            element.TransactionDate,
            element.Name,
            element.TransactionNumber,
            (element.Sequence === 1) ? GRN : null,
            (element.Sequence === 2) ? SalesReturn : null,
            (element.Sequence === 3) ? Stock : null,
            (element.Sequence === 4) ? Sale : null,
            (element.Sequence === 4) ? PurchaseReturn : null,

        ];

        function totalLots() {
            TotalInQuantity = Number(TotalInQuantity) + Number(element.InQuantity)
            TotalOutQuantity = Number(TotalOutQuantity) + Number(element.OutQuantity)
            TotalIssueQuanity = Number(TotalIssueQuanity) + Number(element.IssueQuanity)
            TotalBalance = Number(TotalBalance) + Number(element.Balance)

        };

        function totalrow() {
            return [
                " ",
                " ",
                "Total",
                `Total :${parseFloat(TotalInQuantity).toFixed(2)}`,
                `Total :${parseFloat(TotalOutQuantity).toFixed(2)}`,
                `Total :${parseFloat(TotalIssueQuanity).toFixed(2)}`,
                `Balance:${parseFloat(TotalBalance).toFixed(2)}`,


            ];
        };


        if (Gst === 0) { Gst = element.GSTPercentage };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }

        else {
            // returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            data["tableTot"] = totalLots()
        }
        if (key === data.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const ReportHederRows = (data) => {
    var reportArray = [
        [`                   ${data.CustomerName}`, `              : ${data.ItemName}`,],
        [`            maharashtra `, `                    ${data.InvoiceDate}`, `                          ${data.Open}`],
        [`                  f23dfxxxxxwe55`, `                ${data.Todate}`, `                           ${data.Close}`],
    ]
    return reportArray;
}