
export const columns = [
    "Date",
    "Particulars",
    "transaction type",
    "In Quantity ",
    "Out Quantity",
    "Issue Quantity",
    "Balance",
];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    const { InvoiceItems = [] } = data
    InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalIssueQuanity = 0
    let TotalInQuantity = 0
    let TotalOutQuantity = 0
    let TotalBalance = 0
    let totalQuantity = 0

    InvoiceItems.forEach((element, key) => {
        const tableitemRow = [
            element.BatchDate,
            element.Particulars,
            element.TransactionType,
            element.InQuantity,
            element.OutQuantity,
            element.IssueQuanity,
            element.Balance,
           
        ];

        function totalLots() {
            TotalInQuantity = Number(TotalInQuantity) + Number(element.InQuantity)
            TotalOutQuantity = Number(TotalOutQuantity) + Number(element.OutQuantity)
            TotalIssueQuanity = Number(TotalIssueQuanity) + Number( element.IssueQuanity)
            TotalBalance = Number(TotalBalance) + Number(element.Balance)
            // let cgst = data["tableTot"].TotalCGst
            // return ({ TotalCGst: parseInt(totalCGst) + parseInt(cgst)})
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
        [`${data.CustomerName}`, ,`Current Time: ${data.Time}`],
        [`maharashtra`, , `From Date:  ${data.InvoiceDate}`],
        [`FSSAI :f23dfxxxxxwe55`, ,`To Date:      ${data.Todate}`  ],
        // [,,`INR NO :${data.FullInvoiceNumber}`]
    ]
    return reportArray;
}