
import { CurrentTime, currentDate_dmy, date_dmy_func } from "../../../../components/Common/CommonFunction";
import * as table from './TableData'
import { numberWithCommas, toWords } from "../../../Report_common_function";


let initial_y = 0

export const pageBorder = (doc) => {

    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 815, 30, 16);//vertical line (left)
    doc.line(570, 815, 570, 16);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}


export const pageHeder = (doc, data) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(408, 63, 408, 16);//vertical right 1
    doc.line(570, 63, 30, 63)  //horizontal line 1 billby upper for repeat header
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)
    doc.text(' CUSTOMER WISE RETURN SUMMARY', 70, 45,)
}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 63, 30, 63) //horizontal line 1 billby upper
    doc.line(408, 63, 408, 16);//vertical line header section billby 
    doc.line(570, 32, 408, 32);//horizontal line 3
    doc.line(570, 47, 408, 47);//horizontal line 3



    var BilledByStyle = {
        margin: {
            top: 45, left: 30, right: 35,
        },
        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Customer: ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Mobile No: ', x, y)
            };

        },

        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 8,
            fontStyle: 'normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 260,
                halign: 'lfet',
            }
        },
        tableLineColor: "black",

        startY: 63
    };

    var BilledToStyle = {

        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN No: ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };



        },
        margin: {
            top: 45, left: 292, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: data.PrintType ? 1 : 2,
            fontSize: 8,
            fontStyle: 'normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 270,
                halign: 'lfet',
            },
        },
        tableLineColor: "black",
        startY: 63,
    };


    const priLength = () => {
        let final_y = doc.previousAutoTable.finalY
        if (final_y > initial_y) {
            initial_y = final_y
        }

    }

    doc.autoTable(table.BilledBy, table.BilledByRow(data), BilledByStyle);
    priLength()

    doc.autoTable(table.BilledTo, table.BilledToRow(data), BilledToStyle);
    priLength()

    doc.line(290, initial_y, 290, 63);//Vertical line 


}

export const reportHeder3 = (doc, data) => {
    doc.line(570, 32, 408, 32);// horizontal line Repeat
    doc.line(570, 47, 408, 47);// horizontal line Repeat
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`From Date:  ${date_dmy_func(data.Period.FromDate)}`, 415, 25)
    doc.text(`To Date:       ${date_dmy_func(data.Period.ToDate)}`, 415, 40)
    doc.text(`Claim ID :       ${data.Period.ClaimID}`, 415, 57)


}

export const tableBody = (doc, data) => {
    var options = {
        didParseCell: (data1) => {

            if (data1.row.cells[0].raw === "Total") {
                data1.row.cells[1].colSpan = 3

                data1.row.cells[0].styles.fontSize = 7
                data1.row.cells[5].styles.fontSize = 7
                data1.row.cells[6].styles.fontSize = 7
                data1.row.cells[9].styles.fontSize = 7
                data1.row.cells[11].styles.fontSize = 7
                data1.row.cells[6].styles.fontSize = 7
                data1.row.cells[10].styles.fontSize = 7
                data1.row.cells[12].styles.fontSize = 7


                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[9].styles.fontStyle = "bold"
                data1.row.cells[11].styles.fontStyle = "bold"
                data1.row.cells[10].styles.fontStyle = "bold"
                data1.row.cells[12].styles.fontStyle = "bold"


            }



        },
        margin: {
            left: 30, right: 25, top: 63,
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 2,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 7,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 7,
            columnWidth: 'wrap',
            lineColor: [0, 0, 0],
        },
        columnStyles: {

            0: {
                valign: "top",
                columnWidth: 42,
            },
            1: {
                columnWidth: 25,
                halign: 'right',
            },
            2: {
                columnWidth: 79,
                halign: 'left',
            },
            3: {
                columnWidth: 75,
                halign: 'left',
            },
            4: {
                columnWidth: 30,
                halign: 'right',
            },
            5: {
                columnWidth: 37,
                halign: 'right',
            },

            6: {
                columnWidth: 37,
                halign: 'right',
            },
            7: {
                columnWidth: 35,
                halign: 'right',
            },
            8: {
                columnWidth: 40,
                halign: 'right',
            },
            9: {
                columnWidth: 37,
                halign: 'right',
            },
            10: {
                columnWidth: 33,
                halign: 'right',
            },
            11: {
                columnWidth: 34,
                halign: 'right',
            },
            12: {
                columnWidth: 36,
                halign: 'right',
            },
        },
        tableLineColor: "black",
        startY: initial_y,
    };

    doc.autoTable(table.columns, table.Rows(data), options,);
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 140
        },
    };
    doc.autoTable(optionsTable4);

}

export const reportFooter = (doc, data) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 730, 30, 730);//horizontal line Footer 1
    doc.line(435, 745, 30, 745);//horizontal line Footer 2
    doc.line(435, 775, 30, 775);//horizontal line Footer 3
    doc.line(435, 795, 30, 795);//horizontal line Footer 3
    doc.line(435, 730, 435, 815);//vertical right Sub Total
    doc.setFont('Tahoma')

    const a = data.ClaimSummaryItemDetails.map((data) => ({

        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        Amount: Number(data.Amount),
        Discount: Number(data.DiscountAmount),

    }));
    var totalCGST = 0;
    var totalSGST = 0;
    var TotalAmount = 0;
    var TotalDiscount = 0

    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalAmount += arg.Amount;
        TotalDiscount += arg.Discount;

    });
    const TotalGST = totalCGST + totalSGST;
    let stringNumber = toWords(Number(TotalAmount))


    doc.setFontSize(8)


    doc.text(`Total Amount:`, 440, 748,)
    doc.text(`${numberWithCommas(Number(TotalAmount).toFixed(2))}`, 567, 748, 'right')

    // doc.text(`Total Disc:`, 440, 748,)
    // doc.text(` ${numberWithCommas(Number(TotalDiscount).toFixed(2))}`, 567, 748, 'right')

    doc.text(`Total CGST:`, 440, 758)
    doc.text(`${numberWithCommas(Number(totalCGST).toFixed(2))}`, 567, 758, 'right')

    doc.text(`Total SGST:`, 440, 768,)
    doc.text(`${numberWithCommas(Number(totalSGST).toFixed(2))}`, 567, 768, 'right')

    doc.text(`Total GST:`, 440, 778,)
    doc.text(` ${numberWithCommas(Number(TotalGST).toFixed(2))}`, 567, 778, 'right')


    doc.setFont(undefined, 'Normal')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`Total Amount :`, 440, 812,)


    const Total = numberWithCommas((TotalAmount).toFixed(2))
    doc.text(`${Total}`, 567, 812, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.setFont("Arimo");
    doc.setFontSize(10)
    doc.text(`Signature `, 280, 810,)
    doc.text(`Prepared by :${data.PartyDetails.PartyName} `, 35, 810,)
    doc.setFontSize(8)
    doc.text(`${stringNumber}`, 65, 740,)

    doc.setFont(undefined, 'bold')
    doc.text(`Rupees:`, 33, 740,)
    doc.addFont("Arial", 'Normal')
    doc.setFont("Arimo");
}

export const pageFooter = (doc, data) => {
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, data)
        pageBorder(doc, data)
        reportHeder3(doc, data)
        doc.setFont('helvetica', 'Normal')
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), 520, 828,)
        doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 828,)

    }
}

// original