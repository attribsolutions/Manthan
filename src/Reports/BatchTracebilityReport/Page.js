import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { CommonConsole, date_dmy_func } from "../../components/Common/CommonFunction";


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

const BatchTraceabilityReport = (data) => {
    
    var doc = new jsPDF('p', 'pt', 'a4');
    try {
        pageHeder(doc, data);
        reportBody(doc, data);
        pageFooter(doc, data);
        doc.setProperties({
            title: `Batch Traceability Report ${date_dmy_func(data.Period.FromDate)} To ${date_dmy_func(data.Period.ToDate)} `
        });
        function generateSaveAndOpenPDFReport() {

            const pdfUrl = URL.createObjectURL(doc.output("blob"));
            window.open(pdfUrl);
        }
        generateSaveAndOpenPDFReport();
    } catch (error) {
        CommonConsole("BatchTraceability_Report Error", error)
    }


}
export default BatchTraceabilityReport;