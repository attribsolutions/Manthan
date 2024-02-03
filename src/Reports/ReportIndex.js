import InvioceReport from "./InvioceA4PDFReport/Page";
import ordeRreport from "./OrderPDFReport/Page";
import StockReport from "./StockReport/PDFReport/Page";
import ItemRegisterReport from "./ItemRegisterReport/PDFReport/Page";
import VanLoadingSheet from "./Van Loading Party Wise InvoiceList/Page";
import Receipts from "./ReceiptsPDFReport/Page";
import CreditNote from "./CreditDebitPDFReport/Page";
import PartyLedgerReport from "./PratyLedger/PDFReport/Page";
import ReturnReport from "./ReturnReport/PDFReport/Page";
import MasterClaimReport from "./ClaimSummary/PDFReport/MasterClaimReport/Page";
import ItemWiseClaimReport from "./ClaimSummary/PDFReport/ItemWiseClaimReport/Page";
import CustomerWiseClaimReport from "./ClaimSummary/PDFReport/CustomerWiseClaimReport/Page";


export const order1 = "order1"
export const invoice = "invoice"
export const Stock = "Stock"
export const ItemRegister = "ItemRegisterReport"
export const IBinvoice = "IBinvoice"
export const VanLoadingSheetSKU = "VanLoadingSheetSKU"
export const VanLoadingPartyWiseInvoice = "VanLoadingPartyWiseInvoice"
export const Receipt = "Receipt"
export const Credit = "Credit"
export const PartyLedger = "PartyLedger"
export const Return = "Return"
export const MasterClaim = "MasterClaim"
export const ItemWiseClaim = "ItemWiseClaim"
export const CustomerWiseClaim = "CustomerWiseClaim"



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
        case ItemRegister:
            ItemRegisterReport(resp.Data)
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
        case Return:
            ReturnReport(resp.Data)
            break;
        case MasterClaim:
            MasterClaimReport(resp.Data)
            break;
        case ItemWiseClaim:
            ItemWiseClaimReport(resp.Data)
            break;
        case CustomerWiseClaim:
            CustomerWiseClaimReport(resp.Data)
            break;


        default:
            break;
    }
}


export default generateReport;