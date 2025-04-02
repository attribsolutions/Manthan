import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { date_dmy_func, IsSweetAndSnacksCompany } from "../../../components/Common/CommonFunction";


var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);     //Title
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
    style.reportHeder3(doc, data);    //Invoice ID , Date  

};
function reportBody(doc, data) {
    if (IsSweetAndSnacksCompany()) {
        style.tableBody_for_ChitaleSweetsAndSnacks(doc, data);
    } else {
        style.tableBody(doc, data);
    }
}
function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    style.reportFooter(doc, data);
}

// const StockReport = (stockdata) => {

//     const data = stockdata[0]

//     var doc = new jsPDF('l', 'pt', 'a4');
//     pageHeder(doc, data);
//     reportBody(doc, data);
//     pageFooter(doc, data);
//     doc.setProperties({
//         title: `Stock_Report From  ${date_dmy_func(data.FromDate)} To ${date_dmy_func(data.ToDate)} Party (${data.PartyName})`
//     });
//     function generateSaveAndOpenPDFReport() {
//         const pdfUrl = URL.createObjectURL(doc.output('blob'));
//         // const options = { filename: `Stock_Report/${data.PartyName}/${date_dmy_func()}` }
//         window.open(pdfUrl);
//     }
//     generateSaveAndOpenPDFReport();
// }

const generateReportPage = (doc, data) => {
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
}



const StockReport = (Data) => {
    var doc = new jsPDF('l', 'pt', 'a4');
    Data.forEach((data, index) => {
        if (index !== 0) {  // Add a new page only after the first iteration
            doc.addPage();
        }
        generateReportPage(doc, data);
        doc.setProperties({
            title: `Stock_Report From ${date_dmy_func(data.FromDate)} To ${date_dmy_func(data.ToDate)} Party (${data.PartyName})`
        });
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        // const options = { filename: `Stock_Report/${data.PartyName}/${date_dmy_func()}` }
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

};













export default StockReport;