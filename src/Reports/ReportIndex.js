import InvioceReport from "./InvioceReport/Page";
import ordeRreport from "./OrderReport/Page";
import ProductionReport from "./ProductionReport/Page";
import Production from "./ProductionReport/Page";


export const order1 = "order1"
export const invoice = "invoice"
export const Production1 = "Production1"
debugger
const generateReport = (resp) => {
    switch (resp.ReportType) {
        case order1:
            ordeRreport(resp.Data)
            break;

        case invoice:
            InvioceReport(resp.Data)
            // ordeRreport(resp.Data)
            break;

        case Production1:
            ProductionReport(resp.Data)
            break;

        default:
            break;
    }
}
export default generateReport;