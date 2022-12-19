import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'

var pageHeder = function (doc, data) {
    // style.pageBorder(doc,data);
    style.pageHeder(doc, data);
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
};
function reportBody(doc, data) {
    style.tableBody(doc, data);
}
function pageFooter(doc, data) {
    // style.reportFooter(doc,data);
    style.pageFooter(doc, data);
}
const ordeRreport = (data) => {
    
    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
    doc.setProperties({
        title: `OrderReport/${data.OrderDate}-${data.CustomerName} `
    });
    window.open(doc.output('dataurlnewwindow'));

}
export default ordeRreport;