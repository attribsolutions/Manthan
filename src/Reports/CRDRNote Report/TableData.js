import { concatDateAndTime, convertDatefunc } from "../../components/Common/CommonFunction";
import { invoice } from "../ReportIndex";

export const columns = [
    "Invoice Date",
    "Invoice Number",
    "Grand Total",
    "PaidAmount",
    "BalanceAmount",
    
];

export const columns1 = [
    "HSN Item Name",
    "Quantity",
    "Rate",
    "Basic Amt",
    "CGST %",
    "CGST Amt",
    "SGST %",
    "SGST Amt",
    "Debit note",
    "Credit note",
    "Total Amt" 
];


export const BilledBy = [
    "Billed by",
]
export const BilledTo = [
    "Billed by",
]
export const Details = [
    " ",
]

export const Rows1 = (data) => {
    
    const { CRDRNoteItems = [] } = data
    CRDRNoteItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let totalBasicAmount = 0
    let totalCGst = 0
    let totalSGst = 0
    let totalAmount = 0
    let totalQuantity = 0

    CRDRNoteItems.forEach((element, key) => {
        const tableitemRow = [
            element.ItemName,
            element.MRP,
            `${Number(element.Quantity).toFixed(2)} ${element.UnitName}`,
            element.Rate,
            element.BasicAmount,
            ` ${element.CGSTPercentage}%`,
            element.CGST,
            ` ${element.SGSTPercentage}%`,
            element.SGST,
            element.Amount,

        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalCGst = Number(totalCGst) + Number(element.CGST)
            totalSGst = Number(totalSGst) + Number(element.SGST)
            totalAmount = Number(totalAmount) + Number(element.Amount)
            totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
            let cgst = data["tableTot"].TotalCGst
            return ({ TotalCGst: parseInt(totalCGst) + parseInt(cgst) })
        };

        function totalrow() {
            return [
                `Total Quantity:${parseFloat(totalQuantity).toFixed(2)} ${element.UnitName}`,
                `BasicAmt:${parseFloat(totalBasicAmount).toFixed(2)}`,
                ``,
                "",
                `isaddition`,
                `CGSTAmt:${parseFloat(totalCGst).toFixed(2)}`,
                ``,
                `SGSTAmt:${parseFloat(totalSGst).toFixed(2)}`,
                "",
                `Amt:${parseFloat(totalAmount).toFixed(2)}`,
            ];
        };

        if (Gst === 0) { Gst = element.GSTPercentage };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }
        if ((Gst === element.GSTPercentage)) {
            data["tableTot"] = totalLots()
            returnArr.push(tableitemRow);
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
        if (key === CRDRNoteItems.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}



export const Rows = (data) => {
    debugger
    const { CRDRInvoices = [] } = data
    CRDRInvoices.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalPaidAmount = 0
    let TotalBalanceAmt = 0
    let Total = 0
   
    CRDRInvoices.forEach((element, key) => {
        const BalanceAmount = Number(element.GrandTotal) - Number(element.PaidAmount)
         element.BalanceAmt = BalanceAmount
        const date = concatDateAndTime(element.InvoiceDate, element.CreatedOn)
        const tableitemRow = [
            date,
            element.FullInvoiceNumber,
            Number(element.GrandTotal).toFixed(2),
            Number(element.PaidAmount).toFixed(2),
            Number (BalanceAmount).toFixed(2),
        ];
     
        function totalLots() {
            TotalPaidAmount = Number(TotalPaidAmount) + Number(element.PaidAmount)
            TotalBalanceAmt = Number(TotalBalanceAmt) + Number(BalanceAmount)
            Total = Number(Total) + Number(element.GrandTotal)
            // let cgst = data["tableTot"].Total
            // return ({ TotalCGst: cgst })
        };

        function totalrow() {
            return [
                "Total Amoumt Paid",
                "",
                "",
                // `Total:${parseFloat(Total).toFixed(2)}`,
                `${parseFloat(TotalPaidAmount).toFixed(2)}`,
                // `BalnceAmt:${parseFloat(TotalBalanceAmt).toFixed(2)}`,
             
              
              
            ];
        };


        // if (Gst === 0) { Gst = element.GSTPercentage };
        // let aa = { TotalCGst: 0, totalSGst: 0 }
        // if (data["tableTot"] === undefined) { data["tableTot"] = aa }
        if ((Gst === element.GSTPercentage)) {
            data["tableTot"] = totalLots()
            returnArr.push(tableitemRow);
        }
        else {
            // returnArr.push(totalrow());
            returnArr.push(tableitemRow);
           

            data["tableTot"] = totalLots()
            Gst = element.GSTPercentage;
        }
        if (key === CRDRInvoices.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}

export const BilledByRow = (data) => {

    var BilledToArray = [
        [`Party Name :${data.Party}`],
        [`Party GSTIN :${data.PartyGSTIN}`],
        [`State :${data.PartyState}`],
        [`Address :${data.PartyAddress}`],
        [`PartyFSSAINo :${data.PartyFSSAINo}`],

    ]

    return BilledToArray;

    // var BilledByArray = [
    //     [`Customer Name: ${data.Customer}`],
    //     [`Customer GSTIN: ${data.CustomerGSTIN}`],
    //     [`State :${data.CustomerState}`],
    //     [`Address:${data.CustomerAddress}`],
    //     [`CustomerFSSAINo :${data.CustomerFSSAINo}`],
    // ]
    // return BilledByArray;
}
export const BilledToRow = (data) => {
    var BilledByArray = [
        [`Customer Name :${data.Customer}`],
        [`Customer GSTIN:${data.CustomerGSTIN}`],
        [`State :${data.CustomerState}`],
        [`Address :${data.CustomerAddress}`],
        [`CustomerFSSAINo :${data.CustomerFSSAINo}`],
    ]
    return BilledByArray;

    // var BilledToArray = [
    //     [`Party Name :${data.Party}`],
    //     [`Party GSTIN:${data.PartyGSTIN}`],
    //     [`State :${data.PartyState}`],
    //     [`Address:${data.PartyAddress}`],
    //     [`PartyFSSAINo:${data.PartyFSSAINo}`],

    // ]

    // return BilledToArray;
}

export const DetailsRow = (data) => {

    const Date = concatDateAndTime(data.CRDRNoteDate, data.CreatedOn)
    var DetailsArray = [
        [`Note Date :${Date}`],
        [`Note NO :${data.NoteNo}`],
        [`Note Reason :${data.NoteReason}`],
        [`Note Type ${data.NoteType}`],
        // [`Narration : ${data.Narration}`],

    ]

    return DetailsArray;
}









