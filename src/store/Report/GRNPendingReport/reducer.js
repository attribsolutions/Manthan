import {
    GRN_PENDING_ACTION,
    GRN_PENDING_ACTION_SUCCESS,
    GRN_PENDING_ERROR_ACTION,

} from "./actionType"

const INIT_STATE = {
    grnpendingData: [],
}

const grnpendingReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GRN_PENDING_ACTION:
            return {
                ...state,
            }

        case GRN_PENDING_ACTION_SUCCESS:
            return {
                ...state,
                grnpendingData: action.payload, 
            }


        case GRN_PENDING_ERROR_ACTION:
            return {
                ...state,
            };

        default:
            return state
    }
}

export default grnpendingReducer  