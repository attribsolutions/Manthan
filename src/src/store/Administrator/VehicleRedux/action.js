import {
     POST_METHOD_FOR_VEHICLE_MASTER,
     POST_METHOD_FOR_VEHICLE_MASTER_SUCCESS,
     GET_METHOD_FOR_VEHICLE_LIST,
     GET_METHOD_FOR_VEHICLE_LIST_SUCCESS,
     GET_METHOD_DRIVERLIST_FOR_DROPDOWN,
     GET_METHOD_DRIVERLIST_FOR_DROPDOWN_SUCCESS,
     GET_METHOD_VEHICLETYPES_FOR_DROPDOWN,
     GET_METHOD_VEHICLETYPES_FOR_DROPDOWN_SUCCESS,
     DELETE_VEHICLE_TYPE_ID,
    DELETE_VEHICLE_TYPE_ID_SUCCESS,
   EDIT_VEHICLE_TYPE_ID,
   EDIT_VEHICLE_TYPE_ID_SUCCESS,
   UPDATE_VEHICLE_TYPE_ID,
   UPDATE_VEHICLE_TYPE_ID_SUCCESS
    
} from "./actionType";

export const PostMethodForVehicleMaster= (data) => ({
    type: POST_METHOD_FOR_VEHICLE_MASTER,
    data,
  });
 
  export const PostMethod_ForVehicleMasterSuccess = (data) => ({
    type: POST_METHOD_FOR_VEHICLE_MASTER_SUCCESS,
    payload: data,
  });
  
  export const getMethodForVehicleList = () => ({
    type: GET_METHOD_FOR_VEHICLE_LIST,
    
  });
  
  export const getMethod_ForVehicleListSuccess = (data) => ({
    type: GET_METHOD_FOR_VEHICLE_LIST_SUCCESS,
    payload: data,
  });
    
 //get DriverList API
  export const getMethod_DriverList_ForDropDown = () => ({
    type: GET_METHOD_DRIVERLIST_FOR_DROPDOWN,
    
  });

  export const getMethod_DriverList_ForDropDown_Success = (data) => ({
    type: GET_METHOD_DRIVERLIST_FOR_DROPDOWN_SUCCESS,
    payload:data,
  });

  //get VehicleType API
  export const getMethod_VehicleTypes_ForDropDown = () => ({
    type: GET_METHOD_VEHICLETYPES_FOR_DROPDOWN,
    
  });

  export const getMethod_VehicleTypes_ForDropDown_Success = (data) => ({
    type: GET_METHOD_VEHICLETYPES_FOR_DROPDOWN_SUCCESS,
    payload:data,
  });

  ////delete api
export const delete_VehicleType_ID = (id) => ({
  type: DELETE_VEHICLE_TYPE_ID,
  id,

});
export const deleteVehicleTypeIDSuccess = (deleteMessage) => ({
  type: DELETE_VEHICLE_TYPE_ID_SUCCESS,
  payload: deleteMessage
});

// edit api
export const editVehicleTypeId = (id,pageMode) => ({
  type: EDIT_VEHICLE_TYPE_ID,
  id,pageMode
})
export const editVehicleTypeSuccess = (editData) => ({
  type: EDIT_VEHICLE_TYPE_ID_SUCCESS,
  
  payload: editData,
})

// update api
export const updateVehicleTypeID = (updateData, ID) => ({
  type: UPDATE_VEHICLE_TYPE_ID,
  updateData, ID,
})
export const updateVehicleTypeIDSuccess = (updateMessage) => ({
  type: UPDATE_VEHICLE_TYPE_ID_SUCCESS,
  payload: updateMessage,
})