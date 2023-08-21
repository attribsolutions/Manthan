import { date_dmy_func } from "../../components/Common/CommonFunction";
import { numberWithCommas } from "../Report_common_function";

export const columns = [
    "Date ",
    "Doc No",
    "Customer Name",
    "Item Name",
    "MRP ",
    "Return Quantity",
    "Approve Quantity",
    "GST %",
    "Rate Without GST",
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
    function extractNumber(fullReturnNumber) {
        const match = fullReturnNumber.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }
    ClaimSummaryItemDetails.sort((a, b) => extractNumber(a.FullReturnNumber) - extractNumber(b.FullReturnNumber));

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

    ClaimSummaryItemDetails.forEach((element, key) => {

        const tableitemRow = [
            `${date_dmy_func(element.ReturnDate)}`,
            `${(element.FullReturnNumber)}`,
            `${(element.CustomerName)}`,
            `${(element.ItemName)}`,
            `${numberWithCommas(Number(element.MRP).toFixed(2))}`,
            `${numberWithCommas(Number(element.Quantity).toFixed(2))}`,
            `${numberWithCommas(Number(element.ApprovedQuantity).toFixed(2))}`,
            `${numberWithCommas(Number(element.GST).toFixed(2))}%`,
            `${numberWithCommas(Number(element.Rate).toFixed(2))}`,
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
            // returnArr.push(totalrow());
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
            // returnArr.push(totalrow());
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
        [`${data.PartyDetails.GSTIN}`],
        [`${data.PartyDetails.FSSAINo}`],

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











