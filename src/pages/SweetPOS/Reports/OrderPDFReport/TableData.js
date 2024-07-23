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

export const Rows_1 = (data) => {

    const { OrderItem = [] } = data


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
            const tableitemRow = [
                `${element.ItemName}${element.Comment === null ? "" : element.Comment}`,
                `${Number(element.Quantity).toFixed(2)}${element.PrimaryUnitName}${element.UnitName}`,
                `${(numberWithCommas(Number(element.Comment).toFixed(2)))}`,

            ];
            hasHedRow.push(tableitemRow);
        })

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









