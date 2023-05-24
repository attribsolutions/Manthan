import CheckBox from "jspdf";
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import { date_dmy_func } from "../../components/Common/CommonFunction";
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
    
    doc.setLineDash([7, 3, 1, 3], 10)
    doc.setFont(undefined, 'bold')
    doc.setFontSize(19)
    doc.setLineWidth(1);
    doc.roundedRect(45, 37, 220, 30, 5, 5, 'S')
    doc.text('PAYMENT RECEIPT ', 60, 60,)

   






    doc.setFontSize(10)
    doc.addFont("Arial", 'Normal')
    doc.text('RECEIPT NO:', 60, 130,)
    doc.setFont(undefined, 'Normal')
    doc.text(`${data.FullReceiptNumber}`, 140, 130,)
    doc.setLineWidth(0);
    doc.line(170, 132, 130, 132); // RECEIPT NO LINE 


    doc.text('Bill NO:', 270, 130,)
    doc.setLineWidth(0);
    doc.line(310, 132, 350, 132);


    doc.setFont(undefined, 'bold')
    doc.setFontSize(11)
    doc.text('Recived with thanks from:', 60, 160,)
    doc.setFont(undefined, 'Normal')
    doc.text(`${data.Party}`, 190, 159,)
    doc.setLineWidth(0);
    doc.line(550, 162, 183, 162);

    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text('Amount in Word :', 60, 190,)
    doc.setFont(undefined, 'Normal')
    let stringNumber = toWords(Number(data.AmountPaid))
    doc.text(`${stringNumber}`, 170, 189,)
    doc.setLineWidth(0);
    doc.line(550, 190, 143, 190); // RECEIPT NO LINE (Top)


    doc.setFont(undefined, 'bold')
    doc.text('Receipt Mode :', 60, 220,)
    doc.setLineWidth(0);
    doc.setFont(undefined, 'Normal')
    doc.text(`${data.ReceiptModeName}`, 160, 219,)
    doc.line(220, 220, 130, 220); // RECEIPT NO LINE (Top)


    if (data.ReceiptModeName === "RTGS") {

        doc.setFont(undefined, 'bold')
        doc.text('Bank :', 60, 250,)
        doc.setLineWidth(0);
        doc.setFont(undefined, 'Normal')
        doc.line(300, 250, 90, 250); // RECEIPT NO LINE (Top)

        doc.setFont(undefined, 'bold')
        doc.text('Depositor Bank :', 320, 250,)
        doc.setLineWidth(0);
        doc.setFont(undefined, 'Normal')
        doc.line(550, 250, 400, 250); // RECEIPT NO LINE (Top)

        doc.setFont(undefined, 'bold')
        doc.text('Description :', 60, 280,)
        doc.setFont(undefined, 'Normal')
        doc.setLineWidth(0);
        doc.line(550, 280, 130, 280); // RECEIPT NO LINE (Top)

    }



    if (data.ReceiptModeName === "Cheque") {
        doc.setFont(undefined, 'bold')
        doc.text('Cheque No :', 226, 220,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${data.DocumentNo}`, 300, 219,)
        doc.setLineWidth(0);
        doc.line(340, 220, 282, 220); // RECEIPT NO LINE (Top)


        doc.setFont(undefined, 'bold')
        doc.text('Cheque Date :', 360, 220,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${data.ChequeDate}`, 440, 219,)
        doc.setLineWidth(0);
        doc.line(425, 220, 550, 220); // RECEIPT NO LINE (Top)


        doc.setFont(undefined, 'bold')
        doc.text('Bank :', 60, 250,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${data.BankName}`, 100, 249,)
        doc.setLineWidth(0);
        doc.line(300, 250, 90, 250); // RECEIPT NO LINE (Top)


        doc.setFont(undefined, 'bold')
        doc.text('Depositor Bank :', 320, 250,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${data.DepositorBankName}`, 420, 249,)

        doc.setLineWidth(0);
        doc.line(550, 250, 400, 250); // RECEIPT NO LINE (Top)


        doc.setFont(undefined, 'bold')
        doc.text('Description :', 60, 280,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${data.Description}`, 125, 279,)

        doc.setLineWidth(0);
        doc.line(550, 280, 130, 280); // RECEIPT NO LINE (Top)

    }


    if (data.ReceiptModeName === "Cash") {
        doc.setFont(undefined, 'bold')
        doc.text('Description :', 60, 250,)
        doc.setFont(undefined, 'Normal')
        doc.text(`${data.Description}`, 125, 249,)

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
    // doc.line(550, 348, 400, 348); // RECEIPT NO LINE (Top)



    // doc.text('Prepared By ', 60, 360,)
    doc.text(`Prepared By : ${data.Customer}`  , 60, 360,)

   
    // doc.line(550, 348, 400, 348); // RECEIPT NO LINE (Top)








    var BilledByStyle = {
        margin: {
            top: 0, left: 350, right: 35,
        },
        showHead: 'always',
        theme: 'plain',
        styles: {
            overflow: 'linebreak',
            fontSize: 9,
            height: 0,
        },
        bodyStyles: {
            columnWidth: 'wrap',
            textColor: [30, 30, 30],
            cellPadding: 1,
            fontSize: 10,
            fontStyle: 'bold',
            lineColor: [0, 0, 0]
        },
        columnStyles: {
            0: {
                valign: "top",
                columnWidth: 220,
                halign: 'lfet',
            }
        },
        tableLineColor: "black",
        startY: 20,
    };

    doc.autoTable(table.Address, table.AddressDetails(data), BilledByStyle);
    let finalY = doc.previousAutoTable.finalY;

    doc.line(570, finalY, 30, finalY); // RECEIPT NO LINE 
    doc.line(570, finalY+4, 30, finalY+4); // RECEIPT NO LINE 

    doc.line(570, 340, 30, 340); // RECEIPT NO LINE 

    





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