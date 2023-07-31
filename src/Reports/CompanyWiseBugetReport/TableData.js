
export const columns = [
    "Company",
    "Primary Amount @ SS Landing",
    "Purchase Amount",
    "Return Value",
    "Net Purchase Value",
    "Budget Only Expiry ",
    "Claim Amount",
    "Claim Against % Net Sale",
];

export const ProductWisecolumns = [
    // "Customer Name",
    "Product",
    "Purchase @ SS Landing Amount ",
    "Purchase Amount",
    "Return Value",
    "Net Sale Value",
    "Budget Generated",
    "Claim Amount",
    "Claim Against % Net Sale",
];


export const Rows = (data) => {
    const { ReasonwiseMasterClaim = [] } = data
    // InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let TotalCXprimaryAmount = 0
    let TotalCXPurchaseAmount = 0
    let TotalCXreturnValue = 0
    let TotalCXNetPurchaseValue = 0
    let TotalBudgetOnlyExpiryFrom = 0
    let TotalCXClaimAmount = 0
    let TotalNetSale = 0

    ReasonwiseMasterClaim[0].RetailerClaim.forEach((element, key) => {
        const tableitemRow = [
            element.ItemReasonName,
            element.PrimaryAmount,
            element.SecondaryAmount,
            element.ReturnAmount,
            element.NetSaleValue,
            element.Budget,
            element.ClaimAmount,
            element.ClaimAgainstNetSale,

        ];

        function totalLots() {
            TotalCXprimaryAmount = Number(TotalCXprimaryAmount) + Number(element.PrimaryAmount)
            TotalCXPurchaseAmount = Number(TotalCXPurchaseAmount) + Number(element.SecondaryAmount)
            TotalCXreturnValue = Number(TotalCXreturnValue) + Number(element.ReturnAmount)
            TotalCXNetPurchaseValue = Number(TotalCXNetPurchaseValue) + Number(element.NetSaleValue)
            TotalBudgetOnlyExpiryFrom = Number(TotalBudgetOnlyExpiryFrom) + Number(element.Budget)
            TotalCXClaimAmount = Number(TotalCXClaimAmount) + Number(element.ClaimAmount)
            TotalNetSale = Number(TotalNetSale) + Number(element.ClaimAgainstNetSale)

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

        returnArr.push(tableitemRow);
        data["tableTot"] = totalLots()

        if (key === ReasonwiseMasterClaim[0].RetailerClaim.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const ProductWiseRows = (data) => {
    
    const { ProductwiseBudgetReport = [] } = data
    ProductwiseBudgetReport.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalInQuantity = 0


    ProductwiseBudgetReport.forEach((element, key) => {
        const tableitemRow = [
            // element.BatchDate,
            element.Product,
            element.PrimaryAmount,
            element.SecondaryAmount,
            element.ReturnAmount,
            element.NetSaleValue,
            element.Budget,
            element.ClaimAmount,
            element.ClaimAgainstNetSale,


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




        returnArr.push(tableitemRow);


        if (key === ProductwiseBudgetReport.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}