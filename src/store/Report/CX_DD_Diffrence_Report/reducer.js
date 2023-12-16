import { CX_DD_DIFFRENCE_GO_BUTTON_ACTION, CX_DD_DIFFRENCE_GO_BUTTON_SUCCESS, CX_DD_DIFFRENCE_REPORT_API_ERROR_ACTION } from "./actionType";

const INIT_STATE = {
	Cx_DD_Diff_ReportGobtn: [],
	goBtnLoading: false,
}

const Cx_DD_Diffrence_Reducer = (state = INIT_STATE, action) => {
	switch (action.type) {

		case CX_DD_DIFFRENCE_GO_BUTTON_ACTION:
			return {
				...state,
				goBtnLoading: true
			}

		case CX_DD_DIFFRENCE_GO_BUTTON_SUCCESS:
			return {
				...state,
				Cx_DD_Diff_ReportGobtn: action.payload,
				goBtnLoading: false
			}

		case CX_DD_DIFFRENCE_REPORT_API_ERROR_ACTION:
			return {
				...state,
				goBtnLoading: false,
			};

		default:
			return state
	}
}

export default Cx_DD_Diffrence_Reducer 
