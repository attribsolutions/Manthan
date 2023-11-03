import {
    GO_BUTTON_PARTY_DETAILS_LIST,
    GO_BUTTON_PARTY_DETAILS_LIST_SUCCESS,
    PARTY_DETAILS_API_ERROR_ACTION,
    SAVE_PARTY_DETAILS,
    SAVE_PARTY_DETAILS_SUCCESS
} from "./actionType";

export const savePartyDetails_Action = (config = {}) => ({// save Action
    type: SAVE_PARTY_DETAILS,
    config,
});

export const savePartyDetails_Success = (resp) => ({// Save  success
    type: SAVE_PARTY_DETAILS_SUCCESS,
    payload: resp,
});

export const GoButton_For_PartyDetails = (employeeID) => ({  // go button api
    type: GO_BUTTON_PARTY_DETAILS_LIST,
    employeeID,
});

export const GoButton_For_PartyDetails_Success = (resp) => ({
    type: GO_BUTTON_PARTY_DETAILS_LIST_SUCCESS,
    payload: resp,
})

export const PartyDetailsApiErrorAction = () => ({   // Error action
    type: PARTY_DETAILS_API_ERROR_ACTION,
})
