import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { url } from "../../../routes";

function* ItemWiseUpdateGoButton_GenFunc({ jsonBody }) {
    try {
        const response = yield call(apiCall.ItemWiseUpdate_GoButton_API, jsonBody);
        yield put(action.ItemWiseUpdateGoButton_Success(response.Data));
    } catch (error) { yield put(action.ItemWiseUpdateApiErrorAction()) }
}

function* ItemWiseUpdate_Save_GenFunc({config}) {
    const { subPageMode } = config
    
    try {
        let response
        if (subPageMode === url.ITEM_SUPPLIER_ASSIGN) {
            response = yield call(apiCall.ItemSupplier_Post_API, config);
        } else {
            response = yield call(apiCall.ItemWiseUpdate_Post_API, config);
        }
        yield put(action.ItemWiseUpdate_Save_Success(response));
    } catch (error) { yield put(action.ItemWiseUpdateApiErrorAction()) }
}

function* ItemsSupplierList_GenFunc() {
    try {
        const response = yield call(apiCall.ItemSupplierList_Get_API);
        yield put(action.ItemSupplierList_Success(response.Data));
    } catch (error) { yield put(action.ItemWiseUpdateApiErrorAction()) }
}

function* ItemWiseUpdateSaga() {
    yield takeLatest(actionType.ITEM_WISE_BULK_UPDATE_GO_BUTTON_ACTION, ItemWiseUpdateGoButton_GenFunc)
    yield takeLatest(actionType.ITEM_WISE_BULK_UPDATE_SAVE_ACTION, ItemWiseUpdate_Save_GenFunc)
    yield takeLatest(actionType.ITEM_SUPPLIER_LIST_ACTION, ItemsSupplierList_GenFunc)
}

export default ItemWiseUpdateSaga;  