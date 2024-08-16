import {
    ORDER_ITEM_SUPPLIER_API_ERROR_ACTION,
    ORDER_ITEM_SUPPLIER_GO_BUTTON_ACTION,
    ORDER_ITEM_SUPPLIER_GO_BUTTON_SUCCESS
} from "./actionType";

export const order_Item_Supplier_goBtn_Action = (config = {}) => ({
    type: ORDER_ITEM_SUPPLIER_GO_BUTTON_ACTION,
    config
});

export const order_Item_Supplier_goBtn_Success = (resp) => ({
    type: ORDER_ITEM_SUPPLIER_GO_BUTTON_SUCCESS,
    payload: resp,
});

// Order Item Supplier Report API Error Action
export const Order_Item_Supplier_Api_ErrorAction = () => ({
    type: ORDER_ITEM_SUPPLIER_API_ERROR_ACTION,
})