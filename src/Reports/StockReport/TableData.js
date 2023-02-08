
export const columns = [
    "Item Name",
    "Opening balance",
    "GRN",
    "InterBranch/return ",
    "Prod'n Quantity",
    "Total Quantity",
    "Dispatch",
    "Sales/Purchase",
    "Prod'n Issue/Reproduction",
    "Closing balance",
    "Actual Stock",
    "Difference",

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
    let totalBasicAmount = 0
    let totalCGst = 0
    let totalSGst = 0
    let totalAmount = 0
    let totalQuantity = 0

    InvoiceItems.forEach((element, key) => {
        const tableitemRow = [
            element.ItemName,
            `${element.Quantity} ${element.UnitName}`,
            element.Rate,
            element.BasicAmount,
            element.CGSTPercentage,
            element.CGST,
            element.SGSTPercentage,
            element.SGST,
            element.Amount,
            element.GSTPercentage,
            element.GSTAmount,
            "row"
        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalCGst = Number(totalCGst) + Number(element.CGST)
            totalSGst = Number(totalSGst) + Number(element.SGST)
            totalAmount = Number(totalAmount) + Number( element.Amount)
            let cgst = data["tableTot"].TotalCGst
            return ({ TotalCGst: parseInt(totalCGst) + parseInt(cgst)})
        };

        function totalrow() {
            return [
                `Total Quantity:${parseFloat(totalQuantity).toFixed(2)}`,
                " ",
                `BasicAmount:${parseFloat(totalBasicAmount).toFixed(2)}`,
                "",
                `TotalCGST:${parseFloat(totalCGst).toFixed(2)}`,
                "isaddition",
                `TotalSGST:${parseFloat(totalSGst).toFixed(2)}`,
                "",
                `Amount:${parseFloat(totalAmount).toFixed(2)}`,
            ];
        };


        if (Gst === 0) { Gst = element.GSTPercentage };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }
        if ((Gst === element.GSTPercentage)) {
            data["tableTot"] = totalLots()
            returnArr.push(tableitemRow);
        }
        else {
            returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            totalBasicAmount = 0
            totalCGst = 0
            totalSGst = 0
            totalAmount = 0
            totalQuantity = 0

            data["tableTot"] = totalLots()
            Gst = element.GSTPercentage;
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
        // [, ,],
        [`${data.CustomerName}`, ,`Current Time: ${data.Time}`],
        [`maharashtra`, , `From Date:  ${data.InvoiceDate}`],
        [`FSSAI :f23dfxxxxxwe55`, ,`To Date:      ${data.Todate}`],
        // [,,`INR NO :${data.FullInvoiceNumber}`]
    ]
    return reportArray;
}