import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { compareGSTINState, loginSystemSetting, loginUserDetails } from "../../components/Common/CommonFunction";
import { AMERICA_ID } from "../../HardCodeID/contryID";


var pageHeder = function (doc, data) {
    const IsA4Print = Number(loginSystemSetting().OrderA4Print)
    if (IsA4Print) {
        style.pageBorder(doc, data);
    } else {
        style.pageBorder_A5(doc, data);

    }


    style.pageHeder(doc, data);
    style.reportHeder1(doc, data);
    style.reportHeder3(doc, data);
};

function reportBody(doc, data) {

    const isIGST = compareGSTINState(data.CustomerGSTIN, data.SupplierGSTIN)
    if (isIGST) {
        style.tableBodyWithIGST(doc, data);
    } else if (data.isAmerica) {
        style.tableBodyForAmericanOrder(doc, data)
    } else {

        style.tableBody(doc, data);
    }

}

function pageFooter(doc, data) {
    const IsA4Print = Number(loginSystemSetting().OrderA4Print)
    if (IsA4Print) {
        style.pageFooter(doc, data);
    } else {
        style.pageFooter_A5(doc, data);

    }


}



const ordeRreport = (data) => {
    const IsA4Print = Number(loginSystemSetting().OrderA4Print)
    data = { ...data[0] }

    let i = {
        SAPOrderNo: data?.SAPOrderNo || "", // Default to an empty string if null or undefined
        FullOrderNumber: data?.FullOrderNumber || "", // Default to an empty string if null or undefined
    };

    if (i.SAPOrderNo) {
        var numb = i.SAPOrderNo.match(/\d/g);
        i.SAPOrderNo = numb ? numb.join("") : ""; // Join digits if found, else default to an empty string
    }

    data["FullOrderNumber"] = i.SAPOrderNo
        ? `${i.FullOrderNumber} (${i.SAPOrderNo})`
        : i.FullOrderNumber; // If SAPOrderNo is empty, show only FullOrderNumber


    data["isAmerica"] = loginUserDetails().Country_id === AMERICA_ID

    let doc = {}
    if (IsA4Print) {
        doc = new jsPDF('p', 'pt', 'a4');
    } else {
        doc = new jsPDF('l', 'pt', 'a5');
    }


    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
    doc.setProperties({
        title: `POReport/${data.OrderDate}-${data.CustomerName} `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}
export default ordeRreport;