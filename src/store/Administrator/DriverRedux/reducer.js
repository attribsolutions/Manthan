import {
  POST_METHOD_FOR_DRIVER_MASTER_SUCCESS,
  GET_METHOD_FOR_DRIVER_LIST_SUCCESS,
  DELETE_DRIVER_TYPE_ID_SUCCESS,
  EDIT_DRIVER_TYPE_ID_SUCCESS,
  UPDATE_DRIVER_TYPE_ID_SUCCESS
} from "./actionType";

const INIT_STATE = {
  PostDataMessage: { Status: false },
  DriverList: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
}
const DriverReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case POST_METHOD_FOR_DRIVER_MASTER_SUCCESS:
      return {
        ...state,
        PostDataMessage: action.payload,
      }

    case GET_METHOD_FOR_DRIVER_LIST_SUCCESS:
      return {
        ...state,
        DriverList: action.payload,
      }



    case DELETE_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    case EDIT_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };


    case UPDATE_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };

    case "RESET_ALL":
      return state = INIT_STATE;       // <--- blow away form data


    default:
      return state
  }
}

export default DriverReducer