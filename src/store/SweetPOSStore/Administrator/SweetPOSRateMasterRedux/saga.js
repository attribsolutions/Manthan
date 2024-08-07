import { call, put, takeLatest } from "redux-saga/effects";
import { POS_RateList_Get_Api, POS_RateMaster_Post_Api } from "../../../../helpers/backend_helper";
import { GET_POS_RATE_LIST_ACTION, POS_RATE_SAVE_ACTION } from "./actionType";
import { getPosRateListSuccess, PosRateApiErrorAction, PosRateSave_Success } from "./action";

function* Save_Pos_RateMaster_GenFun({ config }) {
    try {
        const response = yield call(POS_RateMaster_Post_Api, config);
        yield put(PosRateSave_Success(response));
    } catch (error) { yield put(PosRateApiErrorAction()) }
}

function* Get_Pos_RateList_GenFun() {

    try {
        const response = yield call(POS_RateList_Get_Api);
        let newData = response.Data.map((i) => {
            i.IsChangeRateToDefault = i.IsChangeRateToDefault === true ? true : false
            return i
        })
        yield put(getPosRateListSuccess(newData));
    } catch (error) { yield put(PosRateApiErrorAction()) }
}

function* Pos_RateMaster_Saga() {
    yield takeLatest(POS_RATE_SAVE_ACTION, Save_Pos_RateMaster_GenFun)
    yield takeLatest(GET_POS_RATE_LIST_ACTION, Get_Pos_RateList_GenFun)

}

export default Pos_RateMaster_Saga;