
import * as table from './TableData'
import { CurrentTime, currentDate_dmy } from "../../components/Common/CommonFunction";
let initial_y = 0

export const pageBorder = (doc) => {
    doc.line(570, 17, 30, 17);//horizontal line (Top)
    doc.line(30, 815, 30, 17);//vertical line (left)
    doc.line(570, 815, 570, 17);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('Party Ledger ', 130, 37,) //Tax invoice Header
    doc.addFont("Arial", 'Normal')

}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    // doc.setFont(undefined, 'bold')
    doc.line(330, 134, 330, 17);//vertical line header Account Extract 
    doc.line(570, 33, 330, 33) //horizontal line Account Extract  below

    doc.setFont('Tahoma')
    doc.setFontSize(10)
    // doc.setFont(undefined, 'bold')
    doc.text('Account Extract', 415, 26) //Invoice Id
    doc.text(`Date: ${String(currentDate_dmy)}`, 415, 44) //Invoice date
    doc.setFontSize(11)

    const priLength = () => {
        let final_y = doc.previousAutoTable.finalY
        initial_y = final_y
    }


    var options3 = {
        didParseCell: (data1) => {

            if (data1.row.cells[0].raw.includes("books")) {
                data1.row.cells[0].colSpan = 2
            }
        },
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
                columnWidth: 300,
                halign: 'lfet',
            },
            1: {
                valign: "top",
                columnWidth: 240,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",
        startY: 50
    };
    doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);
    priLength()

}
export const tableBody = (doc, data) => {
    const tableRow = table.Rows(data);
    console.log(tableRow)
    var options = {

        didParseCell: (data1) => {

            if (data1.row.cells[2].raw === "Monthly Total") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9
                data1.row.cells[4].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9


                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"

            }
            if (data1.row.cells[2].raw === "Opening Balance") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[5].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
            }

            if (data1.row.cells[2].raw === "Closing Balance") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[5].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Tax Free Sale") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Taxable sale 5.00 %") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }


            if (data1.row.cells[2].raw === "Tax 5.00 %") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Taxable sale 12.00 %") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Tax 12.00 %") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Taxable sale 18.00 %") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Tax 18.00 %") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Total Taxable Scale") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Total Credit Note") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Total Debit Note") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[4].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
            }
            if (data1.row.cells[2].raw === "Total TCS") {
                data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[3].styles.fontSize = 9

                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
            }

            if (data1.row.cells[2].raw === "") {
                data1.row.cells[0].colSpan = 6

            }












            if (data1.row.raw[6] === "Dispatch") {
                data1.row.cells[6].contentHeight = 2
            }
        },
        margin: {
            left: 30, right: 25
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
                columnWidth: 130,
                halign: 'left',
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
                columnWidth: 100,
                halign: 'right',
            },

        },
        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    doc.autoTable(table.columns, table.Rows(data), options);
    // Auto table for footer
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 40
        },
        showHead: 'never',
    };

    doc.autoTable(optionsTable4);

}
export const pageFooter = (doc, data) => {
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Print Date :' + String(currentDate_dmy) + 'Time' + String(CurrentTime()), 30, 828,)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 828,)
    }
}

