import { call, put, takeEvery } from "redux-saga/effects";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
    PostMethod_ForPartySubPartyAPISuccess,
} from "./action";
import {
    Post_PartySubParty_API,
} from "../../../helpers/backend_helper";

import {
    POST_METHOD_FOR_PARTYSUBPARTY_API,
} from "./actionType"
import { AlertState } from "../../actions";

// post api
function* Post_Method_ForPartySubParty_GenFun({ data }) {
    yield put(SpinnerState(true))
    try {
        const response = yield call(Post_PartySubParty_API, data);
        yield put(SpinnerState(false))
        yield put(PostMethod_ForPartySubPartyAPISuccess(response));
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

function* PartySubPartysaga() {
    yield takeEvery(POST_METHOD_FOR_PARTYSUBPARTY_API, Post_Method_ForPartySubParty_GenFun)
}

export default PartySubPartysaga;