import { call, put, takeLatest } from "redux-saga/effects";
import {
    deleteSalesManID_Success,
    editSalesManIDSuccess,
    saveSalesManMasterSuccess,
    getSalesManlistSuccess,
    updateSalesManIDSuccess,
    SalesManApiErrorAction
} from "./actions";
import {
    SalesMan_Delete_API,
    SalesMan_Edit_API,
    SalesMan_Get_API,
    SalesMan_Post_API,
    SalesMan_Update_API
} from "../../../helpers/backend_helper";
import {
    DELETE_SALESMAN_ID,
    EDIT_SALESMAN_ID,
    GET_SALESMAN_LIST,
    SAVE_SALES_MAN_MASTER,
    UPDATE_SALESMAN_ID
} from "./actionTypes";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";

function* save_SalesMan_Master_GenFun({ config = {} }) {
    try {
        const response = yield call(SalesMan_Post_API, config);
        yield put(saveSalesManMasterSuccess(response));
    } catch (error) { yield put(SalesManApiErrorAction()) }
}

function* Post_SalesMan_List_GenratorFunction({ jsonBody }) {
    const filters = (jsonBody === undefined || null ? loginJsonBody() : jsonBody);// required only PartyID and CompanyID
    try {
        const response = yield call(SalesMan_Get_API, filters);
        yield put(getSalesManlistSuccess(response.Data));
    } catch (error) { yield put(SalesManApiErrorAction()) }
}

function* Edit_SalesMan_ID_GenratorFunction({ config = {} }) {
    const { btnmode } = config;
    try {
        const response = yield call(SalesMan_Edit_API, config);
        response.pageMode = btnmode
        yield put(editSalesManIDSuccess(response));
    } catch (error) { yield put(SalesManApiErrorAction()) }
}

function* Update_SalesMan_ID_GenratorFunction({ config = {} }) {
    try {
        const response = yield call(SalesMan_Update_API, config);
        yield put(updateSalesManIDSuccess(response))
    } catch (error) { yield put(SalesManApiErrorAction()) }
}

function* Delete_SalesMan_ID_GenratorFunction({ config = {} }) {
    try {
        const response = yield call(SalesMan_Delete_API, config);
        yield put(deleteSalesManID_Success(response))
    } catch (error) { yield put(SalesManApiErrorAction()) }
}

function* SalesManSaga() {
    yield takeLatest(SAVE_SALES_MAN_MASTER, save_SalesMan_Master_GenFun)
    yield takeLatest(GET_SALESMAN_LIST, Post_SalesMan_List_GenratorFunction)
    yield takeLatest(DELETE_SALESMAN_ID, Delete_SalesMan_ID_GenratorFunction)
    yield takeLatest(EDIT_SALESMAN_ID, Edit_SalesMan_ID_GenratorFunction)
    yield takeLatest(UPDATE_SALESMAN_ID, Update_SalesMan_ID_GenratorFunction)
}

export default SalesManSaga;