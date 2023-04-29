import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'

var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);                           // Page Border
    style.pageHeder(doc, data);                            // Report Title 
    style.reportHeder1(doc, data);                        //Invoice ID , Date 
};

function reportBody(doc, data) {
    if (data.NoteType === "CreditNote") {
        style.tableBodyforCredit(doc, data);                              //table Body
    } else {
        style.tableBodyforCreditGoods(doc, data);                              //table Body
    }
}

function pageFooter(doc, data, islast, array) {
    if (data.NoteType === "CreditNote") {
        style.reportFooterForCredit(doc, data);                //Report Footer    
    } else {
        style.reportFooterForGoodsCredit(doc, data);
    }
    style.pageFooter(doc, data, islast, array);              //page Footer
}

const CreditNote = (data) => {
    //   const data  = dataGenrator()
    var doc = new jsPDF('l', 'pt', 'a5');
    pageHeder(doc, data);
    reportBody(doc, data);
    pageFooter(doc, data);
    doc.setProperties({
        title: "Report"
    });
    const options = { filename: "Credit Debit Report" }
    doc.output('dataurlnewwindow', options);
    return (<></>);
}
export default CreditNote;