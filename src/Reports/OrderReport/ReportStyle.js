import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'

export const pageBorder = (doc) => { }
export const pageHeder = (doc) => {
    doc.addImage(reportHederPng, 'PNG', 35, 20, 80, 45)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    // doc.setFont('Courier')

    doc.setFontSize(20)
    doc.text('PURCHASE ORDER', 380, 50)
}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 35, 80)
    doc.text('Billed to', 235, 80)
    var options3 = {
        // tableLineColor: [189, 195, 199],
        // tableLineWidth: 0.75,
        margin: {
            top: 40, left: 30, right: 22,// bottom:100 
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            // overflowColumns: false ,
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
            1: {
                columnWidth: 200,
                halign: 'left',

            },
        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY() + 85,// 45,
    };

    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
}
export const reportHederR = (doc, data) => {
    doc.line(285, 15, 30, 15);//horizontal line 1
    doc.line(285, 45, 30, 45);//horizontal bottom
    doc.line(30, 45, 30, 15);//vertical left
    doc.line(285, 45, 285, 15);//vertical right 

    doc.line(285, 15, 573, 15);//horizontal line 1
    doc.line(285, 45, 575, 45);//horizontal bottom
    doc.line(285, 45, 285, 15);//vertical left
    doc.line(575, 45, 575, 15);//vertical right 
    doc.setFont('Tahoma', 'Normal')
    doc.setFontSize(9)

    // doc.text(`GSTIN: ${data.GSTIN}`, 33, 25)
    // doc.text('PAN:AAAFC5288N', 33, 35)
    // doc.text(`Invoice Number:${data.InvoiceID}`, 288, 25)
    // doc.text(`Invoice Date: ${data.InvoiceDate}`, 288, 35)
}
export const reportHeder2 = (doc, data) => {

}

export const reportFooter = (doc, data) => {
    var optionsTable2 = {

        margin: {
            top: 45, left: 35, right: 35,// bottom:100 
        },
        theme: 'grid',
        headerStyles: {
            //columnWidth: 'wrap',
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            // textColor: [255, 255, 255], //White     
            // fillColor: "white"
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
                // fontStyle: 'bold',
            },
            1: {
                columnWidth: 50,
                // fontStyle: 'bold',
                halign: 'right',
                // fontStyle: 'bold',
                //  height:50,
            },
            2: {
                columnWidth: 40,
                // fontStyle: 'bold',
                // fontStyle: 'bold',
                halign: 'center',
            },
            3: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            4: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            5: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            6: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            7: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            8: {
                // columnWidth: 40,
                fontStyle: 'bold',
                halign: 'center',
            },
        },
        startY: doc.autoTableEndPosY(),// 45,
    };
    const optionsTable3 = {

        margin: {
            top: 45, left: 35, right: 200
            ,// bottom:100 
        },
        showHead: 'never',
        theme: 'plain',
        headerStyles: {
            // columnWidth: 'wrap',
            cellPadding: 1,
            lineWidth: 0,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            // textColor: [255, 255, 255], //White     
            // fillColor: "white"
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 7,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 280,
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
    const optionsTable4 = {

        margin: {
            top: 410, left: 410, right: 30, bottom: 10
        },
        showHead: 'never',
        theme: 'plain',
        headerStyles: {
            // columnWidth: 'wrap',
            cellPadding: 1,
            lineWidth: 0,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            // textColor: [255, 255, 255], //White     
            // fillColor: "white"
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
            // console.log("didParseCell", cell)
            // console.log(" didParse data", data)

            if (cell.row.index === 4) {
                cell.cell.styles.fontSize = 12;
                cell.cell.styles.lineColor = 'gray'
                cell.cell.styles.lineWidth = 0.5

            }
        },

        startY: 745,
    };
    // doc.autoTable(table.ReportFotterColumns, table.ReportFooterRow(data), optionsTable2);
    doc.autoTable(table.ReportFotterColumns2, table.ReportFooterRow2(data), optionsTable3);
    doc.autoTable(table.ReportFotterColumns4, table.ReportFooterRow4(data), optionsTable4);

    let finalY = doc.previousAutoTable.finalY;

    if (finalY < 745) {
        doc.line(35, finalY, 35, 815);//horizontal line 3
        doc.line(561, finalY, 561, 815);//horizontal line 3
    }

    doc.addImage(upi_qr_code, 'PNG', 325, 751, 80, 60)
    doc.line(561, 745, 35, 745);//horizontal line 1
    // doc.line(561, 795, 410, 795);//horizontal line 2
    doc.line(561, 815, 35, 815);//horizontal line 3
    doc.line(410, 744, 410, 815);//vertical right1 

    doc.setFontSize(9)
    // doc.setFont('Tahoma', 'Normal')
    // // doc.text(`${stringNumber}`, 36, 759)
    // doc.text(`Total Amount :67674168.45`, 415, 759)

    // doc.text(`Total GST:124855.25`, 415, 770)
    // doc.text(`Total CTCS:45742.635`, 415, 781)
    // doc.text(`Round Off:46464.253`, 415, 791)
    // doc.setFontSize(12)
    // doc.text(`Amount:7654214463.53`, 415, 807)
}
export const tableBody = (doc, data) => {

    var options = {
        margin: {
            top: 45, left: 35, right: 35,// bottom:100 
        },
        theme: 'grid',
        headerStyles: {
            //columnWidth: 'wrap',
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'left',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            // fillColor: "white"
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 7,
            fontStyle: 'bold',
            // fontStyle: 'Normal',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                columnWidth:30,
                valign: "top",
                // columnWidth: 140,
                // fontStyle: 'bold',
            },
            1: {
                // columnWidth: 50,
                // fontStyle: 'bold',
                halign: 'left',
                // fontStyle: 'bold',
                //  height:50,
            },
            2: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                // fontStyle: 'bold',
                halign: 'center',
            },
            3: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            4: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            5: {
                // columnWidth: 40,
                // fontStyle: 'bold',
                halign: 'center',
            },
            
        },
        didParseCell(data) {
            if (data.cell.row.index === 0) {
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fillColor = '#FF5783';
            }
        },

        drawHeaderCell: function (cell, data) {

            if (cell.raw === 'Total GST') {//paint.Name header red
                cell.styles.fontSize = 15;
                cell.styles.textColor = [255, 0, 0];
            } else {
                cell.styles.textColor = 255;
                cell.styles.fontSize = 10;
            }
        },

        createdCell: function (cell, data) {
            // // console.log("aaaaaaaaaaaaaaaaaaaaaa",cell)
            // if (cell.raw === 'Total GST') {//paint.Name header red
            //     cell.styles.fontSize = 15;
            //     // cell.styles.textColor = [255, 0, 0];
            // } else {
            //     // cell.styles.textColor = 255;
            //     cell.styles.fontSize = 10;
            // }
        },
        tableLineColor: "black",
        // tableLineWidth: 0.01,
        startY: doc.autoTableEndPosY(),// 45,
    };
    doc.autoTable(table.columns, table.tableRows(data), options);

}
export const pageFooter = (doc) => {
    let finalY = doc.previousAutoTable.finalY;
    if (finalY > 675) {
        // doc.addPage();
        pageBorder(doc)
        reportFooter(doc)
    } else {
        pageBorder(doc)
        reportFooter(doc)
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