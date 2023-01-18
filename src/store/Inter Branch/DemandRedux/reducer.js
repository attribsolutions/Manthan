
import {
    POST_GO_BUTTON_FOR_DEMAND_SUCCESS,
    POST_DEMAND_SUCCESS
} from "./actionType"

const INIT_STATE = {
    GoButton: [],
    postMsg: { Status: false },
    updateMsg:{Status: false}
}

const DemandReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // GO Button 
        case POST_GO_BUTTON_FOR_DEMAND_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
            }

        // Post Method 
        case POST_DEMAND_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

        default:
            return state
    }

}

export default DemandReducer