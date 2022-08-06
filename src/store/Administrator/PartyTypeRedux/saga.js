import { call, put, takeEvery } from "redux-saga/effects";
import { DivisionTypes_For_Dropdown, Party_Types_API } from "../../../helpers/backend_helper";
import { getDivisionType_DropdownIDSuccess, PostPartyTypesSubmitSuccess, PostPartyTypeSubmitSuccess } from "./action";
import { GET_DIVISIONTYPE_DROPDOWN, POST_PARTYTYPES_SUBMIT } from "./actionTypes";

function* PartyType_GneratorFunction({ data }) {
  try {
    const response = yield call(Party_Types_API, data);
    yield put(PostPartyTypesSubmitSuccess(response));
    console.log("response",response)
  } catch (error) {
  }
}

  

  function* PartyTypesSaga() {
    yield takeEvery(POST_PARTYTYPES_SUBMIT, PartyType_GneratorFunction)
 
  }
  
  export default PartyTypesSaga;