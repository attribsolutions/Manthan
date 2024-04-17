import {
    DELETE_RATE_ID_FOR_MASTER,
    DELETE_RATE_ID_FOR_MASTER_SUCCESS,
    DELETE_RATE_LIST_ID,
    DELETE_RATE_LIST_ID_SUCCESS,
    GET_RATE_LIST,
    GET_RATE_LIST_SUCCESS,
    GO_BUTTON_FOR_RATE_MASTER,
    GO_BUTTON_FOR_RATE_MASTER_SUCCESS,
    RATE_API_ERROR_ACTION,
    SAVE_RATE_MASTER,
    SAVE_RATE_MASTER_SUCCESS
} from "./actionType";

// Go Button Post API
export const goButtonForRate_Master = (data) => ({
    type: GO_BUTTON_FOR_RATE_MASTER,
    data
});

export const goButtonForRate_Master_Success = (resp) => ({
    type: GO_BUTTON_FOR_RATE_MASTER_SUCCESS,
    payload: resp,
});

// post api
export const saveRateMaster = (config = {}) => ({
    type: SAVE_RATE_MASTER,
    config,
});

export const saveRateMasterSuccess = (resp) => ({
    type: SAVE_RATE_MASTER_SUCCESS,
    payload: resp,
});

// delete api Rate Master Page
export const deleteRateId_ForMaster = (id) => ({
    type: DELETE_RATE_ID_FOR_MASTER,
    id,
});

export const deleteRateId_ForMaster_Success = (resp) => ({
    type: DELETE_RATE_ID_FOR_MASTER_SUCCESS,
    payload: resp,
});

//get listpage api
export const getRateList = () => ({
    type: GET_RATE_LIST,
});

export const getRateListSuccess = (resp) => ({
    type: GET_RATE_LIST_SUCCESS,
    payload: resp,
});

//delete for List Page
export const deleteRateListId = (config = {}) => ({
    type: DELETE_RATE_LIST_ID,
    config,
});

export const deleteRateListId_Success = (resp) => ({
    type: DELETE_RATE_LIST_ID_SUCCESS,
    payload: resp,
});

export const RateApiErrorAction = () => ({
    type: RATE_API_ERROR_ACTION,
})
