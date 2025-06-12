import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle';
import { compareGSTINState, IsSweetAndSnacksCompany, loginSystemSetting, loginUserDetails } from "../../components/Common/CommonFunction";
import InvioceReporta5 from "../InvoiceA5PDFReport/Page";
import { AMERICA_ID } from "../../HardCodeID/contryID";
import QRCode from "qrcode"; // Generates the QR code as an image




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
    const isSweetAndSnacksCompany = IsSweetAndSnacksCompany()

    if (isIGST) {
        if (isSweetAndSnacksCompany) {
            style.tableBodyWith_IGST_forSweetAndSnacks(doc, data); //table Body for Sweet and Snacks Company
        } else {
            style.tableBodyWithIGST(doc, data); //table Body
        }
    } else if (data.isAmerica) {
        style.tableBodyForAmericanInvoice(doc, data)
    } else {
        if (isSweetAndSnacksCompany) {
            style.tableBodyWith_CGST_SGST_forSweetAndSnacks(doc, data);
        } else {
            style.tableBody(doc, data);
        }
    }
};

function pageFooter(doc, data) {
    style.pageFooter(doc, data);
    style.reportFooter(doc, data);
}

const invioceReport_A4 = async (data) => {
    data["isAmerica"] = loginUserDetails().Country_id === AMERICA_ID
    if (data.InvoiceUploads?.length > 0) {
        if (data.InvoiceUploads[0].QRCodeUrl !== null) {
            data["isQR"] = true;
        } else {
            data["isQR"] = false;
        }
    }
    var doc = new jsPDF('p', 'pt', 'a4');

    if (data.InvoiceUploads?.length > 0) {
        try {
            if (data.InvoiceUploads.length > 0) {

                const url = data.InvoiceUploads[0].QRCodeUrl;
                let desiredPart = null;
                const urlObject = new URL(url);
                desiredPart = urlObject.pathname;

                if (urlObject.host !== "pro.mastersindia.co") {
                    doc.addImage(url, 'JPEG', 323, 18, 83, 83);
                } else {
                    doc.addImage(`/E_invoiceQRCode${desiredPart}`, 'JPEG', 323, 18, 83, 83);

                    const image = await loadImage(`/E_invoiceQRCode${desiredPart}`);

                    if (image) {
                        doc.addImage(image.currentSrc, 'JPEG', 323, 18, 83, 83);
                    } else {
                        doc.text('Image Not Found', 323, 18);
                    }
                }

            }

        } catch (w) { }
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

    if (IsSweetAndSnacksCompany()) {
        const qrCodeImage = await QRCode.toDataURL(data.FullInvoiceNumber);
        doc.addImage(qrCodeImage, "PNG", 344, 738, 90, 76, null, 'FAST');
    }

    doc.setProperties({
        title: `InvoiceReport/${data.InvoiceDate}-${data.CustomerName} `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();
}

const InvioceReport = (data) => {

    const SettingData = loginSystemSetting();
    data["SettingData"] = SettingData;

    if (SettingData.A4Print === "1" && !data.forceA5) {
        invioceReport_A4(data)
    } else {
        InvioceReporta5(data)
    }

}

export default InvioceReport;


