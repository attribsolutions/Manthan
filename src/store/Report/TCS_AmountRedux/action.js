import { TCS_AMOUNT_GO_BUTTON_ACTION, TCS_AMOUNT_GO_BUTTON_SUCCESS, TCS_AMOUNT_REPORT_API_ERROR_ACTION } from "./actionType";

export const TCS_Amount_Gobtn_Action = (config={}) => ({
	type: TCS_AMOUNT_GO_BUTTON_ACTION,
	config
});

export const TCS_Amount_Gobtn_Success = (resp) => ({
	type: TCS_AMOUNT_GO_BUTTON_SUCCESS,
	payload: resp,
});

// TCS_Amount Report API Error Action
export const TCS_Amount_ReportApiErrorAction = () => ({
	type: TCS_AMOUNT_REPORT_API_ERROR_ACTION,
})
