import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole, loginPartyID } from "../../../components/Common/CommonFunction";


function* Dashboard_Get_API_GenFunc() {

    try {
        const response = yield call(apiCall.Dashboard_Get_API, loginPartyID());
        yield put(action.getDashbordDetails_Success(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* DashboardSaga() {
    yield takeLatest(actionType.GET_DASHBOARD_DETAILS, Dashboard_Get_API_GenFunc)
}
export default DashboardSaga;  