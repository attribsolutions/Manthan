import { call, put, takeEvery } from "redux-saga/effects";
import {
    deleteSalesManID_Success,
    editSalesManIDSuccess,
    saveSalesManMasterSuccess,
    getSalesManlistSuccess,
    updateSalesManIDSuccess
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
import { CommonConsole, loginJsonBody } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

function* save_SalesMan_Master_GenFun({ config = {} }) {
    try {
        const response = yield call(SalesMan_Post_API, config);
        yield put(saveSalesManMasterSuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* Post_SalesMan_List_GenratorFunction() {
    const filters = loginJsonBody();// required only PartyID and CompanyID
    try {
        const response = yield call(SalesMan_Get_API, filters);
        yield put(getSalesManlistSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* Edit_SalesMan_ID_GenratorFunction({ config = {} }) {
    const { btnmode } = config;
    try {
        const response = yield call(SalesMan_Edit_API, config);
        response.pageMode = btnmode
        yield put(editSalesManIDSuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* Update_SalesMan_ID_GenratorFunction({ config = {} }) {
    try {
        const response = yield call(SalesMan_Update_API, config);
        yield put(updateSalesManIDSuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* Delete_SalesMan_ID_GenratorFunction({ config = {} }) {
    try {
        const response = yield call(SalesMan_Delete_API, config);
        yield put(deleteSalesManID_Success(response))
    } catch (error) { CommonConsole(error) }
}

function* SalesManSaga() {
    yield takeEvery(SAVE_SALES_MAN_MASTER, save_SalesMan_Master_GenFun)
    yield takeEvery(GET_SALESMAN_LIST, Post_SalesMan_List_GenratorFunction)
    yield takeEvery(DELETE_SALESMAN_ID, Delete_SalesMan_ID_GenratorFunction)
    yield takeEvery(EDIT_SALESMAN_ID, Edit_SalesMan_ID_GenratorFunction)
    yield takeEvery(UPDATE_SALESMAN_ID, Update_SalesMan_ID_GenratorFunction)
}

export default SalesManSaga;