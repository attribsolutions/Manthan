import {
    CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION,
    CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION_SUCCESS,
    CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION,
    CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION_SUCCESS,
    GET_ITEM_DROPDOWM_ACTION,
    GET_ITEM_DROPDOWM_ACTION_SUCCESS,
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

export const saveStockEntryAction = (config = {}) => ({
    type: SAVE_STOCK_ENTRY_ACTION,
    config,
});
export const saveStockEntrySuccess = (resp) => ({
    type: SAVE_STOCK_ENTRY_SUCCESS,
    payload: resp
});


export const Get_Items_Drop_Down = (config = {}) => ({
    type: GET_ITEM_DROPDOWM_ACTION,
    config,
});
export const Get_Items_Drop_Down_Success = (resp) => ({
    type: GET_ITEM_DROPDOWM_ACTION_SUCCESS,
    payload: resp
});

export const GetStockCount = (config = {}) => ({
    type: GET_STOCK_COUNT_ACTION,
    config,
});
export const GetStockCountSuccess = (resp) => ({
    type: GET_STOCK_COUNT_ACTION_SUCCESS,
    payload: resp
});

export const CheckStockEntryForFirstTransaction = (config = {}) => ({
    type: CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION,
    config,
});
export const CheckStockEntryForFirstTransactionSuccess = (resp) => ({
    type: CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION_SUCCESS,
    payload: resp
});

export const CheckStockEntryforBackDatedTransaction = (config = {}) => ({
    type: CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION,
    config,
});
export const CheckStockEntryforBackDatedTransactionSuccess = (resp) => ({
    type: CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION_SUCCESS,
    payload: resp
});


export const GetStockEntryList_Action = (config = {}) => ({
    type: GET_STOCK_ENTRY_LIST_ACTION,
    config,
});
export const GetStockEntryList_Success = (resp) => ({
    type: GET_STOCK_ENTRY_LIST_SUCCESS,
    payload: resp
});

export const GetStockEntryView_Action = (config = {}) => ({
    type: GET_STOCK_ENTRY_VIEW_ACTION,
    config,
});
export const GetStockEntryView_Success = (resp) => ({
    type: GET_STOCK_ENTRY_VIEW_SUCCESS,
    payload: resp
});

export const StockEntryApiErrorAction = () => ({
    type: STOCK_ENTRY_API_ERROR_ACTION,
})




