import { MAN_POWER_GET_ACTION, MAN_POWER_GET_SUCCESS, MAN_POWER_REPORT_API_ERROR_ACTION } from "./actionType";


export const ManPower_Get_Action = (config={}) => ({
	type: MAN_POWER_GET_ACTION,
	config
});

export const ManPower_Get_Success = (resp) => ({
	type: MAN_POWER_GET_SUCCESS,
	payload: resp,
});

// ManPower Report API Error Action
export const ManPowerReportApiErrorAction = () => ({
	type: MAN_POWER_REPORT_API_ERROR_ACTION,
})
