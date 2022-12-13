import {
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
    PostData: { Status: false },
    TermsAndConditionsList: [],
    TermsAndConditionsupdateMessage: { Status: false },
    TermsAndConditionseditData: { Status: false },
    TermsAndConditionsdeleteMessage: { Status: false }

}

const TermsAndConditionsReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            }

        case GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                TermsAndConditionsList: action.payload,
            }

        case EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                TermsAndConditionseditData: action.payload,
            }

        case UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                TermsAndConditionsupdateMessage: action.payload,
            }
        case DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                TermsAndConditionsdeleteMessage: action.payload,
            }
        default:
            return state
    }
}

export default TermsAndConditionsReducer        