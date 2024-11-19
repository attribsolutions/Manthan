import {
    S_POS_MACHINE_TYPE_API_ERROR_ACTION,
    S_POS_MACHINE_TYPE_LIST_ACTION,
    S_POS_MACHINE_TYPE_LIST_SUCCESS,
    S_POS_MACHINE_TYPE_SAVE_ACTION,
    S_POS_MACHINE_TYPE_SAVE_SUCCESS
} from "./actionType";

export const SPos_MachineTypeList_Action = (config = {}) => ({
    type: S_POS_MACHINE_TYPE_LIST_ACTION,
    config
});

export const SPos_MachineTypeList_Success = (pages) => ({
    type: S_POS_MACHINE_TYPE_LIST_SUCCESS,
    payload: pages,
});

export const SPos_MachineTypeSave_Action = (config = {}) => ({
    type: S_POS_MACHINE_TYPE_SAVE_ACTION,
    config,
});

export const SPos_MachineTypeSave_Success = (resp) => ({
    type: S_POS_MACHINE_TYPE_SAVE_SUCCESS,
    payload: resp,
});

export const SPos_MachineTypeApiErrorAction = () => ({
    type: S_POS_MACHINE_TYPE_API_ERROR_ACTION,
})
