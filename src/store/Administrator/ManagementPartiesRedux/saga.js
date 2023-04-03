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

function* ManagementPartiesSaga() {
    yield takeEvery(actionType.SAVE_MANAGEMENT_PARTIES, save_ManagementParties_GenFunc)
}

export default ManagementPartiesSaga;  