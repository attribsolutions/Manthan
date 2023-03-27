
// original
export const columns = [
    "HSNCode Item Name",
    "Quantity",
    "Rate",
    "BasicAmt ",
    "CGST%",
    "CGSTAmt ",
    "SGST%",
    "SGSTAmt",
    // "comment",
    "Total Amt"];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]
export const Footercolumn = [
    "",
]


// export const Rows = (data) => {
//     const { OrderItem = [] } = data
//     var a = [];
//     let Gst = 0
//     let totalBasicAmount = 0
//     let totalCGst = 0
//     let totalSGst = 0
//     let totalAmount = 0
//     let totalQuantity = 0
//     let SubTotalGst = 0


//     OrderItem.forEach(element => {
//         
//         if (Gst === 0) { Gst = element.GSTPercentage };
//         if ((Gst === element.GSTPercentage)) {
//             totalQuantity = Number(totalQuantity) + Number(element.Quantity)
//             totalCGst = Number(totalCGst) + Number(element.CGST)
//             totalSGst = Number(totalSGst) + Number(element.SGST)
//             totalAmount = Number(totalAmount) + Number(element.Amount)

//             const tableitemRow = [
//                 `${element.ItemName} (${element.HSNCode})`,
//                 `${element.Quantity} ${element.UnitName}`,
//                 element.Rate,
//                 element.BasicAmount,
//                 `${element.CGSTPercentage}%`,
//                 element.CGST,
//                 `${element.SGSTPercentage}%`,
//                 element.SGST,
//                 element.Comment,
//                 element.Amount,
//             ];
//             a.push(tableitemRow);
//             Gst = element.GSTPercentage
//         } else {

//             const tableTotalRow = [
//                 `Total Quantity:${parseFloat(totalQuantity).toFixed(2)}`,
//                 " ",
//                 `BasicAmount:${parseFloat(totalBasicAmount).toFixed(2)}`,
//                 "",
//                 `TotalCGST:${parseFloat(totalCGst).toFixed(2)}`,
//                 "isaddition",
//                 `TotalSGST:${parseFloat(totalSGst).toFixed(2)}`,
//                 "",
//                 "",
//                 `Amount:${parseFloat(totalAmount).toFixed(2)}`,

//             ];
//             a.push(tableTotalRow);

//             Gst = 0
//             totalBasicAmount = 0
//             totalCGst = 0
//             totalSGst = 0
//             totalAmount = 0
//             totalQuantity = 0

//             totalQuantity = Number(totalQuantity) + Number(element.Quantity)
//             totalCGst = Number(totalCGst) + Number(element.CGST)
//             totalSGst = Number(totalSGst) + Number(element.SGST)
//             totalAmount = Number(totalAmount) + Number(element.Amount)

//             const tableTotalRowNew = [
//                 `${element.ItemName} (${element.HSNCode})`,
//                 `${element.Quantity} ${element.UnitName}`,
//                 element.Rate,
//                 element.BasicAmount,
//                 `${element.CGSTPercentage}%`,
//                 element.CGST,
//                 `${element.SGSTPercentage}%`,
//                 element.SGST,
//                 element.Comment,
//                 element.Amount,
//             ];

//             a.push(tableTotalRowNew);

//             const tableTotalRowLast = [
//                 `Total Quantity:${parseFloat(totalQuantity).toFixed(2)}`,
//                 " ",
//                 `BasicAmount:${parseFloat(totalBasicAmount).toFixed(2)}`,
//                 "",
//                 `TotalCGST:${parseFloat(totalCGst).toFixed(2)}`,
//                 "isaddition",
//                 `TotalSGST:${parseFloat(totalSGst).toFixed(2)}`,
//                 "",
//                 "",
//                 `Amount:${parseFloat(totalAmount).toFixed(2)}`,

//             ];

//             a.push(tableTotalRowLast);

//             return a;
//         }
//     })
// }



export const Rows = (data) => {
    const { OrderItem = [] } = data
    OrderItem.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let totalBasicAmount = 0
    let totalCGst = 0
    let totalSGst = 0
    let totalAmount = 0
    let totalQuantity = 0
    let SubTotalGst = 0


    OrderItem.forEach((element, key) => {
        const tableitemRow = [
            `${element.ItemName} (${element.HSNCode})      
             ${element.Comment === null ? "" : element.Comment}`,
            `${element.Quantity} ${element.UnitName}`,
            element.Rate,
            element.BasicAmount,
            `${element.CGSTPercentage}%`,
            element.CGST,
            `${element.SGSTPercentage}%`,
            element.SGST,
            // element.Comment,
            element.Amount,
            "row"
        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalCGst = Number(totalCGst) + Number(element.CGST)
            totalSGst = Number(totalSGst) + Number(element.SGST)
            totalAmount = Number(totalAmount) + Number(element.Amount)
            totalBasicAmount = Number(totalBasicAmount) + Number(element.BasicAmount)
            let cgst = data["tableTot"].TotalCGst
            // return ({ TotalCGst: Number(cgst) + Number(totalCGst),})
            return ({ TotalCGst: parseInt(totalCGst) + parseInt(cgst), })
        };



        function totalrow() {
            return [
                `Total Quantity :${parseFloat(totalQuantity).toFixed(2)}`,
                " ",
                `TotalBasic:${parseFloat(totalBasicAmount).toFixed(2)}`,
                "",
                `Total:${parseFloat(totalCGst).toFixed(2)}`,
                "isaddition",
                `Total:${parseFloat(totalSGst).toFixed(2)}`,
                "",
                `Total:${parseFloat(totalAmount).toFixed(2)}`,
                // parseFloat(TotalCGst).toFixed(2),
                // parseFloat(TotalSGst).toFixed(2),
            ];
        };
        if (Gst === 0) { Gst = element.GSTPercentage };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }
        if ((Gst === element.GSTPercentage)) {
            data["tableTot"] = totalLots()
            returnArr.push(tableitemRow);
        }

        else {
            returnArr.push(totalrow())
            returnArr.push(tableitemRow);
            totalBasicAmount = 0
            totalCGst = 0
            totalSGst = 0
            totalAmount = 0
            totalQuantity = 0

            data["tableTot"] = totalLots()
        }
        if (key === OrderItem.length - 1) {
            returnArr.push(totalrow());
        }

        SubTotalGst = Number(SubTotalGst) + Number(element.CGST)
    })
    return returnArr;
}
export const ReportFotterColumns = [
    "SGST",
    "CGST", "Quantity",
    "GST % ",
    "TaxbleAmt.", "IGST", "Total Amt"
];

export const ReportFooterRow = (element) => {
    // data.InvoiceServiceItems.forEach(element => {
    var a = [[
        'first', '121457', '1245445', '83565', '2451422', '54646', '64641'
    ], [
        '1211', '121457', '1245445', '83565', '2451422', '54646', '64641'
    ], [
        '1211', '121457', '1245445', '83565', '2451422', '54646', '64641'
    ], [
        'last', '121457', '1245445', '83565', '2451422', '54646', '64641'
    ],
    ]
    return a
    // })
}
export const ReportFotterColumns2 = [
    "SGST",
];



export const ReportRows = (data, doc) => {
    debugger
    const terms = data.OrderTermsAndCondition
    const slicedArray = terms.slice(0, 2);
    var TableArray = [["Terms And Condition"],
        [`${slicedArray[0] === undefined ? "" : slicedArray[0].TermsAndCondition}`,
        ],
        [`${slicedArray[1] === undefined ? "" : slicedArray[1].TermsAndCondition}`,
        ],
        // [`${slicedArray[2] === undefined ? "" : slicedArray[2].TermsAndCondition}`
        // ],
        // [`${slicedArray[3] === undefined ? "" : slicedArray[3].TermsAndCondition}`
        // ],

    ]
    return TableArray
}
export const ReportHederRows = (data) => {

    var reportArray = [
        [`${data.SupplierName}`, `${data.CustomerName}`, `${data.POTypeName}`],
        [`${data.ShippingAddress}`, `${data.BillingAddress}`, `${data.CustomerName}`],
        [`FSSAI:${data.ShippingFssai}`, `FSSAI :ui3dfxxxxxwe55`, `${data.BillingAddress}`,],
    ]
    return reportArray;
}









