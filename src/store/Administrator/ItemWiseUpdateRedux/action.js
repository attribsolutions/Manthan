import {
  ITEM_WISE_BULK_UPDATE_GO_BUTTON_ACTION,
  ITEM_WISE_BULK_UPDATE_API_ERROR_ACTION,
  ITEM_WISE_BULK_UPDATE_GO_BUTTON_SUCCESS,
  ITEM_WISE_BULK_UPDATE_SAVE_ACTION,
  ITEM_WISE_BULK_UPDATE_SAVE_SUCCESS
} from "./actionType";

export const ItemWiseUpdateGoButton_Action = (jsonBody) => ({
  type: ITEM_WISE_BULK_UPDATE_GO_BUTTON_ACTION,
  jsonBody,
});

export const ItemWiseUpdateGoButton_Success = (resp) => ({
  type: ITEM_WISE_BULK_UPDATE_GO_BUTTON_SUCCESS,
  payload: resp,
})

export const ItemWiseUpdate_Save_Action = (jsonBody) => ({
  type: ITEM_WISE_BULK_UPDATE_SAVE_ACTION,
  jsonBody,
});

export const ItemWiseUpdate_Save_Success = (resp) => ({
  type: ITEM_WISE_BULK_UPDATE_SAVE_SUCCESS,
  payload: resp,
})

export const ItemWiseUpdateApiErrorAction = () => ({
  type: ITEM_WISE_BULK_UPDATE_API_ERROR_ACTION,
})
