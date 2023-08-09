import { numberWithCommas } from "../Report_common_function";


export const columns = [
    "Item Name",
    "MRP",
    "Quantity in Pcs",
    "GST %",
    "Rate without GST ",
    "Discount %",
    "Discount Amount",
    "Taxable Amount",
    "CGST Amount",
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

    const { ClaimSummaryItemDetails = [] } = data
    ClaimSummaryItemDetails.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
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

    // const groupedItems = ReturnItems.reduce((accumulator, currentItem) => {

    //     const { HSNCode, ItemName, MRP, Rate, Discount, CGST, SGST, Amount, DiscountAmount, BasicAmount, Quantity, UnitName, MRPValue, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchCode, BatchDate, DiscountType, PrimaryUnitName } = currentItem;
    //     const key = ItemName + '_' + MRP;
    //     if (accumulator[key]) {
    //         accumulator[key].DiscountAmount += Number(DiscountAmount);
    //         accumulator[key].Quantity += Number(Quantity);
    //         accumulator[key].BasicAmount += Number(BasicAmount);
    //         accumulator[key].CGST += Number(CGST);
    //         accumulator[key].SGST += Number(SGST);
    //         accumulator[key].Amount += Number(Amount);
    //         accumulator[key].BatchCode += BatchCode;
    //         accumulator[key].BatchDate += BatchDate;
    //         accumulator[key].quantityString += ` ,  ${BatchCode} ${BatchDate} `;
    //     } else {
    //         accumulator[key] = {
    //             ItemName, HSNCode,
    //             MRPValue, DiscountType, Rate, Discount, CGST: Number(CGST), SGST: Number(SGST), Amount: Number(Amount), DiscountAmount: Number(DiscountAmount), BasicAmount: Number(BasicAmount), Quantity: Number(Quantity), UnitName, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchDate, BatchCode: BatchCode, BatchDate: BatchDate, quantityString: `  ${BatchCode}  ${BatchDate}`, PrimaryUnitName
    //         };
    //     }
    //     return accumulator;
    // }, {});

    ClaimSummaryItemDetails.forEach((element, key) => {

        const tableitemRow = [
            `${element.ItemName}`,
            `${numberWithCommas(Number(element.MRP).toFixed(2))}`,
            `${numberWithCommas(Number(element.Quantity).toFixed(2))}`,
            `${numberWithCommas(Number(element.GST).toFixed(2))}%`,
            `${numberWithCommas(Number(element.Rate).toFixed(2))}`,
            `${numberWithCommas(Number(element.Discount).toFixed(2))}`,
            `${numberWithCommas(Number(element.DiscountAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.TaxableAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.CGST).toFixed(2))}`,
            `${numberWithCommas(Number(element.SGST).toFixed(2))}`,
            `${numberWithCommas(Number(element.Amount).toFixed(2))}`,
        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalCGst = Number(totalCGst) + Number(element.CGST)
            totalSGst = Number(totalSGst) + Number(element.SGST)
            totalAmount = Number(totalAmount) + Number(element.Amount)
            TotalGst = totalCGst + totalSGst;
            GSTPercentage = Number(element.GST)
            let cgst = data["tableTot"].TotalCGst
            return ({ TotalCGst: Number(totalCGst) + Number(cgst) })

        };

        function totalrow() {

            return [
                `Total`,
                `GST ${(Number(GSTPercentage))}% Total `,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                `${numberWithCommas(Number(totalCGst).toFixed(2))}`,
                `${numberWithCommas(Number(totalSGst).toFixed(2))}`,
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

        if (Gst === 0) { Gst = element.GST };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }

        if ((Gst === element.GST)) {
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
            Gst = element.GST;
        }
        if (key === ClaimSummaryItemDetails.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const BilledByRow = (data) => {

    var BilledByArray = [
        [`${data.PartyDetails.PartyName}`],
        [`${data.PartyDetails.Address}`],
        [`MobileNo:${data.PartyDetails.MobileNo}`],
    ]
    return BilledByArray;
}
export const BilledToRow = (data) => {


    var BilledToArray = [
        [`Expiry From Retailer Claim summary`],
        [`GSTIN NO :${data.PartyDetails.GSTIN}`],
        [`FSSAI NO :${data.PartyDetails.FSSAINo}`],
    ]

    return BilledToArray;
}
export const DetailsOfTransportRow = (data) => {

    var DetailsOfTransportArray = [

        [`Claim No: {}`],
        [`Period :`],

    ]

    return DetailsOfTransportArray;
}

export const ReturnReason = (data) => {

    var ReturnReasonArray = [
        [`Return Reason :${data.ReturnReason === null ? "" : data.ReturnReason}`],
    ]

    return ReturnReasonArray;
}











