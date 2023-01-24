import InvioceReport from "./InvioceReport/Page";
import ordeRreport from "./OrderReport/Page";

export const order1 = "order1"
export const invoice = "invoice"


const generateReport = (resp) => {
    switch (resp.ReportType) {
        case order1:
            ordeRreport(resp.Data)
            break;

        case invoice:
            InvioceReport(resp.Data)
            // ordeRreport(resp.Data)
            break;

        default:
            break;
    }
}
export default generateReport;