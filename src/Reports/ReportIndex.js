import InvioceReport from "./InvioceReport/Page";
import ordeRreport from "./OrderReport/Page";
import StockReport from "./StockReport/Page";
import MaterialReport from "./MaterialReport/Page";
import VanLoadingSheet from "./Van Loading Party Wise InvoiceList/Page";
import Receipts from "./Receipts/Page";
import CreditNote from "./CRDRNote Report/Page";
import PartyLedgerReport from "./PratyLedger/Page";



export const order1 = "order1"
export const invoice = "invoice"
export const Stock = "Stock"
export const Materialreport1 = "Materialreport1"
export const IBinvoice = "IBinvoice"
export const VanLoadingSheetSKU = "VanLoadingSheetSKU"
export const VanLoadingPartyWiseInvoice = "VanLoadingPartyWiseInvoice"

export const Receipt = "Receipt"
export const Credit = "Credit"
export const PartyLedger = "PartyLedger"


const generateReport = (resp) => {

    switch (resp.ReportType) {
        case order1:
            ordeRreport(resp.Data)
            break;
        case invoice:
            InvioceReport(resp.Data)
            break;
        case Stock:
            StockReport(resp.Data)
            break;
        case Materialreport1:
            MaterialReport(resp.Data)
            break;
        case IBinvoice:
            InvioceReport(resp.Data)
            break;
        case VanLoadingPartyWiseInvoice:
            VanLoadingSheet(resp.Data)
            break;
      
        case Receipt:
            Receipts(resp.Data)
            break;
        case Credit:
            CreditNote(resp.Data)
            break;
        case PartyLedger:
            PartyLedgerReport(resp.Data)
            break;

        default:
            break;
    }
}


export default generateReport;