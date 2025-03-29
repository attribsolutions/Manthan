import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { date_dmy_func, loginUserDetails } from "../../../components/Common/CommonFunction";

import data from "./data.json"

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
    style.reportFooter(doc, data);
}


const generateReportPage = (doc, data) => {
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
}


const PeriodicGRNReport = (Data) => {
    debugger
    var doc = new jsPDF('l', 'pt', 'a4');
    generateReportPage(doc, Data);
    doc.setProperties({
        title: `Periodic GRN Report From ${date_dmy_func(Data.FromDate)} To ${date_dmy_func(Data.ToDate)} Party (${loginUserDetails().PartyName})`
    });


    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));

        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

};



export default PeriodicGRNReport;