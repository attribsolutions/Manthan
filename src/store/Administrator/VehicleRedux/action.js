import {
  SAVE_VEHICLE_MASTER,
  SAVE_VEHICLE_MASTER_SUCCESS,
  GET_VEHICLE_LIST,
  GET_VEHICLE_LIST_SUCCESS,
  GET_VEHICLE_TYPES_FOR_DROPDOWN,
  GET_VEHICLE_TYPES_FOR_DROPDOWN_SUCCESS,
  DELETE_VEHICLE_ID,
  DELETE_VEHICLE_ID_SUCCESS,
  EDIT_VEHICLE_ID,
  EDIT_VEHICLE_ID_SUCCESS,
  UPDATE_VEHICLE_ID,
  UPDATE_VEHICLE_ID_SUCCESS,
  VEHICLE_API_ERROR_ACTION
} from "./actionType";

export const saveVehicleMaster = (config = {}) => ({  // Post Action
  type: SAVE_VEHICLE_MASTER,
  config,
});

export const saveVehicleMasterSuccess = (resp) => ({  // Post Success
  type: SAVE_VEHICLE_MASTER_SUCCESS,
  payload: resp,
});

export const getVehicleList = (jsonBody) => ({  // get action
  type: GET_VEHICLE_LIST,
  jsonBody,
});

export const getVehicleListSuccess = (resp) => ({   // get Success
  type: GET_VEHICLE_LIST_SUCCESS,
  payload: resp,
});

export const editVehicleID = (config = {}) => ({  // edit action
  type: EDIT_VEHICLE_ID,
  config,
})

export const editVehicleID_Success = (editData) => ({  // edit Success
  type: EDIT_VEHICLE_ID_SUCCESS,
  payload: editData,
})

export const updateVehicleID = (config = {}) => ({  // update action
  type: UPDATE_VEHICLE_ID,
  config,
})

export const updateVehicleID_Success = (updateMessage) => ({  // update success
  type: UPDATE_VEHICLE_ID_SUCCESS,
  payload: updateMessage,
})

export const deleteVehicleID = (config = {}) => ({  // delete action
  type: DELETE_VEHICLE_ID,
  config,
});
export const deleteVehicleID_Success = (resp) => ({  // delete success
  type: DELETE_VEHICLE_ID_SUCCESS,
  payload: resp
});

export const getVehicleType_for_dropdown = () => ({  // get api for Vehicle type
  type: GET_VEHICLE_TYPES_FOR_DROPDOWN,
});

export const getVehicleType_for_dropdown_Success = (resp) => ({ // get Success
  type: GET_VEHICLE_TYPES_FOR_DROPDOWN_SUCCESS,
  payload: resp,
});

export const VehicleErrorAction = () => ({
  type: VEHICLE_API_ERROR_ACTION,
})
