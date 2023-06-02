
import cbm_logo from "../../assets/images/cbm_logo.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import { date_dmy_func } from "../../components/Common/CommonFunction";
import { invoice } from "../ReportIndex";
import { numberWithCommas, toWords } from "../Report_common_function";
import * as table from './TableData'
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
    doc.setDrawColor(0, 0, 0);
    doc.line(408, 63, 408, 16);//vertical right 1
    doc.line(570, 63, 30, 63)  //horizontal line 1 billby upper for repeat header
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    if (data.ReportType === invoice) {
        doc.setFontSize(18)
        doc.text('TAX INVOICE', 200, 45,)
    } else {
        doc.setFontSize(15)
        doc.text('INTER BRANCH INVOICE', 200, 40,)
    }
    //Tax invoice Header
}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 80, 75)  //bill by 
    doc.text('Billed to', 280, 75) //billed to
    doc.text('Details of Transport', 440, 75)


    doc.setDrawColor(0, 0, 0);
    doc.line(570, 63, 30, 63) //horizontal line 1 billby upper
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3
    // doc.line(409, 95, 30, 95)//horizontal line 4
    doc.line(30, 789, 30, 16);//vertical left 1
    doc.line(570, 789, 570, 16);//vertical left 2
    doc.line(408, 160, 408, 16);//vertical right 1
    doc.line(220, 160, 220, 63);//vertical right 2

    // var options3 = {
    //     margin: {
    //         top: 45, left: 35, right: 35,// bottom:100 
    //     },
    //     showHead: 'always',
    //     theme: "plain",
    //     styles: {
    //         overflow: 'linebreak',
    //         fontSize: 8,
    //         height: 0,
    //     },
    //     bodyStyles: {
    //         columnWidth: 'wrap',
    //         textColor: [30, 30, 30],
    //         cellPadding: 2,
    //         fontSize: 8,
    //         fontStyle: 'bold',
    //         lineColor: [0, 0, 0]
    //     },
    //     columnStyles: {
    //         0: {
    //             valign: "top",
    //             columnWidth: 185,
    //             halign: 'lfet',
    //         },
    //         1: {
    //             columnWidth: 190,
    //             halign: 'left',
    //         },
    //         2: {
    //             columnWidth: 160,
    //             halign: 'left',
    //         },

    //     },
    //     tableLineColor: "black",
    //     startY: 85

    // };
    // doc.autoTable(table.PageHedercolumns, table.ReportHederRows(data), options3);

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
    //     doc.text(`GSTIN:${data.PartyGSTIN}`, 38, 90)
    //     doc.text(`GSTIN:${data.CustomerGSTIN}`, 238, 90)
}

export const reportHeder3 = (doc, data) => {
    var date = date_dmy_func(data.InvoiceDate)
    if (data.ReportType === invoice) {
        doc.setFont('Tahoma')
        doc.setFontSize(10)
        doc.line(570, 40, 408, 40) //horizontal line 1 billby upper
        doc.setFont(undefined, 'bold')
        doc.text(`Invoice No:   ${data.InvoiceNumber}`, 415, 30) //Invoice Id
        doc.text(`Invoice Date: ${date}`, 415, 54) //Invoice date
    } else {
        doc.setFont('Tahoma')
        doc.setFontSize(10)
        doc.line(570, 35, 408, 35) //horizontal line 1 billby upper
        doc.setFont(undefined, 'bold')
        doc.text(`IB Invoice No:   ${data.InvoiceNumber}`, 415, 30) //Invoice Id
        doc.text(`IB Invoice Date: ${date}`, 415, 50) //Invoice date
    }

}
// original

export const reportFooter = (doc, data) => {

    //  If Footer With Signiture

    // let stringNumber = toWords(Number(data.GrandTotal))
    //     doc.addImage(upi_qr_code, 'PNG', 470, 750, 80, 60)
    //     doc.setDrawColor(0, 0, 0);
    //     doc.line(570, 745, 30, 745);//horizontal line Footer 2
    //     doc.line(570, 680, 30, 680);//horizontal line Footer 3
    //     doc.line(430, 700, 30, 700);//horizontal line Footer 3 Ruppe section
    //     doc.line(460, 745, 460, 815);//vertical right1 Qr Left 1
    //     doc.line(430, 680, 430, 745);//vertical right1 Sub Total
    //     doc.setFont('Tahoma')
    //     doc.line(460, 775, 30, 775);//horizontal line (Bottom)

    //     const a = data.InvoiceItems.map((data) => ({
    //         CGST: Number(data.CGST),
    //         SGST: Number(data.SGST),
    //         BasicAmount: Number(data.BasicAmount),
    //     }));
    //     var totalCGST = 0;
    //     var totalSGST = 0;
    //     var TotalBasicAmount = 0;
    //     a.forEach(arg => {
    //         totalCGST += arg.CGST;
    //         totalSGST += arg.SGST;
    //         TotalBasicAmount += arg.BasicAmount
    //     });

    //     const TotalGST = totalCGST + totalSGST;

    //     doc.setFontSize(8)

    //     doc.text(`CGST:`, 434, 689,)
    //     doc.text(`${totalCGST.toFixed(2)}`, 560, 689, 'right')

    //     doc.text(`SGST:`, 434, 700,)
    //     doc.text(`${totalSGST.toFixed(2)}`, 560, 700, 'right')

    //     doc.text(`TotalGST:`, 434, 712,)
    //     doc.text(` ${TotalGST.toFixed(2)}`, 560, 712, 'right')

    //     doc.text(`BasicAmount:`, 434, 724,)
    //     doc.text(`${TotalBasicAmount.toFixed(2)}`, 560, 724, 'right')

    //     doc.setFont(undefined, 'Normal')
    //     doc.setFontSize(12)
    //     doc.setFont(undefined, 'bold')
    //     doc.text(`Amount :`, 434, 740,)
    //     doc.text(`${data.GrandTotal}`, 560, 740, 'right')
    //     doc.setFont(undefined, 'Normal')
    //     doc.setFont('Tahoma')
    //     doc.setFontSize(9)
    //     doc.setFont('Tahoma')
    //     doc.setFontSize(8)
    //     doc.text(`Prepared by `, 35, 785,)
    //     doc.text(`Received By `, 180, 785,)
    //     doc.setFontSize(10)
    //     doc.text(`${data.PartyName} `, 390, 785,)
    //     doc.setFontSize(10)
    //     doc.text(`${data.CustomerName} `, 140, 811,)
    //     doc.setFontSize(9)
    //     doc.text(`Signature `, 400, 811,)
    //     doc.setFont("Arimo");
    //     doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be of the nature and
    //    quantity whitch it/these purports to be `, 34, 760,)
    //     doc.text(`A/C No: 2715500356 IFSC Code:BKID00015422 `, 34, 710,)
    //     doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 725,)
    //     doc.text(`Ruppe:${stringNumber} `, 33, 693,)


    //  Without Signature

    let stringNumber = toWords(Number(data.GrandTotal))
    doc.addImage(upi_qr_code, 'PNG', 359, 747, 75, 65)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 730, 30, 730);//horizontal line Footer 1
    doc.line(435, 745, 30, 745);//horizontal line Footer 2
    doc.line(360, 775, 30, 775);//horizontal line Footer 3
    doc.line(435, 730, 435, 815);//vertical right Sub Total
    doc.line(360, 745, 360, 815);//vertical right Qr Code 
    doc.setFont('Tahoma')

    const a = data.InvoiceItems.map((data) => ({
        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        BasicAmount: Number(data.BasicAmount),
    }));
    var totalCGST = 0;
    var totalSGST = 0;
    var TotalBasicAmount = 0;
    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalBasicAmount += arg.BasicAmount

    });

    const TotalGST = totalCGST + totalSGST;

    doc.setFontSize(8)

    doc.text(`CGST:`, 440, 752,)
    doc.text(`${totalCGST.toFixed(2)}`, 560, 752, 'right')

    doc.text(`SGST:`, 440, 764,)
    doc.text(`${totalSGST.toFixed(2)}`, 560, 764, 'right')

    doc.text(`TotalGST:`, 440, 776,)
    doc.text(` ${TotalGST.toFixed(2)}`, 560, 776, 'right')

    doc.text(`BasicAmount:`, 440, 788,)
    doc.text(`${TotalBasicAmount.toFixed(2)}`, 560, 788, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Amount :`, 440, 803,)
    const GrandTotal = Math.round(data.GrandTotal)
    const Total = numberWithCommas((GrandTotal).toFixed(2))
    doc.text(`${Total}`, 560, 803, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be
         of the nature and quantity which it/these purports to be `, 34, 790,)
    doc.text(`A/C No: 2715500354564564564564565456456 IFSC Code:BKID00015422 `, 34, 755,)
    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 765,)
    doc.setFont(undefined, 'bold')
    doc.text(`Rupees:`, 33, 740,)
    doc.addFont("Arial", 'Normal')
    doc.text(`${stringNumber}`, 65, 740,)

    // const optionsTable4 = {
    //     margin: {
    //         top: 100, left: 50, right: 30,
    //     },
    //     showHead: 'never',
    //     theme: 'grid',
    //     headerStyles: {
    //         cellPadding: 1,
    //         lineWidth: 0,
    //         valign: 'top',
    //         fontStyle: 'bold',
    //         halign: 'left',
    //         fillColor: "white",
    //         textColor: [0, 0, 0],
    //         fontSize: 8,
    //         rowHeight: 10,
    //         lineColor: [0, 0, 0]
    //     },
    //     bodyStyles: {
    //         columnWidth: 'wrap',
    //         textColor: [30, 30, 30],
    //         cellPadding: 2,
    //         fontSize: 7,
    //         fontStyle: 'bold',
    //         lineColor: [0, 0, 0]
    //     },
    //     columnStyles: {
    //         0: {
    //             valign: "top",
    //         },
    //         1: {
    //             halign: 'right',
    //             valign: "top",
    //         },
    //     },
    //     didParseCell: function (cell, data) {
    //         console.log("didParseCell", cell)
    //         console.log(" didParse data", data)

    //         if (cell.row.index === 4) {
    //             cell.cell.styles.fontSize = 12;
    //             cell.cell.styles.lineWidth = 1
    //         }
    //     },
    //     startY: 100
    // };
    // doc.setFontSize(9)
    // doc.autoTable(optionsTable4,);
}


export const tableBody = (doc, data) => {

    var options = {
        didParseCell: (data1) => {

            if (data1.row.cells[5].raw === "isaddition") {
                data1.row.cells[2].colSpan = 2
                data1.row.cells[0].colSpan = 2
                data1.row.cells[4].colSpan = 2
                data1.row.cells[6].colSpan = 2

                data1.row.cells[0].styles.fontSize = 8
                data1.row.cells[2].styles.fontSize = 8
                data1.row.cells[4].styles.fontSize = 8
                data1.row.cells[6].styles.fontSize = 8

                data1.row.cells[0].styles.fontStyle = "bold"
                data1.row.cells[2].styles.fontStyle = "bold"
                data1.row.cells[4].styles.fontStyle = "bold"
                data1.row.cells[6].styles.fontStyle = "bold"
            }

            if (data1.row.cells[0].raw === "HSN Item Name") {
                data1.row.cells[4].colSpan = 2
                data1.row.cells[6].colSpan = 2


            }
        },
        margin: {
            left: 30, right: 25, top: 65
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 2,
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
            fontSize: 7,
            columnWidth: 'wrap',
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 170,
            },
            1: {
                columnWidth: 50,
                halign: 'right',
            },
            2: {
                columnWidth: 40,
                halign: 'right',
            },
            3: {
                columnWidth: 50,
                halign: 'right',
            },
            4: {
                columnWidth: 28,
                halign: 'right',
            },
            5: {
                columnWidth: 40,
                halign: 'right',
            },
            6: {
                columnWidth: 28,
                halign: 'right',
            },
            7: {
                columnWidth: 40,
                halign: 'right',
            },
            8: {
                fontStyle: 'bold',
                halign: 'right',
            },
        },
        tableLineColor: "black",
        startY: initial_y,
    };

    doc.autoTable(table.columns, table.Rows(data), options,);

}

export const pageFooter = (doc, data) => {

    //   
    // let finalY = doc.previousAutoTable.finalY;

    // if (finalY > 700) {

    //     pageBorder(doc)
    //     // reportFooter(doc, data)
    //     // pageHeder(doc, data)
    //     // reportHeder1(doc, data)
    //     // reportHeder2(doc, data)
    //     // reportHeder3(doc, data)

    // } else {
    //     pageBorder(doc)
    //     // reportFooter(doc, data)
    //     // pageHeder(doc, data)
    // //     reportHeder1(doc, data)
    // //     reportHeder2(doc, data)

    //     // reportHeder3(doc, data)
    // }
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, data)
        pageBorder(doc)
        reportHeder3(doc, data)
        doc.setFont('helvetica', 'Normal')
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 10, 828, {
            align: 'center'
        })
        console.log("aaa", doc.internal.pageSize.height)
    }
}

// original