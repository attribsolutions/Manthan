
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'
import { toWords } from "../Report_common_function";
import { convertDatefunc } from "../../components/Common/CommonFunction";


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 379, 30, 16);//vertical line (left)
    doc.line(570, 379, 570, 16);//vertical line (Right)
    doc.line(570, 379, 30, 379);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFont(undefined, 'bold')
    doc.setFontSize(12)
    doc.text('TAX INVOICE', 180, 34,)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 43, 30, 43) //horizontal line 1 billby upper


}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 80, 52)  //bill by 
    doc.text('Billed to', 280, 52) //billed to
    doc.text('Details of Transport', 440, 52)

    doc.setDrawColor(0, 0, 0);
    doc.line(570, 43, 30, 43) //horizontal line 1 billby upper
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, 55, 30, 55);//horizontal line 3
    doc.line(409, 69, 30, 69)//horizontal line 4
    doc.line(30, 350, 30, 16);//vertical left 1
    doc.line(570, 350, 570, 16);//vertical left 2
    doc.line(408, 145, 408, 16);//vertical right 1
    doc.line(220, 145, 220, 43);//vertical right 2

    doc.line(570, 145, 30, 145) //horizontal line 1 billby upper

    var options3 = {
        margin: {
            top: 45, left: 35, right: 35, //bottom:100 
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
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 185,
                halign: 'lfet',
            },
            1: {
                columnWidth: 188,
                halign: 'left'
            },
            2: {
                columnWidth: 162,
                halign: 'left',
            },

        },
        tableLineColor: "black",

        startY: 55,

    };

    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
}

export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont(undefined, 'bold')
    doc.text(`GSTIN:${data.CustomerGSTIN}`, 38, 65)
    doc.text(`GSTIN:${data.PartyGSTIN}`, 238, 65)
}

export const reportHeder3 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 30, 408, 30) //horizontal line 1 billby upper
    doc.line(408, 42, 408, 16);//vertical right 1
    doc.setFont(undefined, 'bold')
    doc.text(`Invoice No:   ${data.InvoiceNumber}`, 415, 25) //Invoice Id
    var date = convertDatefunc(data.InvoiceDate)
    doc.text(`Invoice Date: ${date}`, 415, 40) //Invoice date


}
export const reportHeder4 = (doc, data) => {

    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.setFont(undefined, 'bold')
    doc.text(`Invoice No:   ${data.InvoiceNumber}`, 30, 23) //Invoice Id
    doc.text(`Invoice Date: ${data.InvoiceDate}`, 415, 35) //Invoice date

}

export const reportFooter = (doc, data) => {
    let stringNumber = toWords(Number(data.GrandTotal))
    doc.addImage(upi_qr_code, 'PNG', 362, 313, 70, 60)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 295, 30, 295);//horizontal line Footer 2
    // doc.line(570, 340, 30, 340);//horizontal line Footer 3
    doc.line(435, 308, 30, 308);//horizontal line Footer 3 Ruppe section
    doc.line(435, 295, 435, 379);//vertical right1 Qr Left 1
    doc.line(360, 308, 360, 379);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(360, 340, 30, 340);//horizontal line (Bottom)

    const a = data.InvoiceItems.map((data) => ({
        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        BasicAmount: Number(data.BasicAmount),
    }));
    var totalCGST = 0;
    var totalSGST = 0;
    var TotalBasicAmount = 0;
    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalBasicAmount += arg.BasicAmount

    });

    const TotalGST = totalCGST + totalSGST;

    doc.setFontSize(8)

    doc.text(`CGST:`, 440, 310,)
    doc.text(`${totalCGST.toFixed(2)}`, 560, 310, 'right')

    doc.text(`SGST:`, 440, 324,)
    doc.text(`${totalSGST.toFixed(2)}`, 560, 324, 'right')

    doc.text(`TotalGST:`, 440, 336,)
    doc.text(` ${TotalGST.toFixed(2)}`, 560, 336, 'right')

    doc.text(`BasicAmount:`, 440, 348,)
    doc.text(`${TotalBasicAmount.toFixed(2)}`, 560, 348, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Amount :`, 440, 365,)
    doc.text(`${data.GrandTotal}`, 560, 365, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.text(`Prepared by `, 35, 785,)
    doc.text(`Received By `, 180, 785,)
    doc.setFontSize(10)
    doc.text(`${data.PartyName} `, 390, 785,)
    doc.setFontSize(10)
    doc.text(`${data.CustomerName} `, 140, 811,)
    doc.setFontSize(9)
    doc.text(`Signature `, 400, 811,)
    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be
     of the nature and quantity which it/these purports to be `, 34, 350,)
    doc.text(`A/C No: 2715500354564564564564565456456 IFSC Code:BKID00015422 `, 34, 318,)
    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 328,)
    doc.setFont(undefined, 'bold')
    doc.text(`Rupees:`, 33, 305,)
    doc.addFont("Arial", 'Normal')
    doc.text(`${stringNumber}`, 65, 305,)


    const optionsTable4 = {
        margin: {
            top: 100, left: 50, right: 30,
        },
        showHead: 'never',
        theme: 'grid',
        headerStyles: {
            cellPadding: 1,
            lineWidth: 0,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 7,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
            },
            1: {
                halign: 'right',
                valign: "top",
            },
        },
        didParseCell: function (cell, data) {
            console.log("didParseCell", cell)
            console.log(" didParse data", data)

            if (cell.row.index === 4) {
                cell.cell.styles.fontSize = 12;
                cell.cell.styles.lineWidth = 1
            }
        },
        startY: 100
    };
    doc.setFontSize(9)
    doc.autoTable(optionsTable4,);
}

export const tableBody = (doc, data) => {
    var options = {
        didParseCell: (data1) => {
            if (data1.row.cells[5].raw === "isaddition") {
                data1.row.cells[2].colSpan = 2
                data1.row.cells[0].colSpan = 2
                data1.row.cells[4].colSpan = 2
                data1.row.cells[6].colSpan = 2

                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[2].styles.fontSize = 8
                data1.row.cells[4].styles.fontSize = 8
                data1.row.cells[6].styles.fontSize = 8

                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
            }
        },
        margin: {
            left: 30, right: 22, top: 43
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 4,
            fontSize: 7,
            columnWidth: 'wrap',
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 120,
            },
            1: {
                columnWidth: 70,
                halign: 'right',
            },
            2: {
                columnWidth: 40,
                halign: 'right',
            },
            3: {
                columnWidth: 60,
                halign: 'right',
            },
            4: {
                columnWidth: 40,
                halign: 'right',
            },
            5: {
                columnWidth: 50,
                halign: 'right',
            },
            6: {
                columnWidth: 40,
                halign: 'right',
            },
            7: {
                columnWidth: 50,
                halign: 'right',
            },
            8: {
                columnWidth: 70,
                fontStyle: 'bold',
                halign: 'right',
            },
        },
        tableLineColor: "black",
        startY: doc.previousAutoTable.finalY,// 45,
        // startY:85
    };


    doc.autoTable(table.columns, table.Rows(data), options,);
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 110
        },
        showHead: 'never',
        theme: '',
    };
    doc.autoTable(optionsTable4);
    doc.autoTable({
        html: '#table',
        didParseCell(data) {
            if (data.cell.row.index === 0) {
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fillColor = '#FF5783';
            }
        }
    })
}

export const pageFooter = (doc, data, islast = 0, array = []) => {

    let finalY = doc.previousAutoTable.finalY;
    if (finalY > 110) {
        pageBorder(doc)
        reportFooter(doc, data)
        pageHeder(doc, data)
        reportHeder3(doc, data)
    } else {
        pageBorder(doc)
        reportFooter(doc, data)
        pageHeder(doc, data)
        reportHeder3(doc, data)
    }

    const pageCount = doc.internal.getNumberOfPages()
    console.log(pageCount)

    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 40, 390,)
    }

    let condition1 = (array.length - 1 === islast)
    if (condition1) {
        for (let j = 1; j <= pageCount; j++) {
            doc.setPage(j)
          
            doc.text('PageAll ' + String(j) + ' of ' + String(pageCount), 500, 390,)

        }
    }
}

// original