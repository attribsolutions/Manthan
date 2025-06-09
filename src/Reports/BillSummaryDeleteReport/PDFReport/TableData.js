import { getFixedNumber, groupBy } from "../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../../Reports/Report_common_function";

// original
export const columns_1 = [
    "Invoice Date",
    "Invoice No",
    "User",
    "Amount"
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
    const returnArr = [];
    let totalGrandTotal = 0;

    data.forEach((element) => {
        const grandTotalFixed = getFixedNumber(element.GrandTotal, 2);
        totalGrandTotal += grandTotalFixed;

        const tableitemRow = [
            `${element.InvoiceDate}`,
            `${element.FullInvoiceNumber}`,
            `${element.UserName}`,
            `${grandTotalFixed.toFixed(2)}`,
        ];

        returnArr.push(tableitemRow);
    });

    // Add a final row for total
    const totalRow = [
        '', // Empty cell for InvoiceDate
        '', // Empty cell for FullInvoiceNumber
        'Total:', // Label in the UserName column
        `${totalGrandTotal.toFixed(2)}`, // GrandTotal sum
    ];

    returnArr.push(totalRow);

    return returnArr;
}




export const BilledByRow = (data) => {
    var BilledByArray = [
        [`                  ${data.SupplierName}`],
        [`                ${data.Date}`],
    ]
    return BilledByArray;
}











