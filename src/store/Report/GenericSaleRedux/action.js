import {
    GENERIC_SALE_REPORT_API_ERROR_ACTION,
    GO_BUTTON_FOR_GENERIC_SALE_ACTION,
    GO_BUTTON_FOR_GENERIC_SALE_SUCCESS
} from "./actionType";

export const GoButton_For_GenericSale_Action = (config) => ({
    type: GO_BUTTON_FOR_GENERIC_SALE_ACTION,
    config
});

export const GoButton_For_GenericSale_Success = resp => ({
    type: GO_BUTTON_FOR_GENERIC_SALE_SUCCESS,
    payload: resp,
})
