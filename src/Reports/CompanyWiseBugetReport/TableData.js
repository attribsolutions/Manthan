import { numberWithCommas } from "../Report_common_function";

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
    "Product",
    "Purchase @ SS Landing Amount ",
    "Purchase Amount",
    "Return Value",
    "Net Sale Value",
    "Budget Generated",
    "Claim Amount",
    "Claim Against % Net Sale",
];


export const Rows = (table = []) => {

    const returnArr = [];
    let TotalCXprimaryAmount = 0
    let TotalCXPurchaseAmount = 0
    let TotalCXreturnValue = 0
    let TotalCXNetPurchaseValue = 0
    let TotalBudgetOnlyExpiryFrom = 0
    let TotalCXClaimAmount = 0
    let TotalNetSale = 0

    table.forEach((index, key) => {

        const tableitemRow = [
            `${index.ItemReasonName}`,
            `${numberWithCommas(Number(index.PrimaryAmount).toFixed(2))}`,
            `${numberWithCommas(Number(index.SecondaryAmount).toFixed(2))}`,
            `${numberWithCommas(Number(index.ReturnAmount).toFixed(2))}`,
            `${numberWithCommas(Number(index.NetSaleValue).toFixed(2))}`,
            `${numberWithCommas(Number(index.Budget).toFixed(2))}`,
            `${numberWithCommas(Number(index.ClaimAmount).toFixed(2))}`,
            `${numberWithCommas(Number(index.ClaimAgainstNetSale).toFixed(2))}`,
        ];

        function totalLots() {
            TotalCXprimaryAmount = Number(TotalCXprimaryAmount) + Number(index.PrimaryAmount)
            TotalCXPurchaseAmount = Number(TotalCXPurchaseAmount) + Number(index.SecondaryAmount)
            TotalCXreturnValue = Number(TotalCXreturnValue) + Number(index.ReturnAmount)
            TotalCXNetPurchaseValue = Number(TotalCXNetPurchaseValue) + Number(index.NetSaleValue)
            TotalBudgetOnlyExpiryFrom = Number(TotalBudgetOnlyExpiryFrom) + Number(index.Budget)
            TotalCXClaimAmount = Number(TotalCXClaimAmount) + Number(index.ClaimAmount)
            TotalNetSale = Number(TotalNetSale) + Number(index.ClaimAgainstNetSale)
        };

        function totalrow() {
            return [
                "Total",
                `${numberWithCommas(Number(TotalCXprimaryAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXPurchaseAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXreturnValue).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXNetPurchaseValue).toFixed(2))}`,
                `${numberWithCommas(Number(TotalBudgetOnlyExpiryFrom).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXClaimAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalNetSale).toFixed(2))}`,
            ];
        };

        returnArr.push(tableitemRow);
        totalLots()

        if (key === table.length - 1) {
            returnArr.push(totalrow());
        }

    })
    return returnArr;
}


export const ProductWiseRows = (data) => {
    const { ProductwiseBudgetReport = [] } = data
    ProductwiseBudgetReport.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let TotalInQuantity = 0
    ProductwiseBudgetReport.forEach((element, key) => {
        const tableitemRow = [
            // element.BatchDate,
            `${element.Product}`,
            `${numberWithCommas(Number(element.PrimaryAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.SecondaryAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.ReturnAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.NetSaleValue).toFixed(2))}`,
            `${numberWithCommas(Number(element.Budget).toFixed(2))}`,
            `${numberWithCommas(Number(element.ClaimAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.ClaimAgainstNetSale).toFixed(2))}`,
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