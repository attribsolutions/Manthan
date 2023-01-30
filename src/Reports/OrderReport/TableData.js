
export const columns = [
    "Sr.No",
    "Item Name",
    "Quantity",
    "Rate",
    "Order Amount"
];

export const PageHedercolumns = [
    "Billed by",
    "Billed to",
    ''
]

export const tableRows = (data) => {
    debugger
    const { OrderItem = [] } = data
    const datatable = [];
    
    OrderItem.forEach((element, k) => {

        let TableListData = [
            k,
           `(${element.HSNCode})${element.ItemName}`,
            element.Quantity,
            element.Rate,
            element.Amount,
        ];
        datatable.push(TableListData);

    });
    let tableTotalRowLast = [
        "",
        "",
        "",
        "Total Amount :",
        parseFloat(data.OrderAmount).toFixed(2),
    ];
    datatable.push(tableTotalRowLast);
    return datatable;
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
    ['Total GST: ','124855.25'
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
    data.InvoiceServiceItems.forEach(element => {
        debugger
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
        [`${data.BilByName}`, `${data.BilToName}`, `Invoice NO :${data.InvoiceID}`],
        [`${data.BilByAdr}`, `${data.BilToAdr}`, `${data.InvoiceDate}`,],
        [`${data.BilByState}`, `${data.BilToState}`, `E-way Bill :${data.EWaYBill}`],
        [`GSTIN :${data.BilByGSTIN}`, `GSTIN :${data.BilToGSTIN}`, "e-way-Bill : 36454454"],
        [`FSSAI :${data.BilByFSSAI}`, `FSSAI :${data.BilToFSSAI}`, ],
    ]
    return reportArray;
}