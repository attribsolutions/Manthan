import { groupBy } from "../../components/Common/CommonFunction";

// original
export const columns = [
    "HSN Item Name",
    "Quantity",
    "MRP",
    "Rate",
    "Basic   Amount ",
    "CGST%",
    "CGST   Amount ",
    "SGST%",
    "SGST   Amount",
    "Total Amount"];

export const columnsWithIGST = [
    "HSN Item Name",
    "Quantity",
    "MRP",
    "Rate",
    "Basic   Amount ",
    "IGST%",
    "IGST   Amount ",
    "Total Amount"];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]
export const Footercolumn = [
    "",
]

export const BilledBy = [
    "Billed by",
]
export const BilledTo = [
    "Billed by",
]
export const DetailsOfTransport = [
    "Billed by",
]

export const Rows = (data) => {

    const { OrderItem = [] } = data
    let hasHedRow = []
    const grouped = groupBy(OrderItem, ele => ele.GSTPercentage);
    console.log(grouped)
    grouped.forEach(i => {

        if (i.length > 0) {

            let totalBasicAmount = 0
            let totalCGst = 0
            let totalSGst = 0
            let totalAmount = 0
            let totalQuantity = 0
            let TotalGst = 0
            let GSTPercentage = 0


            i.forEach(element => {
                debugger
                const tableitemRow = [
                    `(${element.HSNCode}) ${element.ItemName}     
                     ${element.Comment === null ? "" : element.Comment}`,
                    `${Number(element.Quantity).toFixed(2)} ${element.PrimaryUnitName}  ${element.UnitName}`,
                    `${element.MRPValue}`,
                    element.Rate,
                    element.BasicAmount,
                    `${element.CGSTPercentage}%`,
                    element.CGST,
                    `${element.SGSTPercentage}%`,
                    element.SGST,
                    element.Amount,
                    "row"
                ];

                totalQuantity = Number(totalQuantity) + Number(element.Quantity)
                totalCGst = Number(totalCGst) + Number(element.CGST)
                totalSGst = Number(totalSGst) + Number(element.SGST)
                TotalGst = totalCGst + totalSGst;
                totalAmount = Number(totalAmount) + Number(element.Amount)
                GSTPercentage = Number(element.CGSTPercentage) + Number(element.SGSTPercentage)
                totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)

                hasHedRow.push(tableitemRow);
            })

            function totalrow() {
                return [
                    ` GST ${(parseFloat(GSTPercentage))}%  Total:${(Number(TotalGst).toFixed(2))}`,
                    "",
                    `${Number(totalBasicAmount).toFixed(2)}`,
                    "",
                    "",
                    `${Number(totalCGst).toFixed(2)}`,
                    "isaddition",
                    `${Number(totalSGst).toFixed(2)}`,
                    "",
                    `${Number(totalAmount).toFixed(2)}`,
                ];
            };
            hasHedRow.push(totalrow());
        }
    })
    return hasHedRow
}

export const RowsWithIGST = (data) => {

    const { OrderItem = [] } = data
    let hasHedRow = []
    const grouped = groupBy(OrderItem, ele => ele.GSTPercentage);
    console.log(grouped)
    grouped.forEach(i => {

        if (i.length > 0) {

            let totalBasicAmount = 0
            let totalIGst = 0
            let totalAmount = 0
            let totalQuantity = 0
            let GSTPercentage = 0


            i.forEach(element => {
                debugger
                const tableitemRow = [
                    `(${element.HSNCode}) ${element.ItemName}     
                     ${element.Comment === null ? "" : element.Comment}`,
                    `${Number(element.Quantity).toFixed(2)} ${element.PrimaryUnitName}                  ${element.UnitName}`,
                    `${element.MRPValue}`,
                    element.Rate,
                    element.BasicAmount,
                    `${element.IGSTPercentage}%`,
                    element.IGST,
                    element.Amount,
                    "row"
                ];

                totalQuantity = Number(totalQuantity) + Number(element.Quantity)
                totalIGst = Number(totalIGst) + Number(element.IGST)
                totalAmount = Number(totalAmount) + Number(element.Amount)
                totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
                GSTPercentage = Number(element.IGSTPercentage)


                hasHedRow.push(tableitemRow);
            })

            function totalrow() {
                return [
                    `GST ${(Number(GSTPercentage))}%  Total:${(Number(totalIGst).toFixed(2))} `,
                    `${Number(totalBasicAmount).toFixed(2)}`,
                    "",
                    "",
                    "",
                    `${Number(totalIGst).toFixed(2)}`,
                    "isaddition",
                    `${Number(totalAmount).toFixed(2)}`,

                ];
            };
            hasHedRow.push(totalrow());
        }
    })
    return hasHedRow
}

export const ReportFotterColumns = [
    "SGST",
    "CGST", "Quantity",
    "GST % ",
    "TaxbleAmt.", "IGST", "Total Amt"
];

export const ReportFotterColumns2 = [
    "SGST",
];

export const ReportRows = (data, doc) => {

    const terms = data.OrderTermsAndCondition
    const slicedArray = terms.slice(0, 2);
    var TableArray = [["Terms And Condition"],
    [`${slicedArray[0] === undefined ? "" : slicedArray[0].TermsAndCondition}`,
    ],
    [`${slicedArray[1] === undefined ? "" : slicedArray[1].TermsAndCondition}`,
    ],
    ]
    return TableArray
}

export const BilledByRow = (data) => {
    var BilledByArray = [
        [`${data.SupplierName}`],
        [`${data.SupplierAddress}`],
        [`FSSAI:${data.SupplierFssai}`],
        [`GSTIN:${data.SupplierGSTIN}`],

    ]
    return BilledByArray;
}

export const BilledToRow = (data) => {

    var BilledToArray = [
        [`${data.CustomerName}`],
        [`${data.BillingAddress}`],
        [`FSSAI:${data.BillingFssai}`],
        [`GSTIN:${data.CustomerGSTIN}`],

    ]

    return BilledToArray;
}

export const DetailsOfTransportRow = (data) => {

    var DetailsOfTransportArray = [
        [`${data.POTypeName}`],
        [`${data.CustomerName}`],
        [`${data.BillingAddress}`],
        [`FSSAI:${data.ShippingFssai}`],

    ]

    return DetailsOfTransportArray;
}









