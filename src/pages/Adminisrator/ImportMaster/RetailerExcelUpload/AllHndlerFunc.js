
// import { groupBy } from 'lodash';
import { groupBy, date_dmy_func, btnIsDissablefunc,  loginUserID, loginCompanyID } from '../../../../components/Common/CommonFunction';
import {  RetailerExcelUpload_save_action } from '../../../../store/Administrator/ImportExcelPartyMapRedux/action';



export async function retailer_FileDetails({ compareParameter = [], readjson = [], }) {


    const fileFiled = {}

    await compareParameter.forEach(ele => {
        if ((ele.Value !== null)) {
            fileFiled[ele.FieldName] = ele.Value
        }
    })


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





export const retailer_SaveHandler = async ({
    event,
    dispatch,
    compareParameter,
    readJsonDetail,
    partySelect,
    priceListSelect,
    retailerId }) => {


    event.preventDefault();
    const btnId = event.target.id
    try {
        btnIsDissablefunc({ btnId, state: true })
        const parArr = {}

        await compareParameter.forEach(ele => {
            if ((ele.Value !== null)) {
                parArr[ele.FieldName] = ele.Value
            }
        })
        const outerArr = []



        readJsonDetail.forEach(ele => {
            var a = {
                "Name": ele[parArr.Name] ? ele[parArr.Name] : "",
                "PriceList": priceListSelect.value,
                "PartyType": retailerId,
                "Company": loginCompanyID(),
                "PAN": ele[parArr.PAN] ? ele[parArr.PAN] : "",
                "Email": ele[parArr.Email] ? ele[parArr.Email] : "",
                "MobileNo": ele[parArr.MobileNo] ? ele[parArr.MobileNo] : "",
                "AlternateContactNo": ele[parArr.AlternateContactNo] ? ele[parArr.AlternateContactNo] : "",
                "State": ele[parArr.State] ? ele[parArr.State] : "",
                "District": ele[parArr.District] ? ele[parArr.District] : "",
                "City": ele[parArr.City] ? ele[parArr.City] : "",
                "GSTIN": ele[parArr.GSTIN] ? ele[parArr.GSTIN] : "",
                "MkUpMkDn": ele[parArr.MkUpMkDn] ? ele[parArr.MkUpMkDn] : false,
                "CreatedBy": loginUserID(),
                "UpdatedBy": loginUserID(),
                "PartySubParty": [
                    {
                        "Party": partySelect.value,
                        "CreatedBy": loginUserID(),
                        "UpdatedBy": loginUserID(),
                        "Route": ele[parArr.Route] ? ele[parArr.Route] : "",
                    }
                ],
                "PartyAddress": [
                    {
                        "Address": ele[parArr.Address] ? ele[parArr.Address] : "",
                        "FSSAINo": ele[parArr.FSSAINo] ? ele[parArr.FSSAINo] : "",
                        "FSSAIExipry": ele[parArr.FSSAIExipry] ? ele[parArr.FSSAIExipry] : "",
                        "PIN": ele[parArr.PIN] ? ele[parArr.PIN] : "",
                        "IsDefault": ele[parArr.IsDefault] ? ele[parArr.IsDefault] : true,
                        "fssaidocument": ele[parArr.fssaidocument] ? ele[parArr.fssaidocument] : "",
                    }
                ],
                "PartyPrefix": [
                    {
                        "Orderprefix": "",
                        "Invoiceprefix": "",
                        "Grnprefix": "",
                        "Receiptprefix": "",
                        "WorkOrderprefix": "",
                        "MaterialIssueprefix": "",
                        "Demandprefix": "",
                        "IBChallanprefix": "",
                        "IBInwardprefix": ""
                    }
                ]
            }

            outerArr.push(a)

        });

        const jsonBody = JSON.stringify({ "BulkData": outerArr })
        dispatch(RetailerExcelUpload_save_action({ jsonBody, btnId }));

    } catch (e) { btnIsDissablefunc({ btnId, state: false }) }
};