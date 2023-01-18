import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
    DemandPage_GoButton_API,
    DemandPage_Post_API,
    getDivision
} from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
    postGoButtonForDemandSuccess,
    postDemandSuccess
} from "./action";
import {
    POST_GO_BUTTON_FOR_DEMAND,
    POST_DEMAND
} from "./actionType";

// GO Botton Post API
function* GoButton_Demand_genfun({ data }) {
    yield put(SpinnerState(true))
    try {
        const response = yield call(DemandPage_GoButton_API, data);
        yield put(SpinnerState(false))
        yield put(postGoButtonForDemandSuccess(response.Data));

    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message Go Button in Work Order ",
        }));
    }
}

//post api
function* Post_Demand_Genfun({ data }) {

    yield put(SpinnerState(true))
    try {

        const response = yield call(DemandPage_Post_API, data);
        yield put(SpinnerState(false))
        yield put(postDemandSuccess(response));
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

//post api
function* get_Division_Genfun({ data }) {

    yield put(SpinnerState(true))
    try {

        const response = yield call(getDivision, data);
        yield put(SpinnerState(false))
        // yield put(postDemandSuccess(response));
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}


function* DemandSaga() {
    yield takeEvery(POST_GO_BUTTON_FOR_DEMAND, GoButton_Demand_genfun)
    yield takeEvery(POST_DEMAND, Post_Demand_Genfun)
}

export default DemandSaga;