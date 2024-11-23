import { convertTimefunc, date_dmy_func, DateTime, groupBy } from "../../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../../../Reports/Report_common_function";
import { convertTo12Hour } from "../../../Dashboard/FrenchiesesDashboard/Function";

// original
export const Item = [
    "HSN\nRate",
    "Item\nGST%/Dist./Dist.Amt",
    "Qty\nAmount",
];

export const GSTDetails = [
    "Total CGST",
    "Total SGST",
    "Total GGST",
];




export const Details = [
    "Details",
]

export const Discription = [
    "Discription",
]


export const ItemRow = (data) => {

    const { OrderItem = [] } = data
    let hasHedRow = []
    OrderItem.forEach(element => {
        const tableitemRow = [
            `${element.HSNCode}\n${element.MRPValue}`,
            `${element.ItemName}\n${element.GSTPercentage}/${element.Discount}/${element.DiscountAmount}`,
            `${element.Quantity}\n${element.Amount}`,

        ];
        hasHedRow.push(tableitemRow);
    })

    return hasHedRow
}


export const GSTDetailsRow = (data, doc) => {

    const { OrderItem = [] } = data

    let totalCGST = 0
    let totalSGST = 0
    OrderItem.forEach(arg => {
        totalCGST += Number(arg.CGST);
        totalSGST += Number(arg.SGST);
    });
    const Total_GST = Number(totalCGST) + Number(totalSGST)

    const tableitemRow = [[
        `${Number(totalCGST).toFixed(2)}`,
        `${Number(totalSGST).toFixed(2)}`,
        `${Number(Total_GST).toFixed(2)}`,
    ]
    ];

    return tableitemRow
}

export const DetailsRow = (data) => {
    
    var DetailsArray = [
        // [`${data.CompanyName}`],
        [`${data.SupplierName}`],
        [`------------Sales Order---------`],
        [`${data.SupplierAddress}`],
        [`GSTIN:${data.SupplierGSTIN}`],
        [`Customer:${data.CustomerName}   GSTIN:${data.CustomerGSTIN}`],
        [`Order Date:${DateTime(data?.CreatedOn)}`],
        [`Delivery Date:${date_dmy_func(data.OrderDate)}     Bill No:${data.FullOrderNumber}`],

    ]
    if (data.CustomerGSTIN === "") {
        DetailsArray.splice(5, 1);
    }
    return DetailsArray;
}


export const DiscriptionRow = (data) => {
    var discriptionArray = [
        [`We hereby certify that food/foods mentioned in this invoice is/are warranted to be the nature & quality when it/this purport to be at the time of delivery. Kindly consume sweets immediately. Goods once sold will not be taken back`],
        [`FSSAI:${data.SupplierGSTIN}`]
    ]
    return discriptionArray;
}
















