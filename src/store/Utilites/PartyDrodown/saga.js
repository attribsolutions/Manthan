import { call, put, takeLatest } from "redux-saga/effects";
import { GET_COMMON_PARTY_DROPDWON_OPTION_ACTION } from "./actionType";
import { CommonConsole, loginEmployeeID } from "../../../components/Common/CommonFunction";
import { commonPartyDropdown_API } from "../../../helpers/backend_helper";
import { getCommonPartyDrodownOptionActionSuccess } from "./action";

function* commonPartyDropdown_GenFunc() {

    try {
        const response = yield call(commonPartyDropdown_API, loginEmployeeID());
        yield put(getCommonPartyDrodownOptionActionSuccess(response.Data))
    } catch (error) { CommonConsole(error) }
}

function* CommonPartyDrodown_Saga() {
    yield takeLatest(GET_COMMON_PARTY_DROPDWON_OPTION_ACTION, commonPartyDropdown_GenFunc);
}
export default CommonPartyDrodown_Saga;
