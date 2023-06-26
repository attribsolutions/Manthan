import {
    SAVE_STOCK_ENTRY_ACTION,
    SAVE_STOCK_ENTRY_SUCCESS,
    STOCK_ENTRY_API_ERROR_ACTION
} from "./actionType";

export const saveStockEntryAction = (config = {}) => ({
    type: SAVE_STOCK_ENTRY_ACTION,
    config,
});
export const saveStockEntrySuccess = (resp) => ({
    type: SAVE_STOCK_ENTRY_SUCCESS,
    payload: resp
});

export const StockEntryApiErrorAction = () => ({
    type: STOCK_ENTRY_API_ERROR_ACTION,
})