import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle';
import { compareGSTINState } from "../../components/Common/CommonFunction";

const pageHeder = (doc, data) => {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);     //Title
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
    style.reportHeder3(doc, data);    //Invoice ID , Date
    return true;
};

const reportBody = (doc, data) => {
    const isIGST = compareGSTINState(data.CustomerGSTIN, data.PartyGSTIN);
    if (isIGST) {
        style.tableBodyWithIGST(doc, data); //table Body
    } else {
        style.tableBody(doc, data);
    }
};

function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    style.reportFooter(doc, data);
}

const InvioceReport = async (data) => {
    if (data.InvoiceUploads.length > 0) {
        if (data.InvoiceUploads[0].QRCodeUrl !== null) {
            data["isQR"] = true;
        } else {
            data["isQR"] = false;
        }
    }
    var doc = new jsPDF('p', 'pt', 'a4');

    if (data.InvoiceUploads.length > 0) {
        const url = data.InvoiceUploads[0].QRCodeUrl;
        let desiredPart = null;

        try {
            const urlObject = new URL(url);
            desiredPart = urlObject.pathname;
        } catch (w) { }

        const image = await loadImage(`/E_invoiceQRCode${desiredPart}`);
        if (image) {
            doc.addImage(image, 'JPEG', 323, 18, 83, 83);
        } else {
            doc.text('Image Not Found', 323, 18);
        }
    }

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = url;
        });
    }
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);

    doc.setProperties({
        title: "Report"
    });
    const options = { filename: "Invoice Report" }
    doc.output('dataurlnewwindow', options);
    return (<></>);
}
export default InvioceReport;