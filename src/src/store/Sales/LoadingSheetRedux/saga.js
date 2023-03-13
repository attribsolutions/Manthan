import { call, put, takeEvery } from "redux-saga/effects";
import { LoadingSheet_GoBtn_API_Succcess } from "./action";
import { LOADING_SHEET_GO_BUTTON_API } from "./actionType";


// post api
function* goBtn_Post_API_GenFun({ config }) {
    try {
        const response = yield call(Vehicle_Post_API, config);
        yield put(LoadingSheet_GoBtn_API_Succcess(response));
    } catch (error) { CommonConsole(error) }
}

function* InvoiceSaga() {
    yield takeEvery(LOADING_SHEET_GO_BUTTON_API, goBtn_Post_API_GenFun)
}

export default InvoiceSaga;