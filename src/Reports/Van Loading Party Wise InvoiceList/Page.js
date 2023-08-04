import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data } from "./DemoData";
import { date_dmy_func } from "../../components/Common/CommonFunction";

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
    //     style.reportFooter(doc,data);
}

const VanLoadingSheet = (data) => {

    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
    doc.setProperties({
        title: `Loading Sheet Report ${date_dmy_func(data.PartyDetails.Date)} Party(${data.PartyDetails.Party}) `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        const options = { filename: `LoadingSheet_Report/${data.PartyDetails.Date}-${data.PartyDetails.Party}` }
        window.open(pdfUrl, options);
    }
    generateSaveAndOpenPDFReport();

    // return(<></>);
}
export default VanLoadingSheet;