import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'



var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
    style.reportHeder3(doc, data);
};

function reportBody_1(doc, data) {
    style.pageBorder(doc, data);

    style.tableBody_1(doc, data);
}


const FrenchiesesOrderReport = (data) => {
  
    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody_1(doc, data);


    doc.setProperties({
        title: `POReport/${data.OrderDate}-${data.CustomerName} `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}
export default FrenchiesesOrderReport;