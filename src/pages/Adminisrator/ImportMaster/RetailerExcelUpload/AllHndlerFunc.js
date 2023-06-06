
// import { groupBy } from 'lodash';
import { groupBy, date_ymd_func, date_dmy_func, btnIsDissablefunc, loginPartyID, loginUserID } from '../../../../components/Common/CommonFunction';
import { customAlert } from '../../../../CustomAlert/ConfirmDialog';
import { InvoiceExcelUpload_save_action } from '../../../../store/Administrator/ImportExcelPartyMapRedux/action';

const XLSX = require('xlsx');





//###############################################################################################


export const readExcelFile = async ({ file, compareParameter }) => {


    try {

        processing(5)

        function processing(t) {
        }


        const reader = new FileReader();
        reader.readAsBinaryString(file);

        const jsonResult = await new Promise(function (myResolve, myReject) {

            reader.onload = (e) => {
                try {
                    const bstr = e.target.result;
                    const workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const result = XLSX.utils.sheet_to_json(worksheet);
                    myResolve(result)
                } catch (g) {
                    myReject([])
                }

            }

        });


        let invalidMsg = []
        let count = 0
        const comparefilter = compareParameter.filter(f => (f.Value !== null))
        if (comparefilter.length === 0) {
            invalidMsg.push(`Import filed Not Map`)
        }
        debugger
        jsonResult.forEach((r1, k) => {
            // 
            comparefilter.forEach((c1) => {
                debugger
                if (c1.ControlTypeName === "Date") { r1[c1.Value] = date_ymd_func(r1[c1.Value]) }
                const regExp = RegExp(c1.RegularExpression)

                if (((r1[c1.Value]) || (c1.IsCompulsory))) {

                    if (!(regExp.test(r1[c1.Value]))) {
                        invalidMsg.push(`${c1.Value} :${r1[c1.Value]} is invalid Format`)
                    }

                }
            })
            count = count + (70 / jsonResult.length)
            processing(count)
        })
        if (invalidMsg.length > 0) {
            customAlert({
                Type: 3,
                Message: JSON.stringify(invalidMsg),
            })
            return []
        }

        return jsonResult

    } catch (e) { }

}

//###############################################################################################


export async function retailer_FileDetails({ compareParameter = [], readjson = [] }) {


    const fileFiled = {}

    await compareParameter.forEach(ele => {
        if ((ele.Value !== null)) {
            fileFiled[ele.FieldName] = ele.Value
        }
    })
    debugger

    let invoiceNO = []
    let partyNO = []
    let invoiceDate = []
    let amount = 0

    readjson.forEach((index) => {

        var invoiceFound = invoiceNO.find(i => (i === (index[fileFiled.InvoiceNumber])))
        var partyFound = partyNO.find(i => (i === (index[fileFiled.Party])))
        var dateFound = partyNO.find(i => (i === (index[fileFiled.InvoiceDate])))
        amount = Number(amount) + Number(index[fileFiled.GrandTotal]);

        if ((invoiceFound === undefined)) {
            invoiceNO.push((index[fileFiled.InvoiceNumber]))
        };
        if ((partyFound === undefined)) {
            partyNO.push((index[fileFiled.Party]))
        };
        if ((dateFound === undefined)) {
            invoiceDate.push(date_dmy_func((index[fileFiled.InvoiceDate])))
        };

    })

    const invoice = await groupBy(readjson, (index) => {
        return (index[fileFiled.InvoiceNumber])
    })


    return { fileFiled, invoice, invoiceDate, amount, invoiceNO, partyNO }
}

//###############################################################################################





export const retailer_SaveHandler = async (event, dispatch, compareParameter, readJsonDetail) => {

    event.preventDefault();
    const btnId = event.target.id
    try {
        btnIsDissablefunc({ btnId, state: true })
        const parArr = readJsonDetail.fileFiled
        const outerArr = []

        compareParameter.forEach(ele => {
            if ((ele.Value !== null)) {
                parArr[ele.FieldName] = ele.Value
            }
        })

        readJsonDetail.invoice.forEach(inv => {
            let parentObj;
            let invoiceItems = []
            inv.forEach(ele => {
                parentObj = {
                    "CustomerGSTTin": ele[parArr.CustomerGSTTin] ? ele[parArr.CustomerGSTTin] : '',
                    "GrandTotal": ele[parArr.GrandTotal] ? ele[parArr.GrandTotal] : '',
                    "RoundOffAmount": ele[parArr.RoundOffAmount] ? ele[parArr.RoundOffAmount] : 0,
                    "InvoiceNumber": ele[parArr.InvoiceNumber] ? ele[parArr.InvoiceNumber] : '',
                    "FullInvoiceNumber": ele[parArr.FullInvoiceNumber] ? ele[parArr.FullInvoiceNumber] : '',
                    "Customer": ele[parArr.Customer] ? ele[parArr.Customer] : '',
                    "Party": loginPartyID(),
                    CreatedBy: loginUserID(),
                    UpdatedBy: loginUserID(),
                    "InvoiceDate": ele[parArr.InvoiceDate] ? ele[parArr.InvoiceDate] : '',
                }

                invoiceItems.push({
                    "Item": ele[parArr.Item] ? ele[parArr.Item] : '',
                    "Unit": ele[parArr.Unit] ? ele[parArr.Unit] : '',
                    "BatchCode": ele[parArr.BatchCode] ? ele[parArr.BatchCode] : '',
                    "Quantity": ele[parArr.Quantity] ? ele[parArr.Quantity] : 0,
                    "BatchDate": ele[parArr.BatchDate] ? ele[parArr.BatchDate] : '',
                    "BaseUnitQuantity": ele[parArr.BaseUnitQuantity] ? ele[parArr.BaseUnitQuantity] : '',
                    "LiveBatch": ele[parArr.LiveBatch] ? ele[parArr.LiveBatch] : '',
                    "MRP": ele[parArr.MRP] ? ele[parArr.MRP] : '',
                    "MRPValue": ele[parArr.MRPValue] ? ele[parArr.MRPValue] : '',
                    "Rate": ele[parArr.Rate] ? ele[parArr.Rate] : '',
                    "BasicAmount": ele[parArr.BasicAmount] ? ele[parArr.BasicAmount] : '',
                    "GSTAmount": ele[parArr.GSTAmount] ? ele[parArr.GSTAmount] : '',
                    "GST": ele[parArr.GST] ? ele[parArr.GST] : '',
                    "GSTValue": ele[parArr.GSTValue] ? ele[parArr.GSTValue] : 0,
                    "CGST": ele[parArr.CGST] ? ele[parArr.CGST] : 0,
                    "SGST": ele[parArr.SGST] ? ele[parArr.SGST] : 0,
                    "IGST": ele[parArr.IGST] ? ele[parArr.IGST] : 0,
                    "GSTPercentage": ele[parArr.GSTPercentage] ? ele[parArr.GSTPercentage] : 0,
                    "CGSTPercentage": ele[parArr.CGSTPercentage] ? ele[parArr.CGSTPercentage] : 0,
                    "SGSTPercentage": ele[parArr.SGSTPercentage] ? ele[parArr.SGSTPercentage] : 0,
                    "IGSTPercentage": ele[parArr.IGSTPercentage] ? ele[parArr.IGSTPercentage] : 0,
                    "Amount": ele[parArr.Amount] ? ele[parArr.Amount] : 0,
                    "TaxType": ele[parArr.TaxType] ? ele[parArr.TaxType] : '',
                    "DiscountType": ele[parArr.DiscountType] ? ele[parArr.DiscountType] : '',
                    "Discount": ele[parArr.Discount] ? ele[parArr.Discount] : 0,
                    "DiscountAmount": ele[parArr.DiscountAmount] ? ele[parArr.DiscountAmount] : 0,

                })
            })

            outerArr.push({ ...parentObj, InvoiceItems: invoiceItems })
        });

        const jsonBody = JSON.stringify({ "BulkData": outerArr })
        dispatch(InvoiceExcelUpload_save_action({ jsonBody, btnId }));

    } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
};