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
    "Rate Without GST",
    "Discount Amount",
    "Taxable Amount",
    "GST %",
    "GST Amount",
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
    let totalTaxableAmount = 0
    let totalGst = 0
    let totalAmount = 0
    let totalQuantity = 0
    let totalApprovedQuantity = 0




    let GSTPercentage = 0

    ClaimSummaryItemDetails.forEach((element, key) => {
        debugger
        const TotalGST = (Number(element.CGST)) + (Number(element.SGST))
        const tableitemRow = [
            `${date_dmy_func(element.ReturnDate)}`,
            `${(element.FullReturnNumber)}`,
            `${(element.CustomerName)}`,
            `${(element.ItemName)}`,
            `${numberWithCommas(Number(element.MRP).toFixed(2))}`,
            `${numberWithCommas(Number(element.Quantity).toFixed(2))}`,
            `${numberWithCommas(Number(element.ApprovedQuantity).toFixed(2))}`,
            `${numberWithCommas(Number(element.Rate).toFixed(2))}`,
            `${numberWithCommas(Number(element.DiscountAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.TaxableAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.GST).toFixed(2))}%`,
            `${numberWithCommas(Number(TotalGST).toFixed(2))}`,
            `${numberWithCommas(Number(element.Amount).toFixed(2))}`,
        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalApprovedQuantity = Number(totalApprovedQuantity) + Number(element.ApprovedQuantity)
            totalTaxableAmount = Number(totalTaxableAmount) + Number(element.TaxableAmount)
            totalGst = Number(totalGst) + Number(TotalGST)
            totalAmount = Number(totalAmount) + Number(element.Amount);
            GSTPercentage = Number(element.GST)

        };

        function totalrow() {

            return [
                `Total`,
                ` `,
                ``,
                ``,
                ``,
                `${numberWithCommas(Number(totalQuantity).toFixed(2))}`,
                `${numberWithCommas(Number(totalApprovedQuantity).toFixed(2))}`,
                ``,
                ``,
                `${numberWithCommas(Number(totalTaxableAmount).toFixed(2))}`,
                ``,
                `${numberWithCommas(Number(totalGst).toFixed(2))}`,
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











