import { call, put, takeEvery } from "redux-saga/effects";
import {
    deleteSalesManIDSuccess,
    editSalesManIDSuccess,
    PostMethod_ForSalesManMasterAPISuccess,
    PostSalesManlistSuccess,
    updateSalesManIDSuccess
} from "./actions";
import {
    detelet_SalesMan_List_Api,
    edit_SalesMan_List_Api,
    Post_SalesMan_List_Api,
    Post_SalesMan_Master_API,
    update_SalesMan_List_Api
} from "../../../helpers/backend_helper";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
    DELETE_SALESMAN_ID,
    EDIT_SALESMAN_ID,
    POST_SALESMAN_LIST,
    POST_METHOD_HANDLER_FOR_SALESMAN_MASTER_API,
    UPDATE_SALESMAN_ID
} from "./actionTypes";
import { AlertState } from "../../actions";

// post api
function* Post_Method_ForSalesManMaster_GenFun({ data }) {

    try {
        const response = yield call(Post_SalesMan_Master_API, data);

        yield put(PostMethod_ForSalesManMasterAPISuccess(response));
    } catch (error) {

        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

// // POST api
function* Post_SalesMan_List_GenratorFunction({ data }) {

    try {
        const response = yield call(Post_SalesMan_List_Api,data);
        yield put(PostSalesManlistSuccess(response.Data));
    } catch (error) {
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

// delete api 
function* Delete_SalesMan_ID_GenratorFunction({ id }) {
    try {

        const response = yield call(detelet_SalesMan_List_Api, id);

        yield put(deleteSalesManIDSuccess(response))
    } catch (error) {

        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

// edit api
function* Edit_SalesMan_ID_GenratorFunction({ id, pageMode }) {
    try {
        const response = yield call(edit_SalesMan_List_Api, id);
        response.pageMode = pageMode
        yield put(editSalesManIDSuccess(response));
        console.log("response in saga", response)

    } catch (error) {
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

// update api
function* Update_SalesMan_ID_GenratorFunction({ updateData, ID }) {
    try {
        const response = yield call(update_SalesMan_List_Api, updateData, ID);
        yield put(updateSalesManIDSuccess(response))
    }
    catch (error) {
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}


function* SalesManSaga() {
    yield takeEvery(POST_METHOD_HANDLER_FOR_SALESMAN_MASTER_API, Post_Method_ForSalesManMaster_GenFun)
    yield takeEvery(POST_SALESMAN_LIST, Post_SalesMan_List_GenratorFunction)
    yield takeEvery(DELETE_SALESMAN_ID, Delete_SalesMan_ID_GenratorFunction)
    yield takeEvery(EDIT_SALESMAN_ID, Edit_SalesMan_ID_GenratorFunction)
    yield takeEvery(UPDATE_SALESMAN_ID, Update_SalesMan_ID_GenratorFunction)

}

export default SalesManSaga;