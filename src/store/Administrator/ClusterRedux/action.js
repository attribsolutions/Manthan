import { CLUSTER_API_ERROR_ACTION, DELETE_CLUSTER_ID, DELETE_CLUSTER_ID_SUCCESS, EDIT_CLUSTER_ID, EDIT_CLUSTER_ID_SUCCESS, GET_CLUSTER_LIST, GET_CLUSTER_LIST_SUCCESS, SAVE_CLUSTER_MASTER, SAVE_CLUSTER_MASTER_SUCCESS, UPDATE_CLUSTER_ID, UPDATE_CLUSTER_ID_SUCCESS } from "./actionType";

    
  export const getClusterlist = () => ({// get List Action
    type: GET_CLUSTER_LIST,
  });
  
  export const getClusterlistSuccess = (pages) => ({// get List success
    type: GET_CLUSTER_LIST_SUCCESS,
    payload: pages,
  });
  
  export const saveClusterMaster = (config = {}) => ({// save Action
    type: SAVE_CLUSTER_MASTER,
    config,
  });
  
  export const saveClusterMaster_Success = (resp) => ({// Save  success
    type: SAVE_CLUSTER_MASTER_SUCCESS,
    payload: resp,
  });
  
  export const editClusterID = (config = {}) => ({ // Edit Action 
    type: EDIT_CLUSTER_ID,
    config,
  });
  
  export const editClusterIDSuccess = (editData) => ({// Edit  Success
    type: EDIT_CLUSTER_ID_SUCCESS,
    payload: editData,
  });
  
  export const updateClusterID = (config = {}) => ({// update  Action
    type: UPDATE_CLUSTER_ID,
    config,
  });
  
  export const updateClusterIDSuccess = (resp) => ({ //Update Success
    type: UPDATE_CLUSTER_ID_SUCCESS,
    payload: resp,
  })
  
  export const delete_Cluster_ID = (config = {}) => ({// Delete  Action
    type: DELETE_CLUSTER_ID,
    config,
  });
  
  export const deleteClusterIDSuccess = (resp) => ({// Delete Success
    type: DELETE_CLUSTER_ID_SUCCESS,
    payload: resp
  });
  
  
  export const ClusterApiErrorAction = () => ({
    type: CLUSTER_API_ERROR_ACTION,
  })
  
  