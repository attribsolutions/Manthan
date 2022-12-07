import { call, put, takeEvery } from "redux-saga/effects";
import { BOMList_Get_API, GroupTypes_API, GroupTypes_Delete_API, GroupTypes_Edit_API, GroupTypes_Post_API, GroupTypes_Update_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { getBOMListSuccess } from "./action";
import { GET_BOM_LIST } from "./actionTypes";
// get api
function* Get_BOMList_GenratorFunction() {
    yield put(SpinnerState(true))
    try {
        const response = yield call(BOMList_Get_API);
        yield put(getBOMListSuccess(response.Data));
        yield put(SpinnerState(false))
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message BOMList ",
        }));
    }
}

function* WorkOrderSaga() {
    yield takeEvery(GET_BOM_LIST, Get_BOMList_GenratorFunction)
 
}

export default WorkOrderSaga;