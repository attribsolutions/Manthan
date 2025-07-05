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


function Frenchies_isDateInitial(isdate) {

  const dateInstance = isdate ? new Date(isdate) : new Date();

  // Get the current time
  const hours = dateInstance.getHours();

  // If it's 6:00 PM or later, move to the next day
  if (hours >= 18) {
    dateInstance.setDate(dateInstance.getDate() + 1);
  }

  const dd = String(dateInstance.getDate()).padStart(2, '0');
  const mm = String(dateInstance.getMonth() + 1).padStart(2, '0');
  const yy = dateInstance.getFullYear();
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0');
  const seconds = String(dateInstance.getSeconds()).padStart(2, '0');

  return { dd, mm, yy, hours, minutes, seconds, dateInstance };
}

export const Frenchies_date_ymd_func = (isdate) => {
  let date = Frenchies_isDateInitial(isdate);
  return `${date.yy}-${date.mm}-${date.dd}`;
};


export function getFileExtensionType(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  if (imageExtensions.includes(extension)) return 'Image';
  if (documentExtensions.includes(extension)) return 'Document';
  return 'Unknown';
}


export function getMimeTypeFromExtension(filename) {
  const extension = filename.split('.').pop().toLowerCase();

  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime'
    // Add more if needed
  };

  return mimeTypes[extension] || 'application/octet-stream'; // default fallback
}



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



export function isDissableForParticularDate(date, type) {


  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  if (type === "Actual") {
    return date > currentDay && date <= lastDayOfMonth;
  } else {

    return currentDay === date;

  }

}

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

export const convertDateFormat = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};


export function getDateTime_dmy(hourOffset = 0) {




  const { dd, mm, yy, dateInstance } = isDateInitial();

  dateInstance.setHours(dateInstance.getHours() - hourOffset); // Subtract the specified number of hours
  const hours = String(dateInstance.getHours()).padStart(2, '0');
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0');
  const seconds = String(dateInstance.getSeconds()).padStart(2, '0');

  return `${dd}-${mm}-${yy} ${hours}:${minutes}:${seconds}`;
}

export function deliverydate_ForFranchise() {
  const { dd, mm, yy, dateInstance } = isDateInitial();

  // Set the hours to the correct time zone (or any specific adjustment)
  dateInstance.setHours(dateInstance.getHours() - 0);

  const hours = dateInstance.getHours();
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0');
  const seconds = String(dateInstance.getSeconds()).padStart(2, '0');

  // Check if the time is after 6 PM
  if (hours >= 18) {
    // Add one day to the current date
    dateInstance.setDate(dateInstance.getDate() + 1);
  }

  // Recalculate the date components after potentially modifying the date
  const updatedDd = String(dateInstance.getDate()).padStart(2, '0');
  const updatedMm = String(dateInstance.getMonth() + 1).padStart(2, '0');
  const updatedYy = dateInstance.getFullYear();

  // Return the updated date and time
  return `${updatedYy}-${updatedMm}-${updatedDd} ${String(dateInstance.getHours()).padStart(2, '0')}:${minutes}:${seconds}`;
}


export function getDateTime_ymd(date) {

  const { dd, mm, yy, dateInstance } = isDateInitial(date);

  dateInstance.setHours(dateInstance.getHours() - 0); // Subtract the specified number of hours
  const hours = String(dateInstance.getHours()).padStart(2, '0');
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0');
  const seconds = String(dateInstance.getSeconds()).padStart(2, '0');

  return `${yy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`;
}







export function getDate_Time_ymd(date) {

  function isDate_Initial(dateString) {
    // Extract day, month, year, and time from "DD-MM-YYYY HH:mm:ss"
    const [datePart, timePart] = dateString.split(" ");
    const [dd, mm, yy] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Create a Date object (months are zero-based in JS)
    const dateInstance = new Date(yy, mm - 1, dd, hours, minutes, seconds);

    return { dd, mm: String(mm).padStart(2, '0'), yy, dateInstance };
  }

  const { dd, mm, yy, dateInstance } = isDate_Initial(date);

  dateInstance.setHours(dateInstance.getHours() - 0); // Subtract the specified number of hours
  const hours = String(dateInstance.getHours()).padStart(2, '0');
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0');
  const seconds = String(dateInstance.getSeconds()).padStart(2, '0');

  return `${yy}-${mm}-${dd} ${hours}:${minutes}:${seconds}`;
}










export function getCurrenthours_min_sec(hourOffset = 0) {
  const { dd, mm, yy, dateInstance } = isDateInitial();

  dateInstance.setHours(dateInstance.getHours() - hourOffset); // Subtract the specified number of hours
  const hours = String(dateInstance.getHours()).padStart(2, '0');
  const minutes = String(dateInstance.getMinutes()).padStart(2, '0');
  const seconds = String(dateInstance.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
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




export const getCurrentFormattedDate = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const year = currentDate.getFullYear();
  const hours = String(currentDate.getHours()).padStart(2, '0');

  // Always set minutes to '00'
  const minutes = '00';
  const seconds = '00';

  return {
    Date_and_time: `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`,
    Time: `${hours}:${minutes}:${seconds}`
  };
}

export const DateTime = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours() % 12 || 12).padStart(2, '0'); // Convert to 12-hour format
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  const period = date.getHours() < 12 ? 'AM' : 'PM';

  return `${day} -${month} -${year} (${hours}:${minutes}:${seconds}:${milliseconds} ${period})`;

}


export const getPreviousMonthAndYear = ({ date, Privious }) => {

  const previousMonthDate = new Date(date);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - Privious);

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

export const loginPartyTypeName = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++

  try {
    const detail = loginUserDetails();
    return ((detail.PartyType === "Division") || (detail.PartyType === "Franchises"));
  } catch (e) {
    CommonConsole("Common loginPartyTypeName Error");
  }
  return false;
};

export const loginPartyTypeID = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++

  try {
    return loginUserDetails().PartyTypeID;
  } catch (e) {
    CommonConsole("Common login PartyTypeID Func  Error");
  }
  return 0;
};


export const FranchiesPartyType = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++

  try {
    return 19;  // Party Type ID for Franchies
  } catch (e) {
    CommonConsole("Common FranchiesTypeName Error");
  }

};


export const loginUserIsFranchisesRole = () => { //+++++++++++++++++++++ IsFranchises Company Id+++++++++++++++++++++++++++++

  try {
    const detail = loginUserDetails();
    return (detail.IsFranchises === 1);  //P
  } catch (e) {
    CommonConsole("Common loginUserIsFranchisesRole  Error");
  }
  return false;
};



export const PartyTypeIsChitaleXxpress = () => { //+++++++++++++++++++++ IsFranchises Company Id+++++++++++++++++++++++++++++

  try {
    const detail = loginUserDetails();
    return (detail.IsFranchises === 1);  //P
  } catch (e) {
    CommonConsole("Common loginUserIsFranchisesRole  Error");
  }
  return false;
};





export const loginUserIsCBMAttribRole = () => { //+++++++++++++++++++++ IsFranchises Company Id+++++++++++++++++++++++++++++

  try {
    const detail = loginUserDetails(); //P
    return (detail.Role === 33);
  } catch (e) {
    CommonConsole("Common loginUserIsFranchisesRole  Error");
  }
  return false;
};




export const loginUserChitaleAmericaRole = () => { //+++++++++++++++++++++ IsFranchises Company Id+++++++++++++++++++++++++++++

  try {
    const detail = loginUserDetails(); //P
    return (detail.Role === 24);
  } catch (e) {
    CommonConsole("Common loginUserChitaleAmericaRole  Error");
  }
  return false;
};









export const isSuperAdmin = () => {

  const detail = loginUserDetails();
  return detail.id === 1
}


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

export const loginUserName = () => {//++++++++++++++++++++++ Session User Id+++++++++++++++++++++++++++++
  let userName = "";
  try {
    userName = localStorage.getItem("UserName");
  } catch (e) {
    CommonConsole("Common UserName Error");
  }
  return userName;
};

export const loginCompanyID = () => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
  try {
    return JSON.parse(localStorage.getItem("Company"));
  } catch (e) {
    CommonConsole("Common login CompanyID  Error");
  }
  return 0;
};



export const IsSweetAndSnacksCompany = () => { //+++++++++++++++++++++ Company condition Company Id+++++++++++++++++++++++++++++
  try {
    const loginCompanyId = loginCompanyID();
    return (loginCompanyId === 4);  // Company Id 4 For (Chitale Sweet and Snacks )
  } catch (e) {
    CommonConsole("Common Login company Error");
  }
  return false;
};


export const IsCBMManagment = () => { //+++++++++++++++++++++ Company condition Company Id+++++++++++++++++++++++++++++
  try {
    const loginCompanyId = loginCompanyID();
    return (loginCompanyId === 2) && loginIsSCMParty();  // Company Id 4 For (Chitale Sweet and Snacks )
  } catch (e) {
    CommonConsole("Common Login company Error");
  }
  return false;
};




export const IsLoginFromOutsideLink = (Path) => {
  return Path.includes('-') && Path.includes('AuthLink')
}



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

export const CommonPartyDropValue = () => {//+++++++++++++++++++++ Session common party dropdown id +++++++++++++++++++++++++++++++
  try {
    return JSON.parse(localStorage.getItem("selectedParty"));
  } catch (e) {
    CommonConsole("Common login PartyID Func  Error");
  }
  return '';
};


export const loginEmployeeID = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++

  try {
    const employeeId = parseInt(loginUserDetails().Employee_id);
    return employeeId
  } catch (e) {
    alert("Common login EmployeeID Func  Error");
  }
  return 0;
};

export const loginPriceListID = () => {//+++++++++++++++++++++ Session loginPartyID Id+++++++++++++++++++++++++++++++

  try {
    const PriceList_id = parseInt(loginUserDetails().PriceList_id);
    return PriceList_id
  } catch (e) {
    alert("Common login PriceList_id Func  Error");
  }
  return 0;
};

export const IsAuthorisedURL = ({ subPageMode, URL }) => {
  return ((subPageMode.includes('AuthLink') && subPageMode.includes(URL)))

}

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


export const getSettingBasedPartyTypeID = (str, LoginRollId) => {
  let pairs = str.split(','); // Split by comma
  for (let pair of pairs) {
    let [key, value] = pair.split('-').map(Number); // Split by hyphen and convert to numbers
    if (key === LoginRollId) {
      return value;
    }
  }
  return null; // Return null if no match found
}

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

  gstin1 = gstin1 === null ? "" : String(gstin1);
  gstin2 = gstin2 === null ? "" : String(gstin2);
  let stateCode1 = gstin1.substring(0, 2);
  let stateCode2 = gstin2.substring(0, 2);

  if ((stateCode1 === stateCode2) || (gstin1 === "") || (gstin2 === "")) {
    return false;
  } else if (!(stateCode1 === stateCode2)) {
    return true;
  }
  else {
    return false;
  }
  // return (!(stateCode1 === stateCode2) && !(gstin1 === "") && !(gstin2 === ""));
}

export function breadcrumbReturnFunc({ dispatch, userAcc, newBtnPath = "", forceNewBtnView = true, pageField }) {

  const isnewBtnView = userAcc.PageType === 2 && userAcc.RoleAccess_IsSave;
  const isCountLabel = userAcc.CountLabel;
  const isexcelBtnView =
    (userAcc.PageType === 2 || userAcc.PageType === 3) && userAcc.RoleAccess_Exceldownload;
  dispatch(
    CommonBreadcrumbDetails({
      newBtnPath: newBtnPath,
      newBtnView: !forceNewBtnView ? forceNewBtnView : isnewBtnView,
      excelBtnView: isexcelBtnView,
      pageHeading: userAcc.PageHeading,
      CountLabel: isCountLabel,
      pageField: pageField,
      userAcc: userAcc,
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
  // console.log(msg1, msg2, msg3);
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



export function getFixedNumber(qtyToDeduct, decimalPlaces) {
  let num = parseFloat(qtyToDeduct);  // Convert to number
  if (isNaN(num)) {
    return 0;  // Return 0 for invalid inputs
  }
  return parseFloat(num.toFixed(decimalPlaces));  // Fix to specified decimal places
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

export const strToBool = (value) => value?.toLowerCase() === "true";

export function hasDecimalCheckFunc(input) {
  const number = Number(input); // Convert the input to a number
  return isNaN(number) ? false : !Number.isInteger(number);
}

export const isButtonEnable = ({ ConditionDetails = {} }) => {   /////// button disable based on condiition ///////

  let isEnable = false;
  let isEnablePriviousAlert = false;
  const CustomerPartyTypeID = loginUserDetails().PartyTypeID
  if (Object.keys(ConditionDetails).length > 0) {
    isEnablePriviousAlert = false;
    isEnable = false
    if (ConditionDetails.Supplierid?.includes(ConditionDetails.SelectedSupplierId) && ConditionDetails?.Coustomerid.includes(CustomerPartyTypeID)) {
      isEnable = isDissableForParticularDate(ConditionDetails.ActualDate, "Actual");
      isEnablePriviousAlert = isDissableForParticularDate(ConditionDetails.WarningDate, "warning")
    }
  } else {
    isEnablePriviousAlert = true
    isEnable = true
  }

  return { isEnable: isEnable, isEnablePriviousAlert: isEnablePriviousAlert, }
}

export const DateFormat = (day) => {

  var currentDate = new Date();
  var day = parseInt(day);
  var month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
  var year = currentDate.getFullYear();
  return (day < 10 ? '0' : '') + day + '-' + (month < 10 ? '0' : '') + month + '-' + year;
}





export const isFutureDate = (date) => {

  const currentDate = new Date(); // Get the current date
  const [day, month, year] = date.split('-').map(Number);
  // JavaScript months are 0-indexed, so subtract 1 from the month
  const inputDate = new Date(year, month - 1, day);
  return inputDate > currentDate; // Return true if the input date is in the future
};

export const isToDateisgreterThanFormDate = ({ FromDate, ToDate }) => {
  const [ToDateday, ToDatemonth, ToDateyear] = ToDate.split('-').map(Number);
  const toDate = new Date(ToDateday, ToDatemonth - 1, ToDateyear);

  const [FromDateday, FromDatemonth, FromDateyear] = FromDate.split('-').map(Number);
  const fromDate = new Date(FromDateday, FromDatemonth - 1, FromDateyear);

  return toDate > fromDate; // Return true if the input date is in the future
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


export const disablePriviousTodate = ({ fromDate }) => {
  const [year, month, day] = fromDate?.split("-").map(Number);
  return new Date(year, month - 1, day)
}


export const ToDate = ({ FromDate, Todate }) => {

  const istoDateisgreterThanFormDate = isToDateisgreterThanFormDate({ FromDate: FromDate, ToDate: Todate })
  const isfutureDate = isFutureDate(date_dmy_func(FromDate))
  const todateisNotFuture = !isFutureDate(date_dmy_func(Todate))
  const date = (isfutureDate && todateisNotFuture) || !(istoDateisgreterThanFormDate) ? FromDate : Todate

  return date
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
  //     CommonConsole(`btnIsDissablefunc Error ==> ${ btnId } `);
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
      CommonConsole(`${url}***=> ${method} Body => `, body);
    }

    if (tokenXp) {
      history.push({ pathname: "/logout" });
      window.location.reload(true);
      return;
    }
    if (!MessgeAlreadyShow) {
      CommonConsole(`${url}*** ${method} apiCall response:=> `, error);
      customAlert({ Type: 2, Message: `${url}:This API ${method} Method Execution Error` });
    }
    return Promise.reject(error);
  }
  {/******************************************************** */ }

  if (method === "post" || method === "put" || method === "postForget") {
    CommonConsole(`${url}***=> ${method} Body => `, body);
  }

  if (successCodes.includes(statusCode)) {
    CommonConsole(`${url}*** ${method} apiCall response:=> `, response.data);
    return response.data;
  }

  if (rejectionCodes.includes(statusCode)) {
    CommonConsole(`${url}*** ${method} apiCall response:=> `, response.data);
    await customAlert({ Type: 3, Message: JSON.stringify(response.data.Message) });
    response.data["MessgeAlreadyShow"] = true
    return Promise.reject(response.data);
  }

  return Promise.reject(response);
}




export function compareObjects(obj1, obj2) {
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
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
        CommonConsole(`Failed to fetch: ${link}.Status: ${response.status} `);
      }
    }

    return filesArray;
  } catch (error) {
    CommonConsole('Error fetching files:', error);
    return [];
  }
};

// old code

export function TotalAmount_Func(tableList) {
  debugger
  let totalAmount = tableList.reduce((total, item) => {
    return total + (Number(item.recordsAmountTotal) || 0);
  }, 0);

  let commaSeparateAmount = amountCommaSeparateFunc(Number(totalAmount).toFixed(2));
  return commaSeparateAmount;
}




// month and year name return 
export function SelectedMonthAndYearName(selectedMonth) {

  const [year, month] = selectedMonth.split('-');
  const monthName = new Date(`${year} -${month}-01`).toLocaleString('default', { month: 'long' });
  return { monthName, year };
};


// export function checkRateDropVisibility() {
//   const partyTypeID =loginPartyTypeID();

//   const settingsArray = loginSystemSetting().MRP_Rate.split(',');
//   const searchString = loginCompanyID() + "-2" + `- ${ partyTypeID } `;
//   return settingsArray.includes(searchString);
// }

export function checkRateDropVisibility() {

  const settingsArray = loginSystemSetting().MRP_Rate.split(',');
  const searchString = loginCompanyID() + "-2";
  return settingsArray.includes(searchString);
}



function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(/(AM|PM)/); // split at AM/PM
  const [hours, minutes] = time.trim().split(":").map(Number);

  let h = hours;
  if (modifier === "PM" && hours !== 12) h += 12;
  if (modifier === "AM" && hours === 12) h = 0;

  return [h, minutes, 0, 0]; // Format: HH, MM, 0, 0
}

function getStartAndEndTime(data, key) {
  const entry = data.find(str => str.startsWith(key));
  if (!entry) return null;

  const match = entry.match(/\((.*?)\)/);
  if (!match) return null;

  const [startStr, endStr] = match[1].split("-");
  const startTime = convertTo24Hour(startStr);
  const endTime = convertTo24Hour(endStr);

  return { startTime, endTime, startStr, endStr };
}


export function validateOrder(PageID, deliveryDate) {
  debugger
  const restrictedOrders = (loginSystemSetting()?.OrdersnotSave || "").split(',');
  const currentPartyKey = `${loginPartyTypeID()}-${PageID}`;

  const checkValid = getStartAndEndTime(restrictedOrders, currentPartyKey);
  // let checkValid = restrictedOrders.includes(currentPartyKey)

  if (!checkValid) {
    return ''
  }
  const now = new Date();
  const selectedDate = new Date(deliveryDate);
  const StartTime = checkValid.startTime
  const EndTime = checkValid.endTime


  // Get today's date and time boundaries
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Midnight today
  const todayStartTime = new Date();
  todayStartTime.setHours(StartTime[0], StartTime[1], StartTime[2], StartTime[3]);
  const todayEndTime = new Date();
  todayEndTime.setHours(EndTime[0], EndTime[1], EndTime[2], EndTime[3]);

  // Get tomorrow's date and time boundaries
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);  // Midnight tomorrow
  const tomorrowEndTime = new Date(tomorrow);
  tomorrowEndTime.setHours(EndTime[0], EndTime[1], EndTime[2], EndTime[3]);  // 10:30 PM tomorrow

  // Rounding the times to seconds for easier comparison
  const now_time = Math.floor(now.getTime() / 1000) * 1000;  // Round down to the nearest second
  const selectedDate_time = Math.floor(selectedDate.getTime() / 1000) * 1000;  // Round down to the nearest second

  console.log("Rounded Current Time in milliseconds (now_time):", now_time);
  console.log("Rounded Selected Date in milliseconds (selectedDate_time):", selectedDate_time);

  // Check if the selected date is today
  if (selectedDate.toDateString() === today.toDateString()) {
    console.log("Selected date is today");

    // Orders can only be placed after 10:30 AM today
    if (now_time < todayStartTime.getTime()) {
      console.log("Before 10:30 AM today");
      return `Orders can only be placed after ${checkValid.startStr} today.`;
    }

    // Orders can only be placed before 10:30 PM today
    if (now_time >= todayEndTime.getTime()) {  // Changed `> ` to ` >= ` to allow exactly 10:30 PM
      console.log("After or exactly 10:30 PM today");
      return `Orders can only be placed before ${checkValid.endStr} today.`;
    }
  }
  // Check if the selected date is tomorrow
  else if (selectedDate.toDateString() === tomorrow.toDateString()) {
    console.log("Selected date is tomorrow");

    // Check if it's past 10:30 PM today
    if (now_time >= todayEndTime.getTime()) {
      console.log("After 10:30 PM today, orders for tomorrow not allowed");
      return `Orders for tomorrow can only be placed before ${checkValid.endStr}today.`;
    }

    // Orders can only be placed before 10:30 PM tomorrow
    if (now_time >= tomorrowEndTime.getTime()) {  // Changed `> ` to ` >= ` to allow exactly 10:30 PM
      console.log("After or exactly 10:30 PM tomorrow");
      return `Orders can only be placed before ${checkValid.endStr} tomorrow.`;
    }
  }

  // If valid, return an empty string (valid order)
  console.log("Order is valid.");
  return "";


}


