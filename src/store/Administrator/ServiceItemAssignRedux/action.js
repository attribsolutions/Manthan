import {
    GO_BUTTON_SERVICE_ITEM_ASSIGN,
    GO_BUTTON_SERVICE_ITEM_ASSIGN_SUCCESS,
    SAVE_SERVICE_ITEM_ASSIGN_ACTION,
    SAVE_SERVICE_ITEM_ASSIGN_SUCCESS,
    SERVICE_ITEM_ASSIGN_API_ERROR_ACTION
} from "./actionType";

export const save_ServiceItemAssign_Action = (config = {}) => ({    // save Action
    type: SAVE_SERVICE_ITEM_ASSIGN_ACTION,
    config,
});

export const save_ServiceItemAssign_Success = (resp) => ({       // Save  success
    type: SAVE_SERVICE_ITEM_ASSIGN_SUCCESS,
    payload: resp,
});

// Get Item List for Service Item Master *** Go Button API
export const goButton_ServiceItemAssign = (config) => ({        // After Party Select service Item List API
    type: GO_BUTTON_SERVICE_ITEM_ASSIGN,
    config,
});

export const goButton_ServiceItemAssign_Success = data => ({    // After Party Select service Item List API success
    type: GO_BUTTON_SERVICE_ITEM_ASSIGN_SUCCESS,
    payload: data,
})

export const ServiceItemAssign_ApiError_Action = () => ({
    type: SERVICE_ITEM_ASSIGN_API_ERROR_ACTION,
})
