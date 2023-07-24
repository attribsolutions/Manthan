import {
    STOCK_PROCESSING_ACTION,
    STOCK_PROCESSING_API_SUCCESS,
    STOCK_REPORT_1_GO_BUTTON_API,
    STOCK_REPORT_1_GO_BUTTON_API_SUCCESS,
    STOCK_REPORT_API_ERROR_ACTION,
    STOCK_REPORT_GO_BUTTON_API,
    STOCK_REPORT_GO_BUTTON_API_SUCCESS
} from "./actionType";

export const stockReport_GoButton_API = (config = {}) => ({ // save Action
    type: STOCK_REPORT_GO_BUTTON_API,
    config,
});

export const stockReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: STOCK_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

//*************** */ Stock Report 1 ***************************
export const StockProcessing_Action = (config = {}) => ({
    type: STOCK_PROCESSING_ACTION,
    config,
});

export const StockProcessing_API_Success = (resp) => ({ 
    type: STOCK_PROCESSING_API_SUCCESS,
    payload: resp,
});

export const stockReport_1_GoButton_API = (config = {}) => ({ 
    type: STOCK_REPORT_1_GO_BUTTON_API,
    config,
});

export const stockReport_1_GoButton_API_Success = (resp) => ({ 
    type: STOCK_REPORT_1_GO_BUTTON_API_SUCCESS,
    payload: resp,
});


// ***************** Error Action ******************
export const stockReportApiErrorAction = () => ({
    type: STOCK_REPORT_API_ERROR_ACTION,
})

