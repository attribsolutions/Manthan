import { call, put, takeEvery } from "redux-saga/effects";
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
} from "./actionTypes";

function* Get_Party_GenFun() {   // Only CompanyID is Required
  try {
    const response = yield call(Party_Master_Get_API, loginJsonBody());
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
  } catch (error) { CommonConsole(error) }
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
    response.Data = response.Data.Data//remove chield data array
    response["pageMode"] = config.btnmode
    yield put(editPartyIDSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Update_Party_GenFun({config}) {
  try {
    const response = yield call(Party_Master_Update_API, config);
    yield put(updatePartyIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// GetDistrictOnState API
function* GetDistrictOnState_saga({ id }) {
  try {
    const response = yield call(GetDistrictOnState_For_Dropdown, id);
    yield put(getDistrictOnStateSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}


//get addresstypes
function* GetAddressTypes_saga() {
  try {
    const response = yield call(GetAddressTypes_For_Dropdown);
    yield put(getAddressTypesSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
function* GetPartyTypeByDivisionTypeID_GenFun({ id }) {
  try {
    const response = yield call(GetPartyTypeByDivisionTypeID_For_Dropdown, id);
    yield put(GetPartyTypeByDivisionTypeIDSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// GetCompanyByDivisionTypeID/1 API dependent on DivisionTypes api
function* GetCompanyByDivisionTypeID_GenFun({ id }) {
  try {
    const response = yield call(GetCompanyByDivisionTypeID_For_Dropdown, id);
    yield put(GetCompanyByDivisionTypeIDSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* PartyMasterSaga() {
  yield takeEvery(GET_PARTY_LIST_API, Get_Party_GenFun);
  yield takeEvery(POST_PARTY_DATA, save_Party_Master_GenFun);
  yield takeEvery(EDIT_PARTY_ID, Edit_Party_GenFun);
  yield takeEvery(DELETE_PARTY_ID, Delete_Party_GenFun);
  yield takeEvery(UPDATE_PARTY_ID, Update_Party_GenFun);
  yield takeEvery(GET_DISTRICT_ON_STATE, GetDistrictOnState_saga);
  yield takeEvery(GET_ADDRESSTYPES, GetAddressTypes_saga);
  yield takeEvery(GET_PARTTYPE_BY_DIVISIONTYPES_ID, GetPartyTypeByDivisionTypeID_GenFun);
  yield takeEvery(GET_COMPANY_BY_DIVISIONTYPES_ID, GetCompanyByDivisionTypeID_GenFun);
}

export default PartyMasterSaga;
