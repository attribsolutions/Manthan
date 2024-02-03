import { numberWithCommas } from "../../../Report_common_function";

export const columns = [
    "Company",
    "Purchase Amount",
    "Sale Amount",
    "Return Value",
    "Net Purchase Value",
    "Budget Only Expiry ",
    "Claim Amount",
    "Claim % Against Purchase Amount",
];

export const ProductWisecolumns = [
    "Product",
    "Purchase Amount",
    "Sale Amount",
    "Return Value",
    "Net Purchase Value",
    "Budget Generated",
    "Claim Amount",
    "Claim % Against Purchase Amount",
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
            `${numberWithCommas(Number(index.PurchaseAmount).toFixed(2))}`,
            `${numberWithCommas(Number(index.SaleAmount).toFixed(2))}`,
            `${numberWithCommas(Number(index.ReturnAmount).toFixed(2))}`,
            `${numberWithCommas(Number(index.NetSaleValue).toFixed(2))}`,
            `${numberWithCommas(Number(index.Budget).toFixed(2))}`,
            `${numberWithCommas(Number(index.ClaimAmount).toFixed(2))}`,
            `${numberWithCommas(Number(index.ClaimAgainstNetSale).toFixed(2))} %`,
        ];

        function totalLots() {
            TotalCXPurchaseAmount = Number(index.PurchaseAmount)
            TotalCXprimaryAmount = Number(index.SaleAmount)
            TotalCXreturnValue = Number(TotalCXreturnValue) + Number(index.ReturnAmount)
            TotalCXNetPurchaseValue = Number(TotalCXNetPurchaseValue) + Number(index.NetSaleValue)
            TotalBudgetOnlyExpiryFrom = Number(TotalBudgetOnlyExpiryFrom) + Number(index.Budget)
            TotalCXClaimAmount = Number(TotalCXClaimAmount) + Number(index.ClaimAmount)
            TotalNetSale = Number(TotalNetSale) + Number(index.ClaimAgainstNetSale)
        };

        function totalrow() {

            const TotalNetPurchaseValue = TotalCXPurchaseAmount - TotalCXreturnValue;
            table["TotalNetPurchaseValue"] = TotalNetPurchaseValue;
            const ClaimAgainstNetSale = (TotalCXClaimAmount / TotalCXPurchaseAmount) * 100
            return [
                "Total",
                `${numberWithCommas(Number(TotalCXPurchaseAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXprimaryAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXreturnValue).toFixed(2))}`,
                `${numberWithCommas(Number(TotalNetPurchaseValue).toFixed(2))}`,
                `${numberWithCommas(Number(TotalBudgetOnlyExpiryFrom).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXClaimAmount).toFixed(2))}`,
                `${numberWithCommas(Number(ClaimAgainstNetSale).toFixed(2))}%`,
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
    let TotalCXprimaryAmount = 0
    let TotalCXPurchaseAmount = 0
    let TotalCXreturnValue = 0
    let TotalCXNetPurchaseValue = 0
    let TotalBudgetOnlyExpiryFrom = 0
    let TotalCXClaimAmount = 0
    let TotalNetSale = 0
    ProductwiseBudgetReport.forEach((element, key) => {
        const tableitemRow = [
            `${element.Product}`,
            `${numberWithCommas(Number(element.PurchaseAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.SaleAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.ReturnAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.NetSaleValue).toFixed(2))}`,
            `${numberWithCommas(Number(element.Budget).toFixed(2))}`,
            `${numberWithCommas(Number(element.ClaimAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.ClaimAgainstNetSale).toFixed(2))}%`,
        ];
        function totalLots() {
            TotalInQuantity = Number(TotalInQuantity) + Number(element.InQuantity)
            TotalCXprimaryAmount = Number(TotalCXprimaryAmount) + Number(element.SaleAmount)
            TotalCXPurchaseAmount = Number(TotalCXPurchaseAmount) + Number(element.PurchaseAmount)
            TotalCXreturnValue = Number(TotalCXreturnValue) + Number(element.ReturnAmount)
            TotalCXNetPurchaseValue = Number(TotalCXNetPurchaseValue) + Number(element.NetSaleValue)
            TotalBudgetOnlyExpiryFrom = Number(TotalBudgetOnlyExpiryFrom) + Number(element.Budget)
            TotalCXClaimAmount = Number(TotalCXClaimAmount) + Number(element.ClaimAmount)
            TotalNetSale = Number(TotalNetSale) + Number(element.ClaimAgainstNetSale)

        };

        function totalrow() {
            const ClaimAgainstNetSale = (TotalCXClaimAmount / TotalCXPurchaseAmount) * 100
            return [
                "Total",
                `${numberWithCommas(Number(TotalCXPurchaseAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXprimaryAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXreturnValue).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXNetPurchaseValue).toFixed(2))}`,
                `${numberWithCommas(Number(TotalBudgetOnlyExpiryFrom).toFixed(2))}`,
                `${numberWithCommas(Number(TotalCXClaimAmount).toFixed(2))}`,
                `${numberWithCommas(Number(ClaimAgainstNetSale).toFixed(2))}%`,
            ];
        };

        returnArr.push(tableitemRow);
        totalLots()

        if (key === ProductwiseBudgetReport.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}