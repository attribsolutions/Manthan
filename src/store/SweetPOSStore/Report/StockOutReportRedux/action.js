import {
    GO_BUTTON_FOR_STOCK_OUT_ACTION,
    GO_BUTTON_FOR_STOCK_OUT_SUCCESS,
    STOCK_OUT_REPORT_ERROR_ACTION
} from "./actionType";


export const GoButton_For_StockOut_Action = (config) => ({
    type: GO_BUTTON_FOR_STOCK_OUT_ACTION,
    config
});

export const GoButton_For_StockOut_Success = resp => ({
    type: GO_BUTTON_FOR_STOCK_OUT_SUCCESS,
    payload: resp,
})

export const StockOut_Report_ErrorAction = resp => ({
    type: STOCK_OUT_REPORT_ERROR_ACTION,
    payload: resp,
})
