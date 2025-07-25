import {
    PARTY_WISE_ITEM_SALE_REPORT_API_ERROR_ACTION,
    PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API,
    PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API_SUCCESS,

} from "./actionType";

const INIT_STATE = {
    PartyWiseItemSale: { Status: false },
    listBtnLoading: false,
}

const PartyWiseItemSaleReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: action.config.goBtnMode
            }

        case PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                PartyWiseItemSale: action.payload,
                listBtnLoading: false
            }


        case PARTY_WISE_ITEM_SALE_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default PartyWiseItemSaleReportReducer  