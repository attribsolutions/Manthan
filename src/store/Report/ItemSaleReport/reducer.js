import { ITEM_SALE_GO_BUTTON_API, ITEM_SALE_GO_BUTTON_API_SUCCESS, ITEM_SALE_REPORT_API_ERROR_ACTION } from "./actionType";

const INIT_STATE = {
    ItemSaleReportGobtn: [],
    goBtnLoading: false,
}

const ItemSaleReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case ITEM_SALE_GO_BUTTON_API:
            return {
                ...state,
                goBtnLoading: action.config.btnId
            }

        case ITEM_SALE_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                ItemSaleReportGobtn: action.payload,
                goBtnLoading: false
            }

        case ITEM_SALE_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                goBtnLoading: false,
            };

        default:
            return state
    }
}

export default ItemSaleReportReducer  