import { call, put, takeLatest } from "redux-saga/effects";
import { ManPowerReportApiErrorAction, ManPower_Get_Success } from "./action";
import { MAN_POWER_GET_ACTION } from "./actionType";
import { ManPower_Get_Api } from "../../../helpers/backend_helper";
import { date_dmy_func } from "../../../components/Common/CommonFunction";

function* ManPowerReport_GenFunc({ config }) {

	try {
		const response = yield call(ManPower_Get_Api, config);

		response.Data.map((i) => {
			i["FSSAIExpiry"] = date_dmy_func(i.FSSAIExpiry);
			return i;
		});

		yield put(ManPower_Get_Success(response.Data))
	} catch (error) { yield put(ManPowerReportApiErrorAction()) }
}

function* ManPowerReportSaga() {
	yield takeLatest(MAN_POWER_GET_ACTION, ManPowerReport_GenFunc)
}

export default ManPowerReportSaga;
