

// import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'
import { numberWithCommas, toWords } from "../Report_common_function";
import { date_dmy_func, convertOnlyTimefunc, convertTimefunc, currentDate_dmy, CurrentTime, compareGSTINState, loginSystemSetting } from "../../components/Common/CommonFunction";


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5)
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 393, 30, 16);//vertical line (left)
    doc.line(570, 393, 570, 16);//vertical line (Right)
    doc.line(570, 393, 30, 393);//horizontal line (Bottom)   
}

let initial_y = 0

export const pageHeder = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFont(undefined, 'bold')
    doc.setFontSize(15)
    doc.text('TAX INVOICE', 180, 35,)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 45, 30, 45) //Full horizontal line Bill by Upper line
    doc.setFontSize(7)
    doc.text('Original For Buyer', 33, 28,)

}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 80, 55)    //bill by 
    doc.text('Billed to', 280, 55)   //billed to
    doc.text('Details of Transport', 440, 55) //Details of Transport
    doc.line(570, 45, 30, 45);//horizontal line  when header on next page bottom line
    doc.line(570, 60, 30, 60);// full horizontal bill by bill to below line 
    doc.line(30, 350, 30, 16);//vertical left 1
    doc.line(570, 350, 570, 16);//vertical left 2



    var BilledByStyle = {

        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Party: ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };
            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('State: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN: ', x, y)
            };
            if (rowIdx === 4 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };
            if (rowIdx === 5 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Mobile No: ', x, y)
            };

        },
        didParseCell: (data1) => {
            if (data1.row.cells[0].raw === `            ${data.PartyName}`) {
                data1.row.cells[0].styles.fontStyle = "bold"
            }
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
            textColor: "black",
            cellPadding: 1,
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
        startY: 62,

    };
    var BilledToStyle = {
        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Customer: ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Address: ', x, y)
            };
            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('State: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN: ', x, y)
            };
            if (rowIdx === 4 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };
            if (rowIdx === 5 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Mobile No: ', x, y)
            };

        },
        didParseCell: (data1) => {
            if (data1.row.cells[0].raw === `                   ${data.CustomerName}`) {
                data1.row.cells[0].styles.fontStyle = "bold"
            }
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
            textColor: "black",
            cellPadding: 1,
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
        startY: 62,

    };
    var DetailsOfTransportStyle = {

        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('PO No: ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Driver Name: ', x, y)
            };
            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Vehicle No: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('E-way Bill: ', x, y)
            };
            if (rowIdx === 4 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('IRN No: ', x, y)
            };


        },
        margin: {
            top: 45, left: 408, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        headerStyles: { cellPadding: 1, },
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
            textColor: "black",
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

        startY: 62,
    };

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


export const reportHeder3 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 30, 408, 30) //horizontal line 1 billby upper
    doc.line(408, 45, 408, 16);//vertical Line header
    // doc.line(570, 44, 408, 44) //horizontal line 1 billby upper

    doc.setFont(undefined, 'bold')
    doc.text(`Invoice No:   ${data.FullInvoiceNumber}`, 415, 25) //Invoice Id
    var date = date_dmy_func(data.InvoiceDate)
    var time = convertOnlyTimefunc(data.CreatedOn)
    doc.text(`Invoice Date: ${date}  ${time}`, 415, 40) //Invoice date

}


export const reportFooter = (doc, data) => {
    doc.addImage(data.SettingData.PaymentQRCodeimageonInvoice, 'JPEG', 335, 303, 105, 96)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 308, 30, 308);//horizontal line  (4)
    doc.line(570, 380, 435, 380);//horizontal line  (5)

    doc.line(435, 308, 435, 393);//vertical line (3)
    doc.line(340, 308, 340, 393);//vertical line (2)

    const a = data.InvoiceItems.map((data) => ({

        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        BasicAmount: Number(data.BasicAmount),
        Discount: Number(data.DiscountAmount),
        IGST: Number(data.IGST)
    }));
    var totalCGST = 0;
    var totalSGST = 0;
    var TotalBasicAmount = 0;
    var TotalDiscount = 0
    var totalICGST = 0
    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalBasicAmount += arg.BasicAmount;
        TotalDiscount += arg.Discount;
        totalICGST += arg.IGST

    });
    const TotalGST = totalCGST + totalSGST;
    doc.setFontSize(8)


    const isIGST = compareGSTINState(data.CustomerGSTIN, data.PartyGSTIN)
    if (isIGST) {

        doc.text(`Total Basic:`, 440, 327,)
        doc.text(`${TotalBasicAmount.toFixed(2)}`, 567, 327, 'right')

        doc.text(`Total Disc:`, 440, 337,)
        doc.text(` ${TotalDiscount.toFixed(2)}`, 567, 337, 'right')

        doc.text(`Total IGST:`, 440, 347)
        doc.text(`${totalICGST.toFixed(2)}`, 567, 347, 'right')

        doc.text(`Total GST:`, 440, 357,)
        doc.text(` ${totalICGST.toFixed(2)}`, 567, 357, 'right')


    } else {
        doc.text(`Total Basic:`, 440, 317,)
        doc.text(`${numberWithCommas(TotalBasicAmount.toFixed(2))}`, 567, 317, 'right')

        doc.text(`Total Disc:`, 440, 327,)
        doc.text(`${numberWithCommas(TotalDiscount.toFixed(2))}`, 567, 327, 'right')

        doc.text(`Total CGST:`, 440, 337)
        doc.text(`${numberWithCommas(totalCGST.toFixed(2))}`, 567, 337, 'right')

        doc.text(`Total SGST:`, 440, 347,)
        doc.text(`${numberWithCommas(totalSGST.toFixed(2))}`, 567, 347, 'right')

        doc.text(`Total GST:`, 440, 357,)
        doc.text(` ${numberWithCommas(TotalGST.toFixed(2))}`, 567, 357, 'right')

    }


    doc.text(`Round Off:`, 440, 367,)
    doc.text(` ${Number(data.RoundOffAmount).toFixed(2)}`, 567, 367, 'right')

    doc.text(`TCS Amount:`, 440, 377,)
    doc.text(` ${numberWithCommas(Number(data.TCSAmount).toFixed(2))}`, 567, 377, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`Total Amount :`, 439, 390,)
    const Total = numberWithCommas(Number(data.GrandTotal).toFixed(2))
    doc.text(`${Total}`, 567, 390, 'right')

    doc.setFont(undefined, 'bold')

    let DetailsOfRupeesStyle = {

        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Rupees: ', x, y)
            }
        },

        margin: {
            top: 0, left: 30,
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
            textColor: "black",
            cellPadding: 1,
            fontSize: 8,
            lineColor: "black"
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 310,
                halign: 'lfet',
            }

        },
        tableLineColor: "black",
        startY: 308,

    };

    doc.autoTable(table.Ruppescolumn, table.RupeesRow(data), DetailsOfRupeesStyle,);


    let DetailsOfBankStyle = {
        didParseCell: (data1) => {
            if (data.BankData.length > 0) {
                let BankData = data.BankData[0]
                if (data1.row.cells[0].raw === `Bank Name :${BankData.BankName}`) {
                    data1.row.cells[0].colSpan = 3
                }
            }
        },


        margin: {
            top: 0, left: 30, right: 35,
        },
        showHead: 'always',
        theme: (data.BankData.length > 0) ? 'grid' : 'plain',
        headerStyles: { cellPadding: 1, },
        styles: {
            overflow: 'linebreak',
            fontSize: 8.5,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: "black",
            cellPadding: 2,
            fontSize: 7,
            lineColor: "black"
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: (data.BankData.length > 0) ? 90 : 30,
                halign: 'lfet',
            },
            1: {
                valign: "top",
                columnWidth: (data.BankData.length > 0) ? 90 : 300,
                halign: 'lfet',


            },
            2: {
                valign: "top",
                columnWidth: 130,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: doc.previousAutoTable.finalY,

    };
    doc.autoTable(table.Bankcolumn, table.BankRow(data, doc), DetailsOfBankStyle,);

    doc.setFontSize(8)
    doc.setFont(undefined, 'Normal')

    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be
 of the nature and quantity which it/these purports to be `, 34, doc.previousAutoTable.finalY + (9),)
    doc.line(340, doc.previousAutoTable.finalY + (21), 30, doc.previousAutoTable.finalY + (21)); //horizontal line (1)

    doc.text(`Signature `, 280, 387,)
    doc.text(`Prepared by :${data.PartyName} `, 35, 387,)
}



export const tableBody = (doc, data) => {

    var options = {

        didParseCell: (data1) => {

            if (data1.row.cells[9].raw === "isaddition") {
                data1.row.cells[1].colSpan = 5
                data1.row.cells[8].colSpan = 2
                data1.row.cells[10].colSpan = 2

                data1.row.cells[1].styles.halign = "right"    // Alignment for  cgst and Total in spanrow

                data1.row.cells[1].styles.fontSize = 7
                data1.row.cells[8].styles.fontSize = 7
                data1.row.cells[7].styles.fontSize = 7
                data1.row.cells[10].styles.fontSize = 7
                data1.row.cells[12].styles.fontSize = 7

                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[8].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
                data1.row.cells[10].styles.fontStyle = "bold"
                data1.row.cells[12].styles.fontStyle = "bold"
            }

            if (data1.row.cells[1].raw === "HSN Item Name") {
                let TotalBox = 0;
                data.InvoiceItems.forEach((element, key) => {
                    if (element.PrimaryUnitName === "Box") {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })
                if (TotalBox === 0) {
                    data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})`
                } else {
                    data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})  (${TotalBox} Box)`
                }
                data1.row.cells[8].colSpan = 2
                data1.row.cells[10].colSpan = 2
            }
            if (data1.row.cells[1].raw === "Batch") {
                data1.row.cells[0].colSpan = 13

            }
        },
        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 8) {
                if (data1.row.cells[8].raw === "          CGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2; // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 5, startY1vertical, startXVertical - 5, endYvertical); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }
            if (rowIdx === 0 && colIdx === 10) {
                if (data1.row.cells[10].raw === "          SGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2; // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 5, startY1vertical, startXVertical - 5, endYvertical); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }

        },
        margin: {
            left: 30, right: 25, top: 56
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 1,
            lineWidth: 0.3,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 7,
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
                fontSize: 6,
                columnWidth: 15,
            },
            1: {
                valign: "top",
                columnWidth: 135,
            },
            2: {
                columnWidth: 52,
                halign: 'right',
            },
            3: {
                columnWidth: 28,
                halign: 'right',
            },
            4: {
                columnWidth: 33,
                halign: 'right',
            },
            5: {
                columnWidth: 35,
                halign: 'right',
            },
            6: {
                columnWidth: 35,
                halign: 'right',
            },

            7: {
                columnWidth: 45,
                halign: 'right',
            },
            8: {
                columnWidth: 24,
                halign: 'right',
            },
            9: {
                columnWidth: 34,
                halign: 'right',
            },
            10: {
                columnWidth: 24,
                halign: 'right',
            },
            11: {
                columnWidth: 34,
                halign: 'right',

            },
            12: {
                columnWidth: 46,
                halign: 'right',
            },

        },
        tableLineColor: "black",
        startY: initial_y,

    };
    doc.setLineWidth(0.5);
    ////  lines when report  header line when table cordinates
    doc.line(408, initial_y, 408, 16);//vertical right 1
    doc.line(220, initial_y, 220, 45);//vertical line between billby billto
    doc.line(570, initial_y, 30, initial_y) //horizontal line 1 billby upper



    doc.autoTable(table.columnsWithCGST_SGST, table.RowsWithCGST_SGST(data), options,);

    const Buttom_Hidden_Table_To_Avoid_FooterOverlap = {
        margin: {
            left: 30, right: 30, bottom: 110
        },
    };

    doc.autoTable(Buttom_Hidden_Table_To_Avoid_FooterOverlap);
}
////  lines when report  header line when table cordinates

export const tableBodyWithIGST = (doc, data) => {
    var options = {

        didParseCell: (data1) => {

            if (data1.row.cells[9].raw === "isaddition") {
                data1.row.cells[1].colSpan = 5
                // data1.row.cells[3].colSpan = 5
                data1.row.cells[8].colSpan = 2
                // data1.row.cells[10].colSpan = 2

                data1.row.cells[1].styles.fontSize = 7
                data1.row.cells[1].styles.halign = "right"    // Alignment for  cgst and Total in spanrow

                data1.row.cells[8].styles.fontSize = 7
                data1.row.cells[7].styles.fontSize = 7
                data1.row.cells[10].styles.fontSize = 7
                // data1.row.cells[12].styles.fontSize = 7
                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[8].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
                data1.row.cells[10].styles.fontStyle = "bold"
                // data1.row.cells[12].styles.fontStyle = "bold"
            }

            if (data1.row.cells[1].raw === "HSN Item Name") {

                let TotalBox = 0;
                data.InvoiceItems.forEach((element, key) => {
                    if (element.PrimaryUnitName === "Box") {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })
                if (TotalBox === 0) {
                    data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})`
                } else {
                    data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})  (${TotalBox} Box)`
                }


                data1.row.cells[8].colSpan = 2

            }

            if (data1.row.cells[1].raw === "Batch") {
                data1.row.cells[0].colSpan = 12

            }
        },

        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 8) {
                if (data1.row.cells[8].raw === "          IGST           %         Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2; // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 4, startY1vertical, startXVertical - 4, endYvertical); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }

        },

        margin: {
            left: 30, right: 25, top: 55
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 1,
            lineWidth: 0.3,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: [0, 0, 0], //Black     
            fontSize: 7,
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
                fontSize: 6,
                columnWidth: 15,
            },
            1: {
                valign: "top",
                columnWidth: 175,
            },
            2: {
                columnWidth: 50,
                halign: 'right',
            },
            3: {
                columnWidth: 28,
                halign: 'right',
            },
            4: {
                columnWidth: 33,
                halign: 'right',
            },
            5: {
                columnWidth: 35,
                halign: 'right',
            },
            6: {
                columnWidth: 42,
                halign: 'right',
            },

            7: {
                columnWidth: 50,
                halign: 'right',
            },
            8: {
                columnWidth: 26,
                halign: 'right',
            },
            9: {
                columnWidth: 34,
                halign: 'right',

            },
            10: {
                columnWidth: 52,
                halign: 'right',
            },

        },
        tableLineColor: "black",
        startY: initial_y,
    };
    doc.setLineWidth(0.5)
    doc.line(408, initial_y, 408, 16);//vertical right 1
    doc.line(220, initial_y, 220, 45);//vertical line between billby billto
    doc.line(570, initial_y, 30, initial_y) //horizontal line 1 billby upper
    doc.autoTable(table.columnsWithIGST, table.RowsWithIGST(data), options,);
    const Buttom_Hidden_Table_To_Avoid_FooterOverlap = {
        margin: {
            left: 30, right: 30, bottom: 110
        },
    };

    doc.autoTable(Buttom_Hidden_Table_To_Avoid_FooterOverlap);
}



export const pageFooter = (doc, data) => {
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)

    if (!data.isMultiPrint) {
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            pageHeder(doc, data)
            pageBorder(doc)
            reportHeder3(doc, data)

            doc.text('Page' + String(pageCount) + ' of ' + String(i), 532, 403,)
            doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 403,)
        }

    } else {
        pageBorder(doc)
        pageHeder(doc, data)
        reportHeder3(doc, data)

    }
}
