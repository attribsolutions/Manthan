import ordeRreport from "./OrderReport/Page";

export const order1="order1"
export const order2="order2"


const generateReport = (resp) => {

    switch (resp.ReportType) {
        case order1:
            ordeRreport(resp.Data)
            break;

            case order2:
            ordeRreport(resp.Data)
            break;

        default:
            break;
    }
}
export default generateReport;