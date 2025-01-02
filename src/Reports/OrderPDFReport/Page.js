import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { compareGSTINState, loginUserDetails } from "../../components/Common/CommonFunction";
import { AMERICA_ID } from "../../HardCodeID/contryID";


var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
    style.reportHeder3(doc, data);
};

function reportBody(doc, data) {

    const isIGST = compareGSTINState(data.CustomerGSTIN, data.SupplierGSTIN)
    if (isIGST) {
        style.tableBodyWithIGST(doc, data);
    } else if (data.isAmerica) {
        style.tableBodyForAmericanOrder(doc, data)
    } else {

        style.tableBody(doc, data);
    }

}

function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    style.reportFooter(doc, data);
}

const generateReportPage = (doc, data) => {
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
}

const ordeRreport = async (data) => {
    data["isAmerica"] = loginUserDetails().Country_id === AMERICA_ID
    var doc = new jsPDF('p', 'pt', 'a4');

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

    }
    // else {
    //     const Data = [data];
    //     Data.forEach((item, index) => {
    //         item["isMultiPrint"] = false
    //         generateReportPage(doc, item);
    //         if (index !== Data.length - 1) {
    //             doc.addPage();
    //         }
    //     });
    // }
    // if (IsSweetAndSnacksCompany()) {
    //     const qrCodeImage = await QRCode.toDataURL(data.FullInvoiceNumber);
    //     doc.addImage(qrCodeImage, "PNG", 344, 310, 90, 80, null, 'FAST');
    // }

    doc.setProperties({
        title: `POReport/${data.OrderDate}-${data.CustomerName} `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}
// const ordeRreport = (data) => {
//     debugger
//     data["isAmerica"] = loginUserDetails().Country_id === AMERICA_ID
//     var doc = new jsPDF('p', 'pt', 'a4');
//     pageHeder(doc, data);
//     reportBody(doc, data);
//     pageFooter(doc, data);
//     doc.setProperties({
//         title: `POReport/${data.OrderDate}-${data.CustomerName} `
//     });

//     function generateSaveAndOpenPDFReport() {
//         const pdfUrl = URL.createObjectURL(doc.output('blob'));
//         window.open(pdfUrl);
//     }
//     generateSaveAndOpenPDFReport();

// }
export default ordeRreport;