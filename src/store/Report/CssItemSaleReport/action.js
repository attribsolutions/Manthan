import {CSS_ITEM_SALE_GO_BUTTON_ACTION, CSS_ITEM_SALE_GO_BUTTON_SUCCESS, CSS_ITEM_SALE_REPORT_API_ERROR_ACTION } from "./actionType";

export const Css_Item_Sale_Gobtn_Action = (config={}) => ({
	type: CSS_ITEM_SALE_GO_BUTTON_ACTION,
	config
});

export const  Css_Item_Sale_Gobtn_Success = (resp) => ({
	type:CSS_ITEM_SALE_GO_BUTTON_SUCCESS,
	payload: resp,
});

// CSS_ITEM_SALE_Report API Error Action
export const  Css_Item_Sale_Gobtn_ReportApiErrorAction = () => ({
	type: CSS_ITEM_SALE_REPORT_API_ERROR_ACTION,
})