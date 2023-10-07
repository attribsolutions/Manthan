import { MAN_POWER_GET_ACTION, MAN_POWER_GET_SUCCESS, MAN_POWER_REPORT_API_ERROR_ACTION } from "./actionType";

const INIT_STATE = {
	manPowerReportGobtn: [],
	goBtnLoading: false,
}

const ManPowerReportReducer = (state = INIT_STATE, action) => {
	switch (action.type) {

		case MAN_POWER_GET_ACTION:
		return {
		...state,
		goBtnLoading: action.config.btnId
		}

		case MAN_POWER_GET_SUCCESS:
			return {
				...state,
				manPowerReportGobtn: action.payload,
				goBtnLoading: false
			}

		case MAN_POWER_REPORT_API_ERROR_ACTION:
			return {
				...state,
				goBtnLoading: false,
			};

		default:
			return state
	}
}

export default ManPowerReportReducer 
