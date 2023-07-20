import { RETAILER_DATA_API_ERROR_ACTION, POST_RETAILER_DATA_API, POST_RETAILER_DATA_API_SUCCESS } from "./actionType";

const INIT_STATE = {
    RetailerGobtn: [],
    listBtnLoading: false
}

const RetailerDataReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_RETAILER_DATA_API:
            return {
                ...state,
                listBtnLoading: true
            }

        case POST_RETAILER_DATA_API_SUCCESS:
            return {
                ...state,
                RetailerGobtn: action.payload,
                listBtnLoading: false
            }

        case RETAILER_DATA_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };


        default:
            return state
    }
}

export default RetailerDataReducer  