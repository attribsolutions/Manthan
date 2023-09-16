import axios from "axios"


export const chitalebandhu_get = async () => {
    let url = "/FoodERPWebAPIPOS/api/SAPDataSendToSCM/GetSAPCustomerLedgerList?FromDate=2023-05-22&ToDate=2023-05-25&SAPCode=500023"

    return axios.get(`/chitaleApi${url}`).then(response => response.data)
};

export const sapApi_post = async (abc, body) => {

    var config = {
        method: 'post',
        url: '/sapApi/sap/opu/odata/sap/ZCBM_OD_SD_CSCMFOODERP_SRV/OrderHeaderSet',
        headers: {
            'X-Requested-With': 'X',
            'Authorization': 'Basic SW50ZXJmYWNlOkFkbWluQDEyMzQ=',
            'Content-Type': 'application/json',
            'Cookie': 'SAP_SESSIONID_CSP_900=jOHNTLeVip1UwHDneeeC-49rx4__dBHtptICAEHiAA8%3d; sap-usercontext=sap-client=900'
        },
        data: body
    };
    console.log("sapApi_post", body)
    return axios(config)
        .then(response => response.data)
};

// export const E_invoiceQRCode = async () => {

//     let url = "/Einvoiceapis/printQRCode/64a40ecd34dca9247dfa923e"

//     var a = await axios.get(`/E_invoiceQRCode${url}`).then(response => response.data).catch((w) => w)


//     // console.log("HJKKFDGHJKLFGHJK   E_invoiceQRCode****", a)
//     return a
// };

// E_invoiceQRCode()
// curl --insecure https://pro.mastersindia.co