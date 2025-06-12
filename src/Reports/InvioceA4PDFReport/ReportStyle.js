
import { CurrentTime, IsSweetAndSnacksCompany, compareGSTINState, currentDate_dmy, date_dmy_func, loginUserAdminRole, loginUserIsFranchisesRole } from "../../components/Common/CommonFunction";
import { numberWithCommas } from "../Report_common_function";
import cbm_logo from "../../assets/images/cbm_logo.png"

import * as table from './TableData'

let initial_y = 0

const isSweetAndSnacksCompany = IsSweetAndSnacksCompany()

export const pageBorder = (doc) => {

    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 815, 30, 16);//vertical line (left)
    doc.line(570, 815, 570, 16);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {

    doc.setDrawColor(0, 0, 0);
    doc.line(408, 63, 408, 16);//vertical right 1
    doc.line(570, data.isQR ? 103 : 63, 30, data.isQR ? 103 : 63)  //horizontal line 1 billby upper for repeat header
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')

    doc.setFontSize(18)
    if (data.isQR) {
        doc.text('TAX INVOICE', 160, 55,)

    } else {
        doc.text('TAX INVOICE', 200, 45,)
    }
    doc.setFontSize(9)
    doc.text('Original For Buyer', 320, 26,)


}

export const reportHeder1 = (doc, data) => {

    if (isSweetAndSnacksCompany) {
        doc.addImage(cbm_logo, 'PNG', 33, 17, 80, 46, null, 'FAST')
    } else {

        doc.addImage(cbm_logo, 'PNG', 33, 1, 95, 80, null, 'FAST')
    }

    // doc.addImage(cbm_logo, 'PNG', 33, 1, 95, 80, null, 'FAST')


    let Y1 = 0
    if (data.isQR) {
        Y1 = 115;
    } else {
        Y1 = 75;
    }

    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 80, Y1)  //bill by 
    doc.text('Billed to', 280, Y1) //billed to
    doc.text('Details of Transport', 440, Y1)

    doc.setDrawColor(0, 0, 0);
    doc.line(570, data.isQR ? 103 : 63, 30, data.isQR ? 103 : 63) //horizontal line 1 billby upper
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, data.isQR ? 120 : 80, 30, data.isQR ? 120 : 80);//horizontal line 3

    var BilledByStyle = {
        didDrawCell: (data1) => {

            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Party: ', x, y)
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
                doc.text('State: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN: ', x, y)
            };
            if (rowIdx === 4 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };
            if (rowIdx === 5 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
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

        startY: data.isQR ? 120 : 80
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
                doc.text('Customer: ', x, y)
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
                doc.text('State: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('GSTIN: ', x, y)
            };
            if (rowIdx === 4 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('FSSAI No: ', x, y)
            };
            if (rowIdx === 5 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
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
        startY: data.isQR ? 120 : 80,
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
                doc.text('PO No: ', x, y)
            };
            if (rowIdx === 1 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Driver Name: ', x, y)
            };
            if (rowIdx === 2 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('Vehicle No: ', x, y)
            };
            if (rowIdx === 3 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('E-way Bill: ', x, y)
            };
            if (rowIdx === 4 && colIdx === 0) {

                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 9
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                doc.text('ACK No: ', x, y)
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

        startY: data.isQR ? 120 : 80,

    };

    const priLength = () => {
        let final_y = doc.previousAutoTable.finalY
        if (final_y > initial_y) {
            initial_y = final_y
        }

    }

    let IRNNumberDetails = {
        margin: {
            top: 45, left: 408, right: 35,
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

        startY: 50,

    };
    if (data.isQR) {
        doc.autoTable(table.INR_NO, table.IRNNumberRow(data), IRNNumberDetails);
    }

    doc.autoTable(table.BilledBy, table.BilledByRow(data), BilledByStyle);
    priLength()

    doc.autoTable(table.BilledTo, table.BilledToRow(data), BilledToStyle);
    priLength()

    doc.autoTable(table.DetailsOfTransport, table.DetailsOfTransportRow(data), DetailsOfTransportStyle);
    priLength()
}


export const reportHeder2 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')

}

export const reportHeder3 = (doc, data) => {
    var date = date_dmy_func(data.InvoiceDate)
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.line(570, 33, 408, 33) //horizontal line 1 billby upper

    doc.setFont(undefined, 'bold')
    doc.text(`Invoice No:   ${data.FullInvoiceNumber}`, 415, 27) //Invoice Id
    doc.text(`Invoice Date: ${date}`, 415, 43) //Invoice date



}
// original

export const reportFooter = (doc, data) => {

    if (data.SettingData.Qr_Image === null) {
    } else {
        doc.addImage(data.SettingData.Qr_Image, 'JPEG', 337, 728, 100, 86, null, 'FAST');
    }
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 710, 30, 710);//horizontal line Footer 1
    doc.line(435, 710, 435, 815);//vertical right Sub Total
    doc.line(340, 710, 340, 815);//vertical right Qr Code (1)
    doc.setFont('Tahoma')

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
    doc.setFontSize(9)



    const isIGST = compareGSTINState(data.CustomerGSTIN, data.PartyGSTIN)
    if ((isIGST || data.isAmerica)) {

        doc.text(`Total Basic:`, 440, 730,)
        doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 567, 730, 'right')

        doc.text(`Total Disc:`, 440, 740,)
        doc.text(` ${numberWithCommas(Number(TotalDiscount).toFixed(2))}`, 567, 740, 'right')

        doc.text(`Total IGST:`, 440, 750,)
        doc.text(`${numberWithCommas(Number(totalICGST).toFixed(2))}`, 567, 750, 'right')

        doc.text(`Total GST:`, 440, 760,)
        doc.text(` ${numberWithCommas(Number(totalICGST).toFixed(2))}`, 567, 760, 'right')

        // doc.text(`Round Off:`, 440, 788,)
        // doc.text(` ${numberWithCommas(Number(data.RoundOffAmount).toFixed(2))}`, 567, 788, 'right')

        // doc.text(`TCS Amount:`, 440, 798,)
        // doc.text(` ${numberWithCommas(Number(data.TCSAmount).toFixed(2))}`, 567, 798, 'right')



    } else {

        doc.text(`Total Basic:`, 440, 720,)
        doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 567, 720, 'right')

        doc.text(`Total Disc:`, 440, 730,)
        doc.text(` ${numberWithCommas(Number(TotalDiscount).toFixed(2))}`, 567, 730, 'right')

        doc.text(`Total CGST:`, 440, 740)
        doc.text(`${numberWithCommas(Number(totalCGST).toFixed(2))}`, 567, 740, 'right')

        doc.text(`Total SGST:`, 440, 750,)
        doc.text(`${numberWithCommas(Number(totalSGST).toFixed(2))}`, 567, 750, 'right')

        doc.text(`Total GST:`, 440, 760,)
        doc.text(` ${numberWithCommas(Number(TotalGST).toFixed(2))}`, 567, 760, 'right')

        // doc.text(`Round Off:`, 440, 788,)
        // doc.text(` ${numberWithCommas(Number(data.RoundOffAmount).toFixed(2))}`, 567, 788, 'right')

        // doc.text(`TCS Amount:`, 440, 798,)
        // doc.text(` ${numberWithCommas(Number(data.TCSAmount).toFixed(2))}`, 567, 798, 'right')
    }


    if (!data.isAmerica) {
        const advanceAmount = isNaN(Number(data?.AdvanceAmount)) ? 0 : Number(data?.AdvanceAmount);
        doc.text(`Round Off:`, 440, 770,)
        doc.text(` ${numberWithCommas(Number(data.RoundOffAmount).toFixed(2))}`, 567, 770, 'right')

        doc.text(`TCS Amount:`, 440, 780,)
        doc.text(` ${numberWithCommas(Number(data.TCSAmount).toFixed(2))}`, 567, 780, 'right')
        if (loginUserIsFranchisesRole()) {
            doc.text(`Advance Amount :`, 440, 790,)
            doc.text(` ${numberWithCommas(Number(advanceAmount).toFixed(2))}`, 567, 790, 'right')
            doc.text(`Net Payable :`, 440, 800,)
            doc.text(`${numberWithCommas((Number(data.GrandTotal) - (Number(advanceAmount))).toFixed(2))}`, 567, 800, 'right')
        }
    }



    let DetailsOfCurrencyStyle = {

        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 0) {
                let x = data1.cursor.x + 2
                let y = data1.cursor.y + 8
                doc.setFontSize(8)
                doc.setFont(undefined, 'bold')
                if (data.isAmerica) {
                    doc.text('Dollars: ', x, y)
                } else {
                    doc.text('Rupees: ', x, y)
                }
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
        startY: 710,

    };

    doc.autoTable(table.Currencycolumn, table.CurrencyRow(data), DetailsOfCurrencyStyle,);

    var DetailsOfBankStyle = {
        didParseCell: (data1) => {
            if (data.BankData?.length > 0) {
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
        theme: 'grid',
        headerStyles: { cellPadding: 1, },
        styles: {
            overflow: 'linebreak',
            fontSize: 7,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 8,
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: (data.BankData?.length > 0) ? 90 : 30,
                halign: 'lfet',
            },
            1: {
                valign: "top",
                columnWidth: (data.BankData?.length > 0) ? 90 : 300,
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

    doc.autoTable(table.Bankcolumn, table.BankRow(data), DetailsOfBankStyle,);

    doc.setFontSize(9)
    doc.setFont(undefined, 'Normal')

    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be
 of the nature and quantity which it/these purports to be `, 34, doc.previousAutoTable.finalY + (9),)
    doc.line(340, doc.previousAutoTable.finalY + (24), 30, doc.previousAutoTable.finalY + (24)); //horizontal line (1)

    doc.text(`Signature `, 280, 810,)
    doc.text(`Prepared by :${data.PartyName} `, 35, 810,)


    doc.setFont(undefined, 'Normal')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`Total Amount :`, 440, 812,)
    const GrandTotal = Number(data.GrandTotal)

    const Total = numberWithCommas((GrandTotal).toFixed(2))
    doc.text(`${Total}`, 567, 812, 'right')

}

export const tableBody = (doc, data) => {
    var options = {
        didParseCell: (data1) => {
            if (data1.row.cells[9].raw === "isaddition") {
                data1.row.cells[1].colSpan = 5
                // data1.row.cells[3].colSpan = 5
                data1.row.cells[8].colSpan = 2
                data1.row.cells[10].colSpan = 2

                data1.row.cells[1].styles.fontSize = 7
                data1.row.cells[1].styles.halign = "right"    // Alignment for  cgst and Total in spanrow

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
                const unit = isSweetAndSnacksCompany ? "Tray" : "Box"
                data.InvoiceItems.forEach((element, key) => {
                    if (element.PrimaryUnitName === unit) {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })
                if (TotalBox === 0) {
                    data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})`
                } else {
                    data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})  (${TotalBox} ${unit})`
                }

                data1.row.cells[8].colSpan = 2
                data1.row.cells[10].colSpan = 2
            }
            if (data1.row.cells[1].raw === "Batch") {
                data1.row.cells[0].colSpan = 12

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

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 5, startY1vertical + 1, startXVertical - 5, endYvertical + 1);  // Draw a vertical line
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

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 5, startY1vertical + 1, startXVertical - 5, endYvertical + 1); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }

        },
        margin: {
            left: 30, right: 25, top: 63,
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 2,
            lineWidth: 0.3,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: "black", //Black     
            fontSize: 7,
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
                fontSize: 6,
                columnWidth: 15,
            },
            1: {
                valign: "top",
                columnWidth: 137,
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

    doc.line(408, data.isQR ? initial_y : initial_y, 408, 16);//vertical line header section billby 
    doc.line(220, data.isQR ? initial_y : initial_y, 220, data.isQR ? 103 : 63);//vertical  line header section billto

    doc.autoTable(table.columns, table.Rows(data), options,);
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 140
        },
    };
    doc.autoTable(optionsTable4);

}

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
                const unit = isSweetAndSnacksCompany ? "Tray" : "Box"

                data.InvoiceItems.forEach((element, key) => {
                    if (element.PrimaryUnitName === unit) {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})  (${TotalBox} ${unit})`
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
                if (data1.row.cells[8].raw === "          IGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 3, startY1vertical, startXVertical - 3, endYvertical);  // Draw a vertical line
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
                columnWidth: 28,
                halign: 'right',
            },
            9: {
                columnWidth: 34,
                halign: 'right',

            },
            10: {
                columnWidth: 50,
                halign: 'right',
            },

        },
        tableLineColor: "black",
        startY: initial_y,
    };
    doc.line(408, data.isQR ? initial_y : initial_y, 408, 16);//vertical line header section billby 
    doc.line(220, data.isQR ? initial_y : initial_y, 220, data.isQR ? 103 : 63);//vertical  line header section billto

    doc.autoTable(table.columnsWithIGST, table.RowsWithIGST(data), options,);
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 110
        },
    };

    doc.autoTable(optionsTable4);
}




export const tableBodyWith_CGST_SGST_forSweetAndSnacks = (doc, data) => {
    var options = {
        didParseCell: (data1) => {
            if (data1.row.cells[6].raw === "isaddition") {
                data1.row.cells[1].colSpan = 4
                // data1.row.cells[3].colSpan = 5
                data1.row.cells[5].colSpan = 2
                data1.row.cells[7].colSpan = 2

                data1.row.cells[1].styles.fontSize = 7
                data1.row.cells[1].styles.halign = "right"    // Alignment for  cgst and Total in spanrow

                data1.row.cells[8].styles.fontSize = 7
                data1.row.cells[7].styles.fontSize = 7
                data1.row.cells[9].styles.fontSize = 7
                data1.row.cells[9].styles.fontSize = 7
                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[8].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
                data1.row.cells[9].styles.fontStyle = "bold"
                data1.row.cells[9].styles.fontStyle = "bold"
            }


            if (data1.row.cells[1].raw === "HSN Item Name") {

                let TotalBox = 0;
                const unit = isSweetAndSnacksCompany ? "Tray" : "Box"
                data.InvoiceItems.forEach((element, key) => {
                    if (element.PrimaryUnitName === unit) {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })
                if (TotalBox === 0) {
                    data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})`
                } else {
                    data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})  (${TotalBox} ${unit})`
                }

                data1.row.cells[5].colSpan = 2
                data1.row.cells[7].colSpan = 2
            }
            if (data1.row.cells[1].raw === "Batch") {
                data1.row.cells[0].colSpan = 9

            }
        },

        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 5) {
                if (data1.row.cells[5].raw === "          CGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 5, startY1vertical + 1, startXVertical - 5, endYvertical + 1);  // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }
            if (rowIdx === 0 && colIdx === 7) {
                if (data1.row.cells[7].raw === "          SGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 5, startY1vertical + 1, startXVertical - 5, endYvertical + 1); // Draw a vertical line
                    doc.line(startX, startY, endX, endY);
                }
            }

        },
        margin: {
            left: 30, right: 25, top: 63,
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 2,
            lineWidth: 0.3,
            valign: 'top',
            fontStyle: 'bold',
            halign: 'center',    //'center' or 'right'
            fillColor: "white",
            textColor: "black", //Black     
            fontSize: 7,
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
                fontSize: 6,
                columnWidth: 15,
            },
            1: {
                valign: "top",
                columnWidth: 170,
            },
            2: {
                columnWidth: 70,
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
                columnWidth: 24,
                halign: 'right',
            },
            6: {
                columnWidth: 34,
                halign: 'right',
            },
            7: {
                columnWidth: 24,
                halign: 'right',
            },
            8: {
                columnWidth: 34,
                halign: 'right',
            },
            9: {
                columnWidth: 69,
                halign: 'right',
            },

        },
        tableLineColor: "black",
        startY: initial_y,
    };

    doc.line(408, data.isQR ? initial_y : initial_y, 408, 16);//vertical line header section billby 
    doc.line(220, data.isQR ? initial_y : initial_y, 220, data.isQR ? 103 : 63);//vertical  line header section billto


    const indicesToRemove = [3, 5, 6]; // the column indices to remove

    const Rows = table.Rows(data).map(row =>
        row.filter((_, index) => !indicesToRemove.includes(index))
    );


    const columns = table.columns.filter((_, index) => !indicesToRemove.includes(index))

    debugger
    doc.autoTable(columns, Rows, options,);
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 140
        },
    };
    doc.autoTable(optionsTable4);

}

export const tableBodyWith_IGST_forSweetAndSnacks = (doc, data) => {
    var options = {

        didParseCell: (data1) => {

            if (data1.row.cells[6].raw === "isaddition") {
                data1.row.cells[1].colSpan = 4
                // data1.row.cells[3].colSpan = 5
                data1.row.cells[5].colSpan = 2
                // data1.row.cells[10].colSpan = 2

                data1.row.cells[1].styles.fontSize = 7
                data1.row.cells[1].styles.halign = "right"    // Alignment for  cgst and Total in spanrow

                data1.row.cells[5].styles.fontSize = 7
                data1.row.cells[7].styles.fontSize = 7

                // data1.row.cells[12].styles.fontSize = 7
                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[5].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"

                // data1.row.cells[12].styles.fontStyle = "bold"
            }

            if (data1.row.cells[1].raw === "HSN Item Name") {
                let TotalBox = 0;
                const unit = isSweetAndSnacksCompany ? "Tray" : "Box"

                data.InvoiceItems.forEach((element, key) => {
                    if (element.PrimaryUnitName === unit) {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})  (${TotalBox} ${unit})`
                data1.row.cells[5].colSpan = 2
            }

            if (data1.row.cells[1].raw === "Batch") {
                data1.row.cells[0].colSpan = 7

            }
        },


        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 5) {
                if (data1.row.cells[5].raw === "          IGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 3, startY1vertical, startXVertical - 3, endYvertical);  // Draw a vertical line
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
                columnWidth: 80,
                halign: 'right',
            },
            3: {
                columnWidth: 48,
                halign: 'right',
            },
            4: {
                columnWidth: 60,
                halign: 'right',
            },
            5: {
                columnWidth: 28,
                halign: 'right',
            },
            6: {
                columnWidth: 34,
                halign: 'right',
            },

            7: {
                columnWidth: 100,
                halign: 'right',
            },


        },
        tableLineColor: "black",
        startY: initial_y,
    };
    doc.line(408, data.isQR ? initial_y : initial_y, 408, 16);//vertical line header section billby 
    doc.line(220, data.isQR ? initial_y : initial_y, 220, data.isQR ? 103 : 63);//vertical  line header section billto

    // doc.autoTable(table.columnsWithIGST, table.RowsWithIGST(data), options,);
    const indicesToRemove = [3, 5, 6]; // the column indices to remove

    const Rows = table.RowsWithIGST(data).map(row =>
        row.filter((_, index) => !indicesToRemove.includes(index))
    );
    const columns = table.columnsWithIGST.filter((_, index) => !indicesToRemove.includes(index))
    doc.autoTable(columns, Rows, options,);


    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 110
        },
    };

    doc.autoTable(optionsTable4);
}














export const tableBodyForAmericanInvoice = (doc, data) => {
    var options = {

        didParseCell: (data1) => {

            if (data1.row.cells[8].raw === "isaddition") {
                data1.row.cells[1].colSpan = 5
                // data1.row.cells[3].colSpan = 5
                data1.row.cells[7].colSpan = 2
                // data1.row.cells[10].colSpan = 2

                data1.row.cells[1].styles.fontSize = 7
                data1.row.cells[1].styles.halign = "right"    // Alignment for  cgst and Total in spanrow

                data1.row.cells[7].styles.fontSize = 7
                data1.row.cells[6].styles.fontSize = 7
                data1.row.cells[9].styles.fontSize = 7
                // data1.row.cells[12].styles.fontSize = 7
                data1.row.cells[1].styles.fontStyle = "bold"
                data1.row.cells[7].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
                data1.row.cells[9].styles.fontStyle = "bold"
                // data1.row.cells[12].styles.fontStyle = "bold"
            }

            if (data1.row.cells[1].raw === "HSN Item Name") {
                let TotalBox = 0;
                const unit = isSweetAndSnacksCompany ? "Tray" : "Box"

                data.InvoiceItems.forEach((element, key) => {
                    if (element.PrimaryUnitName === unit) {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[1].text[0] = ` HSN Item Name (${data.TotalItemlength})  (${TotalBox} ${unit})`
                data1.row.cells[7].colSpan = 2
            }

            if (data1.row.cells[1].raw === "Batch") {
                data1.row.cells[0].colSpan = 12

            }
        },


        didDrawCell: (data1) => {
            const rowIdx = data1.row.index;
            const colIdx = data1.column.index;
            if (rowIdx === 0 && colIdx === 7) {
                if (data1.row.cells[7].raw === "          IGST           %        Amount") {

                    const cellWidth = data1.cell.width;
                    const cellHeight = data1.cell.height;
                    const startX = data1.cell.x;
                    const startY = data1.cell.y + cellHeight / 2;
                    const endX = startX + cellWidth;
                    const endY = startY;

                    const startXVertical = data1.cell.x + cellWidth / 2;  // X-coordinate at the middle of the cell
                    const startY1vertical = data1.cell.y + 9;
                    const endYvertical = startY + cellHeight;

                    doc.line(startXVertical - 3, startY1vertical, startXVertical - 3, endYvertical);  // Draw a vertical line
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
                columnWidth: 33,
                halign: 'right',
            },
            4: {
                columnWidth: 35,
                halign: 'right',
            },
            5: {
                columnWidth: 42,
                halign: 'right',
            },

            6: {
                columnWidth: 50,
                halign: 'right',
            },
            7: {
                columnWidth: 28,
                halign: 'right',
            },
            8: {
                columnWidth: 34,
                halign: 'right',

            },
            9: {
                columnWidth: 78,
                halign: 'right',
            },

        },
        tableLineColor: "black",
        startY: initial_y,
    };
    doc.line(408, data.isQR ? initial_y : initial_y, 408, 16);//vertical line header section billby 
    doc.line(220, data.isQR ? initial_y : initial_y, 220, data.isQR ? 103 : 63);//vertical  line header section billto

    doc.autoTable(table.columnsForAmerica, table.RowsForAmericaInvoice(data), options,);
    const optionsTable4 = {
        margin: {
            left: 30, right: 30, bottom: 110
        },
    };

    doc.autoTable(optionsTable4);
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
        doc.setFont('helvetica', 'Normal')
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), 520, 828,)

        doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 828,)
    }
}

// original