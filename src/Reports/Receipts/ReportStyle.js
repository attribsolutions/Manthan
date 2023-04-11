
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import { convertDatefunc } from "../../components/Common/CommonFunction";
import { invoice } from "../ReportIndex";
import { numberWithCommas, toWords } from "../Report_common_function";
import * as table from './TableData'
let initial_y = 0
export const pageBorder = (doc) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0);
    doc.line(570, 16, 30, 16);//horizontal line (Top)
    doc.line(30, 379, 30, 16);//vertical line (left)
    doc.line(570, 379, 570, 16);//vertical line (Right)
    doc.line(570, 379, 30, 379);//horizontal line (Bottom)   
}


export const Receipts = (doc, data) => {
    doc.setFont(undefined, 'bold')
    doc.setFontSize(19)
    doc.setLineWidth(1);
    doc.roundedRect(120, 37, 190, 30, 5, 5, 'S')
    doc.text('PAYMENT RECEIPT ', 125, 60,)

    doc.setFontSize(10)
    doc.addFont("Arial", 'Normal')
    doc.text('RECEIPT NO:', 60, 130,)
    doc.text(`${data.FullReceiptNumber}`, 140, 130,)
    doc.setLineWidth(0);
    doc.line(170, 132, 130, 132); // RECEIPT NO LINE (Top)


    doc.text('Bill NO:', 270, 130,)
    doc.setLineWidth(0);
    doc.line(310, 132, 350, 132); // RECEIPT NO LINE (Top)




    doc.text('Recived with thanks from:', 60, 160,)
    doc.text(`${data.Party}`, 190, 159,)
    doc.setLineWidth(0);
    doc.line(550, 162, 183, 162); // RECEIPT NO LINE (Top)

    doc.text('Amount in Word :', 60, 190,)
    let stringNumber = toWords(Number(data.AmountPaid))
    doc.text(`${stringNumber}`, 170, 189,)
    doc.setLineWidth(0);
    doc.line(550, 190, 143, 190); // RECEIPT NO LINE (Top)

    doc.text('Receipt Mode', 60, 220,)
    doc.setLineWidth(0);
    doc.text(`${data.ReceiptMode}`, 160, 219,)
    doc.line(220, 220, 130, 220); // RECEIPT NO LINE (Top)

    if (data.ReceiptMode === "RTGS") {

        doc.text('Bank', 60, 250,)
        doc.setLineWidth(0);
        doc.line(300, 250, 90, 250); // RECEIPT NO LINE (Top)

        doc.text('Depositor Bank', 320, 250,)
        doc.setLineWidth(0);
        doc.line(550, 250, 400, 250); // RECEIPT NO LINE (Top)

        doc.text('Description', 60, 280,)
        doc.setLineWidth(0);
        doc.line(550, 280, 130, 280); // RECEIPT NO LINE (Top)

    }


    if (data.ReceiptMode === "Cheque") {
        doc.text('Cheque No :', 226, 220,)
        doc.setLineWidth(0);
        doc.line(340, 220, 282, 220); // RECEIPT NO LINE (Top)

        doc.text('Cheque Date :', 360, 220,)
        doc.setLineWidth(0);
        doc.line(425, 220, 550, 220); // RECEIPT NO LINE (Top)

        doc.text('Bank :', 60, 250,)
        doc.setLineWidth(0);
        doc.line(300, 250, 90, 250); // RECEIPT NO LINE (Top)

        doc.text('Depositor Bank :', 320, 250,)
        doc.setLineWidth(0);
        doc.line(550, 250, 400, 250); // RECEIPT NO LINE (Top)

        doc.text('Description :', 60, 280,)
        doc.setLineWidth(0);
        doc.line(550, 280, 130, 280); // RECEIPT NO LINE (Top)

    }
       
        
    debugger

    if (data.ReceiptMode === "cash" ) {
        doc.text('Description :', 60, 250,)
        doc.setLineWidth(0);
        doc.line(550, 250, 130, 250); // RECEIPT NO LINE (Top)
    }
    










    doc.setFontSize(12)
    doc.text('Amount:', 60, 310,)
    const GrandTotal = Math.round(data.AmountPaid)
    const Total = numberWithCommas((GrandTotal).toFixed(2))
    doc.roundedRect(112, 297, 150, 20, 5, 5, 'S')
    doc.text(`Rs`, 140, 311, 'right')

    doc.text(`${Total}`, 230, 311, 'right')





    doc.text('Authorized Signatory ', 430, 360,)
    doc.line(550, 348, 400, 348); // RECEIPT NO LINE (Top)



    doc.text('Prepared By ', 60, 360,)
    // doc.line(550, 348, 400, 348); // RECEIPT NO LINE (Top)








    var BilledByStyle = {
        margin: {
            top: 0, left: 380, right: 35,
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
            fontSize: 10,
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
        startY: 20,
    };

    doc.autoTable(table.Address, table.AddressDetails(data), BilledByStyle);




}







export const pageFooter = (doc, data) => {
    const pageCount = doc.internal.getNumberOfPages()
    doc.setFont('helvetica', 'Normal')
    doc.setFontSize(8)
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        pageBorder(doc)
        doc.setFont('helvetica', 'Normal')
        doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 10, 828, {
            align: 'center'
        })
        console.log("aaa", doc.internal.pageSize.height)
    }
}

// original