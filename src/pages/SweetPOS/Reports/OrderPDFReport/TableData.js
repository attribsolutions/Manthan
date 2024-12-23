import { groupBy } from "../../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../../../Reports/Report_common_function";

// original
export const columns_1 = [
    "Item Name",
    "Unit",
    "Comments",

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


const replaceValues = (target, source) => {

    return target.map((item, index) => {
        if (source[index]) {
            item[4] = source[index].ItemName;
            item[5] = source[index].Quantity;
            item[6] = source[index].Comments;
        }
        return item;
    });
};

export const Rows_1 = ({ OrderItem = [] }) => {

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


    const grouped = groupBy(OrderItem, ele => ele.SubGroup);

    let hasHedRow = []
    let Data = []

    grouped.forEach((i, inx_1) => {

        function totalrow() {
            return [
                `${inx_1}`,
                ``,
                ``,

            ];
        };
        hasHedRow.push(totalrow());

        i.forEach((element, inx_2) => {
            // Calculate spaces based on the number of digits in Quantity
            const quantityString = Number(element.Quantity).toString();
            let extraSpaces = '';

            if (quantityString.length === 1) {
                extraSpaces = '       '; // 5 spaces for 2-digit numbers
            } else if (quantityString.length === 2) {
                extraSpaces = '     '; // 3 spaces for 3-digit numbers
            }
            else if (quantityString.length === 3) {
                extraSpaces = '    '; // 3 spaces for 3-digit numbers
            }

            const tableitemRow = [
                `${element.ItemName}`,
                `${Number(element.Quantity)}${extraSpaces}   ${element.UnitName}`,
                `${element.Comment === null ? "" : element.Comment}`,
            ];
            hasHedRow.push(tableitemRow);
        });

    })

    // const updatedArray = replaceValues(hasHedRow, Data);
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
        // [`              ${data.SupplierGSTIN}`],


    ]
    return BilledByArray;
}

export const BilledToRow = (data) => {

    var BilledToArray = [
        [`                    ${data.CustomerName}`],
        [`                 ${data.BillingAddress}`],
        // [`             ${data.CustomerGSTIN}`],

    ]

    return BilledToArray;
}

export const DetailsOfTransportRow = (data) => {

    var DetailsOfTransportArray = [
        [`                   ${data.CustomerName}`],
        [`                 ${data.BillingAddress}`],




    ]

    return DetailsOfTransportArray;
}









