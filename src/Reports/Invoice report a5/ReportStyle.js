
// import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'
import { numberWithCommas, toWords } from "../Report_common_function";
import { date_dmy_func, convertOnlyTimefunc, convertTimefunc, currentDate_dmy, CurrentTime } from "../../components/Common/CommonFunction";


export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 379, 30, 16);//vertical line (left)
    doc.line(570, 379, 570, 16);//vertical line (Right)
    doc.line(570, 379, 30, 379);//horizontal line (Bottom)   
}
let initial_y = 0

export const pageHeder = (doc, data) => {
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFont(undefined, 'bold')
    doc.setFontSize(15)
    doc.text('TAX INVOICE', 180, 40,)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 56, 30, 56) //Full horizontal line Bill by Upper line
    doc.setFontSize(7)
    doc.text('Original For Buyer', 500, 11,)
}

export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text("Billed by", 80, 65)  //bill by 
    doc.text('Billed to', 280, 65) //billed to
    doc.text('Details of Transport', 440, 65) //Details of Transport
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 56, 30, 56);//horizontal line  when header on next page bottom line
    doc.line(570, 68, 30, 68);// full horizontal bill by bill to below line 
    doc.line(30, 350, 30, 16);//vertical left 1
    doc.line(570, 350, 570, 16);//vertical left 2
    doc.line(408, 145, 408, 16);//vertical right 1
    doc.line(220, 145, 220, 56);//vertical line between billby billto
    doc.line(570, 145, 30, 145) //horizontal line 1 billby upper

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
            cellPadding: 1,
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
        startY: 68,

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
            cellPadding: 1,
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
        startY: 68,

    };
    var DetailsOfTransportStyle = {
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

        startY: 68,

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
    doc.setFontSize(9)
    doc.setFont(undefined, 'bold')
    // doc.text(`GSTIN:${data.CustomerGSTIN}`, 38, 65)
    // doc.text(`GSTIN:${data.PartyGSTIN}`, 238, 65)
}

export const reportHeder3 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 30, 408, 30) //horizontal line 1 billby upper
    doc.line(408, 57, 408, 16);//vertical Line header
    doc.line(570, 44, 408, 44) //horizontal line 1 billby upper

    doc.setFont(undefined, 'bold')
    doc.text(`Invoice No:   ${data.FullInvoiceNumber}`, 415, 25) //Invoice Id
    var date = date_dmy_func(data.InvoiceDate)
    var time = convertOnlyTimefunc(data.CreatedOn)

    doc.text(`Invoice Date: ${date}  ${time}`, 415, 40) //Invoice date
    doc.text(`PONumber: ${data.InvoicesReferences[0].FullOrderNumber}`, 415, 53) //Invoice date


}
export const reportHeder4 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.setFont(undefined, 'bold')
    // var time = convertTimefunc(i.CreatedOn)
    //   i.GRNDate = (`${date} ${time}`)
    doc.text(`Invoice No:   ${data.FullInvoiceNumber}`, 30, 23) //Invoice Id
    doc.text(`Invoice Date: ${data.InvoiceDate}`, 415, 35) //Invoice date
}

export const reportFooter = (doc, data) => {
    let stringNumber = toWords(Number(data.GrandTotal))
    doc.addImage(upi_qr_code, 'PNG', 359, 310, 75, 65)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 295, 30, 295);//horizontal line Footer 2
    // doc.line(570, 340, 30, 340);//horizontal line Footer 3
    doc.line(435, 308, 30, 308);//horizontal line Footer 3 Ruppe section
    doc.line(435, 295, 435, 379);//vertical right1 Qr Left 1
    doc.line(360, 308, 360, 379);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(360, 340, 30, 340);//horizontal line (Bottom)
    doc.line(360, 362, 30, 362); //horizontal line Sginature upper line
    doc.line(570, 365, 435, 365); //horizontal line Sginature upper line 


    const a = data.InvoiceItems.map((data) => ({

        CGST: Number(data.CGST),
        SGST: Number(data.SGST),
        BasicAmount: Number(data.BasicAmount),
        Discount: Number(data.DiscountAmount)
    }));
    var totalCGST = 0;
    var totalSGST = 0;
    var TotalBasicAmount = 0;
    var TotalDiscount = 0
    a.forEach(arg => {
        totalCGST += arg.CGST;
        totalSGST += arg.SGST;
        TotalBasicAmount += arg.BasicAmount;
        TotalDiscount += arg.Discount;
    });
    const TotalGST = totalCGST + totalSGST;
    doc.setFontSize(8)

    doc.text(`Total Basic:`, 440, 302,)
    doc.text(`${TotalBasicAmount.toFixed(2)}`, 560, 302, 'right')

    doc.text(`Total Disc:`, 440, 312,)
    doc.text(` ${TotalDiscount.toFixed(2)}`, 560, 312, 'right')

    doc.text(`Total CGST:`, 440, 322)
    doc.text(`${totalCGST.toFixed(2)}`, 560, 322, 'right')

    doc.text(`Total SGST:`, 440, 332,)
    doc.text(`${totalSGST.toFixed(2)}`, 560, 332, 'right')

    doc.text(`Total GST:`, 440, 342,)
    doc.text(` ${TotalGST.toFixed(2)}`, 560, 342, 'right')

    doc.text(`Round Off:`, 440, 352,)
    doc.text(` ${Number(data.RoundOffAmount).toFixed(2)}`, 560, 352, 'right')

    doc.text(`Total TCS:`, 440, 362,)
    doc.text(` ${Number(data.TCSAmount).toFixed(2)}`, 560, 362, 'right')



    doc.setFont(undefined, 'Normal')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text(`Amount :`, 439, 375,)
    const Total = numberWithCommas(Number(data.GrandTotal).toFixed(2))
    doc.text(`${Total}`, 560, 376, 'right')
    doc.setFont(undefined, 'Normal')
    doc.setFont('Tahoma')
    doc.setFontSize(9)
    doc.setFont('Tahoma')
    doc.setFontSize(8)
    doc.text(`Prepared by `, 35, 785,)
    doc.text(`Received By `, 180, 785,)
    doc.setFontSize(10)
    doc.text(`${data.PartyName} `, 390, 785,)
    doc.setFontSize(10)
    doc.text(`${data.CustomerName} `, 140, 811,)
    doc.setFontSize(9)

    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be
     of the nature and quantity which it/these purports to be `, 34, 348,)
    doc.text(`A/C No: 2715500354564564564564565456456 IFSC Code:BKID00015422 `, 34, 318,)
    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 328,)

    doc.text(`Signature `, 280, 372,)
    doc.text(`Prepared by :${data.PartyName} `, 35, 372,)

    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 328,)

    doc.setFont(undefined, 'bold')
    doc.text(`Rupees:`, 33, 305,)
    doc.addFont("Arial", 'Normal')
    doc.text(`${stringNumber}`, 65, 305,)
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

                data1.row.cells[1].text[0] = ` HSN Item Name (${data.InvoiceItems.length})`
                data1.row.cells[8].colSpan = 2
                data1.row.cells[10].colSpan = 2
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
            left: 30, right: 30, bottom: 110
        },
    };

    doc.autoTable(optionsTable4);
}

export const pageFooter = (doc, data, islast = 0, array = []) => {

    const pageCount = doc.internal.getNumberOfPages()
    console.log(pageCount)

    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, data)
        pageBorder(doc)
        reportHeder3(doc, data)
        doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 390,)
    }

    let condition1 = (array.length - 1 === islast)
    if (condition1) {
        for (let j = 1; j <= pageCount; j++) {
            doc.setPage(j)
            doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 390,)

        }
    }
}

// original