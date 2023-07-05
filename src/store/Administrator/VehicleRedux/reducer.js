import {
  SAVE_VEHICLE_MASTER_SUCCESS,
  GET_VEHICLE_LIST_SUCCESS,
  GET_VEHICLE_TYPES_FOR_DROPDOWN_SUCCESS,
  DELETE_VEHICLE_ID_SUCCESS,
  EDIT_VEHICLE_ID_SUCCESS,
  UPDATE_VEHICLE_ID_SUCCESS,
  SAVE_VEHICLE_MASTER,
  UPDATE_VEHICLE_ID,
  GET_VEHICLE_LIST,
  VEHICLE_API_ERROR_ACTION,
  DELETE_VEHICLE_ID,
  EDIT_VEHICLE_ID
} from "./actionType";

const INIT_STATE = {
  loading: false,
  VehicleList: [],
  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  VehicleTypes: [],
  saveBtnloading: false,
  listBtnLoading: false,
}
const VehicleReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_VEHICLE_LIST:
      return {
        ...state,
        loading: true,

      }

    case GET_VEHICLE_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        VehicleList: action.payload,

      }

    case SAVE_VEHICLE_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_VEHICLE_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      }

    case DELETE_VEHICLE_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case DELETE_VEHICLE_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      };

    case EDIT_VEHICLE_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_VEHICLE_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    case UPDATE_VEHICLE_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_VEHICLE_ID_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,

      };

    case GET_VEHICLE_TYPES_FOR_DROPDOWN_SUCCESS:
      return {
        ...state,
        VehicleTypes: action.payload,
      }

    case VEHICLE_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        loading: false,
      };


    default:
      return state
  }
}

export default VehicleReducer