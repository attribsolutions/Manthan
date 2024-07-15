import {
    FRENCHISES_ITEM_SALE_REPORT_ACTION,
    FRENCHISES_ITEM_SALE_REPORT_ACTION_SUCCESS,
    FRENCHISES_ITEM_SALE_REPORT_ERROR_ACTION,

} from "./actionType"

const INIT_STATE = {
    FrenchiesesItemSaleData: [],
    listBtnLoading: false
}

const FrenchiesItemSaleReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case FRENCHISES_ITEM_SALE_REPORT_ACTION:
            return {
                ...state,
                listBtnLoading: true
            }

        case FRENCHISES_ITEM_SALE_REPORT_ACTION_SUCCESS:
            return {
                ...state,
                FrenchiesesItemSaleData: action.payload,
                listBtnLoading: false
            }


        case FRENCHISES_ITEM_SALE_REPORT_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default FrenchiesItemSaleReportReducer; 