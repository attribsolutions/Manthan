import { groupBy } from "../../components/Common/CommonFunction";
import { convertAmericanDollars, numberWithCommas, toWords } from "../Report_common_function";

// original
export const columns = [
    "HSN Item Name",
    "Quantity",
    "MRP",
    "Rate",
    "Discount",
    "Discount Amount",
    "Basic   Amount ",
    "       CGST           %        Amount",
    "CGST   Amount ",
    "       SGST           %        Amount",
    "SGST   Amount",
    "Total Amount"];

export const columnsWithIGST = [
    "HSN Item Name",
    "Quantity",
    "MRP",
    "Rate",
    "Discount",
    "Discount Amount",
    "Basic   Amount ",
    "        IGST        %       Amount",
    "IGST   Amount ",
    "Total Amount",
];


export const columnsForAmerica = [
    "HSN Item Name",
    "Quantity",
    "Rate",
    "Discount",
    "Discount Amount",
    "Basic   Amount ",
    "        IGST        %       Amount",
    "IGST   Amount ",
    "Total Amount",
];


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

export const Currencycolumn = [
    "",
]

export const Rows = (data, doc) => {

    const { OrderItem = [] } = data



    OrderItem.sort((a, b) => {
        const compare = (x, y) => {
            // Convert strings to numbers and handle null or 0
            const numX = x === null ? 0 : Number(x);
            const numY = y === null ? 0 : Number(y);

            if (numX === 0) return -1; // Treat null or 0 as smaller
            if (numY === 0) return 1;  // Treat null or 0 as smaller
            return numX - numY;
        };

        const groupComparison = compare(a.GroupSequence, b.GroupSequence);
        if (groupComparison !== 0) return groupComparison;

        const subgroupComparison = compare(a.SubGroupSequence, b.SubGroupSequence);
        if (subgroupComparison !== 0) return subgroupComparison;

        return compare(a.ItemSequence, b.ItemSequence);
    });



    let hasHedRow = []

    const grouped = groupBy(OrderItem, ele => ele.GSTPercentage);
    grouped.forEach(i => {

        if (i.length > 0) {

            let totalBasicAmount = 0
            let totalCGst = 0
            let totalSGst = 0
            let totalAmount = 0
            let totalQuantity = 0
            let TotalGst = 0
            let GSTPercentage = 0
            let totalDiscountAmount = 0

            i.forEach(element => {

                const tableitemRow = [
                    `(${element.HSNCode}) ${element.ItemName}\n${element.Comment === null ? "" : element.Comment}`,
                    `${Number(element.Quantity).toFixed(2)}\n${element.UnitName}`,
                    `${(numberWithCommas(Number(element.MRPValue).toFixed(2)))}`,
                    `${(numberWithCommas(Number(element.Rate).toFixed(2)))}`,
                    `${element.Discount} ${element.DiscountType === "1" ? "Rs" : "%"}`,
                    `${numberWithCommas(Number(element.DiscountAmount).toFixed(2))}`,
                    `${(numberWithCommas(Number(element.BasicAmount).toFixed(2)))}`,
                    `${Number(element.CGSTPercentage)}%`,
                    `${(numberWithCommas(Number(element.CGST).toFixed(2)))}`,
                    `${Number(element.SGSTPercentage)}%`,
                    `${(numberWithCommas(Number(element.SGST).toFixed(2)))}`,
                    `${(numberWithCommas(Number(element.Amount).toFixed(2)))}`,
                    { Item_id: element.Item, IsHighlightItemInPrint: element.IsHighlightItemInPrint }
                ];

                totalQuantity = Number(totalQuantity) + Number(element.Quantity)
                totalCGst = Number(totalCGst) + Number(element.CGST)
                totalSGst = Number(totalSGst) + Number(element.SGST)
                TotalGst = totalCGst + totalSGst;
                totalAmount = Number(totalAmount) + Number(element.Amount)
                GSTPercentage = Number(element.CGSTPercentage) + Number(element.SGSTPercentage)
                totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
                totalDiscountAmount = Number(totalDiscountAmount) + Number(element.DiscountAmount)


                hasHedRow.push(tableitemRow);

                doc.rowinfo = { Item_id: element.Item, IsHighlightItemInPrint: element.IsHighlightItemInPrint }

            })

            function totalrow() {
                return [
                    `GST ${(parseFloat(GSTPercentage))}%  Total:${numberWithCommas(Number(TotalGst).toFixed(2))}`,
                    "",
                    "",
                    "",
                    `${numberWithCommas(Number(totalDiscountAmount).toFixed(2))}`,
                    "",
                    `${numberWithCommas(Number(totalBasicAmount).toFixed(2))}`,
                    `${numberWithCommas(Number(totalCGst).toFixed(2))}`,
                    "isaddition",
                    `${numberWithCommas(Number(totalSGst).toFixed(2))}`,
                    "",
                    `${numberWithCommas(Number(totalAmount).toFixed(2))}`,
                ];
            };
            hasHedRow.push(totalrow());
        }
    })
    return hasHedRow
}

export const RowsWithIGST = (data) => {

    const { OrderItem = [] } = data

    OrderItem.sort((a, b) => {
        const compare = (x, y) => {
            // Convert strings to numbers and handle null or 0
            const numX = x === null ? 0 : Number(x);
            const numY = y === null ? 0 : Number(y);

            if (numX === 0) return -1; // Treat null or 0 as smaller
            if (numY === 0) return 1;  // Treat null or 0 as smaller
            return numX - numY;
        };

        const groupComparison = compare(a.GroupSequence, b.GroupSequence);
        if (groupComparison !== 0) return groupComparison;

        const subgroupComparison = compare(a.SubGroupSequence, b.SubGroupSequence);
        if (subgroupComparison !== 0) return subgroupComparison;

        return compare(a.ItemSequence, b.ItemSequence);
    });

    let hasHedRow = []
    const grouped = groupBy(OrderItem, ele => ele.GSTPercentage);
    grouped.forEach(i => {

        if (i.length > 0) {

            let totalBasicAmount = 0
            let totalIGst = 0
            let totalAmount = 0
            let totalQuantity = 0
            let GSTPercentage = 0
            let totalDiscountAmount = 0



            i.forEach(element => {

                const tableitemRow = [
                    `(${element.HSNCode}) ${element.ItemName}\n${element.Comment === null ? "" : element.Comment}`,
                    `${Number(element.Quantity).toFixed(2)}                   ${element.UnitName}`,
                    `${numberWithCommas(Number(element.MRPValue).toFixed(2))}`,
                    `${numberWithCommas(Number(element.Rate).toFixed(2))}`,
                    `${element.Discount} ${element.DiscountType === "1" ? "Rs" : "%"}`,
                    `${numberWithCommas(Number(element.DiscountAmount).toFixed(2))}`,
                    `${numberWithCommas(Number(element.BasicAmount).toFixed(2))}`,
                    `${Number(element.IGSTPercentage)}%`,
                    `${numberWithCommas(Number(element.IGST).toFixed(2))}`,
                    `${numberWithCommas(Number(element.Amount).toFixed(2))}`,
                    "row"
                ];

                totalQuantity = Number(totalQuantity) + Number(element.Quantity)
                totalIGst = Number(totalIGst) + Number(element.IGST)
                totalAmount = Number(totalAmount) + Number(element.Amount)
                totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
                GSTPercentage = Number(element.IGSTPercentage)
                totalDiscountAmount = Number(totalDiscountAmount) + Number(element.DiscountAmount)



                hasHedRow.push(tableitemRow);

            })

            function totalrow() {
                return [
                    `GST ${(Number(GSTPercentage))}%  Total:${(numberWithCommas(Number(totalIGst).toFixed(2)))} `,
                    "",
                    "",
                    "",
                    `${numberWithCommas(Number(totalDiscountAmount).toFixed(2))}`,
                    "",
                    `${numberWithCommas(Number(totalBasicAmount).toFixed(2))}`,
                    `${numberWithCommas(Number(totalIGst).toFixed(2))}`,
                    "isaddition",
                    `${numberWithCommas(Number(totalAmount).toFixed(2))}`,

                ];
            };
            hasHedRow.push(totalrow());
        }
    })
    return hasHedRow
}



export const RowsForAmericanOrder = (data) => {

    const { OrderItem = [] } = data

    OrderItem.sort((a, b) => {
        const compare = (x, y) => {
            // Convert strings to numbers and handle null or 0
            const numX = x === null ? 0 : Number(x);
            const numY = y === null ? 0 : Number(y);

            if (numX === 0) return -1; // Treat null or 0 as smaller
            if (numY === 0) return 1;  // Treat null or 0 as smaller
            return numX - numY;
        };

        const groupComparison = compare(a.GroupSequence, b.GroupSequence);
        if (groupComparison !== 0) return groupComparison;

        const subgroupComparison = compare(a.SubGroupSequence, b.SubGroupSequence);
        if (subgroupComparison !== 0) return subgroupComparison;

        return compare(a.ItemSequence, b.ItemSequence);
    });
    let hasHedRow = []
    const grouped = groupBy(OrderItem, ele => ele.GSTPercentage);
    grouped.forEach(i => {

        if (i.length > 0) {

            let totalBasicAmount = 0
            let totalIGst = 0
            let totalAmount = 0
            let totalQuantity = 0
            let GSTPercentage = 0
            let totalDiscountAmount = 0

            i.forEach(element => {

                const tableitemRow = [
                    `(${element.HSNCode}) ${element.ItemName}\n${element.Comment === null ? "" : element.Comment}`,
                    `${Number(element.Quantity).toFixed(2)}                   ${element.UnitName}`,
                    `${numberWithCommas(Number(element.Rate).toFixed(2))}`,
                    `${element.Discount} ${element.DiscountType === "1" ? "Rs" : "%"}`,
                    `${numberWithCommas(Number(element.DiscountAmount).toFixed(2))}`,
                    `${numberWithCommas(Number(element.BasicAmount).toFixed(2))}`,
                    `${Number(element.IGSTPercentage)}%`,
                    `${numberWithCommas(Number(element.IGST).toFixed(2))}`,
                    `${numberWithCommas(Number(element.Amount).toFixed(2))}`,
                    "row"
                ];

                totalQuantity = Number(totalQuantity) + Number(element.Quantity)
                totalIGst = Number(totalIGst) + Number(element.IGST)
                totalAmount = Number(totalAmount) + Number(element.Amount)
                totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
                GSTPercentage = Number(element.IGSTPercentage)
                totalDiscountAmount = Number(totalDiscountAmount) + Number(element.DiscountAmount)

                hasHedRow.push(tableitemRow);
            })

            function totalrow() {
                return [
                    `GST ${(Number(GSTPercentage))}%  Total:${(numberWithCommas(Number(totalIGst).toFixed(2)))} `,
                    "",
                    "",
                    `${numberWithCommas(Number(totalDiscountAmount).toFixed(2))}`,
                    "",
                    `${numberWithCommas(Number(totalBasicAmount).toFixed(2))}`,
                    `${numberWithCommas(Number(totalIGst).toFixed(2))}`,
                    "isaddition",
                    `${numberWithCommas(Number(totalAmount).toFixed(2))}`,

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
    const slicedArray = terms?.slice(0, 2);
    var TableArray = [["Terms And Condition"],
    [`${slicedArray?.[0] === undefined ? "" : slicedArray[0]?.TermsAndCondition}`,
    ],
    [`${slicedArray?.[1] === undefined ? "" : slicedArray[1]?.TermsAndCondition}`,
    ],
    ]
    return TableArray
}

export const BilledByRow = (data) => {
    var BilledByArray = [
        [`                  ${data.SupplierName}`],
        [`                ${data.SupplierAddress}`],
        [`              ${data.SupplierGSTIN}`],
        [`                  ${data.SupplierFssai}`],

    ]
    return BilledByArray;
}

export const BilledToRow = (data) => {

    var BilledToArray = [
        [`                    ${data.CustomerName}`],
        [`                 ${data.BillingAddress}`],
        [`             ${data.CustomerGSTIN}`],
        [`                  ${data.BillingFssai}`],

    ]

    return BilledToArray;
}

export const DetailsOfTransportRow = (data) => {

    var DetailsOfTransportArray = [
        [`                  ${data.POTypeName}`],
        [`                   ${data.CustomerName}`],
        [`                 ${data.BillingAddress}`],
        [`                   ${data.ShippingFssai}`],
        [`                      ${data.Description}`],


    ]

    return DetailsOfTransportArray;
}



export const CurrencyRow = (data) => {
    let stringNumber
    if (data.isAmerica) {
        stringNumber = convertAmericanDollars(Number(data.OrderAmount))
    } else {
        stringNumber = toWords(Number(data.OrderAmount))
    }

    var RupeesArray = [
        [`                  ${stringNumber}`],

    ]
    return RupeesArray;
}









