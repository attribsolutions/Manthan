import { call, put, takeLatest } from "redux-saga/effects";
import {
 POST_RETAILER_DATA_API} from "./actionType";
import {  postRetailerData_API_Success, RetailerDataApiErrorAction } from "./action";
import { OderSummary_GoBtn_API, RetailerData_GoBtn_API } from "../../../helpers/backend_helper";

function* RetailerData_Gen({ config }) {
    try {
        const response = yield call(RetailerData_GoBtn_API, config);
        yield put(postRetailerData_API_Success(response))
    } catch (error) { yield put(RetailerDataApiErrorAction()) }
}

function* RetailerDataSaga() {
    yield takeLatest(POST_RETAILER_DATA_API, RetailerData_Gen)
}

export default RetailerDataSaga;