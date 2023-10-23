import { DELETE_SUB_CLUSTER_ID, DELETE_SUB_CLUSTER_ID_SUCCESS, EDIT_SUB_CLUSTER_ID, EDIT_SUB_CLUSTER_ID_SUCCESS, GET_SUB_CLUSTER_LIST, GET_SUB_CLUSTER_LIST_SUCCESS, SAVE_SUB_CLUSTER_MASTER, SAVE_SUB_CLUSTER_MASTER_SUCCESS, SUB_CLUSTER_API_ERROR_ACTION, UPDATE_SUB_CLUSTER_ID, UPDATE_SUB_CLUSTER_ID_SUCCESS } from "./actionType";

 
  export const getSub_Clusterlist = () => ({// get List Action
    type: GET_SUB_CLUSTER_LIST,
  });
  
  export const getSub_ClusterlistSuccess = (pages) => ({// get List success
    type: GET_SUB_CLUSTER_LIST_SUCCESS,
    payload: pages,
  });
  
  export const saveSub_ClusterMaster = (config = {}) => ({// save Action
    type: SAVE_SUB_CLUSTER_MASTER,
    config,
  });
  
  export const saveSub_ClusterMaster_Success = (resp) => ({// Save  success
    type: SAVE_SUB_CLUSTER_MASTER_SUCCESS,
    payload: resp,
  });
  
  export const editSub_ClusterID = (config = {}) => ({ // Edit Action 
    type: EDIT_SUB_CLUSTER_ID,
    config,
  });
  
  export const editSub_ClusterIDSuccess = (editData) => ({// Edit  Success
    type: EDIT_SUB_CLUSTER_ID_SUCCESS,
    payload: editData,
  });
  
  export const updateSub_ClusterID = (config = {}) => ({// update  Action
    type: UPDATE_SUB_CLUSTER_ID,
    config,
  });
  
  export const updateSub_ClusterIDSuccess = (resp) => ({ //Update Success
    type: UPDATE_SUB_CLUSTER_ID_SUCCESS,
    payload: resp,
  })
  
  export const delete_Sub_Cluster_ID = (config = {}) => ({// Delete  Action
    type: DELETE_SUB_CLUSTER_ID,
    config,
  });
  
  export const deleteSub_ClusterIDSuccess = (resp) => ({// Delete Success
    type: DELETE_SUB_CLUSTER_ID_SUCCESS,
    payload: resp
  });
  
  
  export const Sub_ClusterApiErrorAction = () => ({
    type: SUB_CLUSTER_API_ERROR_ACTION,
  })
  
  