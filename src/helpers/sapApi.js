var axios = require('axios');

export function orderApporval(body, btnId,) {
    debugger

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

    const token = `${"Interface"}:${"Admin@1234"}`;
    const encodedToken = Buffer.from(token).toString('base64');

    var config = {
        method: 'post',
        url: 'http://cbms4prdapp.chitalebandhu.net.in:8000/sap/opu/odata/sap/ZCBM_OD_SD_CSCMFOODERP_SRV/OrderHeaderSet',
        headers: {
            'X-Requested-With': 'x',
            'Authorization': 'Basic ' + encodedToken,
            // 'Authorization': 'Basic SW50ZXJmYWNlOkFkbWluQDEyMzQ=',
            'Content-Type': 'application/json',
            'Cookie': 'SAP_SESSIONID_CSP_900=Jpz_uthylLnY5mC03KrCDSFzrvHuTRHtptICAEHiAA8%3d; sap-usercontext=sap-client=900'
        },
        data: data
    };


    const session_url = 'http://cbms4prdapp.chitalebandhu.net.in:8000/sap/opu/odata/sap/ZCBM_OD_SD_CSCMFOODERP_SRV/OrderHeaderSet';
    const username = 'Interface';
    const password = 'Admin@1234';
    const credentials = btoa(username + ':' + password);

    const headers = {
        'X-Requested-With': 'x',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
    }
    axios.get(session_url, {}, {
        headers: { headers },
        auth: { username: username, password: password }
    }).then(function (data) {
        debugger
        console.log(data);
        console.log(headers);
    }).catch(function (error) {
        debugger
        console.log('Error on Authentication');
        //console.log(username);
    });

}