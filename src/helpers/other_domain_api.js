import { CommonConsole } from '../components/Common/CommonFunction';
debugger
const axios = require('axios');
debugger
export const chitalebandhu_get = async (url) => {
    debugger
    var config = {
        method: 'get',
        url: url,
        headers: {}
    };

   

    let response = axios.get(url).then(response => response.data)
        .catch(error => error)
    CommonConsole(response);
    return response;

}