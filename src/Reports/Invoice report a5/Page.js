// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as style from './ReportStyle'
// import { Data1, dataGenrator } from "./DemoData";
// import { compareGSTINState } from "../../components/Common/CommonFunction";
// import { E_invoiceQRCode } from "../../helpers/other_domain_api";

// var pageHeder = function (doc, data) {

//     style.pageBorder(doc, data);                           // Page Border
//     style.pageHeder(doc, data);                            // Report Title 
//     style.reportHeder1(doc, data);
//     style.reportHeder2(doc, data);
//     style.reportHeder3(doc, data);                          //Invoice ID , Date 
// };

// function reportBody(doc, data) {
//     const isIGST = compareGSTINState(data.CustomerGSTIN, data.PartyGSTIN)
//     if (isIGST) {
//         style.tableBodyWithIGST(doc, data);                 //table Body
//     } else {
//         style.tableBody(doc, data);
//     }

// }
// function pageFooter(doc, data, islast, array) {
//     style.reportFooter(doc, data);                           //Report Footer
//     style.pageFooter(doc, data, islast, array);              //page Footer
// }

// const InvioceReporta5 = async (data) => {

//     var doc = new jsPDF('l', 'pt', 'a5');

//     if (Array.isArray(data)) {
//         for (let i = 0; i < data.length; i++) {
//             data[i].SettingData = data.SettingData;
//         }

//         data.forEach((data, islast, array) => {
//             pageHeder(doc, data);
//             reportBody(doc, data);                                   // condition for Mulitinvoice invoice
//             pageFooter(doc, data, islast, array);
//             if (!(array.length - 1 === islast)) {
//                 doc.addPage();
//             }
//         })
//     } else {
//         const Data = []
//         Data.push(data)
//         Data.forEach((data, islast, array) => {
//             pageHeder(doc, data);                                    // condition for singel invoice
//             reportBody(doc, data);
//             pageFooter(doc, data, islast, array);
//             if (!(array.length - 1 === islast)) {
//                 doc.addPage();
//             }
//         })
//     }

//     doc.setProperties({
//         title: " Invoice Report"
//     });
//     doc.output('dataurlnewwindow', { filename: "Invoice Report" });

// }
// export default InvioceReporta5;



import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data1, dataGenrator } from "./DemoData";
import { CurrentTime, compareGSTINState, currentDate_dmy } from "../../components/Common/CommonFunction";
import { E_invoiceQRCode } from "../../helpers/other_domain_api";

var pageHeder = function (doc, data) {
    if (data.isMultiPrint) {
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFont('helvetica', 'Normal')
        doc.setFontSize(8)
        doc.text('Page' + String(pageCount), 500, 390,)
        doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 390,)

    }
    style.pageBorder(doc, data);                           // Page Border
    style.pageHeder(doc, data);                            // Report Title 
    style.reportHeder1(doc, data);
    style.reportHeder3(doc, data);                          //Invoice ID , Date 
};

function reportBody(doc, data) {
    const isIGST = compareGSTINState(data.CustomerGSTIN, data.PartyGSTIN)
    if (isIGST) {
        style.tableBodyWithIGST(doc, data);                 //table Body
    } else {
        style.tableBody(doc, data);
    }
}

function pageFooter(doc, data, islast, array) {
    style.reportFooter(doc, data);                           //Report Footer
    style.pageFooter(doc, data, islast, array);              //page Footer
}

const generateReportPage = (doc, data) => {
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
}

const InvioceReporta5 = async (data) => {
    var doc = new jsPDF('l', 'pt', 'a5');

    const BATCH_SIZE = 40; // You can adjust the batch size according to your needs

    if (Array.isArray(data)) {

        // doc.text('Page' + String("2") + ' of ' + String("1"), 500, 390,)
        // doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 390,)

        debugger
        for (let i = 0; i < data.length; i += BATCH_SIZE) {
            const batch = data.slice(i, i + BATCH_SIZE);
            batch.forEach((item, index) => {
                // flag for condition check in loading sheet multiple invoice print 
                item["isMultiPrint"] = true
                item.SettingData = data.SettingData;
                generateReportPage(doc, item);
                if (index !== batch.length - 1) {
                    doc.addPage();
                }
            });
        }



    } else {
        const Data = [data];
        Data.forEach((item, index) => {
            item["isMultiPrint"] = false
            generateReportPage(doc, item);
            if (index !== Data.length - 1) {
                doc.addPage();
            }
        });
    }
    doc.setProperties({
        title: `InvoiceReport/${data.CustomerName}/${data.InvoiceDate} `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        const options = { filename: "InvoiceReport" }
        window.open(pdfUrl, options);
    }
    generateSaveAndOpenPDFReport();

}

export default InvioceReporta5;
