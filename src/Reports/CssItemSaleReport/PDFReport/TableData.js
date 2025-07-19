
import { numberWithCommas } from "../../Report_common_function";

export const columns = [
    "Item Name",
    "Quantity",
    "UOM",
    "Net Amount",
    "GST Rate",
    "CGST Amount",
    "SGST Amount",
    "IGST Amount",
    "Gross Total",
    "AVG Rate",
];

export const GST_Persentage_Table = [
    "GST Persentage",
    "Total Quantity",
    "Value",
    "CGST Amount",
    "SGST Amount",
    "IGST Amount",
    "Total",
];

export const PageHedercolumns = [
    "",
]

export const Rows = (data) => {
    const returnArr = [];
    let TotalBasicAmount = 0;
    let TotalQuantity = 0;
    let TotalCGST = 0;
    let TotalSGST = 0;
    let TotalIGST = 0;
    let TotalGrandTotal = 0;



    data.forEach((element, key) => {
        const tableitemRow = [
            `${element.ItemName}`,
            isNaN(element.Quantity) ? "0" : `${element.Quantity}`,
            `${element.UnitName}`,
            isNaN(element.BasicAmount) ? "0" : `${element.BasicAmount}`,
            isNaN(element.GSTRate) ? "0" : `${element.GSTRate}`,
            isNaN(element.CGST) ? "0" : `${element.CGST}`,
            isNaN(element.SGST) ? "0" : `${element.SGST}`,
            isNaN(element.IGST) ? "0" : `${element.IGST}`,
            isNaN(element.GrandTotal) ? "0" : `${element.GrandTotal}`,
            isNaN(element.AvgRate) ? "0" : `${element.AvgRate}`,
        ];


        TotalBasicAmount = Number(TotalBasicAmount) + Number(element.BasicAmount)
        TotalQuantity = Number(TotalQuantity) + Number(element.Quantity)
        TotalCGST = Number(TotalCGST) + Number(element.CGST)
        TotalSGST = Number(TotalSGST) + Number(element.SGST)
        TotalIGST = Number(TotalIGST) + Number(element.IGST)
        TotalGrandTotal = Number(TotalGrandTotal) + Number(element.GrandTotal)




        function totalrow() {
            const safeFormat = (value) =>
                isNaN(value) ? "0.00" : Number(value).toFixed(2);

            return [
                "Total",
                numberWithCommas(safeFormat(TotalQuantity)),
                "",
                numberWithCommas(safeFormat(TotalBasicAmount)),
                "",
                numberWithCommas(safeFormat(TotalCGST)),
                numberWithCommas(safeFormat(TotalSGST)),
                numberWithCommas(safeFormat(TotalIGST)),
                numberWithCommas(safeFormat(TotalGrandTotal)),
                "",
            ];
        };
        returnArr.push(tableitemRow);
        if (key === data.length - 1) {
            returnArr.push(totalrow());
        }
    })
    return returnArr;
}

export const GST_Rows = (data) => {



    const returnArr = [];
    let TotalBasicAmount = 0;
    let TotalQuantity = 0;
    let TotalCGST = 0;
    let TotalSGST = 0;
    let TotalIGST = 0;
    let TotalGrandTotal = 0;

    const gstWiseTotals = {};

    data.forEach((element, key) => {
        const gst = isNaN(element.GSTPercentage) ? 0 : Number(element.GSTPercentage);


        // Update grand totals
        TotalBasicAmount += Number(element.BasicAmount) || 0;
        TotalQuantity += Number(element.Quantity) || 0;
        TotalCGST += Number(element.CGST) || 0;
        TotalSGST += Number(element.SGST) || 0;
        TotalIGST += Number(element.IGST) || 0;
        TotalGrandTotal += Number(element.GrandTotal) || 0;

        // Group by GSTPersentage
        if (!gstWiseTotals[gst]) {
            gstWiseTotals[gst] = {
                Quantity: 0,
                BasicAmount: 0,
                CGST: 0,
                SGST: 0,
                IGST: 0,
                GrandTotal: 0,
            };
        }
        gstWiseTotals[gst].Quantity += Number(element.Quantity) || 0;
        gstWiseTotals[gst].BasicAmount += Number(element.BasicAmount) || 0;
        gstWiseTotals[gst].CGST += Number(element.CGST) || 0;
        gstWiseTotals[gst].SGST += Number(element.SGST) || 0;
        gstWiseTotals[gst].IGST += Number(element.IGST) || 0;
        gstWiseTotals[gst].GrandTotal += Number(element.GrandTotal) || 0;

        // Add final total row
        if (key === data.length - 1) {

            const safeFormat = (value) =>
                isNaN(value) ? "0.00" : Number(value).toFixed(2);
            const numberWithCommas = (x) =>
                x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


            // Add GST-wise total rows
            Object.entries(gstWiseTotals).forEach(([gstPercent, values]) => {
                returnArr.push([
                    `GST ${gstPercent}%`,
                    numberWithCommas(safeFormat(values.Quantity)),
                    numberWithCommas(safeFormat(values.BasicAmount)),
                    numberWithCommas(safeFormat(values.CGST)),
                    numberWithCommas(safeFormat(values.SGST)),
                    numberWithCommas(safeFormat(values.IGST)),
                    numberWithCommas(safeFormat(values.GrandTotal)),
                ]);
            });
            returnArr.push([
                "Total",
                numberWithCommas(safeFormat(TotalQuantity)),
                numberWithCommas(safeFormat(TotalBasicAmount)),
                numberWithCommas(safeFormat(TotalCGST)),
                numberWithCommas(safeFormat(TotalSGST)),
                numberWithCommas(safeFormat(TotalIGST)),
                numberWithCommas(safeFormat(TotalGrandTotal)),

            ]);

        }
    });

    return returnArr;
};


export const ReportHederRows = (data) => {
    debugger
    const Division = data.SelectDivision.map((item, index) => `${index + 1}) ${item.label}`).join(", ")


    var reportArray = [
        [`                   ${Division}`],
        [`                   ${data.Date}`]
    ]


    return reportArray;
}

