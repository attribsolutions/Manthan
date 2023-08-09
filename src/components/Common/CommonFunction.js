import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { CommonBreadcrumbDetails } from "../../store/actions";
import { createBrowserHistory } from 'history';
import * as mode from "../../routes/PageMode"
import $ from 'jquery';

export const history = createBrowserHistory();

function isDateInitial(isdate) {

  let current = (isdate) ? new Date(isdate) : new Date();

  let month = current.getMonth() + 1;
  let dd = current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`;
  let mm = month < 10 ? `0${month}` : `${month}`;
  let yy = current.getFullYear();

  return { dd, mm, yy }

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


export function convertTimefunc(inputDate) { //+++++++++++Convert Time Format+++++++++++++++++++++++++++++++
  const date = new Date(inputDate);
  let month = date.getMonth() + 1;

  let convDate = `${date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
    }-${month < 10 ? `0${month}` : `${month}`}`;

  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let timeString = hours + ":" + minutes;

  let [hourString, minute] = timeString.split(":");
  let hour = +hourString % 24;
  let time = (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
  return `(${convDate} ${time})`;
}

export function convertOnlyTimefunc(inputDate) { //+++++++++++Convert Time Format+++++++++++++++++++++++++++++++
  const date = new Date(inputDate);

  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let timeString = hours + ":" + minutes;

  let [hourString, minute] = timeString.split(":");
  let hour = +hourString % 24;
  let time = (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
  return `(${time})`;
}

export function concatDateAndTime(date, time) {//+++++++++++time and date concate +++++++++++++++++++++++++++++++
  const d = date_dmy_func(date);
  const t = convertTimefunc(time);
  return `${d} ${t}`;
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
    lastDate: formattedLastDate
  };
}

export const getCurrentMonthAndYear = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed

  return `${year}-${month}`;
}

export const amountCommaSeparateFunc = (amount) => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};


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

export function breadcrumbReturnFunc({ dispatch, userAcc, newBtnPath = "", forceNewBtnView = true }) {
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
            var pos = td[0].cellIndex;
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
            var pos = td[0].cellIndex;
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
          var pos = td[0].cellIndex;
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
          var pos = td[0].cellIndex;

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


