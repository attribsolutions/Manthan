import { numberWithCommas } from "../../Report_common_function";
import { date_dmy_func } from "../../../components/Common/CommonFunction";

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


export const ReportHederRows = (data) => {
    var reportArray = [
        [`From Date:  ${date_dmy_func(data.FromDate)}`,],
        [`To Date:      ${date_dmy_func(data.ToDate)}`],
    ]
    return reportArray;
}