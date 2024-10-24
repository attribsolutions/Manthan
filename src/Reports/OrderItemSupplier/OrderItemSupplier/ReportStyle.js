
import cbm_logo from "../../../assets/images/cbm_logo.png"
import { currentDate_dmy, CurrentTime } from "../../../components/Common/CommonFunction";
import * as table from './TableData'
let initial_y = 0


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 815, 30, 16);//vertical line (left)
    doc.line(570, 815, 570, 16);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)    
}

export const pageHeder = (doc) => {
    doc.addImage(cbm_logo, 'PNG', 33, 1, 95, 80, null, 'FAST')
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)
    doc.text('ITEM SUPPLIER REPORT', 180, 45,)
}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    // doc.setFont(undefined, 'bold')
    // doc.text("Supplier", 80, 75)

    doc.setDrawColor(0, 0, 0);
    doc.line(570, 63, 30, 63)  //Image below line  1
    // doc.line(570, 16, 30, 16);//horizontal line 2
    // doc.line(570, 80, 30, 80);//horizontal line 3
    // doc.line(30, 789, 30, 16);//vertical left 1
    // doc.line(570, 789, 570, 16);//vertical left 2


    var DetailsSection_1 = {
        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Report From : ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Party: ', x, y)
            };

            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Party Address: ', x, y)
            };



        },
        margin: {
            top: 10, left: 30, right: 35,
        },
        showHead: 'never',

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
                columnWidth: 600,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",

        startY: 67,

    };

    const priLength = () => {
        let final_y = doc.previousAutoTable.finalY
        if (final_y > initial_y) {
            initial_y = final_y
        }
    }

    doc.autoTable(table.TableSection_1, table.DetailsSection_Row_1(data), DetailsSection_1);
    priLength()


}

export const reportHeder2 = (doc) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
}

export const tableBody = (doc, Row_Data) => {
    let PriviousrowSpanCount = "";
    let previousSupplierName = "";
    var options = {
        didParseCell: function (data) {
            if (data.column.index === 0 && data.section === "body") {
                if (data.row.index === data.table.body.length - 1) {
                    data.row.cells[0].styles.lineWidth = { top: 0.1, right: 0.1, bottom: 1, left: 0.1 }
                } else {
                    data.row.cells[0].styles.lineWidth = { top: 0.1, right: 0.1, bottom: 0, left: 0.1 }
                }
            } else if (data.column.index === 0 && data.section === "head") {
                data.row.cells[0].styles.lineWidth = { top: 0.1, right: 0.1, bottom: 0.9, left: 0.1 }
            }

            // Check if the current row's supplier name is the same as the previous one
            if (data.row.index > 0 && data.row.cells[0].raw === previousSupplierName) {

                // Only hide the bottom border of the Supplier Name column
                if (data.column.index === 0 && data.section === "body") {

                    data.row.cells[0].styles.lineColor = [255, 255, 255]
                    data.row.cells[0].styles.lineWidth = 0; // Hide bottom border for SupplierName column
                    data.cell.text[0] = ""
                }
            } else {
                const rowSpanCount = Row_Data.filter(d => d.SupplierName === data.row.cells[0].raw).length;
                if (rowSpanCount !== PriviousrowSpanCount && rowSpanCount > 1) {
                    data.row.cells[0].rowSpan = 2
                }
                previousSupplierName = data.row.cells[0].raw;
                data.row.cells[0].styles.fontSize = 9; // Hide bottom border for SupplierName column
                data.row.cells[0].styles.fontStyle = "bold"; // Hide bottom border for SupplierName column
                PriviousrowSpanCount = rowSpanCount;
            }
        },


        didDrawPage: (data) => {
            const finalY = data.cursor.y;
            doc.line(570, finalY, 30, finalY);//horizontal line (Bottom)    
        },

        pageBreak: 'auto',
        margin: {
            left: 30, right: 25, top: 65
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
            fontSize: 8,
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
                columnWidth: 208,
            },
            1: {
                columnWidth: 104,
                halign: 'right',
            },

            2: {
                columnWidth: 77,
                halign: 'right',
            },

            3: {
                columnWidth: 75,
                halign: 'right',
            },
            4: {
                columnWidth: 76,
                halign: 'right',
            },
        },

        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    doc.autoTable(table.columns, table.Rows(Row_Data, doc), options);


    const startY = doc.lastAutoTable.finalY
    debugger
    // doc.setPage(doc.internal.getNumberOfPages());

    // // If there's remaining vertical space in the page: start printing next table from the current section
    // const remainingVSpace = doc.internal.pageSize.height - margin.bottom - doc.lastAutoTable.finalY;
    // if (remainingVSpace > 25) {
    //     nextSection = currentSection;
    //     startY = doc.lastAutoTable.finalY + 10;
    // } else {
    //     startY = margin.top;
    //     if (nextSection == 1) doc.addPage();
    // }

    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')

    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, Row_Data)
        pageBorder(doc)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'Normal')
        doc.text('Print Date :' + String(currentDate_dmy) + 'Time' + String(CurrentTime()), 30, 828,)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 828,)

    }

}





