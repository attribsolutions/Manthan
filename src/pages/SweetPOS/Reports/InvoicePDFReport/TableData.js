import { date_dmy_func, groupBy } from "../../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../../../Reports/Report_common_function";
import { convertTo12Hour } from "../../../Dashboard/FrenchiesesDashboard/Function";

// original
export const Item = [
    "HSN\nRate",
    "Item\nGST%",
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

    let hasHedRow = []
    // InvoiceItems.forEach(element => {
    //     const tableitemRow = [
    //         `${element.HSNCode}\n${element.MRPValue}`,
    //         `${element.ItemName}\n${element.GSTPercentage}/${element.Discount}/${element.DiscountAmount}`,
    //         `${element.Quantity}\n${element.Amount}`,

    //     ];
    //     hasHedRow.push(tableitemRow);
    // })



    data.forEach(element => {

        const nestedArray = element?.MixItems?.map((element_2) => {
            const array = [
                [`\n${element_2.HSNCode}\n${element_2.MRPValue}\n`] // Add a nested field (e.g., Batch Number)
            ];
            return array
        }) || []

        const nestedArray_1 = element?.MixItems?.map((element_2) => {

            const array = [
                [`\n${element_2.ItemName}\n${element_2.GSTPercentage}${Number(element_2.Discount) > 0 ? `/${element_2.Discount}/${element_2.DiscountAmount}\n` : '\n'} `]

            ];
            return array
        }) || []

        const nestedArray_2 = element?.MixItems?.map((element_2) => {
            const array = [
                [`\n${element_2.Quantity}\n${element_2.Amount}\n`]
            ];
            return array
        }) || []




        const tableitemRow = [
            `${element.HSNCode}\n${element.MRPValue}\n${nestedArray.length > 0 ? nestedArray : ""}`,
            `${element.ItemName}\n${element.GSTPercentage}${Number(element.Discount) > 0 ? `/${element.Discount}/${element.DiscountAmount}` : ''}\n${nestedArray_1.length > 0 ? nestedArray_1 : ""}`,
            `${element.Quantity}\n${element.Amount}\n${nestedArray_2.length > 0 ? nestedArray_2 : ""}`,
        ];

        hasHedRow.push(tableitemRow.map(str => str.replace(/,/g, "")));

    });

    return hasHedRow
}


export const GSTDetailsRow = (data, doc) => {

    const { InvoiceItems = [] } = data

    let totalCGST = 0
    let totalSGST = 0
    InvoiceItems.forEach(arg => {
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
        [`${data.PartyName}`],
        [`------------Tax Invoice---------`],
        [`${data.PartyAddress} Ph.${data.AlternateContactNo}`],
        [`GSTIN:${data.PartyGSTIN}`],
        [`Customer:${data.CustomerName}   GSTIN:${data.CustomerGSTIN}`],
        [`Customer Ph.${data.CustomerMobileNo}`],
        [`Date:${date_dmy_func(data.InvoiceDate)}   ${data?.CreatedOn?.slice(11)}              Bill No:${data.FullInvoiceNumber}`],
    ]
    if (data.CustomerGSTIN === "") {
        DetailsArray.splice(5, 1);
    }
    return DetailsArray;
}


export const DiscriptionRow = (data) => {
    var discriptionArray = [
        [`We hereby certify that food/foods mentioned in this invoice is/are warranted to be the nature & quality when it/this purport to be at the time of delivery. Kindly consume sweets immediately. Goods once sold will not be taken back`],
        [`FSSAI:${data.PartyFSSAINo}`]
    ]
    return discriptionArray;
}
















