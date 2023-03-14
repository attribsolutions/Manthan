import { LOADING_SHEET_GO_BUTTON_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    goBtnLoadingSheet: [],
}

const LoadingSheetReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case LOADING_SHEET_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                goBtnLoadingSheet: action.payload,
            }

        default:
            return state
    }
}

export default LoadingSheetReducer