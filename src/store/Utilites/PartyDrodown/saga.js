import { call, put, takeLatest } from "redux-saga/effects";
import { COMMON_PARTY_DROPDOWN } from "./actionType";
import { CommonConsole, loginEmployeeID } from "../../../components/Common/CommonFunction";
import { commonPartyDropdown_API } from "../../../helpers/backend_helper";
import { commonPartyDrodownSuccess } from "./action";

function* commonPartyDropdown_GenFunc() {

    try {
        const response = yield call(commonPartyDropdown_API, loginEmployeeID());
        yield put(commonPartyDrodownSuccess(response.Data))
    } catch (error) { CommonConsole(error) }
}

function* CommonPartyDrodown_Saga() {
    yield takeLatest(COMMON_PARTY_DROPDOWN, commonPartyDropdown_GenFunc);
}
export default CommonPartyDrodown_Saga;
