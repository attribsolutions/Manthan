import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";

function* ItemWiseUpdateGoButton_GenFunc({ jsonBody }) {                                   // getList API
    try {
        const response = yield call(apiCall.ItemWiseUpdate_GoButton_API, jsonBody);
        yield put(action.ItemWiseUpdateGoButton_Success(response.Data));
    } catch (error) { yield put(action.ItemWiseUpdateApiErrorAction()) }
}

function* ItemWiseUpdate_Save_GenFunc({ jsonBody }) {                                   // getList API
    try {
        const response = yield call(apiCall.ItemWiseUpdate_Post_API, jsonBody);
        yield put(action.ItemWiseUpdate_Save_Success(response));
    } catch (error) { yield put(action.ItemWiseUpdateApiErrorAction()) }
}

function* ItemWiseUpdateSaga() {
    yield takeLatest(actionType.ITEM_WISE_BULK_UPDATE_GO_BUTTON_ACTION, ItemWiseUpdateGoButton_GenFunc)
    yield takeLatest(actionType.ITEM_WISE_BULK_UPDATE_SAVE_ACTION, ItemWiseUpdate_Save_GenFunc)

}

export default ItemWiseUpdateSaga;  