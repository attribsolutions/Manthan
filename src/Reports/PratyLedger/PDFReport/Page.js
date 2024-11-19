import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { date_dmy_func } from "../../../components/Common/CommonFunction";

var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);     //Title
    style.reportHeder1(doc, data);
};
function reportBody(doc, data) {
    style.tableBody(doc, data);
}
function pageFooter(doc, data) {
    style.pageFooter(doc, data);
}


const PartyLedgerReport = (data1) => {

    const data = data1[0]
    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);

    doc.setProperties({
        title: `PartyLedger_Report From ${date_dmy_func(data.FormDate)} To ${date_dmy_func(data.ToDate)} `
    });
    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();
};

export default PartyLedgerReport;