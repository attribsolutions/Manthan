import { call, put, takeLatest } from "redux-saga/effects";
import { loginJsonBody } from "../../../components/Common/CommonFunction";
import { Post_Route_Update_API, Route_Update_List_API } from "../../../helpers/backend_helper";
import { Post_RouteUpdateSuccess, RouteUpdateApiErrorAction, RouteUpdateListSuccess } from "./action";
import { POST_ROUTE_UPDATE, ROUTE_UPDATE_LIST } from "./actionType";

//Routes List Api Using Post Method
function* RouteUpdate_List_GenratorFunction() {

    const filters = loginJsonBody() // Only PartyID is Required
    try {
        debugger
        const response = yield call(Route_Update_List_API, filters);
        yield put(RouteUpdateListSuccess(response));
    } catch (error) { yield put(RouteUpdateApiErrorAction()) }
}

function* Post_RouteUpdate_GenratorFunction({ config = {} }) {
    try {
        const response = yield call(Post_Route_Update_API, config);
        yield put(Post_RouteUpdateSuccess(response));
    } catch (error) { yield put(RouteUpdateApiErrorAction()) }
}

function* RouteUpdateSaga() {
    yield takeLatest(ROUTE_UPDATE_LIST, RouteUpdate_List_GenratorFunction)
    yield takeLatest(POST_ROUTE_UPDATE, Post_RouteUpdate_GenratorFunction)
}

export default RouteUpdateSaga;