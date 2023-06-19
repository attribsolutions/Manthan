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

const InvioceReporta5 = (data) => {
    const Data = []
    Data.push(data)
    var doc = new jsPDF('l', 'pt', 'a5');
    // const array = dataGenrator()
    Data.forEach((data, islast, array) => {
        pageHeder(doc, data);
        reportBody(doc, data);
        pageFooter(doc, data, islast, array);
        if (!(array.length - 1 === islast)) {
            doc.addPage();
        }
    })
    // doc.deletePage(1)
    doc.setProperties({
        title: "Report"
    });

    const options = { filename: "Invoice Report" }
    doc.output('dataurlnewwindow', options);
    return (<></>);
}
export default InvioceReporta5;