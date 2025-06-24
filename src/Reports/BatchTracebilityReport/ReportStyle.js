
import { CurrentTime, currentDate_dmy, date_dmy_func } from '../../components/Common/CommonFunction';
import { numberWithCommas } from '../Report_common_function';
import * as table from './TableData'
let initial_y = 0


export const pageBorder = (doc) => {
    doc.line(570, 25, 30, 25);//horizontal line (Top)
    doc.line(30, 815, 30, 25);//vertical line (left)
    doc.line(570, 815, 570, 25);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}



export const reportHeder1 = (doc, data) => {
    doc.setFontSize(18)
    doc.text(`Batch Traceability Report`, 300, 45, 'center')
}


export const pageHeder = (doc, data) => {

}
export const tableBody = (doc, data) => {
    let tableStartY = 80;

    doc.setFont(undefined, 'bold')

    const options_1 = {
        margin: {
            left: 30, right: 25,//200 bottom
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 0.5,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: "black"
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
                columnWidth: 40,
                halign: 'right',
            },
            1: {
                columnWidth: 70,
                halign: 'right',

            },
            2: {
                columnWidth: 90,
                halign: 'right',
            },
            3: {
                columnWidth: 120,
                halign: 'right',
            },
            4: {
                columnWidth: 65,
                halign: 'right',
            },
            5: {
                columnWidth: 70,
                halign: 'right',
            },
            6: {
                columnWidth: 85,
                halign: 'right',
            },

        },
        startY: tableStartY,
    }
    doc.setFontSize(10)
    doc.text(`BATCH DETAILS`, 35, 70, 'left')

    doc.autoTable(table.columns_1, table.Rows_1(data.WorkOrderDetails), options_1);
    const options_2 = {
        margin: {
            left: 30, right: 25,//200 bottom
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 0.5,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: "black"
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
                columnWidth: 40,
                halign: 'right',
            },
            1: {
                columnWidth: 200,
                halign: 'left',

            },
            2: {
                columnWidth: 140,
                halign: 'right',
            },
            3: {
                columnWidth: 160,
                halign: 'right',
            },

        },
        startY: doc.lastAutoTable.finalY + 20, // Use the final Y position of the previous table
    }
    doc.text(`BILL OF MATERIAL`, 35, doc.lastAutoTable.finalY + 15, 'left')

    doc.autoTable(table.columns_2, table.Rows_2(data.WorkOrderItems), options_2);
    const options_3 = {
        margin: {
            left: 30, right: 25,//200 bottom
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 0.5,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: "black"
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
                columnWidth: 40,
                halign: 'right',
            },
            1: {
                columnWidth: 90,
                halign: 'left',

            },
            2: {
                columnWidth: 60,
                halign: 'right',
            },
            3: {
                columnWidth: 50,
                halign: 'right',
            },
            4: {
                columnWidth: 50,
                halign: 'right',
            },
            5: {
                columnWidth: 50,
                halign: 'right',
            },
            6: {
                columnWidth: 55,
                halign: 'right',
            },
            7: {
                columnWidth: 60,
                halign: 'right',
            },
            8: {
                columnWidth: 85,
                halign: 'right',
            },
        },
        startY: doc.lastAutoTable.finalY + 20,
    }

    doc.text(`ACTUAL MATERIAL ISSUE`, 35, doc.lastAutoTable.finalY + 15, 'left')
    doc.autoTable(table.columns_3, table.Rows_3(data.MaterialIssues), options_3);

    const options_4 = {
        margin: {
            left: 30, right: 25,//200 bottom
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 0.5,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: "black"
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
                columnWidth: 40,
                halign: 'right',
            },
            1: {
                columnWidth: 90,
                halign: 'left',

            },
            2: {
                columnWidth: 60,
                halign: 'right',
            },
            3: {
                columnWidth: 40,
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
                columnWidth: 75,
                halign: 'right',
            },
            7: {
                columnWidth: 60,
                halign: 'right',
            },
            8: {
                columnWidth: 85,
                halign: 'right',
            },
        },
        startY: doc.lastAutoTable.finalY + 20,
    }
    doc.text(`PRODUCTION DETAILS`, 35, doc.lastAutoTable.finalY + 15, 'left')


    doc.autoTable(table.columns_4, table.Rows_4(data.ProductionDetails), options_4);

    const options_5 = {
        margin: {
            left: 30, right: 25,//200 bottom
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 0.5,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 8,
            rowHeight: 10,
            lineColor: "black"
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
                columnWidth: 40,
                halign: 'right',
            },
            1: {
                columnWidth: 70,
                halign: 'right',

            },
            2: {
                columnWidth: 55,
                halign: 'right',
            },
            3: {
                columnWidth: 180,
                halign: 'left',
            },
            4: {
                columnWidth: 85,
                halign: 'right',
            },

        },
        startY: doc.lastAutoTable.finalY + 20,
    }
    doc.text(`CUSTOMER DISPATCH DETAILS`, 35, doc.lastAutoTable.finalY + 15, 'left')

    doc.autoTable(table.columns_5, table.Rows_5(data.CustomerDispatchDetails), options_5);
}

export const pageFooter = (doc, data) => {
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFont(undefined, 'bold')

        pageBorder(doc, data)
        reportHeder1(doc, data)
        doc.setFont(undefined, 'normal')
        doc.setFontSize(8)


        doc.text('Page ' + String(i) + ' of ' + String(pageCount), 520, 824,)
        doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 824,)
    }
}

