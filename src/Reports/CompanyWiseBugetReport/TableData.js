
export const columns = [
    "Company",
    "CX primary Amount @ SS Landing",
    "CX Purchase Amount",
    "CX return Value",
    "CX Net Purchase Value",
    "Budget Only Expiry From CX",
    "CX Claim Amount",
    "CX Claim Against % Net Sale",
];

export const ProductWisecolumns = [
    "Customer Name",
    "Product",
    "CX Purchase @ SS Landing Amount ",
    "CX Purchase Amount",
    "CX return Value",
    "CX Net Sale Value",
    "CX Budget Generated",
    "CX Claim Amount",
    "CX Claim Against % Net Sale",
];



export const Rows = (data) => {
    const { InvoiceItems = [] } = data
    InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let TotalCXprimaryAmount = 0
    let TotalCXPurchaseAmount = 0
    let TotalCXreturnValue = 0
    let TotalCXNetPurchaseValue = 0
    let TotalBudgetOnlyExpiryFrom = 0
    let TotalCXClaimAmount = 0
    let TotalNetSale = 0

    InvoiceItems.forEach((element, key) => {

        const tableitemRow = [
            element.Details,
            element.Particulars,
            element.TransactionType,
            element.InQuantity,
            element.OutQuantity,
            element.IssueQuanity,
            element.Balance,

        ];

        function totalLots() {
            TotalCXprimaryAmount = Number(TotalCXprimaryAmount) + Number(element.InQuantity)
            TotalCXPurchaseAmount = Number(TotalCXPurchaseAmount) + Number(element.OutQuantity)
            TotalCXreturnValue = Number(TotalCXreturnValue) + Number(element.IssueQuanity)
            TotalCXNetPurchaseValue = Number(TotalCXNetPurchaseValue) + Number(element.Balance)
            TotalBudgetOnlyExpiryFrom = Number(TotalBudgetOnlyExpiryFrom) + Number(element.Balance)
            TotalCXClaimAmount = Number(TotalCXClaimAmount) + Number(element.Balance)
            TotalNetSale = Number(TotalNetSale) + Number(element.Balance)




        };

        function totalrow() {
            return [
                "Total",
                `${Number(TotalCXprimaryAmount).toFixed(2)}`,
                `${Number(TotalCXPurchaseAmount).toFixed(2)}`,
                `${Number(TotalCXreturnValue).toFixed(2)}`,
                `${Number(TotalCXNetPurchaseValue).toFixed(2)}`,
                `${Number(TotalBudgetOnlyExpiryFrom).toFixed(2)}`,
                `${Number(TotalCXClaimAmount).toFixed(2)}`,
                `${Number(TotalNetSale).toFixed(2)}`,
            ];
        };



        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }

        else {
            // returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            data["tableTot"] = totalLots()
        }
        if (key === InvoiceItems.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const ProductWiseRows = (data) => {
    const { InvoiceItems = [] } = data
    InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalInQuantity = 0


    InvoiceItems.forEach((element, key) => {
        const tableitemRow = [
            element.BatchDate,
            element.Particulars,
            element.TransactionType,
            element.InQuantity,
            element.OutQuantity,
            element.IssueQuanity,
            element.Balance,

        ];

        function totalLots() {
            TotalInQuantity = Number(TotalInQuantity) + Number(element.InQuantity)

        };

        function totalrow() {
            return [
                "Total",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",


            ];
        };


        if (Gst === 0) { Gst = element.GSTPercentage };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }

        else {
            // returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            data["tableTot"] = totalLots()
        }
        if (key === InvoiceItems.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}