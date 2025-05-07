
import { CSS_ITEM_SALE_GO_BUTTON_ACTION, CSS_ITEM_SALE_GO_BUTTON_SUCCESS, CSS_ITEM_SALE_REPORT_API_ERROR_ACTION } from "./actionType";

const INIT_STATE = {
    Css_Item_Sale_ReportGobtn: [],
    goBtnLoding: false,
}

const Css_Item_sale_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case CSS_ITEM_SALE_GO_BUTTON_ACTION:
            return {
                ...state,
                goBtnLoding: action.config.btnId
            }

        case CSS_ITEM_SALE_GO_BUTTON_SUCCESS:
            return {
                ...state,
                Css_Item_Sale_ReportGobtn: action.payload,
                goBtnLoding: false
            }

        case CSS_ITEM_SALE_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                goBtnLoding: false,
            };
        default:
            return state


    }
}

export default Css_Item_sale_Reducer