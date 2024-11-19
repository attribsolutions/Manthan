import {
    FRENCHISES_ITEM_SALE_REPORT_ACTION,
    FRENCHISES_ITEM_SALE_REPORT_ACTION_SUCCESS,
    FRENCHISES_ITEM_SALE_REPORT_ERROR_ACTION,
} from "./actionType";

export const Frenchies_Item_sale_Report_Action = (config={}) => ({
    type: FRENCHISES_ITEM_SALE_REPORT_ACTION,
    config
});

export const Frenchies_Item_sale_Report_Action_Success = resp => ({
    type: FRENCHISES_ITEM_SALE_REPORT_ACTION_SUCCESS,
    payload: resp,
})

export const Frenchies_Item_sale_Report_ErrorAction = resp => ({
    type: FRENCHISES_ITEM_SALE_REPORT_ERROR_ACTION,
    payload: resp,
})
