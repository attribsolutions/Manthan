
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'
import { toWords } from "../Report_common_function";


export const pageBorder = (doc) => {
    doc.line(815, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 570, 30, 16);//vertical line (left)
    doc.line(815, 570, 815, 16);//vertical line (Right)
    doc.line(815, 570, 30, 570);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)
    doc.text('Stock Report', 400, 30, 'center') //stock Header
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(`*** ${data.PartyName} ***`, 400, 50, 'center')  //bill by 
    doc.line(815, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(815, 16, 30, 16);//horizontal line 2
    doc.line(30, 400, 30, 16);//vertical left 1
    doc.line(407, 150, 407, 60); //vertical line middle 
    doc.line(300, 100, 815, 100) //horizontal line Current date upper



    var options3 = {
        margin: {
            // top: 45, left: 35, right: 35,// bottom:100 
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
            fontSize: 9,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 200,
                halign: 'lfet',
            },
           
        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY() + 63,// 45,
    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
}

export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')

}
export const reportHeder3 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    // doc.text(`Current Time: ${data.Time}`, 685, 50) //Invoice Id
    // doc.text(`Date: ${data.InvoiceDate}`, 685, 30) //Invoice date
}
// original

export const reportFooter = (doc, data) => {

    doc.setFontSize(9)
}
export const tableBody = (doc, data) => {
    const tableRow = table.Rows(data);
    console.log(tableRow)
    var options = {

        didParseCell: (data1) => {
            if (data1.row.cells[5].raw === "isaddition") {
                data1.row.cells[0].colSpan = 12
                data1.row.cells[4].colSpan = 1
                data1.row.cells[6].colSpan = 1

                data1.row.cells[0].styles.fontSize = 10
                data1.row.cells[4].styles.fontSize = 8
                data1.row.cells[6].styles.fontSize = 8

                data1.row.cells[0.].styles.halign = "center"
                data1.row.cells[0.].styles.fontStyle = "bold"
                data1.row.cells[6.].styles.fontStyle = "bold"
            }

            if (data1.row.cells[5].raw === "packing") {
                data1.row.cells[0].colSpan = 12

                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[0.].styles.fontStyle = "bold"
            }
        },
        margin: {
            left: 30, right: 25,//200 bottom
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
                columnWidth: 137,
            },
            1: {
                columnWidth: 80,
                halign: 'right',

            },
            2: {
                columnWidth: 80,
                halign: 'right',
            },
            3: {
                columnWidth: 80,
                halign: 'right',
            },
            4: {
                columnWidth: 50,
                halign: 'right',
            },
            5: {
                columnWidth: 60,
                halign: 'right',
            },
            6: {
                columnWidth: 60,
                halign: 'right',
            },
            7: {
                columnWidth: 58,
                halign: 'right',
            },
            8: {
                columnWidth: 60,
                fontStyle: 'bold',
                halign: 'right',
            },
            9: {
                columnWidth: 60,
                halign: 'right',
            },
            10: {
                columnWidth: 60,
                halign: 'right',
            },
            11: {
                columnWidth: 80,
                fontStyle: 'bold',
                halign: 'right',
            },
        },

        tableLineColor: "black",
        startY: doc.autoTableEndPosY(45),// 45,

    };

    doc.autoTable(table.columns, table.Rows(data), options, {


    });


}

export const pageFooter = (doc, data) => {

    let finalY = doc.previousAutoTable.finalY;
    if (finalY > 675) {

        pageBorder(doc)
        reportFooter(doc, data)
    } else {
        pageBorder(doc)
        reportFooter(doc, data)
    }
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 10, 580, {
            align: 'center'
        })
        console.log("aaa", doc.internal.pageSize.height)
    }
}

