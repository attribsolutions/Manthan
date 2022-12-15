import { call, put, takeEvery } from "redux-saga/effects";
import { Material_Issue_GoButton_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { postGoButtonForMaterialIssue_MasterSuccess } from "./action";
import { POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER } from "./actionType";



// GO Botton Post API
function* MaterialIssueGoButton_gunfun({ data }) {
debugger
    yield put(SpinnerState(true))
    try {
        const response = yield call(Material_Issue_GoButton_Post_API, data);
        yield put(SpinnerState(false))
        yield put(postGoButtonForMaterialIssue_MasterSuccess(response.Data));
        console.log(response)
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message Go Button in Work Order ",
        }));
    }
}

function* MaterialIssueSaga() {
    yield takeEvery(POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER, MaterialIssueGoButton_gunfun)
}

export default MaterialIssueSaga;