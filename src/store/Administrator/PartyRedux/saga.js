import { call, delay, put, takeLatest } from "redux-saga/effects";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";
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
} from "./actionTypes";
import * as url from "../../../routes/route_url";

function* Get_Party_GenFun({ subPageMode }) {   // Only CompanyID is Required
  debugger
  var IsRetailer = subPageMode === url.RETAILER_LIST ? 1 : 0

  var jsonBody = JSON.stringify({ ...loginJsonBody(), ...{ IsRetailer: IsRetailer } });

  try {

    const response = yield call(Party_Master_Get_API, jsonBody);
    function address(arr) {
      let result = ''
      const ind = arr.PartyAddress.find((index) => {
        return (index.IsDefault === true)
      })
      if (ind) { result = ind.Address }
      return result
    }
    const data1 = response.Data.map((index) => {
      index["State"] = index.State.Name;
      index["District"] = index.District.Name;
      index['Company'] = index.Company.Name;
      index['PartyType'] = index.PartyType.Name;

      if (!index.PriceList) { index.PriceList = '' }
      else { index["PriceList"] = index.PriceList.Name; }
      index["PartyAddress"] = address(index);
      index["Check"] = false
      return index;
    });

    yield put(getPartyListAPISuccess(data1))
  } catch (error) {
    CommonConsole(error)

  }
}

function* save_Party_Master_GenFun({ config }) {
  try {
    const response = yield call(Party_Master_Post_API, config);
    yield put(postPartyDataSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Delete_Party_GenFun({ config }) {

  try {
    const response = yield call(Party_Master_Delete_API, config);
    yield put(deletePartyIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Edit_Party_GenFun({ config }) {

  try {

    const response = yield call(Party_Master_Edit_API, config);
    let newData = response.Data.Data //remove chield data array
    newData["PartySubParty"] = response.Data.PartySubParty //remove chield data array 
    response.Data = newData
    response["pageMode"] = config.btnmode

    yield put(editPartyIDSuccess(response));
  } catch (error) { yield put(PartyApiErrorAction()) }
}

function* Update_Party_GenFun({ config }) {
  try {
    const response = yield call(Party_Master_Update_API, config);
    yield put(updatePartyIDSuccess(response))
  } catch (error) { yield put(PartyApiErrorAction()) }
}

// GetDistrictOnState API
function* GetDistrictOnState_saga({ id }) {
  try {
    const response = yield call(GetDistrictOnState_For_Dropdown, id);
    yield put(getDistrictOnStateSuccess(response.Data));
  } catch (error) { yield put(PartyApiErrorAction()) }
}


//get addresstypes
function* GetAddressTypes_saga() {
  try {
    const response = yield call(GetAddressTypes_For_Dropdown);
    yield put(getAddressTypesSuccess(response.Data));
  } catch (error) { yield put(PartyApiErrorAction()) }
}

// GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
function* GetPartyTypeByDivisionTypeID_GenFun({ id }) {
  try {
    const response = yield call(GetPartyTypeByDivisionTypeID_For_Dropdown, id);
    yield put(GetPartyTypeByDivisionTypeIDSuccess(response.Data));
  } catch (error) { yield put(PartyApiErrorAction()) }
}

// GetCompanyByDivisionTypeID/1 API dependent on DivisionTypes api
function* GetCompanyByDivisionTypeID_GenFun({ id }) {
  try {
    const response = yield call(GetCompanyByDivisionTypeID_For_Dropdown, id);
    yield put(GetCompanyByDivisionTypeIDSuccess(response.Data));
  } catch (error) { yield put(PartyApiErrorAction()) }
}


function* PartyAddressDelete_GenFun({ config }) {
  const { deleteId } = config
  try {
    const response = yield call(Party_Address_Delete_API, config);
    response["deleteId"] = deleteId
    yield put(PartyAddressDeleteIDSuccess(response))
  } catch (error) { yield put(PartyApiErrorAction()) }
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

}

export default PartyMasterSaga;
