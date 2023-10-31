import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle';
import { date_dmy_func, loginSystemSetting } from "../../components/Common/CommonFunction";


const pageHeder = (doc, data) => {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);     //Title
    style.reportHeder1(doc, data);
    style.reportHeder3(doc, data);    //Invoice ID , Date
    return true;
};

const reportBody = (doc, data) => {
    style.tableBody(doc, data);
};

function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    if (data.PrintType) {
        style.reportFooterForA5(doc, data);

    } else {
        style.reportFooter(doc, data);

    }

}

const ReturnReport = (data) => {
    
    const systemSetting = loginSystemSetting();
    data["PrintType"] = (systemSetting.ReturnA4Print === "1" ? false : true)
    if (systemSetting.ReturnA4Print === "1") {
        var doc = new jsPDF('p', 'pt', 'a4');
    } else {
        var doc = new jsPDF('l', 'pt', 'a5');
    }
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);

    doc.setProperties({
        title: `Return Report (${date_dmy_func(data.ReturnDate)}) `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        const options = { filename: "ReturnReport" }
        window.open(pdfUrl, options);
    }
    generateSaveAndOpenPDFReport();
}


export default ReturnReport;