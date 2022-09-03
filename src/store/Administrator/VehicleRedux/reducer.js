import {
    POST_METHOD_HANDLER_FOR_VEHICLE_API_SUCCESS,
    GET_METHOD_HANDLER_FOR_VEHICLE_API_SUCCESS,
    GET_METHOD_HANDLER_FOR_DRIVERLIST_FOR_DROPDOWN_SUCCESS,
    GET_METHOD_HANDLER_FOR_VEHICLETYPES_FOR_DROPDOWN_SUCCESS,
    
  } from "./actionType";

  const INIT_STATE = {
    PostDataMessage: { Status: false },
    VehicleListAPI: []
    
     
 }
 const  VehicleReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_METHOD_HANDLER_FOR_VEHICLE_API_SUCCESS:
        return {
          ...state,
          PostDataMessage: action.payload,
        }
  
      case GET_METHOD_HANDLER_FOR_VEHICLE_API_SUCCESS:
        return {
          ...state,
          VehicleListAPI: action.payload,
        }

        case GET_METHOD_HANDLER_FOR_DRIVERLIST_FOR_DROPDOWN_SUCCESS:
            return {
              ...state,
              DriverList: action.payload,
            }

            case  GET_METHOD_HANDLER_FOR_VEHICLETYPES_FOR_DROPDOWN_SUCCESS:
                return {
                  ...state,
                  VehicleTypes: action.payload,
                }
               

        default:
            return state
        }
      }
      
      export default  VehicleReducer