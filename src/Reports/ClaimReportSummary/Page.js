import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle';
import { date_dmy_func } from "../../components/Common/CommonFunction";


const pageHeder = (doc, data) => {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);
    style.reportHeder1(doc, data);
    return true;
};

const reportBody = (doc, data) => {
    style.tableBody(doc, data);
};

function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    style.reportFooter(doc, data);
}

const ClaimSummaryReport = (data) => {

    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);

    doc.setProperties({
        title: `Item Wise Summary Report ${date_dmy_func(data.Period.FromDate)} To ${date_dmy_func(data.Period.ToDate)}`
    });
    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();


}

export default ClaimSummaryReport;


