
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'

export const pageBorder = (doc) => {
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 370, 30, 16);//vertical line (left)
    doc.line(570, 370, 570, 16);//vertical line (Right)
    doc.line(570, 370, 30, 370);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    // doc.addImage(reportHederPng, 'PNG', 32, 18, 75, 40)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)
    doc.text('TAX INVOICE', 180, 35,)

    //Tax invoice Header
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 80, 55)  //bill by 
    doc.text('Billed to', 280, 55) //billed to
    doc.text('Details of Transport', 440, 55)


    doc.line(570, 44, 30, 44) //horizontal line 1 billby upper
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, 60, 30, 60);//horizontal line 3
    doc.line(409, 75, 30, 75)//horizontal line 4
    doc.line(30, 350, 30, 16);//vertical left 1
    doc.line(570, 350, 570, 16);//vertical left 2
    doc.line(408, 160, 408, 16);//vertical right 1
    doc.line(220, 160, 220, 60);//vertical right 2

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
                columnWidth: 175,
                halign: 'left'
            },
            2: {
                columnWidth: 200,
                halign: 'left',
            },

        },
        tableLineColor: "black",
        startY: 60,
       


    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
}

export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`GSTIN:${data.CustomerGSTIN}`, 38, 70)
    doc.text(`GSTIN:${data.PartyGSTIN}`, 238, 70)
}

export const reportHeder3 = (doc, data) => {

    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.line(570, 30, 408, 30) //horizontal line 1 billby upper
    doc.setFont(undefined, 'bold')
    doc.text(`Invoice No:   ${data.InvoiceNumber}`, 415, 25) //Invoice Id
    doc.text(`Invoice Date: ${data.InvoiceDate}`, 415, 40) //Invoice date


}
// original

export const reportFooter = (doc, data) => {
   
  
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
        startY: 70,
    };
    doc.setFontSize(9)
}
export const tableBody = (doc, data) => {
    const tableRow = table.Rows(data);
    const { OrderItem = [] } = data

    console.log(tableRow)
    //    const a= OrderItem.forEach((element) => {
    //         element.Comment
    //     })
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
            left: 30, right: 25,
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
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
        startY: 150,// 45,
        // startY:85

        
    };



    doc.autoTable(table.columns, table.Rows(data), options,);


    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 100
        },
        showHead: 'never',
        // theme: 'plain',
        headerStyles: {
            // columnWidth: 'wrap',
            // cellPadding: 1,
            // lineWidth: 0,
            // valign: 'top',
            // fontStyle: 'bold',
            // halign: 'left',    //'center' or 'right'
            // fillColor: "white",
            // textColor: [0, 0, 0], //Black     
            // // textColor: [255, 255, 255], //White     
            // // fillColor: "white"
            // fontSize: 8,
            // rowHeight: 10,
            // lineColor: [0, 0, 0]
        },
        bodyStyles: {
            // columnWidth: 'wrap',
            // textColor: [30, 30, 30],
            // cellPadding: 2,
            // fontSize: 7,
            // fontStyle: 'bold',
            // lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                // columnWidth:10,
                // fontStyle: 'bold',
            },
            1: {
                halign: 'right',    //'center' or 'left'
                valign: "top",
                // columnWidth: 140,
                // fontStyle: 'bold',
            },
        },
        didParseCell: function (cell, data) {
            console.log("didParseCell", cell)
            console.log(" didParse data", data)

            if (cell.row.index === 4) {
                // cell.cell.styles.fontSize = 12;
                // cell.cell.styles.lineColor = 'gray'
                // cell.cell.styles.lineWidth = 0.5

            }
        },

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
    let stringNumber = toWords(data.GrandTotal)
    // doc.addImage(upi_qr_code, 'PNG', 485, 305, 80, 60)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 295, 30, 295);//horizontal line Footer 2
    // doc.line(570, 340, 30, 340);//horizontal line Footer 3
    doc.line(435, 308, 30, 308);//horizontal line Footer 3 Ruppe section
    doc.line(435, 295, 435, 370);//vertical right1 Qr Left 1
    doc.line(430, 680, 430, 745);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(435, 340, 30, 340);//horizontal line (Bottom)


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
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be of the nature and
   quantity whitch it/these purports to be `, 34, 350,)
    doc.text(`A/C No: 2715500356 IFSC Code:BKID00015422 `, 34, 318,)
    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 328,)
    doc.setFont(undefined, 'bold')
    doc.text(`Ruppe:`, 33, 305,)
    doc.addFont("Arial", 'Normal')

    doc.text(`${stringNumber} `, 65, 305,)
    let finalY = doc.previousAutoTable.finalY;
    debugger
    if (finalY >120) {
       debugger
        pageBorder(doc)
        reportFooter(doc, data)
        // pageHeder(doc, data)
        // reportHeder1(doc, data)
        // reportHeder2(doc, data)
        // reportHeder3(doc, data)

    } else {
        debugger
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