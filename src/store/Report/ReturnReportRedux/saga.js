import { call, put, takeLatest } from "redux-saga/effects";
import { RETURN_REPORT_ACTION } from "./actionType";
import { Return_Report_Action_Success, Return_Report_ErrorAction } from "./action";
import { ReturnReport_API } from "../../../helpers/backend_helper";
import { date_dmy_func } from "../../../components/Common/CommonFunction";

function* ReturnReport_GenFunc({ config }) {

	try {
		const response = yield call(ReturnReport_API, config);
		response.Data.map((i) => {
			i["FullReturnNumber"] = (`${i.FullReturnNumber}(${i.id})`);
			i.ReturnDate=date_dmy_func(i.ReturnDate);
			return i;
		});
		yield put(Return_Report_Action_Success(response))
	} catch (error) { yield put(Return_Report_ErrorAction()) }
}

function* ReturnReportSaga() {
	yield takeLatest(RETURN_REPORT_ACTION, ReturnReport_GenFunc)
}

export default ReturnReportSaga;
