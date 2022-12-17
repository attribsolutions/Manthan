import {
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS


} from "./actionTypes";

//=============================POST===================================

export const postTermAndCondition = (data) => ({
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    data,

});
export const postTermAndConditionSuccess = (data) => ({
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    payload: data,
});

//=============================ALL GET===================================

export const getTermAndCondition = () => ({
    type: GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
});

export const getTermAndCondition_Success = (data) => ({
    type: GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload: data,
});


//=============================SingalGET===================================

export const EditTermsAndCondtions = (id,pageMode) => ({
    type: EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    id,pageMode
});

export const EditTermsAndCondtions_Success = (editData) => ({
    type: EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload: editData,
});

//=============================Put===================================
export const UpdateTermsAndCondtions = (data) => ({
    type: UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    payload: data,
});

export const UpdateTermsAndCondtions_Success = (data) => ({
    type: UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload: data,
});

//=============================Delete===================================
export const DeleteTermsAndCondtions = (id) => ({
    type: DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    id,
});

export const DeleteTermsAndCondtions_Success = (deleteMessage) => ({
    type: DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload: deleteMessage,
});