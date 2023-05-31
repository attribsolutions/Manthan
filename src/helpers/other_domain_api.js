import axios from "axios"
import { CheckAPIResponse, CommonConsole } from '../components/Common/CommonFunction';
debugger
// const axios = require('axios');
debugger

// export const chitalebandhu_get = (url) => {

//     debugger
//     var config = {
//         method: 'get',
//         url: url,
//         // headers: {}
//     };

//     let response = axios(config).then(response => response.data)
//         .catch(error => error)
//     CommonConsole(response);
//     return response;

// }



export const chitalebandhu_get = (url) => {
    debugger
    axios.get(url)
    .then(res =>  console.log(res.data ))
    .catch(err => console.log(err))

};