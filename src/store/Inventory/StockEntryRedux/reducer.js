import {
    CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION,
    CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION_SUCCESS,
    CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION,
    CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION_SUCCESS,
    GET_STOCK_COUNT_ACTION,
    GET_STOCK_COUNT_ACTION_SUCCESS,
    SAVE_STOCK_ENTRY_ACTION,
    SAVE_STOCK_ENTRY_SUCCESS,
    STOCK_ENTRY_API_ERROR_ACTION
} from "./actionType";

const INIT_STATE = {
    postMsg: { Status: false },
    loading: false,
    saveBtnloading: false,
    StockCount: {},
    StockEnteryForFirstYear: { status: false },
    StockEnteryForBackdated: { status: false }

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

        case GET_STOCK_COUNT_ACTION:
            return {
                ...state,
                StockCountloading: true
            }
        case GET_STOCK_COUNT_ACTION_SUCCESS:
            return {
                ...state,
                StockCount: action.payload,
                StockCountloading: false
            }

        case CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION:
            return {
                ...state,
            }
        case CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION_SUCCESS:
            return {
                ...state,
                StockEnteryForFirstYear: action.payload,
            }

        case CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION:
            return {
                ...state,
            }
        case CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION_SUCCESS:
            return {
                ...state,
                StockEnteryForBackdated: action.payload,

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