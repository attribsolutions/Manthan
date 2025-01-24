import {
    GRN_PENDING_ACTION,
    GRN_PENDING_ACTION_SUCCESS,
    GRN_PENDING_ERROR_ACTION
} from "./actionType";

export const Grn_Pending_Action = (config) => ({
    type: GRN_PENDING_ACTION,
    config
});

export const Grn_Pending_Action_Success = resp => ({
    type: GRN_PENDING_ACTION_SUCCESS,
    payload: resp,
})

export const Grn_Pending_ErrorAction = resp => ({
    type: GRN_PENDING_ERROR_ACTION,
    payload: resp,
})
