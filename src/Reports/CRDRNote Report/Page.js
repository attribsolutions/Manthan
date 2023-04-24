import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data, dataGenrator } from "./DemoData";

var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);                           // Page Border
    style.pageHeder(doc, data);                            // Report Title 
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
    style.reportHeder3(doc, data);                          //Invoice ID , Date 
};

function reportBody(doc, data) {
    style.tableBody(doc, data);                              //table Body
    // style.pageBorder(doc, data);                           // Page Border
    // style.pageFooter(doc, data, islast, array);              //page Footer

}
function pageFooter(doc, data, islast, array) {
    style.reportFooter(doc, data);                           //Report Footer
    style.pageFooter(doc, data, islast, array);              //page Footer
}

const CreditNote = (data) => {
    debugger
    //    const data =  dataGenrator()
    var doc = new jsPDF('l', 'pt', 'a5');
    // const array = dataGenrator()
        pageHeder(doc, data);
        reportBody(doc, data);
        pageFooter(doc, data);

    // doc.deletePage(1)
    doc.setProperties({
        title: "Report"
    });
    // window.open(doc.output('dataurlnewwindow'));
    doc.output('dataurlnewwindow');
    return (<></>);
}
export default CreditNote;