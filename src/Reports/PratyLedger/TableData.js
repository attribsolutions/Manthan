
export const columns = [
    "Date",
    "Document No",
    "Particular",
    "Amount ",
    "ReceiptAmount",
    "Cash",
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
    let Gst = 0
    let TotalCash = 0
    let TotalInQuantity = 0
    let TotalOutQuantity = 0
    let TotalRecieptAmount = 0
    let TotalBalance = 0
    let TotalInAmount = 0

    InvoiceItems.forEach((element, key) => {
        const tableitemRow = [
            element.Date,
            element.DocumentNO,
            element.Particular,
            element.Amount,
            element.RecieptAmount,
            element.Cash,
            element.Balance,

        ];

        function totalLots() {
            TotalInAmount = Number(TotalInAmount) + Number(element.Amount)
            TotalRecieptAmount = Number(TotalRecieptAmount) + Number(element.RecieptAmount)
            TotalCash = Number(TotalCash) + Number(element.Cash)
            TotalBalance = Number(TotalBalance) + Number(element.Balance)
            // let cgst = data["tableTot"].TotalCGst
            // return ({ TotalCGst: parseInt(totalCGst) + parseInt(cgst)})
        };

        function totalrow() {
            return [
                " ",
                " ",
                "Total",
                `${Number(TotalInAmount).toFixed(2)}`,
                `${Number(TotalRecieptAmount).toFixed(2)}`,
                `${Number(TotalCash).toFixed(2)}`,
                ""


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
        if (key === InvoiceItems.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}
export const ReportFotterColumns = [
    "SGST",
    "CGST", "Quantity",
    "GST % ",
    "TaxbleAmt.", "IGST", "Total Amt"
];

export const ReportHederRows = (data) => {
    var reportArray = [
        [`${data.Distributor}`, `Opening Balance${data.Open}`],
        [`${data.CustomerName}`, `Closing Balance${data.Close}`],
        // [],
        // [,,`INR NO :${data.FullInvoiceNumber}`]
    ]
    return reportArray;
}