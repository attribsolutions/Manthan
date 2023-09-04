

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data1, dataGenrator } from "./DemoData";
import { CurrentTime, compareGSTINState, currentDate_dmy, date_dmy_func } from "../../components/Common/CommonFunction";

var pageHeder = function (doc, data) {
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
    if (Array.isArray(data)) {
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
        title: `Credit Note Report /${data.Customer}/${date_dmy_func(data.CRDRNoteDate)} `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}

export default InvioceReporta5;
