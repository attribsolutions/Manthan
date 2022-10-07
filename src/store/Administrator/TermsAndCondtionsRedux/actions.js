import {
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS


} from "./actionTypes";


export const updateCategoryTypeID = (data) => ({
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    data,

});


export const PostMethod_ForTermsAndCondtionsMaster = (data) => ({
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    data,

});

export const PostMethod_ForTermsAndCondtionsMasterAPISuccess = (data) => ({
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    payload: data,
});

// get method TermsAndCondtionsList
 export const GetTermsAndCondtionsList = () => ({
    type: GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    
  });

export const GetTermsAndCondtionsListSuccess = (data) => ({
    type: GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload: data,
});