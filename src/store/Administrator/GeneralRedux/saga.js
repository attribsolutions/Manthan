import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_METHOD_FOR_GENERAL_API,
    DELETE_GENERAL_ID,
    EDIT_GENERAL_ID,
    POST_GENERAL_LIST,
    UPDATE_GENERAL_ID,
    POST_TYPE,
    GENERAL_MASTER_SUB_TYPE
} from "./actionType";
import {
    post_Type_API,
    Post_General_API,
    delete_General_List_Api,
    edit_General_List_Api,
    Post_General_List_Api,
    update_General_List_Api,
    GeneralMasterSubType_API,
} from "../../../helpers/backend_helper";
import {
    SaveMethodForGeneralSuccess,
    deleteGeneralIDSuccess,
    editGeneralIDSuccess,
    updateGeneralIDSuccess,
    PostTypeSuccess,
    PostGenerallistSuccess,
    GeneralMasterSubType_Success
} from "./action";
import { CommonConsole } from "../../../components/Common/CommonFunction";

// post api
function* Post_Method_ForGeneral_GenFun({ config }) {
    try {
        const response = yield call(Post_General_API, config);
        yield put(SaveMethodForGeneralSuccess(response));
    } catch (error) { CommonConsole(error) }
}

// get api
function* Post_General_List_GenratorFunction({ data }) {
    try {
        const response = yield call(Post_General_List_Api, data);
        yield put(PostGenerallistSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_General_ID_GenratorFunction({ config }) {
  
    try {
        
        const response = yield call(delete_General_List_Api, config);
        yield put(deleteGeneralIDSuccess(response))
    } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_General_ID_GenratorFunction({ config }) {
    const { btnmode } = config;
    try {
        const response = yield call(edit_General_List_Api, config);
        response.pageMode = btnmode;
        yield put(editGeneralIDSuccess(response));
    } catch (error) { CommonConsole(error) }
}

// update api
function* Update_General_ID_GenratorFunction({ config }) {
    try {
        const response = yield call(update_General_List_Api, config);
        yield put(updateGeneralIDSuccess(response))
    } catch (error) { CommonConsole(error) }
}

/// Type Dropdown
function* Post_Type_GenFun({ data }) {
    try {
        const response = yield call(post_Type_API, data);
        yield put(PostTypeSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* GeneralMasterSubType_Genfun({ data }) {
    try {
        const response = yield call(GeneralMasterSubType_API, data);
        yield put(GeneralMasterSubType_Success(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* GeneralSaga() {
    yield takeLatest(POST_METHOD_FOR_GENERAL_API, Post_Method_ForGeneral_GenFun)
    yield takeLatest(POST_GENERAL_LIST, Post_General_List_GenratorFunction)
    yield takeLatest(DELETE_GENERAL_ID, Delete_General_ID_GenratorFunction)
    yield takeLatest(EDIT_GENERAL_ID, Edit_General_ID_GenratorFunction)
    yield takeLatest(UPDATE_GENERAL_ID, Update_General_ID_GenratorFunction)
    yield takeLatest(POST_TYPE, Post_Type_GenFun)
    yield takeLatest(GENERAL_MASTER_SUB_TYPE, GeneralMasterSubType_Genfun)
}

export default GeneralSaga;