import { call, put, takeEvery } from "redux-saga/effects";
import {
    POST_METHOD_FOR_GENERAL_API,
    DELETE_GENERAL_ID,
    EDIT_GENERAL_ID,
    GET_GENERAL_LIST,
    UPDATE_GENERAL_ID,
    GET_TYPE
} from "./actionType";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
    get_Type_API,
    Post_General_API,
    detelet_General_List_Api,
    edit_General_List_Api,
    get_General_List_Api,
    update_General_List_Api
} from "../../../helpers/backend_helper";
import {
    PostMethodForGeneralSuccess,
    deleteGeneralIDSuccess,
    editGeneralIDSuccess,
    getGenerallistSuccess,
    updateGeneralIDSuccess,
    getTypeSuccess
} from "./action";

// post api
function* Post_Method_ForGeneral_GenFun({ data }) {
    yield put(SpinnerState(true))
    try {
        const response = yield call(Post_General_API, data);
        yield put(SpinnerState(false))
        yield put(PostMethodForGeneralSuccess(response));
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}


// get api
function* Get_General_List_GenratorFunction() {
    yield put(SpinnerState(true))
    try {
        const response = yield call(get_General_List_Api);
        yield put(getGenerallistSuccess(response.Data));
        yield put(SpinnerState(false))
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

// delete api 
function* Delete_General_ID_GenratorFunction({ id }) {
    try {
        yield put(SpinnerState(true))
        const response = yield call(detelet_General_List_Api, id);
        yield put(SpinnerState(false))
        yield put(deleteGeneralIDSuccess(response))
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

// edit api
function* Edit_General_ID_GenratorFunction({ id, pageMode }) {
    try {
        const response = yield call(edit_General_List_Api, id);
        response.pageMode = pageMode
        yield put(editGeneralIDSuccess(response));
        console.log("response in saga", response)

    } catch (error) {
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

// update api
function* Update_General_ID_GenratorFunction({ updateData, ID }) {
    try {
        yield put(SpinnerState(true))
        const response = yield call(update_General_List_Api, updateData, ID);
        yield put(SpinnerState(false))
        yield put(updateGeneralIDSuccess(response))
    }
    catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

/// TypeDropdown
function* Type() {
    try {
        const response = yield call(get_Type_API);
        yield put(getTypeSuccess(response.Data));
    }
    catch (error) {
    }
}


function* GeneralSaga() {
    yield takeEvery(POST_METHOD_FOR_GENERAL_API, Post_Method_ForGeneral_GenFun)
    yield takeEvery(GET_GENERAL_LIST, Get_General_List_GenratorFunction)
    yield takeEvery(DELETE_GENERAL_ID, Delete_General_ID_GenratorFunction)
    yield takeEvery(EDIT_GENERAL_ID, Edit_General_ID_GenratorFunction)
    yield takeEvery(UPDATE_GENERAL_ID, Update_General_ID_GenratorFunction)
    yield takeEvery(GET_TYPE,Type)
}

export default GeneralSaga;