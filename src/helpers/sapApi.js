

export async function orderApporval(body, btnId,) {
    debugger
    var axios = require('axios');
    var data = JSON.stringify({
        "Customer": "500581",
        "DocDate": "04.05.2023",
        "Indicator": "F",
        "OrderNo": "127407",
        "Stats": "1",
        "OrderItemSet": [
            {
                "OrderNo": "127407",
                "ItemNo": "3706465",
                "Material": "1200249",
                "Quantity": "10.000",
                "Unit": "KG",
                "Plant": "IW03",
                "Batch": ""
            }
        ],
        "CancelFlag": " "
    });

    const username = 'Interface';
    const password = 'Admin@1234';

    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    var config = {
        method: 'post',
        url: 'http://cbms4prdapp.chitalebandhu.net.in:8000/sap/opu/odata/sap/ZCBM_OD_SD_CSCMFOODERP_SRV/OrderHeaderSet',
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            'X-Requested-With': 'x',
            'Authorization': basicAuth,
            'Content-Type': 'application/json',
            'Cookie': 'SAP_SESSIONID_CSP_900=ntvo5dIY7ZtkSuAHyepZgQd5M5_vFRHtptICAEHiAA8%3d; sap-usercontext=sap-client=900'
        },
        data: data,
        withCredentials: true
    };

    debugger
    
    axios(config)
        .then(function (response) {
            debugger
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            debugger
            console.log(error);
        });

}