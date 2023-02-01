
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
    "Unit",
    "comment",
    "Total Amt"];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const Rows = (data) => {
    const { OrderItem = [] } = data
    const returnArr = [];
    let Gst = 0
    let totalBasicAmount = 0
    let totalCGst = 0
    let totalSGst = 0
    let totalAmount = 0
    let totalQuantity = 0
    let SubTotalGst =0
    

    OrderItem.forEach((element, key) => {
        const tableitemRow = [
            `${element.ItemName} (${element.HSNCode})`,
            `${element.Quantity} ${element.UnitName}`,
            element.Rate,
            element.BasicAmount,
            element.CGSTPercentage,
            element.CGST,
            element.SGSTPercentage,
            element.SGST,
            element.Unit,
            element.Comment,
            element.Amount,
            

        ];

        function totalLots() {
            totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            totalCGst = Number(totalCGst) + Number(element.CGST)
            totalSGst = Number(totalSGst) + Number(element.SGST)
            totalAmount = Number(totalAmount) + Number( element.Amount)
            // totalQuantity = Number(totalQuantity) + Number(element.Quantity)
            let cgst = data["tableTot"].TotalCGst
            // return ({ TotalCGst: Number(cgst) + Number(totalCGst),})
            return ({ TotalCGst: parseInt(totalCGst) + parseInt(cgst),}) 
        };



        function totalrow() {
            return [
                `Total Quantity:${parseFloat(totalQuantity).toFixed(2)}`,
                " ",
                `BasicAmount:${parseFloat(totalBasicAmount).toFixed(2)}`,
                "",
                `TotalCGST:${parseFloat(totalCGst).toFixed(2)}`,
                "isaddition",
                `TotalSGST:${parseFloat(totalSGst).toFixed(2)}`,
                "",
                "",
                "",
                `Amount:${parseFloat(totalAmount).toFixed(2)}`,
                // parseFloat(TotalCGst).toFixed(2),
                // parseFloat(TotalSGst).toFixed(2),
            ];
        };


        if (Gst === "") { Gst = element.GSTPercentage };
        let aa = {TotalCGst: 0, totalSGst: 0 }
        if (data["tableTot"] === undefined) { data["tableTot"] = aa }
        if ((Gst === element.GSTPercentage)) {
            data["tableTot"] = totalLots()
            returnArr.push(tableitemRow);
        }
        else {
            // returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            totalBasicAmount = 0
            totalCGst = 0
            totalSGst = 0
            totalAmount = 0
            totalQuantity = 0

            data["tableTot"] = totalLots()
            Gst = element.GSTPercentage;
        }
        if (key === OrderItem.length - 1) {
            returnArr.push(totalrow());
        }

         SubTotalGst =  Number(SubTotalGst)+Number(element.CGST)
         
 
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

export const ReportFooterRow2 = (element) => {
    var th = ['', 'thousand', 'million', 'billion', 'trillion'];
    var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    function toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return 'not a number';
        var x = s.indexOf('.');
        if (x == -1)
            x = s.length;
        if (x > 15)
            return 'too big';
        var n = s.split('');
        var str = '';
        var sk = 0;
        for (var i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                } else if (n[i] != 0) {
                    str += tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            } else if (n[i] != 0) { // 0235
                str += dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) str += 'hundred ';
                sk = 1;
            }
            if ((x - i) % 3 == 1) {
                if (sk)
                    str += th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }
        if (x != s.length) {
            var y = s.length;
            str += 'point ';
            for (var i = x + 1; i < y; i++)
                str += dg[n[i]] + ' ';
        }
        return str.replace(/\s+/g, ' ');
    }
    let stringNumber = toWords(67674168.45)
    var TableArray = [[`${stringNumber}`
    ],
    ['I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be of the nature and quantity whitch it/these purports to be '
    ],
    ['Bank details ·sdSVvDsdgbvzdfbBzdf'
    ],
    ['A/C No: 2715500356 IFSC Code:BKID00015422',
    ],
    ]
    return TableArray
}
export const ReportFotterColumns4 = [
    "SGST", "a "
];
export const ReportFooterRow4 = (element) => {

    var TableArray = [[`Total.Amt:`, "67674168.45"
    ],
    ['Total GST: ', '124855.25'
    ],
    ['Total CTCS:', '45742.635'
    ],
    ['Round Off:', '46464.253',
    ],
    [`Amount:`, `7654214463.53`]
    ]
    return TableArray
}
export const columns1 = ["Total", "abc", "ayk", "Amount "];
export const Rows1 = (data) => {
    var a1 = [];
    var c = 0;
    data.InvoiceItems.forEach(element => {
        if (c < 2) {
            c = c + 1;
            const ticketData = [
                element.InvoiceID,
                element.Quantity,
                element.Rate,
                element.BasicAmount,
                element.DiscountAmount,
                element.Amount,
                element.CGST,
                element.Value,
            ];
            a1.push(ticketData);
        }
    });
    return a1;
}
export const ReportHederRows = (data) => {
    var reportArray = [
        [`${data.CustomerName}`, `${data.SupplierName}`,`  `],
        [`${data.BillingAddress}`, `${data.ShippingAddress}` , ` `,],
        [`FSSAI :f23dfxxxxxwe55`, `FSSAI :ui3dfxxxxxwe55`, ` `],
        // [, , ""],
        [,`` , ],
    ]
    return reportArray;
}






