import {
  DELETE_GROUP_TYPE_ID_SUCCESS,
  EDIT_GROUP_TYPE_ID_SUCCESS,
  GET_GROUP_TYPES_LIST_SUCCESS,
  SAVE_GROUP_TYPE_MASTER_SUCCESS,
  UPDATE_GROUP_TYPE_ID_SUCCESS
} from "./actionType"

const INIT_STATE = {
  GroupType: [],
  PostData: { Status: false },
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
}

const GroupTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_GROUP_TYPES_LIST_SUCCESS:
      return {
        ...state,
        GroupType: action.payload,
      }

    case SAVE_GROUP_TYPE_MASTER_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
      }

    case EDIT_GROUP_TYPE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case UPDATE_GROUP_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      }

    case DELETE_GROUP_TYPE_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      }
    default:
      return state
  }
}

export default GroupTypeReducer