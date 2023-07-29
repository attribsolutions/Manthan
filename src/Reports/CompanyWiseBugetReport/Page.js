import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data } from "./DemoData";

var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);
};
function reportBody(doc, data) {
    style.tableBody(doc, data);
}
function pageFooter(doc, data) {
    style.pageFooter(doc, data);
}

const CompanyWiseBudgetReport = () => {
    const data = Data
    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);

    function generateSaveAndOpenPDFReport() {
        debugger
        // doc.save(`CompanyWiseBudget_report.pdf`);
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        const options = { filename: "CompanyWiseBudget_report" }
        window.open(pdfUrl, options);
    }
    generateSaveAndOpenPDFReport();

}
export default CompanyWiseBudgetReport;