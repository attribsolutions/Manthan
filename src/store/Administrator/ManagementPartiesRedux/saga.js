import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";


function* save_ManagementParties_GenFunc({ config }) {
    try {
        const response = yield call(apiCall.Management_Parties_Post_API, config);
        yield put(action.saveManagementParties_Success(response));
    } catch (error) { CommonConsole(error) }
}

function* getPartyListGenFunc({ jsonBody }) {                                   // getList API
   debugger
  try {
      const response = yield call(apiCall.Go_Button_Post_API, jsonBody);
      response.Data.map((party) => {
        party["Check"] = false
        if (party.Party > 0) {
          { party["Check"] = true }
        }
        return party
      });
      yield put(action.getPartyTableListSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
  }
  
function* ManagementPartiesSaga() {
    yield takeEvery(actionType.SAVE_MANAGEMENT_PARTIES, save_ManagementParties_GenFunc)
    yield takeEvery(actionType.GET_PARTY_TABLE_LIST, getPartyListGenFunc)

}

export default ManagementPartiesSaga;  