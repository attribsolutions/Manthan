import { POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS } from "./actionType"

const INIT_STATE = {
    GoButton: [],
}

const MaterialIssueReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // GO Button 
        case POST_GO_BUTTON_FOR_MATERIAL_ISSUE_MASTER_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
            }

        default:
            return state
    }
}

export default MaterialIssueReducer