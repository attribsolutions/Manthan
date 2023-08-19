import { call, put, takeLatest } from "redux-saga/effects";
import {
    DELETE_CLAIM_ID,
    POST_CLAIM_CREATE_SUMMARY_API,
    POST_ORDER_SUMMARY_API,
} from "./actionType";
import { MasterClaimCreatApiErrorAction, OrderSummaryApiErrorAction, deleteClaimSuccess, postMasterClaimCreat_API_Success, postOrderSummary_API_Success } from "./action";
import { MasterClaimCreate_API, OderSummary_GoBtn_API, delete_Claim_API } from "../../../helpers/backend_helper";

function* MasterClaimCreat_GenFunc({ config }) {

    try {
        const response = yield call(MasterClaimCreate_API, config);
        yield put(postMasterClaimCreat_API_Success(response))
    } catch (error) { yield put(MasterClaimCreatApiErrorAction()) }
}

function* Delete_Claim_ID_GenFunc({ config }) {                    // delete API

    try {
        const response = yield call(delete_Claim_API, config);
        yield put(deleteClaimSuccess(response))
    } catch (error) { yield put(MasterClaimCreatApiErrorAction()) }
}

function* MasterClaimCreatSaga() {
    yield takeLatest(POST_CLAIM_CREATE_SUMMARY_API, MasterClaimCreat_GenFunc)
    yield takeLatest(DELETE_CLAIM_ID, Delete_Claim_ID_GenFunc)

}

export default MasterClaimCreatSaga;