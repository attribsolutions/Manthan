import { getFixedNumber, groupBy } from "../../../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../../../../Reports/Report_common_function";
import { PayMentMode_Rows } from "../ThermalPrintReport/Report";

// original
export const columns_1 = [
    "Item Name",
    "Quantity",
    "Rate",
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
    data.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);

    // const RoundOffAmount = data.reduce((sum, row) => sum + row.RoundOffAmount, 0);


    const uniqueMap = new Map();

    const returnArr = [];
    let Gst = 0
    let totalGst = 0
    let totalAmount = 0
    let totalQuantity = 0
    let GSTPercentage = 0
    let finalTotal = 0
    let finalTotalGST = 0
    let finalBasicAmount = 0
    let finalDiscountAmount = 0
    let finalRoundOffAmount = 0;




    const groupedItems = data.reduce((accumulator, currentItem) => {
        const { id, ItemName, BaseItemUnitQuantity, Rate, GrandTotal, GSTPercentage, GSTAmount, BasicAmount, DiscountAmount, Amount, MRPValue, RoundOffAmount } = currentItem;

        const key = ItemName + '_' + MRPValue;
        if (accumulator[key]) {
            accumulator[key].BaseItemUnitQuantity += getFixedNumber(BaseItemUnitQuantity, 3);
            accumulator[key].GrandTotal += getFixedNumber(GrandTotal, 3);
            accumulator[key].GSTAmount += getFixedNumber(GSTAmount, 3);
            accumulator[key].BasicAmount += getFixedNumber(BasicAmount, 3);
            accumulator[key].DiscountAmount += getFixedNumber(DiscountAmount, 3);
            accumulator[key].Amount += getFixedNumber(Amount, 3);
            accumulator[key].RoundOffAmount += RoundOffAmount;



        } else {
            accumulator[key] = {
                Rate, ItemName, GrandTotal: getFixedNumber(GrandTotal, 3), MRPValue,
                BaseItemUnitQuantity: getFixedNumber(BaseItemUnitQuantity, 3), GSTPercentage: GSTPercentage,
                GSTAmount: getFixedNumber(GSTAmount, 3), BasicAmount: getFixedNumber(BasicAmount, 3),
                DiscountAmount: getFixedNumber(DiscountAmount, 3), Amount: getFixedNumber(Amount, 3),
                RoundOffAmount: RoundOffAmount, id: id
            };
        }
        return accumulator;
    }, {});

    const TotalItemlength = Object.values(groupedItems).length;
    data["TotalItemlength"] = TotalItemlength;

    Object.values(groupedItems).forEach((element, key) => {

        if (!uniqueMap.has(element.id)) {
            uniqueMap.set(element.id, element.RoundOffAmount);
        }

        finalTotal += element.Amount;
        finalTotalGST += element.GSTAmount;
        finalBasicAmount += element.BasicAmount;
        finalDiscountAmount += element.DiscountAmount;
        finalRoundOffAmount += element.RoundOffAmount;

        const tableitemRow = [
            `${element.ItemName}`,
            `${(getFixedNumber(element.BaseItemUnitQuantity, 2)).toFixed(2)}`,
            `${(getFixedNumber(element.MRPValue, 2)).toFixed(2)}`,
            `${(getFixedNumber(element.Amount, 2)).toFixed(2)}`,
        ];
        // returnArr.push(tableitemRow);

        function totalrow() {
            return [
                `GST ${(parseFloat(GSTPercentage))}%             Total GST: ${numberWithCommas(Number(totalGst).toFixed(2))}`,
                ``,
                `${numberWithCommas(Number(totalAmount).toFixed(2))}`,
                `Span`,
            ];
        };

        function totalLots() {
            totalQuantity = getFixedNumber(totalQuantity, 3) + getFixedNumber(element.BaseItemUnitQuantity, 3)
            totalAmount = getFixedNumber(totalAmount, 3) + getFixedNumber(element.Amount, 3)
            totalGst = getFixedNumber(totalGst, 3) + getFixedNumber(element.GSTAmount, 3)
            GSTPercentage = Number(element.GSTPercentage)
        };

        if (Gst === 0) { Gst = element.GSTPercentage };

        if ((Gst === element.GSTPercentage)) {
            returnArr.push(tableitemRow)
            totalLots()
        }
        else {
            returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            totalGst = 0;
            totalAmount = 0;
            totalQuantity = 0;
            Gst = element.GSTPercentage;
            totalLots()

        }

        if (key === Object.keys(groupedItems).length - 1) {
            returnArr.push(totalrow());
        }
    })

    if (returnArr.length - 1) {
        returnArr.push([
            ``,
            ``,
            ``,
            `SpanAll`,
        ]);
    }

    if (returnArr.length - 1) {
        returnArr.push([
            `GST Total:`,
            ``,
            `${numberWithCommas(Number(finalTotalGST).toFixed(2))}`,
            `Span`,
        ]);
    }

    if (returnArr.length - 1) {
        returnArr.push([
            `Discount Amount:`,
            ``,
            `${numberWithCommas(Number(finalDiscountAmount).toFixed(2))}`,
            `Span`,
        ]);
    }
    if (returnArr.length - 1) {
        returnArr.push([
            `Round Off:`,
            ``,
            `${([...uniqueMap.values()].reduce((sum, amt) => sum + amt, 0)).toFixed(2)}`,
            `Span`,
        ]);
    }
    if (returnArr.length - 1) {
        returnArr.push([
            `Amount:`,
            ``,
            ` ${numberWithCommas(getFixedNumber(finalTotal, 2))}`,
            `Span`,
        ]);
    }
    if (returnArr.length - 1) {
        returnArr.push([
            `Payment Mode`,
            ``,
            ``,
            `SpanAll`,
        ]);
    }
    const PaymentRows = PayMentMode_Rows(data)
    const transformed = PaymentRows.map(([mode, amount, type]) => [
        `${mode.trim()}:`,
        '',
        amount,
        type
    ]);

    returnArr.push(...transformed);
    debugger
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











