
import {
    PARTY_WISE_ITEM_SALE_REPORT_API_ERROR_ACTION,
    PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API,
    PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API_SUCCESS,
   
} from "./actionType";

export const PartyWiseItemSaleReport_GoButton_API = (config = {}) => ({ // save Action
    type:  PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API,
    config,
});

export const PartyWiseItemSaleReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

// ***************** Error Action ******************

export const PartyWiseItemSaleReportApiErrorAction = () => ({
    type: PARTY_WISE_ITEM_SALE_REPORT_API_ERROR_ACTION,
})

