import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { IsSweetAndSnacksCompany } from "../../../components/Common/CommonFunction";

var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);     //Title
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
    style.reportHeder3(doc, data);    //Invoice ID , Date  

};
function reportBody(doc, data) {
    style.tableBody(doc, data);
}
function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    // style.reportFooter(doc, data);
}

const ItemRegisterReport = (data) => {
    data["Period"] = data[0].Period
    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
    doc.setProperties({
        title: "Material  Register"
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}
export default ItemRegisterReport;