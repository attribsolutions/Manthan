import { call, put, takeEvery } from "redux-saga/effects";
import { loginCompanyID, loginRoleID, loginUserID } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { GetPriceList_For_Dropdown, GetCompanyByDivisionTypeID_For_Dropdown, GetDistrictOnState_For_Dropdown, GetPartyTypeByDivisionTypeID_For_Dropdown, Party_Master_Delete_API, Party_Master_Edit_API, Party_Master_Get_API, Party_Master_Post_API, Party_Master_Update_API, GetAddressTypes_For_Dropdown, GetParty_For_Dropdown, GetPartyTypes_For_Dropdown, GetCompany_For_Dropdown } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
  deletePartyIDSuccess,
  editPartyIDSuccess,
  GetCompanyByDivisionTypeIDSuccess,
  getDistrictOnStateSuccess,
  getPartyListAPISuccess,
  GetPartyTypeByDivisionTypeIDSuccess,
  getPriceListSuccess,
  postPartyDataSuccess,
  updatePartyIDSuccess,
  getAddressTypesSuccess,
  getPartyTypesSuccess,
  getCompanySuccess
} from "./action";
import {
  DELETE_PARTY_ID, EDIT_PARTY_ID,
  GET_COMPANY_BY_DIVISIONTYPES_ID,
  GET_DISTRICT_ON_STATE,
  GET_PRICELIST,
  GET_ADDRESSTYPES,
  GET_PARTTYPE_BY_DIVISIONTYPES_ID,
  GET_PARTY_LIST_API,
  POST_PARTY_DATA,
  UPDATE_PARTY_ID,
  GET_PARTYTYPES,
  GET_COMPANY
} from "./actionTypes";

function* Get_Party_GenratorFunction() {
  const jsonBody = {
    "UserID": loginUserID(),
    "RoleID": loginRoleID(),
    "CompanyID": loginCompanyID()
  }
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

      // index["StateId"] = index.State.id;
      index["State"] = index.State.Name;
      // index["DistrictId"] = index.District.id;
      index["District"] = index.District.Name;
      // index["CompanyId"] = index.Company.id;
      index['Company'] = index.Company.Name;
      // index["PartyTypeId"] = index.PartyType.id;
      index['PartyTypeName'] = index.PartyType.Name;
      // index["PriceListId"] = index.PriceList.id;
      if (!index.PriceList) { index.PriceList = '' }
      else { index["PriceListName"] = index.PriceList.Name; }
      index["PartyAddress"] = address(index);

      return index;
    });



    yield put(getPartyListAPISuccess(data1))
  } catch (error) {

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error for Get Party  ",
    }));
  }
}

function* Submit_Party_GenratorFunction({ Data }) {

  try {
    const response = yield call(Party_Master_Post_API, Data);

    yield put(postPartyDataSuccess(response));
  } catch (error) {

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Delete_Party_GenratorFunction({ id }) {
  try {

    const response = yield call(Party_Master_Delete_API, id);

    yield put(deletePartyIDSuccess(response))
  } catch (error) {

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Edit_Party_GenratorFunction({ id, pageMode }) {

  try {

    const response = yield call(Party_Master_Edit_API, id);
    response.pageMode = pageMode
    yield put(editPartyIDSuccess(response));

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Update_Party_GenratorFunction({ updateData, id }) {

  try {

    const response = yield call(Party_Master_Update_API, updateData, id);

    yield put(updatePartyIDSuccess(response))
  }
  catch (error) {

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}
// GetDistrictOnState API
function* GetDistrictOnState_saga({ id }) {
  try {
    const response = yield call(GetDistrictOnState_For_Dropdown, id);
    yield put(getDistrictOnStateSuccess(response.Data));
  } catch (error) {
    console.log("GetDistrictOnState_saga page error", error);
  }
}

//get pricelist
function* GetPriceList_saga({ }) {
  try {
    const response = yield call(GetPriceList_For_Dropdown);
    yield put(getPriceListSuccess(response.Data));
  } catch (error) {
    console.log("GetpriceList_saga page error", error);
  }
}

//get addresstypes
function* GetAddressTypes_saga({ }) {
  try {
    const response = yield call(GetAddressTypes_For_Dropdown);
    yield put(getAddressTypesSuccess(response.Data));
  } catch (error) {
    console.log("GetAddressTypes_saga page error", error);
  }
}

//get partytypes
function* GetPartyTypes_saga({ }) {
  try {
    const response = yield call(GetPartyTypes_For_Dropdown);
    yield put(getPartyTypesSuccess(response.Data));
  } catch (error) {
    console.log("GetPartyTypes_saga page error", error);
  }
}


//get Company
function* GetCompany_saga({ }) {
  try {
    const response = yield call(GetCompany_For_Dropdown);
    yield put(getCompanySuccess(response.Data));
  } catch (error) {
    console.log("GetCompany_saga page error", error);
  }
}


// GetPartyTypeByDivisionTypeID API dependent on DivisionTypes api
function* GetPartyTypeByDivisionTypeID_GenratorFunction({ id }) {
  try {
    const response = yield call(GetPartyTypeByDivisionTypeID_For_Dropdown, id);
    yield put(GetPartyTypeByDivisionTypeIDSuccess(response.Data));
  } catch (error) {
    console.log("PartyType By DivisionType ID page error", error);
  }
}

// GetCompanyByDivisionTypeID/1 API dependent on DivisionTypes api
function* GetCompanyByDivisionTypeID_GenratorFunction({ id }) {
  try {
    const response = yield call(GetCompanyByDivisionTypeID_For_Dropdown, id);
    yield put(GetCompanyByDivisionTypeIDSuccess(response.Data));
  } catch (error) {
    console.log("Get Company ByDivisionType ID page error", error);
  }
}
function* PartyMasterSaga() {
  yield takeEvery(GET_PARTY_LIST_API, Get_Party_GenratorFunction);
  yield takeEvery(POST_PARTY_DATA, Submit_Party_GenratorFunction);
  yield takeEvery(EDIT_PARTY_ID, Edit_Party_GenratorFunction);
  yield takeEvery(DELETE_PARTY_ID, Delete_Party_GenratorFunction);
  yield takeEvery(UPDATE_PARTY_ID, Update_Party_GenratorFunction);
  yield takeEvery(GET_DISTRICT_ON_STATE, GetDistrictOnState_saga);
  yield takeEvery(GET_PRICELIST, GetPriceList_saga);
  yield takeEvery(GET_ADDRESSTYPES, GetAddressTypes_saga);
  yield takeEvery(GET_PARTYTYPES, GetPartyTypes_saga);
  yield takeEvery(GET_COMPANY, GetCompany_saga);
  yield takeEvery(GET_PARTTYPE_BY_DIVISIONTYPES_ID, GetPartyTypeByDivisionTypeID_GenratorFunction);
  yield takeEvery(GET_COMPANY_BY_DIVISIONTYPES_ID, GetCompanyByDivisionTypeID_GenratorFunction);

}

export default PartyMasterSaga;
