
import { LOADING_SHEET_LIST_ACTION } from "./actionType"
import {
    LOADING_SHEET_LIST_ACTION_SUCCESS,
    LOADING_SHEET_GO_BUTTON_API_SUCCESS,
    SAVE_LOADING_SHEET_MASTER_SUCCESS,
    LOADING_SHEET_UPDATE_API_ACTION_SUCCESS,
    DELETE_LOADING_SHEET_SUCCESS
} from "./actionType"

const INIT_STATE = {
    loading: false,
    goBtnLoadingSheet: [],
    postMsg: { Status: false },
    LoadingSheetlist: [],
    LoadingSheetUpdate: [],
    deleteMsg: { Status: false },

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


        case LOADING_SHEET_LIST_ACTION:
            return {
                ...state,
                loading: true
            }

        case LOADING_SHEET_LIST_ACTION_SUCCESS:
            return {
                ...state,
                LoadingSheetlist: action.payload,
                loading: false
            }

        case LOADING_SHEET_UPDATE_API_ACTION_SUCCESS:
            return {
                ...state,
                LoadingSheetUpdate: action.payload,
            }
        case DELETE_LOADING_SHEET_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            };

        default:
            return state
    }
}

export default LoadingSheetReducer