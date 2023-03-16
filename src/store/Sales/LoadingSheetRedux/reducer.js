import {
    GET_LOADING_SHEET_LIST_SUCCESS,
    LOADING_SHEET_GO_BUTTON_API_SUCCESS,
    SAVE_LOADING_SHEET_MASTER_SUCCESS
} from "./actionType"

const INIT_STATE = {
    goBtnLoadingSheet: [],
    postMsg: { Status: false },
    LoadingSheetList:[]
}

const LoadingSheetReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case LOADING_SHEET_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                goBtnLoadingSheet: action.payload,
            }
        case SAVE_LOADING_SHEET_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }
        case GET_LOADING_SHEET_LIST_SUCCESS:
            return {
                ...state,
                LoadingSheetList: action.payload,
            }
        default:
            return state
    }
}

export default LoadingSheetReducer