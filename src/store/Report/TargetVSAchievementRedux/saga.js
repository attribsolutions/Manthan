import { call, put, takeLatest } from "redux-saga/effects";
import { Target_Vs_Achievement_Gobtn_API } from "../../../helpers/backend_helper";
import { Target_VS_Achievement_Api_ErrorAction, Target_VS_Achievement_Go_Button_API_Success } from "./action";
import { TARGET_VS_ACHIEVEMENT_GO_BUTTON_API } from "./actionType";

function* Target_VS_Achievement_GenFun(jsonBody) {
    debugger
    try {
        const response = yield call(Target_Vs_Achievement_Gobtn_API, jsonBody);
        yield put(Target_VS_Achievement_Go_Button_API_Success(response.Data))
    } catch (error) { yield put(Target_VS_Achievement_Api_ErrorAction()) }
}

function* TargetVsAchievementSaga() {
    yield takeLatest(TARGET_VS_ACHIEVEMENT_GO_BUTTON_API, Target_VS_Achievement_GenFun)
}

export default TargetVsAchievementSaga;