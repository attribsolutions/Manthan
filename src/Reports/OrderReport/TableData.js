import { groupBy } from "../../components/Common/CommonFunction";

// original
export const columns = [
    "HSN Item Name",
    "Quantity",
    "Rate",
    "BasicAmt ",
    "CGST%",
    "CGSTAmt ",
    "SGST%",
    "SGSTAmt",
    "Total Amt"];

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
    debugger
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
           
            i.forEach(element => {
                const tableitemRow = [
                    `(${element.HSNCode}) ${element.ItemName}     
                     ${element.Comment === null ? "" : element.Comment}`,
                    `${Number(element.Quantity).toFixed(2)} ${element.UnitName}`,
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
                totalAmount = Number(totalAmount) + Number(element.Amount)
                totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
            
                hasHedRow.push(tableitemRow);
            })

            function totalrow() {
                return [
                    "",
                    "",
                    `TotalBasic:${parseFloat(totalBasicAmount).toFixed(2)}`,
                    "",
                    `Total:${parseFloat(totalCGst).toFixed(2)}`,
                    "isaddition",
                    `Total:${parseFloat(totalSGst).toFixed(2)}`,
                    "",
                    `Total:${parseFloat(totalAmount).toFixed(2)}`,
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
        [`${data.ShippingAddress}`],
        [`FSSAI:${data.ShippingFssai}`],
    ]
    return BilledByArray;
}

export const BilledToRow = (data) => {

    var BilledToArray = [
        [`${data.CustomerName}`],
        [`${data.BillingAddress}`],
        [`FSSAI:${data.BillingFssai}`],
    ]

    return BilledToArray;
}

export const DetailsOfTransportRow = (data) => {

    var DetailsOfTransportArray = [
        [`${data.POTypeName}`],
        [`${data.CustomerName}`],
        [`${data.BillingAddress}`],
    ]

    return DetailsOfTransportArray;
}









