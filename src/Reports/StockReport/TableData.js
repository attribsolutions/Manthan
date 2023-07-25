
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
    let TotalOpeningBalance = 0
    let TotalClosingBalance = 0
    let TotalGRNInward = 0
    let TotalSalesReturn = 0
    let TotalSale = 0
    let TotalPurchaseReturn = 0


    StockDetails.forEach((element, key) => {
        const tableitemRow = [
            element.ItemName,
            element.GroupName,
            element.GroupTypeName,
            element.SubGroupName,
            element.OpeningBalance,
            element.GRNInward,
            element.SalesReturn,
            element.Sale,
            element.PurchaseReturn,
            element.ClosingBalance,
            element.ActualStock,
        ];

        function totalLots() {
            TotalOpeningBalance = Number(TotalOpeningBalance) + Number(element.OpeningBalance)
            TotalClosingBalance = Number(TotalClosingBalance) + Number(element.ClosingBalance)
            TotalGRNInward = Number(TotalGRNInward) + Number(element.GRNInward)
            TotalSalesReturn = Number(TotalSalesReturn) + Number(element.SalesReturn)
            TotalSale = Number(TotalSale) + Number(element.Sale)
            TotalPurchaseReturn = Number(TotalPurchaseReturn) + Number(element.PurchaseReturn)
        };

        function totalrow() {
            return [
                `Total`,
                ``,
                ``,
                ``,
                `${TotalOpeningBalance}`,
                `${TotalGRNInward}`,
                `${TotalSalesReturn}`,
                `${TotalSale}`,
                `${TotalPurchaseReturn}`,
                `${TotalClosingBalance}`,
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
        if ((Item === element.Item)) {
            // returnArr.push(totalrow());
            // returnArr.push(materialRow());
            returnArr.push(tableitemRow);
            data["tableTot"] = totalLots()

        }
        if (key === StockDetails.length - 1) {
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
        [`From Date:  ${data.FromDate}`,],
        [`To Date:      ${data.ToDate}`],
        // [``, ,],
        // [,,`INR NO :${data.FullInvoiceNumber}`]
    ]
    return reportArray;
}