import {
    CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION,
    CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION_SUCCESS,
    CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION,
    CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION_SUCCESS,
    DELETE_STOCK_ENTRY,
    DELETE_STOCK_ENTRY_SUCCESS,
    GET_ITEM_DROPDOWM_ACTION,
    GET_ITEM_DROPDOWM_ACTION_SUCCESS,
    GET_LAST_STOCK_ENTRY_SUCCESS,
    GET_STOCK_COUNT_ACTION,
    GET_STOCK_COUNT_ACTION_SUCCESS,
    GET_STOCK_ENTRY_LIST_ACTION,
    GET_STOCK_ENTRY_LIST_SUCCESS,
    GET_STOCK_ENTRY_VIEW_ACTION,
    GET_STOCK_ENTRY_VIEW_SUCCESS,
    SAVE_STOCK_ENTRY_ACTION,
    SAVE_STOCK_ENTRY_SUCCESS,
    STOCK_ENTRY_API_ERROR_ACTION
} from "./actionType";

const INIT_STATE = {
    postMsg: { Status: false },
    StockCount: {},
    StockEnteryForFirstYear: { status: false },
    StockEnteryForBackdated: { status: false },
    ItemDropDown: [],
    StockEntryList: [],
    StockEntryItemViewList: [],
    lastStockEntryDate: "",
    saveBtnloading: false,
    loading: false,
    deleteMsg: { Status: false },
    ItemDropDownloading: false,
    listGoBtnloading: false

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

        case GET_LAST_STOCK_ENTRY_SUCCESS:
            return {
                ...state,
                lastStockEntryDate: action.payload,

            }

        case GET_ITEM_DROPDOWM_ACTION:
            return {
                ...state,
                ItemDropDownloading: true
            }
        case GET_ITEM_DROPDOWM_ACTION_SUCCESS:
            return {
                ...state,
                ItemDropDown: action.payload,
                ItemDropDownloading: false
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

        case GET_STOCK_ENTRY_LIST_ACTION:
            return {
                ...state,
                listGoBtnloading: true
            }
        case GET_STOCK_ENTRY_LIST_SUCCESS:
            return {
                ...state,
                StockEntryList: action.payload,
                listGoBtnloading: false
            }


        case DELETE_STOCK_ENTRY:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }
        case DELETE_STOCK_ENTRY_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
                listBtnLoading: false,
            }

        // view button functionality
        case GET_STOCK_ENTRY_VIEW_ACTION:

            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        case GET_STOCK_ENTRY_VIEW_SUCCESS:
            return {
                ...state,
                StockEntryItemViewList: action.payload,
                listBtnLoading: false
            }

        case STOCK_ENTRY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                listBtnLoading: false,
                listGoBtnloading: false,
                loading: false,
            };

        default:
            return state
    }
}

export default StockEntryReducer;