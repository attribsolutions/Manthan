import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { CommonBreadcrumbDetails } from "../../store/actions";
import { createBrowserHistory } from 'history';
import * as mode from "../../routes/PageMode"
import $ from 'jquery';


export const history = createBrowserHistory();



function isDateInitial(isdate) {
  const dateInstance = isdate ? new Date(isdate) : new Date();
  const dd = String(dateInstance.getDate()).padStart(2, '0');
  const mm = String(dateInstance.getMonth() + 1).padStart(2, '0');
  const yy = dateInstance.getFullYear();
  const hours = String(dateInstance.getHours()).padStart(2, '0');
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0');
  const seconds = String(dateInstance.getSeconds()).padStart(2, '0');

  return { dd, mm, yy, hours, minutes, seconds, dateInstance };
}

export const date_ymd_func = (isdate) => { //+++++++++++++++ Current Date by format (yyyy-dd-mm) ++++++++++++++++++++++++++++++++++++
  let date = isDateInitial(isdate);
  return (`${date.yy}-${date.mm}-${date.dd}`)
};


export const date_dmy_func = (isdate) => { //+++++++++++++++ Current Date by format (dd-mm-yyy) ++++++++++++++++++++++++++++++++++++
  let date = isDateInitial(isdate);
  return (`${date.dd}-${date.mm}-${date.yy}`)
};

export const sap_date_dmy_func = (isdate) => { //+++++++++++++++ Current Date by format (dd-mm-yyy) ++++++++++++++++++++++++++++++++++++
  let date = isDateInitial(isdate);
  return (`${date.dd}.${date.mm}.${date.yy}`)
};

export const currentDate_ymd = date_ymd_func();
export const currentDate_dmy = date_dmy_func();


export function convertTimefunc(inputDate) {
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const meridian = hours < 12 ? 'AM' : 'PM';
  const hour12 = (hours % 12) || 12;

  return `(${day}-${month}-${year} ${hour12}:${minutes} ${meridian})`;
}

export function convertOnlyTimefunc(inputDate) {
  const date = new Date(inputDate);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridian = hours < 12 ? 'AM' : 'PM';
  const hour12 = (hours % 12) || 12;

  return `(${hour12}:${minutes} ${meridian})`;
}


export function listpageConcatDateAndTime(date, time) {//+++++++++++time and date concate +++++++++++++++++++++++++++++++
  const d = date_dmy_func(date);
  const t = convertTimefunc(time);
  return `${d} ${t}`;
}


export function getDateTime_dmy(hourOffset = 0) {
  const { dd, mm, yy, dateInstance } = isDateInitial();

  dateInstance.setHours(dateInstance.getHours() - hourOffset); // Subtract the specified number of hours
  const hours = String(dateInstance.getHours()).padStart(2, '0');
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0');
  const seconds = String(dateInstance.getSeconds()).padStart(2, '0');

  return `${dd}-${mm}-${yy} ${hours}:${minutes}:${seconds}`;
}

export function convertDateTime_ydm(inputDateTime) {
  const [datePart, timePart = "00:00"] = inputDateTime.split(' ');
  const [day, month, year] = datePart.split('-');
  return `${year}-${month}-${day} ${timePart}`;
}


export function CurrentTime() {

  function addLeadingZero(number) {
    return number < 10 ? '0' + number : number;
  }
  var currentTimeInMillis = Date.now();
  var currentTime = new Date(currentTimeInMillis);
  var hours = currentTime.getHours();
  var amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();
  var formattedTime = addLeadingZero(hours) + ':' + addLeadingZero(minutes) + ':' + addLeadingZero(seconds) + ' ' + amPm;

  return formattedTime

}


export const getFirstAndLastDateOfMonth = (inputDate) => {

  const [year, month] = inputDate.split('-').map(Number);
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);
  const formattedFirstDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const formattedLastDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDate.getDate()).padStart(2, '0')}`;
  return {
    firstDate: formattedFirstDate,
    lastDate: formattedLastDate,
    Year: year,
    Month: month
  };
}

export const getCurrentMonthAndYear = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed

  return `${year}-${month}`;
}




// export const areAllDatesSame = (dates) => {
//   if (!Array.isArray(dates) || dates.length === 0) {
//     return null; // Return null for empty arrays or non-array inputs
//   }

//   const uniqueDates = Array.from(new Set(dates)); // Get unique dates in the array

//   return {
//     allSame: uniqueDates.length === 1,
//     dates: uniqueDates,
//   };
// };

export const isFutureDate = (date) => {
  const currentDate = new Date(); // Get the current date

  const [day, month, year] = date.split('-').map(Number);
  // JavaScript months are 0-indexed, so subtract 1 from the month
  const inputDate = new Date(year, month - 1, day);

  return inputDate > currentDate; // Return true if the input date is in the future
};

export const areAllDatesSame = (dates) => {
  if (!Array.isArray(dates) || dates.length === 0) {
    return null; // Return null for empty arrays or non-array inputs
  }

  const uniqueDates = Array.from(new Set(dates)); // Get unique dates in the array
  const futureDates = uniqueDates.filter(date => isFutureDate(date));

  return {
    allSame: uniqueDates.length === 1,
    dates: uniqueDates,
    futureDate: futureDates.length > 0 ? true : false, // Check if the first unique date is a future date
    futureDates: futureDates, // Array of future dates
  };
};


export const getPreviousMonthAndYear = (date) => {
  const previousMonthDate = new Date(date);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

  const year = previousMonthDate.getFullYear();
  const month = (previousMonthDate.getMonth() + 1).toString().padStart(2, '0'); // Adding padding if needed

  return `${year}-${month}`;
}

export function amountCommaSeparateFunc(amount) {
  const amountStr = amount.toString();
  const [integerPart, decimalPart] = amountStr.split('.');

  if (integerPart.length > 3) {
    const formattedIntegerPart = integerPart.substring(0, integerPart.length - 3)
      .replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return formattedIntegerPart + "," + integerPart.substring(integerPart.length - 3) + (decimalPart ? "." + decimalPart : "");
  }

  return amountStr;
}

export const loginUserDetails = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  let user_Details = '';
  try {
    const a = localStorage.getItem("roleId")
    if (!(a === null)) {
      user_Details = JSON.parse(a);
    }
  } catch (e) {
    CommonConsole("Common user_Details  Error");
  }
  return user_Details;
};



export const loginUserAdminRole = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++

  try {
    const detail = loginUserDetails();
    return (detail.PartyType === "Company Division");
  } catch (e) {
    CommonConsole("Common loginUserAdminRole  Error");
  }
  return false;
};

export const loginRoleID = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++

  try {
    const detail = loginUserDetails();
    return detail.Role;
  } catch (e) {
    CommonConsole("Common Role ID  Error");
  }
  return '';
};

export const loginUserID = () => {//++++++++++++++++++++++ Session User Id+++++++++++++++++++++++++++++
  let created_By = 0;
  try {
    created_By = JSON.parse(localStorage.getItem("userId"));
  } catch (e) {
    CommonConsole("Common Created By Error");
  }
  return created_By;
};

export const loginCompanyID = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  try {
    return JSON.parse(localStorage.getItem("Company"));
  } catch (e) {
    CommonConsole("Common login CompanyID  Error");
  }
  return 0;
};

export const loginCompanyName = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  try {
    return localStorage.getItem("CompanyName");
  } catch (e) {
    CommonConsole("Common login CompanyID  Error");
  }
  return '';
};

export const loginPartyID = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++

  try {
    return loginUserDetails().Party_id;
  } catch (e) {
    CommonConsole("Common login PartyID Func  Error");
  }
  return 0;
};

export const loginPartyName = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++

  try {
    return loginUserDetails().PartyName;
  } catch (e) {
    CommonConsole("Common login PartyName Func  Error");
  }
  return '';
};

export const loginSelectedPartyID = () => {//+++++++++++++++++++++ Session common party dropdown id +++++++++++++++++++++++++++++++
  try {
    return JSON.parse(localStorage.getItem("selectedParty")).value;
  } catch (e) {
    CommonConsole("Common login PartyID Func  Error");
  }
  return 0;
};

export const loginEmployeeID = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++

  try {
    return loginUserDetails().Employee_id;
  } catch (e) {
    alert("Common login EmployeeID Func  Error");
  }
  return 0;
};

export const loginIsSCMCompany = () => { //+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++
  try {
    return JSON.parse(localStorage.getItem("IsSCMCompany"));
  } catch (e) {
    CommonConsole("Common login IsSCMCompany Func  Error");
  }
  return 0;
};

export const loginCompanyGroup = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++
  try {
    return JSON.parse(localStorage.getItem("CompanyGroup"));
  } catch (e) {
    CommonConsole("Common login CompanyGroup Func  Error");
  }
  return 0;
};


export const loginIsSCMParty = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  try {
    const detail = loginUserDetails();
    return (detail.IsSCMPartyType === 0) || (detail.IsSCMPartyType === null);
  } catch (e) {
    CommonConsole("Common loginIsSCMParty Error");
  }
  return false;
};

export const loginSystemSetting = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  try {
    const hassetting = JSON.parse(sessionStorage.getItem("SystemSetting"));
    return hassetting || "";
  } catch (e) {
    CommonConsole("Common loginSystemSetting func  Error");
  }
  return "";
};

export const loginUserGSTIN = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  try {
    return loginUserDetails().GSTIN;
  } catch (e) {
    CommonConsole("Common loginUserGSTIN func  Error");
  }
  return '';
};

export const loginJsonBody = () => ({ //+++++++++++++++++++++ loginJsonBody for Filter API +++++++++++++++++++++++++++++
  UserID: loginUserID(),
  RoleID: loginRoleID(),
  CompanyID: loginCompanyID(),
  PartyID: loginPartyID(),
  IsSCMCompany: loginIsSCMCompany(),
  CompanyGroup: loginCompanyGroup(),
});

export const compareGSTINState = (gstin1 = '', gstin2 = '') => {
  gstin1 = String(gstin1) || ""
  gstin2 = String(gstin2) || ""
  let stateCode1 = gstin1.substring(0, 2);
  let stateCode2 = gstin2.substring(0, 2);

  return (!(stateCode1 === stateCode2) && !(gstin1 === "") && !(gstin2 === ""));
}

export function breadcrumbReturnFunc({ dispatch, userAcc, newBtnPath = "", forceNewBtnView = true, pageField: pageField }) {
  
  const isnewBtnView = userAcc.PageType === 2 && userAcc.RoleAccess_IsSave;
  const isCountLabel = userAcc.CountLabel;
  const isexcelBtnView =
    userAcc.PageType === 2 && userAcc.RoleAccess_Exceldownload;
  dispatch(
    CommonBreadcrumbDetails({
      newBtnPath: newBtnPath,
      newBtnView: !forceNewBtnView ? forceNewBtnView : isnewBtnView,
      excelBtnView: isexcelBtnView,
      pageHeading: userAcc.PageHeading,
      CountLabel: isCountLabel,
      pageField: pageField
    })
  );
}
export function isEditMode_CssFun(pageMode) {
  if ((pageMode === mode.edit) || (pageMode === mode.copy) || (pageMode === mode.dropdownAdd)) {
    return "-5.5%"
  }
  return ""
}

export function metaTagLabel(userPageAccess = '') {
  return <title>{userPageAccess.PageHeading}| FoodERP-2.0</title>

}
export function CommonConsole(msg1, msg2 = '', msg3 = '') {// +++++++++++Print Console.log Body+++++++++++++++++++++++++++++++
  console.log(msg1, msg2, msg3);
}

export function groupBy(list, keyGetter) {// +++++++++++ Array Group By_kye Function +++++++++++++++++++++++++++++++
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}






//convert fixed decimal number 
export function roundToDecimalPlaces(input, decimalPlaces = 3, returnZerro = false) { //convert fixed decimal number

  const number = Number(input)
  if (typeof number !== "number" || isNaN(number) || !isFinite(number)) {
    return returnZerro ? 0 : '';
  }
  const multiplier = Math.pow(10, decimalPlaces);
  const roundedNumber = Math.round(number * multiplier) / multiplier;
  if (returnZerro) {
    return roundedNumber;
  }
  const result = roundedNumber === 0 ? "" : roundedNumber;
  return result;
};

export function hasDecimalCheckFunc(input) {
  const number = Number(input); // Convert the input to a number
  return isNaN(number) ? false : !Number.isInteger(number);
}


export function btnIsDissablefunc({ btnId, state = false }) {// +++++++++++ Button Dissable and Sppiner Function +++++++++++++++++++++++++++++++

  // if (btnId) {
  //   try {
  //     let btn = document.getElementById(btnId);
  //     btn.disabled = state

  //     document.getElementById("preloader").style.display = state
  //       ? "block"
  //       : "none";
  //   } catch (error) {
  //     CommonConsole(`btnIsDissablefunc Error ==> ${btnId}`);
  //   }
  // }
}

export async function CheckAPIResponse({ method, url, response = {}, body, error = '' }) {

  const { data = {} } = response;
  const statusCode = data.StatusCode;
  const MessgeAlreadyShow = error.MessgeAlreadyShow || false

  const successCodes = [200, 204, 100];
  const rejectionCodes = [226, 400, 406, 500];

  {/***********error massage********************************************* */ }

  if (error !== undefined && error !== '') {
    const tokenXp = error.response?.data.code === "token_not_valid";

    if (method === "post" || method === "put" || method === "postForget") {
      CommonConsole(`${url}***=> ${method} Body =>`, body);
    }

    if (tokenXp) {
      history.push({ pathname: "/logout" });
      window.location.reload(true);
      return;
    }
    if (!MessgeAlreadyShow) {
      CommonConsole(`${url}***${method} apiCall response:=>`, error);
      customAlert({ Type: 2, Message: `${url}:This API ${method} Method Execution Error` });
    }
    return Promise.reject(error);
  }
  {/******************************************************** */ }

  if (method === "post" || method === "put" || method === "postForget") {
    CommonConsole(`${url}***=> ${method} Body =>`, body);
  }

  if (successCodes.includes(statusCode)) {
    CommonConsole(`${url}***${method} apiCall response:=>`, response.data);
    return response.data;
  }

  if (rejectionCodes.includes(statusCode)) {
    CommonConsole(`${url}***${method} apiCall response:=>`, response.data);
    await customAlert({ Type: 3, Message: JSON.stringify(response.data.Message) });
    response.data["MessgeAlreadyShow"] = true
    return Promise.reject(response.data);
  }

  return Promise.reject(response);
}

export const tableInputArrowUpDounFunc = (tableId) => {

  // (function ($) {
  $.fn.enableCellNavigation = function () {

    var arrow = { left: 37, up: 38, right: 39, down: 40 };

    // select all on focus
    this.find('input').keydown(function (e) {

      // shortcut for key other than arrow keys
      if ($.inArray(e.which, [arrow.left, arrow.up, arrow.right, arrow.down]) < 0) { return; }

      if (!($.inArray(e.which, [arrow.up, arrow.down]) < 0)) {
        let hasSelect = e.target.offsetParent.classList.contains("select2-selection__value-container");
        if (hasSelect) {
          e.stopPropagation()
        }

      }
      var input = e.target;
      var td = $(e.target).closest('td');

      var moveTo = null;

      switch (e.which) {

        case arrow.left: {


          if (input.selectionStart == 0) {
            moveTo = td.prev('td:has(input,textarea)');


            var tr = td.closest('tr');
            var pos = td[0]?.cellIndex;
            var ctd = tr.children('td')

            let prevTd = td
            let in_d = 0
            while ((in_d < pos)) {

              moveTo = prevTd.prev('td:has(input,textarea)');
              if (moveTo.length > 0) { in_d = ctd.length - 1 }
              prevTd = td.prev('td')
              in_d++;
            }

          }
          if (moveTo && moveTo.length) {

            e.preventDefault();
            var tdInput = moveTo.find('input,textarea')

            if (tdInput.length > 0) {
              tdInput[0].focus();
              tdInput[0].select();
            }
          }

          break;
        }
        case arrow.right: {
          if (input.selectionEnd == input.value.length) {

            var tr = td.closest('tr');
            var pos = td[0]?.cellIndex;
            var ctd = tr.children('td')

            let nextTd = td

            while (pos < ctd.length) {

              moveTo = nextTd.next('td:has(input,textarea)');
              if (moveTo.length > 0) { pos = ctd.length + 1 }
              nextTd = td.next('td')
              pos++;
            }

          }

          if (moveTo && moveTo.length) {

            e.preventDefault();
            var tdInput = moveTo.find('input,textarea')

            if (tdInput.length > 0) {
              tdInput[0].focus();
              tdInput[0].select();
            }
          }
          break;
        }

        case arrow.up: {
          var thisIndex = $(input).index('input:text');
          var pre = thisIndex - 1;

          var tdPreInput
          td.find('input').each(function (i2, tdEle) {

            var thisIndex = $(tdEle).index('input:text');
            if (pre === thisIndex) {
              tdPreInput = tdEle
            }
          });

          if (tdPreInput) {
            tdPreInput.focus()
            tdPreInput.select();
            return
          }
          var tr = td.closest('tr');
          var pos = td[0]?.cellIndex;
          var moveToRow = tr.prev('tr');


          if (moveToRow.length) {
            moveTo = $(moveToRow[0].cells[pos]);
          }
          if (moveTo && moveTo.length) {

            e.preventDefault();
            var tdInput = moveTo.find('input,textarea')

            if (tdInput.length > 0) {
              tdInput[tdInput.length - 1].focus();
              tdInput[tdInput.length - 1].select();
            }
          }
          break;
        }
        case arrow.down: {

          var thisIndex = $(input).index('input:text');
          var next = thisIndex + 1;

          var tdNextInput
          td.find('input').each(function (i2, tdEle) {

            var thisIndex = $(tdEle).index('input:text');
            if (next === thisIndex) {
              tdNextInput = tdEle
            }
          });

          if (tdNextInput) {
            tdNextInput.focus();
            tdNextInput.select()

            return
          }
          var tr = td.closest('tr');

          var pos = td[0]?.cellIndex;

          var moveToRow = tr.next('tr');

          if (moveToRow.length) {
            moveTo = $(moveToRow[0].cells[pos]);
          }
          if (moveTo && moveTo.length) {

            e.preventDefault();
            var tdInput = moveTo.find('input,textarea')

            if (tdInput.length > 0) {
              tdInput[0].focus();
              tdInput[0].select();
            }
          }
          break;
        }
      }
    });

  };


  $(function () {
    $(tableId).enableCellNavigation();
  });


}

export function trailingZeros(value) {// +++++++++++Print Console.log Body+++++++++++++++++++++++++++++++

  return parseFloat(value).toString()
}



export const fetchFiles = async (linksArray) => {

  try {
    const filesArray = [];

    for (const item of linksArray) {
      const link = item.Image; // Access the URL from the object
      const response = await fetch(link);
      if (response.ok) {
        const blob = await response.blob();
        const filename = `ItemImage_.jpg`; // Creating a unique filename
        const file = new File([blob], filename, { type: "image/jpeg" });
        filesArray.push(file);
      } else {
        console.error(`Failed to fetch: ${link}. Status: ${response.status}`);
      }
    }

    return filesArray;
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
};



