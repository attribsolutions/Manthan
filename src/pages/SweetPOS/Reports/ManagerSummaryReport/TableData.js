import { getFixedNumber, groupBy } from "../../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../../../Reports/Report_common_function";

// original
export const columns_1 = [
    "Document No",
    "Advance Amount",
    "Net Amount",
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


export const Rows_1 = (data) => {
    debugger
    let finalOrderAmount = 0
    let finalOrderAdvanceAmount = 0
    let finalInvoiceAdvanceAmount = 0
    let finalInvoiceAmount = 0

    const returnArr = []
    returnArr.push([
        `Order`,
        ``,
        ``,

    ]);

    const groupedData = {};

    // Group records by date
    data.OrderData.forEach((element) => {
        if (element.FullOrderNumber === "Total") return;

        const date = element.OrderDate; // or use element.Date if your field is named differently
        const row = [
            `${element.FullOrderNumber}`,
            `${getFixedNumber(element.AdvanceAmount, 2).toFixed(2)}`,
            `${getFixedNumber(element.OrderAmount, 2).toFixed(2)}`,
            `${getFixedNumber(element.TotalAmount, 2).toFixed(2)}`,

        ];

        finalOrderAmount += getFixedNumber(element.OrderAmount, 2);
        finalOrderAdvanceAmount += getFixedNumber(element.AdvanceAmount, 2);

        if (!groupedData[date]) {
            groupedData[date] = [];
        }
        groupedData[date].push(row);
    });

    Object.keys(groupedData).sort().forEach(date => {
        returnArr.push(...groupedData[date]); // Push all records for that date
    });

    if (returnArr.length > 0) {
        returnArr.push([
            `Order Total`,
            `${numberWithCommas(Number(finalOrderAdvanceAmount).toFixed(2))}`,
            `${numberWithCommas(Number(finalOrderAmount).toFixed(2))}`,
            `${numberWithCommas(Number(finalOrderAdvanceAmount + finalOrderAmount).toFixed(2))}`,

        ]);
    }
    returnArr.push([
        `Cash`,
        ``,
        ``,

    ]);
    data.InvoiceData.forEach((element, key) => {
        if (element.FullInvoiceNumber === "Total") {
            return
        }
        const tableitemRow = [
            `${(element.FullInvoiceNumber)}`,
            `${(getFixedNumber(element.AdvanceAmount, 2)).toFixed(2)}`,
            `${(getFixedNumber(element.GrandTotal, 2)).toFixed(2)}`,
            `${(getFixedNumber(element.TotalAmount)).toFixed(2)}`,

        ];
        finalInvoiceAmount += getFixedNumber(element.GrandTotal, 2);
        finalInvoiceAdvanceAmount += getFixedNumber(element.AdvanceAmount, 2);

        returnArr.push(tableitemRow);
    })

    if (returnArr.length > 0) {
        returnArr.push([
            `Invoice Total`,
            `${numberWithCommas(Number(finalInvoiceAdvanceAmount).toFixed(2))}`,
            `${numberWithCommas(Number(finalInvoiceAmount).toFixed(2))}`,
            `${numberWithCommas(Number(finalInvoiceAdvanceAmount + finalInvoiceAmount).toFixed(2))}`,

        ]);
    }


    return returnArr;
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
        [`                ${(data.GSTIN === null || data.GSTIN === undefined) ? "" : data.GSTIN}`],
        [`                ${data.Date}`],
    ]
    return BilledByArray;
}











