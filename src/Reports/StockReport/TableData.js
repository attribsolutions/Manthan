
export const columns = [
    "Item Name",
    "Group Name",
    "Group Type Name",
    "Sub Group Name",
    "Opening balance",
    "GRN Inward",
    "SalesReturn ",
    "Sale",
    "Purchase Return",
    "Closing balance",
    "Actual Stock",
];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    const { StockDetails = [] } = data
    StockDetails.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Item = 0
    let totalBasicAmount = 0
    let totalCGst = 0
    let totalSGst = 0
    let totalAmount = 0
    let totalQuantity = 0

    StockDetails.forEach((element, key) => {
        const tableitemRow = [
            element.ItemName,
            element.GroupName,
            element.GroupTypeName,
            element.SubGroupName,
            element.OpeningBalance,
            element.GRNInward,
            element.SalesReturn,
            element.Sales,
            element.PurchaseReturn,
            element.ClosingBalance,
            element.ActualStock,
            "row"
        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalCGst = Number(totalCGst) + Number(element.CGST)
            totalSGst = Number(totalSGst) + Number(element.SGST)
            totalAmount = Number(totalAmount) + Number(element.Amount)
            let cgst = data["tableTot"].TotalCGst
            return ({ TotalCGst: parseInt(totalCGst) + parseInt(cgst) })
        };

        function totalrow() {
            return [
                `Raw material`,
                " ",
                ``,
                "",
                ``,
                "isaddition",
                ``,
                "",
                ``,
            ];
        };
        function materialRow() {
            return [
                `Packing Roll`,
                " ",
                ``,
                "",
                ``,
                "packing",
                ``,
                "",
                ``,
            ];
        };


        if (Item === 0) { Item = element.Item };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }
        if ((Item === element.Item)) {
            data["tableTot"] = totalLots()
            // returnArr.push(totalrow());
            // returnArr.push(materialRow());


            returnArr.push(tableitemRow);
        }
        else {
            // returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            totalBasicAmount = 0
            totalCGst = 0
            totalSGst = 0
            totalAmount = 0
            totalQuantity = 0

            data["tableTot"] = totalLots()
            Item = element.Item;
        }
        if (key === StockDetails.length - 1) {
            // returnArr.push(totalrow());
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
        [ `From Date:  ${data.FromDate}`,],
        [ `To Date:      ${data.ToDate}`],
        // [``, ,],
        // [,,`INR NO :${data.FullInvoiceNumber}`]
    ]
    return reportArray;
}