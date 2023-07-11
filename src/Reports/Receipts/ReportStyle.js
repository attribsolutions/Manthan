import CheckBox from "jspdf";
import reportHederPng from "../../assets/images/reportHeder.png"
import upi_qr_code from "../../assets/images/upi_qr_code.png"
import { CurrentTime, currentDate_dmy, date_dmy_func } from "../../components/Common/CommonFunction";
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

let final_y = 0

export const Receipts = (doc, data) => {


    var BilledByStyle = {
        didParseCell: (data1) => {
            if (data1.cell.raw === data.Party) {
                data1.cell.styles.fontStyle = 'bold';
                data1.cell.styles.fontSize = 13;
            }
        },
        margin: {
            top: 0,
            left: 420,
            right: 50,
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
            fontStyle: 'Normal',
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: 'top',
                columnWidth: 180, // Reduce the column width to fit within the page
                halign: 'left',
            },
        },
        tableLineColor: 'black',
        startY: 20,
    };

    var DetailsOfReceipt = {

        margin: {
            top: 0,
            left: 130,
            right: 35,
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
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: {
                valign: 'top',
                columnWidth: 440, // Reduce the column width to fit within the page
                halign: 'left',
            },
        },
        tableLineColor: 'black',
        startY: 190,
    };

    doc.autoTable(table.Details, table.ReceiptDetails(doc, data), DetailsOfReceipt);
    doc.setFontSize(17);
    doc.setFont(undefined, 'bold')
    doc.text(`Payment Receipt`, 40, 40,);

    // doc.setFontSize(18);
    // doc.text(`Receipt`, 340, 100, 'right');

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold')

    doc.text(`RECIEPT NO : ${data.FullReceiptNumber} `, 40, 145, 'left');
    doc.setFont(undefined, 'Normal')
    doc.setFont(undefined, 'bold')

    doc.text(`Bill NO : ${data.BillNumber === null ? "" : data.BillNumber} `, 300, 145, 'left');
    doc.setFont(undefined, 'Normal')


    doc.text(`Received With thanks from :`, 40, 180, 'left');

    doc.setFont(undefined, 'bold')
    doc.text(`${data.Customer}`, 190, 180,);
    doc.setFont(undefined, 'Normal')
    doc.text(`Amount in Words :`, 40, 200, 'left');

    doc.setFont(undefined, 'Normal')

    final_y = doc.previousAutoTable.finalY
    doc.text(`Receipt Mode :`, 40, final_y + 10, 'left');
    doc.setFont(undefined, 'bold')
    doc.text(`${data.ReceiptModeName}`, 110, final_y + 10,);
    doc.setFont(undefined, 'Normal')
    doc.text(`Description: ${data.Description === null ? "" : data.Description}`, 40, final_y + 25, 'left');

    doc.text(`Amount : `, 40, final_y + 40, 'left');
    doc.setFont(undefined, 'bold')
    doc.text(`${numberWithCommas(Number(data.AmountPaid).toFixed(2))}`, 90, final_y + 40,);
    doc.setFont(undefined, 'Normal')



    if (data.ReceiptModeName === "Cheque") {
        doc.text(`Bank Name`, 40, final_y + 55, 'left');
        doc.setFont(undefined, 'bold')
        doc.text(`${data.DocumentNo}/${data.BankName}`, 100, final_y + 55,);
        debugger
        var bankwidth = doc.getTextWidth(`${data.DocumentNo}/${data.BankName}`);
        doc.setFont(undefined, 'Normal')
        doc.text(`Depositor BankName`, 40 + bankwidth + 80, final_y + 55, 'left');
        doc.setFont(undefined, 'bold')

        doc.text(`${data.DepositorBankName}`, 40 + bankwidth + 190, final_y + 55, 'left');
        doc.setFont(undefined, 'bold')
    }

    doc.setFont(undefined, 'Normal')
    doc.text(`Prepared By :`, 40, 335, 'left');
    doc.setFont(undefined, 'bold')

    doc.text(`${data.Party}`, 110, 335, 'left');
    doc.setFont(undefined, 'Normal')


    doc.text(`Received By :`, 230, 335, 'left');

    doc.setFont(undefined, 'Normal')
    doc.setFont(undefined, 'bold')

    doc.text(`For ${data.Party}`, 480, 335, "center");
    doc.setFont(undefined, 'Normal')

    doc.text(`Authorize signatory`, 480, 375, "center");



    doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 40, 375,)












    doc.autoTable(table.Address, table.AddressDetails(data), BilledByStyle);

};































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