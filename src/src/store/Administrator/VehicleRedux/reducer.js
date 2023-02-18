import {
  POST_METHOD_FOR_VEHICLE_MASTER_SUCCESS,
  GET_METHOD_FOR_VEHICLE_LIST_SUCCESS,
  GET_METHOD_DRIVERLIST_FOR_DROPDOWN_SUCCESS,
  GET_METHOD_VEHICLETYPES_FOR_DROPDOWN_SUCCESS,
  DELETE_VEHICLE_TYPE_ID_SUCCESS,
  EDIT_VEHICLE_TYPE_ID_SUCCESS,
  UPDATE_VEHICLE_TYPE_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  VehicleList: [],
  DriverList: [],
  VehicleTypes:[],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
}
const VehicleReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case POST_METHOD_FOR_VEHICLE_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case GET_METHOD_FOR_VEHICLE_LIST_SUCCESS:
      return {
        ...state,
        VehicleList: action.payload,
      }

    case GET_METHOD_DRIVERLIST_FOR_DROPDOWN_SUCCESS:
      return {
        ...state,
        DriverList: action.payload,
      }

    case GET_METHOD_VEHICLETYPES_FOR_DROPDOWN_SUCCESS:
      return {
        ...state,
        VehicleTypes: action.payload,
      }

      case DELETE_VEHICLE_TYPE_ID_SUCCESS:
        return {
          ...state,
          deleteMsg: action.payload,
        };
  
      case EDIT_VEHICLE_TYPE_ID_SUCCESS:
        return {
          ...state,
          editData: action.payload,
        };
  
      
      case UPDATE_VEHICLE_TYPE_ID_SUCCESS:
        return {
          ...state,
          updateMsg: action.payload,
        };


    default:
      return state
  }
}

export default VehicleReducer