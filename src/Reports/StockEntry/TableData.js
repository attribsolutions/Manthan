import { groupBy } from "../../components/Common/CommonFunction";

// original
export const columns_1 = [
    "Item Name",
    "MRP",
    "Quantity",

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



export const Rows_1 = ({ data = [] }) => {
    data.forEach((element) => {
        const [itemName] = element.ItemName.split('-');
        element.ItemName = itemName;  // Modify the field directly

    });

    const grouped = groupBy(data, ele => ele.SubGroupName);

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
            debugger
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
                `${element.defaultMRP.label}`,
                ``

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









