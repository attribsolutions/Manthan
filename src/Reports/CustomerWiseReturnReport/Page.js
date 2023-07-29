import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle';
import { loginSystemSetting } from "../../components/Common/CommonFunction";
import { Data } from "./DemoData";



const pageHeder = (doc, data) => {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);     //Title
    style.reportHeder1(doc, data);
    return true;
};

const reportBody = (doc, data) => {
    style.tableBody(doc, data);
};

function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    style.reportFooter(doc, data);

}

const CustomerWiseReturnReport = (data) => {

    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);

    doc.setProperties({
        title: " Customer Wise Return Report"
    });
    const options = { filename: "Customer_Wise_Return_Report" }
    doc.output('dataurlnewwindow', options);
}

export default CustomerWiseReturnReport;