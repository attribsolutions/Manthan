import SERVER_HOST_PATH from "../../../helpers/_serverPath";
import { FRENCHIESE_DAILY_SALE_REPORT, FRENCHIESE_MOBILE_CUSTOMER } from "../../../helpers/url_helper";

export const GetDailySaleData = async ({ fromDate, toDate, Party_Id }) => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic U3dlZXRQT1NVc2VyOjEyMzQ=");

    const jsonBody = JSON.stringify({
        "FromDate": fromDate,
        "ToDate": toDate,
        "Party": Number(Party_Id),
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: jsonBody,
        redirect: "follow"
    };

    const Response = await fetch(`${SERVER_HOST_PATH}${FRENCHIESE_DAILY_SALE_REPORT}`, requestOptions)
    const jsonData = await Response.json();

    return jsonData

};

export const CustomerMobileView = async ({ Mobile, IsLinkToBill, MacID, Party, CreatedOn }) => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic U3dlZXRQT1NVc2VyOjEyMzQ=");

    const jsonBody = JSON.stringify({
        "Mobile": Mobile,
        "IsLinkToBill": IsLinkToBill,
        "MacID": MacID,
        "Party": Party,
        "CreatedOn": CreatedOn

    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: jsonBody,
        redirect: "follow"
    };

    const Response = await fetch(`${SERVER_HOST_PATH}${FRENCHIESE_MOBILE_CUSTOMER}`, requestOptions)
    const jsonData = await Response.json();

    return jsonData

};


export const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;

};



export function convertTo12Hour(time) {
    let [hours, minutes, seconds] = time.split(':').map(Number);
    let period = 'AM';

    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) {
            hours -= 12;
        }
    } else if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
}











