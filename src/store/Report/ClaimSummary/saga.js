import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_CLAIM_CREATE_SUMMARY_API,
    POST_ORDER_SUMMARY_API,
} from "./actionType";
import { MasterClaimCreatApiErrorAction, OrderSummaryApiErrorAction, postMasterClaimCreat_API_Success, postOrderSummary_API_Success } from "./action";
import { MasterClaimCreate_API, OderSummary_GoBtn_API } from "../../../helpers/backend_helper";

function* MasterClaimCreat_GenFunc({ config }) {
    
    try {
        const response = yield call(MasterClaimCreate_API, config);
        yield put(postMasterClaimCreat_API_Success(response))
    } catch (error) { yield put(MasterClaimCreatApiErrorAction()) }
}

function* MasterClaimCreatSaga() {
    yield takeLatest(POST_CLAIM_CREATE_SUMMARY_API, MasterClaimCreat_GenFunc)
}

export default MasterClaimCreatSaga;