import { CX_DD_DIFFRENCE_GO_BUTTON_ACTION, CX_DD_DIFFRENCE_GO_BUTTON_SUCCESS, CX_DD_DIFFRENCE_REPORT_API_ERROR_ACTION } from "./actionType";

export const Cx_DD_Diffrence_Gobtn_Action = (config={}) => ({
	type: CX_DD_DIFFRENCE_GO_BUTTON_ACTION,
	config
});

export const Cx_DD_Diffrence_Gobtn_Success = (resp) => ({
	type: CX_DD_DIFFRENCE_GO_BUTTON_SUCCESS,
	payload: resp,
});

// Cx_DD_Diffrence Report API Error Action
export const Cx_DD_Diffrence_ReportApiErrorAction = () => ({
	type: CX_DD_DIFFRENCE_REPORT_API_ERROR_ACTION,
})