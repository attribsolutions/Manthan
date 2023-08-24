import {
    GO_BUTTON_FOR_GENERIC_SALE_SUCCESS,

} from "./actionType"

const INIT_STATE = {
    genericSaleGobtn: [],
}

const GenericSaleReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GO_BUTTON_FOR_GENERIC_SALE_SUCCESS:
            return {
                ...state,
                genericSaleGobtn: action.payload,
            }

        default:
            return state
    }
}

export default GenericSaleReportReducer  