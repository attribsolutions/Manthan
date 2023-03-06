
export const columns = [
    "SR No.",
    "ItemName",
    "BatchNo",
    "MRP",
    "Box",
    "Outer ",
    "Pcs",
    "quantity",
    "UnitName",
];

export const columns1 = [
    "SR No.",
    "Invoice Date",
    "Invoice Number",
    "Party Name",
    "Amount",
    "Cash ",
    "Cheque",
    "Credit",
    "Online RTGS/M Wallet",
];




export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    const { InvoiceItemNames = [] } = data
    InvoiceItemNames.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalMRP = 0
    let TotalBox = 0
    let TotalPcs = 0
    let TotalQuantity = 0

    InvoiceItemNames.forEach((element, key) => {
        const tableitemRow = [
            element.srNO,
            element.ItemName,
            element.BatchNo,
            element.MRP,
            element.Box,
            element.Outer,
            element.Pcs,
            element.Quantity,
            element.UnitName,
        ];

        function totalLots() {
            TotalMRP = Number(TotalMRP) + Number(element.MRP)
            TotalBox = Number(TotalBox) + Number(element.Box)
            TotalPcs = Number(TotalPcs) + Number( element.Pcs)
            TotalQuantity = Number(TotalQuantity) + Number(element.Quantity)
        };

        function totalrow() {
            return [
                " ",
                "Total",
                "",
                `${parseFloat(TotalMRP).toFixed(2)}`,
                `${parseFloat(TotalBox).toFixed(2)}`,
                "",
                `${parseFloat(TotalPcs).toFixed(2)}`,
                `${parseFloat(TotalQuantity).toFixed(2)}`,
                
               
            ];
        };


        if (Gst === 0) { Gst = element.GSTPercentage };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }
     
        else {
            // returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            data["tableTot"] = totalLots()
        }
        if (key === InvoiceItemNames.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}

export const Rows1 = (data) => {
    const { InvoiceItemNames = [] } = data
    InvoiceItemNames.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);
    const returnArr = [];
    let Gst = 0
    let TotalAmount = 0
   

    InvoiceItemNames.forEach((element, key) => {
        const tableitemRow = [
            element.srNO,
            element.InvoiceDate,
            element.InvoiceNumber,
            element.PartyName,
            element.Amount,
            element.Cash,
            element.Cheque,
            element.Credit,
            element.OnlineRTGS,
        ];

        function totalLots() {
            TotalAmount = Number(TotalAmount) + Number(element.Amount)
           
        };

        function totalrow() {
            return [
                " ",
                "Total",
                "",
                ``,
                `${parseFloat(TotalAmount).toFixed(2)}`,
                "",
                ``,
                ``,
                
               
            ];
        };


        if (Gst === 0) { Gst = element.GSTPercentage };
        let aa = { TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }
     
        else {
            // returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            data["tableTot"] = totalLots()
        }
        if (key === InvoiceItemNames.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}


export const ReportHederRows = (data) => {
    var reportArray = [
        [ "Address:",`${data.Address}`,],
        [ "Routes:",`${data.Routes}`],
        // [`FSSAI :f23dfxxxxxwe55`, ,`To Date:      ${data.Todate}`  ],
        // [,,`INR NO :${data.FullInvoiceNumber}`]
    ]
    return reportArray;
}