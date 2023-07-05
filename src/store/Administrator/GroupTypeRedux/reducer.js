import {
  DELETE_GROUP_TYPE_ID,
  DELETE_GROUP_TYPE_ID_SUCCESS,
  EDIT_GROUP_TYPE_ID,
  EDIT_GROUP_TYPE_ID_SUCCESS,
  GET_GROUP_TYPES_LIST,
  GET_GROUP_TYPES_LIST_SUCCESS,
  GROUP_TYPE_API_ERROR_ACTION,
  SAVE_GROUP_TYPE_MASTER,
  SAVE_GROUP_TYPE_MASTER_SUCCESS,
  UPDATE_GROUP_TYPE_ID,
  UPDATE_GROUP_TYPE_ID_SUCCESS
} from "./actionType"

const INIT_STATE = {
  GroupType: [],
  PostData: { Status: false },
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
  listBtnLoading: false,
}

const GroupTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_GROUP_TYPES_LIST:
      return {
        ...state,
        listBtnLoading: true,

      }

    case GET_GROUP_TYPES_LIST_SUCCESS:
      return {
        ...state,
        GroupType: action.payload,
        listBtnLoading: false,

      }

    case SAVE_GROUP_TYPE_MASTER:
      return {
        ...state,
        saveBtnloading: true

      }

    case SAVE_GROUP_TYPE_MASTER_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
        saveBtnloading: false

      }


    case EDIT_GROUP_TYPE_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }

    case EDIT_GROUP_TYPE_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      }

    case UPDATE_GROUP_TYPE_ID:
      return {
        ...state,
        saveBtnloading: true

      }

    case UPDATE_GROUP_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false

      }

    case DELETE_GROUP_TYPE_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
        deleteMessage: action.payload,
      }

    case DELETE_GROUP_TYPE_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMessage: action.payload,
      }

    case GROUP_TYPE_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };


    default:
      return state
  }
}

export default GroupTypeReducer