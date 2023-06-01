import axios from "axios"

debugger
export const chitalebandhu_get = async () => {
    let url = "/FoodERPWebAPIPOS/api/SAPDataSendToSCM/GetSAPCustomerLedgerList?FromDate=2023-05-22&ToDate=2023-05-25&SAPCode=500023"

    return axios.get(`/chitaleApi${url}`).then(response => response.data)
    
debugger

};

export const sapApi_post = async (abc, body) => {
    debugger

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