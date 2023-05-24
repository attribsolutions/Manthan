import { customAlert } from "../../CustomAlert/ConfirmDialog";
import { CommonBreadcrumbDetails } from "../../store/actions";
import { createBrowserHistory } from 'history';
import * as mode from "../../routes/PageMode"
import $ from 'jquery';


export const history = createBrowserHistory();

export const commonListPageDelete_UpdateMsgFunction = (props) => {
  const dispatch = props.dispatch;
  const response = props.response;
  const resetAction = props.resetAction;
  const afterResponseAction = props.afterResponseAction;

  if (response.Status === true && response.StatusCode === 200) {
    dispatch(resetAction({ Status: false }));
    customAlert({
      Type: 1,
      Message: response.Message,
      AfterResponseAction: afterResponseAction,
    });
  } else if (response.Status === true) {
    dispatch(resetAction({ Status: false }));
    customAlert({
      Type: 3,
      Message: response.Message,
    });
  }
};

export const excelDownCommonFunc = (props) => { //++++++++Common Excel Covernt Data Function ++++++++++++++
  const { tableList = [], PageFieldMaster = [] } = props;

  let downList = [];
  let listObj = {};

  tableList.forEach((index1) => {
    PageFieldMaster.forEach((index2) => {
      if (index2.ShowInDownload) {
        listObj[`$defSelect${index2.ControlID}`] =
          index2.ShownloadDefaultSelect;
        listObj[index2.ControlID] = index1[index2.ControlID];
      }
    });
    downList.push(listObj);
    listObj = {};
  });
  return downList;
};

function isDateInitial(isdate) {

  let current = (isdate) ? new Date(isdate) : new Date();

  let month = current.getMonth() + 1;
  let dd = current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`;
  let mm = -month < 10 ? `0${month}` : `${month}`;
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

export const loginRoleID = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  try {
    const detail = JSON.parse(localStorage.getItem("roleId"));
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
  let user_Company = 0;
  try {
    user_Company = JSON.parse(localStorage.getItem("Company"));
  } catch (e) {
    CommonConsole("Common login CompanyID  Error");
  }
  return user_Company;
};

export const loginCompanyName = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  let company = "";
  try {
    company = localStorage.getItem("CompanyName");
  } catch (e) {
    CommonConsole("Common login CompanyID  Error");
  }
  return company;
};

export const loginPartyID = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++
  let user_Party = 0;
  try {
    user_Party = JSON.parse(localStorage.getItem("roleId")).Party_id;
  } catch (e) {
    CommonConsole("Common login PartyID Func  Error");
  }
  return user_Party;
};

export const loginEmployeeID = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++
  let user_EmployeeID = 0;
  try {
    user_EmployeeID = JSON.parse(localStorage.getItem("roleId")).Employee_id;
  } catch (e) {
    alert("Common login EmployeeID Func  Error");
  }
  return user_EmployeeID;
};

export const loginIsSCMCompany = () => { //+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++
  let IsSCMCompany = 0;
  try {
    IsSCMCompany = JSON.parse(localStorage.getItem("IsSCMCompany"));
  } catch (e) {
    CommonConsole("Common login IsSCMCompany Func  Error");
  }
  return IsSCMCompany;
};

export const loginCompanyGroup = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++
  let CompanyGroup = 0;
  try {
    CompanyGroup = JSON.parse(localStorage.getItem("CompanyGroup"));
  } catch (e) {
    CommonConsole("Common login CompanyGroup Func  Error");
  }
  return CompanyGroup;
};

export const loginJsonBody = () => ({
  UserID: loginUserID(),
  RoleID: loginRoleID(),
  CompanyID: loginCompanyID(),
  PartyID: loginPartyID(),
  IsSCMCompany: loginIsSCMCompany(),
  CompanyGroup: loginCompanyGroup(),
});


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
export function CommonConsole(error) {// +++++++++++Print Console.log Body+++++++++++++++++++++++++++++++
  console.log("CommonConsole =>:", error);
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

  if (btnId) {
    try {
     let btn= document.getElementById(btnId);
     btn .disabled = state
// if(state){
//   btn.innerText='Loging'
// }else{
//   btn.innerText=""

// }

      // document.getElementById("overlay").style.display = true
      //   ? "block"
      //   : "none";

      document.getElementById("preloader").style.display = state
        ? "block"
        : "none";
    } catch (error) {
      CommonConsole(`btnIsDissablefunc Error ==> ${btnId}`);
    }
  }
}

export async function CheckAPIResponse({
  method,
  url,
  response = {},
  body,
  btnId,
  error,
}) {
  if (btnId) {
    // await new Promise(r => setTimeout(r, 0));
    btnIsDissablefunc({ btnId, state: false });
  }

  const { data = "", code } = response;
  const con1 = data.StatusCode === 200;
  const con2 = data.StatusCode === 204; //data nao avalable
  const con3 = data.StatusCode === 226; //reject used an another transaction
  const con4 = data.StatusCode === 400; //reject  exception error
  const con5 = data.StatusCode === 406; //reject
  const con6 = method === "post" || method === "put"; //for console body
  const con7 = data.StatusCode === 100;

  if (!(error === undefined)) {
    const { data = "", response } = error;
    const tokenXp = response.data.code === "token_not_valid";

    const err3 = data.StatusCode === 226; //reject
    const err4 = data.StatusCode === 400; //reject
    const err5 = data.StatusCode === 406; //reject);

    // **********************************************************************************
    if (con6) {                             // print post and Put method body
      console.log(`${url}***=> ${method} Body =>`, body);
    }
    if (tokenXp) {
      localStorage.clear();
      history.go(0)
    }
    console.log(`${url}***${method} apiCall response:=>`, error);
    customAlert({
      Type: 2,
      Message: `${url}:This API ${method} Method Execution Error`,
    });


    return Promise.reject(error);
    // }
  }

  if (con6) {// print post and Put method body
    console.log(`${url}***=> ${method} Body =>`, body);
  }
  // **********************************************************************************

  if (con1 || con7) {
    console.log(`${url}***${method} apiCall response:=>`, response.data);
    return response.data;
  } else if (con2) {
    console.log(`${url}***${method} apiCall response:=>`, response.data);
    return response.data;
  }
  if (con3) {
    console.log(`${url}***${method} apiCall response:=>`, response.data);
    await customAlert({
      Type: 3,
      Message: JSON.stringify(response.data.Message),
    });
    return Promise.reject(response.data);
  } else if (con4) {
    console.log(`${url}***${method} apiCall response:=>`, response.data);
    await customAlert({
      Type: 2,
      Message: `${url}:This API ${method} Method Exception Error`,
    });
    return Promise.reject(response.data);
  } else if (con5) {

    console.log(`${url}***${method} apiCall response:=>`, response.data);
    await customAlert({ Type: 3, Message: JSON.stringify(response.data.Message) });
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
            tdNextInput.focus()
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


