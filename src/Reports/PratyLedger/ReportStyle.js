
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'
import { toWords } from "../Report_common_function";
let initial_y = 0



export const pageBorder = (doc) => {
    doc.line(570, 10, 30, 10);//horizontal line (Top)
    doc.line(30, 815, 30, 10);//vertical line (left)
    doc.line(570, 815, 570, 10);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)
    doc.text('Party Ledger ', 200, 40,) //Tax invoice Header
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    // doc.line(570, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(570, 10, 30, 10);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3
    // doc.line(409, 100, 30, 100) //horizontal line 4
    doc.line(30, 789, 30, 10);//vertical left 1
    doc.line(570, 789, 570, 10);//vertical left 2
    doc.line(408, 134, 408, 10);//vertical right 1
    doc.line(250, 134, 250, 80);//vertical right 2
    doc.line(570, 134, 30, 134);//horizontal line table 


    // doc.line(250, 100, 408, 100) //horizontal line Current date upper
    // doc.line(250, 117, 408, 117) //horizontal line Current date upper
    // doc.line(408, 107, 570, 107) //horizontal line Current date upper

    const priLength = () => {
        let final_y = doc.previousAutoTable.finalY
        initial_y = final_y
    }



    var options3 = {
        // didParseCell: (data1) => {
        //     
        //     if (data1.row.cells[5].raw === data.CustomerName) {
        //         data1.row.cells[0].colSpan = 2

        //         data1.row.cells[0].styles.fontSize = 8

        //         data1.row.cells[0].styles.fontStyle = "bold"

        //     }
        // },

        margin: {
            left: 30// bottom:100 /
        },
        showHead: 'always',
        theme: 'grid',
        styles: {
            overflow: 'linebreak',
            fontSize: 8,
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
                columnWidth: 378,
                halign: 'lfet',
            },
            1: {
                valign: "top",
                columnWidth: 162,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",
        startY: 60
    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
    priLength()

}

export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')

}

export const reportHeder3 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.line(570, 35, 408, 35) //horizontal line 1 billby upper
    doc.setFont(undefined, 'bold')
    doc.text(`From Date: ${data.FormDate}`, 415, 30) //Invoice Id
    doc.text(`To Date:   ${data.ToDate}`, 415, 50) //Invoice date
    doc.setFontSize(11)
    // doc.text(`Material: ${data.ItemName}`, 415, 75) //Invoice date
    // doc.text(`Open Balance : ${data.Open}`, 415, 95) //Invoice date
    // doc.text(`Close Balance: ${data.Close}`, 415, 120) //Invoice date


}
// original

export const reportFooter = (doc, data) => {
    // doc.autoTable(table.ReportFotterColumns2, table.ReportFooterRow2(data),);
    doc.setFontSize(9)
}
export const tableBody = (doc, data) => {
    const tableRow = table.Rows(data);
    console.log(tableRow)
    var options = {

        didParseCell: (data1) => {

            if (data1.row.cells[2].raw === "Total") {
                // data1.row.cells[0].colSpan = 3
                // data1.row.cells[4].colSpan = 2
                // data1.row.cells[6].colSpan = 2
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9
                data1.row.cells[4].styles.fontSize = 9
                data1.row.cells[5].styles.fontSize = 9
                data1.row.cells[6].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"

            }

            if (data1.row.raw[6] === "Dispatch") {
                data1.row.cells[6].contentHeight = 2
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
            halign: 'center',    //'center' or 'right'
            fontSize: 7,
            columnWidth: 'wrap',
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: "top",
                halign: 'center',
                columnWidth: 100,
            },
            1: {
                columnWidth: 70,
                halign: 'right',

            },
            2: {
                columnWidth: 70,
                halign: 'right',
            },
            3: {
                columnWidth: 70,
                halign: 'right',
            },
            4: {
                columnWidth: 70,
                halign: 'right',
            },
            5: {
                columnWidth: 60,
                halign: 'right',
            },
            6: {
                columnWidth: 100,
                halign: 'right',
            },

        },
        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    doc.autoTable(table.columns, table.Rows(data), options, {


    });
    // Auto table for footer
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 100
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