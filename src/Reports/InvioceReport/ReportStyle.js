
import cbm_logo from "../../assets/images/cbm_logo.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import { CurrentTime, compareGSTINState, currentDate_dmy, date_dmy_func } from "../../components/Common/CommonFunction";
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
    doc.line(408, 170, 408, 16);//vertical right 1
    doc.line(220, 170, 220, 63);//vertical right 2



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
        doc.line(570, 33, 408, 33) //horizontal line 1 billby upper
        // doc.line(570, 49, 408, 49) //horizontal line 1 billby upper

        doc.setFont(undefined, 'bold')
        doc.text(`Invoice No:   ${data.FullInvoiceNumber}`, 415, 27) //Invoice Id
        doc.text(`Invoice Date: ${date}`, 415, 43) //Invoice date
        // doc.text(`PONumber: ${data.InvoicesReferences[0].FullOrderNumber}`, 415, 60) //Invoice date

    } else {
        doc.setFont('Tahoma')
        doc.setFontSize(10)
        doc.line(570, 35, 408, 35) //horizontal line 1 billby upper
        doc.setFont(undefined, 'bold')
        doc.text(`IB Invoice No:   ${data.FullInvoiceNumber}`, 415, 30) //Invoice Id
        doc.text(`IB Invoice Date: ${date}`, 415, 50) //Invoice date
    }

}
// original

export const reportFooter = (doc, data) => {

    let stringNumber = toWords(Number(data.GrandTotal))
    doc.addImage(upi_qr_code, 'PNG', 359, 747, 75, 65)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 730, 30, 730);//horizontal line Footer 1
    doc.line(435, 745, 30, 745);//horizontal line Footer 2
    doc.line(360, 775, 30, 775);//horizontal line Footer 3
    doc.line(360, 795, 30, 795);//horizontal line Footer 3

    doc.line(435, 730, 435, 815);//vertical right Sub Total
    doc.line(360, 745, 360, 815);//vertical right Qr Code 
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
    doc.setFontSize(8)



    const isIGST = compareGSTINState(data.CustomerGSTIN, data.PartyGSTIN)
    if (isIGST) {

        doc.text(`Total Basic:`, 440, 748,)
        doc.text(`${TotalBasicAmount.toFixed(2)}`, 567, 748, 'right')

        doc.text(`Total Disc:`, 440, 758,)
        doc.text(` ${TotalDiscount.toFixed(2)}`, 567, 758, 'right')

        doc.text(`Total IGST:`, 440, 768,)
        doc.text(`${totalICGST.toFixed(2)}`, 567, 768, 'right')

        doc.text(`Total GST:`, 440, 778,)
        doc.text(` ${TotalGST.toFixed(2)}`, 567, 778, 'right')

        doc.text(`Round Off:`, 440, 788,)
        doc.text(` ${Number(data.RoundOffAmount).toFixed(2)}`, 567, 788, 'right')

        doc.text(`TCS Amount:`, 440, 798,)
        doc.text(` ${Number(data.TCSAmount).toFixed(2)}`, 567, 798, 'right')



    } else {

        doc.text(`Total Basic:`, 440, 738,)
        doc.text(`${TotalBasicAmount.toFixed(2)}`, 567, 738, 'right')

        doc.text(`Total Disc:`, 440, 748,)
        doc.text(` ${TotalDiscount.toFixed(2)}`, 567, 748, 'right')

        doc.text(`Total CGST:`, 440, 758)
        doc.text(`${totalCGST.toFixed(2)}`, 567, 758, 'right')

        doc.text(`Total SGST:`, 440, 768,)
        doc.text(`${totalSGST.toFixed(2)}`, 567, 768, 'right')

        doc.text(`Total GST:`, 440, 778,)
        doc.text(` ${TotalGST.toFixed(2)}`, 567, 778, 'right')

        doc.text(`Round Off:`, 440, 788,)
        doc.text(` ${Number(data.RoundOffAmount).toFixed(2)}`, 567, 788, 'right')

        doc.text(`TCS Amount:`, 440, 798,)
        doc.text(` ${Number(data.TCSAmount).toFixed(2)}`, 567, 798, 'right')

    }







    doc.setFont(undefined, 'Normal')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`Total Amount :`, 440, 812,)
    const GrandTotal = Number(data.GrandTotal)

    const Total = numberWithCommas((GrandTotal).toFixed(2))
    doc.text(`${Total}`, 567, 812, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be
         of the nature and quantity which it/these purports to be `, 34, 782,)
    doc.setFontSize(10)
    doc.text(`Signature `, 280, 810,)
    doc.text(`Prepared by :${data.PartyName} `, 35, 810,)
    doc.setFontSize(8)


    if (data.BankData.length > 0) {
        let BankData = data.BankData[0]
        doc.setFont(undefined, 'bold')

        doc.text(`A/C No:`, 34, 755,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${BankData.AccountNo}`, 70, 755,)

        doc.setFont(undefined, 'bold')

        doc.text(`IFSC Code:`, 130, 755,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${BankData.IFSC}`, 175, 755,)

        doc.setFont(undefined, 'bold')
        doc.text(`Branch:`, 260, 755,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${BankData.BranchName}`, 290, 755,)

        doc.setFont(undefined, 'bold')
        doc.text(`Bank Name:`, 34, 768,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${BankData.BankName}`, 90, 768,)

    } else {
        doc.setFont(undefined, 'bold')
        doc.text(`Bank Details Not Avaliable`, 34, 761,)
        doc.setFont(undefined, 'Normal')
    }
    doc.setFont(undefined, 'bold')
    doc.text(`Rupees:`, 33, 740,)
    doc.addFont("Arial", 'Normal')
    doc.text(`${stringNumber}`, 65, 740,)

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
                let Box = 0;
                for (let i = 0; i < data.InvoiceItems.length; i++) {
                    if (data.InvoiceItems[i].PrimaryUnitName === "Box") {
                        Box++;
                    }
                }
                data1.row.cells[1].text[0] = ` HSN Item Name (${data.InvoiceItems.length}) (${Box} Box)`

                data1.row.cells[8].colSpan = 2
                data1.row.cells[10].colSpan = 2
            }
            if (data1.row.cells[1].raw === "Batch") {
                data1.row.cells[0].colSpan = 12

            }
        },
        margin: {
            left: 30, right: 25, top: 63,
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
                data.InvoiceItems.forEach((element, key) => {
                    if (element.PrimaryUnitName === "Box") {
                        TotalBox = Number(TotalBox) + Number(element.Quantity)
                    }
                })

                data1.row.cells[1].text[0] = ` HSN Item Name (${data.InvoiceItems.length})  (${TotalBox} Box)`
                data1.row.cells[8].colSpan = 2
            }

            if (data1.row.cells[1].raw === "Batch") {
                data1.row.cells[0].colSpan = 12

            }
        },
        margin: {
            left: 30, right: 25, top: 55
        },
        theme: 'grid',
        headerStyles: {
            cellPadding: 1,
            lineWidth: 1,
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

    doc.autoTable(table.columnsWithIGST, table.RowsWithIGST(data), options,);
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
        console.log("aaa", doc.internal.pageSize.height)
    }
}

// original