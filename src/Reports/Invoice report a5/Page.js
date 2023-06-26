import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data1, dataGenrator } from "./DemoData";

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

    var doc = new jsPDF('l', 'pt', 'a5');

    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i].SettingData = data.SettingData;
        }

        data.forEach((data, islast, array) => {
            pageHeder(doc, data);
            reportBody(doc, data);                                   // condition for Mulitinvoice invoice
            pageFooter(doc, data, islast, array);
            if (!(array.length - 1 === islast)) {
                doc.addPage();
            }
        })
    } else {

        const Data = []
        Data.push(data)
        Data.forEach((data, islast, array) => {
            pageHeder(doc, data);                                    // condition for singel invoice
            reportBody(doc, data);
            pageFooter(doc, data, islast, array);
            if (!(array.length - 1 === islast)) {
                doc.addPage();
            }
        })
    }


    doc.setProperties({
        title: " Invoice Report"
    });

    // const options = { filename: "Invoice Report" }
    doc.output('dataurlnewwindow', { filename: "Invoice Report" });
    return (<></>);
}
export default InvioceReporta5;