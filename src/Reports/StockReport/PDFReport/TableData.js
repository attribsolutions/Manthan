import { numberWithCommas } from "../../Report_common_function";
import { date_dmy_func, getFixedNumber } from "../../../components/Common/CommonFunction";

export const columns = [
    "Group Name",
    "Sub Group Name",
    "Item Name",
    "Opening balance",
    "GRN Inward",
    "SalesReturn ",
    "Sale",
    "Purchase Return",
    "Stock Adjustment",
    "Closing balance",
    "Closing Amount",
    "Actual Stock",
    "Unit"

];
export const columns_for_ChitaleSweetsAndSnacks = [
    "Group Name",
    "Sub Group Name",
    "Item Name",
    "Opening balance",
    "GRN Inward",
    "IB Purchase",
    "Material Issue",
    "Production",
    "IB Sales",
    "SalesReturn ",
    "Sale",
    "Purchase Return",
    "Stock Adjustment",
    "Closing balance",
    "Closing Amount",
    "Actual Stock",
    "Unit"

];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    const { StockDetails = [] } = data
    StockDetails.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Item = 0
    let TotalOpeningBalance = 0
    let TotalClosingBalance = 0
    let TotalGRNInward = 0
    let TotalSalesReturn = 0
    let TotalSale = 0
    let TotalPurchaseReturn = 0
    let TotalStockAdjustment = 0
    let TotalActualStock = 0
    let TotalClosingAmount = 0

    StockDetails.forEach((element, key) => {

        const tableitemRow = [
            `${element.GroupName}`,
            `${element.SubGroupName}`,
            `${element.ItemName}`,
            `${numberWithCommas(Number(element.OpeningBalance).toFixed(2))}`,
            `${numberWithCommas(Number(element.GRNInward).toFixed(2))}`,
            `${numberWithCommas(Number(element.SalesReturn).toFixed(2))}`,
            `${numberWithCommas(Number(element.Sale).toFixed(2))}`,
            `${numberWithCommas(Number(element.PurchaseReturn).toFixed(2))}`,
            `${numberWithCommas(Number(element.StockAdjustment).toFixed(2))}`,
            `${numberWithCommas(Number(element.ClosingBalance).toFixed(2))}`,
            `${numberWithCommas(Number(element.ClosingAmount).toFixed(2))}`,
            `${numberWithCommas(Number(element.ActualStock).toFixed(2))}`,
            `${element.UnitName}`,

        ];

        function totalLots() {
            TotalOpeningBalance = Number(TotalOpeningBalance) + Number(element.OpeningBalance)
            TotalClosingBalance = Number(TotalClosingBalance) + Number(element.ClosingBalance)
            TotalGRNInward = Number(TotalGRNInward) + Number(element.GRNInward)
            TotalSalesReturn = Number(TotalSalesReturn) + Number(element.SalesReturn)
            TotalSale = Number(TotalSale) + Number(element.Sale)
            TotalPurchaseReturn = Number(TotalPurchaseReturn) + Number(element.PurchaseReturn)
            TotalStockAdjustment = Number(TotalStockAdjustment) + Number(element.StockAdjustment)
            TotalActualStock = Number(TotalActualStock) + Number(element.ActualStock)
            TotalClosingAmount = Number(TotalClosingAmount) + Number(element.ClosingAmount)

        };

        function totalrow() {
            return [
                `Total`,
                ``,
                ``,
                `${numberWithCommas(Number(TotalOpeningBalance).toFixed(2))}`,
                `${numberWithCommas(Number(TotalGRNInward).toFixed(2))}`,
                `${numberWithCommas(Number(TotalSalesReturn).toFixed(2))}`,
                `${numberWithCommas(Number(TotalSale).toFixed(2))}`,
                `${numberWithCommas(Number(TotalPurchaseReturn).toFixed(2))}`,
                `${numberWithCommas(Number(TotalStockAdjustment).toFixed(2))}`,
                `${numberWithCommas(Number(TotalClosingBalance).toFixed(2))}`,
                `${numberWithCommas(Number(TotalClosingAmount).toFixed(2))}`,
                `${numberWithCommas(Number(TotalActualStock).toFixed(2))}`,
            ];
        };

        if (Item === 0) { Item = element.Item };
        if ((Item === element.Item)) {
            // returnArr.push(totalrow());
            // returnArr.push(materialRow());
            returnArr.push(tableitemRow);
            data["tableTot"] = totalLots()
        }
        if (key === StockDetails.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const Rows_for_ChitaleSweetsAndSnacks = (data) => {
    const { StockDetails = [] } = data
    StockDetails.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Item = 0
    let TotalOpeningBalance = 0
    let TotalClosingBalance = 0
    let TotalGRNInward = 0
    let TotalSalesReturn = 0
    let TotalSale = 0
    let TotalPurchaseReturn = 0
    let TotalStockAdjustment = 0
    let TotalActualStock = 0
    let TotalClosingAmount = 0
    let TotalProduction = 0
    let TotalIBPurchase = 0
    let TotalIBSale = 0
    let TotalMaterialIssue = 0




    StockDetails.forEach((element, key) => {
        debugger
        const tableitemRow = [
            `${element.GroupName}`,
            `${element.SubGroupName}`,
            `${element.ItemName}`,
            `${numberWithCommas(getFixedNumber(element.OpeningBalance, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.GRNInward, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.IBPurchase, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.MaterialIssue, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.Production, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.IBSale, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.SalesReturn, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.Sale, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.PurchaseReturn, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.StockAdjustment, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.ClosingBalance, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.ClosingAmount, 3).toFixed(3))}`,
            `${numberWithCommas(getFixedNumber(element.ActualStock, 3).toFixed(3))}`,
            `${element.UnitName}`,

        ];

        function totalLots() {
            TotalOpeningBalance = Number(TotalOpeningBalance) + Number(element.OpeningBalance)
            TotalClosingBalance = Number(TotalClosingBalance) + Number(element.ClosingBalance)
            TotalMaterialIssue = Number(TotalMaterialIssue) + Number(element.MaterialIssue)
            TotalGRNInward = Number(TotalGRNInward) + Number(element.GRNInward)
            TotalSalesReturn = Number(TotalSalesReturn) + Number(element.SalesReturn)
            TotalSale = Number(TotalSale) + Number(element.Sale)
            TotalPurchaseReturn = Number(TotalPurchaseReturn) + Number(element.PurchaseReturn)
            TotalStockAdjustment = Number(TotalStockAdjustment) + Number(element.StockAdjustment)
            TotalActualStock = Number(TotalActualStock) + Number(element.ActualStock)
            TotalClosingAmount = Number(TotalClosingAmount) + Number(element.ClosingAmount)
            TotalProduction = Number(TotalProduction) + Number(element.Production)
            TotalIBPurchase = Number(TotalIBPurchase) + Number(element.IBPurchase)
            TotalIBSale = Number(TotalIBSale) + Number(element.IBSale)

        };

        function totalrow() {
            return [
                `Total`,
                ``,
                ``,
                `${numberWithCommas(getFixedNumber(TotalOpeningBalance).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalGRNInward).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalIBPurchase).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalMaterialIssue).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalProduction).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalIBSale).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalSalesReturn).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalSale).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalPurchaseReturn).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalStockAdjustment).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalClosingBalance).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalClosingAmount).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalActualStock).toFixed(3))}`,
            ];
        };

        if (Item === 0) { Item = element.Item };
        if ((Item === element.Item)) {
            // returnArr.push(totalrow());
            // returnArr.push(materialRow());
            returnArr.push(tableitemRow);
            data["tableTot"] = totalLots()
        }
        if (key === StockDetails.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}



export const ReportHederRows = (data) => {
    var reportArray = [
        [`From Date:  ${date_dmy_func(data.FromDate)}`,],
        [`To Date:      ${date_dmy_func(data.ToDate)}`],
    ]
    return reportArray;
}