import { numberWithCommas, toWords } from "../Report_common_function";


export const columns = [
    "SN",
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
export const columnsWithIGST = [
    "SN",
    "HSN Item Name",
    "Quantity (UOM)",
    "MRP",
    "Rate",
    "Discount",
    "Discount Amount ",
    "Taxable Amount",
    "          IGST           %        Amount",
    "IGST Amount",
    "Amount",
];



export const Footercolumn = [
    "",
]
export const INR_NO = [
    "INR_NO",
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

export const Ruppescolumn = [
    "",
]

export const Bankcolumn = [
    "",
    "",
    "",
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
    let SrNO = 1
    let TotalGst = 0
    let GSTPercentage = 0

    const groupedItems = InvoiceItems.reduce((accumulator, currentItem) => {


        const { HSNCode, ItemName, MRP, Rate, Discount, CGST, SGST, Amount, DiscountAmount, BasicAmount, Quantity, UnitName, MRPValue, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchCode, BatchDate, DiscountType, PrimaryUnitName } = currentItem;
        let PcsinNumber = ""
        let PcsinNumberUnit = ""
        const pattern = /\((.*?)\)/;

        if (currentItem.UnitName !== "") {
            const matchFound = currentItem.UnitName.match(pattern);
            const extractedText = matchFound[1];
            console.log(extractedText); // Output: "19.0 No"
            const match = extractedText.split(" ")
            PcsinNumber = match[0];
            PcsinNumberUnit = match[1];

        }
        const key = ItemName + '_' + MRP;
        if (accumulator[key]) {
            accumulator[key].PcsinNumber += Number(PcsinNumber);
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
                MRPValue, DiscountType, Rate, Discount, PcsinNumberUnit: PcsinNumberUnit, PcsinNumber: Number(PcsinNumber), CGST: Number(CGST), SGST: Number(SGST), Amount: Number(Amount), DiscountAmount: Number(DiscountAmount), BasicAmount: Number(BasicAmount), Quantity: Number(Quantity), UnitName, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchDate, BatchCode: BatchCode, BatchDate: BatchDate, quantityString: `  ${BatchCode}  ${BatchDate}`, PrimaryUnitName
            };
        }
        return accumulator;
    }, {});

    const TotalItemlength = Object.values(groupedItems).length;
    data["TotalItemlength"] = TotalItemlength;

    Object.values(groupedItems).forEach((element, key) => {

        let HSNcodes = ""
        if (element.HSNCode) {

            if (data.SettingData.HSNCodeDigit === "1") {
                HSNcodes = element.HSNCode.slice(0, 4);
            }
            if (data.SettingData.HSNCodeDigit === "2") {
                HSNcodes = element.HSNCode.slice(0, 6);
            }
            if (data.SettingData.HSNCodeDigit === "3") {
                HSNcodes = element.HSNCode.slice(0, 8);
            }
        }
        const tableitemRow = [
            SrNO++,
            `${HSNcodes} ${element.ItemName}`,
            element.UnitName === "" ? `${parseFloat(element.Quantity)} ${element.PrimaryUnitName}   ${element.UnitName}` : `${parseFloat(element.Quantity)} ${element.PrimaryUnitName}(${element.PcsinNumber} ${element.PcsinNumberUnit})`,
            `${numberWithCommas(Number(element.MRPValue).toFixed(2))}`,
            `${numberWithCommas(Number(element.Rate).toFixed(2))}`,
            `${parseFloat(element.Discount)} ${element.DiscountType === "1" ? "Rs" : "%"}`,
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
        if (data.SettingData.ShowBatchNoOnInvoicePrint === "1") {
            returnArr.push((BatchRow))
        }

        if (key === Object.keys(groupedItems).length - 1) {

            returnArr.push(totalrow());
        }
    })
    return returnArr;
}

export const RowsWithIGST = (data) => {

    const { InvoiceItems = [] } = data
    InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let totalBasicAmount = 0
    let totalIGst = 0
    let totalAmount = 0
    let totalQuantity = 0
    let SrNO = 1
    let GSTPercentage = 0

    const groupedItems = InvoiceItems.reduce((accumulator, currentItem) => {

        const { HSNCode, ItemName, IGSTPercentage, MRP, Rate, Discount, CGST, SGST, Amount, DiscountAmount, BasicAmount, Quantity, UnitName, MRPValue, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchCode, BatchDate, DiscountType, PrimaryUnitName, IGST } = currentItem;
        const key = ItemName + '_' + MRP;
        if (accumulator[key]) {
            accumulator[key].DiscountAmount += Number(DiscountAmount);
            accumulator[key].Quantity += Number(Quantity);
            accumulator[key].BasicAmount += Number(BasicAmount);
            accumulator[key].CGST += Number(CGST);
            accumulator[key].IGST += Number(IGST);
            accumulator[key].SGST += Number(SGST);
            accumulator[key].Amount += Number(Amount);
            accumulator[key].BatchCode += BatchCode;
            accumulator[key].BatchDate += BatchDate;
            accumulator[key].quantityString += ` ,  ${BatchCode} ${BatchDate} `;

        } else {
            accumulator[key] = {
                ItemName, HSNCode,
                MRPValue, IGSTPercentage, DiscountType, Rate, Discount, CGST: Number(CGST), SGST: Number(SGST), Amount: Number(Amount), DiscountAmount: Number(DiscountAmount), BasicAmount: Number(BasicAmount), Quantity: Number(Quantity), UnitName, CGSTPercentage, SGSTPercentage, GSTPercentage, BatchDate, BatchCode: BatchCode, BatchDate: BatchDate, quantityString: `  ${BatchCode}  ${BatchDate}`, PrimaryUnitName, IGST
            };
        }
        return accumulator;
    }, {});

    Object.values(groupedItems).forEach((element, key) => {

        let HSNcodes = ""
        if (element.HSNCode) {
            if (data.SettingData.HSNCodeDigit === "1") {
                HSNcodes = element.HSNCode.slice(0, 4);
            }
            if (data.SettingData.HSNCodeDigit === "2") {
                HSNcodes = element.HSNCode.slice(0, 6);
            }
            if (data.SettingData.HSNCodeDigit === "3") {
                HSNcodes = element.HSNCode.slice(0, 8);
            }
        }
        const tableitemRow = [
            SrNO++,
            `${HSNcodes} ${element.ItemName}`,
            `${Number(element.Quantity).toFixed(2)} ${element.PrimaryUnitName}   ${element.UnitName}`,
            `${numberWithCommas(Number(element.MRPValue).toFixed(2))}`,
            `${numberWithCommas(Number(element.Rate).toFixed(2))}`,
            `${element.Discount} ${element.DiscountType === "1" ? "Rs" : "%"}`,
            `${numberWithCommas(Number(element.DiscountAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.BasicAmount).toFixed(2))}`,
            `${Number(element.IGSTPercentage).toFixed(1)}%`,
            `${numberWithCommas(Number(element.IGST).toFixed(2))}`,
            `${numberWithCommas(Number(element.Amount).toFixed(2))}`,
        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalIGst = Number(totalIGst) + Number(element.IGST)
            totalAmount = Number(totalAmount) + Number(element.Amount)
            totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
            GSTPercentage = Number(element.IGSTPercentage)


        };


        function totalrow() {

            return [
                "",
                ` GST ${(parseFloat(GSTPercentage))}%  Total:${numberWithCommas(Number(totalIGst).toFixed(2))} `,
                " ",
                ``,
                "",
                "",
                ``,
                `${numberWithCommas(Number(totalBasicAmount).toFixed(2))}`,
                `${numberWithCommas(Number(totalIGst).toFixed(2))}`,
                "isaddition",
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
            totalAmount = 0
            totalQuantity = 0

            data["tableTot"] = totalLots()
            Gst = element.GSTPercentage;
        }
        if (data.SettingData.ShowBatchNoOnInvoicePrint === "1") {
            returnArr.push((BatchRow))
        }

        if (key === Object.keys(groupedItems).length - 1) {

            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const BilledByRow = (data) => {

    let PartyAddress = ""
    if (Array.isArray(data.PartyAddress)) {
        const filteredArray = data.PartyAddress.filter(obj => obj.IsDefault === true);
        PartyAddress = filteredArray[0] === undefined ? "" : filteredArray[0].Address
    } else {
        PartyAddress = data.PartyAddress
    }

    var BilledByArray = [
        [`            ${data.PartyName}`],
        [`                 ${PartyAddress}`],
        [`            ${data.PartyState}`],
        [`              ${data.PartyGSTIN}`],
        [`                   ${data.PartyFSSAINo}`],
        [`                   ${data.PartyMobileNo}`],

    ]
    return BilledByArray;
}
export const BilledToRow = (data) => {

    let CustomerAddress = ""
    if (Array.isArray(data.CustomerAddress)) {
        const filteredArray = data.CustomerAddress.filter(obj => obj.IsDefault === true);
        CustomerAddress = filteredArray[0] === undefined ? "" : filteredArray[0].Address
    } else {
        CustomerAddress = data.CustomerAddress
    }
    var BilledToArray = [
        [`                   ${data.CustomerName}`],
        [`                 ${CustomerAddress}`],
        [`           ${data.CustomerState}`],
        [`             ${data.CustomerGSTIN}`,],
        [`                   ${data.CustomerFSSAINo}`],
        [`                   ${data.CustomerMobileNo}`],
    ]

    return BilledToArray;
}
export const DetailsOfTransportRow = (data) => {

    let OrderNumber = " "
    if (data.InvoicesReferences.length > 0) {

        const PoNumber = data.InvoicesReferences.map(index => ({
            SystemGenerate: index.FullOrderNumber,
            Description: index.Description,
        }));
        if (PoNumber[0].Description === null) {
            OrderNumber = PoNumber[0].SystemGenerate
        } else {
            OrderNumber = PoNumber[0].Description
        }
    }

    let EwayData = ""
    if (data.InvoiceUploads.length > 0) {
        EwayData = data.InvoiceUploads[0]
    }

    var DetailsOfTransportArray = [
        [`             ${OrderNumber}`],
        [data.DriverName === null ? "" : `                        ${data.DriverName}`],
        [`                     ${data.VehicleNo === null ? "" : data.VehicleNo}`],
        [`                               ${(EwayData.EwayBillNo === undefined) || (EwayData.EwayBillNo === null) ? "" : EwayData.EwayBillNo}`],
        [`               ${(EwayData.AckNo === undefined) || (EwayData.AckNo === null) ? "" : EwayData.AckNo}`]
    ]

    return DetailsOfTransportArray;
}


export const BankRow = (data) => {

    if (data.BankData.length > 0) {
        let BankData = data.BankData[0]
        var reportArray = [
            [`A/C No: ${BankData.AccountNo}`, `IFSC Code: ${BankData.IFSC}`, `Branch: ${BankData.BranchName}`],
            [`Bank Name :${BankData.BankName}`]
        ]
    } else {
        var reportArray = [
            // [],
            // [, `Bank details not provided. Please update Bank details`]
        ]
    }

    return reportArray;
}


export const IRNNumberRow = (data) => {

    if (data.isQR) {
        const IRN_No = (data.InvoiceUploads[0].Irn === null ? "" : data.InvoiceUploads[0].Irn)

        var IRNNumberArray = [
            [`IRN No :${IRN_No}`],
        ]

    }

    return IRNNumberArray;
}


export const RupeesRow = (data) => {
    let stringNumber = toWords(Number(data.GrandTotal))

    var RupeesArray = [
        [`                  ${stringNumber}`],

    ]
    return RupeesArray;
}








