
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
    doc.text(`Chitale Bandhu Mithalwale`, 300, 45, 'center')
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Claim ID : ${data.Period.ClaimID}`, 450, 40)

}


export const pageHeder = (doc, data) => {

    const StartDate = date_dmy_func(data.Period.FromDate).split('-');
    const EndDate = date_dmy_func(data.Period.ToDate).split('-');
    const monthIndex = parseInt(StartDate[1]) - 1;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[monthIndex];

    doc.setDrawColor(0, 0, 0);
    doc.setFont('Arial')

    doc.setFont(undefined, 'bold')
    doc.setFontSize(11)
    doc.text(`${data.Period.PartyName}`, 300, 65, 'center')
    doc.setFont(undefined, 'normal')

    doc.text(`Company wise Budget Report From ${StartDate[0]}-${monthName} To ${EndDate[0]}-${monthName} `, 300, 75, 'center')
    doc.text(`Expiry From Retailer(Approved/NonApproved)`, 300, 85, 'center')
    // doc.text(`GT And Xpress Claim`, 300, 95, 'center')
    doc.line(570, 52, 30, 52);//horizontal Line Below Name
}
export const tableBody = (doc, data) => {
    let tableStartY = 100;

    data.ReasonwiseMasterClaim.forEach((index1) => {

        Object.keys(index1).forEach((index2) => {
            doc.setFont(undefined, 'bold')
            doc.text(`${index2}`, 300, (tableStartY - 5), 'center')

            const options = {

                didParseCell: (data1) => {

                    if (data1.row.cells[0].raw === "Total") {

                        data1.row.cells[1].styles.fontSize = 8
                        data1.row.cells[2].styles.fontSize = 8
                        data1.row.cells[3].styles.fontSize = 8
                        data1.row.cells[4].styles.fontSize = 8
                        data1.row.cells[5].styles.fontSize = 8
                        data1.row.cells[6].styles.fontSize = 8
                        data1.row.cells[7].styles.fontSize = 8
                        data1.row.cells[0].styles.fontStyle = "bold"
                        data1.row.cells[1].styles.fontStyle = "bold"
                        data1.row.cells[2].styles.fontStyle = "bold"
                        data1.row.cells[3].styles.fontStyle = "bold"
                        data1.row.cells[4].styles.fontStyle = "bold"
                        data1.row.cells[5].styles.fontStyle = "bold"
                        data1.row.cells[6].styles.fontStyle = "bold"
                        data1.row.cells[7].styles.fontStyle = "bold"
                        data1.row.cells[0].rowSpan = 1
                    }

                    if (data1.cell.raw === numberWithCommas(Number(index1[index2][0].PurchaseAmount).toFixed(2))) {

                        if (data1.row.cells[0].raw === "Total") {

                            data1.row.cells[1].styles.valign = "top"
                        } else {
                            data1.row.cells[1].styles.halign = "right"
                            data1.row.cells[1].styles.valign = "center"

                            data1.row.cells[1].rowSpan = index1[index2].length
                        }
                    }
                    if (data1.cell.raw === numberWithCommas(Number(index1[index2][0].SaleAmount).toFixed(2))) {

                        if (data1.row.cells[0].raw === "Total") {

                            data1.row.cells[2].styles.valign = "top"
                        } else {
                            data1.row.cells[2].styles.halign = "right"
                            data1.row.cells[2].styles.valign = "center"
                            data1.row.cells[2].rowSpan = index1[index2].length
                        }
                    }
                    if (data1.row.index === 0) {

                        if (data1.row.cells[4].raw === numberWithCommas(Number(index1[index2][0].NetSaleValue).toFixed(2))) {

                            data1.row.cells[4].text[0] = `${numberWithCommas(Number(index1[index2].TotalNetPurchaseValue).toFixed(2))}`
                            data1.row.cells[4].styles.halign = "right"
                            data1.row.cells[4].styles.valign = "center"

                            data1.row.cells[4].rowSpan = index1[index2].length
                        }
                    }



                },
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
                        columnWidth: 125,
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
                        columnWidth: 55,
                        halign: 'right',
                    },
                    4: {
                        columnWidth: 55,
                        halign: 'right',
                    },
                    5: {
                        columnWidth: 55,
                        halign: 'right',
                    },
                    6: {
                        columnWidth: 55,
                        halign: 'right',
                    },
                    7: {
                        columnWidth: 55,
                        halign: 'right',
                    },
                    8: {
                        columnWidth: 55,
                        halign: 'right',
                    },
                },
                startY: tableStartY,
            }
            doc.autoTable(table.columns, table.Rows(index1[index2]), options);
            tableStartY = doc.previousAutoTable.finalY + 20;
        })
    })
    const ProductWiseoptions = {
        didParseCell: (data1) => {
            if (data1.row.cells[0].raw === "Total") {
                data1.row.cells[1].styles.fontSize = 8
                data1.row.cells[2].styles.fontSize = 8
                data1.row.cells[3].styles.fontSize = 8
                data1.row.cells[4].styles.fontSize = 8
                data1.row.cells[5].styles.fontSize = 8
                data1.row.cells[6].styles.fontSize = 8
                data1.row.cells[7].styles.fontSize = 8

                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[3].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"

            }

        },
        margin: {
            left: 30, right: 25, top: 60
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 0.5,
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
            textColor: [30, 30, 30],
            cellPadding: 3,
            fontSize: 7,
            columnWidth: 'wrap',
            lineColor: [0, 0, 0],
        },
        columnStyles: {

            0: {
                columnWidth: 125,
                halign: 'left',

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
                columnWidth: 55,
                halign: 'right',
            },
            4: {
                columnWidth: 55,
                halign: 'right',
            },
            5: {
                columnWidth: 55,
                halign: 'right',
            },
            6: {
                columnWidth: 55,
                halign: 'right',
            },
            7: {
                columnWidth: 55,
                halign: 'right',
            },
            8: {
                columnWidth: 55,
                halign: 'right',
            },
        },
        tableLineColor: "black",
        startY: doc.previousAutoTable.finalY + 20,
    }

    doc.setFont(undefined, 'bold')
    doc.text(`Product Wise Budget Report`, 300, doc.previousAutoTable.finalY + 14, 'center')
    doc.autoTable(table.ProductWisecolumns, table.ProductWiseRows(data), ProductWiseoptions);
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

