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




export const chitalebandhu_get = async (url) => {
    
    try {
        debugger
      await  axios.get(url).then((response) => {
            debugger
            // setPost(response.data);
            console.log(response)
            return response
        });
        debugger
    } catch (error) {
        console.error(error);
    }
};