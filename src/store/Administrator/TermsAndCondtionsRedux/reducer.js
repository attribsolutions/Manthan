import {
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
    PostData: { Status: false },
    // TermsAndCondtionsSubmitError: {},
    TermsAndCondtionsList: [],
    // TermsAndCondtionsListError: {},
    // deleteTermsAndCondtionsIDSuccess: { Status:false },
    // deleteTermsAndCondtionsIDError: {},
    // TermsAndCondtionseditData: { Status: false },
    // TermsAndCondtionsupdateMessage: { Status: false }

}

const TermsAndCondtionsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS:
            return {
                ...state,
                PostData: action.payload,
            }

        case GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS:
            return {
                ...state,
                TermsAndCondtionsList: action.payload,
            }

        default:
            return state
    }
}

export default TermsAndCondtionsReducer        