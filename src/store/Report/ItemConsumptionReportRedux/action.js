import {
    ITEM_CONSUMPTION_REPORT_API_ERROR_ACTION,
    ITEM_CONSUMPTION_REPORT_GO_BUTTON_API,
    ITEM_CONSUMPTION_REPORT_GO_BUTTON_API_SUCCESS,
   
} from "./actionType";

export const ItemConsumptionReport_GoButton_API = (config = {}) => ({ // save Action
    type: ITEM_CONSUMPTION_REPORT_GO_BUTTON_API,
    config,
});

export const ItemConsumptionReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: ITEM_CONSUMPTION_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

// ***************** Error Action ******************

export const ItemConsumptionApiErrorAction = () => ({
    type: ITEM_CONSUMPTION_REPORT_API_ERROR_ACTION,
})

