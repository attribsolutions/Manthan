import { TCS_AMOUNT_GO_BUTTON_ACTION, TCS_AMOUNT_GO_BUTTON_SUCCESS, TCS_AMOUNT_REPORT_API_ERROR_ACTION } from "./actionType";

const INIT_STATE = {
	tcsAmtReportGobtn: [],
	goBtnLoading: false,
}

const TCSAmountReportReducer = (state = INIT_STATE, action) => {
	switch (action.type) {

		case TCS_AMOUNT_GO_BUTTON_ACTION:
			return {
				...state,
				goBtnLoading: true
			}

		case TCS_AMOUNT_GO_BUTTON_SUCCESS:
			return {
				...state,
				tcsAmtReportGobtn: action.payload,
				goBtnLoading: false
			}

		case TCS_AMOUNT_REPORT_API_ERROR_ACTION:
			return {
				...state,
				goBtnLoading: false,
			};

		default:
			return state
	}
}

export default TCSAmountReportReducer 
