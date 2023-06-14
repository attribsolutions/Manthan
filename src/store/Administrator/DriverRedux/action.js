import {
  SAVE_DRIVER_MASTER,
  SAVE_DRIVER_MASTER_SUCCESS,
  GET_DRIVER_LIST,
  GET_DRIVER_LIST_SUCCESS,
  DELETE_DRIVER_TYPE_ID,
  DELETE_DRIVER_TYPE_ID_SUCCESS,
  EDIT_DRIVER_TYPE_ID,
  EDIT_DRIVER_TYPE_ID_SUCCESS,
  UPDATE_DRIVER_TYPE_ID,
  UPDATE_DRIVER_TYPE_ID_SUCCESS,
  DRIVER_API_ERROR_ACTION
} from "./actionType";

export const getDriverList = (jsonBody) => ({ //get action
  type: GET_DRIVER_LIST,
  jsonBody,
});

export const getDriverListSuccess = (resp) => ({ // get Success
  type: GET_DRIVER_LIST_SUCCESS,
  payload: resp,
});

export const saveDriverMaster = (config = {}) => ({ // post action
  type: SAVE_DRIVER_MASTER,
  config,
});

export const saveDriverMasterSuccess = (resp) => ({ // post success
  type: SAVE_DRIVER_MASTER_SUCCESS,
  payload: resp,
});

export const editDriverID = (config = {}) => ({// edit action
  type: EDIT_DRIVER_TYPE_ID,
  config,
})

export const editDriverID_Success = (resp) => ({ // edit success
  type: EDIT_DRIVER_TYPE_ID_SUCCESS,
  payload: resp,
})

export const updateDriverID = (config = {}) => ({ // update action
  type: UPDATE_DRIVER_TYPE_ID,
  config,
})

export const updateDriverID_Success = (resp) => ({ // update success
  type: UPDATE_DRIVER_TYPE_ID_SUCCESS,
  payload: resp,
})

export const deleteDriverID = (config = {}) => ({ // delete action
  type: DELETE_DRIVER_TYPE_ID,
  config,
});

export const deleteDriverID_Success = (resp) => ({// delete success
  type: DELETE_DRIVER_TYPE_ID_SUCCESS,
  payload: resp
});

export const DriverApiErrorAction = () => ({
  type: DRIVER_API_ERROR_ACTION,
})
