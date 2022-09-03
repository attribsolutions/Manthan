import {
    GET_METHOD_HANDLER_FOR_VEHICLE_API,
    GET_METHOD_HANDLER_FOR_VEHICLE_API_SUCCESS,
    POST_METHOD_HANDLER_FOR_VEHICLE_API,
    POST_METHOD_HANDLER_FOR_VEHICLE_API_SUCCESS,
    GET_METHOD_HANDLER_FOR_DRIVERLIST_FOR_DROPDOWN,
    GET_METHOD_HANDLER_FOR_DRIVERLIST_FOR_DROPDOWN_SUCCESS,
    GET_METHOD_HANDLER_FOR_VEHICLETYPES_FOR_DROPDOWN,
    GET_METHOD_HANDLER_FOR_VEHICLETYPES_FOR_DROPDOWN_SUCCESS,
    
} from "./actionType";

export const PostMethodForVehicle= (data) => ({
    type: POST_METHOD_HANDLER_FOR_VEHICLE_API,
    data,
  });
 
  export const PostMethod_ForVehicleAPISuccess = (data) => ({
    type: POST_METHOD_HANDLER_FOR_VEHICLE_API_SUCCESS,
    payload: data,
  });
  
  export const getMethodForVehicle = () => ({
    type: GET_METHOD_HANDLER_FOR_VEHICLE_API,
    
  });
  
  export const getMethod_ForVehicleAPISuccess = (data) => ({
    type: GET_METHOD_HANDLER_FOR_VEHICLE_API_SUCCESS,
    payload: data,
  });
    
 //get DriverList API
  export const getMethod_ForDriverList_ForDropDown = () => ({
    type: GET_METHOD_HANDLER_FOR_DRIVERLIST_FOR_DROPDOWN,
    
  });

  export const getMethod_ForDriverList_ForDropDown_Success = (data) => ({
    type: GET_METHOD_HANDLER_FOR_DRIVERLIST_FOR_DROPDOWN_SUCCESS,
    payload:data,
  });

  //get VehicleType API
  export const getMethod_ForVehicleTypes_ForDropDown = () => ({
    type: GET_METHOD_HANDLER_FOR_VEHICLETYPES_FOR_DROPDOWN,
    
  });

  export const getMethod_ForVehicleTypes_ForDropDown_Success = (data) => ({
    type: GET_METHOD_HANDLER_FOR_VEHICLETYPES_FOR_DROPDOWN_SUCCESS,
    payload:data,
  });
