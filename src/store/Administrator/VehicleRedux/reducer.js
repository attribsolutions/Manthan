import {
  SAVE_VEHICLE_MASTER_SUCCESS,
  GET_VEHICLE_LIST_SUCCESS,
  GET_VEHICLE_TYPES_FOR_DROPDOWN_SUCCESS,
  DELETE_VEHICLE_ID_SUCCESS,
  EDIT_VEHICLE_ID_SUCCESS,
  UPDATE_VEHICLE_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {
  VehicleList: [],
  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  VehicleTypes: [],
}
const VehicleReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_VEHICLE_LIST_SUCCESS:
      return {
        ...state,
        VehicleList: action.payload,
      }

    case SAVE_VEHICLE_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case DELETE_VEHICLE_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };

    case EDIT_VEHICLE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    case UPDATE_VEHICLE_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      };

    case GET_VEHICLE_TYPES_FOR_DROPDOWN_SUCCESS:
      return {
        ...state,
        VehicleTypes: action.payload,
      }

    default:
      return state
  }
}

export default VehicleReducer