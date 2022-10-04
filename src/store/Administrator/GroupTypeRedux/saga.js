import { call, put, takeEvery } from "redux-saga/effects";
import { GroupTypes_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { getGroupTypeslistSuccess } from "./action";
import { GET_GROUP_TYPES_LIST } from "./actionType";

// get api
function* Get_GropuTypeList_GenratorFunction() {
    yield put(SpinnerState(true))
    try {
        const response = yield call(GroupTypes_API);
        yield put(getGroupTypeslistSuccess(response.Data));
        yield put(SpinnerState(false))
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

function* GroupTypeSaga() {
    yield takeEvery(GET_GROUP_TYPES_LIST, Get_GropuTypeList_GenratorFunction)

}

export default GroupTypeSaga;