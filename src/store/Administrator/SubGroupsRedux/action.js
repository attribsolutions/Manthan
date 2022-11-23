
import { DELETE_SUBGROUP_LIST_ID, 
    DELETE_SUBGROUP_LIST_ID_SUCCESS,
    EDIT_SUBGROUPMASTER_ID, 
    EDIT_SUBGROUPMASTER_ID_SUCCESS, 
    GET_SUBGROUP_LIST,
    GET_SUBGROUP_LIST_SUCCESS, 
    POST_SUBGROUPLIST,
    POST_SUBGROUPLIST_SUCCESS, 
    UPDATE_SUBGROUPMASTER_ID,
    UPDATE_SUBGROUPMASTER_ID_SUCCESS} from "./actionType";
    
  
  
  /// get 
  export const getSubGroupList = () => ({
    type: GET_SUBGROUP_LIST,
  });
  export const getSubGroupListSuccess = (pages) => ({
    type: GET_SUBGROUP_LIST_SUCCESS,
    payload: pages,
  });
  
  // Post 
  export const postSubGroupSuccess = (data) => ({
    type: POST_SUBGROUPLIST_SUCCESS,
    payload: data,
  });
  export const postSubGroupList = (data) => ({
    type: POST_SUBGROUPLIST,
    data,
  });
  
  // Edit
  export const editSubGroupID = (id,pageMode) => ({
    type: EDIT_SUBGROUPMASTER_ID,
    id,pageMode
  });
  export const editSubGroupIDSuccess = (editData) => ({
    type: EDIT_SUBGROUPMASTER_ID_SUCCESS,
    payload: editData,
  })
  // Delete
  export const delete_SubGroupList_ID = (id) => ({
    type:DELETE_SUBGROUP_LIST_ID,
    id ,
  });
  
  export const deleteSubGrouplistSuccess = (deleteMessage) => ({
    type: DELETE_SUBGROUP_LIST_ID_SUCCESS,
    payload:deleteMessage
  });
  
  // update api
  export const updateSubGroupID = (updateData, ID) => ({
    type: UPDATE_SUBGROUPMASTER_ID,
    updateData, ID,
  })
  export const updateSubgroupIDSuccess =(updateMessage) => ({
    type: UPDATE_SUBGROUPMASTER_ID_SUCCESS,
    payload: updateMessage,
  })
  
  
    
    