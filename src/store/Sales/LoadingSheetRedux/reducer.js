
import {
    LOADING_SHEET_LIST_ACTION_SUCCESS,
    LOADING_SHEET_GO_BUTTON_API_SUCCESS,
    SAVE_LOADING_SHEET_MASTER_SUCCESS
} from "./actionType"

const INIT_STATE = {
    goBtnLoadingSheet: [],
    postMsg: { Status: false },
    LoadingSheetlist: [],

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
        case LOADING_SHEET_LIST_ACTION_SUCCESS:
            return {
                ...state,
                LoadingSheetlist: action.payload,
            }
     


        default:
            return state
    }
}

export default LoadingSheetReducer