
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import { invoice } from "../ReportIndex";
import { toWords } from "../Report_common_function";

import * as table from './TableData'

export const pageBorder = (doc) => {
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 815, 30, 16);//vertical line (left)
    doc.line(570, 815, 570, 16);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addImage(reportHederPng, 'PNG', 32, 18, 75, 40)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    
    if (data.ReportType===invoice) {
        doc.setFontSize(15)
        doc.text('TAX INVOICE', 200, 40,)  
    }else{
        doc.setFontSize(15)
        doc.text('INTER BRANCH INVOICE', 200, 40,) 

    }

     //Tax invoice Header
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 80, 75)  //bill by 
    doc.text('Billed to', 280, 75) //billed to
    doc.text('Details of Transport', 440, 75)


    doc.line(570, 63, 30, 63) //horizontal line 1 billby upper
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3
    doc.line(409, 100, 30, 100)//horizontal line 4
    doc.line(30, 789, 30, 16);//vertical left 1
    doc.line(570, 789, 570, 16);//vertical left 2
    doc.line(408, 160, 408, 16);//vertical right 1
    doc.line(220, 160, 220, 63);//vertical right 2

    var options3 = {
        margin: {
            top: 45, left: 35, right: 35,// bottom:100 
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
            cellPadding: 3,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 200,
                halign: 'lfet',
            },
            1: {
                columnWidth: 200,
                halign: 'left',
            },
            2: {
                columnWidth: 200,
                halign: 'left',
            },

        },
        tableLineColor: "black",
        startY:85

    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
}

export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`GSTIN:${data.CustomerGSTIN}`, 38, 95)
    doc.text(`GSTIN:${data.PartyGSTIN}`, 238, 95)
}

export const reportHeder3 = (doc, data) => {
    if (data.ReportType===invoice) {
        doc.setFont('Tahoma')
        doc.setFontSize(10)
        doc.line(570, 35, 408, 35) //horizontal line 1 billby upper
        doc.setFont(undefined, 'bold')
        doc.text(`Invoice No:   ${data.InvoiceNumber}`, 415, 30) //Invoice Id
        doc.text(`Invoice Date: ${data.InvoiceDate}`, 415, 50) //Invoice date
    }else{
        doc.setFont('Tahoma')
        doc.setFontSize(10)
        doc.line(570, 35, 408, 35) //horizontal line 1 billby upper
        doc.setFont(undefined, 'bold')
        doc.text(`IB Invoice No:   ${data.InvoiceNumber}`, 415, 30) //Invoice Id
        doc.text(`IB Invoice Date: ${data.InvoiceDate}`, 415, 50) //Invoice date
    }
   
}
// original

export const reportFooter = (doc, data) => {
    var optionsTable2 = {
        margin: {
            top: 45, left: 35, right: 35,
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 2,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 7,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 140,
            },
            1: {
                columnWidth: 50,
                halign: 'right',
            },
            2: {
                columnWidth: 40,
                halign: 'center',
            },
            3: {
                halign: 'center',
            },
            4: {
                halign: 'center',
            },
            5: {
                halign: 'center',
            },
            6: {
                halign: 'center',
            },
            7: {
                halign: 'center',
            },
            8: {
                fontStyle: 'bold',
                halign: 'center',
            },
        },
        startY: doc.autoTableEndPosY(),// 45,
    };
    const optionsTable3 = {
        margin: {
            top: 45, left: 35, right: 200
        },
        showHead: 'never',
        theme: 'plain',
        headerStyles: {
            cellPadding: 1,
            lineWidth: 0,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 7,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                // valign: "top",
                // columnWidth: 280,
                // fontStyle: 'bold',
            },
        },
        didParseCell: function (cell, data) {
            if (cell.row.index === 0) {
                cell.cell.styles.fontSize = 7;
                cell.cell.styles.lineColor = 'gray'
                cell.cell.styles.lineWidth = 0.5
            }
        },
        startY: 745,
    };
    // doc.autoTable(table.ReportFotterColumns2, table.ReportFooterRow2(data),);

    const optionsTable4 = {
        margin: {
            top: 410, left: 410, right: 30,
        },
        showHead: 'never',
        theme: 'plain',
        headerStyles: {
            cellPadding: 1,
            lineWidth: 0,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
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
                halign: 'right',    //'center' or 'left'
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
        startY: 745,
    };
    doc.setFontSize(9)
}
export const tableBody = (doc, data) => {
    const tableRow = table.Rows(data);
    const {OrderItem = [] } = data

    console.log(tableRow)
    var options = {
        didParseCell: (data1) => {
            if (data1.row.cells[5].raw === "isaddition")
             {
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
            left: 30, right: 25,//200 bottom
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 2,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 1,
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
                fontStyle: 'bold',
                halign: 'right',
            },
        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY(45),// 45,
    };
    
    doc.autoTable(table.columns,table.Rows(data), options,);
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 140
        },
        showHead: 'never',
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

export const pageFooter = (doc, data) => {
    let stringNumber = toWords(data.GrandTotal)
    doc.addImage(upi_qr_code, 'PNG', 470, 750, 80, 60)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 745, 30, 745);//horizontal line Footer 2
    doc.line(570, 680, 30, 680);//horizontal line Footer 3
    doc.line(430, 700, 30, 700);//horizontal line Footer 3 Ruppe section
    doc.line(460, 745, 460, 815);//vertical right1 Qr Left 1
    doc.line(430, 680, 430, 745);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(460, 775, 30, 775);//horizontal line (Bottom)

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

    doc.text(`CGST:`, 434, 689,)
    doc.text(`${totalCGST.toFixed(2)}`, 560, 689, 'right')

    doc.text(`SGST:`, 434, 700,)
    doc.text(`${totalSGST.toFixed(2)}`, 560, 700, 'right')

    doc.text(`TotalGST:`, 434, 712,)
    doc.text(` ${TotalGST.toFixed(2)}`, 560, 712, 'right')

    doc.text(`BasicAmount:`, 434, 724,)
    doc.text(`${TotalBasicAmount.toFixed(2)}`, 560, 724, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Amount :`, 434, 740,)
    doc.text(`${data.GrandTotal}`, 560, 740, 'right')
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
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be of the nature and
   quantity whitch it/these purports to be `, 34, 760,)
    doc.text(`A/C No: 2715500356 IFSC Code:BKID00015422 `, 34, 710,)
    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 725,)
    doc.text(`Ruppe:${stringNumber} `, 33, 693,)
    let finalY = doc.previousAutoTable.finalY;
    
    if (finalY > 600) {
        
        pageBorder(doc)
        reportFooter(doc, data)
        // pageHeder(doc, data)
        // reportHeder1(doc, data)
        // reportHeder2(doc, data)
        // reportHeder3(doc, data)
        
    } else {
        pageBorder(doc)
        reportFooter(doc, data)
        pageHeder(doc, data)
        reportHeder1(doc, data)
        reportHeder2(doc, data)
        reportHeder3(doc, data)
    }
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 10, 828, {
            align: 'center'
        })
        console.log("aaa", doc.internal.pageSize.height)
    }
}

// original