import { call, put, takeLatest } from "redux-saga/effects";
import { GRN_PENDING_ACTION } from "./actionType";
import { Grn_Pending_Action_Success, Grn_Pending_ErrorAction } from "./action";

import { GRNpending_Api } from "../../../helpers/backend_helper";

function* GRNPending_Func({ config }) {

	try {
		const response = yield call(GRNpending_Api, config);
		yield put(Grn_Pending_Action_Success(response.Data))
	} catch (error) { yield put(Grn_Pending_ErrorAction()) }
}

function* GRN_Pending_Saga() {
	yield takeLatest(GRN_PENDING_ACTION, GRNPending_Func)
}

export default GRN_Pending_Saga;
