import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'


var pageHeder = function (doc, data) {
    style.pageBorder(doc,data);
    style.pageHeder(doc, data);
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
    style.reportHeder3(doc,data);    //Invoice ID , Date

};
function reportBody(doc, data) {
    style.tableBody(doc, data);
}
function pageFooter(doc, data) {
  
    style.pageFooter(doc, data);
    style.reportFooter(doc,data);
}
const ordeRreport = (data) => {
  
    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
    doc.setProperties({
        title: `POReport/${data.OrderDate}-${data.CustomerName} `
    });
    const options = { filename: "Order Report" }
    doc.output('dataurlnewwindow', options);

}
export default ordeRreport;