import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'

var pageHeder = function (doc) {
    style.pageBorder(doc);
    style.pageHeder(doc);
  };
function reportBody(doc, data) {
    style.tableBody(doc, data);
}
function pageFooter(doc) {
    // style.reportFooter(doc);
    style.pageFooter(doc);
}
 const generate=(data)=> {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(9)
    pageHeder(doc);
    reportBody(doc, data);
    pageFooter(doc);
    window.open(doc.output('dataurlnewwindow'));
    return(<></>);
}
export default generate;