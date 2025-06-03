import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getFixedNumber } from '../../../../../components/Common/CommonFunction';
import { numberWithCommas } from '../../../../../Reports/Report_common_function';


// const SaleSummaryThermalPrintReport = (tableData) => {
//     debugger
//     const doc = new jsPDF({
//         unit: 'mm',              // Use mm for precision with thermal paper
//         format: [80, 297],       // 80mm width, 297mm height
//         orientation: 'portrait'
//     });

//     doc.setFont('Tahoma')
//     doc.setFontSize(18);

//     doc.text('Sale Summary Report', 40, 13, { align: 'center' });
//     doc.text(`${tableData.SupplierName}`, 40, 26, { align: 'center' });
//     doc.text(`${tableData.GSTIN}`, 40, 39, { align: 'center' });



//     // Table data
//     doc.autoTable({
//         startY: 49,
//         margin: { left: 5, right: 5 },
//         theme: 'grid',
//         head: [['Item', 'Qty', 'Rate', 'Amount']],
//         body: Rows_1(tableData),
//         headerStyles: {
//             cellPadding: 2,
//             lineWidth: 0.1,
//             valign: 'top',
//             fontStyle: 'bold',
//             halign: 'center',
//             fillColor: "white",
//             textColor: [0, 0, 0],
//             fontSize: 7,
//             rowHeight: 10,
//             lineColor: [6, 3, 1]
//         },
//         columnStyles: {
//             0: {
//                 valign: "top",
//                 columnWidth: 30,
//             },
//             1: {
//                 columnWidth: 12,
//                 halign: 'right',
//             },
//             2: {
//                 columnWidth: 12,
//                 halign: 'right',
//             },

//             3: {
//                 columnWidth: 15,
//                 halign: 'right',
//             },


//         },
//         bodyStyles: {
//             columnWidth: 'wrap',
//             textColor: [30, 30, 30],
//             cellPadding: 1,
//             fontSize: 7,
//             lineColor: [6, 3, 1]
//         },
//         didParseCell: (data1) => {
//             if (data1.row.cells[3].raw === "Span") {
//                 data1.row.cells[0].colSpan = 4;
//                 data1.row.cells[0].styles.halign = "left";
//                 data1.row.cells[0].styles.fontSize = 8;
//                 data1.row.cells[0].styles.fontStyle = "bold";
//             }

//         },

//         styles: { fontSize: 8, cellPadding: 2 },

//     });


//     const pdfBlob = doc.output('blob');
//     const pdfUrl = URL.createObjectURL(pdfBlob);
//     window.open(pdfUrl, '_blank');
// }


const SaleSummaryThermalPrintReport = (tableData) => {
    const rows = Rows_1(tableData);

    // Step 1: Render to a temporary (offscreen) doc to measure height
    const tempDoc = new jsPDF({
        unit: 'mm',
        format: [80, 1000], // Large enough to fit everything
        orientation: 'portrait'
    });

    tempDoc.setFontSize(18);
    tempDoc.text('Sale Summary Report', 40, 13, { align: 'center' });
    tempDoc.text(`${tableData.SupplierName}`, 40, 26, { align: 'center' });
    tempDoc.text(`${tableData.GSTIN}`, 40, 39, { align: 'center' });

    tempDoc.autoTable({
        startY: 49,
        margin: { left: 5, right: 5 },
        theme: 'grid',
        head: [['Item', 'Qty', 'Rate', 'Amount']],
        body: rows,
        styles: { fontSize: 8, cellPadding: 2 },
        bodyStyles: { fontSize: 7 },
        didParseCell: (data1) => {
            if (data1.row.cells[3].raw === "Span") {
                data1.row.cells[0].colSpan = 4;
                data1.row.cells[0].styles.halign = "left";
                data1.row.cells[0].styles.fontSize = 8;
                data1.row.cells[0].styles.fontStyle = "bold";
            }
        }
    });

    // Step 2: Get the final Y position to determine content height
    const finalY = tempDoc.autoTable.previous.finalY;
    const requiredHeight = finalY + 10; // Add padding

    // Step 3: Create actual doc with calculated height
    const doc = new jsPDF({
        unit: 'mm',
        format: [80, requiredHeight],
        orientation: 'portrait'
    });

    doc.setFont('Tahoma');
    doc.setFontSize(18);
    doc.text('Sale Summary Report', 40, 13, { align: 'center' });
    doc.text(`${tableData.SupplierName}`, 40, 26, { align: 'center' });
    doc.text(`${tableData.GSTIN}`, 40, 39, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`${tableData.Date}`, 40, 49, { align: 'center' });


    // Step 4: Render actual table
    doc.autoTable({
        startY: 59,
        margin: { left: 5, right: 5 },
        theme: 'grid',
        head: [['Item', 'Qty', 'Rate', 'Amount']],
        body: rows,
      
        columnStyles: {
            0: { columnWidth: 30 },
            1: { columnWidth: 12, halign: 'right' },
            2: { columnWidth: 12, halign: 'right' },
            3: { columnWidth: 15, halign: 'right' },
        },
        bodyStyles: {
            fontSize: 7,
            textColor: [30, 30, 30],
            cellPadding: 1,
            lineColor: [6, 3, 1]
        },
        showHead: 'firstPage',
        headerStyles: {
            cellPadding: 2,
            lineWidth: 0.1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 8,
            rowHeight: 10,
            lineColor: [6, 3, 1]
        },
        didParseCell: (data1) => {
            if (data1.row.cells[3].raw === "Span") {
                data1.row.cells[0].colSpan = 4;
                data1.row.cells[0].styles.halign = "left";
                data1.row.cells[0].styles.fontSize = 8;
                data1.row.cells[0].styles.fontStyle = "bold";
            }
        },
        styles: { fontSize: 8, cellPadding: 2 }
    });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
};









export const Rows_1 = (data) => {
    data.sort((firstItem, secondItem) => firstItem.GSTPercentage - secondItem.GSTPercentage);

    const returnArr = [];
    let Gst = 0
    let totalGst = 0
    let totalAmount = 0
    let totalQuantity = 0
    let GSTPercentage = 0
    let finalTotal = 0
    let finalTotalGST = 0
    let finalBasicAmount = 0
    let finalDiscountAmount = 0

    const groupedItems = data.reduce((accumulator, currentItem) => {
        const { ItemName, BaseItemUnitQuantity, Rate, GrandTotal, GSTPercentage, GSTAmount, BasicAmount, DiscountAmount, Amount, MRPValue } = currentItem;

        const key = ItemName + '_' + MRPValue;
        if (accumulator[key]) {
            accumulator[key].BaseItemUnitQuantity += getFixedNumber(BaseItemUnitQuantity, 3);
            accumulator[key].GrandTotal += getFixedNumber(GrandTotal, 3);
            accumulator[key].GSTAmount += getFixedNumber(GSTAmount, 3);
            accumulator[key].BasicAmount += getFixedNumber(BasicAmount, 3);
            accumulator[key].DiscountAmount += getFixedNumber(DiscountAmount, 3);
            accumulator[key].Amount += getFixedNumber(Amount, 3);

        } else {
            accumulator[key] = {
                Rate, ItemName, GrandTotal: getFixedNumber(GrandTotal, 3), MRPValue,
                BaseItemUnitQuantity: getFixedNumber(BaseItemUnitQuantity, 3), GSTPercentage: GSTPercentage, GSTAmount: getFixedNumber(GSTAmount, 3), BasicAmount: getFixedNumber(BasicAmount, 3), DiscountAmount: getFixedNumber(DiscountAmount, 3), Amount: getFixedNumber(Amount, 3)
            };
        }
        return accumulator;
    }, {});
    debugger
    const TotalItemlength = Object.values(groupedItems).length;
    data["TotalItemlength"] = TotalItemlength;

    Object.values(groupedItems).forEach((element, key) => {

        finalTotal += element.Amount;
        finalTotalGST += element.GSTAmount;
        finalBasicAmount += element.BasicAmount;
        finalDiscountAmount += element.DiscountAmount;

        const tableitemRow = [
            `${element.ItemName}`,
            `${(getFixedNumber(element.BaseItemUnitQuantity, 2)).toFixed(2)}`,
            `${(getFixedNumber(element.MRPValue, 2)).toFixed(2)}`,
            `${(getFixedNumber(element.Amount, 2)).toFixed(2)}`,
        ];
        // returnArr.push(tableitemRow);

        function totalrow() {
            return [
                `GST ${(parseFloat(GSTPercentage))}%\nTotal GST: ${numberWithCommas(Number(totalGst).toFixed(2))}\nTotal:${numberWithCommas(Number(totalAmount).toFixed(2))} `,
                ``,
                ``,
                `Span`,
            ];
        };

        function totalLots() {
            totalQuantity = getFixedNumber(totalQuantity, 3) + getFixedNumber(element.BaseItemUnitQuantity, 3)
            totalAmount = getFixedNumber(totalAmount, 3) + getFixedNumber(element.Amount, 3)
            totalGst = getFixedNumber(totalGst, 3) + getFixedNumber(element.GSTAmount, 3)
            GSTPercentage = Number(element.GSTPercentage)
        };

        if (Gst === 0) { Gst = element.GSTPercentage };

        if ((Gst === element.GSTPercentage)) {
            returnArr.push(tableitemRow)
            totalLots()
        }
        else {
            debugger
            returnArr.push(totalrow());
            returnArr.push(tableitemRow);
            totalGst = 0;
            totalAmount = 0;
            totalQuantity = 0;
            Gst = element.GSTPercentage;
            totalLots()

        }

        if (key === Object.keys(groupedItems).length - 1) {
            returnArr.push(totalrow());
        }
    })

    if (returnArr.length - 1) {
        returnArr.push([
            `GST Total: ${numberWithCommas(Number(finalTotalGST).toFixed(2))}            Amount: ${numberWithCommas(Number(finalTotal).toFixed(2))}`,
            ``,
            ``,
            `Span`,
        ]);
    }

    if (returnArr.length - 1) {
        returnArr.push([
            `Discount Amount: ${numberWithCommas(Number(finalDiscountAmount).toFixed(2))}           `,
            ``,
            ``,
            `Span`,
        ]);
    }

    return returnArr;
}



export default SaleSummaryThermalPrintReport;