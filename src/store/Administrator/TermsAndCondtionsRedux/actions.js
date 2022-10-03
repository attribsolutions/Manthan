import {
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    
    
    } from "./actionTypes";


export const PostMethod_ForTermsAndCondtionsMaster = (data) => ({
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    data,
    
    });
    
export const PostMethod_ForTermsAndCondtionsMasterAPISuccess = (data) => ({
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    payload: data,
    });
 
export const updateCategoryTypeID = (data) => ({
        type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
        data,
        });    