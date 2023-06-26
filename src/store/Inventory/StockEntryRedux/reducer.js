import {
    SAVE_STOCK_ENTRY_ACTION,
    SAVE_STOCK_ENTRY_SUCCESS,
    STOCK_ENTRY_API_ERROR_ACTION
} from "./actionType";

const INIT_STATE = {
    postMsg: { Status: false },
    loading: false,
    saveBtnloading: false

}

const StockEntryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SAVE_STOCK_ENTRY_ACTION:
            return {
                ...state,
                saveBtnloading: true

            }
        case SAVE_STOCK_ENTRY_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false

            }

        case STOCK_ENTRY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default StockEntryReducer;