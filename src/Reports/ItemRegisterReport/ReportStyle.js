
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'
import { toWords } from "../Report_common_function";
import { CurrentTime, currentDate_dmy, date_dmy_func, loginUserDetails } from "../../components/Common/CommonFunction";


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 17, 30, 17);//horizontal line (Top)
    doc.line(30, 815, 30, 17);//vertical line (left)
    doc.line(570, 815, 570, 17);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)
    doc.text('Material Register', 200, 40,) //Tax invoice Header
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    const UserDetails = loginUserDetails()

    doc.text(`*** ${UserDetails.PartyName} ***`, 300, 75, 'center')  //bill by 
    doc.line(570, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(570, 80, 30, 80);//horizontal line 3


    doc.line(408, 60, 408, 17);//vertical header report Name Section
    // doc.line(250, 134, 250, 80);//vertical right 2
    // doc.line(570, 134, 30, 134);//horizontal line table 


    doc.line(250, 100, 570, 100) //horizontal line Current date upper
    doc.line(250, 117, 570, 117) //horizontal line Current date upper




    var options3 = {
        didParseCell: (data1) => {

            if (data1.row.cells[1].raw.includes(':')) {
                data1.row.cells[1].colSpan = 2

            }
        },
        didDrawCell: (data1) => {


            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 10
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                doc.text('Customer: ', x, y)
            };
            if (rowIdx === 0 && colIdx === 1) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 10
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                doc.text('Material: ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 10
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                doc.text('From Date: ', x, y)
            };
            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 10
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };
            if (rowIdx === 1 && colIdx === 1) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 10
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                doc.text('To Date: ', x, y)
            };
            if (rowIdx === 2 && colIdx === 1) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 10
                doc.setFontSize(9)
                doc.setFont(undefined, 'bold')
                doc.text('To Date: ', x, y)
            };
            // if (rowIdx === 1 && colIdx === 2) {

            //     let x = data1.cursor.x + 2
            //     let y = data1.cursor.y + 10
            //     doc.setFontSize(9)
            //     doc.setFont(undefined, 'bold')
            //     doc.text('Open Balance:', x, y)
            // };
            // if (rowIdx === 2 && colIdx === 2) {

            //     let x = data1.cursor.x + 2
            //     let y = data1.cursor.y + 10
            //     doc.setFontSize(9)
            //     doc.setFont(undefined, 'bold')
            //     doc.text('Close Balance: ', x, y)
            // };



        },
        margin: {
            top: 20, left: 30, right: 35,
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
            // fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 230,
                halign: 'lfet',
            },
            1: {
                columnWidth: 147,
                halign: 'left',
            },
            2: {
                columnWidth: 163,
                halign: 'left',
            },
        },
        tableLineColor: "black",
        startY: 80
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
    doc.line(570, 35, 408, 35) //horizontal line 1 billby upper
    doc.line(408, 60, 408, 17);//vertical header report Name Section

    doc.setFont(undefined, 'bold')
    doc.text(`Report No:`, 415, 30) //Invoice Id
    doc.text(`Date:  ${date_dmy_func()} `, 415, 50) //Invoice date

    doc.setFontSize(11)
    // doc.text(`Material: ${data.ItemName}`, 415, 75) //Invoice date



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
            debugger
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

            if (data1.row.cells[2].raw === "Total") {
                data1.row.cells[0].colSpan = 8

                data1.row.cells[0].styles.fontSize = 9

                data1.row.cells[0].styles.fontStyle = "bold"
            }

            if (data1.row.cells[2].raw === "Total") {
                data1.row.cells[0].colSpan = 8
                data1.row.cells[0].styles.fontSize = 9
                data1.row.cells[0].styles.fontStyle = "bold"

            }

            if (data1.row.raw[6] === "Dispatch") {
                data1.row.cells[6].contentHeight = 2
            }

            if (data1.cell.raw === "STOCK") {
                debugger
                // data1.cell.styles.fontStyle = "bold"
                // data1.row.cells[2].styles.fontSize = 9
                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
                data1.row.cells[8].styles.fontStyle = "bold"
            }

            if (data1.column.index === 3) {
                if (data1.cell.raw !== "0.00") {
                    data1.row.cells[3].styles.fontStyle = "bold"

                }

            }
            if (data1.column.index === 4) {
                if (data1.cell.raw !== "0.00") {
                    data1.row.cells[4].styles.fontStyle = "bold"

                }

            } if (data1.column.index === 5) {
                if (data1.cell.raw !== "0.00") {
                    data1.row.cells[5].styles.fontStyle = "bold"

                }

            } if (data1.column.index === 6) {
                if (data1.cell.raw !== "0.00") {
                    data1.row.cells[6].styles.fontStyle = "bold"

                }

            }
            if (data1.column.index === 7) {
                if (data1.cell.raw !== "0.00") {
                    data1.row.cells[7].styles.fontStyle = "bold"

                }

            }



        },

        margin: {
            left: 30, right: 25, top: 55
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
                columnWidth: 80,
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
                columnWidth: 60,
                halign: 'right',
            },
            5: {
                columnWidth: 47,
                halign: 'right',
            },
            6: {
                columnWidth: 50,
                halign: 'right',
            },
            7: {
                columnWidth: 50,
                halign: 'right',
            },
            8: {
                columnWidth: 63,
                halign: 'right',
            },


        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY(),// 45,
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
        pageHeder(doc, data)
        pageBorder(doc)
        reportHeder3(doc, data)
        doc.setFontSize(8)

        doc.setFont('helvetica', 'Normal')
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), 540, 828,)

        doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 828,)

    }
}



// original