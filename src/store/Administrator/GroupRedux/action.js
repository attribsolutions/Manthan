
import {
  DELETE_GROUP_LIST_ID,
  DELETE_GROUP_LIST_ID_SUCCESS,
  EDIT_GROUPMASTER_ID,
  EDIT_GROUPMASTER_ID_SUCCESS,
  GET_GROUP_LIST,
  GET_GROUP_LIST_SUCCESS,
  POST_GROUPLIST,
  POST_GROUPLIST_SUCCESS,
  UPDATE_GROUPMASTER_ID,
  UPDATE_GROUPMASTER_ID_SUCCESS
} from "./actionType";



/// get 
export const getGroupList = () => ({
  type: GET_GROUP_LIST,
});

export const getGroupListSuccess = (pages) => ({
  type: GET_GROUP_LIST_SUCCESS,
  payload: pages,
});


export const postGroupSuccess = (data) => ({// Post 
  type: POST_GROUPLIST_SUCCESS,
  payload: data,
});

export const postGroupList = (jsonbody, event) => ({
  type: POST_GROUPLIST,
  jsonbody, event
});


export const editGroupID = (id, pageMode,event) => ({// Edit 
  type: EDIT_GROUPMASTER_ID,
  id, pageMode,event
});

export const editGroupIDSuccess = (editData) => ({
  type: EDIT_GROUPMASTER_ID_SUCCESS,
  payload: editData,
});


export const delete_GroupList_ID = (id,event) => ({// Delete api
  type: DELETE_GROUP_LIST_ID,
  id,event,
});

export const deleteGrouplistSuccess = (deleteMessage) => ({
  type: DELETE_GROUP_LIST_ID_SUCCESS,
  payload: deleteMessage
});


export const updateGroupID = (updateData, ID,event) => ({// update api
  type: UPDATE_GROUPMASTER_ID,
  updateData, ID,event
});

export const updategroupIDSuccess = (updateMessage) => ({
  type: UPDATE_GROUPMASTER_ID_SUCCESS,
  payload: updateMessage,
})



