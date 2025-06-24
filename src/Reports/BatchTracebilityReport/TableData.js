import { numberWithCommas } from "../Report_common_function";

export const columns_1 = [
    "Batch Card ID",
    "Batch Card No",
    "Work Order Date",
    "Login Name",
    "Quantity",
    "Number Of Lot",
    "Status"
];

export const columns_2 = [
    "Item ID",
    "ItemName",
    "BOMQuantity",
    "UnitName"
];

export const columns_3 = [
    "Item ID",
    "Item Name",
    "Quantity",
    "UnitName",
    "Grn ID",
    "GRN No",
    "Production ID",
    "Production No",
    "Batch Code"
];


export const columns_4 = [
    "Item ID",
    "Item Name",
    "Batch Card No",
    "Number Of Lot",
    "Lot Qty",
    "Production Date",
    "Printed Batch Code",
    "Best Before",
    "Batch Code",
];


export const columns_5 = [
    "Invoice ID",
    "Invoice No",
    "Invoice Date",
    "Customer Name",
    "Quantity",
    "Batch Code"
];



export const Rows_1 = (table = []) => {
    const returnArr = [];
    table.forEach((index, key) => {
        const tableitemRow = [
            `${index.BacthCardID}`,
            `${index.BatchCardNo}`,
            `${index.WorkOrderDate}`,
            `${index.LoginName}`,
            `${numberWithCommas(Number(index.Quantity).toFixed(2))}`,
            `${numberWithCommas(Number(index.NumberOfLot).toFixed(2))}`,
            `${index.Status}`,

        ];
        returnArr.push(tableitemRow);
    })
    return returnArr;
}

export const Rows_2 = (table = []) => {
    const returnArr = [];
    table.forEach((index, key) => {
        const tableitemRow = [
            `${index.ItemID}`,
            `${index.ItemName}`,
            `${numberWithCommas(Number(index.BOMQuantity).toFixed(2))}`,
            `${index.UnitName}`
        ];
        returnArr.push(tableitemRow);
    })
    return returnArr;
}

export const Rows_3 = (table = []) => {
    const returnArr = [];
    table.forEach((index, key) => {
        const tableitemRow = [
            `${index.Item_id}`,
            `${index.ItemName}`,
            `${numberWithCommas(Number(index.Quantity).toFixed(2))}`,
            `${index.UnitName}`,
            `${index.grnID}`,
            `${index.GRNNo}`,
            `${index.ProductionID}`,
            `${index.ProductionNo}`,
            `${index.BatchCode}`

        ];
        returnArr.push(tableitemRow);
    })
    return returnArr;
}

export const Rows_4 = (table = []) => {
    const returnArr = [];
    table.forEach((index, key) => {
        const tableitemRow = [
            `${index.ItemID}`,
            `${index.ItemName}`,
            `${index.BatchCardNo}`,
            `${numberWithCommas(Number(index.NumberOfLot).toFixed(2))}`,
            `${numberWithCommas(Number(index.LotQty).toFixed(2))}`,
            `${index.ProductionDate}`,
            `${index.PrintedBatchCode}`,
            `${index.BestBefore}`,
            `${index.BatchCode}`,    
        ];
        returnArr.push(tableitemRow);
    })
    return returnArr;
}

export const Rows_5 = (table = []) => {
    const returnArr = [];
    table.forEach((index, key) => {
        const tableitemRow = [
            `${index.InvoiceID}`,
            `${index.FullInvoiceNumber}`,
            `${index.InvoiceDate}`,
            `${index.CustomerName}`,
            `${numberWithCommas(Number(index.Quantity).toFixed(2))}`,
            `${index.BatchCode}`
        ];
        returnArr.push(tableitemRow);
    })
    return returnArr;
}





