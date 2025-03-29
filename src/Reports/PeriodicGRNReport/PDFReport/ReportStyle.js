
import * as table from './TableData'
import { CurrentTime, currentDate_dmy, loginUserDetails } from "../../../components/Common/CommonFunction";

export const pageBorder = (doc) => {
    doc.line(817, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 570, 30, 16);//vertical line (left)
    doc.line(817, 570, 817, 16);//vertical line (Right)
    doc.line(815, 570, 30, 570);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)
    doc.text('Periodic GRN Report', 400, 30, 'center') //stock Header
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(`*** ${loginUserDetails().PartyName} ***`, 400, 50, 'center')  //bill by 
    doc.line(815, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(815, 16, 30, 16);//horizontal line 2
    // doc.line(30, 400, 30, 16);//vertical left 1
    // doc.line(407, 100, 407, 60); //vertical line middle 
    doc.line(30, 100, 815, 100) //horizontal line Current date upper



    var options3 = {
        margin: {
            top: 45, left: 30, right: 35,// bottom:100 
        },
        showHead: 'always',
        theme: 'grid',
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
                columnWidth: 170,
                halign: 'lfet',
            },
            1: {
                valign: "top",
                columnWidth: 170,
                halign: 'lfet',
            },
            2: {
                valign: "top",
                columnWidth: 447,
                halign: 'lfet',
            },


        },
        tableLineColor: "black",
        startY: 60,// 45,
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

    var options = {

        margin: {
            left: 30, right: 25,//200 bottom
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
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
                columnWidth: 70,
            },
            1: {
                columnWidth: 74,
                halign: 'right',
            },
            2: {
                columnWidth: 100,
            },
            3: {
                columnWidth: 130,
                halign: 'right',
            },
            4: {
                columnWidth: 80,
                halign: 'right',
            },
            5: {
                columnWidth: 170,
                halign: 'right',
            },
            6: {
                columnWidth: 55,
                halign: 'right',
            },
            7: {
                columnWidth: 54,
                halign: 'right',
            },
            8: {
                columnWidth: 54,
                halign: 'right',
            },
            9: {
                columnWidth: 54,
                halign: 'right',
            },
            10: {
                columnWidth: 54,
                halign: 'right',
            },

        },

        tableLineColor: "black",
        startY: doc.autoTableEndPosY(45),// 45,

    };
    doc.autoTable(table.columns, table.Rows(data), options,);
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
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), 790, 580, {
            align: 'center'
        })
        doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 580,)

    }
}

