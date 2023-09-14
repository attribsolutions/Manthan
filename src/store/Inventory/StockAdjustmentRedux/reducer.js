import {
    GET_BATCH_CODE_BY_ITEM_ID_ACTION,
    GET_BATCH_CODE_BY_ITEM_ID_SUCCESS,
    STOCK_ADJUSTMENT_API_ERROR_ACTION
} from "./actionType";

const INIT_STATE = {
    batchCode_By_ItemID:[],
    batchCodeDropLoading: false,
}

const StockAdjustmentReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GET_BATCH_CODE_BY_ITEM_ID_ACTION:
            return {
                ...state,
                batchCodeDropLoading: true

            }
        case GET_BATCH_CODE_BY_ITEM_ID_SUCCESS:
            return {
                ...state,
                batchCode_By_ItemID: action.payload,
                batchCodeDropLoading: false

            }

        case STOCK_ADJUSTMENT_API_ERROR_ACTION:
            return {
                ...state,
                batchCodeDropLoading: false,
            };

        default:
            return state
    }
}

export default StockAdjustmentReducer;