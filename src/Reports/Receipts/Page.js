import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'
import { Data } from "./DemoData";


var pageHeder = function (doc,data) {
    style.pageBorder(doc,data);  
};
function reportBody(doc, data) { 
    style.Receipts(doc,data);  

 
}
function pageFooter(doc,data) {
    style.pageFooter(doc,data);
}

 const Receipts=(data)=> {
    
    var doc = new jsPDF('l', 'pt', 'a5');
    pageHeder(doc,data);
    reportBody(doc, data);
    pageFooter(doc,data);
     doc.setProperties({
          title: "Report"
      });
    // window.open('dataurlnewwindow');
    
    const options = { filename: "Receipt Report" ,}
    doc.output('dataurlnewwindow', options);

    // return(<></>);
}
export default Receipts;