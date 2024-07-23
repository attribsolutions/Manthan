
import cbm_logo from "../../../../assets/images/cbm_logo.png"
import * as table from './TableData'
import { toWords, numberWithCommas } from "../../../../Reports/Report_common_function";
import { CurrentTime, compareGSTINState, convertOnlyTimefunc, currentDate_dmy, date_dmy_func } from "../../../../components/Common/CommonFunction";
import { url } from "../../../../routes";
let initial_y = 0


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 815, 30, 16);//vertical line (left)
    doc.line(570, 815, 570, 16);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)    
}

export const pageHeder = (doc, data) => {

    doc.addImage(cbm_logo, 'PNG', 33, 1, 95, 80, null, 'FAST')
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)
    doc.text(' Franchies Order List Reports', 170, 45,)

}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text("Supplier", 80, 75)
    doc.text('Customer', 280, 75)
    doc.text('Shipping Address', 440, 75)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 63, 30, 63)  //Image below line  1
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3
    doc.line(30, 789, 30, 16);//vertical left 1

    doc.line(570, 789, 570, 16);//vertical left 2

    //Header Table Style 
    var BilledByStyle = {
        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Supplier : ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };

        },
        margin: {
            top: 45, left: 30, right: 35,
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
                columnWidth: 190,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",

        startY: 80,

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
                doc.text('Customer : ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };

        },
        margin: {
            top: 45, left: 220, right: 35,
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
                columnWidth: 188,
                halign: 'lfet',
            },
        },
        tableLineColor: "black",
        startY: 80,

    };
    var DetailsOfTransportStyle = {
        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('PO Type : ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Customer: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };
            if (rowIdx === 4 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Description: ', x, y)
            };

        },

        margin: {
            top: 45, left: 408, right: 35,
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
                columnWidth: 162,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: 80,

    };

    // let initial_y = 0
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

    doc.autoTable(table.DetailsOfTransport, table.DetailsOfTransportRow(data), DetailsOfTransportStyle);
    priLength()

    doc.line(408, initial_y, 408, 16);//vertical right 1
    doc.line(220, initial_y, 220, 63);//vertical right 2

    doc.line(30, initial_y, 570, initial_y);//vertical right 2


}



export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
}


export const reportHeder3 = (doc, data) => {

    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 30, 408, 30) //horizontal line 1 billby upper
    doc.line(570, 45, 408, 45) //horizontal line 2 billby upper


    doc.line(408, 65, 408, 16);//vertical right 1

    doc.setFont(undefined, 'bold')
    doc.text(`Order No: ${data.FullOrderNumber}`, 415, 25) //Invoice Id

    var time = convertOnlyTimefunc(data.CreatedOn)

    const dateOnly = data.CreatedOn.substring(0, 10);
    var Orderdate = date_dmy_func(dateOnly)
    doc.text(`Order Date: ${Orderdate}  ${time}`, 415, 40) //Invoice date
    var DeliveryDate = date_dmy_func(data.OrderDate)                          ///   Delivery Date
    doc.text(`Delivery Date: ${DeliveryDate}`, 415, 55) //Invoice date
    doc.line(570, 63, 30, 63) //horizontal line 2 billby upper

}

export const tableBody_1 = (doc, data) => {

    var options_1 = {
        didParseCell: (data1) => {
            if (data1.row.cells[1].raw === "") {
                data1.row.cells[0].colSpan = 3
                data1.row.cells[0].styles.halign = "left"
                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[0].styles.fontStyle = "bold"
            }
        },
   
        margin: {
            left: 30, right: 25, top: 67
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 3,
            lineWidth: 0.8,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 7,
            rowHeight: 10,
            lineColor: "black"
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 7,
            lineColor: [6, 3, 1]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 140,
            },
            1: {
                columnWidth: 70,
                halign: 'right',

            },
            2: {
                columnWidth: 55,
                halign: 'right',
            },

        },

        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    var options_2 = {
        didParseCell: (data1) => {
            debugger
            if (data1.row.cells[1].raw === "") {
                data1.row.cells[0].colSpan = 3
                data1.row.cells[0].styles.halign = "left"
                data1.row.cells[0].styles.fontSize = 9
                data1.row.cells[0].styles.fontStyle = "bold"
            }

        },

        margin: {
            left: 300, right: 25, top: 120
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 3,
            lineWidth: 0.8,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 7,
            rowHeight: 10,
            lineColor: "black"
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 5,
            fontSize: 7,
            lineColor: [6, 3, 1]
        },


        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 140,
            },
            1: {
                columnWidth: 70,
                halign: 'right',

            },
            2: {
                columnWidth: 55,
                halign: 'right',
            },

        },

        tableLineColor: "black",
        startY: initial_y,// 45,

    };


    doc.autoTable(table.columns_1, table.Rows_1(data), options_1);

    const pageCount = doc.internal.getNumberOfPages()

    doc.setFont('helvetica', 'Normal')

    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        if (i !== 1) {
            pageHeder(doc)
            reportHeder3(doc, data)
            // reportHeder1(doc, data)
        }
        doc.setFont('helvetica', 'Normal')
        doc.setFontSize(11)

        pageBorder(doc)

        doc.text('Print Date :' + String(currentDate_dmy) + 'Time' + String(CurrentTime()), 30, 828,)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 828,)

    }
}






















