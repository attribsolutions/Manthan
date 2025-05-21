import { call, put, takeLatest } from "redux-saga/effects";
import { VOUCHER_REDEMPTION_CLAIM_ACTION } from "./actionType";
import { VoucherRedemptionClaim_Action_Success, VoucherRedemptionClaim_ErrorAction } from "./action";
import { VoucherRedemption_Aip } from "../../../helpers/backend_helper";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import { amountCommaSeparateFunc } from "../../../components/Common/CommonFunction";
import { numberWithCommas } from "../../../Reports/Report_common_function";


function* VoucherRedemptionClaim_GenFunc({ config }) {

	try {
		const response = yield call(VoucherRedemption_Aip, config);

		if ((response.Status === true) && (response.StatusCode === 204)) {
			customAlert({
				Type: 3,
				Message: response.Message,
			})
			yield put(VoucherRedemptionClaim_Action_Success([]))
			return
		}

		const transformedData = response?.Data.map(item => ({
			...item,
			TotalClaimAmount: numberWithCommas(Number(item.TotalClaimAmount).toFixed(2)),
			recordsAmountTotal: item.TotalClaimAmount,
		}));

		yield put(VoucherRedemptionClaim_Action_Success(transformedData))
	} catch (error) { yield put(VoucherRedemptionClaim_ErrorAction()) }
}

function* VoucherRedemptionClaimSaga() {
	yield takeLatest(VOUCHER_REDEMPTION_CLAIM_ACTION, VoucherRedemptionClaim_GenFunc)
	
}

export default VoucherRedemptionClaimSaga;
