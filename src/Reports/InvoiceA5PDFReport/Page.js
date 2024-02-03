
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { CurrentTime, compareGSTINState, currentDate_dmy } from "../../components/Common/CommonFunction";


var pageHeder = function (doc, data) {
    if (data.isMultiPrint) {
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFont('helvetica', 'Normal')
        doc.setFontSize(8)
        doc.text('Page' + String(pageCount), 500, 403,)
        doc.text('Print Date :' + String(currentDate_dmy) + ' Time ' + String(CurrentTime()), 30, 403,)

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
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}

export default InvioceReporta5;
