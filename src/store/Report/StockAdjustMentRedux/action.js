import {STOCK_ADJUSTMENT_REPORT_ACTION, STOCK_ADJUSTMENT_REPORT_SUCCESS, STOCK_ADJUSTMENT_REPORT_API_ERROR_ACTION } from "./actionType";

export const Stock_adjustment_Report_Action = (config={}) => ({
	type: STOCK_ADJUSTMENT_REPORT_ACTION,
	config
});

export const  Stock_adjustment_Report_Success = (resp) => ({
	type:STOCK_ADJUSTMENT_REPORT_SUCCESS,
	payload: resp,
});

// STOCK_ADJUSTMENT_REPORT API Error Action
export const  Stock_adjustment_Report_ApiErrorAction = () => ({
	type: STOCK_ADJUSTMENT_REPORT_API_ERROR_ACTION,
})