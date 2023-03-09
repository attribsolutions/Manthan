import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data } from "./DemoData";


var pageHeder = function (doc, i) {
    debugger
    style.pageBorder(doc, i);
    style.pageHeder(doc, i);     //Title
    style.reportHeder1(doc, i);
    style.reportHeder2(doc, i);
    style.reportHeder3(doc, i);    //Invoice ID , Date  

};
function reportBody(doc, i) {
    style.tableBody(doc, i);
}
function pageFooter(doc, i) {
    style.pageFooter(doc, i);
    style.reportFooter(doc, i);
}

const InvioceReporta5 = (data = []) => {
    debugger
    var doc = new jsPDF('l', 'pt', 'a5');
    data.forEach(i => {
        debugger
        pageHeder(doc, i);
        reportBody(doc, i);
        pageFooter(doc, i);
        console.log(i)
    })
    doc.setProperties({
        title: "Report"
    });
    window.open(doc.output('dataurlnewwindow'));
    return (<></>);
}
export default InvioceReporta5;