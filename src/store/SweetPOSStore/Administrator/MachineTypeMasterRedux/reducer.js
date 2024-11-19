import {
    S_POS_MACHINE_TYPE_API_ERROR_ACTION,
    S_POS_MACHINE_TYPE_LIST_ACTION,
    S_POS_MACHINE_TYPE_LIST_SUCCESS,
    S_POS_MACHINE_TYPE_SAVE_ACTION,
    S_POS_MACHINE_TYPE_SAVE_SUCCESS
} from "./actionType"


const INIT_STATE = {
    postMsg: { Status: false },
    SPosMachineTypeListData: [],
    listBtnLoading: false,
    saveBtnloading: false
}

const SPos_MachineType_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case S_POS_MACHINE_TYPE_SAVE_ACTION:
            return {
                ...state,
                saveBtnloading: true
            }

        case S_POS_MACHINE_TYPE_SAVE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false
            }

        // get api
        case S_POS_MACHINE_TYPE_LIST_ACTION:
            return {
                ...state,
                listBtnLoading: true,
            }

        case S_POS_MACHINE_TYPE_LIST_SUCCESS:
            return {
                ...state,
                SPosMachineTypeListData: action.payload,
                listBtnLoading: false,
            }

        case S_POS_MACHINE_TYPE_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default SPos_MachineType_Reducer;





