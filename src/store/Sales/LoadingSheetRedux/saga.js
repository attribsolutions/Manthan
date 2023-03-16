import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, loginJsonBody, loginPartyID } from "../../../components/Common/CommonFunction";
import { Loading_Sheet_get_API, Loading_Sheet_Go_Button_API, Loading_Sheet_Post_API } from "../../../helpers/backend_helper";
import { getLoadingSheetListSucccess, LoadingSheet_GoBtn_API_Succcess, SaveLoadingSheetMasterSucccess } from "./action";
import { GET_LOADING_SHEET_LIST, LOADING_SHEET_GO_BUTTON_API, SAVE_LOADING_SHEET_MASTER } from "./actionType";

// GoButton Post API for Loading Sheet
function* goBtn_Post_API_GenFun({ filters }) {
    debugger
    try {
        const response = yield call(Loading_Sheet_Go_Button_API, filters);
        response.Data.map((index) => {
            index["Check"] = false
            return index
        });
        yield put(LoadingSheet_GoBtn_API_Succcess(response));
    } catch (error) { CommonConsole(error) }
}

// Post API For Master Page
function* save_LoadingSheet_GenFun({ config }) {
    try {
        const response = yield call(Loading_Sheet_Post_API, config);
        yield put(SaveLoadingSheetMasterSucccess(response));
    } catch (error) { CommonConsole(error) }
}

// Post API For Master Page
function* get_LoadingSheet_List_GenFun() {
    const filters = loginJsonBody()
    try {
        const response = yield call(Loading_Sheet_get_API, filters);
        yield put(getLoadingSheetListSucccess(response.Data));
    } catch (error) { CommonConsole(error) }
}


function* LoadingSheetSaga() {
    yield takeEvery(LOADING_SHEET_GO_BUTTON_API, goBtn_Post_API_GenFun)
    yield takeEvery(SAVE_LOADING_SHEET_MASTER, save_LoadingSheet_GenFun)
    yield takeEvery(GET_LOADING_SHEET_LIST, get_LoadingSheet_List_GenFun)
}

export default LoadingSheetSaga;