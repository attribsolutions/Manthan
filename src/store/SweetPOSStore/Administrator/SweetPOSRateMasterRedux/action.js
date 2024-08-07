import {
    GET_POS_RATE_LIST_ACTION,
    GET_POS_RATE_LIST_SUCCESS,
    POS_RATE_API_ERROR_ACTION,
    POS_RATE_SAVE_ACTION,
    POS_RATE_SAVE_SUCCESS
} from "./actionType";

export const getPosRateList_Action = () => ({
    type: GET_POS_RATE_LIST_ACTION,
});

export const getPosRateListSuccess = (pages) => ({
    type: GET_POS_RATE_LIST_SUCCESS,
    payload: pages,
});

export const PosRateSave_Action = (config = {}) => ({
    type: POS_RATE_SAVE_ACTION,
    config,
});

export const PosRateSave_Success = (resp) => ({
    type: POS_RATE_SAVE_SUCCESS,
    payload: resp,
});

export const PosRateApiErrorAction = () => ({
    type: POS_RATE_API_ERROR_ACTION,
})
