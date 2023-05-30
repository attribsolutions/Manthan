import { CommonConsole } from '../components/Common/CommonFunction';

const axios = require('axios');

export const chitalebandhu_get = (url) => {
    var config = {
        method: 'get',
        url: url,
        headers: {}
    };
    let response = axios(config).then(response => response.data)
        .catch(error => error)
    CommonConsole(response);
    return response
}