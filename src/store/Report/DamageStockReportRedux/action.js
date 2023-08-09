import {
    DAMAGE_STOCK_REPORT_API_ERROR_ACTION,
    DAMAGE_STOCK_REPORT_GO_BUTTON_API,
    DAMAGE_STOCK_REPORT_GO_BUTTON_API_SUCCESS
} from "./actionType";

export const damageStockReport_GoButton_API = (config = {}) => ({ // save Action
    type: DAMAGE_STOCK_REPORT_GO_BUTTON_API,
    config,
});

export const damageStockReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: DAMAGE_STOCK_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});


// ***************** Error Action ******************
export const stockReportApiErrorAction = () => ({
    type: DAMAGE_STOCK_REPORT_API_ERROR_ACTION,
})

