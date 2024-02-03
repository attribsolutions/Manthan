import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { compareGSTINState } from "../../components/Common/CommonFunction";


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
    } else {
        style.tableBody(doc, data);
    }
}

function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    style.reportFooter(doc, data);
}

const ordeRreport = (data) => {
    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
    doc.setProperties({
        title: `POReport/${data.OrderDate}-${data.CustomerName} `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}
export default ordeRreport;