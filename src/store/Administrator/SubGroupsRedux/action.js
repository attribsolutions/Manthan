import {
  DELETE_SUBGROUP_LIST_ID,
  DELETE_SUBGROUP_LIST_ID_SUCCESS,
  EDIT_SUBGROUPMASTER_ID,
  EDIT_SUBGROUPMASTER_ID_SUCCESS,
  GET_SUBGROUP_LIST,
  GET_SUBGROUP_LIST_SUCCESS,
  SAVE_SUBGROUPLIST,
  SAVE_SUBGROUPLIST_SUCCESS,
  SUBGROUP_API_ERROR_ACTION,
  UPDATE_SUBGROUPMASTER_ID,
  UPDATE_SUBGROUPMASTER_ID_SUCCESS
} from "./actionType";


export const getSubGroupList = () => ({// get List Action
  type: GET_SUBGROUP_LIST,
});

export const getSubGroupListSuccess = (pages) => ({// get List success
  type: GET_SUBGROUP_LIST_SUCCESS,
  payload: pages,
});



export const saveSubGroupList = (config = {}) => ({// save Action
  type: SAVE_SUBGROUPLIST,
  config,
});

export const saveSubGroupSuccess = (resp) => ({// Save  success
  type: SAVE_SUBGROUPLIST_SUCCESS,
  payload: resp,
});

export const editSubGroupID = (config = {}) => ({ // Edit Action 
  type: EDIT_SUBGROUPMASTER_ID,
  config,
});

export const editSubGroupIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_SUBGROUPMASTER_ID_SUCCESS,
  payload: editData,
});

export const updateSubGroupID = (config = {}) => ({// update  Action
  type: UPDATE_SUBGROUPMASTER_ID,
  config,
});

export const updateSubgroupIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_SUBGROUPMASTER_ID_SUCCESS,
  payload: resp,
})

export const delete_SubGroupList_ID = (config = {}) => ({// Delete  Action
  type: DELETE_SUBGROUP_LIST_ID,
  config,
});

export const deleteSubGrouplistSuccess = (resp) => ({// Delete Success
  type: DELETE_SUBGROUP_LIST_ID_SUCCESS,
  payload: resp
});

export const SubGroupApiErrorAction = () => ({
  type: SUBGROUP_API_ERROR_ACTION,
});





