import {
    ORDER_ITEM_SUPPLIER_API_ERROR_ACTION,
    ORDER_ITEM_SUPPLIER_GO_BUTTON_ACTION,
    ORDER_ITEM_SUPPLIER_GO_BUTTON_SUCCESS,
} from "./actionType";

const INIT_STATE = {
    ItemSupplierReportGobtn: [],
    goBtnLoading: false,
}

const OrderItemSupplier_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case ORDER_ITEM_SUPPLIER_GO_BUTTON_ACTION:
            return {
                ...state,
                goBtnLoading: true
            }

        case ORDER_ITEM_SUPPLIER_GO_BUTTON_SUCCESS:
            return {
                ...state,
                ItemSupplierReportGobtn: action.payload,
                goBtnLoading: false
            }

        case ORDER_ITEM_SUPPLIER_API_ERROR_ACTION:
            return {
                ...state,
                goBtnLoading: false,
            };

        default:
            return state
    }
}

export default OrderItemSupplier_Reducer 
