import {
    ITEM_CONSUMPTION_REPORT_API_ERROR_ACTION,
    ITEM_CONSUMPTION_REPORT_GO_BUTTON_API,
    ITEM_CONSUMPTION_REPORT_GO_BUTTON_API_SUCCESS,

} from "./actionType";

const INIT_STATE = {
    ItemConsumption: { Status: false },
    listBtnLoading: false,
}

const ItemConsumptionReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case ITEM_CONSUMPTION_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: action.config.goBtnMode
            }

        case ITEM_CONSUMPTION_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                ItemConsumption: action.payload,
                listBtnLoading: false
            }


        case ITEM_CONSUMPTION_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default ItemConsumptionReportReducer  