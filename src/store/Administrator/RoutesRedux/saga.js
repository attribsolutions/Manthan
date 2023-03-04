import { call, put, takeEvery } from "redux-saga/effects";
import {
    deleteRoutesIDSuccess,
    editRoutesIDSuccess,
    PostMethod_ForRoutesMasterAPISuccess,
    PostRouteslistSuccess,
    updateRoutesIDSuccess
} from "./actions";
import {
    detelet_Routes_List_Api,
    edit_Routes_List_Api,
    Post_Routes_List_Api,
    Post_Routes_Master_API,
    update_Routes_List_Api
} from "../../../helpers/backend_helper";
import {
    DELETE_ROUTES_ID,
    EDIT_ROUTES_ID,
    POST_ROUTES_LIST,
    POST_METHOD_HANDLER_FOR_ROUTES_MASTER_API,
    UPDATE_ROUTES_ID
} from "./actionTypes";
import { CommonConsole, loginCompanyID, loginPartyID } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

// post api
function* Post_Method_ForRoutesMaster_GenFun() {
    try {
        const response = yield call(Post_Routes_Master_API, {
            "Party": loginPartyID(),
            "Company": loginCompanyID()
        });
        yield put(PostMethod_ForRoutesMasterAPISuccess(response));
    } catch (error) { CommonConsole(error) }
}

//Routes List Api Using Post Method
function* Routes_List_GenratorFunction({ data }) {
    try {
        const response = yield call(Post_Routes_List_Api, data);
        yield put(PostRouteslistSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_Routes_ID_GenratorFunction({ id }) {
    try {
        const response = yield call(detelet_Routes_List_Api, id);
        yield put(deleteRoutesIDSuccess(response))
    } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_Routes_ID_GenratorFunction({ id, pageMode }) {
    try {
        const response = yield call(edit_Routes_List_Api, id);
        response.pageMode = pageMode
        yield put(editRoutesIDSuccess(response));
    } catch (error) { CommonConsole(error) }
}

// update api
function* Update_Routes_ID_GenratorFunction({ updateData, ID }) {
    try {
        const response = yield call(update_Routes_List_Api, updateData, ID);
        yield put(updateRoutesIDSuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* RoutesSaga() {
    yield takeEvery(POST_METHOD_HANDLER_FOR_ROUTES_MASTER_API, Post_Method_ForRoutesMaster_GenFun)
    yield takeEvery(POST_ROUTES_LIST, Routes_List_GenratorFunction)
    yield takeEvery(DELETE_ROUTES_ID, Delete_Routes_ID_GenratorFunction)
    yield takeEvery(EDIT_ROUTES_ID, Edit_Routes_ID_GenratorFunction)
    yield takeEvery(UPDATE_ROUTES_ID, Update_Routes_ID_GenratorFunction)
}

export default RoutesSaga;