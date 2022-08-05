import { call, put, takeEvery } from "redux-saga/effects";
import { Party_Types_API } from "../../../helpers/backend_helper";
import { PostPartyTypesSubmitSuccess, PostPartyTypeSubmitSuccess } from "./action";
import { POST_PARTYTYPES_SUBMIT } from "./actionTypes";

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