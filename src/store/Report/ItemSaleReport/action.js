import {
    ITEM_SALE_GO_BUTTON_API,
    ITEM_SALE_GO_BUTTON_API_SUCCESS,
    ITEM_SALE_REPORT_API_ERROR_ACTION
} from "./actionType";

export const ItemSaleGoButton_API = (config = {}) => ({ // save Action
    type: ITEM_SALE_GO_BUTTON_API,
    config,
});

export const ItemSaleGoButton_API_Success = (resp) => ({ // Save  success
    type: ITEM_SALE_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

export const ItemSaleReportApiErrorAction = () => ({
    type: ITEM_SALE_REPORT_API_ERROR_ACTION,
})