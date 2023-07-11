import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data1, dataGenrator } from "./DemoData";
import { compareGSTINState } from "../../components/Common/CommonFunction";
import { E_invoiceQRCode } from "../../helpers/other_domain_api";

var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);                           // Page Border
    style.pageHeder(doc, data);                            // Report Title 
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
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
    style.reportFooter(doc, data);                           //Report Footer
    style.pageFooter(doc, data, islast, array);              //page Footer
}

const InvioceReporta5 = async (data) => {

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





// var myHeaders = new Headers();
// myHeaders.append("Cookie", "AWSALB=pYGleqvgV97xeOq+fhUBr2fR/VmGK219Bup5fSdwkrlayNeJLOKA0rRorYyiOcB0pak0NnhfTI91EGYG90PMP3qrZVQw/GMyKfYH5QGKUkxIUelIcmAiXVl0YePQ; AWSALBCORS=pYGleqvgV97xeOq+fhUBr2fR/VmGK219Bup5fSdwkrlayNeJLOKA0rRorYyiOcB0pak0NnhfTI91EGYG90PMP3qrZVQw/GMyKfYH5QGKUkxIUelIcmAiXVl0YePQ");

// var requestOptions = {
//     method: 'GET',
//     headers: myHeaders,
//     redirect: 'follow'
// };

// fetch("https://pro.mastersindia.co/Einvoiceapis/printQRCode/64a40ecd34dca9247dfa923e", requestOptions)
//     .then(response => response.text())
//     .then(result => {
//         debugger;
//     })
//     .catch(error => {
//         debugger;
//     });
