

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data1, dataGenrator } from "./DemoData";
import { compareGSTINState, date_dmy_func, } from "../../components/Common/CommonFunction";
import { pageBorder } from "../InvioceReport/ReportStyle";


var pageHeder = function (doc, data) {
    if (data.isA4) {
        style.pageBorderA4(doc)
    } else {
        style.pageBorder(doc, data);                           // Page Border
    }
    style.pageHeder(doc, data);                            // Report Title 
    style.reportHeder1(doc, data);
    style.reportHeder3(doc, data);                          //Invoice ID , Date 
};



function reportBody(doc, data) {
    const isIGST = compareGSTINState(data.CustomerGSTIN, data.PartyGSTIN)
    if (isIGST) {
        style.tableBodyWithIGST(doc, data);                 //table Body
    } else {
        style.tableBody(doc, data);
    }
}

function pageFooter(doc, data, islast, array) {
    if ((data.NoteType === "DebitNote")) {
        if (data.isA4) {
            style.reportFooterForPlainCredit_DebitA4(doc, data)
        } else {
            style.reportFooterForPlainCredit_Debit(doc, data);                           //Report Footer
        }
    } else {
        if (data.isA4) {
            style.reportFooterA4(doc, data)
        } else {
            style.reportFooter(doc, data);                           //Report Footer
        }
    }
    style.pageFooter(doc, data, islast, array);              //page Footer
}

const generateReportPage = (doc, data) => {
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
}

const CreditNote = async (data) => {

    let doc = ""
    if (data.SettingData === "1") {
        data["isA4"] = true
        doc = new jsPDF('p', 'pt', 'a4');
    } else {
        data["isA4"] = false
        doc = new jsPDF('l', 'pt', 'a5');
    }

    if (data.CRDRNoteUploads.length > 0) {

        if (data.CRDRNoteUploads[0].QRCodeUrl !== null) {
            if (data.isA4) {
                data["isQR"] = true;
            } else {
                data["isQR"] = false;
            }
        } else {
            data["isQR"] = false;
        }
        try {
            if (data.CRDRNoteUploads.length > 0) {
                const url = data.CRDRNoteUploads[0].QRCodeUrl;
                let desiredPart = null;
                const urlObject = new URL(url);
                desiredPart = urlObject.pathname;
                if (urlObject.host !== "pro.mastersindia.co") {
                    data["url"] = url
                } else {
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




    const Data = [data];
    Data.forEach((item, index) => {
        generateReportPage(doc, item);
        if (index !== Data.length - 1) {
            doc.addPage();
        }
    });


    doc.setProperties({
        title: `Credit Note Report /${data.Customer}/${date_dmy_func(data.CRDRNoteDate)} `
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}

export default CreditNote;
