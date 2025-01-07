import jsPDF from "jspdf";
import "jspdf-autotable";
import * as style from './ReportStyle'

var pageHeder = function (doc, data) {
    style.pageBorder(doc, data);
    style.pageHeder(doc, data);
    style.reportHeder1(doc, data);
    style.reportHeder2(doc, data);
};

function reportBody(doc, data) {
    debugger
    if (data.Period.isChecked) {
        style.tableBodyWithUnit(doc, data)
    } else {
        style.tableBody(doc, data);
    }
}

const ordeItemSupplierReport = (data) => {
    debugger
    const flattenSupplierData = (data) => {
        let result = [];
        data.forEach(supplier => {

            supplier.ItemDetails.forEach(item => {
                result.push({
                    SupplierName: supplier.SupplierName,
                    SKUName: item.SKUName,
                    QtyInNo: item.QtyInNo,
                    QtyInKg: item.QtyInKg,
                    QtyInBox: item.QtyInBox,
                    QuantityWithUnit: `${item.Quantity} ${item.Unit}`
                });
            });
        });
        result["Period"] = data[0].Period
        return result;

    };

    const ModifyData = flattenSupplierData(data);

    var doc = new jsPDF('p', 'pt', 'a4');
    pageHeder(doc, ModifyData);
    reportBody(doc, ModifyData);

    doc.setProperties({
        title: `Order Item Supplier Report`
    });

    function generateSaveAndOpenPDFReport() {
        const pdfUrl = URL.createObjectURL(doc.output('blob'));
        window.open(pdfUrl);
    }
    generateSaveAndOpenPDFReport();

}
export default ordeItemSupplierReport;