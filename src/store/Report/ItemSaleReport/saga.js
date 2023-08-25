import { call, put, takeLatest } from "redux-saga/effects";
import { ItemSaleGoButton_API_Success, ItemSaleReportApiErrorAction } from "./action";
import { ITEM_SALE_GO_BUTTON_API } from "./actionType";
import { ItemSaleReport_GoBtn_API } from "../../../helpers/backend_helper";

function* ItemSaleReport_GenFunc({ config }) {

    try {
        const response = yield call(ItemSaleReport_GoBtn_API, config);
        yield put(ItemSaleGoButton_API_Success(response.Data))
    } catch (error) { yield put(ItemSaleReportApiErrorAction()) }
}

function* ItemSaleReportSaga() {
    yield takeLatest(ITEM_SALE_GO_BUTTON_API, ItemSaleReport_GenFunc)
}

export default ItemSaleReportSaga;