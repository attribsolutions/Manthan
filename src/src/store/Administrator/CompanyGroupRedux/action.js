import {
    POST_METHOD_FOR_COMPANYGROUP_MASTER,
    POST_METHOD_FOR_COMPANYGROUP_MASTER_SUCCESS,
    GET_METHOD_FOR_COMPANYGROUP_LIST,
    GET_METHOD_FOR_COMPANYGROUP_LIST_SUCCESS,
    DELETE_COMPANYGROUP_TYPE_ID,
   DELETE_COMPANYGROUP_TYPE_ID_SUCCESS,
  EDIT_COMPANYGROUP_TYPE_ID,
  EDIT_COMPANYGROUP_TYPE_ID_SUCCESS,
  UPDATE_COMPANYGROUP_TYPE_ID,
  UPDATE_COMPANYGROUP_TYPE_ID_SUCCESS

} from "./actionType";

export const PostMethodForCompanyGroupMaster= (data) => ({
   type: POST_METHOD_FOR_COMPANYGROUP_MASTER,
   data,
 });

 export const PostMethod_ForCompanyGroupMasterSuccess = (data) => ({
   type: POST_METHOD_FOR_COMPANYGROUP_MASTER_SUCCESS,
   payload: data,
 });
 
 // get method CompanyGroupList
 export const getMethodForCompanyGroupList = () => ({
   type: GET_METHOD_FOR_COMPANYGROUP_LIST,
   
 });
 
 export const getMethod_ForCompanyGroupListSuccess = (data) => ({
   type: GET_METHOD_FOR_COMPANYGROUP_LIST_SUCCESS,
   payload: data,
 });
   

 ////delete api
export const delete_CompanyGroupType_ID = (id) => ({
 type: DELETE_COMPANYGROUP_TYPE_ID,
 id,

});
export const deleteCompanyGroupTypeIDSuccess = (deleteMessage) => ({
 type: DELETE_COMPANYGROUP_TYPE_ID_SUCCESS,
 payload: deleteMessage
});

// edit api
export const editCompanyGroupTypeId = (id,pageMode) => ({
 type: EDIT_COMPANYGROUP_TYPE_ID,
 id,pageMode
})
export const editCompanyGroupTypeSuccess = (editData) => ({
 type: EDIT_COMPANYGROUP_TYPE_ID_SUCCESS,
 
 payload: editData,
})

// update api
export const updateCompanyGroupTypeID = (updateData, ID) => ({
 type: UPDATE_COMPANYGROUP_TYPE_ID,
 updateData, ID,
})
export const updateCompanyGroupTypeIDSuccess = (updateMessage) => ({
 type: UPDATE_COMPANYGROUP_TYPE_ID_SUCCESS,
 payload: updateMessage,
})