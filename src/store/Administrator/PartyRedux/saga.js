import { call, put, takeLatest } from "redux-saga/effects";
import { CommonConsole, loginEmployeeID, loginJsonBody, loginPartyID } from "../../../components/Common/CommonFunction";
import {
  GetCompanyByDivisionTypeID_For_Dropdown,
  GetDistrictOnState_For_Dropdown,
  GetPartyTypeByDivisionTypeID_For_Dropdown,
  Party_Master_Delete_API,
  Party_Master_Edit_API,
  Party_Master_Get_API,
  Party_Master_Post_API,
  Party_Master_Update_API,
  GetAddressTypes_For_Dropdown,
  Party_Address_Delete_API,
  RetailerListForApproval,
  RetailerListForApproval_ID,
  Party_Master_Optimize_Get_API,
} from "../../../helpers/backend_helper";
import {
  deletePartyIDSuccess,
  editPartyIDSuccess,
  GetCompanyByDivisionTypeIDSuccess,
  getDistrictOnStateSuccess,
  getPartyListAPISuccess,
  GetPartyTypeByDivisionTypeIDSuccess,
  postPartyDataSuccess,
  updatePartyIDSuccess,
  getAddressTypesSuccess,
  PartyApiErrorAction,
  PartyAddressDeleteIDSuccess,
  PartyListforApproval_Success,
  GetPartyListforApprovalID_Success,
} from "./action";
import {
  DELETE_PARTY_ID, EDIT_PARTY_ID,
  GET_COMPANY_BY_DIVISIONTYPES_ID,
  GET_DISTRICT_ON_STATE,
  GET_ADDRESSTYPES,
  GET_PARTTYPE_BY_DIVISIONTYPES_ID,
  GET_PARTY_LIST_API,
  POST_PARTY_DATA,
  UPDATE_PARTY_ID,
  PARTY_ADDRESS_DELETE_ID,
  PARTY_LIST_FOR_APPROVAL_ACTION,
  GET_PARTY_LIST_FOR_APPROVAL_ACTION,
} from "./actionTypes";
import { url } from "../../../routes";

function* Get_Party_GenFun({ jsonBody, subPageMode }) {   // Only CompanyID is Required
  var JsonBody = !(jsonBody) ? { ...loginJsonBody(), PartyID: loginPartyID(), IsRetailer: 0, EmployeeID: loginEmployeeID() } : jsonBody

  try {

    let response = {};
    let newArray = [];

    debugger
    function address(arr) {
      let result = ''
      const ind = arr.PartyAddress.find((index) => {
        return (index.IsDefault === true)
      })
      if (ind) { result = ind.Address }
      return result
    }
    if (subPageMode === url.PARTY_lIST) {
      response = yield call(Party_Master_Optimize_Get_API, JSON.stringify(JsonBody));
      newArray = response.Data
    } else {
      response = yield call(Party_Master_Get_API, JSON.stringify(JsonBody));
      newArray = response.Data.map((index) => {
        index["CountryName"] = index.Country?.Country;
        index["State"] = index.State.Name;
        index["District"] = index.District.Name;
        index['Company'] = index.Company.Name;
        index['PartyType'] = index.PartyType.Name;
        index['PartyTypeID'] = index.PartyType.id;
        const filterArry = index.MCSubParty
          .filter(i => i.Route !== null)
          .map(i => i.Route.Name);
        index['Route'] = filterArry.length > 0 ? filterArry.join(', ') : '';

        if (!index.PriceList) { index.PriceList = '' }
        else { index["PriceList"] = index.PriceList.Name; }
        index["PartyAddress"] = address(index);
        index["Check"] = false
        return index;
      });
    }

    yield put(getPartyListAPISuccess(newArray))
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

function* save_Party_Master_GenFun({ config }) {
  try {
    const response = yield call(Party_Master_Post_API, config);
    yield put(postPartyDataSuccess(response));
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

function* Delete_Party_GenFun({ config }) {

  try {
    const response = yield call(Party_Master_Delete_API, config);
    yield put(deletePartyIDSuccess(response))
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

function* Edit_Party_GenFun({ config }) {

  try {

    const response = yield call(Party_Master_Edit_API, config);
    let newData = response.Data.Data //remove chield data array
    newData["PartySubParty"] = response.Data.PartySubParty //remove chield data array 
    response.Data = newData
    response["pageMode"] = config.btnmode

    yield put(editPartyIDSuccess(response));
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

function* Update_Party_GenFun({ config }) {
  try {
    const response = yield call(Party_Master_Update_API, config);
    yield put(updatePartyIDSuccess(response))
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

// GetDistrictOnState API
function* GetDistrictOnState_saga({ id }) {
  try {
    const response = yield call(GetDistrictOnState_For_Dropdown, id);
    yield put(getDistrictOnStateSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

//get addresstypes
function* GetAddressTypes_saga() {
  try {
    const response = yield call(GetAddressTypes_For_Dropdown);
    yield put(getAddressTypesSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

// GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
function* GetPartyTypeByDivisionTypeID_GenFun({ id }) {
  try {
    const response = yield call(GetPartyTypeByDivisionTypeID_For_Dropdown, id);
    yield put(GetPartyTypeByDivisionTypeIDSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

// GetCompanyByDivisionTypeID/1 API dependent on DivisionTypes api
function* GetCompanyByDivisionTypeID_GenFun({ id }) {
  try {
    const response = yield call(GetCompanyByDivisionTypeID_For_Dropdown, id);
    yield put(GetCompanyByDivisionTypeIDSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

function* PartyAddressDelete_GenFun({ config }) {
  const { deleteId } = config
  try {
    const response = yield call(Party_Address_Delete_API, config);
    response["deleteId"] = deleteId
    yield put(PartyAddressDeleteIDSuccess(response))
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

function* PartyListforApproval_GenFun({ jsonBody }) {   // Only CompanyID is Required

  try {

    const response = yield call(RetailerListForApproval, jsonBody);
    yield put(PartyListforApproval_Success(response.Data))
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

// get api for PartyListForApproval id
function* PartyListforApproval_Id_GenFun({ config }) {

  try {
    const response = yield call(RetailerListForApproval_ID, config);
    yield put(GetPartyListforApprovalID_Success(response));
  } catch (error) {
    CommonConsole(error);
    yield put(PartyApiErrorAction());
  }
}

function* PartyMasterSaga() {
  yield takeLatest(GET_PARTY_LIST_API, Get_Party_GenFun);
  yield takeLatest(POST_PARTY_DATA, save_Party_Master_GenFun);
  yield takeLatest(EDIT_PARTY_ID, Edit_Party_GenFun);
  yield takeLatest(DELETE_PARTY_ID, Delete_Party_GenFun);
  yield takeLatest(UPDATE_PARTY_ID, Update_Party_GenFun);
  yield takeLatest(GET_DISTRICT_ON_STATE, GetDistrictOnState_saga);
  yield takeLatest(GET_ADDRESSTYPES, GetAddressTypes_saga);
  yield takeLatest(GET_PARTTYPE_BY_DIVISIONTYPES_ID, GetPartyTypeByDivisionTypeID_GenFun);
  yield takeLatest(GET_COMPANY_BY_DIVISIONTYPES_ID, GetCompanyByDivisionTypeID_GenFun);
  yield takeLatest(PARTY_ADDRESS_DELETE_ID, PartyAddressDelete_GenFun);
  yield takeLatest(PARTY_LIST_FOR_APPROVAL_ACTION, PartyListforApproval_GenFun);
  yield takeLatest(GET_PARTY_LIST_FOR_APPROVAL_ACTION, PartyListforApproval_Id_GenFun);
}

export default PartyMasterSaga;
