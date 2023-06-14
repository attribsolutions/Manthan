import {
  DELETE_GROUP_LIST_ID,
  DELETE_GROUP_LIST_ID_SUCCESS,
  EDIT_GROUPMASTER_ID,
  EDIT_GROUPMASTER_ID_SUCCESS,
  GET_GROUP_LIST,
  GET_GROUP_LIST_SUCCESS,
  GROUP_API_ERROR_ACTION,
  SAVE_GROUP_MASTER,
  SAVE_GROUP_MASTER_SUCCESS,
  UPDATE_GROUPMASTER_ID,
  UPDATE_GROUPMASTER_ID_SUCCESS
} from "./actionType";


export const getGroupList = () => ({// get List Action
  type: GET_GROUP_LIST,
});

export const getGroupListSuccess = (pages) => ({// get List success
  type: GET_GROUP_LIST_SUCCESS,
  payload: pages,
});

export const saveGroupMaster = (config = {}) => ({// save Action
  type: SAVE_GROUP_MASTER,
  config,
});

export const saveGroupMaster_Success = (resp) => ({// Save  success
  type: SAVE_GROUP_MASTER_SUCCESS,
  payload: resp,
});

export const editGroupID = (config = {}) => ({ // Edit Action 
  type: EDIT_GROUPMASTER_ID,
  config,
});

export const editGroupIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_GROUPMASTER_ID_SUCCESS,
  payload: editData,
});

export const updateGroupID = (config = {}) => ({// update  Action
  type: UPDATE_GROUPMASTER_ID,
  config,
});

export const updateGroupIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_GROUPMASTER_ID_SUCCESS,
  payload: resp,
})

export const delete_GroupList_ID = (config = {}) => ({// Delete  Action
  type: DELETE_GROUP_LIST_ID,
  config,
});

export const deleteGrouplistSuccess = (resp) => ({// Delete Success
  type: DELETE_GROUP_LIST_ID_SUCCESS,
  payload: resp
});


export const GroupApiErrorAction = () => ({
  type: GROUP_API_ERROR_ACTION,
});




