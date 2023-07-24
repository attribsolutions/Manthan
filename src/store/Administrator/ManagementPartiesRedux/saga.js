import { call, put, takeLatest } from "redux-saga/effects";
import { loginCompanyID } from "../../../components/Common/CommonFunction";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";

function* save_ManagementParties_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.Management_Parties_Post_API, config);
    yield put(action.saveManagementParties_Success(response));
  } catch (error) { yield put(action.ManagementPartiesApiErrorAction()) }
}

function* getPartyListGenFunc({ jsonBody }) {                                   // getList API
  try {
    const response = yield call(apiCall.Go_Button_Post_API, jsonBody);
    response.Data.map((party) => {
      party["selectCheck"] = false
      if (party.Party > 0) {
        { party["selectCheck"] = true }
      }
      return party
    });
    yield put(action.getPartyTableListSuccess(response.Data));
  } catch (error) { yield put(action.ManagementPartiesApiErrorAction()) }
}

function* getEmployeeDrodownListGenFunc() {                                   // getList API
  try {
    const response = yield call(apiCall.Employee_drodown_Post_API, { "Company": loginCompanyID() });
    yield put(action.getEmployeedropdownListSuccess(response.Data));
  } catch (error) { yield put(action.ManagementPartiesApiErrorAction()) }
}

function* ManagementPartiesSaga() {
  yield takeLatest(actionType.SAVE_MANAGEMENT_PARTIES, save_ManagementParties_GenFunc)
  yield takeLatest(actionType.GET_PARTY_TABLE_LIST, getPartyListGenFunc)
  yield takeLatest(actionType.GET_EMPLOYEE_DROPDWOPN_LIST, getEmployeeDrodownListGenFunc)
}

export default ManagementPartiesSaga;  