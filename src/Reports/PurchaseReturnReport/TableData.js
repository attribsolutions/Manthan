import { numberWithCommas } from "../Report_common_function";


export const columns = [
    "SR",
    "HSN Item Name",
    "Quantity (UOM)",
    "MRP",
    "Rate",
    "Discount",
    "Discount Amount ",
    "Taxable Amount",
    "          CGST           %        Amount",
    "CGST Amount",
    "          SGST           %        Amount",
    "SGST Amount",
    "Amount",
];




export const Footercolumn = [
    "",
]
export const Return = [
    "Return",
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

export const Bankcolumn = [
    "",
    "",
    "",
]

export const Rows = (data) => {

    const { ReturnItems = [] } = data
    ReturnItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let totalBasicAmount = 0
    let totalCGst = 0
    let totalSGst = 0
    let totalAmount = 0
    let totalQuantity = 0
    let SrNO = 1
    let TotalGst = 0
    let GSTPercentage = 0

    const groupedItems = ReturnItems.reduce((accumulator, currentItem) => {

        const { HSNCode, ItemName, Rate, Discount, CGST, SGST, Amount, DiscountAmount, BasicAmount, Quantity, UnitName, MRPValue, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchCode, BatchDate, DiscountType, PrimaryUnitName } = currentItem;
        const key = ItemName + '_' + MRPValue;
        if (accumulator[key]) {
            accumulator[key].DiscountAmount += Number(DiscountAmount);
            accumulator[key].Quantity += Number(Quantity);
            accumulator[key].BasicAmount += Number(BasicAmount);
            accumulator[key].CGST += Number(CGST);
            accumulator[key].SGST += Number(SGST);
            accumulator[key].Amount += Number(Amount);
            accumulator[key].BatchCode += BatchCode;
            accumulator[key].BatchDate += BatchDate;
            accumulator[key].quantityString += ` ,  ${BatchCode} ${BatchDate} `;
        } else {
            accumulator[key] = {
                ItemName, HSNCode,
                MRPValue, DiscountType, Rate, Discount, CGST: Number(CGST), SGST: Number(SGST), Amount: Number(Amount), DiscountAmount: Number(DiscountAmount), BasicAmount: Number(BasicAmount), Quantity: Number(Quantity), UnitName, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchDate, BatchCode: BatchCode, BatchDate: BatchDate, quantityString: `  ${BatchCode}  ${BatchDate}`, PrimaryUnitName
            };
        }
        return accumulator;
    }, {});
    debugger
    Object.values(groupedItems).forEach((element, key) => {
        debugger


        const tableitemRow = [
            SrNO++,
            ` ${element.ItemName}`,
            `${Number(element.Quantity).toFixed(2)} ${element.UnitName}`,
            `${numberWithCommas(Number(element.MRPValue).toFixed(2))}`,
            `${numberWithCommas(Number(element.Rate).toFixed(2))}`,
            element.Discount === null ? "" : `${element.Discount} ${element.DiscountType === "1" ? "Rs" : "%"}`,
            `${numberWithCommas(Number(element.DiscountAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.BasicAmount).toFixed(2))}`,
            `${Number(element.CGSTPercentage).toFixed(1)}%`,
            `${numberWithCommas(Number(element.CGST).toFixed(2))}`,
            `${Number(element.SGSTPercentage).toFixed(1)}%`,
            `${numberWithCommas(Number(element.SGST).toFixed(2))}`,
            `${numberWithCommas(Number(element.Amount).toFixed(2))}`,
        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalCGst = Number(totalCGst) + Number(element.CGST)
            totalSGst = Number(totalSGst) + Number(element.SGST)
            totalAmount = Number(totalAmount) + Number(element.Amount)
            totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
            TotalGst = totalCGst + totalSGst;
            GSTPercentage = Number(element.CGSTPercentage) + Number(element.SGSTPercentage)
            let cgst = data["tableTot"].TotalCGst
            return ({ TotalCGst: Number(totalCGst) + Number(cgst) })

        };


        function totalrow() {

            return [
                "",
                ` GST ${(parseFloat(GSTPercentage))}%  Total:${numberWithCommas(Number(TotalGst).toFixed(2))} `,
                " ",
                ``,
                "",
                "",
                ``,
                `${numberWithCommas(Number(totalBasicAmount).toFixed(2))}`,
                `${numberWithCommas(Number(totalCGst).toFixed(2))}`,
                "isaddition",
                `${numberWithCommas(Number(totalSGst).toFixed(2))}`,
                "",
                `${numberWithCommas(Number(totalAmount).toFixed(2))}`,
            ];
        };
        const BatchRow = [
            `Batch:  ${element.quantityString} `,
            `Batch`,
            " ",
            ``,
            "",
            "",
            "",
            "",
            ``,
            "",
            ``,
            "",
            ``,
        ]

        if (Gst === 0) { Gst = element.GSTPercentage };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }

        if ((Gst === element.GSTPercentage)) {
            data["tableTot"] = totalLots()
            returnArr.push(tableitemRow)

        }


        else {
            returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            totalBasicAmount = 0
            totalCGst = 0
            totalSGst = 0
            totalAmount = 0
            totalQuantity = 0

            data["tableTot"] = totalLots()
            Gst = element.GSTPercentage;
        }
        if (key === Object.keys(groupedItems).length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const ReturnByRow = (data) => {

    var ReturnByArray = [
        [`${data.CustomerName}`],
        [`${data.CustomerAddress}`],
        [`${data.CustomerState}`],
        [`GSTIN:${data.CustomerGSTIN}`,],
        [`FSSAINo:${data.CustomerFSSAINo}`],
        [`MobileNo:${data.CustomerMobileNo}`],
    ]
    return ReturnByArray;
}
export const ReturnToRow = (data) => {

    var ReturnToArray = [
        [`${data.PartyName}`],
        [`${data.PartyAddress}`],
        [`${data.PartyState}`],
        [`GSTIN:${data.PartyGSTIN}`],
        [`FSSAINo:${data.PartyFSSAINo}`],
        [`MobileNo:${data.PartyMobileNo}`],
    ]

    return ReturnToArray;
}
// export const DetailsOfTransportRow = (data) => {
//     var DetailsOfTransportArray = [
//         [`Claim No: {}`],
//         [`Period :`],
//     ]
//     return DetailsOfTransportArray;
// }


export const ReturnReason = (data) => {

    var ReturnReasonArray = [
        [`Return Reason :${data.ReturnReason === null ? "" : data.ReturnReason}`],
    ]

    return ReturnReasonArray;
}











