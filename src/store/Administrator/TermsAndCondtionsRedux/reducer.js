import { POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
            // DELETE_TERMSANDCONDITIONS_ID_ERROR,
            // DELETE_TERMSANDCONDITIONS_ID_SUCCESS,
            // EDIT_TERMSANDCONDITIONS_ID_SUCCESS,
            // FETCH_TERMSANDCONDITIONS_LIST_ERROR,
            // FETCH_TERMSANDCONDITIONS_LIST_SUCCESS,
            // POST_TERMSANDCONDITIONS_SUBMIT_ERROR,
            // UPDATE_TERMSANDCONDITIONS_ID_SUCCESS,
         } from "./actionTypes";

const INIT_STATE = {
        PostData: { Status: false },
        // TermsAndCondtionsSubmitError: {},
        // TermsAndCondtionsList: [],
        // TermsAndCondtionsListError: {},
        // deleteTermsAndCondtionsIDSuccess: { Status:false },
        // deleteTermsAndCondtionsIDError: {},
        // TermsAndCondtionseditData: { Status: false },
        // TermsAndCondtionsupdateMessage: { Status: false }
        
      }       

const  TermsAndCondtionsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS:
        return {
            ...state,
            PostData: action.payload,
        }
        // case POST_TERMSANDCONDITIONS_SUBMIT_ERROR:
        // return {
        //     ...state,
        //     TermsAndCondtionsSubmitError: action.payload,
        // }
        // case FETCH_TERMSANDCONDITIONS_LIST_SUCCESS:
        // return {
        //     ...state,
        //     TermsAndCondtionsList: action.payload,
        // }
        // case FETCH_TERMSANDCONDITIONS_LIST_ERROR:
        // return {
        //     ...state,
        //     TermsAndCondtionsListError: action.payload,
        // }
        // case DELETE_TERMSANDCONDITIONS_ID_SUCCESS:
        // return {
        //     ...state,
        //     deleteTermsAndCondtionsIDSuccess: action.payload,
        // }
        // case DELETE_TERMSANDCONDITIONS_ID_ERROR:
        // return {
        //     ...state,
        //     deleteTermsAndCondtionsIDError: action.payload,
        // }
        // case EDIT_TERMSANDCONDITIONS_ID_SUCCESS:
        // return {
        //     ...state,
        //     TermsAndCondtionseditData: action.payload,
        // }
        // case UPDATE_TERMSANDCONDITIONS_ID_SUCCESS:
        // return {
        //     ...state,
        //     TermsAndCondtionsupdateMessage: action.payload,
        // }

        default:
        return state
    }
}

export default TermsAndCondtionsReducer        