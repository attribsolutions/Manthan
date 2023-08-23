
import cbm_logo from "../../assets/images/cbm_logo.png"
import * as table from './TableData'
import { toWords, numberWithCommas } from "../Report_common_function";
import { CurrentTime, compareGSTINState, convertOnlyTimefunc, currentDate_dmy, date_dmy_func } from "../../components/Common/CommonFunction";
import { url } from "../../routes";
let initial_y = 0


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 815, 30, 16);//vertical line (left)
    doc.line(570, 815, 570, 16);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)    
}

export const pageHeder = (doc, data) => {

    doc.addImage(cbm_logo, 'PNG', 33, 14, 85, 50)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)
    if (data.subPageMode === url.ORDER_LIST_4) {
        doc.text('SALES  ORDER', 180, 45,)
    } else {
        doc.text('PURCHASE ORDER', 180, 45,)

    }
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
    doc.line(408, 160, 408, 16);//vertical right 1
    doc.line(220, 160, 220, 63);//vertical right 2

    //Header Table Style 
    var BilledByStyle = {
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
            fontStyle: 'bold',
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
            fontStyle: 'bold',
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
            fontStyle: 'bold',
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
    console.log("first", doc.previousAutoTable.finalY)
    priLength()

    doc.autoTable(table.BilledTo, table.BilledToRow(data), BilledToStyle);
    console.log("Second", doc.previousAutoTable.finalY)
    priLength()

    doc.autoTable(table.DetailsOfTransport, table.DetailsOfTransportRow(data), DetailsOfTransportStyle);
    console.log("third", doc.previousAutoTable.finalY)
    priLength()
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

export const reportFooter = (doc, data) => {
    var options1 = {
        didParseCell: (data1) => {

            if (data1.row.cells[0].raw === "Terms And Condition") {
                data1.row.cells[0].styles.fontSize = 10
                data1.row.cells[0].styles.fontStyle = "bold"
            }

        },
        margin: {
            top: 45, left: 35, right: 35, bottom: 10
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
            cellPadding: 1,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 395,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: 765,

    };

    doc.autoTable(table.Footercolumn, table.ReportRows(data), options1);
    doc.setFontSize(9)
}


export const tableBody = (doc, data) => {
    const tableRow = table.Rows(data);
    console.log(tableRow)
    const { OrderItem = [] } = data
    var options = {
        didParseCell: (data1) => {

            if (data1.row.cells[8].raw === "isaddition") {
                data1.row.cells[0].colSpan = 2
                data1.row.cells[2].colSpan = 2
                data1.row.cells[4].colSpan = 2

                data1.row.cells[5].colSpan = 2
                data1.row.cells[7].colSpan = 2
                data1.row.cells[9].colSpan = 2

                data1.row.cells[0].styles.halign = "right"


                data1.row.cells[0].styles.fontSize = 7
                data1.row.cells[4].styles.fontSize = 7
                data1.row.cells[6].styles.fontSize = 7
                data1.row.cells[7].styles.fontSize = 7
                data1.row.cells[9].styles.fontSize = 7
                data1.row.cells[11].styles.fontSize = 7
                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
                data1.row.cells[9].styles.fontStyle = "bold"
                data1.row.cells[11].styles.fontStyle = "bold"
            }
            if (data1.row.cells[0].raw === "HSN Item Name") {
                let TotalBox = 0;
                OrderItem.forEach((element, key) => {
                    if (element.PrimaryUnitName === "Box") {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[0].text[0] = ` HSN Item Name (${OrderItem.length})  (${TotalBox} Box)`
                data1.row.cells[7].colSpan = 2
                data1.row.cells[9].colSpan = 2
            }
        },
        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 7) {
                if (data1.row.cells[7].raw === "       CGST        %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 4, startY1vertical + 2, startXVertical - 4, endYvertical + 2);  // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }
            if (rowIdx === 0 && colIdx === 9) {
                if (data1.row.cells[9].raw === "       SGST        %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 4, startY1vertical + 2, startXVertical - 4, endYvertical + 2); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }

        },
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
            fontSize: 7,
            rowHeight: 10,
            lineColor: "black"
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 5,
            fontSize: 7,
            // fontStyle: 'bold',
            lineColor: [6, 3, 1]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 125,
            },
            1: {
                columnWidth: 45,
                halign: 'right',

            },
            2: {
                columnWidth: 36,
                halign: 'right',

            },

            3: {
                columnWidth: 40,
                halign: 'right',
            },
            4: {
                columnWidth: 44,
                halign: 'right',
            },
            5: {
                columnWidth: 43,
                halign: 'right',
            },
            6: {
                columnWidth: 43,
                halign: 'right',
            },
            7: {
                columnWidth: 25,
                halign: 'right',
            },
            8: {
                columnWidth: 34,
                halign: 'right',
            },
            9: {
                columnWidth: 25,
                fontStyle: 'bold',
                halign: 'right',
            },
            10: {
                columnWidth: 34,
                fontStyle: 'bold',
                halign: 'right',
            },
            11: {
                columnWidth: 46,
                fontStyle: 'bold',
                halign: 'right',
            },


        },

        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    doc.autoTable(table.columns, table.Rows(data), options);

    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 50
        },
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

export const tableBodyWithIGST = (doc, data) => {
    const tableRow = table.Rows(data);
    console.log(tableRow)
    const { OrderItem = [] } = data
    //Body table  Css
    var options = {
        didParseCell: (data1) => {
            if (data1.row.cells[8].raw === "isaddition") {
                data1.row.cells[0].colSpan = 2
                data1.row.cells[2].colSpan = 2
                data1.row.cells[4].colSpan = 2
                data1.row.cells[7].colSpan = 2


                data1.row.cells[0].styles.halign = "right"
                data1.row.cells[1].styles.halign = "right"
                data1.row.cells[1].styles.fontStyle = "bold"


                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[2].styles.fontSize = 8
                data1.row.cells[4].styles.fontSize = 8
                data1.row.cells[6].styles.fontSize = 8
                data1.row.cells[7].styles.fontSize = 8
                data1.row.cells[9].styles.fontSize = 8




                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
                data1.row.cells[9].styles.fontStyle = "bold"





            }
            if (data1.row.cells[0].raw === "HSN Item Name") {

                let TotalBox = 0;
                OrderItem.forEach((element, key) => {
                    if (element.PrimaryUnitName === "Box") {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[0].text[0] = ` HSN Item Name (${OrderItem.length})  (${TotalBox} Box)`
                data1.row.cells[7].colSpan = 2
            }



        },
        margin: {
            left: 30, right: 25, top: 65
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 4,
            lineWidth: 1,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',
            fillColor: "white",
            textColor: [0, 0, 0],
            fontSize: 8,
            rowHeight: 10,
            lineColor: [0, 0, 0]
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 2,
            fontSize: 7,
            // fontStyle: 'bold',
            lineColor: [6, 3, 1]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 140,
            },
            1: {
                columnWidth: 55,
                halign: 'left',

            },
            2: {
                columnWidth: 40,
                halign: 'right',
            },
            3: {
                columnWidth: 40,
                halign: 'right',
            },
            4: {
                columnWidth: 50,
                halign: 'right',
            },
            5: {
                columnWidth: 43,
                halign: 'right',
            },
            6: {
                columnWidth: 45,
                halign: 'right',
            },
            7: {
                columnWidth: 26,
                halign: 'right',
            },
            8: {
                columnWidth: 40,
                halign: 'right',
            },
            9: {
                columnWidth: 61,
                halign: 'right',
            },




        },

        tableLineColor: "black",
        startY: initial_y,// 45,

    };

    doc.autoTable(table.columnsWithIGST, table.RowsWithIGST(data), options);

    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 50
        },
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

    const GrandTotal = Number(data.OrderAmount)
    const Total = numberWithCommas((GrandTotal).toFixed(2))
    let stringNumber = toWords(Number(GrandTotal))
    // doc.addImage(upi_qr_code, 'PNG', 470, 750, 80, 60)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 735, 30, 735);//horizontal line Footer 2
    // doc.line(570, 680, 30, 680);//horizontal line Footer 3
    // doc.line(430, 700, 30, 700);//horizontal line Footer 3 Ruppe section
    // doc.line(460, 745, 460, 815);//vertical right1 Qr Left 1
    doc.line(430, 735, 430, 815);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(430, 750, 30, 750);//horizontal line (Bottom)

    const a = data.OrderItem.map((data) => ({
        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        BasicAmount: Number(data.BasicAmount),
        IGST: Number(data.IGST),
        DiscountAmount: Number(data.DiscountAmount),

    }));
    let totalCGST = 0;
    let totalSGST = 0;
    let TotalBasicAmount = 0;
    let totalIGST = 0;
    let totalDiscount = 0;

    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalBasicAmount += arg.BasicAmount;
        totalIGST += arg.IGST;
        totalDiscount += arg.DiscountAmount;
    });

    const TotalGST = totalCGST + totalSGST;
    // console.log(arr)

    const isIGST = compareGSTINState(data.CustomerGSTIN, data.SupplierGSTIN)
    if (isIGST) {
        doc.setFontSize(8)
        doc.text(`Total Basic:`, 434, 752,)
        doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 568, 752, 'right')

        doc.text(`Total Disc:`, 434, 762,)
        doc.text(`${numberWithCommas(Number(totalDiscount).toFixed(2))}`, 568, 762, 'right')

        doc.text(`Total IGST:`, 434, 772,)
        doc.text(`${numberWithCommas(Number(totalIGST).toFixed(2))}`, 568, 772, 'right')

        doc.text(`Total GST:`, 434, 782,)
        doc.text(` ${numberWithCommas(Number(totalIGST).toFixed(2))}`, 568, 782, 'right')



    } else {

        doc.setFontSize(8)
        doc.text(`Total Basic:`, 434, 752,)
        doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 568, 752, 'right')

        doc.text(`Total Disc:`, 434, 762,)
        doc.text(`${numberWithCommas(Number(totalDiscount).toFixed(2))}`, 568, 762, 'right')

        doc.text(`Total CGST:`, 434, 772,)
        doc.text(`${numberWithCommas(Number(totalCGST).toFixed(2))}`, 568, 772, 'right')

        doc.text(`Total SGST:`, 434, 782,)
        doc.text(`${numberWithCommas(Number(totalSGST).toFixed(2))}`, 568, 782, 'right')

        doc.text(`Total GST:`, 434, 792,)
        doc.text(` ${numberWithCommas(Number(TotalGST).toFixed(2))}`, 568, 792, 'right')

    }


    doc.setFont(undefined, 'Normal')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`Order Amount:`, 433, 810,)
    // const GrandTotal = Math.round(data.OrderAmount)
    //  const GrandTotal = numberWithCommas((56784936).toFixed(2))
    doc.text(`${Total}`, 568, 810, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    const terms = data.OrderTermsAndCondition
    doc.setFont(undefined, 'bold')
    doc.setFontSize(10)
    // doc.text(`Terms And Condition  `, 33, 775, "justify")
    doc.setFont(undefined, 'Normal')
    doc.setFontSize(9)



    // doc.autoTable(terms);
    // const slicedArray = terms.slice(0, 3);
    // // doc.text(`${slicedArray[0]}`, 35, 793, "justify")
    // doc.text(`${slicedArray[0] === undefined ? "" : slicedArray[0].TermsAndCondition}`, 33, 783, "justify")
    // doc.text(`${slicedArray[1] === undefined ? "" : slicedArray[1].TermsAndCondition}`, 33, 793, "justify")
    // doc.text(`${slicedArray[2] === undefined ? "" : slicedArray[2].TermsAndCondition}`, 33, 803, "justify")
    // doc.text(`${slicedArray[3] === undefined ? "" : slicedArray[3].TermsAndCondition}`, 33, 813, "justify")

    // doc.text(`${slicedArray[2]}`, 35, 813, "justify")
    // doc.text(`Received By `, 180, 785,"justify")
    doc.setFontSize(10)
    // doc.text(`${data.SupplierName} `, 390, 785, "justify")
    doc.setFontSize(10)
    // doc.text(`${data.CustomerName} `, 175, 811,"justify")
    doc.setFontSize(9)
    // doc.text(`Signature `, 400, 811, "justify")
    doc.setFont("Arimo");
    // doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be of the nature and
    // quantity whitch it/these purports to be `, 34, 760,)
    // doc.text(`A/C No: 2715500356 IFSC Code:BKID00015422 `, 34, 710,)
    // doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 725,)
    // doc.text(`INR NO : 12547yfewyrt5675w6wer78sdf687s6d7f8676yse87fugh43 `, 34, 740)
    doc.setFont(undefined, 'bold')
    doc.text(`Rupees:`, 33, 747,)
    doc.setFont(undefined, 'Normal')
    doc.text(`${stringNumber}`, 65, 747,)

    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    // doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, data)
        pageBorder(doc)
        reportHeder3(doc, data)
        doc.setFont('helvetica', 'Normal')

        doc.text('Print Date :' + String(currentDate_dmy) + 'Time' + String(CurrentTime()), 30, 828,)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 828,)

    }
}
