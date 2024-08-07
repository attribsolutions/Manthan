import {
    GET_POS_RATE_LIST_ACTION,
    GET_POS_RATE_LIST_SUCCESS,
    POS_RATE_API_ERROR_ACTION,
    POS_RATE_SAVE_ACTION,
    POS_RATE_SAVE_SUCCESS
} from "./actionType"


const INIT_STATE = {
    postMsg: { Status: false },
    PosRateMasterListData: [],
    listBtnLoading: false,
    saveBtnloading: false
}

const PosRateMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POS_RATE_SAVE_ACTION:
            return {
                ...state,
                saveBtnloading: true
            }

        case POS_RATE_SAVE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false
            }

        // get api
        case GET_POS_RATE_LIST_ACTION:
            return {
                ...state,
                listBtnLoading: true,
            }

        case GET_POS_RATE_LIST_SUCCESS:
            return {
                ...state,
                PosRateMasterListData: action.payload,
                listBtnLoading: false,
            }

        case POS_RATE_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default PosRateMasterReducer;





