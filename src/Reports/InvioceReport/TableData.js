import { invoice, invoiceA5 } from "../ReportIndex";
export const columns = [
    "SR",
    "HSN Item Name",
    "Quantity",
    "MRP",
    "Rate",
    "Discount",
    "Discount Amount ",
    "Taxable Amount",
    "          CGST           %        Amount",
    "CGST ",
    "          SGST           %        Amount",
    "SGST Amount",
    "Total Amount",
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

// export const Rows = (data) => {
//     const { InvoiceItems = [] } = data
//     InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
//     const returnArr = [];
//     let Gst = 0
//     let totalBasicAmount = 0
//     let totalCGst = 0
//     let totalSGst = 0
//     let totalAmount = 0
//     let totalQuantity = 0
//     let SrNO = 1

//     InvoiceItems.forEach((element, key) => {

//         const tableitemRow = [
//             SrNO++,
//             `(${element.HSNCode})${element.ItemName}`,
//             `${Number(element.Quantity).toFixed(2)}${element.UnitName}`,
//             element.MRPValue,
//             element.Rate,
//             element.Discount,
//             element.DiscountAmount,
//             element.BasicAmount,
//             `${Number(element.CGSTPercentage).toFixed(1)}%`,
//             element.CGST,
//             `${Number(element.SGSTPercentage).toFixed(1)}%`,
//             element.SGST,
//             element.Amount,
//         ];

//         function totalLots() {
//             totalQuantity = Number(totalQuantity) + Number(element.Quantity)
//             totalCGst = Number(totalCGst) + Number(element.CGST)
//             totalSGst = Number(totalSGst) + Number(element.SGST)
//             totalAmount = Number(totalAmount) + Number(element.Amount)
//             totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
//             let cgst = data["tableTot"].TotalCGst
//             return ({ TotalCGst: parseInt(totalCGst) + parseInt(cgst) })
//         };

//         function totalrow() {
//             return [
//                 "",
//                 ``,
//                 " ",
//                 `TaxableAmt:${parseFloat(totalBasicAmount).toFixed(2)}`,
//                 "",
//                 "",
//                 "",
//                 "",
//                 `CGST:${parseFloat(totalCGst).toFixed(2)}`,
//                 "isaddition",
//                 `SGST:${parseFloat(totalSGst).toFixed(2)}`,
//                 "",
//                 `Amt:${parseFloat(totalAmount).toFixed(2)}`,
//             ];
//         };


//         if (Gst === 0) { Gst = element.GSTPercentage };
//         let aa = { TotalCGst: 0, totalSGst: 0 }
//         if (data["tableTot"] === undefined) { data["tableTot"] = aa }
//         if ((Gst === element.GSTPercentage)) {
//             data["tableTot"] = totalLots()
//             returnArr.push(tableitemRow);
//         }
//         else {
//             returnArr.push(totalrow());
//             returnArr.push(tableitemRow);
//             totalBasicAmount = 0
//             totalCGst = 0
//             totalSGst = 0
//             totalAmount = 0
//             totalQuantity = 0

//             data["tableTot"] = totalLots()
//             Gst = element.GSTPercentage;
//         }
//         if (key === InvoiceItems.length - 1) {
//             returnArr.push(totalrow());
//         }
//     })
//     return returnArr;
// }



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
    let SrNO = 1
    let TotalGst = 0
    let GSTPercentage = 0

    const groupedItems = InvoiceItems.reduce((accumulator, currentItem) => {
        debugger
        const { HSNCode, ItemName, MRP, Rate, Discount, CGST, SGST, Amount, DiscountAmount, BasicAmount, Quantity, UnitName, MRPValue, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchCode, BatchDate, DiscountType } = currentItem;
        const key = ItemName + '_' + MRP;
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
                MRPValue, DiscountType, Rate, Discount, CGST: Number(CGST), SGST: Number(SGST), Amount: Number(Amount), DiscountAmount: Number(DiscountAmount), BasicAmount: Number(BasicAmount), Quantity: Number(Quantity), UnitName, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchDate, BatchCode: BatchCode, BatchDate: BatchDate, quantityString: `  ${BatchCode}  ${BatchDate}`
            };
        }
        return accumulator;
    }, {});

    Object.values(groupedItems).forEach((element, key) => {
        let HSNcodes = ""

        if (data.SettingData.HSNCodeDigit.Value === "1") {
            HSNcodes = element.HSNCode.slice(0, 4);
        }
        if (data.SettingData.HSNCodeDigit.Value === "2") {
            HSNcodes = element.HSNCode.slice(0, 6);
        }
        if (data.SettingData.HSNCodeDigit.Value === "3") {
            HSNcodes = element.HSNCode.slice(0, 8);
        }

        const tableitemRow = [
            SrNO++,
            `${HSNcodes} ${element.ItemName}`,
            `${Number(element.Quantity).toFixed(2)}${element.UnitName}`,
            `${Number(element.MRPValue).toFixed(2)}`,
            `${Number(element.Rate).toFixed(2)}`,
            `${element.Discount} ${element.DiscountType === "1" ? "Rs" : "%"}`,
            `${Number(element.DiscountAmount).toFixed(2)}`,
            `${Number(element.BasicAmount).toFixed(2)}`,
            `${Number(element.CGSTPercentage).toFixed(1)}%`,
            `${Number(element.CGST).toFixed(2)}`,
            `${Number(element.SGSTPercentage).toFixed(1)}%`,
            `${Number(element.SGST).toFixed(2)}`,
            `${Number(element.Amount).toFixed(2)}`,
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
                ` GST ${(Number(GSTPercentage))}%  Total:${(Number(TotalGst).toFixed(2))} `,
                " ",
                ``,
                "",
                "",
                ``,
                `${Number(totalBasicAmount).toFixed(2)}`,
                `${Number(totalCGst).toFixed(2)}`,
                "isaddition",
                `${Number(totalSGst).toFixed(2)}`,
                "",
                `${Number(totalAmount).toFixed(2)}`,
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
            returnArr.push(tableitemRow);
            if (data.SettingData.ShowBatchNoOnInvoicePrint.Value === "1") {
                returnArr.push((BatchRow))
            }

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



export const BilledByRow = (data) => {


    var BilledByArray = [

        [`${data.PartyName}`],
        [`${data.PartyAddress}`],
        [`${data.PartyState}`],
        [`GSTIN:${data.PartyGSTIN}`],
        [`FSSAINo:${data.PartyFSSAINo}`],
    ]
    return BilledByArray;
}
export const BilledToRow = (data) => {


    var BilledToArray = [
        [`${data.CustomerName}`],
        [`${data.CustomerAddress}`],
        [`${data.CustomerState}`],
        [`GSTIN:${data.CustomerGSTIN}`,],
        [`FSSAINo:${data.CustomerFSSAINo}`],
    ]

    return BilledToArray;
}
export const DetailsOfTransportRow = (data) => {


    let result = data.InvoicesReferences.map(a => a.FullOrderNumber);
    const PONumber = result.toString()
    var DetailsOfTransportArray = [
        [data.ReportType === invoiceA5 ? ` PO Number:${PONumber}` : data.DriverName === null ? "Driver Name:" : `Driver Name :${data.DriverName}`],
        [`vehical No :${data.VehicleNo === null ? "" : data.VehicleNo}`],
        [`E-way Bill :`],
        [`IRN NO :`]
    ]

    return DetailsOfTransportArray;
}


// export const ReportHederRows = (data) => {
//     var reportArray = [
//         [, ,data.ReportType===invoice?`Purches Order No: 1`:'Driver Name : Sameer'],
//         [`${data.PartyName}`, `${data.CustomerName}`,data.ReportType===invoice?`Driver Name : Sameer`:`vehical No :MH34566` ,],
//         [`maharashtra`, `karnatak`,data.ReportType===invoice?`vehical No :MH34566`:`E-way Bill :24654364633` ],
//         [`FSSAI :f23dfxxxxxwe55`, `FSSAI :ui3dfxxxxxwe55`, data.ReportType===invoice?`E-way Bill :24654364633`:`INR NO :${data.FullInvoiceNumber}`, ],
//         [,,  data.ReportType===invoice?`INR NO :${data.FullInvoiceNumber}`:null]
//     ]
//     return reportArray;
// }





