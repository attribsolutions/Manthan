import { date_dmy_func } from "../../components/Common/CommonFunction";
import { invoice } from "../ReportIndex";

export const columns = [
    "HSN Item Name",
    "MRP",
    "Quantity",
    "Rate",
    "Basic Amt",
    "CGST %",
    "CGST Amt",
    "SGST %",
    "SGST Amt",
    "Total Amt"
];

export const columns1 = [
    "HSN Item Name",
    "Quantity",
    "Rate",
    "Basic Amount",
    "CGST %",
    "CGST Amount",
    "SGST %",
    "SGST Amount",
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
export const DetailsOfTransport = [
    "Billed by",
]

export const Rows = (data) => {
    const { InvoiceItems = [] } = data
    InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let totalBasicAmount = 0
    let totalCGst = 0
    let totalSGst = 0
    let totalAmount = 0
    let totalQuantity = 0

    InvoiceItems.forEach((element, key) => {
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
        if (key === InvoiceItems.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}

export const BilledByRow = (data) => {
    let DefaultAddress = data.PartyAddress.filter( IsDefaultAddress => IsDefaultAddress['IsDefault'] === true )
    var date = date_dmy_func(DefaultAddress[0].FSSAIExipry)
    var BilledByArray = [
        [`${data.PartyName}`],
        [`${data.PartyState}`],
        [`${DefaultAddress[0].Address}`],
        [`GSTIN:${data.PartyGSTIN}`],
        [`FSSAI NO${DefaultAddress[0].FSSAINo} (Exp:${date})`],
    ]
    return BilledByArray;
}
export const BilledToRow = (data) => {
    let DefaultAddress = data.CustomerAddress.filter(IsDefaultAddress => IsDefaultAddress['IsDefault'] === true )
    var date = date_dmy_func(DefaultAddress[0].FSSAIExipry)
    var BilledToArray = [
        [`${data.CustomerName}`],
        [`${data.CustomerState}`],
        [`${DefaultAddress[0].Address}`],
        [`GSTIN:${data.CustomerGSTIN}`,],
        [`FSSAI NO:${DefaultAddress[0].FSSAINo} (Exp:${date})`],
    ]

    return BilledToArray;
}
export const DetailsOfTransportRow = (data) => {

    var DetailsOfTransportArray = [
        ['Driver Name : Sameer'],
        [`vehical No :MH34566`],
        [`State:Maharashtra `],
        [`E-way Bill :24654364633`],
        [`INR NO :${data.FullInvoiceNumber}`]
    ]

    return DetailsOfTransportArray;
}








