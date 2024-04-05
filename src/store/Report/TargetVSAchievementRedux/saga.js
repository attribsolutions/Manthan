import { call, put, takeLatest } from "redux-saga/effects";
import { Target_Vs_Achievement_Gobtn_API } from "../../../helpers/backend_helper";
import { Target_VS_Achievement_Api_ErrorAction, Target_VS_Achievement_Go_Button_API_Success } from "./action";
import { TARGET_VS_ACHIEVEMENT_GO_BUTTON_API } from "./actionType";
import { amountCommaSeparateFunc } from "../../../components/Common/CommonFunction";

function* Target_VS_Achievement_GenFun(jsonBody) {

    try {
        const response = yield call(Target_Vs_Achievement_Gobtn_API, jsonBody);
        const newList = yield response.Data.map((i, k) => {
            i.id = k + 1
            i.TargetQuantityInKG = amountCommaSeparateFunc(parseFloat(i.TargetQuantityInKG).toFixed(3))
            i.TargetAmountWithGST = amountCommaSeparateFunc(parseFloat(i.TargetAmountWithGST).toFixed(2))
            i.AchQuantityInKG = amountCommaSeparateFunc(parseFloat(i.AchQuantityInKG).toFixed(3))
            i.AchAmountWithGST = amountCommaSeparateFunc(parseFloat(i.AchAmountWithGST).toFixed(2))

            return i
        })
        yield put(Target_VS_Achievement_Go_Button_API_Success(newList))
    } catch (error) { yield put(Target_VS_Achievement_Api_ErrorAction()) }
}

function* TargetVsAchievementSaga() {
    yield takeLatest(TARGET_VS_ACHIEVEMENT_GO_BUTTON_API, Target_VS_Achievement_GenFun)
}

export default TargetVsAchievementSaga;