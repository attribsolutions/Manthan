import { getFixedNumber, groupBy } from "../../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../../../Reports/Report_common_function";

// original
export const columns_1 = [
    "Invoice Number",
    "Grand Total",
    "Advance Amount"
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
    let finalAmount = 0
    const returnArr = []
    data.forEach((element, key) => {
        const tableitemRow = [
            `${(element.FullInvoiceNumber)}`,
            `${(getFixedNumber(element.GrandTotal, 2)).toFixed(2)}`,
            `${(getFixedNumber(element.AdvanceAmount, 2)).toFixed(2)}`,
        ];
        finalAmount += getFixedNumber(element.GrandTotal, 2);
        returnArr.push(tableitemRow);
    })

    if (returnArr.length > 0) {
        returnArr.push([
            `Total :${numberWithCommas(Number(finalAmount).toFixed(2))}`,
            `Total`,
            ``,
            ``,
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











