import { GET_BATCH_CODE_BY_ITEM_ID_ACTION, GET_BATCH_CODE_BY_ITEM_ID_SUCCESS, STOCK_ADJUSTMENT_API_ERROR_ACTION } from "./actionType";

export const getBatchCode_By_ItemID_Action = ({ itemId, partyId }) => ({
    type: GET_BATCH_CODE_BY_ITEM_ID_ACTION,
    itemId, partyId,
});
export const getBatchCode_By_ItemID_Action_Success = (resp) => ({
    type: GET_BATCH_CODE_BY_ITEM_ID_SUCCESS,
    payload: resp
});

export const StockAdjustmentApiErrorAction = () => ({
    type: STOCK_ADJUSTMENT_API_ERROR_ACTION,
})