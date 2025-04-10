import { convertOnlyTimefunc, date_dmy_func, getFixedNumber, loginUserDetails } from "../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../Report_common_function";

export const columns = [
    "SN",
    "Date",
    "Name",
    "Document No",
    "GRN",
    "Sales Return",
    "Stock",
    "Sale",
    "Purchase Return",
    "Stock      Adjustment",
    "Balance",

];


export const columns_for_ChitaleSweetsAndSnacks = [
    "SN",
    "Date",
    "Name",
    "Doc No.",
    "GRN",
    "IB        purchase ",
    "Material Issue",
    "Prod.",
    "IB Sales ",
    "Sales Return",
    "Stock",
    "Sale",
    "Purchase Return",
    "Stock     Adj.",
    "Balance",

];


export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {

    const openingBalance = Number(data[data.length - 1].OpeningBalance);

    // InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let SN = 1
    let TotalGRN = 0
    let TotalSalesReturn = 0
    let TotalStock = 0
    let TotalPurchaseReturn = 0
    let TotalSale = 0
    let TotalBalance = 0
    let TotalStockAdjustment = 0


    let Unit = data.Period.Unit.label
    let GRN = 0
    let SalesReturn = 0
    let Stock = 0
    let Sale = 0
    let PurchaseReturn = 0
    let StockAdjustment = 0


    let BalanceAmount = Number(openingBalance)

    data.forEach((element, key) => {

        let RowGRN = 0
        let RowSalesReturn = 0
        let RowStock = 0
        let RowSale = 0
        let RowPurchaseReturn = 0
        let RowStockAdjustment = 0


        if (Unit === "No") {
            GRN = Number(element.QtyInNo)
            SalesReturn = Number(element.QtyInNo)
            Stock = Number(element.QtyInNo)
            Sale = Number(element.QtyInNo)
            PurchaseReturn = Number(element.QtyInNo)
            StockAdjustment = Number(element.QtyInNo)
        }

        if (Unit === "Kg") {
            GRN = Number(element.QtyInKg)
            SalesReturn = Number(element.QtyInKg)
            Stock = Number(element.QtyInKg)
            Sale = Number(element.QtyInKg)
            PurchaseReturn = Number(element.QtyInKg)
            StockAdjustment = Number(element.QtyInKg)

        }
        if (Unit === "Box") {
            GRN = Number(element.QtyInBox)
            SalesReturn = Number(element.QtyInBox)
            Stock = Number(element.QtyInBox)
            Sale = Number(element.QtyInBox)
            PurchaseReturn = Number(element.QtyInBox)
            StockAdjustment = Number(element.QtyInBox)
        }

        if (element.Sequence === 1) {
            RowGRN = GRN
        } if (element.Sequence === 2) {
            RowSalesReturn = SalesReturn
        } if (element.Sequence === 3) {
            RowStock = Stock
        } if (element.Sequence === 4) {
            RowSale = Sale
        } if (element.Sequence === 5) {
            RowPurchaseReturn = PurchaseReturn
        } if (element.Sequence === 6) {
            RowStockAdjustment = StockAdjustment
        }

        const rowGRN = Number(RowGRN);
        const rowSalesReturn = Number(RowSalesReturn);
        const rowSale = Number(RowSale);
        const rowPurchaseReturn = Number(RowPurchaseReturn);
        const rowStockAdjustment = Number(RowStockAdjustment);

        if (element.TransactionNumber === "STOCK") {
            BalanceAmount = RowStock
        }
        BalanceAmount = (BalanceAmount + rowGRN + rowSalesReturn + rowStockAdjustment) - (rowSale + rowPurchaseReturn);
        const tableitemRow = [
            SN++,
            `${date_dmy_func(element.TransactionDate)} ${convertOnlyTimefunc(element.CreatedOn)}`,
            element.Name,
            element.TransactionNumber,
            (element.Sequence === 1) ? (numberWithCommas(Number(GRN).toFixed(2))) : "0.00",
            (element.Sequence === 2) ? (numberWithCommas(Number(SalesReturn).toFixed(2))) : "0.00",
            (element.Sequence === 3) ? (numberWithCommas(Number(Stock).toFixed(2))) : "0.00",
            (element.Sequence === 4) ? (numberWithCommas(Number(Sale).toFixed(2))) : "0.00",
            (element.Sequence === 5) ? (numberWithCommas(Number(PurchaseReturn).toFixed(2))) : "0.00",
            (element.Sequence === 6) ? (numberWithCommas(Number(StockAdjustment).toFixed(2))) : "0.00",

            element.TransactionNumber === "STOCK" ? numberWithCommas(Number(RowStock).toFixed(2)) : numberWithCommas(Number(BalanceAmount).toFixed(2))
        ];

        function totalLots() {

            TotalGRN = Number(TotalGRN) + Number(RowGRN)
            TotalSalesReturn = Number(TotalSalesReturn) + Number(RowSalesReturn)
            TotalSale = Number(TotalSale) + Number(RowSale)
            TotalStock = Number(TotalStock) + Number(RowStock)
            TotalPurchaseReturn = Number(TotalPurchaseReturn) + Number(RowPurchaseReturn)
            TotalBalance = Number(TotalBalance) + Number(BalanceAmount)
            TotalStockAdjustment = Number(TotalStockAdjustment) + Number(RowStockAdjustment)

        };

        if (key === data.length - 3) {
            data["Close"] = BalanceAmount
        }

        function totalrow() {
            return [
                "Total",
                "",
                "",
                "",
                `${numberWithCommas(Number(TotalGRN).toFixed(2))}`,

                `${numberWithCommas(Number(TotalSalesReturn).toFixed(2))}`,
                `${numberWithCommas(Number(TotalStock).toFixed(2))}`,
                `${numberWithCommas(Number(TotalSale).toFixed(2))}`,
                `${numberWithCommas(Number(TotalPurchaseReturn).toFixed(2))}`,
                `${numberWithCommas(Number(TotalStockAdjustment).toFixed(2))}`,
                ``,

            ];
        };

        function totalopen() {
            return [
                `Opening Balance: ${data[data.length - 1].OpeningBalance}`,
                "",
                "Total",
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,

            ];
        };

        function totalclose() {
            return [
                `Closing Balance: ${data[data.length - 1].ClosingBalance}`,
                "",
                "Total",
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,

            ];
        };


        // if (Gst === 0) { Gst = element.GSTPercentage };
        // let aa = { TotalCGst: 0, totalSGst: 0 }
        // if (data["tableTot"] === undefined) { data["tableTot"] = aa }

        // else {
        //     // returnArr.push(totalrow());
        if (key === 0) {
            returnArr.push(totalopen());
        }
        if (key !== data.length - 1) {
            returnArr.push(tableitemRow);
            totalLots()
        }

        if (key === data.length - 2) {
            returnArr.push(totalclose())

        }

        // }
        if (key === data.length - 2) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}

export const Rows_for_ChitaleSweetsAndSnacks = (data) => {

    const openingBalance = Number(data[data.length - 1].OpeningBalance);


    // InvoiceItems.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let SN = 1
    let TotalGRN = 0
    let TotalSalesReturn = 0
    let TotalStock = 0
    let TotalPurchaseReturn = 0
    let TotalSale = 0
    let TotalBalance = 0
    let TotalStockAdjustment = 0
    let TotalProduction = 0
    let TotalIBSale = 0
    let TotalIBPurchase = 0
    let TotalMaterialIssue = 0





    let Unit = data.Period.Unit.label
    let GRN = 0
    let SalesReturn = 0
    let Stock = 0
    let Sale = 0
    let PurchaseReturn = 0
    let StockAdjustment = 0
    let Production = 0
    let IBSale = 0
    let IBPurchase = 0
    let materialIssue = 0



    let BalanceAmount = Number(openingBalance)

    data.forEach((element, key) => {

        let RowGRN = 0
        let RowSalesReturn = 0
        let RowStock = 0
        let RowSale = 0
        let RowPurchaseReturn = 0
        let RowStockAdjustment = 0
        let RowProduction = 0
        let RowIBSale = 0
        let RowIBPurchase = 0
        let RowMaterialIssue = 0


        if (Unit === "No") {
            GRN = Number(element.QtyInNo)
            SalesReturn = Number(element.QtyInNo)
            Stock = Number(element.QtyInNo)
            Sale = Number(element.QtyInNo)
            PurchaseReturn = Number(element.QtyInNo)
            StockAdjustment = Number(element.QtyInNo)
            Production = Number(element.QtyInNo)
            IBSale = Number(element.QtyInNo)
            IBPurchase = Number(element.QtyInNo)
            materialIssue = Number(element.QtyInNo)


        }

        if (Unit === "Kg") {
            GRN = Number(element.QtyInKg)
            SalesReturn = Number(element.QtyInKg)
            Stock = Number(element.QtyInKg)
            Sale = Number(element.QtyInKg)
            PurchaseReturn = Number(element.QtyInKg)
            StockAdjustment = Number(element.QtyInKg)
            Production = Number(element.QtyInKg)
            IBSale = Number(element.QtyInKg)
            IBPurchase = Number(element.QtyInKg)
            materialIssue = Number(element.QtyInKg)

        }
        if (Unit === "Box") {
            GRN = Number(element.QtyInBox)
            SalesReturn = Number(element.QtyInBox)
            Stock = Number(element.QtyInBox)
            Sale = Number(element.QtyInBox)
            PurchaseReturn = Number(element.QtyInBox)
            StockAdjustment = Number(element.QtyInBox)
            Production = Number(element.QtyInBox)
            IBSale = Number(element.QtyInBox)
            IBPurchase = Number(element.QtyInBox)
            materialIssue = Number(element.QtyInBox)
        }

        if (element.Sequence === 1) {
            RowGRN = GRN
        } if (element.Sequence === 2) {
            RowSalesReturn = SalesReturn
        } if (element.Sequence === 3) {
            RowStock = Stock
        } if (element.Sequence === 4) {
            RowSale = Sale
        } if (element.Sequence === 5) {
            RowPurchaseReturn = PurchaseReturn
        } if (element.Sequence === 6) {
            RowStockAdjustment = StockAdjustment
        } if (element.Sequence === 7) {
            RowProduction = Production
        } if (element.Sequence === 8) {
            RowIBSale = IBSale
        } if (element.Sequence === 9) {
            RowIBPurchase = IBPurchase
        } if (element.Sequence === 10) {
            RowMaterialIssue = materialIssue
        }

        const rowGRN = Number(RowGRN);
        const rowSalesReturn = Number(RowSalesReturn);
        const rowSale = Number(RowSale);
        const rowPurchaseReturn = Number(RowPurchaseReturn);
        const rowStockAdjustment = Number(RowStockAdjustment);
        const rowProduction = Number(RowProduction);
        const rowIBSale = Number(RowIBSale);
        const rowIBPurchase = Number(RowIBPurchase);
        const rowMaterialIssue = Number(RowMaterialIssue);

        if (element.TransactionNumber === "STOCK") {
            BalanceAmount = RowStock
        }
        BalanceAmount = (BalanceAmount + rowGRN + rowSalesReturn + rowStockAdjustment + rowIBPurchase + rowProduction) - (rowSale + rowPurchaseReturn + rowIBSale + rowMaterialIssue);
        const tableitemRow = [
            SN++,
            `${date_dmy_func(element.TransactionDate)} ${convertOnlyTimefunc(element.CreatedOn)}`,
            element.Name,
            element.TransactionNumber,
            (element.Sequence === 1) ? (numberWithCommas(Number(GRN).toFixed(3))) : "0.00",
            (element.Sequence === 9) ? (numberWithCommas(Number(IBPurchase).toFixed(3))) : "0.00",
            (element.Sequence === 10) ? (numberWithCommas(Number(materialIssue).toFixed(3))) : "0.00",
            (element.Sequence === 7) ? (numberWithCommas(Number(Production).toFixed(3))) : "0.00",
            (element.Sequence === 8) ? (numberWithCommas(Number(IBSale).toFixed(3))) : "0.00",
            (element.Sequence === 2) ? (numberWithCommas(Number(SalesReturn).toFixed(3))) : "0.00",
            (element.Sequence === 3) ? (numberWithCommas(Number(Stock).toFixed(3))) : "0.00",
            (element.Sequence === 4) ? (numberWithCommas(Number(Sale).toFixed(3))) : "0.00",
            (element.Sequence === 5) ? (numberWithCommas(Number(PurchaseReturn).toFixed(3))) : "0.00",
            (element.Sequence === 6) ? (numberWithCommas(Number(StockAdjustment).toFixed(3))) : "0.00",
            element.TransactionNumber === "STOCK" ? numberWithCommas(Number(RowStock).toFixed(3)) : numberWithCommas(Number(BalanceAmount).toFixed(3))
        ];

        function totalLots() {
            debugger
            TotalGRN = Number(TotalGRN) + Number(RowGRN)
            TotalSalesReturn = Number(TotalSalesReturn) + Number(RowSalesReturn)
            TotalSale = Number(TotalSale) + Number(RowSale)
            TotalStock = Number(TotalStock) + Number(RowStock)
            TotalPurchaseReturn = Number(TotalPurchaseReturn) + Number(RowPurchaseReturn)
            TotalBalance = Number(TotalBalance) + Number(BalanceAmount)
            TotalStockAdjustment = Number(TotalStockAdjustment) + Number(RowStockAdjustment)
            TotalProduction = Number(TotalProduction) + Number(RowProduction)
            TotalIBSale = Number(TotalIBSale) + Number(RowIBSale)
            TotalIBPurchase = Number(TotalIBPurchase) + Number(RowIBPurchase)
            TotalMaterialIssue = Number(TotalMaterialIssue) + Number(RowMaterialIssue)



        };

        if (key === data.length - 3) {
            data["Close"] = BalanceAmount
        }

        function totalrow() {
            return [
                "Total",
                "",
                "",
                "",
                `${numberWithCommas(getFixedNumber(TotalGRN, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalIBPurchase, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalMaterialIssue, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalProduction, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalIBSale, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalSalesReturn, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalStock, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalSale, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalPurchaseReturn, 3).toFixed(3))}`,
                `${numberWithCommas(getFixedNumber(TotalStockAdjustment, 3).toFixed(3))}`,
                ``,

            ];
        };

        function totalopen() {
            return [
                `Opening Balance: ${data[data.length - 1].OpeningBalance}`,
                "",
                "Total",
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,

            ];
        };

        function totalclose() {
            return [
                `Closing Balance: ${data[data.length - 1].ClosingBalance}`,
                "",
                "Total",
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,
                ``,

            ];
        };

        if (key === 0) {
            returnArr.push(totalopen());
        }
        if (key !== data.length - 1) {
            returnArr.push(tableitemRow);
            totalLots()
        }

        if (key === data.length - 2) {
            returnArr.push(totalclose())

        }

        if (key === data.length - 2) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const ReportHederRows = (data) => {

    const UserDetails = loginUserDetails()
    var reportArray = [
        [`                   ${UserDetails.PartyName}`, `              : ${data.Period.ItemName}`,],
        [`                       ${date_dmy_func(data.Period.FromDate)}`, `                    ${date_dmy_func(data.Period.ToDate)}`,],
        // [`                  `, ,],
    ]
    return reportArray;
}