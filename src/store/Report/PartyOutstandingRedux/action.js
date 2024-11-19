import {
    PARTY_OUTSTANDING_REPORT_API_ERROR_ACTION,
    PARTY_OUTSTANDING_REPORT_GO_BUTTON_API,
    PARTY_OUTSTANDING_REPORT_GO_BUTTON_API_SUCCESS
} from "./actionType";

export const PartyOutstandingReport_GoButton_API = (config = {}) => ({ // save Action
    type: PARTY_OUTSTANDING_REPORT_GO_BUTTON_API,
    config,
});

export const PartyOutstandingReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: PARTY_OUTSTANDING_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

// ***************** Error Action ******************
export const PartyOutstanding_Api_ErrorAction = () => ({
    type: PARTY_OUTSTANDING_REPORT_API_ERROR_ACTION,
})

