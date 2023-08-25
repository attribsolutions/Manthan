
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import * as table from './TableData'
import { toWords } from "../Report_common_function";


export const pageBorder = (doc) => {
    doc.line(570, 10, 30, 10);//horizontal line (Top)
    doc.line(30, 815, 30, 10);//vertical line (left)
    doc.line(570, 815, 570, 10);//vertical line (Right)
    doc.line(570, 815, 30, 815);//horizontal line (Bottom)   
}
export const pageHeder = (doc, data) => {
    doc.addImage(reportHederPng, 'PNG', 35, 10, 80, 45)
    doc.addFont("Arial", 'Normal')
    doc.setFont('Arial')
    doc.setFontSize(15)
    doc.text('Material Register', 200, 40,) //Tax invoice Header
}
export const reportHeder1 = (doc, data) => {
    doc.setFont('Tahoma')
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text(`*** ${data.CompanyName} ***`, 200, 75,'center')  //bill by 
    doc.line(570, 60, 30, 60) //horizontal line 1 billby upper
    doc.line(570, 10, 30, 10);//horizontal line 2
    doc.line(570, 80, 30, 80);//horizontal line 3
    // doc.line(409, 100, 30, 100) //horizontal line 4
    doc.line(30, 789, 30, 10);//vertical left 1
    doc.line(570, 789, 570, 10);//vertical left 2
    doc.line(408, 134, 408, 10);//vertical right 1
    doc.line(250, 134, 250, 80);//vertical right 2
    doc.line(570,134, 30,134);//horizontal line table 


    doc.line(250, 100, 408, 100) //horizontal line Current date upper
    doc.line(250, 117, 408, 117) //horizontal line Current date upper
    doc.line(408, 107, 570, 107) //horizontal line Current date upper




    var options3 = {
        margin: {
            // top: 20, left: 35, right: 35,// bottom:100 /
        },
        showHead: 'always',
        theme: 'plain',
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
                columnWidth: 200,
                halign: 'lfet',
            },
            1: {
                columnWidth: 20,
                halign: 'left',
            },
            2: {
                columnWidth: 200,
                halign: 'left',
            },
        },
        tableLineColor: "black",
        startY:85
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
    doc.setFont(undefined, 'bold')
    doc.text(`Report No:${data.InvoiceNumber}`, 415, 30) //Invoice Id
    doc.text(`Date: ${data.InvoiceDate}`, 415, 50) //Invoice date
    doc.setFontSize(11)
    doc.text(`Material: ${data.ItemName}`, 415, 75) //Invoice date
    doc.text(`Open Balance : ${data.Open}`, 415, 95) //Invoice date
    doc.text(`Close Balance: ${data.Close}`, 415, 120) //Invoice date


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

            if (data1.row.raw[6] ==="Dispatch" ) {
                data1.row.cells[6].contentHeight = 2    
            }
        },
        margin: {
            left: 30, right: 25,//200 bottom
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
                columnWidth: 100,
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
                columnWidth: 70,
                halign: 'right',
            },
            4: {
                columnWidth: 70,
                halign: 'right',
            },
            5: {
                columnWidth: 60,
                halign: 'right',
            },
            6: {
                columnWidth: 100,
                halign: 'right',
            },
           
        },
        tableLineColor: "black",
        startY: doc.autoTableEndPosY(45),// 45,
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
    let stringNumber = toWords(data.GrandTotal)
    doc.addImage(upi_qr_code, 'PNG', 470, 750, 80, 60)
    doc.setDrawColor(0, 0, 0);
    doc.line(570, 745, 30, 745);//horizontal line Footer 2
    doc.line(570, 680, 30, 680);//horizontal line Footer 3
    doc.line(430, 700, 30, 700);//horizontal line Footer 3 Ruppe section
    doc.line(460, 745, 460, 815);//vertical right1 Qr Left 1
    doc.line(430, 680, 430, 745);//vertical right1 Sub Total
    doc.setFont('Tahoma')
    doc.line(460, 775, 30, 775);//horizontal line (Bottom)


    doc.setFontSize(8)

    // doc.text(`CGST:`, 434, 690,)
    // doc.text(`${totalCGST.toFixed(2)}`, 560, 690, 'right')

    // doc.text(`SGST:`, 434, 700,)
    // doc.text(`${totalSGST.toFixed(2)}`, 560, 700, 'right')

    // doc.text(`TotalGST:`, 434, 710,)
    // doc.text(` ${TotalGST.toFixed(2)}`, 560, 710, 'right')

    // doc.text(`BasicAmount:`, 434, 720,)
    // doc.text(`${TotalBasicAmount.toFixed(2)}`, 560, 720, 'right')

    doc.setFont(undefined, 'Normal')
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Amount :`, 434, 740,)
    // doc.text(`${data.GrandTotal}`, 560, 740, 'right')
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
    doc.text(`Signature `, 400, 811,)
    doc.setFont("Arimo");
    doc.text(`I/we hearby certify that food/foods mentioned in this invoice is/are warranted to be of the nature and
   quantity whitch it/these purports to be `, 34, 760,)
    doc.text(`A/C No: 2715500356 IFSC Code:BKID00015422 `, 34, 710,)
    doc.text('Bank details ·sdSVvDsdgbvzdfbBzdf', 34, 725,)
    doc.text(`Rupees:${stringNumber} `, 33, 693,)
    let finalY = doc.previousAutoTable.finalY;
    if (finalY > 675) {
        pageBorder(doc)
        reportFooter(doc, data)
        pageHeder(doc, data)
        reportHeder1(doc, data)
        reportHeder2(doc, data)
        reportHeder3(doc, data)
        
    } else {
        pageBorder(doc)
        reportFooter(doc, data)
        pageHeder(doc, data)
        reportHeder1(doc, data)
        reportHeder2(doc, data)
        reportHeder3(doc, data)
        // tableBody(doc, data)
        

    }
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 10, 828, {
            align: 'center'
        })
        console.log("aaa", doc.internal.pageSize.height)
    }
}

// original