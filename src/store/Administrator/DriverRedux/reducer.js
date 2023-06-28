import {
  SAVE_DRIVER_MASTER_SUCCESS,
  GET_DRIVER_LIST_SUCCESS,
  DELETE_DRIVER_TYPE_ID_SUCCESS,
  EDIT_DRIVER_TYPE_ID_SUCCESS,
  UPDATE_DRIVER_TYPE_ID_SUCCESS,
  SAVE_DRIVER_MASTER,
  UPDATE_DRIVER_TYPE_ID,
  GET_DRIVER_LIST,
  DRIVER_API_ERROR_ACTION,
  DELETE_DRIVER_TYPE_ID,
  EDIT_DRIVER_TYPE_ID
} from "./actionType";

const INIT_STATE = {
  loading: false,
  DriverList: [],
  postMsg: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  deleteMessage: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
}
const DriverReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_DRIVER_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_DRIVER_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,
      }

    case GET_DRIVER_LIST:
      return {
        ...state,
        loading: true,
      }

    case GET_DRIVER_LIST_SUCCESS:
      return {
        ...state,
        DriverList: action.payload,
        loading: false
      }

    case DELETE_DRIVER_TYPE_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
        deleteMsg: action.payload,
      }

    case DELETE_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMsg: action.payload,
      };

    case EDIT_DRIVER_TYPE_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }

    case EDIT_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      };

    case UPDATE_DRIVER_TYPE_ID:
      return {
        ...state,
        saveBtnloading: true,

      };

    case UPDATE_DRIVER_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,
      };

    case DRIVER_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        loading: false
      };

    default:
      return state
  }
}

export default DriverReducer