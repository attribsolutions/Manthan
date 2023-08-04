
import { CurrentTime, compareGSTINState, currentDate_dmy, date_dmy_func } from "../../components/Common/CommonFunction";
import { numberWithCommas, toWords } from "../Report_common_function";
import * as table from './TableData'
import { url } from "../../routes";


let initial_y = 0

// export const pageBorder = (doc) => {

//     doc.setDrawColor(0, 0, 0);
//     doc.line(570, 16, 30, 16);//horizontal line (Top)
//     doc.line(30, 815, 30, 16);//vertical line (left)
//     doc.line(570, 815, 570, 16);//vertical line (Right)
//     doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
// }



export const pageBorder = (doc, data) => {

    doc.setDrawColor(0, 0, 0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, data.PrintType ? 379 : 815, 30, 16);//vertical line (left)
    doc.line(570, data.PrintType ? 379 : 815, 570, 16);//vertical line (Right)
    doc.line(570, data.PrintType ? 379 : 815, 30, data.PrintType ? 379 : 815);//horizontal line (Bottom)   
}






export const pageHeder = (doc, data) => {
    doc.setDrawColor(0, 0, 0);
    doc.line(408, 63, 408, 16);//vertical right 1
    doc.line(570, 63, 30, 63)  //horizontal line 1 billby upper for repeat header
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(18)
    if (data.subPageMode === url.PURCHASE_RETURN_LIST) {
        doc.text(' PURCHASE RETURN', 160, 45,)
    } else {
        doc.text(' SALES RETURN', 160, 45,)

    }
}

export const reportHeder1 = (doc, data) => {

    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text("Return by", 110, 75)  //bill by 
    doc.text('Return to', 390, 75) //billed to
    // doc.text('Details of Transport', 440, 75)

    doc.setDrawColor(0, 0, 0);
    doc.line(570, 63, 30, 63) //horizontal line 1 billby upper
    doc.line(570, 16, 30, 16);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3
    // doc.line(30, 789, 30, 16);//vertical left 1

    doc.line(408, 63, 408, 16);//vertical line header section billby 
    doc.line(292, 170, 292, 63);//vertical  line header section billto



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
            cellPadding: data.PrintType ? 1 : 2,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 300,
                halign: 'lfet',
            }
        },
        tableLineColor: "black",

        startY: 80
    };

    var BilledToStyle = {
        margin: {
            top: 45, left: 292, right: 35,
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
            cellPadding: data.PrintType ? 1 : 2,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 270,
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

    const priLength = () => {
        let final_y = doc.previousAutoTable.finalY
        if (final_y > initial_y) {
            initial_y = final_y
        }

    }

    doc.autoTable(table.BilledBy, table.ReturnByRow(data), BilledByStyle);
    priLength()

    doc.autoTable(table.BilledTo, table.ReturnToRow(data), BilledToStyle);
    priLength()

}




export const reportHeder3 = (doc, data) => {
    var date = date_dmy_func(data.ReturnDate)

    doc.setFont('Tahoma')
    doc.setFontSize(10)
    doc.line(570, 33, 408, 33) //horizontal line 1 billby upper
    // doc.line(570, 49, 408, 49) //horizontal line 1 billby upper
    doc.setFont(undefined, 'bold')
    doc.text(`Return No:   ${data.FullReturnNumber}`, 415, 27) //Invoice Id
    doc.text(`Return Date: ${date}`, 415, 43) //Invoice date
    // doc.text(`PONumber: ${data.InvoicesReferences[0].FullOrderNumber}`, 415, 60) //Invoice date

}
// original

export const reportFooter = (doc, data) => {

    let stringNumber = toWords(Number(data.GrandTotal))
    // doc.addImage(upi_qr_code, 'PNG', 359, 747, 75, 65)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 730, 30, 730);//horizontal line Footer 1
    doc.line(435, 745, 30, 745);//horizontal line Footer 2
    doc.line(435, 775, 30, 775);//horizontal line Footer 3
    doc.line(435, 795, 30, 795);//horizontal line Footer 3

    doc.line(435, 730, 435, 815);//vertical right Sub Total
    // doc.line(360, 745, 360, 815);//vertical right Qr Code    /////////////////
    doc.setFont('Tahoma')

    const a = data.ReturnItems.map((data) => ({

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



    doc.text(`Total Basic:`, 440, 738,)
    doc.text(`${numberWithCommas(Number(TotalBasicAmount).toFixed(2))}`, 567, 738, 'right')

    doc.text(`Total Disc:`, 440, 748,)
    doc.text(` ${numberWithCommas(Number(TotalDiscount).toFixed(2))}`, 567, 748, 'right')

    doc.text(`Total CGST:`, 440, 758)
    doc.text(`${numberWithCommas(Number(totalCGST).toFixed(2))}`, 567, 758, 'right')

    doc.text(`Total SGST:`, 440, 768,)
    doc.text(`${numberWithCommas(Number(totalSGST).toFixed(2))}`, 567, 768, 'right')

    doc.text(`Total GST:`, 440, 778,)
    doc.text(` ${numberWithCommas(Number(TotalGST).toFixed(2))}`, 567, 778, 'right')

    doc.text(`Round Off:`, 440, 788,)
    doc.text(` ${numberWithCommas(Number(data.RoundOffAmount).toFixed(2))}`, 567, 788, 'right')

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
         of the nature and quantity which it/these purports to be `, 34, 782)
    doc.setFontSize(10)
    doc.text(`Signature `, 280, 810,)
    doc.text(`Prepared by :${data.PartyName} `, 35, 810,)
    doc.setFontSize(8)


    doc.setFont(undefined, 'bold')
    doc.text(`Rupees:`, 33, 740,)
    doc.addFont("Arial", 'Normal')
    doc.setFont("Arimo");

    doc.text(`${stringNumber}`, 65, 740,)

    let ReturnReasonDetails = {
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
            cellPadding: 4,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 250,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: 745,

    };

    doc.autoTable(table.Return, table.ReturnReason(data), ReturnReasonDetails);

}


export const reportFooterForA5 = (doc, data) => {
    let stringNumber = toWords(Number(data.GrandTotal))
    doc.setDrawColor(0, 0, 0);
    doc.line(435, 308, 30, 308);//horizontal line Footer 3 Ruppe section
    doc.line(570, 295, 30, 295);//horizontal line Footer 2
    doc.line(435, 295, 435, 379);  //footer vartical line
    doc.setFont('Tahoma')
    doc.line(435, 340, 30, 340);//horizontal line (Bottom)
    doc.line(435, 362, 30, 362); //horizontal line Sginature upper line
    doc.line(570, 365, 435, 365); //horizontal line Sginature upper line 






    const a = data.ReturnItems.map((data) => ({

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




    doc.text(`Total Basic:`, 440, 302,)
    doc.text(`${numberWithCommas(TotalBasicAmount.toFixed(2))}`, 567, 302, 'right')

    doc.text(`Total Disc:`, 440, 312,)
    doc.text(`${numberWithCommas(TotalDiscount.toFixed(2))}`, 567, 312, 'right')

    doc.text(`Total CGST:`, 440, 322)
    doc.text(`${numberWithCommas(totalCGST.toFixed(2))}`, 567, 322, 'right')

    doc.text(`Total SGST:`, 440, 332,)
    doc.text(`${numberWithCommas(totalSGST.toFixed(2))}`, 567, 332, 'right')

    doc.text(`Total GST:`, 440, 342,)
    doc.text(` ${numberWithCommas(TotalGST.toFixed(2))}`, 567, 342, 'right')



    doc.text(`Round Off:`, 440, 352,)
    doc.text(` ${Number(data.RoundOffAmount).toFixed(2)}`, 567, 352, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(`Total Amount :`, 439, 375,)
    const Total = numberWithCommas(Number(data.GrandTotal).toFixed(2))
    doc.text(`${Total}`, 567, 376, 'right')
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
    doc.text(`Signature `, 280, 372,)
    doc.text(`Prepared by :${data.PartyName} `, 35, 372,)

    doc.setFont(undefined, 'bold')
    doc.text(`Rupees:`, 33, 305,)
    doc.addFont("Arial", 'Normal')
    doc.setFontSize(8)

    doc.text(`${stringNumber}`, 65, 305,)

    let ReturnReasonDetails = {
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
            cellPadding: 4,
            fontSize: 8,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 250,
                halign: 'lfet',
            },

        },
        tableLineColor: "black",

        startY: 308,

    };

    doc.autoTable(table.Return, table.ReturnReason(data), ReturnReasonDetails);


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

                data1.row.cells[8].colSpan = 2
                data1.row.cells[10].colSpan = 2
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


export const pageFooter = (doc, data) => {
    
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageHeder(doc, data)
        pageBorder(doc, data)
        reportHeder3(doc, data)
        doc.setFont('helvetica', 'Normal')
        if (data.PrintType) {
            doc.text('Page' + String(i) + ' of ' + String(pageCount), 500, 390,)
            doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 390,)
        } else {
            doc.text('Page ' + String(i) + ' of ' + String(pageCount), 520, 828,)
            doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 828,)
        }

    }
}

// original