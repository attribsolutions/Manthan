
import { DELETE_GROUP_LIST_ID, 
  DELETE_GROUP_LIST_ID_SUCCESS,
  EDIT_GROUPMASTER_ID, 
  EDIT_GROUPMASTER_ID_SUCCESS, 
  GET_GROUP_LIST,
  GET_GROUP_LIST_SUCCESS, 
  POST_GROUPLIST,
  POST_GROUPLIST_SUCCESS, 
  UPDATE_GROUPMASTER_ID,
  UPDATE_GROUPMASTER_ID_SUCCESS} from "./actionType";
  


/// get 
export const getGroupList = () => ({
  type: GET_GROUP_LIST,
});
export const getGroupListSuccess = (pages) => ({
  type: GET_GROUP_LIST_SUCCESS,
  payload: pages,
});

// Post 
export const PostMethod_GroupList_Success = (data) => ({
  type: POST_GROUPLIST_SUCCESS,
  payload: data,
});
export const postGroupList = (data) => ({
  type: POST_GROUPLIST,
  data,
});

// Edit
export const editGroupID = (id,pageMode) => ({
  type: EDIT_GROUPMASTER_ID,
  id,pageMode
});
export const editGroupIDSuccess = (editData) => ({
  type: EDIT_GROUPMASTER_ID_SUCCESS,
  payload: editData,
})
// Delete
export const delete_GroupList_ID = (id) => ({
  type:DELETE_GROUP_LIST_ID,
  id ,
});

export const deleteGrouplistSuccess = (deleteMessage) => ({
  type: DELETE_GROUP_LIST_ID_SUCCESS,
  payload:deleteMessage
});

// update api
export const updateGroupID = (updateData, ID) => ({
  type: UPDATE_GROUPMASTER_ID,
  updateData, ID,
})
export const updategroupIDSuccess =(updateMessage) => ({
  type: UPDATE_GROUPMASTER_ID_SUCCESS,
  payload: updateMessage,
})


  
  