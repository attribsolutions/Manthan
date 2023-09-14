import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";

function* BatchCode_By_ItemID_API_GenFunc(data) { // Save GRN  genrator function
    
    const { itemId, partyId } = data
    try {
        const response = yield call(apiCall.getBatchCode_By_ItemID_api, itemId, partyId);
        yield put(action.getBatchCode_By_ItemID_Action_Success(response.Data));
    } catch (error) { yield put(action.StockAdjustmentApiErrorAction()) }
}

function* StockAdjustmentSaga() {

    yield takeLatest(actionType.GET_BATCH_CODE_BY_ITEM_ID_ACTION, BatchCode_By_ItemID_API_GenFunc)
}
export default StockAdjustmentSaga;  