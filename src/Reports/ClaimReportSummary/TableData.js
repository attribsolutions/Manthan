import { numberWithCommas } from "../Report_common_function";


export const columns = [
    "Item Name",
    "MRP",
    "Return Quantity",
    "Approve Quantity",
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
    let totalReturnQuantity = 0
    let totalApproveQuantity = 0
    let SrNO = 1
    let TotalGst = 0
    let GSTPercentage = 0


    ClaimSummaryItemDetails.forEach((element, key) => {

        const tableitemRow = [
            `${element.ItemName}`,
            `${numberWithCommas(Number(element.MRP).toFixed(2))}`,
            `${numberWithCommas(Number(element.Quantity).toFixed(2))}`,
            `${numberWithCommas(Number(element.ApprovedQuantity).toFixed(2))}`,
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
            totalReturnQuantity = Number(totalReturnQuantity) + Number(element.Quantity)
            totalApproveQuantity = Number(totalApproveQuantity) + Number(element.ApprovedQuantity)
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
                `GST ${(Number(GSTPercentage))}% Total`,
                `Total`,
                ` ${numberWithCommas(Number(totalReturnQuantity).toFixed(2))}`,
                `${numberWithCommas(Number(totalApproveQuantity).toFixed(2))}`,
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
            totalReturnQuantity = 0
            totalApproveQuantity = 0
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
        [`                   ${data.PartyDetails.PartyName}`],
        [`                 ${data.PartyDetails.Address}`],
        [`                   ${data.PartyDetails.MobileNo}`],
    ]
    return BilledByArray;
}
export const BilledToRow = (data) => {


    var BilledToArray = [
        [`                   ${data.PartyDetails.GSTIN}`],
        [`                  ${data.PartyDetails.FSSAINo}`],
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











